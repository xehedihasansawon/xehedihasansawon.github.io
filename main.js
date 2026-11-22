// Shared script for every page: menu, active nav, reveal, lightbox,
// copy email and the project inquiry form. No server, no database.

const WHATSAPP_NUMBER = "60174723951";
const EMAIL_ADDRESS = "xehedi@gmail.com";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

document.documentElement.classList.add("js");

/* ---------- Intro loader: plays on every load, removed once it is done ---------- */
const loader = $("#loader");
if (loader) setTimeout(() => loader.remove(), 2100);

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

/* ---------- Motion: reveal on scroll, count-up numbers, reading progress ---------- */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const motionOK = !reduceMotion && "IntersectionObserver" in window;

// Every page gets the same reveal: tag the parts that rise in (pages only mark a few by hand).
const revealTargets = {
  up: ".section-head, .case-section-head, .case-intro-grid > *, .case-chapter, .case-jump, .case-next-inner, .about-grid > :first-child, .about-copy > p, .tools-wrap > :first-child, .service, .project, .showcase, .tool-row-label, .step, .about-facts > *, .role-card, .case-summary-grid > *, .case-stats > *, .format-copy, .cta-band, .contact-card, .form, .footer-grid > *, .footer-bottom",
  pop: ".tool",
  zoom: ".format-feature .case-image-button, .format-feature .art-stack, .format-feature .art-pair"
};
if (motionOK) {
  // these wrappers used to fade as one block; now their children come in one by one
  $$(".tool-rows, .timeline, .about-copy").forEach((el) => el.removeAttribute("data-reveal"));
  Object.entries(revealTargets).forEach(([kind, selector]) => {
    $$(selector).forEach((el) => { if (!el.hasAttribute("data-reveal")) el.setAttribute("data-reveal", kind === "up" ? "" : kind); });
  });
  // never fade something twice: untag anything that sits inside another tagged element
  $$("[data-reveal] [data-reveal]").forEach((el) => el.removeAttribute("data-reveal"));
}

const revealItems = $$("[data-reveal]");
if (motionOK) {
  const reveal = new IntersectionObserver((entries) => {
    const shown = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target)
      .sort((x, y) => (x.compareDocumentPosition(y) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    // things that arrive together come in one after another; the last is never more than 0.65s late
    const step = shown.length > 1 ? Math.min(90, 650 / (shown.length - 1)) : 0;
    shown.forEach((el, i) => {
      const delay = Math.round(i * step);
      el.style.setProperty("--delay", delay + "ms");
      el.classList.add("is-visible");
      reveal.unobserve(el);
      // once it is in place, hand the element back to its own hover transitions
      setTimeout(() => { el.removeAttribute("data-reveal"); el.style.removeProperty("--delay"); }, delay + 1000);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  revealItems.forEach((item) => reveal.observe(item));

  // the timeline line draws itself when the journey comes into view
  const drawObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-drawn");
    drawObserver.unobserve(entry.target);
  }), { threshold: 0.2 });
  $$(".timeline").forEach((el) => drawObserver.observe(el));

  // stats count up from zero (small numbers only, so years like 2018 stay as they are)
  const countUp = (el) => {
    const [, digits, rest] = el.textContent.trim().match(/^(\d+)(.*)$/);
    const end = Number(digits);
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 1200);
      el.textContent = Math.round(end * (1 - (1 - t) ** 3)) + rest;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const countObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    countObserver.unobserve(entry.target);
    // the hero stats wait for the intro, the rest start as they appear
    setTimeout(() => countUp(entry.target), Math.max(150, 1500 - performance.now()));
  }), { threshold: 0.6 });
  $$(".hero-facts strong, .case-stats strong")
    .filter((el) => /^\d{1,3}\D*$/.test(el.textContent.trim()))
    .forEach((el) => countObserver.observe(el));

  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.append(progress);
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
  $$(".timeline").forEach((el) => el.classList.add("is-drawn"));
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
lightbox?.addEventListener("close", () => {
  lightboxImage.removeAttribute("src"); // so the next design never flashes the previous one
  lastTrigger?.focus();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && mobileNav?.classList.contains("is-open")) {
    setMenu(false);
    menuButton?.focus();
  }
});

/* ---------- Copy email ---------- */
$$("[data-copy]").forEach((button) => {
  const label = button.textContent;
  let timer;
  button.addEventListener("click", async () => {
    clearTimeout(timer);
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      button.textContent = "Copied";
    } catch {
      window.location.href = `mailto:${button.dataset.copy}`;
    }
    timer = setTimeout(() => { button.textContent = label; }, 1800);
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
