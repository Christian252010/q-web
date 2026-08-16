lucide.createIcons();

const sidebar = document.querySelector('.sidebar');
const menuBtn = document.getElementById('menuBtn');

// Klik tombol ☰ untuk buka/tutup sidebar + animasi
menuBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  sidebar.classList.toggle('active');
  menuBtn.classList.toggle('active');
});

// Klik di luar sidebar → tutup
document.addEventListener('click', (e) => {
  const isInsideSidebar = sidebar.contains(e.target);
  const isMenuBtn = menuBtn.contains(e.target);
  if (!isInsideSidebar && !isMenuBtn) {
    sidebar.classList.remove('active');
    menuBtn.classList.remove('active');
  }
});

// Klik link dalam sidebar → tutup juga
document.querySelectorAll('.sidebar a').forEach(link => {
  link.addEventListener('click', () => {
    sidebar.classList.remove('active');
    menuBtn.classList.remove('active');
  });
});

// SEARCH FILTER
const searchInput = document.getElementById("sidebarrSearch");
const menuBoxes = document.querySelectorAll(".sidebar-menu a");

searchInput.addEventListener("keyup", function() {
  const filter = this.value.toLowerCase();

  menuBoxes.forEach(box => {
    const label = box.querySelector("span").innerText.toLowerCase();
    box.style.display = label.includes(filter) ? "flex" : "none";
  });
});

// OPSIONAL: Ubah Title Otomatis (kalau mau dipakai)
document.getElementById("pageTitle").innerText = document.title;

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

function home() {
  window.location.href = 'index.html';
}