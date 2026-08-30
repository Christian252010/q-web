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

      icon.innerHTML = "";

      if (isDark) {
        icon.setAttribute("data-lucide", "moon");
        localStorage.setItem("theme", "dark");
      } else {
        icon.setAttribute("data-lucide", "sun");
        localStorage.setItem("theme", "light");
      }

      lucide.createIcons();
    }

    // Load theme
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark");
    }

    // Tampilan awal
    updateUI();

    // Toggle dark/light
    btn24.addEventListener("click", () => {
      isOn = !isOn;

      document.body.classList.toggle("dark");

      updateUI();
    });


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


    menuToggle.addEventListener("click", (e) => {

      const clickedButton = e.target.closest(".line");

      // Jika yang diklik A/B/C/D
      if (clickedButton) {

        const value = clickedButton.textContent.trim();

        if (buttons[value]) {
          buttons[value]();
        }

        menuToggle.classList.remove("open");

        return;
      }

      // Jika tombol utama
      menuToggle.classList.toggle("open");

    });


    /* =====================================
       KLIK DI LUAR MENU A B C D
    ===================================== */

    document.addEventListener("click", (e) => {

      if (!menuToggle.contains(e.target)) {
        menuToggle.classList.remove("open");
      }

    });


    /* =====================================
       SEARCH SIDEBAR
    ===================================== */

    const searchInput = document.getElementById("sidebarrSearch");
    const menuBoxes = document.querySelectorAll(".sidebar-menu a");

    searchInput.addEventListener("keyup", function() {

      const filter = this.value.toLowerCase();

      menuBoxes.forEach(box => {

        const label = box
          .querySelector("span")
          .innerText
          .toLowerCase();

        box.style.display =
          label.includes(filter)
            ? "flex"
            : "none";

      });

    });


    /* =====================================
       SIDEBAR
    ===================================== */

    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.getElementById('menuBtn');
    const sidebarOverlay = document.getElementById('sidebarOverlay');


    /* =====================================
       MODE SIDEBAR NORMAL / RIGHT
    ===================================== */

    const btnRight = document.getElementById("btnRight");

    let status = "normal";


    // ============================
    // MODE NORMAL
    // ============================

    function function1() {

      sidebar.classList.remove("right");

      document
        .querySelectorAll(".sidebar a")
        .forEach(menu => {
          menu.classList.remove("right");
        });

      status = "normal";

    }


    // ============================
    // MODE RIGHT
    // ============================

    function function2() {

      sidebar.classList.add("right");

      document
        .querySelectorAll(".sidebar a")
        .forEach(menu => {
          menu.classList.add("right");
        });

      status = "right";

    }


    // Kondisi awal
    function1();


    // ============================
    // TOMBOL RIGHT
    // ============================

    btnRight.addEventListener("click", function(e) {

      e.stopPropagation();

      if (status === "normal") {

        function2();

      } else {

        function1();

      }

    });


    /* =====================================
       OPEN SIDEBAR
    ===================================== */

    function openSidebar() {

      sidebar.classList.add('active');

      menuBtn.classList.add('active');

      sidebarOverlay.classList.add('active');

    }


    /* =====================================
       CLOSE SIDEBAR
    ===================================== */

    function closeSidebar() {

      // Hapus mode .right
      sidebar.classList.remove("right");


      // Hapus .right dari semua menu
      document
        .querySelectorAll(".sidebar a")
        .forEach(menu => {

          menu.classList.remove("right");

        });


      // Reset status
      status = "normal";


      // Tutup sidebar
      sidebar.classList.remove('active');

      menuBtn.classList.remove('active');

      sidebarOverlay.classList.remove('active');

    }


    /* =====================================
       TOMBOL MENU SIDEBAR
    ===================================== */

    menuBtn.addEventListener('click', (e) => {

      e.stopPropagation();

      if (sidebar.classList.contains('active')) {

        closeSidebar();

      } else {

        openSidebar();

      }

    });


    /* =====================================
       KLIK OVERLAY
    ===================================== */

    sidebarOverlay.addEventListener('click', () => {

      closeSidebar();

    });


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

    lucide.createIcons();

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