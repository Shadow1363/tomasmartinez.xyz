const USERNAME = "shadow1363";
const supportedLanguages = ["en", "pt", "es"];
// biome-ignore lint/style/useConst: funcs.js modify
let languageSettings = {};
// biome-ignore lint/style/useConst: funcs.js modify
let currentLanguage = "en";

// Initialize language settings when the page loads
document.addEventListener("DOMContentLoaded", getUserLanguageFromBrowser);
document.addEventListener("DOMContentLoaded", fetchRSSFeed);
document.addEventListener("DOMContentLoaded", loadLanguageSettings);

// Randomly Select Japanese Subtitle Font
document.addEventListener("DOMContentLoaded", () => {
	const fonts = ["Dela Gothic One", "Mochiy Pop One", "Segoe UI"];
	const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
	document.getElementById("subtitle").style.fontFamily =
		`"${randomFont}", sans-serif`;
});

// Handle Light and Dark Mode
document.addEventListener("DOMContentLoaded", () => {
	// Theme toggling
	const themeToggle = document.querySelector(".theme-toggle");
	const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
	const pattern = document.querySelector(".pattern");
	const profile = document.getElementById("profile-image");

	// Set initial theme based on system preference
	if (prefersDarkScheme.matches) {
		document.body.setAttribute("data-theme", "dark");
		profile.src = "assets/darkmode.png";
		pattern.style.backgroundImage = `url("assets/pattern-light.webp")`;
		themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
	}

	themeToggle.addEventListener("click", () => {
		if (document.body.getAttribute("data-theme") === "dark") {
			pattern.style.backgroundImage = `url("assets/pattern-dark.webp")`;
			profile.src = "assets/lightmode.png";
			document.body.removeAttribute("data-theme");
			themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
		} else {
			pattern.style.backgroundImage = `url("assets/pattern-light.webp")`;
			document.body.setAttribute("data-theme", "dark");
			themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
			profile.src = "assets/darkmode.png";
		}
	});

	// Smooth scrolling for navigation
	const navLinks = document.querySelectorAll(".nav-link");

	for (const link of navLinks) {
		link.addEventListener("click", function (e) {
			e.preventDefault();
			const targetId = this.getAttribute("data-section");
			const targetSection = document.getElementById(targetId);

			window.scrollTo({
				top: targetSection.offsetTop - 80,
				behavior: "smooth",
			});
		});
	}

	// GitHub API integration
	fetchGitHubProjects();
});
