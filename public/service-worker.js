
// Service Worker para MiniPassos PWA
const CACHE_NAME = 'minipassos-cache-v4';
const OFFLINE_URL = '/offline.html';

// Recursos para cache imediato durante a instalação
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  '/maskable_icon.png'
];

// Recursos estáticos importantes adicionais para cache
const ADDITIONAL_ASSETS = [
  // Fontes
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&display=swap',
  
  // Rotas principais
  '/dashboard',
  '/diario',
  '/atividades',
  '/biblioteca',
  '/perfil'
];

// Install event - caches app shell resources
self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME)
        .then((cache) => {
          console.log('Service Worker: Cacheando arquivos principais');
          return cache.addAll(CORE_ASSETS);
        }),
      
      // Pré-carrega a página offline especificamente
      fetch(OFFLINE_URL)
        .then(response => {
          return caches.open(CACHE_NAME)
            .then(cache => {
              return cache.put(OFFLINE_URL, response);
            });
        })
    ])
    .then(() => self.skipWaiting()) // Forces waiting SW to become active
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Ativado');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deletando cache obsoleto', cacheName);
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
    .then(() => {
      console.log('Service Worker: Reivindicando controle dos clientes');
      return self.clients.claim();
    })
    .then(() => {
      // Cache adicional após ativação para não atrasar a instalação
      return caches.open(CACHE_NAME).then(cache => {
        console.log('Service Worker: Cacheando recursos adicionais');
        return cache.addAll(ADDITIONAL_ASSETS);
      });
    })
  );
});

// Estratégia network-first para API, stale-while-revalidate para todos os outros recursos
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Não interceptar chamadas de API do Supabase - deixe passar direto
  if (requestUrl.href.includes('supabase.co') || event.request.method !== 'GET') {
    return;
  }
  
  // Para navegação HTML, use network-first strategy com fallback para offline page
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Armazene em cache uma cópia da resposta
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // Se o fetch falhar, tente retornar do cache
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Se não houver versão em cache, retorne a página offline
              console.log('Service Worker: Servindo página offline');
              return caches.match(OFFLINE_URL);
            });
        })
    );
    return;
  }
  
  // Para recursos estáticos, use stale-while-revalidate
  if (
    requestUrl.pathname.match(/\.(js|css|png|jpg|jpeg|svg|ico|woff2?)$/) ||
    ADDITIONAL_ASSETS.includes(requestUrl.pathname)
  ) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          // Tenta obter do cache primeiro enquanto atualiza o cache em segundo plano
          const fetchPromise = fetch(event.request)
            .then(networkResponse => {
              // Se a resposta for válida, atualize o cache
              if (networkResponse && networkResponse.ok) {
                const clonedResponse = networkResponse.clone();
                caches.open(CACHE_NAME).then(cache => {
                  cache.put(event.request, clonedResponse);
                });
              }
              return networkResponse;
            })
            .catch(error => {
              console.log('Fetch falhou:', error);
              return new Response('Erro de rede', {
                status: 408,
                headers: new Headers({ 'Content-Type': 'text/plain' }),
              });
            });

          return cachedResponse || fetchPromise;
        })
    );
    return;
  }
  
  // Para todos os outros recursos, tente network primeiro com fallback para cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Válido apenas para respostas bem-sucedidas (status 200-299)
        if (response && response.ok) {
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clonedResponse);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// Push event - handle notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push recebido');
  
  if (!event.data) {
    console.log('Push sem dados recebido');
    return;
  }
  
  try {
    const data = event.data.json();
    const title = data.title || 'MiniPassos';
    
    const options = {
      body: data.body || 'Nova notificação do MiniPassos',
      icon: './logo192.png',
      badge: './favicon.ico',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/',
        timestamp: new Date().getTime()
      },
      actions: data.actions || [
        { action: 'view', title: 'Ver' },
        { action: 'close', title: 'Fechar' }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  } catch (e) {
    console.error('Erro ao processar notificação push:', e);
  }
});

// Notification click event with custom URL handling
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notificação clicada');
  
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }
  
  const urlToOpen = event.notification.data && event.notification.data.url ? 
                   event.notification.data.url : '/';
  
  event.waitUntil(
    clients.matchAll({type: 'window', includeUncontrolled: true}).then(clientList => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          client.postMessage({
            type: 'NOTIFICATION_CLICK',
            url: urlToOpen
          });
          return client.focus();
        }
      }
      
      // If no window is already open, open one with the target URL
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Evento de sincronização em segundo plano
self.addEventListener('sync', function(event) {
  if (event.tag === 'sync-diary-entries') {
    event.waitUntil(syncDiaryEntries());
  } else if (event.tag === 'sync-medical-data') {
    event.waitUntil(syncMedicalData());
  }
});

// Simula funcionalidade de envio de cache para sincronização
async function syncDiaryEntries() {
  try {
    const cache = await caches.open('diary-entries-sync');
    const requests = await cache.keys();
    
    for (const request of requests) {
      try {
        const response = await cache.match(request);
        const data = await response.json();
        
        // Aqui tentaríamos enviar os dados para o servidor
        const serverResponse = await fetch('/api/diary-entries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        if (serverResponse.ok) {
          // Se o envio foi bem-sucedido, remova do cache
          await cache.delete(request);
        }
      } catch (err) {
        console.error('Erro ao processar entrada do diário:', err);
      }
    }
  } catch (err) {
    console.error('Erro ao sincronizar entradas do diário:', err);
  }
}

async function syncMedicalData() {
  // Similar ao syncDiaryEntries, mas para dados médicos
  console.log('Sincronizando dados médicos...');
}

// Evento de remoção
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
