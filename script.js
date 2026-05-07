const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const backToTop = document.getElementById("backToTop");
const year = document.getElementById("year");
const contactForm = document.getElementById("contactForm");

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
    if (navLinks) {
      navLinks.classList.remove("active");
    }
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

  reveals.forEach((element, index) => {
    const windowHeight = window.innerHeight;
    const elementTop = element.getBoundingClientRect().top;
    const revealPoint = 120;

    if (elementTop < windowHeight - revealPoint) {
      setTimeout(() => {
        element.classList.add("active");
      }, index * 80);
    }
  });
}

function activateProjectCards() {
  const cards = document.querySelectorAll(".project-card");

  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add("active");
    }, index * 140);
  });
}

revealElements();
toggleBackToTop();
activateProjectCards();
