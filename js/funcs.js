function fetchGitHubProjects() {
  const projectsContainer = document.getElementById("projects-container");
  addNonGithubProjects();
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
        await addSampleProjects();
        return;
      }

      for (const repo of repos) {
        if (repo.topics.includes(FILTER_TAG)) {
          repo.topics = repo.topics.filter((topic) => topic !== FILTER_TAG);
          const imageUrl = `https://raw.githubusercontent.com/${USERNAME}/${repo.name}/main/cover/cover.webp`;

          let validImage = false;
          try {
            const response = await fetch(imageUrl, { method: "HEAD" });
            validImage = response.ok;
          } catch (error) {
            console.error(`Error checking image for ${repo.name}:`, error);
          }
          const projectCard = await createProjectCard(
            repo.name,
            repo.description || "",
            repo.topics || [],
            repo.html_url,
            repo.homepage || null,
            validImage ? imageUrl : null,
            repo.stargazers_count,
            repo.forks_count
          );

          projectsContainer.appendChild(projectCard);
        }
      }
    })
    .catch(async (error) => {
      console.error("Error fetching GitHub projects:", error);
      projectsContainer.innerHTML = "";
      await addSampleProjects();
    });
}

async function addSampleProjects() {
  const projectsContainer = document.getElementById("projects-container");
  const sampleProjects = [
    {
      name: "CardCreator",
      description: "Create your own card game using tab separated values",
      topics: [
        "card",
        "card-game-generator",
        "excel-export",
        "playing-cards",
        "tabletop-simulator",
        "tsv",
      ],
      repoUrl: "https://github.com/Shadow1363/CardCreator",
      demoUrl: "https://shadow1363.github.io/CardCreator/",
      iconClass:
        "https://raw.githubusercontent.com/shadow1363/CardCreator/main/cover/cover.webp",
      stars: 1,
      forks: 0,
    },
    {
      name: "Terminal",
      description: "Terminal inspired portfolio website.",
      topics: [
        "command-line",
        "command-line-interface",
        "linux",
        "personal-website",
        "portfolio",
        "portfolio-template",
        "portfolio-website",
        "shell",
        "website",
      ],
      repoUrl: "https://github.com/Shadow1363/Terminal",
      demoUrl: "https://shadow1363.github.io/Terminal/",
      iconClass:
        "https://raw.githubusercontent.com/shadow1363/Terminal/main/cover/cover.webp",
      stars: 5,
      forks: 1,
    },
    {
      name: "TextDungeon",
      description: "A text-based RPG.",
      topics: ["dungeon", "dungeon-crawler", "game", "python", "text-game"],
      repoUrl: "https://github.com/Shadow1363/TextDungeon",
      demoUrl: null,
      iconClass:
        "https://raw.githubusercontent.com/shadow1363/TextDungeon/main/cover/cover.webp",
      stars: 1,
      forks: 0,
    },
  ];

  for (const project of sampleProjects) {
    const projectCard = await createProjectCard(
      project.name,
      project.description,
      project.topics,
      project.repoUrl,
      project.demoUrl,
      project.iconClass,
      project.stars,
      project.forks
    );
    projectsContainer.appendChild(projectCard);
  }
}

function addNonGithubProjects() {
  return;
  // TODO: Fix this so it adds it without the github
  const projectsContainer = document.getElementById("projects-container");
  const sampleProjects = [
    {
      name: "Be a Better Friend",
      description: "Never forget your friend's birthday!",
      topics: ["app"],
      repoUrl: "https://github.com/Shadow1363/CardCreator",
      demoUrl: "https://shadow1363.github.io/CardCreator/",
      iconClass:
        "https://raw.githubusercontent.com/shadow1363/CardCreator/main/cover/cover.webp",
    },
  ];

  for (const project of sampleProjects) {
    const projectCard = createProjectCard(
      project.name,
      project.description,
      project.topics,
      project.repoUrl,
      project.demoUrl,
      project.iconClass,
      project.stars,
      project.forks
    );
    projectsContainer.appendChild(projectCard);
  }
}

async function createProjectCard(
  name,
  description,
  topics,
  repoUrl,
  demoUrl,
  iconClass,
  stars = 0,
  forks = 0
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
			<span style="font-weight: bold;">${stars}</span>
		</div>
		<div class="stat">
			<svg class="icon">
              <use href="./assets/icons.svg#fork"></use>
            </svg>
			<span style="font-weight: bold;">${forks}</span>
		</div>
	`;

  // Project Stats Downloads
  if (demoUrl?.includes("marketplace.visualstudio.com")) {
    const extensionId = demoUrl.split("itemName=")[1];
    const downloads = await fetchVSCodeStats(extensionId);
    if (downloads != 0 && typeof downloads === "number") {
      statsDiv.innerHTML += `
		<div class="stat">
			<svg class="icon">
              <use href="./assets/icons.svg#download"></use>
            </svg>
			<span style="font-weight: bold;">${downloads}</span>
		</div>
	`;
    }
  }

  // Project description
  const desc = document.createElement("p");
  desc.innerHTML = `<span class="en">${description}</span>`;

  // Project tags
  const tagsDiv = document.createElement("div");
  tagsDiv.className = "tags";

  // Sort topics alphabetically
  topics.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

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

  if (SUPPORTED_LANGUAGES.includes(detectedLang)) {
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

function fetchJSONFeed() {
  const blogPostsContainer = document.getElementById("blog-posts");

  fetch(
    "https://corsproxy.io/?url=https://blog.tomasmartinez.xyz/feed_json_created.json"
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
        for (const post of blog.items.slice(0, 2)) {
          // Format the date using the "date_published" property
          const date = new Date(post.date_published);
          const formattedDate = date.toLocaleDateString();

          // Extract plain text from the HTML description (if needed)
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = post.content_html;
          const description = tempDiv.textContent || tempDiv.innerText || "";

          // Create card HTML with updated properties:
          const cardHTML = `
					<a href="${post.url}" target="_blank" class="card-link-wrapper">
					  <div class="card">
						<div class="card-content">
						  <h2 class="card-title">${post.title}</h2>
						  <span class="card-date">${formattedDate}</span>
						  <p class="card-description">${description}</p>
						  <p class="card-author">By ${post.authors[0].name}</p>
						</div>
					  </div>
					</a>
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

async function fetchVSCodeStats(extensionId) {
  const url =
    "https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery?api-version=7.1-preview.1";
  const corsProxyUrl =
    "https://corsproxy.io/?url=https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery?api-version=7.1-preview.1";

  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json; api-version=7.1-preview.1",
      origin: "https://tomasmartinez.xyz",
      referer: "https://tomasmartinez.xyz",
    },
    body: JSON.stringify({
      filters: [
        {
          criteria: [
            {
              filterType: 7,
              value: extensionId,
            },
          ],
        },
      ],
      flags: 262,
    }),
  };

  try {
    // Try direct request first
    let response = await fetch(url, options);

    // If direct request fails, try with CORS proxy
    if (!response.ok) {
      response = await fetch(corsProxyUrl, options);
    }

    const data = await response.json();
    const statistics = data.results[0].extensions[0].statistics;
    const installStat = statistics.find(
      (stat) => stat.statisticName === "install"
    );
    return installStat ? Number.parseInt(installStat.value) : 0;
  } catch (error) {
    console.error("Error fetching VS Code stats:", error);
    return 0;
  }
}
