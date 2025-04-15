
// Service Worker para MiniPassos PWA
const CACHE_NAME = 'minipassos-cache-v4';
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

// Improved fetch strategy - stale-while-revalidate for most resources
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests or API calls
  if (
    !event.request.url.startsWith(self.location.origin) || 
    event.request.url.includes('/supabase/')
  ) {
    return;
  }

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // For HTML navigations, use network-first strategy
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache a copy of the response
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clonedResponse);
          });
          return response;
        })
        .catch(() => {
          // If network fetch fails, try to return from cache
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // If no cached version, fall back to offline page
              return caches.match('/');
            });
        })
    );
    return;
  }

  // For all other requests, use stale-while-revalidate
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        const fetchPromise = fetch(event.request)
          .then(networkResponse => {
            // Update cache with fresh data
            if (networkResponse && networkResponse.ok) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(error => {
            console.error('Fetch failed:', error);
            // Return any error without crashing
            return new Response('Network error', {
              status: 408,
              headers: new Headers({ 'Content-Type': 'text/plain' }),
            });
          });

        // Return cached response immediately if available, otherwise wait for network
        return cachedResponse || fetchPromise;
      });
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
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click event with custom URL handling
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notificação clicada');
  
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({type: 'window'}).then(clientList => {
      // Check if there's already a window open
      const hadWindowToFocus = clientList.some(client => {
        // If we already have a window with our app open, focus it
        return client.url.startsWith(self.location.origin) && 'focus' in client && client.focus();
      });
      
      // If no window is already open, open one with the target URL
      if (!hadWindowToFocus) {
        // Use the notification data URL if provided, otherwise default to root
        const urlToOpen = event.notification.data && event.notification.data.url ? 
                          event.notification.data.url : '/';
                          
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Handle offline fallback
self.addEventListener('fetch', (event) => {
  // Only for HTML navigations that fail
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match('/offline.html')
            .then(response => response || caches.match('/'));
        })
    );
  }
});
