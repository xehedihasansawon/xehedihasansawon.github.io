import { ADMIN_CONFIG } from "./admin/config.js";

const byId = (id) => document.getElementById(id);

const VALID_STYLES = new Set(["accent", "dark", "outline"]);

const clean = (value) => String(value || "").trim();

const isSafeHref = (value) => {
  const href = clean(value);
  if (!href) return false;

  const lower = href.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:") ||
    href.startsWith("//")
  ) {
    return false;
  }

  if (
    href.startsWith("#") ||
    href.startsWith("/") ||
    href.startsWith("./") ||
    href.startsWith("../")
  ) {
    return true;
  }

  try {
    return ["https:", "http:", "mailto:", "tel:"].includes(
      new URL(href).protocol
    );
  } catch {
    try {
      const relative = new URL(href, window.location.origin + "/");
      return relative.origin === window.location.origin;
    } catch {
      return false;
    }
  }
};

const applyLink = (element, label, href, newTab) => {
  if (!element) return false;
  if (!label || !isSafeHref(href)) {
    element.hidden = true;
    return false;
  }

  element.textContent = label;
  element.href = href;
  element.hidden = false;

  if (newTab) {
    element.target = "_blank";
    element.rel = "noopener noreferrer";
  } else {
    element.removeAttribute("target");
    element.removeAttribute("rel");
  }

  return true;
};

const ensureCtaBeforeContact = () => {
  const section = byId("customCtaSection");
  const contact = byId("contact");
  const main = contact?.parentElement;

  if (!section || !contact || !main) return;

  if (section.nextElementSibling !== contact) {
    main.insertBefore(section, contact);
  }
};

const observeSectionOrder = () => {
  const main = document.querySelector("main");
  if (!main) return;

  ensureCtaBeforeContact();

  const observer = new MutationObserver(() => {
    ensureCtaBeforeContact();
  });

  observer.observe(main, { childList: true });
};

const applyCta = (row) => {
  const section = byId("customCtaSection");
  const card = byId("customCtaCard");
  const eyebrow = byId("customCtaEyebrow");
  const title = byId("customCtaTitle");
  const description = byId("customCtaDescription");
  const primary = byId("customCtaPrimary");
  const secondary = byId("customCtaSecondary");

  if (
    !section ||
    !card ||
    !eyebrow ||
    !title ||
    !description ||
    !primary ||
    !secondary
  ) {
    return;
  }

  if (!row?.enabled) {
    section.hidden = true;
    return;
  }

  const style = VALID_STYLES.has(row.style_key)
    ? row.style_key
    : "accent";

  const eyebrowText = clean(row.eyebrow);
  const titleText = clean(row.title);
  const descriptionText = clean(row.description);

  if (!eyebrowText || !titleText || !descriptionText) {
    section.hidden = true;
    return;
  }

  card.dataset.style = style;
  eyebrow.textContent = eyebrowText;
  title.textContent = titleText;
  description.textContent = descriptionText;

  const primaryReady = applyLink(
    primary,
    clean(row.primary_label),
    clean(row.primary_href),
    Boolean(row.primary_new_tab)
  );

  const secondaryReady =
    Boolean(row.secondary_enabled) &&
    applyLink(
      secondary,
      clean(row.secondary_label),
      clean(row.secondary_href),
      Boolean(row.secondary_new_tab)
    );

  secondary.hidden = !secondaryReady;

  if (!primaryReady) {
    section.hidden = true;
    return;
  }

  section.hidden = false;
  ensureCtaBeforeContact();
  document.documentElement.dataset.customCta = "loaded";
};

const loadCta = async () => {
  try {
    const endpoint = new URL(
      "/rest/v1/portfolio_custom_cta",
      ADMIN_CONFIG.supabaseUrl
    );
    endpoint.searchParams.set(
      "select",
      "enabled,style_key,eyebrow,title,description,primary_label,primary_href,primary_new_tab,secondary_enabled,secondary_label,secondary_href,secondary_new_tab"
    );
    endpoint.searchParams.set("id", "eq.1");
    endpoint.searchParams.set("limit", "1");

    const response = await fetch(endpoint, {
      headers: {
        apikey: ADMIN_CONFIG.supabaseAnonKey,
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(
        `Custom CTA request failed with status ${response.status}`
      );
    }

    const rows = await response.json();
    const row = Array.isArray(rows) ? rows[0] : null;

    if (row) applyCta(row);
  } catch (error) {
    console.warn(
      "Custom CTA unavailable; keeping optional CTA hidden.",
      error
    );
  }
};

observeSectionOrder();
loadCta();
