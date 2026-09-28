const USERNAME = "shadow1363";
const FILTER_TAG = "tomas-martinez";
const SUPPORTED_LANGUAGES = ["en", "pt", "es"];
const SHINY_ODDS = 3000;
const MERMAID_URL =
  "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";
const NON_GITHUB_PROJECTS = [
  {
    name: "Be a Better Friend",
    description:
      "Never forget what matters most about the people you care about",
    topics: ["app", "mobile", "capactior", "ios"],
    demoUrl: "https://beabetterfriend.app",
    iconClass: "assets/projects/betterfriend.webp",
  },
];
let languageSettings = {};
let currentLanguage = "en";

// Initialize language settings when the page loads
document.addEventListener("DOMContentLoaded", getUserLanguageFromBrowser);
document.addEventListener("DOMContentLoaded", fetchJSONFeed);
document.addEventListener("DOMContentLoaded", loadLanguageSettings);

// Handle Light and Dark Mode
function setTheme(dark) {
  const themeToggle = document.querySelector(".theme-toggle");
  const pattern = document.querySelector(".pattern");
  const profile = document.getElementById("profile-image");

  if (dark) {
    document.body.setAttribute("data-theme", "dark");
  } else {
    document.body.removeAttribute("data-theme");
  }
  pattern.style.backgroundImage = `url("assets/pattern-${dark ? "light" : "dark"}.webp")`;
  profile.src = `assets/${dark ? "dark" : "light"}mode.webp`;
  themeToggle.innerHTML = `<svg class="icon"><use href="./assets/icons.svg#${dark ? "sun" : "moon"}"></use></svg>`;
  rerenderSystemDiagram();
}

document.addEventListener("DOMContentLoaded", () => {
  // Set initial theme based on system preference
  setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);

  document.querySelector(".theme-toggle").addEventListener("click", () => {
    setTheme(document.body.getAttribute("data-theme") !== "dark");
  });

  // Smooth scrolling for navigation
  const navLinks = document.querySelectorAll(".nav-link");

  for (const link of navLinks) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("data-section");
      const targetSection = document.getElementById(targetId);

      window.scrollTo({
        top: targetSection.offsetTop,
        behavior: "smooth",
      });
    });
  }

  // GitHub API integration
  fetchGitHubProjects();

  observeSystemDiagram();
  setupMudkip();
});
