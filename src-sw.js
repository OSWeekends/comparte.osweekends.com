importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.2.0/workbox-sw.js");

workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);

workbox.routing.registerRoute(
  /.*(?:googleapis)\.com/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'googleapis',
  })
);

workbox.routing.registerRoute(
  /.*(?:gstatic)\.com/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'gstatic',
  })
);

workbox.precaching.precacheAndRoute([]);
