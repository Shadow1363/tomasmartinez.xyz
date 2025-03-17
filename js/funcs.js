function fetchGitHubProjects() {
	const projectsContainer = document.getElementById("projects-container");

	// Fetch repositories from GitHub API
	fetch(`https://api.github.com/users/${USERNAME}/repos`)
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		})
		.then(async (repos) => {
			projectsContainer.innerHTML = "";
			if (repos.length === 0) {
				addSampleProjects();
				return;
			}

			for (const repo of repos) {
				if (repo.topics.includes("tomas-martinez")) {
					repo.topics = repo.topics.filter(
						(topic) => topic !== "tomas-martinez",
					);
					const imageUrl = `https://raw.githubusercontent.com/${USERNAME}/${repo.name}/main/cover/cover.webp`;

					let validImage = false;
					try {
						const response = await fetch(imageUrl, { method: "HEAD" });
						validImage = response.ok;
					} catch (error) {
						console.error(`Error checking image for ${repo.name}:`, error);
					}

					const projectCard = createProjectCard(
						repo.name,
						repo.description || "No description available",
						repo.topics || [],
						repo.html_url,
						repo.homepage || null,
						validImage ? imageUrl : null,
						repo.stargazers_count,
						repo.forks_count,
					);

					projectsContainer.appendChild(projectCard);
				}
			}
		})
		.catch((error) => {
			console.error("Error fetching GitHub projects:", error);
			projectsContainer.innerHTML = "";
			addSampleProjects();
		});
}

function addSampleProjects() {
	const projectsContainer = document.getElementById("projects-container");

	// Sample projects data
	const sampleProjects = [
		{
			name: "E-Commerce Platform",
			description:
				"A fully responsive e-commerce platform with cart functionality and payment integration.",
			topics: ["JavaScript", "React", "Node.js", "MongoDB"],
			icon: "fa-shopping-cart",
			stars: 24,
			forks: 8,
		},
		{
			name: "Weather Application",
			description:
				"Real-time weather forecast application using OpenWeather API.",
			topics: ["JavaScript", "API", "CSS3"],
			icon: "fa-cloud-sun",
			stars: 15,
			forks: 4,
		},
		{
			name: "Task Management System",
			description:
				"Kanban-style task management application with drag-and-drop functionality.",
			topics: ["React", "Redux", "Firebase"],
			icon: "fa-tasks",
			stars: 32,
			forks: 11,
		},
		{
			name: "Personal Finance Tracker",
			description:
				"Application to track expenses and income with visualization charts.",
			topics: ["JavaScript", "Chart.js", "LocalStorage"],
			icon: "fa-chart-pie",
			stars: 18,
			forks: 6,
		},
		{
			name: "Recipe Finder",
			description: "Search for recipes based on ingredients you have at home.",
			topics: ["JavaScript", "API", "Bootstrap"],
			icon: "fa-utensils",
			stars: 12,
			forks: 3,
		},
		{
			name: "Social Media Dashboard",
			description: "Analytics dashboard for social media account management.",
			topics: ["React", "D3.js", "CSS Grid"],
			icon: "fa-chart-line",
			stars: 27,
			forks: 9,
		},
	];

	for (const project of sampleProjects) {
		const projectCard = createProjectCard(
			project.name,
			project.description,
			project.topics,
			"#",
			null,
			project.icon,
			project.stars,
			project.forks,
		);

		projectsContainer.appendChild(projectCard);
	}
}

function createProjectCard(
	name,
	description,
	topics,
	repoUrl,
	demoUrl,
	iconClass = "fa-code",
	stars = 0,
	forks = 0,
) {
	const card = document.createElement("div");
	card.className = "project-card";

	// Project image/icon
	const imageDiv = document.createElement("div");
	imageDiv.className = "project-image";

	if (iconClass?.includes("https")) {
		const image = document.createElement("img");
		image.className = "project-cover";
		image.src = iconClass;
		image.alt = `${name} Image`;
		imageDiv.appendChild(image); // Append the image element
	}

	// Project content
	const contentDiv = document.createElement("div");
	contentDiv.className = "project-content";

	const background = document.createElement("div");
	background.className = "project-background";
	contentDiv.appendChild(background);

	// Project title
	const title = document.createElement("h3");
	title.innerHTML = `<span>${name}</span>`;

	// Project stats (stars and forks)
	const statsDiv = document.createElement("div");
	statsDiv.className = "project-stats";
	statsDiv.innerHTML = `
		<div class="stat">
			<svg class="icon">
              <use href="./assets/icons.svg#star"></use>
            </svg>
			<span>${stars}</span>
		</div>
		<div class="stat">
			<svg class="icon">
              <use href="./assets/icons.svg#branch"></use>
            </svg>
			<span>${forks}</span>
		</div>
	`;

	// Project description
	const desc = document.createElement("p");
	desc.innerHTML = `<span class="en">${description}</span>`;

	// Project tags
	const tagsDiv = document.createElement("div");
	tagsDiv.className = "tags";

	for (const topic of topics) {
		const tag = document.createElement("span");
		tag.className = "tag";
		tag.textContent = topic;
		tagsDiv.appendChild(tag);
	}

	// Project links
	const linksDiv = document.createElement("div");
	linksDiv.className = "project-links";

	// GitHub link
	const githubLink = document.createElement("a");
	githubLink.setAttribute("aria-label", `${name}'s Code`);
	githubLink.href = repoUrl;
	githubLink.target = "_blank";
	githubLink.innerHTML = `<span><svg class="icon"><use href="./assets/icons.svg#code"></use></svg></span>`;

	linksDiv.appendChild(githubLink);

	// Demo link if available
	if (demoUrl) {
		const demoLink = document.createElement("a");
		demoLink.setAttribute("aria-label", `Visit ${name}`);
		demoLink.href = demoUrl;
		demoLink.target = "_blank";
		demoLink.innerHTML = `<span><svg class="icon"><use href="./assets/icons.svg#eye"></use></svg></span>`;
		linksDiv.appendChild(demoLink);
	}

	// Assemble card
	contentDiv.appendChild(title);
	contentDiv.appendChild(statsDiv);
	contentDiv.appendChild(desc);
	contentDiv.appendChild(tagsDiv);
	contentDiv.appendChild(linksDiv);

	card.appendChild(imageDiv);
	card.appendChild(contentDiv);

	return card;
}

