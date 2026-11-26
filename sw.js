const CACHE_NAME = 'notas-pwa-v1';
const ASSETS = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png'
];

// 1. Instalación (Guardar en caché el App Shell)
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// 2. Activación (Limpiar cachés viejos)
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
});

// 3. Fetch (Estrategia Cache First)
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((cacheResponse) => {
            return cacheResponse || fetch(e.request);
        })
    );
});