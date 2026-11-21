// Shared script for every page: menu, active nav, reveal, lightbox,
// copy email and the project inquiry form. No server, no database.

const WHATSAPP_NUMBER = "60174723951";
const EMAIL_ADDRESS = "xehedi@gmail.com";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

document.documentElement.classList.add("js");

/* ---------- Header: shadow on scroll + mobile menu ---------- */
const header = $(".site-header");
const onScroll = () => header?.classList.toggle("is-scrolled", window.scrollY > 8);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const menuButton = $("#menuButton");
const mobileNav = $("#mobileNav");

const setMenu = (open) => {
  if (!menuButton || !mobileNav) return;
  mobileNav.classList.toggle("is-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
};

menuButton?.addEventListener("click", () => setMenu(!mobileNav.classList.contains("is-open")));
$$("a", mobileNav || undefined).forEach((link) => link.addEventListener("click", () => setMenu(false)));

/* ---------- Active nav link (homepage sections) ---------- */
const navLinks = $$('.nav a[href^="#"]');
if (navLinks.length && "IntersectionObserver" in window) {
  const byId = new Map(navLinks.map((link) => [link.getAttribute("href").slice(1), link]));
  const sections = [...byId.keys()].map((id) => document.getElementById(id)).filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => link.classList.remove("is-active"));
      byId.get(entry.target.id)?.classList.add("is-active");
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((section) => spy.observe(section));
}

/* ---------- Reveal on scroll ---------- */
const revealItems = $$("[data-reveal]");
if ("IntersectionObserver" in window) {
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      reveal.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  revealItems.forEach((item) => reveal.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

/* ---------- Lightbox ---------- */
const lightbox = $("#lightbox");
const lightboxImage = $("#lightboxImage");
const lightboxCaption = $("#lightboxCaption");
let lastTrigger = null;

$$("[data-lightbox]").forEach((trigger) => {
  trigger.setAttribute("aria-haspopup", "dialog");
  trigger.addEventListener("click", () => {
    if (!lightbox?.showModal) return;
    lastTrigger = trigger;
    const img = $("img", trigger);
    lightboxImage.src = trigger.dataset.lightbox;
    lightboxImage.alt = img?.alt || "";
    lightboxCaption.textContent = trigger.dataset.caption || img?.alt || "";
    lightbox.showModal();
  });
});

$("#lightboxClose")?.addEventListener("click", () => lightbox.close());
lightbox?.addEventListener("click", (event) => { if (event.target === lightbox) lightbox.close(); });
lightbox?.addEventListener("close", () => lastTrigger?.focus());

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && mobileNav?.classList.contains("is-open")) {
    setMenu(false);
    menuButton?.focus();
  }
});

/* ---------- Copy email ---------- */
$$("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const label = button.textContent;
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      button.textContent = "Copied";
    } catch {
      window.location.href = `mailto:${button.dataset.copy}`;
    }
    setTimeout(() => { button.textContent = label; }, 1800);
  });
});

/* ---------- Project inquiry form ---------- */
const form = $("#inquiryForm");
const formMessage = $("#inquiryFormMessage");

if (form && formMessage) {
  const setMessage = (text, state = "") => {
    formMessage.textContent = text;
    formMessage.dataset.state = state;
  };
  const value = (name, max) => String(form.elements[name]?.value || "").trim().slice(0, max);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const channel = event.submitter?.value === "email" ? "email" : "whatsapp";
    const name = value("name", 100);
    const company = value("company", 120);
    const projectType = value("project_type", 100);
    const budget = value("budget", 100);
    const timeline = value("timeline", 100);
    const brief = value("message", 3000);

    if (name.length < 2) { setMessage("Please enter your name.", "error"); form.elements.name.focus(); return; }
    if (!projectType) { setMessage("Please choose a project type.", "error"); form.elements.project_type.focus(); return; }
    if (brief.length < 20) { setMessage("Tell me a little more about the project.", "error"); form.elements.message.focus(); return; }

    const text = [
      `Hi Mehedi, I'm ${name}${company ? ` from ${company}` : ""}.`,
      "",
      `Project type: ${projectType}`,
      ...(budget ? [`Budget: ${budget}`] : []),
      ...(timeline ? [`Timeline: ${timeline}`] : []),
      "",
      brief
    ].join("\n");

    if (channel === "email") {
      window.location.href = `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(`Project inquiry: ${projectType}`)}&body=${encodeURIComponent(text)}`;
      setMessage("Your email app should open with the message ready. Just press send.", "success");
    } else {
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      setMessage("WhatsApp opened with your message ready. Just press send.", "success");
    }
  });

  form.addEventListener("input", () => { if (formMessage.dataset.state === "error") setMessage(""); });
}
