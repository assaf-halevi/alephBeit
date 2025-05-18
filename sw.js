// Cache name
const CACHE_NAME = 'image-sound-game-v1';

// Files to pre-cache (for offline support)
const FILES_TO_CACHE = [
  'index.html',
  'icon.png',
  'icon-512.png',
  'manifest.json',
  // Images A-Z
  'A.png','B.png','C.png','D.png','E.png','F.png','G.png','H.png','I.png','J.png',
  'K.png','L.png','M.png','N.png','O.png','P.png','Q.png','R.png','S.png','T.png',
  'U.png','V.png','W.png','X.png','Y.png','Z.png',
  // Sounds A-Z
  'A.mp3','B.mp3','C.mp3','D.mp3','E.mp3','F.mp3','G.mp3','H.mp3','I.mp3','J.mp3',
  'K.mp3','L.mp3','M.mp3','N.mp3','O.mp3','P.mp3','Q.mp3','R.mp3','S.mp3','T.mp3',
  'U.mp3','V.mp3','W.mp3','X.mp3','Y.mp3','Z.mp3'
];

// Install event: Cache initial files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching initial files');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('Deleting old cache:', name);
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event: Network-first strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || new Response('Offline and no cache available', { status: 503 });
        });
      })
  );
});
