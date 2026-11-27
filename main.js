// Shared script for every page: language and theme, menu, active nav, motion, lightbox, showcase,
// copy email, the project inquiry form and the optional backend (saved briefs, reviews, page views).

const WHATSAPP_NUMBER = "60174723951";
const EMAIL_ADDRESS = "xehedi@gmail.com";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

document.documentElement.classList.add("js");

const root = document.documentElement;
const store = {
  get: (key) => { try { return localStorage.getItem(key); } catch { return null; } },
  set: (key, value) => { try { localStorage.setItem(key, value); } catch { /* private mode: just don't remember */ } }
};

/* ---------- Language: English (in the HTML) or Bangla (assets/i18n/bn.json) ----------
   Bangla is keyed by the English text itself, so pages need no extra markup.
   A "unit" is a run of text, or a whole element when it mixes text with inline tags
   (strong, span, a...) so the Bangla word order can differ from the English. */
const I18N_VERSION = "v5-20261127";
let lang = "en";
let dict = null;
let originals = null;
const t = (text) => (lang === "bn" && dict && dict[text]) || text;

// i18n-collector:start
const I18N_INLINE = new Set(["STRONG", "EM", "B", "I", "SPAN", "A", "BR", "SMALL", "SUP", "SUB"]);
const I18N_SKIP = "script, style, svg, noscript, template, .loader, .lang-switch, [translate='no']";
const I18N_ATTRS = ["alt", "aria-label", "title", "placeholder", "data-caption"];
const normText = (s) => s.replace(/\s+/g, " ").trim();
const isPlainInline = (el) => I18N_INLINE.has(el.tagName) && !el.querySelector("svg, img") && [...el.children].every(isPlainInline);
const collectUnits = (start = document.body) => {
  const units = [];
  const walk = (el) => {
    if (el.matches(I18N_SKIP)) return;
    const kids = [...el.childNodes];
    const texts = kids.filter((n) => n.nodeType === 3 && n.textContent.trim());
    const elements = kids.filter((n) => n.nodeType === 1);
    if (texts.length && elements.length && elements.every(isPlainInline)) {
      units.push({ el, key: normText(el.innerHTML) });
      return;
    }
    texts.forEach((node) => units.push({ node, key: normText(node.textContent) }));
    elements.forEach(walk);
  };
  walk(start);
  return units;
};
const collectAttrs = (start = document.body) => [...start.querySelectorAll("*")]
  .filter((el) => !el.closest(I18N_SKIP) && !el.matches(".theme-toggle, #menuButton"))
  .flatMap((el) => I18N_ATTRS.filter((name) => el.getAttribute(name)?.trim()).map((name) => ({ el, name, key: normText(el.getAttribute(name)), value: el.getAttribute(name) })));
// i18n-collector:end

const langButtons = $$(".lang-switch [data-lang]");
const langListeners = [];

async function setLanguage(next, remember = true) {
  if (next === "bn" && !dict) {
    try {
      const response = await fetch(new URL("assets/i18n/bn.json?v=" + I18N_VERSION, import.meta.url));
      if (!response.ok) throw new Error(String(response.status));
      dict = await response.json();
    } catch {
      next = "en";
    }
  }
  if (next !== lang || next === "bn") {
    if (!originals) {
      originals = {
        units: collectUnits().map((u) => ({ ...u, value: u.el ? u.el.innerHTML : u.node.textContent })),
        attrs: collectAttrs(),
        title: document.title
      };
    }
    lang = next;
    originals.units.forEach((u) => {
      const bangla = lang === "bn" ? dict[u.key] : null;
      if (u.el) { u.el.innerHTML = bangla ?? u.value; return; }
      // keep the spaces around the words, so inline layout does not change
      const [, lead, trail] = u.value.match(/^(\s*)[\s\S]*?(\s*)$/);
      u.node.textContent = bangla ? lead + bangla + trail : u.value;
    });
    originals.attrs.forEach((a) => a.el.setAttribute(a.name, (lang === "bn" && dict[a.key]) || a.value));
    document.title = (lang === "bn" && dict[normText(originals.title)]) || originals.title;
  }
  root.lang = lang;
  root.dataset.lang = lang;
  root.classList.add("i18n-ready");
  langButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.lang === lang)));
  langListeners.forEach((fn) => fn(lang));
  if (remember) store.set("lang", lang);
}

