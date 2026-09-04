const CACHE_NAME = "q-web-v3";

// Hanya file inti yang selalu dibutuhkan
const CORE_FILES = [
  "/",
  "/index.html",
  "/template.html",

  "/template.css",
  "/dashboard.css",

  "/fetch.js",
  "/app.js",

  // Library yang dibutuhkan agar icon/QR tetap bisa offline
  "/lib/lucide.min.js",
  "/lib/html5-qrcode.min.js",
  "/lib/qrcode.min.js"
];


// ========================================
// INSTALL
// ========================================

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_FILES))
      .then(() => self.skipWaiting())
  );
});


// ========================================
// ACTIVATE
// ========================================

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
    .then(() => self.clients.claim())
  );
});


// ========================================
// FETCH
// ========================================

self.addEventListener("fetch", event => {

  const request = event.request;

  // Hanya menangani GET
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  // Jangan cache request ke domain lain
  if (url.origin !== self.location.origin) {
    return;
  }


  // ======================================
  // HTML
  // Network First
  // ======================================

  if (
    request.destination === "document" ||
    request.headers.get("accept")?.includes("text/html")
  ) {

    event.respondWith(
      fetch(request)
        .then(response => {

          // Simpan HTML yang berhasil diambil
          if (response.ok) {
            const clone = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(request, clone);
              });
          }

          return response;
        })
        .catch(() => {

          // Offline → gunakan cache
          return caches.match(request)
            .then(cached => {

              if (cached) {
                return cached;
              }

              // Kalau tidak ada cache,
              // gunakan index sebagai fallback
              return caches.match("/index.html");
            });

        })
    );

    return;
  }


  // ======================================
  // JS / CSS / FONT / IMAGE
  // Cache First
  // ======================================

  if (
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "font" ||
    request.destination === "image"
  ) {

    event.respondWith(
      caches.match(request)
        .then(cached => {

          if (cached) {
            return cached;
          }

          return fetch(request)
            .then(response => {

              if (response.ok) {

                const clone = response.clone();

                caches.open(CACHE_NAME)
                  .then(cache => {
                    cache.put(request, clone);
                  });

              }

              return response;
            });

        })
    );

    return;
  }


  // ======================================
  // Request lainnya
  // Network First
  // ======================================

  event.respondWith(
    fetch(request)
      .catch(() => caches.match(request))
  );

});