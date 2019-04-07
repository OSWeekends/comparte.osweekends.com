const CACHE_STATIC = 'cache-static-v1';
const CACHE_DINAMIC = 'cache-dinamic-v1';
const CACHE_INMUTABLE = 'cache-inmuctable-v1';

const APP_SHELL = [
  '/',
  'index.html',
  'src/css/style.css',
  'src/img/osw-logo.svg',
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
  const res = caches.keys()
    .then(keys => {
      keys.forEach(key => {
        if (key !== CACHE_STATIC && key.includes('cache-static')) {
          return caches.delete(key);
        }
      });
    });

  event.waitUntil(res);
});

self.addEventListener('fetch', event => {

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
                  return res.clone();
                })
            } else {
              return resRequest;
            }
          });
      }

    });

  event.respondWith(respuesta);
});