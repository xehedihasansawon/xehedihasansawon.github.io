import { ADMIN_CONFIG } from "./admin/config.js";

const byId = (id) => document.getElementById(id);

const loading = byId("caseLoading");
const errorState = byId("caseError");
const content = byId("caseStudyContent");
const sectionsRoot = byId("caseSections");

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

const isSafeImage = (value) => {
  const src = String(value || "").trim();
  if (!src) return false;

  if (
    src.startsWith("/") ||
    src.startsWith("./") ||
    src.startsWith("../")
  ) {
    return true;
  }

  try {
    return ["https:", "http:"].includes(new URL(src).protocol);
  } catch {
    return false;
  }
};

const fetchJson = async (url) => {
  const response = await fetch(url, {
    headers: {
      apikey: ADMIN_CONFIG.supabaseAnonKey,
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Case study request failed with status " + response.status);
  }

  return response.json();
};

const createHeading = (text, level = "h2") => {
  const heading = document.createElement(level);
  const clean = String(text || "").trim();

  if (!clean) return heading;

  const words = clean.split(/s+/);
  if (words.length === 1) {
    const accent = document.createElement("span");
    accent.textContent = words[0];
    heading.appendChild(accent);
    return heading;
  }

  heading.appendChild(
    document.createTextNode(words.slice(0, -1).join(" ") + " ")
  );

  const accent = document.createElement("span");
  accent.textContent = words.at(-1);
  heading.appendChild(accent);

  return heading;
};

const createLightboxButton = (src, alt, className = "") => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "case-image-button " + className;
  button.dataset.lightbox = src;
  button.setAttribute("aria-haspopup", "dialog");

  const image = document.createElement("img");
  image.src = src;
  image.alt = alt || "Project artwork";
  image.loading = "lazy";
  image.decoding = "async";

  button.appendChild(image);
  return button;
};

const createSectionHeader = (section) => {
  const header = document.createElement("div");
  header.className = "case-section-head";

  const titleWrap = document.createElement("div");

  if (section.eyebrow) {
    const eyebrow = document.createElement("p");
    eyebrow.className = "case-eyebrow";
    eyebrow.textContent = section.eyebrow;
    titleWrap.appendChild(eyebrow);
  }

  if (section.title) {
    titleWrap.appendChild(createHeading(section.title));
  }

  header.appendChild(titleWrap);

  if (section.body) {
    const body = document.createElement("p");
    body.textContent = section.body;
    header.appendChild(body);
  }

  return header;
};

const renderTextSection = (section) => {
  const wrapper = document.createElement("section");
  wrapper.className = "case-section section-line";

  const shell = document.createElement("div");
  shell.className = "shell case-intro-grid";

  const headingWrap = document.createElement("div");

  if (section.eyebrow) {
    const eyebrow = document.createElement("p");
    eyebrow.className = "case-eyebrow";
    eyebrow.textContent = section.eyebrow;
    headingWrap.appendChild(eyebrow);
  }

  if (section.title) {
    headingWrap.appendChild(createHeading(section.title));
  }

  const body = document.createElement("p");
  body.textContent = section.body || "";

  shell.append(headingWrap, body);
  wrapper.appendChild(shell);

  return wrapper;
};

const renderImageSection = (section) => {
  if (!isSafeImage(section.image_url)) {
    return renderTextSection(section);
  }

  const wrapper = document.createElement("section");
  wrapper.className = "case-section dynamic-case-media-section section-line";

  const shell = document.createElement("div");
  shell.className = "shell";

  shell.appendChild(createSectionHeader(section));

  const mediaWrap = document.createElement("div");
  mediaWrap.className =
    section.layout === "portrait"
      ? "dynamic-case-single-image portrait"
      : "dynamic-case-single-image wide";

  mediaWrap.appendChild(
    createLightboxButton(
      section.image_url,
      section.image_alt || section.title || "Project artwork"
    )
  );

  shell.appendChild(mediaWrap);
  wrapper.appendChild(shell);

  return wrapper;
};

const renderGallerySection = (section) => {
  const images = (Array.isArray(section.images) ? section.images : [])
    .filter((image) => isSafeImage(image?.url));

  if (!images.length) {
    return renderTextSection(section);
  }

  const wrapper = document.createElement("section");
  wrapper.className = "case-section dynamic-case-gallery-section section-line";

  const shell = document.createElement("div");
  shell.className = "shell";

  shell.appendChild(createSectionHeader(section));

  const gallery = document.createElement("div");
  gallery.className = "dynamic-case-gallery";

  images.forEach((image) => {
    gallery.appendChild(
      createLightboxButton(
        image.url,
        image.alt || section.title || "Project gallery image"
      )
    );
  });

  shell.appendChild(gallery);
  wrapper.appendChild(shell);

  return wrapper;
};

const renderCardsSection = (section) => {
  const cards = (Array.isArray(section.cards) ? section.cards : [])
    .filter((card) => card?.title || card?.text);

  const wrapper = document.createElement("section");
  wrapper.className = "case-section section-line";

  const shell = document.createElement("div");
  shell.className = "shell";

  shell.appendChild(createSectionHeader(section));

  if (cards.length) {
    const grid = document.createElement("div");
    grid.className = "role-grid dynamic-case-role-grid";

    cards.forEach((card) => {
      const item = document.createElement("div");
      item.className = "role-card";

      const title = document.createElement("strong");
      title.textContent = card.title || "Feature";

      const text = document.createElement("span");
      text.textContent = card.text || "";

      item.append(title, text);
      grid.appendChild(item);
    });

    shell.appendChild(grid);
  }

  wrapper.appendChild(shell);
  return wrapper;
};

const renderSections = (sections) => {
  sectionsRoot.replaceChildren();

  (Array.isArray(sections) ? sections : []).forEach((section) => {
    const type = section?.type || "text";

    if (type === "image") {
      sectionsRoot.appendChild(renderImageSection(section));
    } else if (type === "gallery") {
      sectionsRoot.appendChild(renderGallerySection(section));
    } else if (type === "cards") {
      sectionsRoot.appendChild(renderCardsSection(section));
    } else {
      sectionsRoot.appendChild(renderTextSection(section));
    }
  });
};

const updateSeo = (project, caseStudy, heroImage) => {
  const title =
    (caseStudy.headline || project.title || "Project") +
    " Case Study | MD Mehedi Hasan Sawon";

  const description =
    caseStudy.lead ||
    project.summary ||
    "Project case study by MD Mehedi Hasan Sawon.";

  document.title = title;

  byId("caseMetaDescription")?.setAttribute("content", description);
  byId("caseOgTitle")?.setAttribute("content", title);
  byId("caseOgDescription")?.setAttribute("content", description);

  if (heroImage) {
    byId("caseOgImage")?.setAttribute("content", heroImage);
  }

  const canonical = new URL(window.location.href);
  canonical.search = "";
  canonical.searchParams.set("slug", project.slug);
  byId("caseCanonical")?.setAttribute("href", canonical.toString());
};

const renderRelatedProject = async (relatedProjectId) => {
  const section = byId("caseNext");

  if (!relatedProjectId) {
    section.hidden = true;
    return;
  }

  const endpoint = new URL(
    "/rest/v1/portfolio_projects",
    ADMIN_CONFIG.supabaseUrl
  );
  endpoint.searchParams.set(
    "select",
    "id,slug,title,summary,action_href"
  );
  endpoint.searchParams.set("id", "eq." + relatedProjectId);
  endpoint.searchParams.set("limit", "1");

  const rows = await fetchJson(endpoint);
  const related = rows[0];

  if (!related) {
    section.hidden = true;
    return;
  }

  const caseEndpoint = new URL(
    "/rest/v1/portfolio_case_studies",
    ADMIN_CONFIG.supabaseUrl
  );
  caseEndpoint.searchParams.set("select", "project_id");
  caseEndpoint.searchParams.set("project_id", "eq." + related.id);
  caseEndpoint.searchParams.set("is_published", "eq.true");
  caseEndpoint.searchParams.set("limit", "1");

  let relatedHasCase = false;

  try {
    const caseRows = await fetchJson(caseEndpoint);
    relatedHasCase = Boolean(caseRows[0]);
  } catch {
    relatedHasCase = false;
  }

  byId("caseNextTitle").replaceChildren(
    createHeading(related.title || "Related Project").childNodes[0] || document.createTextNode("")
  );
  const nextTitle = byId("caseNextTitle");
  nextTitle.replaceChildren(...createHeading(related.title || "Related Project").childNodes);

  byId("caseNextSummary").textContent =
    related.summary || "Explore another selected portfolio project.";

  const link = byId("caseNextLink");
  const fallbackHref = isSafeHref(related.action_href)
    ? related.action_href
    : "index.html#work";

  link.href = relatedHasCase
    ? "project.html?slug=" + encodeURIComponent(related.slug)
    : fallbackHref;

  section.hidden = false;
};

const renderCaseStudy = async (project, caseStudy) => {
  const heroImage = isSafeImage(caseStudy.hero_image_url)
    ? caseStudy.hero_image_url
    : isSafeImage(project.cover_image_url)
      ? project.cover_image_url
      : "";

  byId("caseKicker").textContent =
    caseStudy.kicker || "Featured Case Study";

  const headline = byId("caseHeadline");
  headline.replaceChildren(...createHeading(
    caseStudy.headline || project.title || "Project",
    "h1"
  ).childNodes);

  byId("caseLead").textContent =
    caseStudy.lead || project.summary || "";

  const tagsRoot = byId("caseTags");
  tagsRoot.replaceChildren();

  (Array.isArray(project.tags) ? project.tags : []).forEach((tag) => {
    const chip = document.createElement("span");
    chip.textContent = tag;
    tagsRoot.appendChild(chip);
  });

  const heroVisual = byId("caseHeroVisual");
  heroVisual.replaceChildren();

  if (heroImage) {
    const image = document.createElement("img");
    image.src = heroImage;
    image.alt =
      caseStudy.hero_image_alt ||
      project.cover_image_alt ||
      project.title ||
      "Project cover";
    image.fetchPriority = "high";
    image.decoding = "async";
    heroVisual.appendChild(image);
  } else {
    const placeholder = document.createElement("div");
    placeholder.className = "dynamic-case-no-image";
    placeholder.textContent = "CASE STUDY";
    heroVisual.appendChild(placeholder);
  }

  const facts = (Array.isArray(caseStudy.facts) ? caseStudy.facts : [])
    .filter((fact) => fact?.label || fact?.value);

  const summary = byId("caseSummary");
  const factsRoot = byId("caseFacts");
  factsRoot.replaceChildren();

  if (facts.length) {
    facts.forEach((fact) => {
      const item = document.createElement("div");

      const label = document.createElement("small");
      label.textContent = fact.label || "DETAIL";

      const value = document.createElement("strong");
      value.textContent = fact.value || "—";

      item.append(label, value);
      factsRoot.appendChild(item);
    });
    summary.hidden = false;
  } else {
    summary.hidden = true;
  }

  renderSections(caseStudy.sections);

  const cta = byId("caseCta");
  const ctaLink = byId("caseCtaLink");

  if (
    caseStudy.cta_label &&
    isSafeHref(caseStudy.cta_href)
  ) {
    ctaLink.childNodes[0].textContent = caseStudy.cta_label + " ";
    ctaLink.href = caseStudy.cta_href;

    if (/^https?:/i.test(caseStudy.cta_href)) {
      ctaLink.target = "_blank";
      ctaLink.rel = "noreferrer";
    }

    cta.hidden = false;
  } else {
    cta.hidden = true;
  }

  try {
    await renderRelatedProject(caseStudy.related_project_id);
  } catch (error) {
    console.warn("Related project unavailable.", error);
    byId("caseNext").hidden = true;
  }

  updateSeo(project, caseStudy, heroImage);

  loading.hidden = true;
  errorState.hidden = true;
  content.hidden = false;
};

const showError = () => {
  loading.hidden = true;
  content.hidden = true;
  errorState.hidden = false;
};

const loadCaseStudy = async () => {
  const slug = new URLSearchParams(window.location.search).get("slug")?.trim();

  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    showError();
    return;
  }

  try {
    const projectEndpoint = new URL(
      "/rest/v1/portfolio_projects",
      ADMIN_CONFIG.supabaseUrl
    );
    projectEndpoint.searchParams.set(
      "select",
      "id,slug,title,summary,cover_image_url,cover_image_alt,tags,action_href"
    );
    projectEndpoint.searchParams.set("slug", "eq." + slug);
    projectEndpoint.searchParams.set("limit", "1");

    const projects = await fetchJson(projectEndpoint);
    const project = projects[0];

    if (!project) {
      showError();
      return;
    }

    const caseEndpoint = new URL(
      "/rest/v1/portfolio_case_studies",
      ADMIN_CONFIG.supabaseUrl
    );
    caseEndpoint.searchParams.set(
      "select",
      "id,project_id,kicker,headline,lead,hero_image_url,hero_image_alt,facts,sections,related_project_id,cta_label,cta_href,is_published,published_at"
    );
    caseEndpoint.searchParams.set("project_id", "eq." + project.id);
    caseEndpoint.searchParams.set("is_published", "eq.true");
    caseEndpoint.searchParams.set("limit", "1");

    const caseStudies = await fetchJson(caseEndpoint);
    const caseStudy = caseStudies[0];

    if (!caseStudy) {
      showError();
      return;
    }

    await renderCaseStudy(project, caseStudy);
  } catch (error) {
    console.warn("Dynamic case study unavailable.", error);
    showError();
  }
};

