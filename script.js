const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const backToTop = document.getElementById("backToTop");
const year = document.getElementById("year");
const contactForm = document.getElementById("contactForm");
const projectGrid = document.getElementById("projectGrid");

const githubUsername = "fermantonoihsan";

const manualProjects = [
  {
    name: "camping-cuy",
    title: "Camping Cuy",
    description:
      "Aplikasi project tim Bangkit Academy yang berfokus pada informasi, pengalaman, dan rekomendasi aktivitas camping untuk pengguna.",
    language: "JavaScript",
    image: "assets/camping-cuy.png",
    github: "https://github.com/fermantonoihsan/camping-cuy",
    figma:
      "https://www.figma.com/proto/aLVBN5ZYiQhvnvnqGDS69k/Camping-Cuy?page-id=0%3A1&type=design&node-id=1-55&viewport=300%2C323%2C0.5&t=v7dAYiuxGT8s8H1J-1&scaling=scale-down&starting-point-node-id=27%3A22"
  }
];

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

    if (elementTop < windowHeight - 120) {
      element.classList.add("active");
    }
  });
}

async function loadGithubProjects() {
  if (!projectGrid) return;

  renderProjects(manualProjects);

  try {
    const response = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=12`
    );

    if (!response.ok) {
      throw new Error("GitHub API gagal dimuat.");
    }

    const repos = await response.json();

    const githubProjects = repos
      .filter((repo) => !repo.fork)
      .filter((repo) => repo.name !== "html-portofolio")
      .filter((repo) => repo.name !== "camping-cuy")
      .map((repo) => ({
        name: repo.name,
        title: formatRepoName(repo.name),
        description:
          repo.description ||
          "Project GitHub yang saya kembangkan sebagai bagian dari portfolio saya.",
        language: repo.language || "Code",
        image: `assets/${repo.name}.png`,
        github: repo.html_url,
        figma: "",
        demo: repo.homepage || ""
      }));

    renderProjects([...manualProjects, ...githubProjects]);
  } catch (error) {
    console.warn(error);
    renderProjects(manualProjects);
  }
}

function renderProjects(projects) {
  projectGrid.innerHTML = projects.map(createProjectCard).join("");
  animateProjectCards();
}

function createProjectCard(project) {
  const figmaButton = project.figma
    ? `<a href="${project.figma}" target="_blank" class="btn primary">Figma Prototype</a>`
    : "";

  const demoButton = project.demo
    ? `<a href="${project.demo}" target="_blank" class="btn primary">Live Demo</a>`
    : "";

  return `
    <article class="project-card">
      <div class="project-img">
        <img 
          src="${project.image}" 
          alt="${project.title}"
          onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=&quot;project-placeholder&quot;>${getInitials(project.name)}</div>';"
        >
      </div>

      <div class="project-content">
        <h3>${project.title}</h3>
        <p>${project.description}</p>

        <div class="project-tech">
          <span>${project.language}</span>
          <span>GitHub</span>
          ${project.name === "camping-cuy" ? "<span>Bangkit Academy</span>" : ""}
        </div>

        <div class="project-actions">
          ${figmaButton}
          ${demoButton}
          <a href="${project.github}" target="_blank" class="btn secondary">
            GitHub Repo
          </a>
        </div>
      </div>
    </article>
  `;
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

  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add("active");
    }, index * 120);
  });
}

revealElements();
toggleBackToTop();
loadGithubProjects();
