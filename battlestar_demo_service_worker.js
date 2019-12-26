const CACHE_NAME = 'test-cache-v1';
const urlsToCache = [
  '/',
  '/battlestar_demo_view',
  '/battlestar_demo_main.js',
  'https://lh3.googleusercontent.com/ZGGpSa2GtdeMFcwKHW9h6ojeIBzgXObey972LE-9KgLRrB2d2GtjzS9mRvWh72TLvVHdk2nXXN4G=w515-h290-rw',
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
        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
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
  if (event.data.msgType == 'IMG_CACHE') {
    caches.open(CACHE_NAME).then(function(cache) {
      cache.addAll(event.data.imgSrcsToCache);
    });
  }
});