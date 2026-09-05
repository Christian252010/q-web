/* =====================================
   SERVICE WORKER
   Q-WEB OFFLINE
===================================== */

const CACHE_NAME = "q-web-offline-v5";

const OFFLINE_FILES = [
  "/",
  "/index.html",
  "/template.html",
  "/template.css",
  "/dashboard.css",
  "/fetch.js",
  "/app.js",
  "/lib/lucide.min.js",
  "/lib/html5-qrcode.min.js",
  "/lib/qrcode.min.js",
  "/Minercraftory.ttf",
  "/jadwal.html",
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
  "/profile.html",
  "/update.html",
  "/vidio.html",
  "/kanji.json",
  "/manifest.json",
  "/text-search.png",
  "/icon-1024.png"
];

let offlineDownloading = false;
let offlineCancelled = false;
let currentController = null;

/* =====================================
   INSTALL
===================================== */

self.addEventListener("install", event => {
  self.skipWaiting();
});

/* =====================================
   ACTIVATE
===================================== */

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME)
            .map(name => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

/* =====================================
   MESSAGE
===================================== */

self.addEventListener("message", event => {
  if (event.data?.type === "DOWNLOAD_OFFLINE") {
    event.waitUntil(downloadOfflineFiles());
    return;
  }

  if (event.data?.type === "CANCEL_OFFLINE") {
    cancelOfflineDownload();
    return;
  }

  if (event.data?.type === "DELETE_OFFLINE") {
    event.waitUntil(deleteOfflineFiles());
    return;
  }

  if (event.data?.type === "GET_OFFLINE_STATUS") {
    event.waitUntil(sendOfflineStatus());
    return;
  }
});

/* =====================================
   DOWNLOAD OFFLINE
===================================== */

async function downloadOfflineFiles() {
  if (offlineDownloading) return;

  offlineDownloading = true;
  offlineCancelled = false;

  const cache = await caches.open(CACHE_NAME);

  let success = 0;
  let failed = 0;

  sendMessage({
    type: "OFFLINE_START",
    total: OFFLINE_FILES.length
  });

  for (let i = 0; i < OFFLINE_FILES.length; i++) {
    if (offlineCancelled) {
      await cancelAndClearCache(success, failed, i);
      return;
    }

    const file = OFFLINE_FILES[i];

    sendMessage({
      type: "OFFLINE_PROGRESS",
      current: i + 1,
      total: OFFLINE_FILES.length,
      file,
      status: "downloading"
    });

    currentController = new AbortController();

    try {
      const response = await fetch(file, {
        cache: "no-cache",
        signal: currentController.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      if (offlineCancelled) {
        await cancelAndClearCache(success, failed, i);
        return;
      }

      await cache.put(file, response.clone());
      success++;

      sendMessage({
        type: "OFFLINE_PROGRESS",
        current: i + 1,
        total: OFFLINE_FILES.length,
        file,
        status: "success"
      });
    } catch (error) {
      if (offlineCancelled || error.name === "AbortError") {
        await cancelAndClearCache(success, failed, i);
        return;
      }

      console.error("Offline download gagal:", file, error);
      failed++;

      sendMessage({
        type: "OFFLINE_PROGRESS",
        current: i + 1,
        total: OFFLINE_FILES.length,
        file,
        status: "failed"
      });
    }

    currentController = null;
  }

  offlineDownloading = false;
  currentController = null;

  sendMessage({
    type: "OFFLINE_READY",
    total: OFFLINE_FILES.length,
    success,
    failed
  });
}

/* =====================================
   BATAL DOWNLOAD
===================================== */

function cancelOfflineDownload() {
  if (!offlineDownloading) return;

  offlineCancelled = true;

  if (currentController) {
    try {
      currentController.abort();
    } catch (error) {
      console.error("Gagal membatalkan fetch:", error);
    }
  }
}

/* =====================================
   BATAL + HAPUS CACHE
===================================== */

async function cancelAndClearCache(success, failed, completed) {
  try {
    await caches.delete(CACHE_NAME);
  } catch (error) {
    console.error("Gagal menghapus cache:", error);
  }

  offlineDownloading = false;
  offlineCancelled = false;
  currentController = null;

  sendMessage({
    type: "OFFLINE_CANCELLED",
    success,
    failed,
    completed
  });
}

/* =====================================
   HAPUS OFFLINE
===================================== */

async function deleteOfflineFiles() {
  if (offlineDownloading) {
    sendMessage({
      type: "OFFLINE_ERROR",
      message: "Pengunduhan masih berlangsung."
    });
    return;
  }

  try {
    await caches.delete(CACHE_NAME);

    sendMessage({
      type: "OFFLINE_DELETED"
    });
  } catch (error) {
    console.error("Gagal menghapus cache:", error);

    sendMessage({
      type: "OFFLINE_ERROR",
      message: "Gagal menghapus data offline."
    });
  }
}

/* =====================================
   HITUNG UKURAN CACHE
===================================== */

async function getCacheSize() {
  let totalSize = 0;

  const cache = await caches.open(CACHE_NAME);
  const requests = await cache.keys();

  for (const request of requests) {
    try {
      const response = await cache.match(request);
      if (!response) continue;

      const clone = response.clone();
      const buffer = await clone.arrayBuffer();

      totalSize += buffer.byteLength;
    } catch (error) {
      console.warn(
        "Gagal menghitung ukuran:",
        request.url,
        error
      );
    }
  }

  return totalSize;
}

/* =====================================
   STATUS OFFLINE
===================================== */

async function sendOfflineStatus() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const requests = await cache.keys();

    const files = requests.length;
    const size = await getCacheSize();

    sendMessage({
      type: "OFFLINE_STATUS",
      saved: files > 0,
      files,
      size
    });
  } catch (error) {
    console.error(
      "Gagal mendapatkan status offline:",
      error
    );

    sendMessage({
      type: "OFFLINE_STATUS",
      saved: false,
      files: 0,
      size: 0
    });
  }
}

/* =====================================
   KIRIM PESAN KE HALAMAN
===================================== */

async function sendMessage(message) {
  try {
    const clients = await self.clients.matchAll({
      type: "window"
    });

    clients.forEach(client => {
      client.postMessage(message);
    });
  } catch (error) {
    console.error(
      "Gagal mengirim message:",
      error
    );
  }
}

/* =====================================
   FETCH
===================================== */

self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request);
      })
      .catch(async () => {
        if (request.destination === "document") {
          const offlinePage = await caches.match("/index.html");

          if (offlinePage) {
            return offlinePage;
          }
        }

        return new Response(
          "Tidak tersedia secara offline.",
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