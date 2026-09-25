import { ADMIN_CONFIG } from "./admin/config.js";

const HERO_CONTENT_KEY = "homepage.hero";
const REAL_PROJECTS_CONTENT_KEY = "homepage.real-life-projects";
const DESIGN_SHOWCASE_CONTENT_KEY = "homepage.design-showcase";

const byId = (id) => document.getElementById(id);

const isSafeHref = (value) => {
  const href = String(value || "").trim();
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
    return ["https:", "http:", "mailto:", "tel:"].includes(new URL(href).protocol);
  } catch {
    try {
      const relative = new URL(href, window.location.origin + "/");
      return relative.origin === window.location.origin;
    } catch {
      return false;
    }
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


const applyRealProjects = (data) => {
  if (!data || typeof data !== "object") return;

  applyText("realProjectsEyebrow", data.eyebrow);
  applyText("realProjectsTitleMain", data.titleMain);
  applyText("realProjectsTitleAccent", data.titleAccent);

  if (!Array.isArray(data.projects)) return;

  data.projects.forEach((project) => {
    if (!project?.key) return;

    const card = document.querySelector(`[data-cms-project="${CSS.escape(project.key)}"]`);
    if (!card) return;

    const setCardText = (field, value) => {
      if (typeof value !== "string" || !value.trim()) return;
      const element = card.querySelector(`[data-cms-field="${field}"]`);
      if (element) element.textContent = value.trim();
    };

    setCardText("category", project.category);
    setCardText("title", project.title);
    setCardText("description", project.description);
    setCardText("actionLabel", project.actionLabel);

    const image = card.querySelector('[data-cms-field="image"]');
    if (image && isSafeImageSource(project.imageSrc)) {
      image.src = project.imageSrc.trim();
    }
    if (image && typeof project.imageAlt === "string" && project.imageAlt.trim()) {
      image.alt = project.imageAlt.trim();
    }

    if (project.type === "link" && card.tagName === "A" && isSafeHref(project.href)) {
      card.setAttribute("href", project.href.trim());
    }

    if (card.classList.contains("project-card")) {
      if (typeof project.title === "string" && project.title.trim()) {
        card.dataset.title = project.title.trim();
      }
      if (typeof project.category === "string" && project.category.trim()) {
        card.dataset.meta = project.category.trim();
      }
    }
  });

  document.documentElement.dataset.realProjectsCms = "loaded";
};

const loadPublishedRealProjects = async () => {
  try {
    const endpoint = new URL("/rest/v1/cms_content_entries", ADMIN_CONFIG.supabaseUrl);
    endpoint.searchParams.set("select", "published_data");
    endpoint.searchParams.set("content_key", `eq.${REAL_PROJECTS_CONTENT_KEY}`);
    endpoint.searchParams.set("limit", "1");

    const response = await fetch(endpoint, {
      headers: {
        apikey: ADMIN_CONFIG.supabaseAnonKey,
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Real Life Projects CMS request failed with status ${response.status}`);
    }

    const rows = await response.json();
    const published = rows?.[0]?.published_data;

    if (published) applyRealProjects(published);
  } catch (error) {
    // Static homepage cards remain the safe fallback.
    console.warn("Real Life Projects CMS unavailable; using static fallback.", error);
  }
};

loadPublishedRealProjects();


const applyDesignShowcase = (data) => {
  if (!data || typeof data !== "object") return;

  applyText("designShowcaseEyebrow", data.eyebrow);
  applyText("designShowcaseTitleMain", data.titleMain);
  applyText("designShowcaseTitleAccent", data.titleAccent);

  if (!Array.isArray(data.items)) return;

  data.items.forEach((item) => {
    if (!item?.key) return;

    const card = document.querySelector(`[data-cms-showcase="${CSS.escape(item.key)}"]`);
    if (!card) return;

    const cardTitle = card.querySelector('[data-cms-field="cardTitle"]');
    const cardSubtitle = card.querySelector('[data-cms-field="cardSubtitle"]');
    const image = card.querySelector('[data-cms-field="image"]');

    if (cardTitle && typeof item.cardTitle === "string" && item.cardTitle.trim()) {
      cardTitle.textContent = item.cardTitle.trim();
    }

    if (cardSubtitle && typeof item.cardSubtitle === "string" && item.cardSubtitle.trim()) {
      cardSubtitle.textContent = item.cardSubtitle.trim();
    }

    if (image && isSafeImageSource(item.imageSrc)) {
      image.src = item.imageSrc.trim();
    }

    if (image && typeof item.imageAlt === "string" && item.imageAlt.trim()) {
      image.alt = item.imageAlt.trim();
    }

    if (typeof item.modalTitle === "string" && item.modalTitle.trim()) {
      card.dataset.title = item.modalTitle.trim();
    }
    if (typeof item.modalMeta === "string" && item.modalMeta.trim()) {
      card.dataset.meta = item.modalMeta.trim();
      card.dataset.dialogMeta = item.modalMeta.trim();
    }
    if (typeof item.modalEyebrow === "string" && item.modalEyebrow.trim()) {
      card.dataset.dialogEyebrow = item.modalEyebrow.trim();
    }
    if (typeof item.modalSummary === "string" && item.modalSummary.trim()) {
      card.dataset.dialogSummary = item.modalSummary.trim();
    }

    const points = Array.isArray(item.modalPoints) ? item.modalPoints : [];
    ["dialogPoint1", "dialogPoint2", "dialogPoint3"].forEach((datasetKey, index) => {
      const value = points[index];
      if (typeof value === "string" && value.trim()) {
        card.dataset[datasetKey] = value.trim();
      } else {
        delete card.dataset[datasetKey];
      }
    });
  });

  document.documentElement.dataset.designShowcaseCms = "loaded";
};

const loadPublishedDesignShowcase = async () => {
  try {
    const endpoint = new URL("/rest/v1/cms_content_entries", ADMIN_CONFIG.supabaseUrl);
    endpoint.searchParams.set("select", "published_data");
    endpoint.searchParams.set("content_key", `eq.${DESIGN_SHOWCASE_CONTENT_KEY}`);
    endpoint.searchParams.set("limit", "1");

    const response = await fetch(endpoint, {
      headers: {
        apikey: ADMIN_CONFIG.supabaseAnonKey,
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Design Showcase CMS request failed with status ${response.status}`);
    }

    const rows = await response.json();
    const published = rows?.[0]?.published_data;

    if (published) applyDesignShowcase(published);
  } catch (error) {
    console.warn("Design Showcase CMS unavailable; using static fallback.", error);
  }
};

loadPublishedDesignShowcase();
