const CACHE_NAME = 'coral-cache-v1';
const urlsToCache = [
  './index.html',
  './js/three.min.js',
  './js/OrbitControls.js',
  './js/GLTFLoader.js',
  './js/reef.js',
  './models/reef.glb',
  './img/bubble.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

