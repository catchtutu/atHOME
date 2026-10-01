// Clinical Photo Capture — Service Worker
// Purpose: PWA installability (Add to Home Screen) only
//
// IMPORTANT PRIVACY NOTE:
// This service worker deliberately does NOT cache any image data,
// form submissions, or API responses. It only caches the static
// app shell (HTML, CSS, JS) for offline access to the UI.
// Photo blobs are NEVER passed through or stored by this worker.

const CACHE_NAME = 'clinical-photo-v1';
const STATIC_ASSETS = [
  './index.html',
  './manifest.json'
];

// Install: cache static shell only
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: serve shell from cache; let ALL other requests (API, camera) go to network
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // NEVER intercept: API calls (graph.microsoft.com), camera streams, external resources
  if (
    url.hostname !== self.location.hostname ||
    event.request.method !== 'GET' ||
    url.pathname.includes('/v1.0/')  // Graph API — always network
  ) {
    return; // fall through to network
  }

  // Cache-first for static shell only
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
