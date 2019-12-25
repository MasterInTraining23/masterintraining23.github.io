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
    ).catch(err => {})
  );
});

var messagePort;
var localCacheForRaceCondition;
self.addEventListener('message', event => {
  console.log("received msg from client", event);
  if (event.data.msgType == 'SAVE_PORT') {
    messagePort = event.ports[0];
    if (localCacheForRaceCondition) {
      messagePort.postMessage(localCacheForRaceCondition);
      localCacheForRaceCondition = undefined;
    }
  }
  if (event.data.msgType == 'UPDATE_CACHE') {
    if (messagePort) {
      messagePort.postMessage(event.data);
    } else {
      localCacheForRaceCondition = event.data;
    }
  }
});