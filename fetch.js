/* =====================================
   LOAD SIDEBAR
===================================== */

fetch('template.html')
  .then(res => res.text())
  .then(html => {

    document.getElementById('fetch-container').innerHTML = html;

    /* =====================================
       DARK MODE
    ===================================== */

    const btn24 = document.getElementById("toggle");
    const btn = document.getElementById("toggle");
    const icon = document.getElementById("icon");

    let isOn = true;

    function updateUI() {
      const isDark = document.body.classList.contains("dark");

      if (!icon) return;

      icon.innerHTML = "";

      if (isDark) {
        icon.setAttribute("data-lucide", "moon");
        localStorage.setItem("theme", "dark");
      } else {
        icon.setAttribute("data-lucide", "sun");
        localStorage.setItem("theme", "light");
      }

      if (window.lucide) lucide.createIcons();
    }

    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark");
    }

    updateUI();

    if (btn24) {
      btn24.addEventListener("click", () => {
        isOn = !isOn;
        document.body.classList.toggle("dark");
        updateUI();
      });
    }

    /* =====================================
       MENU TOGGLE A B C D
    ===================================== */

    const menuToggle = document.getElementById("menuToggle");

    const buttons = {
      A: () => {
        alert("Berhasil");
      },
      B: () => {
        console.log("Tombol B");
      },
      C: () => {
        console.log("Tombol C");
      },
      D: () => {
        console.log("Tombol D");
      }
    };

    if (menuToggle) {
      menuToggle.addEventListener("click", (e) => {

        const clickedButton = e.target.closest(".line");

        if (clickedButton) {

          const value = clickedButton.textContent.trim();

          if (buttons[value]) {
            buttons[value]();
          }

          menuToggle.classList.remove("open");
          return;
        }

        menuToggle.classList.toggle("open");

      });

      /* =====================================
         KLIK DI LUAR MENU
      ===================================== */

      document.addEventListener("click", (e) => {

        if (!menuToggle.contains(e.target)) {
          menuToggle.classList.remove("open");
        }

      });
    }

    /* =====================================
       SEARCH SIDEBAR
    ===================================== */

    const searchInput =
      document.getElementById("sidebarrSearch");

    const menuBoxes =
      document.querySelectorAll(".sidebar-menu a");

    if (searchInput) {
      searchInput.addEventListener("keyup", function() {

        const filter = this.value.toLowerCase();

        menuBoxes.forEach(box => {

          const span = box.querySelector("span");
          if (!span) return;

          const label =
            span.innerText.toLowerCase();

          box.style.display =
            label.includes(filter)
              ? "flex"
              : "none";

        });

      });
    }

    /* =====================================
       SIDEBAR
    ===================================== */

    const sidebar =
      document.getElementById('sidebar');

    const menuBtn =
      document.getElementById('menuBtn');

    const sidebarOverlay =
      document.getElementById('sidebarOverlay');

    /* =====================================
       MODE SIDEBAR NORMAL / RIGHT
    ===================================== */

    const btnRight =
      document.getElementById("btnRight");

    const sidebarS =
      document.querySelector(".sidebar");

    const sidebarA =
      document.querySelectorAll(".sidebar a");

    let status = "normal";

    function function1() {

      if (!sidebarS) return;

      sidebarS.classList.remove("right");

      sidebarA.forEach(menu => {
        menu.classList.remove("right");
      });

      if (btnRight) {
        btnRight.classList.remove("active");
      }

      status = "normal";
    }

    function function2() {

      if (!sidebarS) return;

      sidebarS.classList.add("right");

      sidebarA.forEach(menu => {
        menu.classList.add("right");
      });

      if (btnRight) {
        btnRight.classList.add("active");
      }

      status = "right";
    }

    function1();

    if (btnRight) {
      btnRight.addEventListener("click", function() {

        if (status === "normal") {
          function2();
        } else {
          function1();
        }

      });
    }

    /* =====================================
       OPEN SIDEBAR
    ===================================== */

    function openSidebar() {

      if (!sidebar ||
          !menuBtn ||
          !sidebarOverlay) return;

      sidebar.classList.add('active');
      menuBtn.classList.add('active');
      sidebarOverlay.classList.add('active');

    }

    /* =====================================
       CLOSE SIDEBAR
    ===================================== */

    function closeSidebar() {

      if (!sidebar ||
          !menuBtn ||
          !sidebarOverlay) return;

      sidebar.classList.remove("right");

      document
        .querySelectorAll(".sidebar a")
        .forEach(menu => {
          menu.classList.remove("right");
        });

      status = "normal";

      sidebar.classList.remove('active');
      menuBtn.classList.remove('active');
      sidebarOverlay.classList.remove('active');

    }

    /* =====================================
       TOMBOL MENU SIDEBAR
    ===================================== */

    if (menuBtn) {

      menuBtn.addEventListener('click', (e) => {

        e.stopPropagation();

        function1();

        if (sidebar.classList.contains('active')) {
          closeSidebar();
        } else {
          openSidebar();
        }

      });

    }

    /* =====================================
       KLIK OVERLAY
    ===================================== */

    if (sidebarOverlay) {

      sidebarOverlay.addEventListener('click', () => {
        closeSidebar();
      });

    }

    /* =====================================
       KLIK MENU SIDEBAR
    ===================================== */

    document
      .querySelectorAll('.sidebar a')
      .forEach(link => {

        link.addEventListener('click', () => {
          closeSidebar();
        });

      });

    /* =====================================
       ACTIVE PAGE
    ===================================== */

    const currentPage =
      window.location.pathname
        .split('/')
        .pop();

    document
      .querySelectorAll('.sidebar a')
      .forEach(link => {

        const target =
          link.getAttribute('href');

        link.classList.remove('active');

        if (target === currentPage) {
          link.classList.add('active');
        }

      });

    /* =====================================
       DOCK ACTIVE
    ===================================== */

    const current =
      location.pathname
        .split("/")
        .pop();

    document
      .querySelectorAll(".dock a")
      .forEach(btn => {

        if (btn.getAttribute("href") === current) {
          btn.classList.add("active");
        }

      });

    /* =====================================
       PAGE TITLE
    ===================================== */

    const pageTitle =
      document.getElementById("pageTitle");

    if (pageTitle) {

      pageTitle.textContent =
        document.body.getAttribute("data-title");

    }

    /* =====================================
       RENDER LUCIDE
    ===================================== */

    if (window.lucide) {
      lucide.createIcons();
    }

    /* =====================================
       OFFLINE MANAGER
    ===================================== */

    initOfflineManager();

    function initOfflineManager() {

      const offlineHeaderBtn =
        document.getElementById("offlineHeaderBtn");

      const offlinePanel =
        document.getElementById("offlinePanel");

      const offlineClose =
        document.getElementById("offlineClose");

      const downloadBtn =
        document.getElementById("downloadOfflineBtn");

      const cancelBtn =
        document.getElementById("cancelOfflineBtn");

      const deleteBtn =
        document.getElementById("deleteOfflineBtn");

      const offlineStatus =
        document.getElementById("offlineStatus");

      const offlineSize =
        document.getElementById("offlineSize");

      const progressContainer =
        document.getElementById(
          "offlineProgressContainer"
        );

      const progressBar =
        document.getElementById(
          "offlineProgressBar"
        );

      const progressText =
        document.getElementById(
          "offlineProgressText"
        );

      const fileText =
        document.getElementById(
          "offlineFileText"
        );

      if (!offlineHeaderBtn ||
          !offlinePanel ||
          !downloadBtn ||
          !cancelBtn ||
          !deleteBtn) {
        return;
      }

      let isDownloading = false;

      /* =====================================
         BUKA POPUP
      ===================================== */

      offlineHeaderBtn.addEventListener("click", () => {

        offlinePanel.classList.toggle("active");

        requestOfflineStatus();

      });

      /* =====================================
         TUTUP POPUP
      ===================================== */

      if (offlineClose) {

        offlineClose.addEventListener("click", () => {

          offlinePanel.classList.remove("active");

        });

      }

      /* =====================================
         SERVICE WORKER
      ===================================== */

      async function getServiceWorker() {

        if (!("serviceWorker" in navigator)) {
          throw new Error(
            "Service Worker tidak didukung."
          );
        }

        const registration =
          await navigator.serviceWorker.ready;

        if (!registration.active) {
          throw new Error(
            "Service Worker belum aktif."
          );
        }

        return registration.active;
      }

      /* =====================================
         SIMPAN OFFLINE
      ===================================== */

      downloadBtn.addEventListener(
        "click",
        async () => {

          if (isDownloading) return;

          if (!navigator.onLine) {
            alert("Anda sedang offline.");
            return;
          }

          try {

            const sw =
              await getServiceWorker();

            isDownloading = true;

            downloadBtn.style.display = "none";
            cancelBtn.style.display = "flex";
            deleteBtn.style.display = "none";

            downloadBtn.disabled = true;
            cancelBtn.disabled = false;

            if (progressContainer) {
              progressContainer.style.display = "block";
            }

            if (progressBar) {
              progressBar.style.width = "0%";
            }

            if (progressText) {
              progressText.textContent = "0%";
            }

            if (fileText) {
              fileText.textContent =
                "Menyiapkan...";
            }

            if (offlineStatus) {
              offlineStatus.textContent =
                "Sedang menyimpan...";
            }

            sw.postMessage({
              type: "DOWNLOAD_OFFLINE"
            });

          } catch (error) {

            console.error(error);

            isDownloading = false;

            downloadBtn.disabled = false;

            alert(
              "Gagal memulai penyimpanan offline."
            );

          }

        }
      );

      /* =====================================
         BATAL
      ===================================== */

      cancelBtn.addEventListener(
        "click",
        async () => {

          if (!isDownloading) return;

          /*
           * confirm membuat JavaScript berhenti
           * sementara sampai pengguna memilih.
           */

          const yakin = confirm(
            "Apakah Anda yakin ingin membatalkan pengunduhan?"
          );

          if (!yakin) return;

          try {

            const sw =
              await getServiceWorker();

            cancelBtn.disabled = true;

            if (offlineStatus) {
              offlineStatus.textContent =
                "Membatalkan...";
            }

            if (fileText) {
              fileText.textContent =
                "Menghapus data yang sudah diunduh...";
            }

            sw.postMessage({
              type: "CANCEL_OFFLINE"
            });

          } catch (error) {

            console.error(error);

            cancelBtn.disabled = false;

          }

        }
      );

      /* =====================================
         HAPUS OFFLINE
      ===================================== */

      deleteBtn.addEventListener(
        "click",
        async () => {

          const yakin = confirm(
            "Apakah Anda yakin ingin menghapus semua data offline?"
          );

          if (!yakin) return;

          try {

            const sw =
              await getServiceWorker();

            deleteBtn.disabled = true;

            if (offlineStatus) {
              offlineStatus.textContent =
                "Menghapus...";
            }

            if (offlineSize) {
              offlineSize.textContent =
                "Menghapus data offline...";
            }

            sw.postMessage({
              type: "DELETE_OFFLINE"
            });

          } catch (error) {

            console.error(error);

            deleteBtn.disabled = false;

          }

        }
      );

      /* =====================================
         MESSAGE SERVICE WORKER
      ===================================== */

      navigator.serviceWorker.addEventListener(
        "message",
        event => {

          const data = event.data;

          if (!data || !data.type) return;

          /* ================================
             MULAI DOWNLOAD
          ================================ */

          if (data.type === "OFFLINE_START") {

            isDownloading = true;

            downloadBtn.style.display = "none";
            cancelBtn.style.display = "flex";
            deleteBtn.style.display = "none";

            cancelBtn.disabled = false;

            if (progressContainer) {
              progressContainer.style.display =
                "block";
            }

            if (progressBar) {
              progressBar.style.width = "0%";
            }

            if (progressText) {
              progressText.textContent = "0%";
            }

            if (fileText) {
              fileText.textContent =
                "Menyiapkan...";
            }

            if (offlineStatus) {
              offlineStatus.textContent =
                "Sedang menyimpan...";
            }

          }

          /* ================================
             PROGRESS
          ================================ */

          if (data.type === "OFFLINE_PROGRESS") {

            const percent =
              Math.round(
                (data.current / data.total) * 100
              );

            if (progressContainer) {
              progressContainer.style.display =
                "block";
            }

            if (progressBar) {
              progressBar.style.width =
                percent + "%";
            }

            if (progressText) {
              progressText.textContent =
                percent + "%";
            }

            const fileName =
              getFileName(data.file);

            if (fileText) {

              if (data.status === "failed") {

                fileText.textContent =
                  fileName + " gagal";

              } else if (
                data.status === "success"
              ) {

                fileText.textContent =
                  fileName + " ✓";

              } else {

                fileText.textContent =
                  fileName;

              }

            }

            if (offlineStatus) {

              offlineStatus.textContent =
                "Menyimpan " +
                data.current +
                " dari " +
                data.total +
                "...";

            }

          }

          /* ================================
             CANCELLED
          ================================ */

          if (data.type === "OFFLINE_CANCELLED") {

            isDownloading = false;

            if (progressContainer) {
              progressContainer.style.display =
                "none";
            }

            if (progressBar) {
              progressBar.style.width = "0%";
            }

            if (progressText) {
              progressText.textContent = "0%";
            }

            if (offlineStatus) {
              offlineStatus.textContent =
                "Belum disimpan";
            }

            if (offlineSize) {
              offlineSize.textContent =
                "Belum ada data offline";
            }

            if (fileText) {
              fileText.textContent =
                "Pengunduhan dibatalkan";
            }

            downloadBtn.style.display = "flex";
            cancelBtn.style.display = "none";
            deleteBtn.style.display = "none";

            downloadBtn.disabled = false;
            cancelBtn.disabled = false;
            deleteBtn.disabled = false;

            requestOfflineStatus();

          }

          /* ================================
             SELESAI
          ================================ */

          if (data.type === "OFFLINE_READY") {

            isDownloading = false;

            if (progressBar) {
              progressBar.style.width = "100%";
            }

            if (progressText) {
              progressText.textContent = "100%";
            }

            if (progressContainer) {
              progressContainer.style.display =
                "none";
            }

            if (offlineStatus) {
              offlineStatus.textContent =
                "Offline siap digunakan";
            }

            if (fileText) {
              fileText.textContent =
                "Semua data berhasil disimpan";
            }

            /*
             * DATA SUDAH ADA
             * SIMPAN DIHILANGKAN
             */

            downloadBtn.style.display = "none";

            /*
             * BATAL DIHILANGKAN
             */

            cancelBtn.style.display = "none";

            /*
             * HAPUS DITAMPILKAN
             */

            deleteBtn.style.display = "flex";

            downloadBtn.disabled = false;
            cancelBtn.disabled = false;
            deleteBtn.disabled = false;

            requestOfflineStatus();

          }

          /* ================================
             OFFLINE DELETED
          ================================ */

          if (data.type === "OFFLINE_DELETED") {

            isDownloading = false;

            if (progressContainer) {
              progressContainer.style.display =
                "none";
            }

            if (progressBar) {
              progressBar.style.width = "0%";
            }

            if (progressText) {
              progressText.textContent = "0%";
            }

            if (offlineStatus) {
              offlineStatus.textContent =
                "Belum disimpan";
            }

            if (offlineSize) {
              offlineSize.textContent =
                "Belum ada data offline";
            }

            if (fileText) {
              fileText.textContent = "";
            }

            downloadBtn.style.display = "flex";
            cancelBtn.style.display = "none";
            deleteBtn.style.display = "none";

            downloadBtn.disabled = false;
            cancelBtn.disabled = false;
            deleteBtn.disabled = false;

          }

          /* ================================
             STATUS
          ================================ */

          if (data.type === "OFFLINE_STATUS") {

            if (data.saved && !isDownloading) {

              if (offlineStatus) {
                offlineStatus.textContent =
                  "Offline tersedia";
              }

              if (offlineSize) {
                offlineSize.textContent =
                  data.files +
                  " file • " +
                  formatBytes(data.size);
              }

              /*
               * SUDAH ADA DATA
               */

              downloadBtn.style.display = "none";
              cancelBtn.style.display = "none";
              deleteBtn.style.display = "flex";

            } else if (!isDownloading) {

              if (offlineStatus) {
                offlineStatus.textContent =
                  "Belum disimpan";
              }

              if (offlineSize) {
                offlineSize.textContent =
                  "Belum ada data offline";
              }

              downloadBtn.style.display = "flex";
              cancelBtn.style.display = "none";
              deleteBtn.style.display = "none";

            }

          }

          /* ================================
             ERROR
          ================================ */

          if (data.type === "OFFLINE_ERROR") {

            isDownloading = false;

            if (offlineStatus) {
              offlineStatus.textContent =
                "Terjadi kesalahan";
            }

            if (fileText) {
              fileText.textContent =
                data.message ||
                "Terjadi kesalahan.";
            }

            downloadBtn.style.display = "flex";
            cancelBtn.style.display = "none";

            downloadBtn.disabled = false;
            cancelBtn.disabled = false;

          }

        }
      );

      /* =====================================
         REQUEST STATUS
      ===================================== */

      function requestOfflineStatus() {

        getServiceWorker()
          .then(sw => {

            sw.postMessage({
              type: "GET_OFFLINE_STATUS"
            });

          })
          .catch(error => {
            console.error(error);
          });

      }

      document.addEventListener(
        "visibilitychange",
        () => {

          if (!document.hidden) {
            requestOfflineStatus();
          }

        }
      );

      /* =====================================
         FORMAT BYTES
      ===================================== */

      function formatBytes(bytes) {

        if (!bytes) return "0 B";

        const units = [
          "B",
          "KB",
          "MB",
          "GB"
        ];

        const i =
          Math.floor(
            Math.log(bytes) /
            Math.log(1024)
          );

        return (
          (
            bytes /
            Math.pow(1024, i)
          ).toFixed(
            i === 0 ? 0 : 2
          ) +
          " " +
          units[i]
        );

      }

      /* =====================================
         NAMA FILE
      ===================================== */

      function getFileName(path) {

        if (!path) return "";

        return (
          path.split("/").pop() ||
          path
        );

      }

      requestOfflineStatus();
    }

  })
  .catch(error => {

    console.error(
      "Gagal memuat template:",
      error
    );

  });


/* =====================================
   NAVIGASI
===================================== */

function home() {
  window.location.href = 'index.html';
}

function profile() {
  window.location.href = 'profile.html';
}

function update() {
  window.location.href = 'update.html';
}