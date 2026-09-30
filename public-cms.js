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

let publishedCaseStudyProjectIdsPromise = null;

const loadPublishedCaseStudyProjectIds = () => {
  if (publishedCaseStudyProjectIdsPromise) {
    return publishedCaseStudyProjectIdsPromise;
  }

  publishedCaseStudyProjectIdsPromise = (async () => {
    try {
      const endpoint = new URL(
        "/rest/v1/portfolio_case_studies",
        ADMIN_CONFIG.supabaseUrl
      );
      endpoint.searchParams.set("select", "project_id");
      endpoint.searchParams.set("is_published", "eq.true");

      const response = await fetch(endpoint, {
        headers: {
          apikey: ADMIN_CONFIG.supabaseAnonKey,
          Accept: "application/json"
        }
      });

      if (!response.ok) return new Set();

      const rows = await response.json();
      return new Set(
        (Array.isArray(rows) ? rows : [])
          .map((item) => item?.project_id)
          .filter(Boolean)
      );
    } catch {
      return new Set();
    }
  })();

  return publishedCaseStudyProjectIdsPromise;
};

const getProjectCaseHref = (project, caseStudyProjectIds) => {
  if (
    project?.id &&
    project?.slug &&
    caseStudyProjectIds?.has(project.id)
  ) {
    return "project.html?slug=" + encodeURIComponent(project.slug);
  }

  return isSafeHref(project?.action_href)
    ? String(project.action_href).trim()
    : "";
};

const applyText = (id, value) => {
  if (typeof value !== "string" || !value.trim()) return;
  const element = byId(id);
  if (element) element.textContent = value.trim();
};

const HERO_IMAGE_CACHE_KEY = "portfolio.hero.current-image";

const rememberHeroImage = (source) => {
  try {
    localStorage.setItem(HERO_IMAGE_CACHE_KEY, source);
  } catch {
    // Storage can be unavailable in strict/private browser modes.
  }
};

const revealHeroImage = (element) => {
  element?.removeAttribute("data-hero-pending");
};

