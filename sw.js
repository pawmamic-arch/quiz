/* Service worker: zapisuje wszystkie pliki aplikacji, żeby quiz działał offline.
   Po zmianie plików podbij numer wersji — stary cache zostanie usunięty. */
var VERSION = 'v1';
var APP_CACHE = 'krolewski-quiz-' + VERSION;
var FONT_CACHE = 'krolewski-quiz-fonts';

var ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './questions.js',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(APP_CACHE)
      .then(function (cache) { return cache.addAll(ASSETS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.map(function (key) {
          if (key !== APP_CACHE && key !== FONT_CACHE) return caches.delete(key);
        }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

// Sieć z limitem czasu — przy słabym zasięgu szybko wracamy do wersji z cache.
function fetchWithTimeout(request, ms) {
  return new Promise(function (resolve, reject) {
    var timer = setTimeout(function () { reject(new Error('timeout')); }, ms);
    fetch(request).then(function (res) { clearTimeout(timer); resolve(res); },
                        function (err) { clearTimeout(timer); reject(err); });
  });
}

// Pliki aplikacji: najpierw sieć (świeża wersja), a bez sieci — cache.
function networkFirst(event) {
  var request = event.request;
  return fetchWithTimeout(request, 3500)
    .then(function (response) {
      if (response && response.ok) {
        var copy = response.clone();
        event.waitUntil(caches.open(APP_CACHE).then(function (cache) { return cache.put(request, copy); }));
      }
      return response;
    })
    .catch(function () {
      return caches.match(request, { ignoreSearch: true }).then(function (cached) {
        if (cached) return cached;
        if (request.mode === 'navigate') return caches.match('./index.html');
        return Response.error();
      });
    });
}

// Fonty Google: najpierw cache, w tle odświeżenie.
function fontCacheFirst(event) {
  var request = event.request;
  return caches.open(FONT_CACHE).then(function (cache) {
    return cache.match(request).then(function (cached) {
      var network = fetch(request).then(function (response) {
        if (response && (response.ok || response.type === 'opaque')) cache.put(request, response.clone());
        return response;
      }).catch(function () { return cached; });
      if (cached) {
        event.waitUntil(network);
        return cached;
      }
      return network;
    });
  });
}

self.addEventListener('fetch', function (event) {
  var request = event.request;
  if (request.method !== 'GET') return;
  var url = new URL(request.url);

  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(fontCacheFirst(event));
    return;
  }
  if (url.origin !== self.location.origin) return;

  event.respondWith(networkFirst(event));
});
