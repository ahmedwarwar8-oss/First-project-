// Service worker: lets the app open with no internet connection.
// Bump VERSION whenever you change index.html or other files so phones pick up the update.
const VERSION = "progress-v26";
const FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network first (so updates show up), falling back to the cached copy when offline
// or when the site returns an error (e.g. a 404 while hosting is down).
// Only good responses are cached, so an error page never replaces the saved app.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  const fallback = () => caches.match(e.request).then(r => r || caches.match("./index.html"));
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (!res.ok) return fallback().then(r => r || res);
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(fallback)
  );
});
