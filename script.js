const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const backToTop = document.getElementById("backToTop");
const year = document.getElementById("year");
const contactForm = document.getElementById("contactForm");
const projectGrid = document.getElementById("projectGrid");

const githubUsername = "fermantonoihsan";

const featuredProjects = ["camping-cuy"];

const figmaLinks = {
  "camping-cuy": "https://www.figma.com/proto/aLVBN5ZYiQhvnvnqGDS69k/Camping-Cuy?page-id=0%3A1&type=design&node-id=1-55&viewport=300%2C323%2C0.5&t=v7dAYiuxGT8s8H1J-1&scaling=scale-down&starting-point-node-id=27%3A22"
};

if (year) {
  year.textContent = new Date().getFullYear();
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

window.addEventListener("scroll", () => {
  toggleBackToTop();
  revealElements();
});

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      alert("Mohon lengkapi semua field.");
      return;
    }

    const subject = encodeURIComponent(`Pesan dari ${name}`);
    const body = encodeURIComponent(
      `Nama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`
    );

    window.location.href = `mailto:emailkamu@example.com?subject=${subject}&body=${body}`;
  });
}

function toggleBackToTop() {
  if (!backToTop) return;

  if (window.scrollY > 350) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
}

function revealElements() {
  const reveals = document.querySelectorAll(".reveal");

  reveals.forEach((element) => {
    const windowHeight = window.innerHeight;
    const elementTop = element.getBoundingClientRect().top;
    const revealPoint = 120;

    if (elementTop < windowHeight - revealPoint) {
      element.classList.add("active");
    }
  });
}

async function loadGithubProjects() {
  if (!projectGrid) return;

  try {
    const response = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=12`
    );

    if (!response.ok) {
      throw new Error("Gagal mengambil data GitHub.");
    }

    const repos = await response.json();

    const filteredRepos = repos
      .filter((repo) => !repo.fork)
      .filter((repo) => repo.name !== "html-portofolio")
      .sort((a, b) => {
        const aFeatured = featuredProjects.includes(a.name) ? 1 : 0;
        const bFeatured = featuredProjects.includes(b.name) ? 1 : 0;
        return bFeatured - aFeatured;
      });

    if (filteredRepos.length === 0) {
      projectGrid.innerHTML = `<p class="loading-text">Belum ada project publik.</p>`;
      return;
    }

    projectGrid.innerHTML = filteredRepos
      .map((repo) => createProjectCard(repo))
      .join("");

    animateProjectCards();
  } catch (error) {
    projectGrid.innerHTML = `
      <p class="loading-text">
        Project belum bisa dimuat. Coba refresh halaman.
      </p>
    `;
    console.error(error);
  }
}

function createProjectCard(repo) {
  const projectTitle = formatRepoName(repo.name);

  const descriptions = {
    "camping-cuy":
      "Aplikasi project tim Bangkit Academy yang berfokus pada informasi, pengalaman, dan rekomendasi aktivitas camping untuk pengguna."
  };

  const description =
    descriptions[repo.name] ||
    repo.description ||
    "Project GitHub yang saya kembangkan sebagai bagian dari portfolio saya.";

  const language = repo.language || "Code";
  const imagePath = `assets/${repo.name}.png`;

  const figmaButton = figmaLinks[repo.name]
    ? `
      <a href="${figmaLinks[repo.name]}" target="_blank" class="btn primary">
        Figma Prototype
      </a>
    `
    : "";

  const homepageButton = repo.homepage
    ? `
      <a href="${repo.homepage}" target="_blank" class="btn primary">
        Live Demo
      </a>
    `
    : "";

  return `
    <article class="project-card">
      <div class="project-img">
        <img 
          src="${imagePath}" 
          alt="${projectTitle}"
          onerror="showProjectPlaceholder(this, '${repo.name}')"
        >
      </div>

      <div class="project-content">
        <h3>${projectTitle}</h3>

        <p>${description}</p>

        <div class="project-tech">
          <span>${language}</span>
          <span>GitHub</span>
          ${featuredProjects.includes(repo.name) ? "<span>Featured</span>" : ""}
        </div>

        <div class="project-actions">
          ${figmaButton}
          ${homepageButton}
          <a href="${repo.html_url}" target="_blank" class="btn secondary">
            GitHub Repo
          </a>
        </div>
      </div>
    </article>
  `;
}

function showProjectPlaceholder(imageElement, repoName) {
  const parent = imageElement.parentElement;
  parent.innerHTML = `<div class="project-placeholder">${getInitials(repoName)}</div>`;
}

function formatRepoName(name) {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getInitials(name) {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}

function animateProjectCards() {
  const cards = document.querySelectorAll(".project-card");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("active");
          }, index * 120);
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  cards.forEach((card) => observer.observe(card));
}

revealElements();
toggleBackToTop();
loadGithubProjects();
