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
    
  const searchInput = document.getElementById("sidebarrSearch");
  const menuBoxes = document.querySelectorAll(".sidebar-menu a");
  
  searchInput.addEventListener("keyup", function() {
    const filter = this.value.toLowerCase();
  
    menuBoxes.forEach(box => {
      const label = box.querySelector("span").innerText.toLowerCase();
      box.style.display = label.includes(filter) ? "flex" : "none";
    });
  });

    const sidebar = document.querySelector('.sidebar');
    const menuBtn = document.getElementById('menuBtn');

    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('active');
      menuBtn.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
        sidebar.classList.remove('active');
        menuBtn.classList.remove('active');
      }
    });

    document.querySelectorAll('.sidebar a').forEach(link => {
      link.addEventListener('click', () => {
        sidebar.classList.remove('active');
        menuBtn.classList.remove('active');
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