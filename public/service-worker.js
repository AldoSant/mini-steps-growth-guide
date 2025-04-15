
// Service Worker para MiniPassos PWA
const CACHE_NAME = 'minipassos-cache-v5';
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
  const cacheWhitelist = [CACHE_NAME, 'diary-entries-sync', 'medical-data-sync'];
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

// Helper functions for improved readability and maintenance
function isApiOrDynamicRequest(url) {
  return url.href.includes('supabase.co') || 
         url.pathname.startsWith('/api/') || 
         url.searchParams.has('_data');
}

function isNavigationRequest(request) {
  return request.mode === 'navigate' && 
         request.destination === 'document';
}

function isStaticAsset(url) {
  return url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|ico|woff2?)$/) || 
         ADDITIONAL_ASSETS.includes(url.pathname);
}

function isOfflineStorageRequest(url) {
  return url.pathname.startsWith('/__offline/');
}

// Improved fetch event handling with better organization
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  
  // Don't intercept these requests
  if (event.request.method !== 'GET' || isApiOrDynamicRequest(requestUrl)) {
    return;
  }
  
  // Special handling for navigation requests (HTML pages)
  if (isNavigationRequest(event.request)) {
    event.respondWith(
      networkWithCacheFallbackAndOffline(event.request)
    );
    return;
  }
  
  // For static assets, use stale-while-revalidate
  if (isStaticAsset(requestUrl)) {
    event.respondWith(
      staleWhileRevalidate(event.request)
    );
    return;
  }
  
  // Handle offline storage requests
  if (isOfflineStorageRequest(requestUrl)) {
    event.respondWith(caches.match(event.request));
    return;
  }
  
  // For all other requests, try network first with cache fallback
  event.respondWith(
    networkWithCacheFallback(event.request)
  );
});

// Network-first strategy with offline fallback for HTML
async function networkWithCacheFallbackAndOffline(request) {
  try {
    const networkResponse = await fetch(request);
    const responseToCache = networkResponse.clone();
    
    // Store in cache if valid
    if (networkResponse && networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, responseToCache);
    }
    
    return networkResponse;
  } catch (error) {
    // If offline, try to return from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If no cached version, return offline page
    return caches.match(OFFLINE_URL);
  }
}

// Network first with cache fallback for non-HTML
async function networkWithCacheFallback(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Store in cache if valid
    if (networkResponse && networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // If offline, try to return from cache
    return caches.match(request);
  }
}

// Stale-while-revalidate for static assets
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  // Return cached response immediately if available
  if (cachedResponse) {
    // Update cache in background
    updateCache(request);
    return cachedResponse;
  }
  
  // If not in cache, fetch from network
  const networkResponsePromise = fetch(request);
  
  try {
    const networkResponse = await networkResponsePromise;
    
    // Cache the new response for next time
    if (networkResponse && networkResponse.ok) {
      const clonedResponse = networkResponse.clone();
      caches.open(CACHE_NAME).then(cache => {
        cache.put(request, clonedResponse);
        notifyClientsOfUpdate(request.url);
      });
    }
    
    return networkResponse;
  } catch (error) {
    // If fetch fails and nothing in cache, return a simple error response
    return new Response('Recurso indisponível no momento', { 
      status: 408, 
      headers: new Headers({ 'Content-Type': 'text/plain' })
    });
  }
}

// Update cache in background
async function updateCache(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, networkResponse);
      notifyClientsOfUpdate(request.url);
    }
  } catch (error) {
    console.log('Falha ao atualizar cache em segundo plano:', error);
  }
}

// Notify clients about cache updates
function notifyClientsOfUpdate(url) {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'CACHE_UPDATED',
        url: url
      });
    });
  });
}

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

// Improved sync event handling
self.addEventListener('sync', function(event) {
  console.log('Background sync event:', event.tag);
  
  if (event.tag.startsWith('sync-')) {
    const cacheName = event.tag.replace('sync-', '');
    event.waitUntil(performSync(cacheName));
  }
});

// Improved sync function with better error handling and retry logic
async function performSync(cacheName) {
  console.log(`Sincronizando dados do cache: ${cacheName}`);
  
  try {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    let successCount = 0;
    let failCount = 0;
    
    if (requests.length === 0) {
      console.log(`Nenhum dado para sincronizar em ${cacheName}`);
      return;
    }
    
    console.log(`Encontrados ${requests.length} itens para sincronizar`);
    
    for (const request of requests) {
      try {
        // Extrair o ID do caminho da requisição
        const pathParts = new URL(request.url).pathname.split('/');
        const itemId = pathParts[pathParts.length - 1];
        
        // Recuperar os dados do cache
        const response = await cache.match(request);
        if (!response) continue;
        
        const data = await response.json();
        console.log(`Sincronizando item ${itemId}:`, data);
        
        // Determinar o endpoint da API com base no nome do cache
        let endpoint = '';
        switch (cacheName) {
          case 'diary-entries-sync':
            endpoint = '/api/diary-entries';
            break;
          case 'medical-data-sync':
            endpoint = '/api/medical-data';
            break;
          default:
            endpoint = `/api/${cacheName}`;
        }
        
        // Enviar para o servidor
        const serverResponse = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            _syncId: itemId,
            _syncTimestamp: new Date().toISOString()
          })
        });
        
        if (serverResponse.ok) {
          // Se o envio foi bem-sucedido, remova do cache
          await cache.delete(request);
          successCount++;
          console.log(`Sincronização bem-sucedida para ${itemId}`);
        } else {
          failCount++;
          console.error(`Falha na sincronização para ${itemId}: ${serverResponse.status}`);
          
          // Se for um erro permanente (4xx), podemos querer remover do cache
          // ou marcar como erro para evitar tentativas infinitas
          if (serverResponse.status >= 400 && serverResponse.status < 500) {
            await cache.delete(request);
          }
        }
      } catch (err) {
        failCount++;
        console.error(`Erro ao processar item para sincronização:`, err);
      }
    }
    
    console.log(`Sincronização concluída para ${cacheName}: ${successCount} sucessos, ${failCount} falhas`);
    
    // Notificar todos os clientes sobre o resultado da sincronização
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'SYNC_COMPLETED',
          cache: cacheName,
          success: successCount,
          failed: failCount
        });
      });
    });
    
  } catch (err) {
    console.error(`Erro ao sincronizar ${cacheName}:`, err);
    throw err; // Rethrow para que o sistema de sincronização possa tentar novamente
  }
}

// Evento de remoção e atualização do service worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
