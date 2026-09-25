import { ADMIN_CONFIG } from "./admin/config.js";

const HERO_CONTENT_KEY = "homepage.hero";

const byId = (id) => document.getElementById(id);

const isSafeHref = (value) => {
  const href = String(value || "").trim();
  if (!href) return false;
  if (href.startsWith("#") || href.startsWith("/") || href.startsWith("./") || href.startsWith("../")) return true;

  try {
    return ["https:", "http:", "mailto:", "tel:"].includes(new URL(href).protocol);
  } catch {
    return false;
  }
};

const isSafeImageSource = (value) => {
  const src = String(value || "").trim();
  if (!src || src.toLowerCase().startsWith("javascript:") || src.toLowerCase().startsWith("data:")) {
    return false;
  }

  if (src.startsWith("/") || src.startsWith("./") || src.startsWith("../") || /^[a-z0-9_-]+\//i.test(src)) {
    return true;
  }

  try {
    return new URL(src).protocol === "https:";
  } catch {
    return false;
  }
};

const applyText = (id, value) => {
  if (typeof value !== "string" || !value.trim()) return;
  const element = byId(id);
  if (element) element.textContent = value.trim();
};

const applyHero = (hero) => {
  if (!hero || typeof hero !== "object") return;

  applyText("heroStatusText", hero.statusText);
  applyText("heroEyebrow", hero.eyebrow);
  applyText("heroNameLine1", hero.nameLine1);
  applyText("heroNameLine2", hero.nameLine2);
  applyText("heroRolePrefix", hero.rolePrefix);
  applyText("heroHighlight1", hero.highlight1);
  applyText("heroHighlight2", hero.highlight2);
  applyText("heroHighlight3", hero.highlight3);
  applyText("heroRoleSuffix", hero.roleSuffix);
  applyText("heroPrimaryLabel", hero.primaryLabel);
  applyText("heroSecondaryLabel", hero.secondaryLabel);
  applyText("heroMeta1", hero.meta1);
  applyText("heroMeta2", hero.meta2);
  applyText("heroMeta3", hero.meta3);

  if (isSafeHref(hero.primaryHref)) {
    byId("heroPrimaryButton")?.setAttribute("href", hero.primaryHref.trim());
  }

  if (isSafeHref(hero.secondaryHref)) {
    byId("heroSecondaryButton")?.setAttribute("href", hero.secondaryHref.trim());
  }

  if (isSafeImageSource(hero.imageSrc)) {
    byId("heroImage")?.setAttribute("src", hero.imageSrc.trim());
  }

  if (typeof hero.imageAlt === "string" && hero.imageAlt.trim()) {
    byId("heroImage")?.setAttribute("alt", hero.imageAlt.trim());
  }

  document.documentElement.dataset.heroCms = "loaded";
};

const loadPublishedHero = async () => {
  try {
    const endpoint = new URL("/rest/v1/cms_content_entries", ADMIN_CONFIG.supabaseUrl);
    endpoint.searchParams.set("select", "published_data");
    endpoint.searchParams.set("content_key", `eq.${HERO_CONTENT_KEY}`);
    endpoint.searchParams.set("limit", "1");

    const response = await fetch(endpoint, {
      headers: {
        apikey: ADMIN_CONFIG.supabaseAnonKey,
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Hero CMS request failed with status ${response.status}`);
    }

    const rows = await response.json();
    const published = rows?.[0]?.published_data;

    if (published) applyHero(published);
  } catch (error) {
    // The static HTML is intentionally the safe fallback.
    console.warn("Hero CMS unavailable; using static Hero fallback.", error);
  }
};

loadPublishedHero();