const showStaticHeroFallback = (element) => {
  if (!element || !element.isConnected) return;

  const fallback = element.dataset.staticFallback || "assets/hero-visual.jpg";
  const onFallbackLoad = () => revealHeroImage(element);

  element.addEventListener("load", onFallbackLoad, { once: true });
  element.setAttribute("src", fallback);

  if (element.complete && element.naturalWidth > 0) {
    revealHeroImage(element);
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

    if (element.complete && element.naturalWidth > 0) {
      revealHeroImage(element);
      rememberHeroImage(nextSource);
    } else {
      element.addEventListener("load", () => {
        revealHeroImage(element);
        rememberHeroImage(nextSource);
      }, { once: true });
      element.addEventListener("error", () => showStaticHeroFallback(element), { once: true });
    }
    return;
  }

  element.setAttribute("data-hero-pending", "true");

  element.addEventListener("load", () => {
    applyAlt();
    revealHeroImage(element);
    rememberHeroImage(nextSource);
  }, { once: true });

  element.addEventListener("error", () => {
    showStaticHeroFallback(element);
  }, { once: true });

  // Load the current CMS Hero directly in the real <img>. It stays hidden
  // until load completes, so the previous/static portrait never flashes.
  element.setAttribute("src", nextSource);

  if (element.complete && element.naturalWidth > 0) {
    applyAlt();
    revealHeroImage(element);
    rememberHeroImage(nextSource);
  }
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

    if (heroImage && !heroImage.getAttribute("src")) {
      showStaticHeroFallback(heroImage);
    }

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

const realProjectsPhase2FallbackCards = (() => {
  const grid = document.querySelector("#work .real-projects-grid");
  return grid ? [...grid.children] : [];
})();

const fallbackMatchesEngineProject = (card, project) => {
  if (!card || !project) return false;

  const key = String(card.dataset?.cmsProject || "").trim().toLowerCase();
  const slug = String(project.slug || "").trim().toLowerCase();

  if (
    key &&
    slug &&
    (key === slug || slug.startsWith(key + "-") || key.startsWith(slug + "-"))
  ) {
    return true;
  }

  if (card.tagName === "A" && isSafeHref(project.action_href)) {
    const fallbackHref = String(card.getAttribute("href") || "").trim();
    const projectHref = String(project.action_href || "").trim();

    if (fallbackHref && fallbackHref === projectHref) {
      return true;
    }
  }

  return false;
};

const applyStaticCaseStudyLinks = (
  grid,
  projects,
  caseStudyProjectIds = new Set()
) => {
  if (!grid) return;

  const publicCaseProjects = (Array.isArray(projects) ? projects : [])
    .filter(
      (project) =>
        project?.id &&
        project?.slug &&
        caseStudyProjectIds.has(project.id)
    );

  if (!publicCaseProjects.length) return;

  [...grid.children].forEach((card) => {
    if (card.dataset?.engineProject) return;

    const project = publicCaseProjects.find((item) =>
      fallbackMatchesEngineProject(card, item)
    );
    if (!project) return;

    const href = getProjectCaseHref(project, caseStudyProjectIds);
    if (!isSafeHref(href)) return;

    if (card.tagName === "A") {
      card.setAttribute("href", href);
      return;
    }

    const opener = card.querySelector(".real-project-open, .project-open");
    if (!opener) return;

    opener.dataset.dynamicCaseHref = href;
    opener.removeAttribute("aria-haspopup");
    opener.setAttribute(
      "aria-label",
      "View " + (project.title || "project") + " case study"
    );

    if (opener.dataset.dynamicCaseBound !== "true") {
      opener.dataset.dynamicCaseBound = "true";
      opener.addEventListener(
        "click",
        (event) => {
          const nextHref = opener.dataset.dynamicCaseHref;
          if (!isSafeHref(nextHref)) return;

          event.preventDefault();
          event.stopImmediatePropagation();
          window.location.assign(nextHref);
        },
        { capture: true }
      );
    }

    const action = card.querySelector('[data-cms-field="actionLabel"]');
    if (action) action.textContent = "View project ↗";
  });
};

const renderPortfolioEngineHomepageProjects = (
  projects,
  categories,
  caseStudyProjectIds = new Set(),
  publishedCaseStudyProjects = []
) => {
  const grid = document.querySelector("#work .real-projects-grid");
  if (!grid) return;

  const projectList = Array.isArray(projects) ? projects : [];

  const categoryMap = new Map(
    (Array.isArray(categories) ? categories : []).map((category) => [
      category.id,
      category.name
    ])
  );

  const validProjects = projectList.filter(
    (project) =>
      project &&
      typeof project.title === "string" &&
      project.title.trim() &&
      isSafeImageSource(project.cover_image_url)
  );

  if (!validProjects.length) {
    applyStaticCaseStudyLinks(
      grid,
      publishedCaseStudyProjects,
      caseStudyProjectIds
    );
    return;
  }

  const fragment = document.createDocumentFragment();

  const selected = validProjects.slice(0, 4);

  selected.forEach((project) => {
    const projectHref = getProjectCaseHref(project, caseStudyProjectIds);
    const hasLink = isSafeHref(projectHref);
    const card = document.createElement(hasLink ? "a" : "article");
    card.className = "real-project-card real-project-split-card";
    card.dataset.engineProject = project.slug || project.id;

    if (hasLink) {
      card.setAttribute("href", projectHref);
    }

    const thumb = document.createElement("div");
    thumb.className = "real-project-thumb";

    const image = document.createElement("img");
    image.src = project.cover_image_url.trim();
    image.alt =
      typeof project.cover_image_alt === "string" && project.cover_image_alt.trim()
        ? project.cover_image_alt.trim()
        : project.title.trim() + " project cover";
    image.loading = "lazy";
    image.decoding = "async";
    thumb.appendChild(image);

    const details = document.createElement("div");
    details.className = "real-project-details";

    const category = document.createElement("small");
    category.textContent =
      categoryMap.get(project.category_id) || "Portfolio Project";

    const title = document.createElement("strong");
    title.textContent = project.title.trim();

    const description = document.createElement("p");
    description.textContent =
      typeof project.summary === "string" && project.summary.trim()
        ? project.summary.trim()
        : "Selected portfolio project.";

    const action = document.createElement("span");
    const actionLabel =
      typeof project.action_label === "string" && project.action_label.trim()
        ? project.action_label.trim()
        : "View project";
    action.textContent = hasLink && !actionLabel.includes("↗")
      ? actionLabel + " ↗"
      : actionLabel;

    details.append(category, title, description, action);
    card.append(thumb, details);
    fragment.appendChild(card);
  });

  const remainingSlots = Math.max(0, 4 - selected.length);
  const fallbackCandidates = realProjectsPhase2FallbackCards.filter(
    (card) =>
      !selected.some((project) => fallbackMatchesEngineProject(card, project))
  );

  fallbackCandidates.slice(0, remainingSlots).forEach((card) => {
    fragment.appendChild(card);
  });

  grid.replaceChildren(fragment);
  applyStaticCaseStudyLinks(
    grid,
    publishedCaseStudyProjects,
    caseStudyProjectIds
  );
  grid.dataset.engineSelectedCount = String(selected.length);
  document.documentElement.dataset.portfolioEngineHome = "loaded";
};

const loadPortfolioEngineHomepageProjects = async () => {
  try {
    const projectsEndpoint = new URL(
      "/rest/v1/portfolio_projects",
      ADMIN_CONFIG.supabaseUrl
    );
    projectsEndpoint.searchParams.set(
      "select",
      "id,slug,title,summary,category_id,cover_image_url,cover_image_alt,action_label,action_href,is_featured,show_on_homepage,sort_order,published_at,created_at"
    );
    projectsEndpoint.searchParams.set("show_on_homepage", "eq.true");
    projectsEndpoint.searchParams.set("is_published", "eq.true");
    projectsEndpoint.searchParams.set("visibility", "eq.public");
    projectsEndpoint.searchParams.set(
      "order",
      "is_featured.desc,sort_order.asc,published_at.desc.nullslast,created_at.desc"
    );
    projectsEndpoint.searchParams.set("limit", "4");

    const categoriesEndpoint = new URL(
      "/rest/v1/portfolio_categories",
      ADMIN_CONFIG.supabaseUrl
    );
    categoriesEndpoint.searchParams.set("select", "id,name");
    categoriesEndpoint.searchParams.set("is_active", "eq.true");
    categoriesEndpoint.searchParams.set("order", "name.asc");

    const publicProjectsEndpoint = new URL(
      "/rest/v1/portfolio_projects",
      ADMIN_CONFIG.supabaseUrl
    );
    publicProjectsEndpoint.searchParams.set(
      "select",
      "id,slug,title,action_href"
    );
    publicProjectsEndpoint.searchParams.set("is_published", "eq.true");
    publicProjectsEndpoint.searchParams.set("visibility", "eq.public");

    const headers = {
      apikey: ADMIN_CONFIG.supabaseAnonKey,
      Accept: "application/json"
    };

    const [projectResponse, categoryResponse, publicProjectsResponse] =
      await Promise.all([
        fetch(projectsEndpoint, { headers }),
        fetch(categoriesEndpoint, { headers }),
        fetch(publicProjectsEndpoint, { headers })
      ]);

    if (!projectResponse.ok) {
      throw new Error(
        `Portfolio Engine homepage request failed with status ${projectResponse.status}`
      );
    }

    if (!categoryResponse.ok) {
      throw new Error(
        `Portfolio category request failed with status ${categoryResponse.status}`
      );
    }

    if (!publicProjectsResponse.ok) {
      throw new Error(
        `Portfolio public project bridge request failed with status ${publicProjectsResponse.status}`
      );
    }

    const [projects, categories, caseStudyProjectIds, publicProjects] =
      await Promise.all([
        projectResponse.json(),
        categoryResponse.json(),
        loadPublishedCaseStudyProjectIds(),
        publicProjectsResponse.json()
      ]);

    const publishedCaseStudyProjects = (
      Array.isArray(publicProjects) ? publicProjects : []
    ).filter((project) => caseStudyProjectIds.has(project?.id));

    renderPortfolioEngineHomepageProjects(
      projects,
      categories,
      caseStudyProjectIds,
      publishedCaseStudyProjects
    );
  } catch (error) {
    // Existing Phase 2 cards remain the safe public fallback.
    console.warn(
      "Portfolio Engine homepage selection unavailable; using Phase 2 fallback.",
      error
    );
  }
};

loadPortfolioEngineHomepageProjects();


const initProjectExplorer = () => {
  const root = byId("projectExplorer");
  const searchInput = byId("projectExplorerSearch");
  const categorySelect = byId("projectExplorerCategory");
  const tagSelect = byId("projectExplorerTag");
  const badgeSelect = byId("projectExplorerBadge");
  const resetButton = byId("projectExplorerReset");
  const status = byId("projectExplorerStatus");
  const grid = byId("projectExplorerGrid");
  const empty = byId("projectExplorerEmpty");

  if (
    !root ||
    !searchInput ||
    !categorySelect ||
    !tagSelect ||
    !badgeSelect ||
    !resetButton ||
    !status ||
    !grid ||
    !empty
  ) {
    return;
  }

  let projects = [];
  let categories = [];
  let categoryMap = new Map();
  let caseStudyProjectIds = new Set();

  const normalize = (value) => String(value || "").trim().toLowerCase();

  const uniqueValues = (items) => {
    const seen = new Set();
    const output = [];

    items.forEach((value) => {
      const clean = String(value || "").trim();
      const key = clean.toLowerCase();
      if (!clean || seen.has(key)) return;
      seen.add(key);
      output.push(clean);
    });

    return output.sort((a, b) => a.localeCompare(b));
  };

  const fillSelect = (select, firstLabel, values) => {
    const current = select.value;
    select.innerHTML = "";

    const first = document.createElement("option");
    first.value = "";
    first.textContent = firstLabel;
    select.appendChild(first);

    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });

    if ([...select.options].some((option) => option.value === current)) {
      select.value = current;
    }
  };

  const renderCard = (project) => {
    const projectHref = getProjectCaseHref(project, caseStudyProjectIds);
    const hasLink = isSafeHref(projectHref);
    const card = document.createElement(hasLink ? "a" : "article");
    card.className = "project-explorer-card";

    if (hasLink) {
      card.href = projectHref;
    }

    const visual = document.createElement("div");
    visual.className = "project-explorer-visual";

    if (isSafeImageSource(project.cover_image_url)) {
      const image = document.createElement("img");
      image.src = project.cover_image_url.trim();
      image.alt =
        typeof project.cover_image_alt === "string" && project.cover_image_alt.trim()
          ? project.cover_image_alt.trim()
          : project.title + " project cover";
      image.loading = "lazy";
      image.decoding = "async";
      visual.appendChild(image);
    } else {
      const noCover = document.createElement("span");
      noCover.textContent = "PROJECT";
      visual.appendChild(noCover);
    }

    const body = document.createElement("div");
    body.className = "project-explorer-body";

    const badgeRow = document.createElement("div");
    badgeRow.className = "project-explorer-badges";

    (Array.isArray(project.badges) ? project.badges : []).forEach((badge) => {
      const chip = document.createElement("span");
      chip.textContent = badge;
      badgeRow.appendChild(chip);
    });

    const meta = document.createElement("small");
    meta.textContent =
      categoryMap.get(project.category_id) || "Portfolio Project";

    const title = document.createElement("strong");
    title.textContent = project.title || "Untitled Project";

    const summary = document.createElement("p");
    summary.textContent =
      typeof project.summary === "string" && project.summary.trim()
        ? project.summary.trim()
        : "Selected portfolio project.";

    const tagRow = document.createElement("div");
    tagRow.className = "project-explorer-tags";

    (Array.isArray(project.tags) ? project.tags : []).forEach((tag) => {
      const chip = document.createElement("span");
      chip.textContent = tag;
      tagRow.appendChild(chip);
    });

    body.append(badgeRow, meta, title, summary, tagRow);

    if (hasLink) {
      const action = document.createElement("span");
      action.className = "project-explorer-action";
      const label =
        typeof project.action_label === "string" && project.action_label.trim()
          ? project.action_label.trim()
          : "View project";
      action.textContent = label.includes("↗") ? label : label + " ↗";
      body.appendChild(action);
    }

    card.append(visual, body);
    return card;
  };

  const applyFilters = () => {
    const query = normalize(searchInput.value);
    const categoryId = categorySelect.value;
    const tag = normalize(tagSelect.value);
    const badge = normalize(badgeSelect.value);

    const filtered = projects.filter((project) => {
      const categoryName = categoryMap.get(project.category_id) || "";
      const tags = Array.isArray(project.tags) ? project.tags : [];
      const badges = Array.isArray(project.badges) ? project.badges : [];

      const searchText = [
        project.title,
        project.summary,
        categoryName,
        ...tags,
        ...badges
      ]
        .map(normalize)
        .join(" ");

      const matchesSearch = !query || searchText.includes(query);
      const matchesCategory = !categoryId || project.category_id === categoryId;
      const matchesTag =
        !tag || tags.some((value) => normalize(value) === tag);
      const matchesBadge =
        !badge || badges.some((value) => normalize(value) === badge);

      return matchesSearch && matchesCategory && matchesTag && matchesBadge;
    });

    filtered.sort((a, b) => {
      const orderDiff = (a.sort_order ?? 0) - (b.sort_order ?? 0);
      if (orderDiff) return orderDiff;

      const aDate = Date.parse(a.published_at || a.created_at || 0) || 0;
      const bDate = Date.parse(b.published_at || b.created_at || 0) || 0;
      return bDate - aDate;
    });

    grid.replaceChildren();

    filtered.forEach((project) => {
      grid.appendChild(renderCard(project));
    });

    const hasResults = filtered.length > 0;
    empty.hidden = hasResults;
    grid.hidden = !hasResults;

    status.textContent =
      filtered.length +
      (filtered.length === 1 ? " project" : " projects") +
      (filtered.length === projects.length ? "" : " matched");

    document.documentElement.dataset.projectExplorerFiltered = "true";
  };

  const load = async () => {
    status.textContent = "Loading projects…";

    try {
      const projectsEndpoint = new URL(
        "/rest/v1/portfolio_projects",
        ADMIN_CONFIG.supabaseUrl
      );
      projectsEndpoint.searchParams.set(
        "select",
        "id,slug,title,summary,category_id,cover_image_url,cover_image_alt,action_label,action_href,tags,badges,sort_order,published_at,created_at"
      );
      projectsEndpoint.searchParams.set("is_published", "eq.true");
      projectsEndpoint.searchParams.set("visibility", "eq.public");
      projectsEndpoint.searchParams.set(
        "order",
        "sort_order.asc,published_at.desc.nullslast,created_at.desc"
      );

      const categoriesEndpoint = new URL(
        "/rest/v1/portfolio_categories",
        ADMIN_CONFIG.supabaseUrl
      );
      categoriesEndpoint.searchParams.set("select", "id,name");
      categoriesEndpoint.searchParams.set("is_active", "eq.true");
      categoriesEndpoint.searchParams.set("order", "name.asc");

      const headers = {
        apikey: ADMIN_CONFIG.supabaseAnonKey,
        Accept: "application/json"
      };

      const [projectResponse, categoryResponse] = await Promise.all([
        fetch(projectsEndpoint, { headers }),
        fetch(categoriesEndpoint, { headers })
      ]);

      if (!projectResponse.ok) {
        throw new Error(
          `Project Explorer request failed with status ${projectResponse.status}`
        );
      }

      if (!categoryResponse.ok) {
        throw new Error(
          `Project Explorer category request failed with status ${categoryResponse.status}`
        );
      }

      [projects, categories, caseStudyProjectIds] = await Promise.all([
        projectResponse.json(),
        categoryResponse.json(),
        loadPublishedCaseStudyProjectIds()
      ]);

      categoryMap = new Map(
        categories.map((category) => [category.id, category.name])
      );

      if (!projects.length) {
        root.hidden = true;
        return;
      }

      fillSelect(
        categorySelect,
        "All categories",
        categories.map((category) => category.name)
      );

      // Category options need ids for exact filtering.
      categorySelect.innerHTML = "";
      const allCategories = document.createElement("option");
      allCategories.value = "";
      allCategories.textContent = "All categories";
      categorySelect.appendChild(allCategories);
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
      });

      fillSelect(
        tagSelect,
        "All tags",
        uniqueValues(projects.flatMap((project) => project.tags || []))
      );

      fillSelect(
        badgeSelect,
        "All badges",
        uniqueValues(projects.flatMap((project) => project.badges || []))
      );

      root.hidden = false;
      applyFilters();
      document.documentElement.dataset.projectExplorerCms = "loaded";
    } catch (error) {
      root.hidden = true;
      console.warn("Project Explorer unavailable.", error);
    }
  };

  [searchInput, categorySelect, tagSelect, badgeSelect].forEach((control) => {
    control.addEventListener(
      control === searchInput ? "input" : "change",
      applyFilters
    );
  });

  resetButton.addEventListener("click", () => {
    searchInput.value = "";
    categorySelect.value = "";
    tagSelect.value = "";
    badgeSelect.value = "";
    applyFilters();
    searchInput.focus();
  });

  load();
};

initProjectExplorer();


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