langButtons.forEach((button) => button.addEventListener("click", () => setLanguage(button.dataset.lang)));
if (store.get("lang") === "bn") setLanguage("bn", false);
else root.classList.add("i18n-ready");
setTimeout(() => root.classList.add("i18n-ready"), 3000); // never keep the page hidden if Bangla fails to load

/* ---------- Theme: dark green by default, light on request, remembered ---------- */
const themeButton = $(".theme-toggle");
const themeMeta = $('meta[name="theme-color"]');
const currentTheme = () => (root.dataset.theme === "light" ? "light" : "dark");
const applyTheme = (theme, remember = false) => {
  if (theme === "light") root.dataset.theme = "light";
  else delete root.dataset.theme;
  themeMeta?.setAttribute("content", theme === "light" ? "#f3f7f4" : "#041718");
  themeButton?.setAttribute("aria-label", t(theme === "light" ? "Switch to dark mode" : "Switch to light mode"));
  if (remember) store.set("theme", theme);
};
applyTheme(currentTheme());
themeButton?.addEventListener("click", () => applyTheme(currentTheme() === "light" ? "dark" : "light", true));
langListeners.push(() => applyTheme(currentTheme()));

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
  menuButton.setAttribute("aria-label", t(open ? "Close menu" : "Open menu"));
};

