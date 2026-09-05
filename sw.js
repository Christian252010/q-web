/* =====================================
   SERVICE WORKER
   Q-WEB OFFLINE
===================================== */

const CACHE_NAME = "q-web-offline-v6";

/*
=====================================
SEMUA FILE YANG DISIMPAN SAAT
"SIMPAN UNTUK OFFLINE" DITEKAN
=====================================
*/

const OFFLINE_FILES = [

  // ===============================
  // ROOT
  // ===============================

  "/",
  "/index.html",
  "/template.html",
  "/template.css",
  "/dashboard.css",

  // ===============================
  // JAVASCRIPT
  // ===============================

  "/fetch.js",
  "/app.js",
  "/template.js",

  // ===============================
  // LIBRARY
  // ===============================

  "/lib/lucide.min.js",
  "/lib/html5-qrcode.min.js",
  "/lib/qrcode.min.js",

  // ===============================
  // FONT
  // ===============================

  "/Minercraftory.ttf",

  // ===============================
  // ICON / GAMBAR
  // ===============================

  "/icon-1024.png",
  "/text-search.png",

  // ===============================
  // FOLDER ICONS
  // ===============================

  "/icons/binary.png",
  "/icons/calendar.png",
  "/icons/clock.png",
  "/icons/cooking.png",
  "/icons/currency-exchange.png",
  "/icons/dashboard.png",
  "/icons/data-transfer.png",
  "/icons/floppy-disk.png",
  "/icons/half.png",
  "/icons/hot.png",
  "/icons/jawa2.png",
  "/icons/layout.png",
  "/icons/math.png",
  "/icons/measuring-tape.png",
  "/icons/morse-code.png",
  "/icons/pie-chart1.png",
  "/icons/profit.png",
  "/icons/qr-code.png",
  "/icons/roman-numerals.png",
  "/icons/water-bucket.png",
  "/icons/weighing-machine.png",
  "/icons/wifi-router.png",

  // ===============================
  // HALAMAN
  // ===============================

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
  "/music-play.html",
  "/profile.html",
  "/update.html",
  "/vidio.html",

  // ===============================
  // FILE LAIN
  // ===============================

  "/manifest.json"
];


/* =====================================
   STATE DOWNLOAD
===================================== */

let offlineDownloading = false;
let offlineCancelled = false;
let currentController = null;


/* =====================================
   INSTALL
===================================== */

self.addEventListener("install", event => {

  /*
    Jangan langsung download semua file
    saat service worker di-install.

    Download hanya dilakukan ketika user
    menekan "Simpan untuk Offline".
  */

  event.waitUntil(
    self.skipWaiting()
  );

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
      .then(() => {

        return self.clients.claim();

      })

  );

});


/* =====================================
   MESSAGE
===================================== */

