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

  applyText("contactStatusText", data.statusText);
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
  if (copyButton && typeof data.emailAddress === "string" && data.emailAddress.trim()) {
    copyButton.dataset.copyEmail = data.emailAddress.trim();
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