menuButton?.addEventListener("click", () => setMenu(!mobileNav.classList.contains("is-open")));
$$("a", mobileNav || undefined).forEach((link) => link.addEventListener("click", () => setMenu(false)));
langListeners.push(() => setMenu(mobileNav?.classList.contains("is-open") || false));

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
  up: ".section-head, .case-section-head, .case-intro-grid > *, .case-chapter, .case-jump, .case-next-inner, .about-grid > :first-child, .about-copy > p, .tools-wrap > :first-child, .service, .project, .showcase, .tool-row-label, .about-facts > *, .role-card, .case-summary-grid > *, .case-stats > *, .format-copy, .cta-band, .contact-card, .form, .footer-grid > *, .footer-bottom",
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

  // the journey: the red line draws itself with a glowing head, and each stop lights up as the line
  // reaches it. Side by side it plays once; on phones (one column) it follows the scroll.
  $$(".timeline").forEach((timeline) => {
    const steps = $$(".step", timeline);
    const comet = document.createElement("span");
    comet.className = "timeline-comet";
    comet.setAttribute("aria-hidden", "true");
    timeline.append(comet);
    timeline.classList.add("motion");
    let p = 0;
    let done = false;
    const setP = (v) => { p = v; timeline.style.setProperty("--p", v.toFixed(4)); };
    setP(0);
    const geometry = () => {
      const box = timeline.getBoundingClientRect();
      const hidden = getComputedStyle(timeline, "::after").display === "none";
      const vertical = getComputedStyle(timeline).gridTemplateColumns.trim().split(/\s+/).length === 1;
      const start = vertical ? box.top + 8 : box.left + 8;
      const length = Math.max(1, (vertical ? box.height : box.width) - 16);
      const stops = steps.map((s) => { const r = s.getBoundingClientRect(); return ((vertical ? r.top : r.left) + 9 - start) / length; });
      return { hidden, vertical, start, length, stops };
    };
    const lightUpTo = (v, stops) => steps.forEach((s, i) => { if (v >= stops[i] - 0.002) s.classList.add("is-lit"); });
    const finish = () => {
      done = true;
      setP(1);
      steps.forEach((s) => s.classList.add("is-lit"));
      timeline.classList.remove("is-drawing");
      window.removeEventListener("scroll", schedule);
    };
    // phones: the line follows the scroll and never goes back
    const onScroll = () => {
      if (done) return;
      const g = geometry();
      if (!g.vertical) { finish(); return; }
      const target = Math.min(1, Math.max(0, (innerHeight * 0.75 - g.start) / g.length));
      if (target > p) { setP(target); lightUpTo(target, g.stops); timeline.classList.add("is-drawing"); }
      if (p >= 1) finish();
    };
    let queued = false;
    function schedule() { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; onScroll(); }); }
    const play = () => {
      const g = geometry();
      if (g.hidden) { steps.forEach((s, i) => setTimeout(() => s.classList.add("is-lit"), i * 140)); done = true; setP(1); return; }
      if (g.vertical) { window.addEventListener("scroll", schedule, { passive: true }); onScroll(); return; }
      timeline.classList.add("is-drawing");
      const t0 = performance.now();
      const ease = (x) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2);
      const tick = (now) => {
        const x = Math.min(1, (now - t0) / 1900);
        setP(ease(x));
        lightUpTo(p, g.stops);
        if (x < 1) requestAnimationFrame(tick); else finish();
      };
      requestAnimationFrame(tick);
    };
    const startObserver = new IntersectionObserver((entries) => {
      const entry = entries[entries.length - 1];
      if (!entry.isIntersecting) return;
      const g = geometry();
      if (!g.vertical && !g.hidden && entry.intersectionRatio < 0.3) return;
      startObserver.disconnect();
      play();
    }, { threshold: [0, 0.3] });
    startObserver.observe(timeline);
  });

  // stats count up from zero (small numbers only, so years like 2018 stay as they are)
  const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
  const countUp = (el) => {
    const node = [...el.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());
    const match = node?.textContent.match(/^(\s*)([0-9০-৯]+)([\s\S]*)$/);
    if (!match) return;
    const finalText = node.textContent;
    const [, lead, digits, rest] = match;
    const bangla = /[০-৯]/.test(digits);
    const end = Number([...digits].map((d) => (bangla ? BN_DIGITS.indexOf(d) : d)).join(""));
    const start = performance.now();
    let last = finalText;
    const tick = (now) => {
      if (node.textContent !== last) return; // the language was switched mid-count: leave the new text alone
      const p = Math.min(1, (now - start) / 1200);
      const value = String(Math.round(end * (1 - (1 - p) ** 3)));
      last = p < 1 ? lead + (bangla ? value.replace(/\d/g, (d) => BN_DIGITS[d]) : value) + rest : finalText;
      node.textContent = last;
      if (p < 1) requestAnimationFrame(tick);
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
    .filter((el) => /^[0-9০-৯]{1,3}[^0-9০-৯]*$/.test(el.textContent.trim()))
    .forEach((el) => countObserver.observe(el));

  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.append(progress);
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

/* ---------- Services: a soft light follows the pointer ---------- */
$(".services-grid")?.addEventListener("pointermove", (event) => {
  const card = event.target.closest(".service");
  if (!card) return;
  const box = card.getBoundingClientRect();
  card.style.setProperty("--mx", Math.round(event.clientX - box.left) + "px");
  card.style.setProperty("--my", Math.round(event.clientY - box.top) + "px");
});

/* ---------- Backend (Cloudflare Worker + D1): saved briefs, reviews, visitor count ----------
   Everything here is optional: if the API is down, the form still opens WhatsApp or email,
   the reviews section stays hidden and nothing else changes. */
const API_BASE = location.hostname === "localhost" ? "http://localhost:8787" : "https://xehedihasansawon-api.xehedi.workers.dev";
// text/plain JSON is a "simple" request: no CORS preflight, and keepalive lets it finish while WhatsApp/email opens
const sendToApi = (path, data) => fetch(API_BASE + path, { method: "POST", body: JSON.stringify(data), keepalive: true });
const currentLang = () => (document.documentElement.lang === "bn" ? "bn" : "en");

// Turnstile (Cloudflare's "not a robot" check): loads when a form is first used, invisible unless a click is needed
const TURNSTILE_SITEKEY = "0x4AAAAAAGPTyMVXqcfZ1uty";
let turnstileLoading = null;
const loadTurnstile = () => turnstileLoading || (turnstileLoading = new Promise((resolve) => {
  window.onTurnstileReady = () => resolve(window.turnstile);
  const script = document.createElement("script");
  script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileReady";
  script.async = true;
  script.onerror = () => resolve(null);
  document.head.append(script);
}));
const turnstileIds = new Map();
const armTurnstile = async (formEl) => {
  const box = formEl && $("[data-turnstile]", formEl);
  if (!box || turnstileIds.has(formEl)) return;
  turnstileIds.set(formEl, null);
  const ts = await loadTurnstile();
  if (!ts) { turnstileIds.delete(formEl); return; } // blocked or offline: send without it
  turnstileIds.set(formEl, ts.render(box, { sitekey: TURNSTILE_SITEKEY, appearance: "interaction-only", size: "flexible", theme: root.dataset.theme === "light" ? "light" : "dark" }));
};
const turnstileToken = (formEl) => { const id = turnstileIds.get(formEl); try { return id != null ? window.turnstile.getResponse(id) || "" : ""; } catch { return ""; } };
const resetTurnstile = (formEl) => { const id = turnstileIds.get(formEl); try { if (id != null) window.turnstile.reset(id); } catch { /* ignore */ } };
// the check takes a moment after the first click in a form (or needs a tick): wait for its token a little
const waitForToken = async (formEl, ms) => {
  const end = Date.now() + ms;
  let token = turnstileToken(formEl);
  while (!token && turnstileIds.has(formEl) && Date.now() < end) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    token = turnstileToken(formEl);
  }
  return token;
};

// one page view, no cookies (the Worker keeps only a daily hash). The owner's own visits are not counted:
// the admin's "Open my site" link adds ?notrack=1 once, and this browser remembers it (?notrack=0 undoes it).
const trackParam = new URLSearchParams(location.search).get("notrack");
if (trackParam === "1" || trackParam === "0") {
  store.set("notrack", trackParam);
  const clean = new URL(location.href);
  clean.searchParams.delete("notrack");
  history.replaceState(history.state, "", clean.pathname + clean.search + clean.hash);
}
if (!navigator.webdriver && navigator.sendBeacon && store.get("notrack") !== "1") {
  const page = $("main.simple-page") ? "/404" : location.pathname.replace(/\/index\.html$/, "/");
  try { navigator.sendBeacon(API_BASE + "/hit", JSON.stringify({ path: page, ref: document.referrer, lang: store.get("lang") === "bn" ? "bn" : "en" })); } catch { /* blocked: fine */ }
}

// approved reviews on the homepage
const reviewsSection = $("#reviews");
if (reviewsSection) {
  fetch(API_BASE + "/reviews").then((r) => (r.ok ? r.json() : null)).then((data) => {
    const reviews = data?.reviews || [];
    if (!reviews.length) return;
    const make = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; };
    $("#reviewsGrid").replaceChildren(...reviews.map((r) => {
      const card = make("article", "card review");
      if (r.rating) { const s = make("div", "review-stars", "★".repeat(r.rating) + "☆".repeat(5 - r.rating)); s.setAttribute("aria-label", r.rating + " / 5"); card.append(s); }
      card.append(make("p", "review-text", r.message));
      const by = make("div", "review-by");
      by.append(make("strong", "", r.name));
      if (r.role) by.append(make("small", "", r.role));
      card.append(by);
      return card;
    }));
    reviewsSection.hidden = false;
  }).catch(() => { /* no reviews yet or API down */ });
}

