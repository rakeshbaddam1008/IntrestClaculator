const CACHE_NAME = 'interest-pwa-v1';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/src/calc.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  // navigation requests: network-first with fallback to cached index.html
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        return res;
      }).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // static resources: cache-first
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(networkRes => {
      // optionally cache it
      if (req.method === 'GET' && networkRes && networkRes.status === 200 && networkRes.type !== 'opaque') {
        caches.open(CACHE_NAME).then(cache => cache.put(req, networkRes.clone()));
      }
      return networkRes;
    })).catch(() => {})
  );
});