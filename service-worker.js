const CACHE_NAME = '...';
const urlsToCache = [
  '/',
  './main.js',
  './main.css'
];

self.addEventListener('install', function(event) {
  // Logs may be stale, clear console manually
  console.log('Wow! service-worker is installed!');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          console.log('Cache Hit! ' + event.request.url);
          return response;
        }

        console.log('Cache Miss! ' + event.request.url);

        return fetch(event.request.clone()).then((response) => {
          if(!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, response.clone());
              console.log('Cache Put! ' + event.request.url);
            });

          return response;
        });
      })
    );
});
