async function fetchGitHubProjects() {
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
      await addNonGithubProjects();

      if (!Array.isArray(repos) || repos.length === 0) {
        await addSampleProjects();
        return;
      }

      const projectsPromises = repos
        .filter(
          (repo) =>
            Array.isArray(repo.topics) && repo.topics.includes(FILTER_TAG),
        )
        .map(async (repo) => {
          const topics = (repo.topics || []).filter(
            (topic) => topic !== FILTER_TAG,
          );
          let order = null;
          for (const t of topics) {
            const m = t.match(/^order[:\-](\d+)$/i);
            if (m) {
              order = Number.parseInt(m[1], 10);
            }
          }
          const topicsClean = topics.filter((t) => !/^order[:\-]\d+$/i.test(t));
          const imageUrl = `https://raw.githubusercontent.com/${USERNAME}/${repo.name}/main/cover/cover.webp`;

          let validImage = false;
          try {
            const response = await fetch(imageUrl, { method: "HEAD" });
            validImage = response.ok;
          } catch (error) {
            console.error(`Error checking image for ${repo.name}:`, error);
          }
          let downloads = 0;
          if (
            repo.homepage &&
            repo.homepage.includes("marketplace.visualstudio.com")
          ) {
            const extensionId = repo.homepage.split("itemName=")[1];
            if (extensionId) {
              downloads = await fetchVSCodeStats(extensionId);
            }
          }
          return {
            name: repo.name,
            description: repo.description || "",
            topics: topicsClean,
            repoUrl: repo.html_url,
            homepage: repo.homepage || null,
            image: validImage ? imageUrl : null,
            stars: repo.stargazers_count || 0,
            forks: repo.forks_count || 0,
            downloads,
            order,
          };
        });

      const projects = await Promise.all(projectsPromises);

      projects.sort((a, b) => {
        const ao =
          typeof a.order === "number" ? a.order : Number.POSITIVE_INFINITY;
        const bo =
          typeof b.order === "number" ? b.order : Number.POSITIVE_INFINITY;
        if (ao !== bo) return ao - bo;
        if (b.stars !== a.stars) return b.stars - a.stars;
        if (b.downloads !== a.downloads) return b.downloads - a.downloads;
        return a.name.localeCompare(b.name);
      });

      for (const p of projects) {
        const projectCard = await createProjectCard(
          p.name,
          p.description,
          p.topics,
          p.repoUrl,
          p.homepage,
          p.image,
          p.stars,
          p.forks,
        );
        projectsContainer.appendChild(projectCard);
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
      project.forks,
    );
    projectsContainer.appendChild(projectCard);
  }
}

async function addNonGithubProjects() {
  const projectsContainer = document.getElementById("projects-container");
  const sampleProjects = [
    {
      name: "Be a Better Friend",
      description:
        "Never forget what matters most about the people you care about",
      topics: ["app"],
      demoUrl: "https://beabetterfriend.app",
      iconClass: "../assets/projects/betterfriend.png",
    },
  ];

  for (const project of sampleProjects) {
    const projectCard = await createProjectCard(
      project.name,
      project.description,
      project.topics,
      project?.repoUrl || null,
      project?.demoUrl,
      project?.iconClass || "https",
      project?.stars || null,
      project?.forks || null,
    );
    console.log(projectCard);
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
  forks = 0,
) {
  const card = document.createElement("div");
  card.className = "project-card";

  // Project image/icon
  const imageDiv = document.createElement("div");
  imageDiv.className = "project-image";

  const image = document.createElement("img");
  image.className = "project-cover";
  image.src = iconClass;
  image.alt = `${name} Image`;
  imageDiv.appendChild(image);

  // Project content
  const contentDiv = document.createElement("div");
  contentDiv.className = "project-content";

  const background = document.createElement("div");
  background.className = "project-background";
  contentDiv.appendChild(background);

  // Project title
  const title = document.createElement("h3");
  title.innerHTML = `<span>${name}</span>`;
  const statsDiv = document.createElement("div");

  if (stars !== null && forks !== null) {
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
  }

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
  if (repoUrl) {
    const githubLink = document.createElement("a");
    githubLink.setAttribute("aria-label", `${name}'s Code`);
    githubLink.href = repoUrl;
    githubLink.target = "_blank";
    githubLink.innerHTML = `<span><svg class="icon"><use href="./assets/icons.svg#code"></use></svg></span>`;
    linksDiv.appendChild(githubLink);
  }

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

  fetch("https://blog.tomasmartinez.xyz/feed_json_created.json")
    .then((response) => response.text())
    .then((data) => {
      try {
        const blog = JSON.parse(data);
        if (!blogPostsContainer) {
          return;
        }
        blogPostsContainer.innerHTML = "";

        const items = Array.isArray(blog?.items) ? blog.items : [];
        if (items.length === 0) {
          blogPostsContainer.remove();
          return;
        }

        blogPostsContainer.innerHTML = `<h2 class="blog-title"><span>Latest Posts</span></h2>`;
        // Create cards for each post
        for (const post of items.slice(0, 2)) {
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
						  <p class="card-author">By ${post.authors && post.authors[0] ? post.authors[0].name : ""}</p>
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
    let response = await fetch(url, options);
    if (!response.ok) {
      response = await fetch(corsProxyUrl, options);
    }

    const data = await response.json();
    const statistics = data.results[0].extensions[0].statistics;
    const installStat = statistics.find(
      (stat) => stat.statisticName === "install",
    );
    return installStat ? Number.parseInt(installStat.value) : 0;
  } catch (error) {
    console.error("Error fetching VS Code stats:", error);
    return 0;
  }
}
