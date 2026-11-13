import { ADMIN_CONFIG } from "./admin/config.js";

const HERO_CONTENT_KEY = "homepage.hero";
const REAL_PROJECTS_CONTENT_KEY = "homepage.real-life-projects";
const DESIGN_SHOWCASE_CONTENT_KEY = "homepage.design-showcase";
const CREATIVE_SERVICES_CONTENT_KEY = "homepage.creative-services";
const DIGITAL_PROJECTS_CONTENT_KEY = "homepage.ai-digital-projects";
const ABOUT_ME_CONTENT_KEY = "homepage.about";
const SKILLS_TOOLS_CONTENT_KEY = "homepage.skills-tools";
const EXPERIENCE_COMMUNITY_CONTENT_KEY = "homepage.experience-community";
const CONTACT_CONTENT_KEY = "homepage.contact";
const FOOTER_CONTENT_KEY = "homepage.footer";
const SECTION_LAYOUT_CONTENT_KEY = "homepage.section-layout";

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

const showStaticHeroFallback = (element) => {
  if (!element || !element.isConnected) return;

  const fallback = element.dataset.staticFallback || "assets/hero-current.webp";
  if (element.getAttribute("src") !== fallback) {
    element.setAttribute("src", fallback);
  }
};

const swapImageWhenReady = (element, source, altText = "") => {
  if (!element || !isSafeImageSource(source)) return;

  const nextSource = source.trim();
  const currentSource = element.getAttribute("src") || "";

  const applyAlt = () => {
    if (typeof altText === "string" && altText.trim()) {
      element.alt = altText.trim();
    }
  };

  if (currentSource === nextSource) {
    applyAlt();
    return;
  }

  const preload = new Image();
  preload.decoding = "async";
  preload.fetchPriority = "high";

  preload.onload = async () => {
    try {
      await preload.decode?.();
    } catch {
      // The image is already loaded; decoding support is optional.
    }

    if (!element.isConnected) return;

    element.src = nextSource;
    applyAlt();
  };

  // If the CMS image is slow or fails, keep the local current Hero visible.
  preload.onerror = () => {};
  preload.src = nextSource;
};

const applyHero = (hero) => {
  if (!hero || typeof hero !== "object") return;

  if (document.documentElement.dataset.availabilityLoaded !== "true") {
    applyText("heroStatusText", hero.statusText);
  }
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

  const heroImage = byId("heroImage");
  swapImageWhenReady(heroImage, hero.imageSrc, hero.imageAlt);

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
    const heroImage = byId("heroImage");

    if (heroImage) {
      showStaticHeroFallback(heroImage);
    }

    console.warn("Hero CMS unavailable; using static Hero fallback.", error);
  }
};

loadPublishedHero();


/* =========================================================
   WORK SECTION
   Projects come from Project Studio (portfolio_projects).
   - Newest project first (created_at desc), so anything you add
     shows up at the top automatically.
   - Every card opens its own page: project.html?slug=<slug>.
   - If Supabase is unreachable, the static cards in index.html stay.
   ========================================================= */

const WORK_INITIAL_COUNT = 6;

