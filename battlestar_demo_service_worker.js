const CACHE_NAME = 'test-cache-v1';
const urlsToCache = [
  '/',
  '/battlestar_demo_view',
  '/battlestar_demo_main.js',
];

self.addEventListener('install', event => {
  console.log("msg from install event", event);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  console.log('fetching:', event.request);
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('message', event => {
  console.log("received msg from client", event.data);
  event.ports[0].postMessage('private msg back');
});