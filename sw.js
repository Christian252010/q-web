const CACHE_NAME = "q-web-v2";

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
  "/file-transfer.html",
  "/subnet.html",
  "/qr-code.html",
  "/pecahan.html",
  "/percent.html",
  "/rumus.html",
  "/fpb-kpk.html",
  "/rata-rata.html",
  "/jawa.html",
  "/mata-uang.html",
  "/morse.html",
  "/romawi.html",
  "/number.html",
  "/panjang.html",
  "/berat.html",
  "/volume.html",
  "/suhu.html",
  "/data.html",
  "/waktu.html",
  "/masakan.html",

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