const CACHE_STATIC = 'cache-static-v1';
const CACHE_DINAMIC = 'cache-dinamic-v1';
const CACHE_INMUTABLE = 'cache-inmutable-v1';

const APP_SHELL = [
  '/',
  'index.html',
  'src/css/style.css',
  'src/img/icons/icon-72x72.png',
  'src/js/main.js',
  'src/js/config.js'
];

const APP_SHELL_INMUTABLE = [
  'https://fonts.googleapis.com/css?family=Roboto:300,400,700',
  'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css',
  'https://www.gstatic.com/firebasejs/5.8.2/firebase-app.js',
  'https://www.gstatic.com/firebasejs/5.8.2/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/5.8.2/firebase-database.js',
  '//unpkg.com/navigo@6',
];

self.addEventListener('install', event => {
  console.log('install event');

  const cacheStatic = caches.open(CACHE_STATIC)
    .then(cache => {
      cache.addAll(APP_SHELL);
    });

  const cacheInmutable = caches.open(CACHE_INMUTABLE)
    .then(cache => {
      cache.addAll(APP_SHELL_INMUTABLE);
    });

  event.waitUntil(
    Promise.all([cacheStatic, cacheInmutable])
  );

});

self.addEventListener('activate', event => {
  console.log('activate');
  const res = caches.keys()
    .then(keys => {
      keys.forEach(key => {
        console.log(key);
        if (key !== CACHE_STATIC && key.includes('cache-static')) {
          console.log('Borrando cache antigua', key);
          return caches.delete(key);
        }
      });
    });

  event.waitUntil(res);
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  console.log('fetch event');

  const respuesta = caches.match(event.request)
    .then(res => {
      if (res) {
        return res;
      } else {
        console.log(event.request.url);
        return fetch(event.request)
          .then( resRequest => {
            if (resRequest.ok) {
              caches.open(CACHE_DINAMIC)
                .then(cache => {
                  cache.put(event.request, resRequest.clone());
                  console.log(cache);
                });
            } else {
              return resRequest;
            }
          });
      }

    });

  event.respondWith(respuesta);
});