const fetchPublicRows = async (path, params) => {
  const endpoint = new URL(path, ADMIN_CONFIG.supabaseUrl);
  Object.entries(params).forEach(([key, value]) =>
    endpoint.searchParams.set(key, value)
  );

  const response = await fetch(endpoint, {
    headers: {
      apikey: ADMIN_CONFIG.supabaseAnonKey,
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`${path} request failed with status ${response.status}`);
  }

  const rows = await response.json();
  return Array.isArray(rows) ? rows : [];
};

const projectPageHref = (slug) =>
  "project.html?slug=" + encodeURIComponent(slug);

const applyRealProjectsHeading = (data) => {
  if (!data || typeof data !== "object") return;

  applyText("realProjectsEyebrow", data.eyebrow);
  applyText("realProjectsTitleMain", data.titleMain);
  applyText("realProjectsTitleAccent", data.titleAccent);
};

const loadPublishedRealProjectsHeading = async () => {
  try {
    const rows = await fetchPublicRows("/rest/v1/cms_content_entries", {
      select: "published_data",
      content_key: `eq.${REAL_PROJECTS_CONTENT_KEY}`,
      limit: "1"
    });

    applyRealProjectsHeading(rows[0]?.published_data);
  } catch (error) {
    console.warn("Work heading CMS unavailable; using static heading.", error);
  }
};

loadPublishedRealProjectsHeading();

const renderWorkCard = (project, categoryName) => {
  const card = document.createElement("a");
  card.className = "real-project-card real-project-split-card";
  card.href = projectPageHref(project.slug);
  card.dataset.engineProject = project.slug;

  const thumb = document.createElement("div");
  thumb.className = "real-project-thumb";

  if (isSafeImageSource(project.cover_image_url)) {
    const image = document.createElement("img");
    image.src = project.cover_image_url.trim();
    image.alt =
      typeof project.cover_image_alt === "string" && project.cover_image_alt.trim()
        ? project.cover_image_alt.trim()
        : project.title.trim() + " project cover";
    image.loading = "lazy";
    image.decoding = "async";
    thumb.appendChild(image);
  } else {
    thumb.classList.add("real-project-thumb-empty");
    const placeholder = document.createElement("span");
    placeholder.textContent = project.title.trim().slice(0, 2).toUpperCase();
    thumb.appendChild(placeholder);
  }

  const details = document.createElement("div");
  details.className = "real-project-details";

  const category = document.createElement("small");
  category.textContent = categoryName || "Portfolio Project";

  const title = document.createElement("strong");
  title.textContent = project.title.trim();

  const description = document.createElement("p");
  description.textContent =
    typeof project.summary === "string" && project.summary.trim()
      ? project.summary.trim()
      : "Selected portfolio project.";

  const action = document.createElement("span");
  action.textContent = "View project";

  details.append(category, title, description, action);
  card.append(thumb, details);
  return card;
};

const initWorkSection = async () => {
  const grid = byId("workGrid");
  const filterRoot = byId("workFilter");
  const showMoreButton = byId("workShowMore");
  if (!grid) return;

  let projects;
  let categories;

  try {
    [projects, categories] = await Promise.all([
      fetchPublicRows("/rest/v1/portfolio_projects", {
        select: "id,slug,title,summary,category_id,cover_image_url,cover_image_alt,created_at",
        is_published: "eq.true",
        visibility: "eq.public",
        order: "created_at.desc"
      }),
      fetchPublicRows("/rest/v1/portfolio_categories", {
        select: "id,name",
        is_active: "eq.true",
        order: "name.asc"
      })
    ]);
  } catch (error) {
    console.warn("Projects unavailable; keeping static Work cards.", error);
    return;
  }

  projects = projects.filter(
    (project) =>
      project &&
      typeof project.title === "string" &&
      project.title.trim() &&
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug || "")
  );

  if (!projects.length) return;

  const categoryMap = new Map(categories.map((item) => [item.id, item.name]));
  let activeCategory = "";
  let expanded = false;

  const render = () => {
    const visible = projects.filter(
      (project) => !activeCategory || project.category_id === activeCategory
    );
    const limited = expanded ? visible : visible.slice(0, WORK_INITIAL_COUNT);

    grid.replaceChildren(
      ...limited.map((project) =>
        renderWorkCard(project, categoryMap.get(project.category_id))
      )
    );

    if (showMoreButton) {
      showMoreButton.hidden = expanded || visible.length <= WORK_INITIAL_COUNT;
    }
  };

  // Category chips only when projects span more than one category.
  const usedCategories = categories.filter((category) =>
    projects.some((project) => project.category_id === category.id)
  );

  if (filterRoot && usedCategories.length > 1) {
    const makeChip = (label, value) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.textContent = label;
      chip.setAttribute("aria-pressed", String(value === activeCategory));
      chip.addEventListener("click", () => {
        activeCategory = value;
        expanded = false;
        filterRoot.querySelectorAll("button").forEach((button) => {
          button.setAttribute("aria-pressed", String(button === chip));
        });
        render();
      });
      return chip;
    };

    filterRoot.replaceChildren(
      makeChip("All", ""),
      ...usedCategories.map((category) => makeChip(category.name, category.id))
    );
    filterRoot.hidden = false;
  }

  showMoreButton?.addEventListener("click", () => {
    expanded = true;
    render();
  });

  render();
  document.documentElement.dataset.portfolioEngineHome = "loaded";
};

initWorkSection();


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


