const CACHE_NAME = "todo-pwa-cache-v2";  // bumped version to v2
const urlsToCache = [
    "/",
    "/static/manifest.json",
    "/static/css/styles.css",
    "/static/js/main.js",
    "/static/js/serviceWorker.js",
    "/static/icons/192x192.png",
    "/static/icons/512x512.png",
    "/static/offline.html" // ✅ added offline page to cache
];

// Install event
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log("Opened cache");
                return cache.addAll(urlsToCache);
            })
    );
});

// Activate event (optional: auto-clean old caches)
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log("Deleting old cache:", cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Fetch event (now handles offline fallback)
self.addEventListener("fetch", event => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request).then(response => {
                return response || caches.match("/static/offline.html");
            });
        })
    );
});
