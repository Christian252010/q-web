const CACHE_NAME = "jadwal-pelajaran-v1";

const OFFLINE_FILES = [
  "/jadwal.html",
  "/template.css",
  "/fetch.js",
  "/lib/lucide.min.js",
  "/manifest-jadwal.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(OFFLINE_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key.startsWith("jadwal-") && key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Jangan menangani request dari luar domain
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then(response => {
            // Simpan hanya response yang valid
            if (
              response &&
              response.status === 200 &&
              response.type === "basic"
            ) {
              const responseClone = response.clone();

              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseClone);
              });
            }

            return response;
          });
      })
      .catch(() => {
        // Jika jadwal.html dibuka saat offline
        if (event.request.mode === "navigate") {
          return caches.match("/jadwal.html");
        }
      })
  );
});