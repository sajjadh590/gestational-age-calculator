const CACHE_NAME = 'ob-gyn-assistant-cache-v1';
// List of files to cache, including the app shell and critical CDN resources.
const urlsToCache = [
  '/',
  '/index.html',
  // Local assets that would be requested by the browser
  '/index.tsx',
  '/App.tsx',
  '/i18n.ts',
  '/types.ts',
  '/constants.ts',
  '/components/GACalculator.tsx',
  '/components/Dashboard.tsx',
  '/components/PatientManager.tsx',
  '/components/Timeline.tsx',
  '/components/CarePlan.tsx',
  '/components/Charting.tsx',
  '/components/ErrorBoundary.tsx',
  '/services/calendarService.ts',
  '/services/clinicalEngine.ts',
  '/services/datingService.ts',
  // Crucial CDN assets that need to be cached for offline use
  'https://cdn.tailwindcss.com/',
  'https://unpkg.com/jalaali-js/dist/jalaali.js',
  'https://aistudiocdn.com/react@^19.2.0',
  'https://aistudiocdn.com/react-dom@^19.2.0/'
];

// Install event: open a cache and add the core assets to it.
self.addEventListener('install', event => {
  self.skipWaiting(); // Activate worker immediately
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching core assets');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Failed to cache core assets:', err);
      })
  );
});

// Activate event: clean up old caches to ensure the user has the latest version.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => self.clients.claim()) // Take control of all open clients
  );
});

// Fetch event: serve assets from cache first (offline-first strategy).
self.addEventListener('fetch', event => {
  // We only want to handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Cache hit - return response from cache
        if (cachedResponse) {
          return cachedResponse;
        }

        // Not in cache - fetch from network, and cache it for next time.
        return fetch(event.request).then(
          networkResponse => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }

            // Clone the response because it's a stream that can only be consumed once.
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        ).catch(error => {
            console.error('Fetching from network failed:', error);
            // You could optionally return a fallback offline page here if needed.
        });
      })
  );
});