const menuButton = byId("menuButton");
const mobileNav = byId("mobileNav");

const closeMobileNav = () => {
  mobileNav?.classList.remove("open");
  menuButton?.setAttribute("aria-expanded", "false");
};

menuButton?.addEventListener("click", () => {
  const open = mobileNav?.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(Boolean(open)));
});

mobileNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMobileNav);
});

const lightbox = byId("caseLightbox");
const lightboxImage = byId("caseLightboxImage");
const closeButton = byId("caseLightboxClose");
let lastLightboxTrigger = null;

document.addEventListener("click", (event) => {
  const trigger = event.target.closest?.("[data-lightbox]");
  if (!trigger || !lightbox || !lightboxImage) return;

  lastLightboxTrigger = trigger;
  lightboxImage.src = trigger.dataset.lightbox;
  lightboxImage.alt =
    trigger.querySelector("img")?.alt || "Project artwork";
  lightbox.showModal();
  document.body.style.overflow = "hidden";
});

closeButton?.addEventListener("click", () => lightbox.close());

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});

lightbox?.addEventListener("close", () => {
  document.body.style.overflow = "";
  lastLightboxTrigger?.focus();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  if (lightbox?.open) {
    lightbox.close();
    return;
  }

  if (mobileNav?.classList.contains("open")) {
    closeMobileNav();
    menuButton?.focus();
  }
});

loadCaseStudy();
