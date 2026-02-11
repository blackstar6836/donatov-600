// ==========================================
// THEME
// ==========================================
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute("data-theme");
  const next = current === "light" ? "dark" : "light";
  html.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const sun = document.querySelector(".icon-sun");
  const moon = document.querySelector(".icon-moon");
  if (theme === "dark") {
    sun.style.display = "none";
    moon.style.display = "block";
  } else {
    sun.style.display = "block";
    moon.style.display = "none";
  }
}

// Init theme from localStorage
(function () {
  const saved = localStorage.getItem("theme");
  if (saved) {
    document.documentElement.setAttribute("data-theme", saved);
    updateThemeIcon(saved);
  }
})();
