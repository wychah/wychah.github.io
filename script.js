const root = document.documentElement;
const header = document.querySelector(".site-header");
const themeButton = document.querySelector(".theme-toggle");
const menuButton = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");

function setTheme(theme) {
  root.dataset.theme = theme;
  themeButton.textContent = theme === "dark" ? "Light" : "Dark";
  themeButton.setAttribute("aria-label", theme === "dark" ? "Use light theme" : "Use dark theme");
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) themeMeta.setAttribute("content", theme === "dark" ? "#101310" : "#f4f4ef");
  localStorage.setItem("theme", theme);
}

function closeMenu() {
  mobileNav.hidden = true;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.textContent = "Menu";
  header.classList.remove("menu-active");
  document.body.classList.remove("menu-open");
}

function toggleMenu() {
  const willOpen = mobileNav.hidden;
  mobileNav.hidden = !willOpen;
  menuButton.setAttribute("aria-expanded", String(willOpen));
  menuButton.textContent = willOpen ? "Close" : "Menu";
  header.classList.toggle("menu-active", willOpen);
  document.body.classList.toggle("menu-open", willOpen);
}

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 18);
}

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    document.querySelectorAll(".paper-item").forEach((paper) => {
      const categories = paper.dataset.category.split(" ");
      paper.hidden = filter !== "all" && !categories.includes(filter);
    });
  });
});

document.querySelectorAll(".paper-media").forEach((media) => {
  const tabs = media.querySelectorAll(".media-tab");
  const panels = media.querySelectorAll(".media-panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.mediaTarget;
      tabs.forEach((item) => {
        const isActive = item === tab;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-selected", String(isActive));
      });

      panels.forEach((panel) => {
        const isActive = panel.dataset.mediaPanel === target;
        panel.hidden = !isActive;
        panel.classList.toggle("active", isActive);

        const video = panel.querySelector("video");
        if (!video) return;

        if (isActive) {
          if (!video.src && video.dataset.src) video.src = video.dataset.src;
        } else {
          video.pause();
        }
      });
    });
  });
});

themeButton.addEventListener("click", () => setTheme(root.dataset.theme === "dark" ? "light" : "dark"));
menuButton.addEventListener("click", toggleMenu);
mobileNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
window.addEventListener("scroll", updateHeader, { passive: true });

const savedTheme = localStorage.getItem("theme");
setTheme(savedTheme === "dark" ? "dark" : "light");
updateHeader();
