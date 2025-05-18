// Cache name
const CACHE_NAME = 'alephBeit-game-v1';

// Files to pre-cache (for offline support)
const FILES_TO_CACHE = [
    '/',
    'index.html',
    'icon.png',
    'icon-512.png',
    'manifest.json',
    // Images א-ת
    'א.png', 'ב.png', 'ג.png', 'ד.png', 'ה.png', 'ו.png', 'ז.png', 'ח.png', 'ט.png', 'י.png',
    'כ.png', 'ל.png', 'מ.png', 'נ.png', 'ס.png', 'ע.png', 'פ.png', 'צ.png', 'ק.png', 'ר.png',
    'ש.png', 'ת.png',
    // Sounds א-ת
    'א.mp3', 'ב.mp3', 'ג.mp3', 'ד.mp3', 'ה.mp3', 'ו.mp3', 'ז.mp3', 'ח.mp3', 'ט.mp3', 'י.mp3',
    'כ.mp3', 'ל.mp3', 'מ.mp3', 'נ.mp3', 'ס.mp3', 'ע.mp3', 'פ.mp3', 'צ.mp3', 'ק.mp3', 'ר.mp3',
    'ש.mp3', 'ת.mp3'
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

// Fetch event: Cache-first strategy for performance
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).then((networkResponse) => {
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            }).catch(() => {
                return new Response('Offline and no cache available', { status: 503 });
            });
        })
    );
});
