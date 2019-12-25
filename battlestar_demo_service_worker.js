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
          console.log('cache hit');
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('message', event => {
  console.log("received msg from client", event.data);
  event.waitUntil(async function() {
    // Exit early if we don't have access to the client.
    // Eg, if it's cross-origin.
    if (!event.clientId) return;

    // Get the client.
    const client = await clients.get(event.clientId);
    // Exit early if we don't get the client.
    // Eg, if it closed.
    if (!client) return;

    // Send a message to the client.
    client.postMessage({
      msg: "Hey I just got a fetch from you!",
      url: event.request.url
    });
   
  }());
});