const CACHE = 'soulfull-v2';
const ASSETS = ['/', '/index.html', '/manifest.json', '/sw.js', '/icon.svg'];

// Install: cache all assets
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

// Activate: delete any old caches
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

// Fetch: network-first for HTML (so updates come through), cache-first for everything else
self.addEventListener('fetch', e => {
  const isHTML = e.request.headers.get('accept')?.includes('text/html');
  if (isHTML) {
    // Always try network first so new deployments are picked up immediately
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
  } else {
    // Cache-first for assets (icons, manifest, sw itself)
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    );
  }
});
