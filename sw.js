const CACHE_NAME = 'erinn-time-v2';
const PRECACHE_FILES = [
  'index.html',
  'time.js',
  'time.css',
  'manifest.json',
  'Erinn-Time.png',
  'Erinn-Time-192.png',
  'favicon.ico'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(PRECACHE_FILES);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .filter(cacheName => cacheName.startsWith('erinn-time-') && cacheName !== CACHE_NAME)
        .map(cacheName => caches.delete(cacheName))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(event.request);

    if (cachedResponse) {
      return cachedResponse;
    }

    try {
      const fetchResponse = await fetch(event.request);
      if (fetchResponse.ok) {
        await cache.put(event.request, fetchResponse.clone());
      }
      return fetchResponse;
    } catch (error) {
      return Response.error();
    }
  })());
});
