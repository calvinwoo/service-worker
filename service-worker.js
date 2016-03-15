const CACHE_NAME = 'v1';

const urlsToCache = [
  '/',
  './main.js',
  './main.css',
  'http://i.imgur.com/kS1mlTl.gif'
];

self.addEventListener('install', (event) => {
  console.log('Wow! service-worker is installed!');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    self.caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((response) => {
        if (response) {
          console.log('Cache Hit! ' + event.request.url);
          return response;
        }

        console.log('Cache Miss! ' + event.request.url);

        return fetch(event.request.clone()).then((response) => {
          cache.put(event.request, response.clone());
          console.log('Cache Put! ' + event.request.url);

          return response;
        });
      });
    })
  );
});
