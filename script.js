const header = document.querySelector("[data-header]");
const scrollProgress = document.querySelector("[data-scroll-progress]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main section[id], main section[aria-labelledby]");
const certificateCards = document.querySelectorAll("[data-certificate-image]");
const certificateModal = document.querySelector("[data-certificate-modal]");
const certificatePreview = document.querySelector("[data-certificate-preview]");
const certificateHeading = document.querySelector("[data-certificate-heading]");
const certificateCloseButtons = document.querySelectorAll("[data-certificate-close]");
const contactForm = document.querySelector("[data-contact-form]");
const sendButton = document.querySelector("[data-send-button]");
const formStatus = document.querySelector("[data-form-status]");
const backToTop = document.querySelector("[data-back-to-top]");
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 20);
};

const updateScrollProgress = () => {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  scrollProgress.style.transform = `scaleX(${Math.min(progress, 1)})`;
  backToTop.classList.toggle("is-visible", window.scrollY > 520);
};

updateHeader();
updateScrollProgress();
window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);

const closeNavigation = () => {
  document.body.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
};

navToggle.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeNavigation);
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: motionQuery.matches ? "auto" : "smooth" });
});

const revealItems = document.querySelectorAll(
  ".section-heading, .intro-grid, .project-card, .skill-group, .timeline article, .certificate-card, .contact-heading, .contact-form"
);

revealItems.forEach((item) => {
  item.dataset.reveal = "";
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const id = entry.target.id;

      if (!id || !entry.isIntersecting) {
        return;
      }

      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
      });
    });
  },
  { rootMargin: "-35% 0px -55% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));

const tiltCards = document.querySelectorAll(".project-card, .skill-group, .timeline article");

const resetTilt = (card) => {
  card.style.setProperty("--tilt-x", "0deg");
  card.style.setProperty("--tilt-y", "0deg");
  card.style.setProperty("--glare-opacity", "0");
};

tiltCards.forEach((card) => {
  if (motionQuery.matches) {
    return;
  }

  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const tiltX = (0.5 - y) * 5;
    const tiltY = (x - 0.5) * 6;

    card.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
    card.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
    card.style.setProperty("--glare-x", `${(x * 100).toFixed(0)}%`);
    card.style.setProperty("--glare-y", `${(y * 100).toFixed(0)}%`);
    card.style.setProperty("--glare-opacity", "0.22");
  });

  card.addEventListener("pointerleave", () => resetTilt(card));
});

const closeCertificateModal = () => {
  certificateModal.hidden = true;
  document.body.classList.remove("modal-open");
  certificatePreview.src = "";
  certificatePreview.alt = "";
};

certificateCards.forEach((card) => {
  card.addEventListener("click", () => {
    certificateHeading.textContent = card.dataset.certificateTitle;
    certificatePreview.src = card.dataset.certificateImage;
    certificatePreview.alt = card.dataset.certificateAlt;
    certificateModal.hidden = false;
    document.body.classList.add("modal-open");
  });
});

certificateCloseButtons.forEach((button) => {
  button.addEventListener("click", closeCertificateModal);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !certificateModal.hidden) {
    closeCertificateModal();
  }

  if (event.key === "Escape" && document.body.classList.contains("nav-open")) {
    closeNavigation();
  }
});

const contactFields = contactForm.querySelectorAll("input:not([type='hidden']), textarea");

const updateFieldState = (field) => {
  field.closest("label").classList.toggle("is-filled", field.value.trim().length > 0);
};

contactFields.forEach((field) => {
  updateFieldState(field);
  field.addEventListener("input", () => {
    updateFieldState(field);

    if (formStatus.textContent) {
      formStatus.textContent = "";
    }
  });
});

contactForm.addEventListener("submit", () => {
  sendButton.textContent = "Sending...";
  sendButton.disabled = true;
  formStatus.textContent = "Opening a secure form delivery page. Please complete the email verification if prompted.";
});