const applyCreativeServices = (data) => {
  if (!data || typeof data !== "object") return;

  applyText("creativeServicesEyebrow", data.eyebrow);
  applyText("creativeServicesTitleMain", data.titleMain);
  applyText("creativeServicesTitleAccent", data.titleAccent);

  if (!Array.isArray(data.services)) return;

  data.services.forEach((service) => {
    if (!service?.key) return;

    const card = document.querySelector(`[data-cms-service="${CSS.escape(service.key)}"]`);
    if (!card) return;

    const number = card.querySelector('[data-cms-field="number"]');
    const title = card.querySelector('[data-cms-field="cardTitle"]');
    const description = card.querySelector('[data-cms-field="cardDescription"]');

    if (number && typeof service.number === "string" && service.number.trim()) {
      number.textContent = service.number.trim();
    }

    if (title && typeof service.cardTitle === "string" && service.cardTitle.trim()) {
      title.textContent = service.cardTitle.trim();
    }

    if (description && typeof service.cardDescription === "string" && service.cardDescription.trim()) {
      description.textContent = service.cardDescription.trim();
    }

    card.__cmsServiceDetail = {
      eyebrow:
        typeof service.modalEyebrow === "string" && service.modalEyebrow.trim()
          ? service.modalEyebrow.trim()
          : "Service workflow",
      title:
        typeof service.modalTitle === "string" && service.modalTitle.trim()
          ? service.modalTitle.trim()
          : service.cardTitle,
      summary:
        typeof service.modalSummary === "string"
          ? service.modalSummary.trim()
          : "",
      workflow: Array.isArray(service.workflow)
        ? service.workflow.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim())
        : [],
      deliverables: Array.isArray(service.deliverables)
        ? service.deliverables.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim())
        : [],
      tools: Array.isArray(service.tools)
        ? service.tools.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim())
        : [],
      needs: Array.isArray(service.needs)
        ? service.needs.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim())
        : [],
      handoff:
        typeof service.handoff === "string"
          ? service.handoff.trim()
          : ""
    };
  });

  document.documentElement.dataset.creativeServicesCms = "loaded";
};