function getUserLanguageFromBrowser() {
	const browserLang = navigator.language || navigator.userLanguage;

	const detectedLang = browserLang.split("-")[0];

	if (supportedLanguages.includes(detectedLang)) {
		currentLanguage = detectedLang;
	} else {
		currentLanguage = "en";
	}

	console.log(`Language set to: ${currentLanguage}`);
	return currentLanguage;
}

// Fetch the language settings from settings.json
async function loadLanguageSettings() {
	try {
		const response = await fetch("settings.json");
		if (!response.ok) {
			throw new Error("Failed to load language settings");
		}

		languageSettings = await response.json();

		// Set default language
		currentLanguage = languageSettings.defaultLanguage || "en";
		updateLanguage(currentLanguage);

		// Set up language selector buttons
		// biome-ignore lint/complexity/noForEach: Have to test if I can swap, last time didn't work
		document.querySelectorAll(".lang-selector button").forEach((btn) => {
			btn.addEventListener("click", () => {
				const lang = btn.getAttribute("data-lang");
				if (lang) {
					updateLanguage(lang);

					// Update active button
					// biome-ignore lint/complexity/noForEach: Have to test if I can swap, last time didn't work
					document.querySelectorAll(".lang-selector button").forEach((b) => {
						b.classList.remove("active-lang");
					});
					btn.classList.add("active-lang");
				}
			});
		});
	} catch (error) {
		console.error("Error loading language settings:", error);
	}
}

// Update text content based on selected language
function updateLanguage(lang) {
	currentLanguage = lang;

	if (!languageSettings.languages || !languageSettings.languages[lang]) {
		console.error(`Language ${lang} not found in settings`);
		return;
	}

	const langData = languageSettings.languages[lang].content;

	// Update all elements with data-i18n attribute
	// biome-ignore lint/complexity/noForEach: Have to check if I can swap
	document.querySelectorAll("[data-i18n]").forEach((el) => {
		const key = el.getAttribute("data-i18n");
		const text = getNestedProperty(langData, key);

		if (text !== undefined) {
			el.textContent = text;
		}
	});
}

// Helper function to get nested properties from an object using dot notation
function getNestedProperty(obj, path) {
	return path.split(".").reduce((prev, curr) => {
		return prev ? prev[curr] : undefined;
	}, obj);
}

function fetchRSSFeed() {
	const blogPostsContainer = document.getElementById("blog-posts");

	fetch(
		"https://corsproxy.io/?url=https://blog.tomasmartinez.xyz/feed_json_created.json",
	)
		.then((response) => response.text())
		.then((data) => {
			try {
				const blog = JSON.parse(data);
				blogPostsContainer.innerHTML = "";

				if (blog.items.length === 0) {
					if (blogPostsContainer) {
						blogPostsContainer.remove();
					}
				}

				blogPostsContainer.innerHTML = `<h2 class="blog-title"><span>Latest Posts</span></h2>`;
				// Create cards for each post
				for (const post of blog.items.slice(-2)) {
					// Format the date using the "date_published" property
					const date = new Date(post.date_published);
					const formattedDate = date.toLocaleDateString();

					// Extract plain text from the HTML description (if needed)
					const tempDiv = document.createElement("div");
					tempDiv.innerHTML = post.content_html;
					const description = tempDiv.textContent || tempDiv.innerText || "";

					// Create card HTML with updated properties:
					const cardHTML = `
					  <div class="card">
						<div class="card-content">
						  <h2 class="card-title">${post.title}</h2>
						  <span class="card-date">${formattedDate}</span>
						  <p class="card-description">${description}</p>
						  <a href="${post.url}" class="card-link" target="_blank">Read More</a>
						  <p class="card-author">By ${post.authors[0].name}</p>
						</div>
					  </div>
					`;

					// Add card to container
					blogPostsContainer.innerHTML += cardHTML;
				}

				console.log("Blog posts displayed successfully");
			} catch (error) {
				console.error("Error in displayBlogPosts:", error);
				if (blogPostsContainer) {
					blogPostsContainer.remove(); // Remove the element from the DOM
				}
			}
		})
		.catch((error) => {
			console.error("Error fetching RSS feed:", error);
			if (blogPostsContainer) {
				blogPostsContainer.remove(); // Remove the element from the DOM
			}
		});
}
