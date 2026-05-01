// STH Piling Dashboard — service worker
// Caches the dashboard so it keeps running if the network drops.

const CACHE_NAME = 'sth-dashboard-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png',
  'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700;900&family=JetBrains+Mono:wght@400;500;700&display=swap',
];

// On install — pre-cache the core assets.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use addAll but ignore failures on individual assets (e.g. fonts CDN)
      return Promise.allSettled(ASSETS.map((url) => cache.add(url)));
    }).then(() => self.skipWaiting())
  );
});

// On activate — clean up old caches.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// On fetch — try network first (so updates appear), fall back to cache.
// data.json is always network-only so dashboard data stays fresh.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Always go to network for data.json — never serve stale data.
  if (url.pathname.endsWith('/data.json') || url.pathname.endsWith('data.json')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses for offline use
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match('./index.html')))
  );
});