// review dialog
const reviewDialog = $("#reviewDialog");
const reviewForm = $("#reviewForm");
const reviewMessage = $("#reviewFormMessage");
if (reviewDialog && reviewForm) {
  $$("[data-review-open]").forEach((button) => button.addEventListener("click", () => { reviewMessage.textContent = ""; reviewDialog.showModal(); armTurnstile(reviewForm); }));
  $("[data-review-close]", reviewDialog)?.addEventListener("click", () => reviewDialog.close());
  reviewDialog.addEventListener("click", (event) => { if (event.target === reviewDialog) reviewDialog.close(); });
  reviewForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const field = (name, max) => String(reviewForm.elements[name]?.value || "").trim().slice(0, max);
    const data = { name: field("name", 100), role: field("role", 120), rating: field("rating", 1), message: field("message", 1200), website: field("website", 200), lang: currentLang() };
    if (data.name.length < 2) { reviewMessage.textContent = t("Please enter your name."); reviewMessage.dataset.state = "error"; reviewForm.elements.name.focus(); return; }
    if (data.message.length < 10) { reviewMessage.textContent = t("Please write a few words about the work."); reviewMessage.dataset.state = "error"; reviewForm.elements.message.focus(); return; }
    const button = reviewForm.querySelector('[type="submit"]');
    button.disabled = true;
    reviewMessage.textContent = t("Sending…");
    reviewMessage.dataset.state = "";
    try {
      // the bot check usually answers within a few seconds, but a slow phone can take longer
      const token = await waitForToken(reviewForm, 20000);
      const box = $("[data-turnstile]", reviewForm);
      if (!token && turnstileIds.get(reviewForm) != null && box && box.getBoundingClientRect().height > 0) {
        // Cloudflare is showing its box above the button and wants a tick
        reviewMessage.textContent = t("Please finish the quick check above, then press Send review again.");
        reviewMessage.dataset.state = "error";
        return;
      }
      const res = await sendToApi("/review", { ...data, turnstile: token });
      resetTurnstile(reviewForm);
      if (!res.ok) throw new Error(String(res.status));
      reviewForm.reset();
      reviewMessage.textContent = t("Thank you! Your review will appear after I approve it.");
      reviewMessage.dataset.state = "success";
    } catch {
      reviewMessage.textContent = t("Could not send right now. Please try again later.");
      reviewMessage.dataset.state = "error";
    } finally {
      button.disabled = false;
    }
  });
}

