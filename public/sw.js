// public/sw.js
const CACHE_NAME = 'miss-orangina-vote-cache-v1';

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(clients.claim());
});

// Gestion des votes
self.addEventListener('message', (event) => {
  if (event.data.type === 'STORE_VOTE') {
    const { deviceId, candidateId, timestamp } = event.data.payload;
    
    // Stocker dans le cache
    caches.open(CACHE_NAME).then(cache => {
      cache.put(
        `/votes/${deviceId}`, 
        new Response(JSON.stringify({
          candidateId,
          timestamp
        }))
      );
    });
  }
});

// Vérification des votes
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/check-vote/')) {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || new Response(JSON.stringify({ hasVoted: false }));
      })
    );
  }
});