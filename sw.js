/* ==========================================================================
   PLACEMENTHUB SERVICE WORKER — Network-First Strategy for Instant Updates
   ========================================================================== */

const CACHE_NAME = 'placementhub-v5';
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

// Install: cache core assets and skip waiting
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS);
    })
  );
});

// Activate: instantly remove any older cache versions and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: NETWORK FIRST with offline cache fallback
self.addEventListener('fetch', (event) => {
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
      })
  );
});