/* ---------- Lightbox ---------- */
const lightbox = $("#lightbox");
const lightboxImage = $("#lightboxImage");
const lightboxCaption = $("#lightboxCaption");
let lastTrigger = null;

const showInLightbox = (trigger) => {
  lastTrigger = trigger;
  const img = $("img", trigger);
  lightboxImage.src = trigger.dataset.lightbox;
  lightboxImage.alt = img?.alt || "";
  lightboxCaption.textContent = trigger.dataset.caption || img?.alt || "";
};
const lightboxListeners = [];
$$("[data-lightbox]").forEach((trigger) => {
  trigger.setAttribute("aria-haspopup", "dialog");
  trigger.addEventListener("click", () => {
    if (!lightbox?.showModal) return;
    showInLightbox(trigger);
    lightboxListeners.forEach((fn) => fn(trigger));
    lightbox.showModal();
  });
});

$("#lightboxClose")?.addEventListener("click", () => lightbox.close());
lightbox?.addEventListener("click", (event) => { if (event.target === lightbox) lightbox.close(); });
lightbox?.addEventListener("close", () => {
  lightboxImage.removeAttribute("src"); // so the next design never flashes the previous one
  lastTrigger?.focus();
});

/* ---------- Showcase: categories, best designs first, browse with arrows ---------- */
const showcaseGrid = $(".showcase-grid");
if (showcaseGrid) {
  const FIRST = 6; // designs shown before "Show all designs"; the order is set in the admin
  const items = $$(".showcase", showcaseGrid);
  // the category is the first part of the small line, e.g. "Logo Design · Photography" → "Logo Design"
  items.forEach((item) => { item.dataset.cat = ($("small", item)?.textContent || "").split("·")[0].trim() || "Other"; });
  const count = (cat) => items.filter((item) => item.dataset.cat === cat).length;
  const cats = [...new Set(items.map((item) => item.dataset.cat))].sort((a, b) => count(b) - count(a));
  const digits = (n) => (lang === "bn" ? String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]) : String(n));
  let current = "all";
  let expanded = false;
  const bar = document.createElement("div");
  bar.className = "showcase-filter";
  bar.setAttribute("role", "group");
  bar.setAttribute("translate", "no"); // drawn here in either language, so the page translator skips it
  const moreWrap = document.createElement("div");
  moreWrap.className = "showcase-more";
  moreWrap.setAttribute("translate", "no");
  const more = document.createElement("button");
  more.type = "button";
  more.className = "btn btn-outline";
  moreWrap.append(more);
  const shown = () => (current === "all" ? items : items.filter((item) => item.dataset.cat === current));
  const draw = () => {
    const list = shown();
    items.forEach((item) => { item.hidden = !list.includes(item) || (!expanded && list.indexOf(item) >= FIRST); });
    bar.setAttribute("aria-label", t("Design categories"));
    bar.replaceChildren(...[["all", t("All"), items.length], ...cats.map((cat) => [cat, t(cat), count(cat)])].map(([key, label, n]) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "showcase-chip";
      chip.setAttribute("aria-pressed", String(key === current));
      const num = document.createElement("span");
      num.textContent = digits(n);
      chip.append(label, num);
      chip.addEventListener("click", () => { current = key; expanded = false; draw(); });
      return chip;
    }));
    moreWrap.hidden = list.length <= FIRST;
    more.textContent = expanded ? t("Show fewer") : `${t("Show all designs")} (${digits(list.length)})`;
  };
  more.addEventListener("click", () => {
    expanded = !expanded;
    draw();
    if (!expanded) showcaseGrid.closest("section")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  });
  if (cats.length > 1) showcaseGrid.before(bar);
  showcaseGrid.after(moreWrap);
  draw();
  langListeners.push(draw);

  // in the full-size view: ‹ › buttons, arrow keys and swipes go through the designs that are showing
  const nav = (dir, label, icon) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "lightbox-nav lightbox-" + dir;
    button.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${icon}"/></svg>`;
    button.hidden = true;
    lightbox?.append(button);
    return button;
  };
  const prev = nav("prev", "Previous design", "M15 6l-6 6 6 6");
  const next = nav("next", "Next design", "M9 6l6 6-6 6");
  const step = (d) => {
    const list = items.filter((item) => !item.hidden);
    const i = list.indexOf(lastTrigger);
    if (i < 0 || list.length < 2) return;
    showInLightbox(list[(i + d + list.length) % list.length]);
  };
  const browsing = () => lightbox?.open && items.includes(lastTrigger);
  lightboxListeners.push((trigger) => {
    const on = items.includes(trigger) && items.filter((item) => !item.hidden).length > 1;
    prev.hidden = next.hidden = !on;
    prev.setAttribute("aria-label", t("Previous design"));
    next.setAttribute("aria-label", t("Next design"));
  });
  prev.addEventListener("click", () => step(-1));
  next.addEventListener("click", () => step(1));
  document.addEventListener("keydown", (event) => {
    if (!browsing()) return;
    if (event.key === "ArrowLeft") step(-1);
    if (event.key === "ArrowRight") step(1);
  });
  let touchX = null;
  lightboxImage?.addEventListener("touchstart", (event) => { touchX = event.touches[0].clientX; }, { passive: true });
  lightboxImage?.addEventListener("touchend", (event) => {
    if (touchX === null || !browsing()) return;
    const dx = event.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && mobileNav?.classList.contains("is-open")) {
    setMenu(false);
    menuButton?.focus();
  }
});

