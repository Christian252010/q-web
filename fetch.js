/* =====================================
   LOAD SIDEBAR
===================================== */
fetch('template.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('fetch-container').innerHTML = html;

  lucide.createIcons();
  
  const btn24 = document.getElementById("toggle");
  let isOn = true;

  btn24.addEventListener("click", () => {
    isOn = !isOn;

    // Ganti icon
    btn.innerHTML = `<i data-lucide="${isOn ? 'sun' : 'moon'}"></i>`;

    // Render ulang icon lucide
    lucide.createIcons();
  });
    
  const btn = document.getElementById("toggle");
  const icon = document.getElementById("icon");
  
  // Update UI (theme + icon)
  function updateUI() {
    const isDark = document.body.classList.contains("dark");
  
    // HAPUS ICON LAMA (WAJIB)
    icon.innerHTML = "";
  
    if (isDark) {
      icon.setAttribute("data-lucide", "moon");
      localStorage.setItem("theme", "dark");
    } else {
      icon.setAttribute("data-lucide", "sun");
      localStorage.setItem("theme", "light");
    }
  
    // Render ulang icon (sekali)
    lucide.createIcons();
  }
  
  // Load awal dari localStorage
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
  
  // Set tampilan awal
  updateUI();
  
  // Event toggle
  btn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    updateUI();
  });
  
  const menuToggle = document.getElementById("menuToggle");
  
  const buttons = {
    A: () => {
      alert("Berhasil")
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
  
  
  // ============================
  // KLIK MENU
  // ============================
  
  menuToggle.addEventListener("click", (e) => {
  
    const clickedButton = e.target.closest(".line");
  
    // Jika yang diklik adalah A/B/C/D
    if (clickedButton) {
  
      const value = clickedButton.textContent.trim();
  
      // Jalankan fungsi tombol
      if (buttons[value]) {
        buttons[value]();
      }
  
      // Tutup menu
      menuToggle.classList.remove("open");
  
      return;
    }
  
    // Jika yang diklik area menu utama
    menuToggle.classList.toggle("open");
  });
  
  
  // ============================
  // KLIK DI LUAR MENU
  // ============================
  
  document.addEventListener("click", (e) => {
  
    if (!menuToggle.contains(e.target)) {
      menuToggle.classList.remove("open");
    }
  
  });
    
  const searchInput = document.getElementById("sidebarrSearch");
  const menuBoxes = document.querySelectorAll(".sidebar-menu a");
  
  searchInput.addEventListener("keyup", function() {
    const filter = this.value.toLowerCase();
  
    menuBoxes.forEach(box => {
      const label = box.querySelector("span").innerText.toLowerCase();
      box.style.display = label.includes(filter) ? "flex" : "none";
    });
  });

    /* =====================================
       SIDEBAR
    ===================================== */
    
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.getElementById('menuBtn');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    function openSidebar() {
      sidebar.classList.add('active');
      menuBtn.classList.add('active');
      sidebarOverlay.classList.add('active');
    }
    
    function closeSidebar() {
      sidebar.classList.remove('active');
      menuBtn.classList.remove('active');
      sidebarOverlay.classList.remove('active');
    }
    
    /* Tombol menu */
    
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
    
      if (sidebar.classList.contains('active')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
    
    /* Klik area gelap */
    
    sidebarOverlay.addEventListener('click', () => {
      closeSidebar();
    });
    
    /* Klik menu sidebar */
    
    document.querySelectorAll('.sidebar a').forEach(link => {
      link.addEventListener('click', () => {
        closeSidebar();
      });
    });


    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar a').forEach(link => {
      const target = link.getAttribute('href');
      link.classList.remove('active');
      if (target === currentPage) link.classList.add('active');
    });
    
    const current = location.pathname.split("/").pop();
    document.querySelectorAll(".dock a").forEach(btn => {
      if (btn.getAttribute("href") === current) {
        btn.classList.add("active");
      }
    });

    const pageTitle = document.getElementById("pageTitle");
    if (pageTitle) {
      pageTitle.textContent = document.body.getAttribute("data-title");
    }
  });
  
function home() {
  window.location.href = 'index.html';
}
function profile() {
  window.location.href = 'profile.html';
}