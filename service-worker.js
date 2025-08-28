// Cache name for this PWA
const CACHE_NAME = 'hwe-doc-cache-v1';
// List of files to cache
const urlsToCache = [
    '/', // The main HTML file
    '/manifest.json',
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    // You might need to add icon URLs here if they were actual files
    'https://placehold.co/192x192/2563eb/ffffff?text=HWE',
    'https://placehold.co/512x512/2563eb/ffffff?text=HWE'
];

// Install event: caching assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event: serving from cache or network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // No cache hit - fetch from network
                return fetch(event.request).catch(() => {
                    // Fallback for offline if no cached response
                    // This is a simple fallback, more complex apps might show an offline page
                    console.log('Fetch failed, no cached response, and offline.');
                    return new Response('<h1>You are offline</h1>', {
                        headers: { 'Content-Type': 'text/html' }
                    });
                });
            })
    );
});

// Activate event: cleaning up old caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});