/* ---------- Copy email ---------- */
$$("[data-copy]").forEach((button) => {
  const labelNode = [...button.childNodes].find((n) => n.nodeType === 3);
  let timer;
  button.addEventListener("click", async () => {
    clearTimeout(timer);
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      if (labelNode) labelNode.textContent = t("Copied");
    } catch {
      window.location.href = `mailto:${button.dataset.copy}`;
    }
    timer = setTimeout(() => { if (labelNode) labelNode.textContent = t("Copy"); }, 1800);
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
    const contact = value("contact", 120);
    const projectType = value("project_type", 100);
    const budget = value("budget", 100);
    const timeline = value("timeline", 100);
    const brief = value("message", 3000);

    if (name.length < 2) { setMessage(t("Please enter your name."), "error"); form.elements.name.focus(); return; }
    if (!projectType) { setMessage(t("Please choose a project type."), "error"); form.elements.project_type.focus(); return; }
    if (brief.length < 20) { setMessage(t("Tell me a little more about the project."), "error"); form.elements.message.focus(); return; }

    const text = [
      `Hi Mehedi, I'm ${name}${company ? ` from ${company}` : ""}.`,
      ...(contact ? [`Contact: ${contact}`] : []),
      "",
      `Project type: ${projectType}`,
      ...(budget ? [`Budget: ${budget}`] : []),
      ...(timeline ? [`Timeline: ${timeline}`] : []),
      "",
      brief
    ].join("\n");

    // keep a copy in the backend (quietly, once the bot check is ready; WhatsApp or email opens right away either way)
    const copy = { name, contact, company, project_type: projectType, budget, timeline, message: brief, channel, lang: currentLang(), website: value("website", 200) };
    waitForToken(form, 20000)
      .then((token) => sendToApi("/inquiry", { ...copy, turnstile: token }))
      .catch(() => {})
      .finally(() => resetTurnstile(form));

    if (channel === "email") {
      window.location.href = `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(`Project inquiry: ${projectType}`)}&body=${encodeURIComponent(text)}`;
      setMessage(t("Your email app should open with the message ready. Just press send."), "success");
    } else {
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      setMessage(t("WhatsApp opened with your message ready. Just press send."), "success");
    }
  });

  form.addEventListener("input", () => { if (formMessage.dataset.state === "error") setMessage(""); });
  form.addEventListener("focusin", () => armTurnstile(form), { once: true });
}
