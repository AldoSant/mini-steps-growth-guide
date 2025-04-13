
// Service Worker para MiniPassos PWA
const CACHE_NAME = 'minipassos-cache-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  '/maskable_icon.png'
];

// Install event - caches app shell resources
self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cacheando arquivos');
        return cache.addAll(urlsToCache);
      })
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
    }).then(() => self.clients.claim()) // Take control of clients immediately
  );
});

// Fetch event - network-first strategy with cache fallback
self.addEventListener('fetch', (event) => {
  event.respondWith(
    // Try network first
    fetch(event.request)
      .then((response) => {
        // Check if we received a valid response
        if(!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseToCache);
          });

        return response;
      })
      .catch(() => {
        // If network fails, try to get it from cache
        console.log('Service Worker: Usando cache para', event.request.url);
        return caches.match(event.request);
      })
  );
});

// Push event - handle notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push recebido');
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'MiniPassos';
  
  const options = {
    body: data.body || 'Nova notificação do MiniPassos',
    icon: './logo192.png',
    badge: './favicon.ico',
    vibrate: [100, 50, 100]
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notificação clicada');
  
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});
