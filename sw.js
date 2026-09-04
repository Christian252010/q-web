const CACHE_NAME = "q-web-v1";

const FILES_TO_CACHE = [
  "/",
  "/index.html",

  // CSS
  "/template.css",
  "/dashboard.css",

  // JS utama
  "/fetch.js",
  "/app.js",

  // Template
  "/template.html",

  // Semua halaman yang bisa dibuka offline
  "/jadwal.html",
  "/morse.html",
  "/romawi.html",
  "/subnet.html",
  "/qr-code.html",
  "/rumus.html",

  // Library lokal
  "/lib/lucide.min.js"
];


// ===============================
// INSTALL
// ===============================
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});


// ===============================
// ACTIVATE
// ===============================
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});


// ===============================
// FETCH
// ===============================
self.addEventListener("fetch", event => {

  // Hanya request GET
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {

        // Kalau ada di cache → gunakan cache
        if (cachedResponse) {
          return cachedResponse;
        }

        // Kalau belum ada → ambil dari internet
        return fetch(event.request)
          .then(networkResponse => {

            // Simpan response untuk penggunaan berikutnya
            const responseClone = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseClone);
              });

            return networkResponse;
          });

      })
      .catch(() => {

        // Kalau offline dan tidak ada cache
        return new Response(
          "Halaman tidak tersedia secara offline.",
          {
            status: 503,
            headers: {
              "Content-Type": "text/plain; charset=utf-8"
            }
          }
        );

      })
  );
});