self.addEventListener("message", event => {

  if (!event.data) return;


  /*
  =====================================
  MULAI DOWNLOAD OFFLINE
  =====================================
  */

  if (event.data.type === "DOWNLOAD_OFFLINE") {

    event.waitUntil(
      downloadOfflineFiles()
    );

    return;
  }


  /*
  =====================================
  BATAL DOWNLOAD
  =====================================
  */

  if (event.data.type === "CANCEL_OFFLINE") {

    cancelOfflineDownload();

    return;
  }


  /*
  =====================================
  HAPUS DATA OFFLINE
  =====================================
  */

  if (event.data.type === "DELETE_OFFLINE") {

    event.waitUntil(
      deleteOfflineFiles()
    );

    return;
  }


  /*
  =====================================
  CEK STATUS OFFLINE
  =====================================
  */

  if (event.data.type === "GET_OFFLINE_STATUS") {

    event.waitUntil(
      sendOfflineStatus()
    );

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
  currentController = null;


  /*
  Hapus cache lama terlebih dahulu.

  Ini penting supaya kalau sebelumnya ada
  cache versi lama, data offline tidak
  tercampur.
  */

  await caches.delete(CACHE_NAME);


  const cache = await caches.open(CACHE_NAME);


  let success = 0;
  let failed = 0;


  sendMessage({
    type: "OFFLINE_START",
    total: OFFLINE_FILES.length
  });


  /*
  =====================================
  DOWNLOAD SATU PER SATU
  =====================================
  */

  for (let i = 0; i < OFFLINE_FILES.length; i++) {


    /*
    ===================================
    CEK BATAL
    ===================================
    */

    if (offlineCancelled) {

      await cancelAndClearCache(
        success,
        failed,
        i
      );

      return;
    }


    const file = OFFLINE_FILES[i];


    /*
    ===================================
    UPDATE PROGRESS
    ===================================
    */

    sendMessage({

      type: "OFFLINE_PROGRESS",

      current: i + 1,

      total: OFFLINE_FILES.length,

      file: file,

      status: "downloading"

    });


    /*
    ===================================
    ABORT CONTROLLER
    ===================================
    */

    currentController =
      new AbortController();


    try {

      /*
      =================================
      FETCH FILE
      =================================
      */

      const response = await fetch(file, {

        cache: "no-cache",

        signal: currentController.signal

      });


      /*
      =================================
      RESPONSE TIDAK VALID
      =================================
      */

      if (!response.ok) {

        throw new Error(
          `HTTP ${response.status}`
        );

      }


      /*
      =================================
      CEK BATAL SETELAH FETCH
      =================================
      */

      if (offlineCancelled) {

        await cancelAndClearCache(
          success,
          failed,
          i
        );

        return;
      }


      /*
      =================================
      SIMPAN KE CACHE
      =================================
      */

      await cache.put(
        file,
        response.clone()
      );


      success++;


      /*
      =================================
      BERHASIL
      =================================
      */

      sendMessage({

        type: "OFFLINE_PROGRESS",

        current: i + 1,

        total: OFFLINE_FILES.length,

        file: file,

        status: "success"

      });


    } catch (error) {


      /*
      =================================
      DOWNLOAD DIBATALKAN
      =================================
      */

      if (
        offlineCancelled ||
        error.name === "AbortError"
      ) {

        await cancelAndClearCache(
          success,
          failed,
          i
        );

        return;
      }


      /*
      =================================
      FILE GAGAL
      =================================
      */

      console.error(
        "Offline download gagal:",
        file,
        error
      );


      failed++;


      sendMessage({

        type: "OFFLINE_PROGRESS",

        current: i + 1,

        total: OFFLINE_FILES.length,

        file: file,

        status: "failed"

      });

    }


    currentController = null;

  }


  /*
  =====================================
  SELESAI
  =====================================
  */

  offlineDownloading = false;
  offlineCancelled = false;
  currentController = null;


  sendMessage({

    type: "OFFLINE_READY",

    total: OFFLINE_FILES.length,

    success: success,

    failed: failed

  });

}


/* =====================================
   BATAL DOWNLOAD
===================================== */

function cancelOfflineDownload() {

  if (!offlineDownloading) return;


  offlineCancelled = true;


  /*
  Batalkan file yang sedang di-download.
  */

  if (currentController) {

    try {

      currentController.abort();

    } catch (error) {

      console.error(
        "Gagal membatalkan fetch:",
        error
      );

    }

  }

}


/* =====================================
   HAPUS CACHE KETIKA DIBATALKAN
===================================== */

async function cancelAndClearCache(
  success,
  failed,
  completed
) {

  try {

    /*
    Hapus SELURUH cache hasil download
    yang sedang berjalan.
    */

    await caches.delete(
      CACHE_NAME
    );

  } catch (error) {

    console.error(
      "Gagal menghapus cache:",
      error
    );

  }


  offlineDownloading = false;
  offlineCancelled = false;
  currentController = null;


  /*
  Kembali ke kondisi awal.
  */

  sendMessage({

    type: "OFFLINE_CANCELLED",

    success: success,

    failed: failed,

    completed: completed

  });

}


/* =====================================
   HAPUS DATA OFFLINE
===================================== */

async function deleteOfflineFiles() {

  if (offlineDownloading) {

    sendMessage({

      type: "OFFLINE_ERROR",

      message:
        "Pengunduhan masih berlangsung."

    });

    return;
  }


  try {

    await caches.delete(
      CACHE_NAME
    );


    sendMessage({

      type: "OFFLINE_DELETED"

    });


  } catch (error) {

    console.error(
      "Gagal menghapus data offline:",
      error
    );


    sendMessage({

      type: "OFFLINE_ERROR",

      message:
        "Gagal menghapus data offline."

    });

  }

}


/* =====================================
   HITUNG UKURAN CACHE
===================================== */

async function getCacheSize() {

  let totalSize = 0;


  try {

    const cache =
      await caches.open(
        CACHE_NAME
      );


    const requests =
      await cache.keys();


    for (const request of requests) {

      try {

        const response =
          await cache.match(request);


        if (!response) continue;


        const clone =
          response.clone();


        const buffer =
          await clone.arrayBuffer();


        totalSize +=
          buffer.byteLength;


      } catch (error) {

        console.warn(
          "Gagal menghitung ukuran:",
          request.url,
          error
        );

      }

    }


  } catch (error) {

    console.warn(
      "Gagal membuka cache:",
      error
    );

  }


  return totalSize;

}


/* =====================================
   STATUS OFFLINE
===================================== */

async function sendOfflineStatus() {

  try {

    const cache =
      await caches.open(
        CACHE_NAME
      );


    const requests =
      await cache.keys();


    const files =
      requests.length;


    const size =
      await getCacheSize();


    sendMessage({

      type: "OFFLINE_STATUS",

      saved: files > 0,

      files: files,

      size: size

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
   KIRIM MESSAGE KE HALAMAN
===================================== */

async function sendMessage(message) {

  try {

    const clients =
      await self.clients.matchAll({

        type: "window",

        includeUncontrolled: true

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

  const request =
    event.request;


  /*
  Hanya GET
  */

  if (request.method !== "GET") {

    return;

  }


  const url =
    new URL(request.url);


  /*
  Hanya domain Q-Web sendiri.

  Request dari CDN / domain luar tidak
  akan ditangani service worker.
  */

  if (
    url.origin !==
    self.location.origin
  ) {

    return;

  }


  event.respondWith(

    caches.match(request)

      .then(cachedResponse => {


        /*
        =================================
        ADA DI CACHE
        =================================
        */

        if (cachedResponse) {

          return cachedResponse;

        }


        /*
        =================================
        BELUM ADA DI CACHE
        =================================
        */

        return fetch(request);

      })


      .catch(async () => {


        /*
        =================================
        OFFLINE DOCUMENT
        =================================
        */

        if (
          request.destination ===
          "document"
        ) {

          const offlinePage =
            await caches.match(
              "/index.html"
            );


          if (offlinePage) {

            return offlinePage;

          }

        }


        /*
        =================================
        RESPONSE FALLBACK
        =================================
        */

        return new Response(

          "Tidak tersedia secara offline.",

          {

            status: 503,

            headers: {

              "Content-Type":
                "text/plain; charset=utf-8"

            }

          }

        );

      })

  );

});