const loadPublishedCreativeServices = async () => {
  try {
    const endpoint = new URL("/rest/v1/cms_content_entries", ADMIN_CONFIG.supabaseUrl);
    endpoint.searchParams.set("select", "published_data");
    endpoint.searchParams.set("content_key", `eq.${CREATIVE_SERVICES_CONTENT_KEY}`);
    endpoint.searchParams.set("limit", "1");

    const response = await fetch(endpoint, {
      headers: {
        apikey: ADMIN_CONFIG.supabaseAnonKey,
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Creative Services CMS request failed with status ${response.status}`);
    }

    const rows = await response.json();
    const published = rows?.[0]?.published_data;

    if (published) applyCreativeServices(published);
  } catch (error) {
    console.warn("Creative Services CMS unavailable; using static fallback.", error);
  }
};

loadPublishedCreativeServices();


const applyDigitalProjects = (data) => {
  if (!data || typeof data !== "object") return;

  applyText("digitalProjectsEyebrow", data.eyebrow);
  applyText("digitalProjectsTitleMain", data.titleMain);
  applyText("digitalProjectsTitleAccent", data.titleAccent);

  if (!Array.isArray(data.projects)) return;

  data.projects.forEach((project) => {
    if (!project?.key) return;

    const card = document.querySelector(`[data-cms-digital="${CSS.escape(project.key)}"]`);
    if (!card) return;

    const marker = card.querySelector('[data-cms-field="marker"]');
    const title = card.querySelector('[data-cms-field="cardTitle"]');
    const description = card.querySelector('[data-cms-field="cardDescription"]');
    const action = card.querySelector('[data-cms-field="actionLabel"]');

    if (marker && typeof project.marker === "string" && project.marker.trim()) {
      marker.textContent = project.marker.trim();
    }
    if (title && typeof project.cardTitle === "string" && project.cardTitle.trim()) {
      title.textContent = project.cardTitle.trim();
    }
    if (description && typeof project.cardDescription === "string" && project.cardDescription.trim()) {
      description.textContent = project.cardDescription.trim();
    }
    if (action && typeof project.actionLabel === "string" && project.actionLabel.trim()) {
      action.textContent = project.actionLabel.trim();
    }

    if (project.type === "main") {
      const chipsContainer = card.querySelector('[data-cms-field="chips"]');
      if (chipsContainer && Array.isArray(project.chips)) {
        chipsContainer.innerHTML = "";
        project.chips
          .filter((chip) => typeof chip === "string" && chip.trim())
          .forEach((chip) => {
            const span = document.createElement("span");
            span.textContent = chip.trim();
            chipsContainer.appendChild(span);
          });
      }
    }

    if (typeof project.cardTitle === "string" && project.cardTitle.trim()) {
      card.setAttribute("aria-label", `View ${project.cardTitle.trim()} workflow`);
    }

    card.__cmsDigitalDetail = {
      eyebrow:
        typeof project.modalEyebrow === "string" && project.modalEyebrow.trim()
          ? project.modalEyebrow.trim()
          : "Digital project workflow",
      title:
        typeof project.modalTitle === "string" && project.modalTitle.trim()
          ? project.modalTitle.trim()
          : project.cardTitle,
      summary:
        typeof project.modalSummary === "string"
          ? project.modalSummary.trim()
          : "",
      workflow: Array.isArray(project.workflow)
        ? project.workflow.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim())
        : [],
      deliverables: Array.isArray(project.deliverables)
        ? project.deliverables.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim())
        : [],
      tools: Array.isArray(project.tools)
        ? project.tools.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim())
        : [],
      needs: Array.isArray(project.needs)
        ? project.needs.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim())
        : [],
      handoff:
        typeof project.handoff === "string"
          ? project.handoff.trim()
          : ""
    };
  });

  document.documentElement.dataset.digitalProjectsCms = "loaded";
};

const loadPublishedDigitalProjects = async () => {
  try {
    const endpoint = new URL("/rest/v1/cms_content_entries", ADMIN_CONFIG.supabaseUrl);
    endpoint.searchParams.set("select", "published_data");
    endpoint.searchParams.set("content_key", `eq.${DIGITAL_PROJECTS_CONTENT_KEY}`);
    endpoint.searchParams.set("limit", "1");

    const response = await fetch(endpoint, {
      headers: {
        apikey: ADMIN_CONFIG.supabaseAnonKey,
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`AI & Digital Projects CMS request failed with status ${response.status}`);
    }

    const rows = await response.json();
    const published = rows?.[0]?.published_data;

    if (published) applyDigitalProjects(published);
  } catch (error) {
    console.warn("AI & Digital Projects CMS unavailable; using static fallback.", error);
  }
};

loadPublishedDigitalProjects();


const applyAboutMe = (data) => {
  if (!data || typeof data !== "object") return;

  applyText("aboutEyebrow", data.eyebrow);
  applyText("aboutTitleMain", data.titleMain);
  applyText("aboutTitleAccent", data.titleAccent);
  applyText("aboutHeadlineMain", data.headlineMain);
  applyText("aboutHeadlineAccent", data.headlineAccent);
  applyText("aboutParagraph1", data.paragraph1);
  applyText("aboutParagraph2", data.paragraph2);
  applyText("aboutMeta1Label", data.meta1Label);
  applyText("aboutMeta1Value", data.meta1Value);
  applyText("aboutMeta2Label", data.meta2Label);
  applyText("aboutMeta2Value", data.meta2Value);

  document.documentElement.dataset.aboutMeCms = "loaded";
};

const loadPublishedAboutMe = async () => {
  try {
    const endpoint = new URL("/rest/v1/cms_content_entries", ADMIN_CONFIG.supabaseUrl);
    endpoint.searchParams.set("select", "published_data");
    endpoint.searchParams.set("content_key", `eq.${ABOUT_ME_CONTENT_KEY}`);
    endpoint.searchParams.set("limit", "1");

    const response = await fetch(endpoint, {
      headers: {
        apikey: ADMIN_CONFIG.supabaseAnonKey,
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`About Me CMS request failed with status ${response.status}`);
    }

    const rows = await response.json();
    const published = rows?.[0]?.published_data;

    if (published) applyAboutMe(published);
  } catch (error) {
    console.warn("About Me CMS unavailable; using static fallback.", error);
  }
};

loadPublishedAboutMe();


const applySkillsTools = (data) => {
  if (!data || typeof data !== "object") return;

  applyText("skillsToolsEyebrow", data.eyebrow);
  applyText("skillsToolsTitleAccent", data.titleAccent);
  applyText("skillsToolsTitleRest", data.titleRest);
  applyText("skillsKicker", data.skillsKicker);
  applyText("skillsTitle", data.skillsTitle);
  applyText("toolsKicker", data.toolsKicker);
  applyText("toolsTitle", data.toolsTitle);

  if (Array.isArray(data.capabilities)) {
    data.capabilities.forEach((capability) => {
      if (!capability?.key) return;
      const card = document.querySelector(`[data-cms-skill="${CSS.escape(capability.key)}"]`);
      if (!card) return;

      const title = card.querySelector('[data-cms-field="title"]');
      const description = card.querySelector('[data-cms-field="description"]');
      const tags = card.querySelector('[data-cms-field="tags"]');

      if (title && typeof capability.title === "string" && capability.title.trim()) {
        title.textContent = capability.title.trim();
      }
      if (description && typeof capability.description === "string" && capability.description.trim()) {
        description.textContent = capability.description.trim();
      }
      if (tags && Array.isArray(capability.tags)) {
        tags.innerHTML = "";
        capability.tags
          .filter((tag) => typeof tag === "string" && tag.trim())
          .slice(0, 2)
          .forEach((tag) => {
            const span = document.createElement("span");
            span.textContent = tag.trim();
            tags.appendChild(span);
          });
      }
    });
  }

  if (Array.isArray(data.tools)) {
    data.tools.forEach((tool) => {
      if (!tool?.key) return;
      const card = document.querySelector(`[data-cms-tool="${CSS.escape(tool.key)}"]`);
      if (!card) return;

      const image = card.querySelector('[data-cms-field="image"]');
      const name = card.querySelector('[data-cms-field="name"]');

      if (image && isSafeImageSource(tool.imageSrc)) {
        image.src = tool.imageSrc.trim();
      }
      if (name && typeof tool.name === "string" && tool.name.trim()) {
        name.textContent = tool.name.trim();
      }
    });
  }

  document.documentElement.dataset.skillsToolsCms = "loaded";
};

const loadPublishedSkillsTools = async () => {
  try {
    const endpoint = new URL("/rest/v1/cms_content_entries", ADMIN_CONFIG.supabaseUrl);
    endpoint.searchParams.set("select", "published_data");
    endpoint.searchParams.set("content_key", `eq.${SKILLS_TOOLS_CONTENT_KEY}`);
    endpoint.searchParams.set("limit", "1");

    const response = await fetch(endpoint, {
      headers: {
        apikey: ADMIN_CONFIG.supabaseAnonKey,
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Skills & Tools CMS request failed with status ${response.status}`);
    }

    const rows = await response.json();
    const published = rows?.[0]?.published_data;

    if (published) applySkillsTools(published);
  } catch (error) {
    console.warn("Skills & Tools CMS unavailable; using static fallback.", error);
  }
};

loadPublishedSkillsTools();


const applyExperienceCommunity = (data) => {
  if (!data || typeof data !== "object") return;

  applyText("experienceEyebrow", data.eyebrow);
  applyText("experienceTitleMain", data.titleMain);
  applyText("experienceTitleAccent", data.titleAccent);

  if (!Array.isArray(data.items)) return;

  data.items.forEach((item) => {
    if (!item?.key) return;
    const card = document.querySelector(`[data-cms-experience="${CSS.escape(item.key)}"]`);
    if (!card) return;

    const applyCardText = (field, value) => {
      if (typeof value !== "string" || !value.trim()) return;
      const element = card.querySelector(`[data-cms-field="${field}"]`);
      if (element) element.textContent = value.trim();
    };

    applyCardText("number", item.number);
    applyCardText("type", item.type);
    applyCardText("period", item.period);
    applyCardText("title", item.title);
    applyCardText("role", item.role);
    applyCardText("description", item.description);

    const tags = card.querySelector('[data-cms-field="tags"]');
    if (tags && Array.isArray(item.tags)) {
      tags.innerHTML = "";
      item.tags
        .filter((tag) => typeof tag === "string" && tag.trim())
        .slice(0, 4)
        .forEach((tag) => {
          const span = document.createElement("span");
          span.textContent = tag.trim();
          tags.appendChild(span);
        });
    }
  });

  document.documentElement.dataset.experienceCommunityCms = "loaded";
};

const loadPublishedExperienceCommunity = async () => {
  try {
    const endpoint = new URL("/rest/v1/cms_content_entries", ADMIN_CONFIG.supabaseUrl);
    endpoint.searchParams.set("select", "published_data");
    endpoint.searchParams.set("content_key", `eq.${EXPERIENCE_COMMUNITY_CONTENT_KEY}`);
    endpoint.searchParams.set("limit", "1");

    const response = await fetch(endpoint, {
      headers: {
        apikey: ADMIN_CONFIG.supabaseAnonKey,
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Experience / Community CMS request failed with status ${response.status}`);
    }

    const rows = await response.json();
    const published = rows?.[0]?.published_data;

    if (published) applyExperienceCommunity(published);
  } catch (error) {
    console.warn("Experience / Community CMS unavailable; using static fallback.", error);
  }
};

loadPublishedExperienceCommunity();


const applyContact = (data) => {
  if (!data || typeof data !== "object") return;

  if (document.documentElement.dataset.availabilityLoaded !== "true") {
    applyText("contactStatusText", data.statusText);
  }
  applyText("contactKicker", data.kicker);
  applyText("contactTitleMain", data.titleMain);
  applyText("contactTitleAccent", data.titleAccent);
  applyText("contactDescription", data.description);

  applyText("contactWhatsappLabel", data.whatsappLabel);
  applyText("contactWhatsappDisplay", data.whatsappDisplay);
  applyText("contactWhatsappDescription", data.whatsappDescription);
  applyText("contactWhatsappAction", data.whatsappAction);

  const whatsappLink = byId("contactWhatsappLink");
  if (whatsappLink && isSafeHref(data.whatsappHref)) {
    whatsappLink.href = data.whatsappHref.trim();
  }

  applyText("contactEmailLabel", data.emailLabel);
  applyText("contactEmailAddress", data.emailAddress);
  applyText("contactEmailDescription", data.emailDescription);
  applyText("contactEmailAction", data.emailAction);

  const copyButton = byId("contactEmailAction");
  if (copyButton) {
    if (typeof data.emailAddress === "string" && data.emailAddress.trim()) {
      copyButton.dataset.copyEmail = data.emailAddress.trim();
    }
    if (typeof data.emailAction === "string" && data.emailAction.trim()) {
      copyButton.dataset.copyDefaultLabel = data.emailAction.trim();
    }
  }

  applyText("contactSocialGroupTitle", data.socialGroupTitle);
  applyText("contactProfilesGroupTitle", data.profilesGroupTitle);

  const links = [
    ["contactCallLink", data.callLabel, data.callHref],
    ["contactFacebookLink", data.facebookLabel, data.facebookHref],
    ["contactInstagramLink", data.instagramLabel, data.instagramHref],
    ["contactLinkedinLink", data.linkedinLabel, data.linkedinHref],
    ["contactGithubLink", data.githubLabel, data.githubHref],
    ["contactBehanceLink", data.behanceLabel, data.behanceHref]
  ];

  links.forEach(([id, label, href]) => {
    const link = byId(id);
    if (!link) return;
    if (typeof label === "string" && label.trim()) link.textContent = label.trim();
    if (isSafeHref(href)) link.href = href.trim();
  });

  document.documentElement.dataset.contactCms = "loaded";
};

const loadPublishedContact = async () => {
  try {
    const endpoint = new URL("/rest/v1/cms_content_entries", ADMIN_CONFIG.supabaseUrl);
    endpoint.searchParams.set("select", "published_data");
    endpoint.searchParams.set("content_key", `eq.${CONTACT_CONTENT_KEY}`);
    endpoint.searchParams.set("limit", "1");

    const response = await fetch(endpoint, {
      headers: {
        apikey: ADMIN_CONFIG.supabaseAnonKey,
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Contact CMS request failed with status ${response.status}`);
    }

    const rows = await response.json();
    const published = rows?.[0]?.published_data;

    if (published) applyContact(published);
  } catch (error) {
    console.warn("Contact CMS unavailable; using static fallback.", error);
  }
};

loadPublishedContact();


const applyFooterLinkGroup = (selectorPrefix, items) => {
  if (!Array.isArray(items)) return;

  items.forEach((item) => {
    if (!item?.key) return;
    const link = document.querySelector(`[${selectorPrefix}="${CSS.escape(item.key)}"]`);
    if (!link) return;

    if (typeof item.label === "string" && item.label.trim()) {
      link.textContent = item.label.trim();
    }
    if (isSafeHref(item.href)) {
      link.href = item.href.trim();
    }
  });
};

const applyFooter = (data) => {
  if (!data || typeof data !== "object") return;

  applyText("footerBrandName", data.brandName);
  applyText("footerBrandRole", data.brandRole);
  applyText("footerCopyright", data.copyrightText);
  applyText("footerRights", data.rightsText);

  applyFooterLinkGroup("data-cms-footer-nav", data.navLinks);
  applyFooterLinkGroup("data-cms-footer-profile", data.profileLinks);
  applyFooterLinkGroup("data-cms-footer-bottom", data.bottomLinks);

  const backToTop = byId("footerBackToTop");
  if (backToTop) {
    if (typeof data.backToTopLabel === "string" && data.backToTopLabel.trim()) {
      backToTop.textContent = data.backToTopLabel.trim();
    }
    if (isSafeHref(data.backToTopHref)) {
      backToTop.href = data.backToTopHref.trim();
    }
  }

  document.documentElement.dataset.footerCms = "loaded";
};

const loadPublishedFooter = async () => {
  try {
    const endpoint = new URL("/rest/v1/cms_content_entries", ADMIN_CONFIG.supabaseUrl);
    endpoint.searchParams.set("select", "published_data");
    endpoint.searchParams.set("content_key", `eq.${FOOTER_CONTENT_KEY}`);
    endpoint.searchParams.set("limit", "1");

    const response = await fetch(endpoint, {
      headers: {
        apikey: ADMIN_CONFIG.supabaseAnonKey,
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Footer CMS request failed with status ${response.status}`);
    }

    const rows = await response.json();
    const published = rows?.[0]?.published_data;

    if (published) applyFooter(published);
  } catch (error) {
    console.warn("Footer CMS unavailable; using static fallback.", error);
  }
};

loadPublishedFooter();


const HOME_SECTION_DEFAULTS = Object.freeze([
  "home",
  "work",
  "design-showcase",
  "services",
  "digital",
  "about",
  "skills",
  "experience",
  "contact"
]);

const normalizePublishedSectionLayout = (data) => {
  if (!data || !Array.isArray(data.sections)) return null;

  const known = new Set(HOME_SECTION_DEFAULTS);
  const used = new Set();
  const normalized = [];

  data.sections.forEach((item) => {
    if (!item || !known.has(item.key) || used.has(item.key)) return;
    used.add(item.key);
    normalized.push({
      key: item.key,
      visible: item.visible !== false
    });
  });

  HOME_SECTION_DEFAULTS.forEach((key) => {
    if (!used.has(key)) normalized.push({ key, visible: true });
  });

  return normalized;
};

const applySectionLayout = (data) => {
  const sections = normalizePublishedSectionLayout(data);
  if (!sections) return;

  const main = document.querySelector("main");
  if (!main) return;

  sections.forEach((item) => {
    const section = document.querySelector(
      `[data-cms-home-section="${CSS.escape(item.key)}"]`
    );
    if (!section) return;

    section.hidden = item.visible === false;
    main.appendChild(section);
  });

  document.documentElement.dataset.sectionLayoutCms = "loaded";
};

const loadPublishedSectionLayout = async () => {
  try {
    const endpoint = new URL("/rest/v1/cms_content_entries", ADMIN_CONFIG.supabaseUrl);
    endpoint.searchParams.set("select", "published_data");
    endpoint.searchParams.set("content_key", `eq.${SECTION_LAYOUT_CONTENT_KEY}`);
    endpoint.searchParams.set("limit", "1");

    const response = await fetch(endpoint, {
      headers: {
        apikey: ADMIN_CONFIG.supabaseAnonKey,
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Section Layout CMS request failed with status ${response.status}`);
    }

    const rows = await response.json();
    const published = rows?.[0]?.published_data;

    if (published) applySectionLayout(published);
  } catch (error) {
    console.warn("Section Layout CMS unavailable; using static homepage order.", error);
  }
};

loadPublishedSectionLayout();
