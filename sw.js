/* ==========================================================================
   PLACEMENTHUB SERVICE WORKER — Offline-First Caching
   ========================================================================== */

const CACHE_NAME = 'placementhub-v1';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/css/main.css',
  '/css/player.css',
  '/css/toolkit.css',
  '/css/components.css',
  '/css/style.css',
  '/css/responsive.css',
  '/js/data.js',
  '/js/practiceData.js',
  '/js/player.js',
  '/js/playlistManager.js',
  '/js/notesManager.js',
  '/js/practiceManager.js',
  '/js/pomodoro.js',
  '/js/app.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon.svg',
  '/manifest.json'
];

// Install: cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests (YouTube API, etc.)
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // Cache successful GET responses
        if (response && response.status === 200 && event.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // If offline and no cache, return the app shell
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
