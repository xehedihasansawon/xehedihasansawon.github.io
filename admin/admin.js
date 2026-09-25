import { ADMIN_CONFIG } from "./config.js";

const configPanel = document.querySelector("#configPanel");
const loginPanel = document.querySelector("#loginPanel");
const recoveryRequestPanel = document.querySelector("#recoveryRequestPanel");
const passwordUpdatePanel = document.querySelector("#passwordUpdatePanel");
const adminPanel = document.querySelector("#adminPanel");

const loginForm = document.querySelector("#loginForm");
const loginButton = document.querySelector("#loginButton");
const forgotPasswordButton = document.querySelector("#forgotPasswordButton");
const loginMessage = document.querySelector("#loginMessage");

const recoveryRequestForm = document.querySelector("#recoveryRequestForm");
const recoveryRequestButton = document.querySelector("#recoveryRequestButton");
const recoveryRequestMessage = document.querySelector("#recoveryRequestMessage");
const backToLoginButton = document.querySelector("#backToLoginButton");

const passwordUpdateForm = document.querySelector("#passwordUpdateForm");
const passwordUpdateButton = document.querySelector("#passwordUpdateButton");
const passwordUpdateMessage = document.querySelector("#passwordUpdateMessage");
const cancelRecoveryButton = document.querySelector("#cancelRecoveryButton");

const logoutButton = document.querySelector("#logoutButton");
const adminMessage = document.querySelector("#adminMessage");
const emailDisplay = document.querySelector("#adminEmailDisplay");
const mobileMenuToggle = document.querySelector("#mobileMenuToggle");
const sidebarBackdrop = document.querySelector("#sidebarBackdrop");
const dashboardNavLink = document.querySelector("#dashboardNavLink");
const homepageNavButton = document.querySelector("#homepageNavButton");
const realProjectsNavButton = document.querySelector("#realProjectsNavButton");
const designShowcaseNavButton = document.querySelector("#designShowcaseNavButton");
const dashboard = document.querySelector("#dashboard");
const homepageEditor = document.querySelector("#homepageEditor");
const realProjectsEditor = document.querySelector("#realProjectsEditor");
const designShowcaseEditor = document.querySelector("#designShowcaseEditor");
const cmsPageEyebrow = document.querySelector("#cmsPageEyebrow");
const cmsPageTitle = document.querySelector("#cmsPageTitle");

const heroEditorForm = document.querySelector("#heroEditorForm");
const heroEditorState = document.querySelector("#heroEditorState");
const heroEditorMessage = document.querySelector("#heroEditorMessage");
const heroPreviewButton = document.querySelector("#heroPreviewButton");
const heroSaveButton = document.querySelector("#heroSaveButton");
const heroPublishButton = document.querySelector("#heroPublishButton");
const heroDraftPreview = document.querySelector("#heroDraftPreview");
const closeHeroPreviewButton = document.querySelector("#closeHeroPreviewButton");
const heroImageUploadInput = document.querySelector("#heroImageUploadInput");
const heroImageUploadButton = document.querySelector("#heroImageUploadButton");
const heroImageUploadStatus = document.querySelector("#heroImageUploadStatus");
const heroImageSelectionPreview = document.querySelector("#heroImageSelectionPreview");

const realProjectsEditorForm = document.querySelector("#realProjectsEditorForm");
const realProjectsEditorList = document.querySelector("#realProjectsEditorList");
const realProjectsEditorState = document.querySelector("#realProjectsEditorState");
const realProjectsEditorMessage = document.querySelector("#realProjectsEditorMessage");
const realProjectsPreviewButton = document.querySelector("#realProjectsPreviewButton");
const realProjectsSaveButton = document.querySelector("#realProjectsSaveButton");
const realProjectsPublishButton = document.querySelector("#realProjectsPublishButton");
const realProjectsDraftPreview = document.querySelector("#realProjectsDraftPreview");
const closeRealProjectsPreviewButton = document.querySelector("#closeRealProjectsPreviewButton");
const realProjectsPreviewGrid = document.querySelector("#realProjectsPreviewGrid");

const designShowcaseEditorForm = document.querySelector("#designShowcaseEditorForm");
const designShowcaseEditorList = document.querySelector("#designShowcaseEditorList");
const designShowcaseEditorState = document.querySelector("#designShowcaseEditorState");
const designShowcaseEditorMessage = document.querySelector("#designShowcaseEditorMessage");
const designShowcasePreviewButton = document.querySelector("#designShowcasePreviewButton");
const designShowcaseSaveButton = document.querySelector("#designShowcaseSaveButton");
const designShowcasePublishButton = document.querySelector("#designShowcasePublishButton");
const designShowcaseDraftPreview = document.querySelector("#designShowcaseDraftPreview");
const closeDesignShowcasePreviewButton = document.querySelector("#closeDesignShowcasePreviewButton");
const designShowcasePreviewGrid = document.querySelector("#designShowcasePreviewGrid");
const contentStoreDot = document.querySelector("#contentStoreDot");
const contentStoreStatus = document.querySelector("#contentStoreStatus");
const revisionStoreDot = document.querySelector("#revisionStoreDot");
const revisionStoreStatus = document.querySelector("#revisionStoreStatus");
const publishActionDot = document.querySelector("#publishActionDot");
const publishActionStatus = document.querySelector("#publishActionStatus");

const allPanels = [
  configPanel,
  loginPanel,
  recoveryRequestPanel,
  passwordUpdatePanel,
  adminPanel
];

const initialUrl = new URL(window.location.href);
const initialHashParams = new URLSearchParams(
  initialUrl.hash.startsWith("#") ? initialUrl.hash.slice(1) : initialUrl.hash
);
const initialRecoveryIntent =
  initialHashParams.get("type") === "recovery" ||
  initialUrl.searchParams.get("recovery") === "1";

let recoveryMode = initialRecoveryIntent;

const isPlaceholder = (value) =>
  !value ||
  value.startsWith("YOUR_") ||
  value.includes("example.supabase.co");

const hasValidConfig =
  !isPlaceholder(ADMIN_CONFIG.supabaseUrl) &&
  !isPlaceholder(ADMIN_CONFIG.supabaseAnonKey);

const showOnly = (panel) => {
  allPanels.forEach((item) => {
    item.hidden = item !== panel;
  });
};

const setMessage = (element, message = "") => {
  element.textContent = message;
};

const setLoginBusy = (busy) => {
  loginButton.disabled = busy;
  loginButton.textContent = busy ? "Checking access…" : "Sign in securely";
};

const setRecoveryRequestBusy = (busy) => {
  recoveryRequestButton.disabled = busy;
  recoveryRequestButton.textContent = busy
    ? "Sending recovery email…"
    : "Send recovery email";
};

const setPasswordUpdateBusy = (busy) => {
  passwordUpdateButton.disabled = busy;
  passwordUpdateButton.textContent = busy
    ? "Saving new password…"
    : "Save new password";
};

const setSidebarOpen = (open) => {
  if (!adminPanel || !mobileMenuToggle) return;

  adminPanel.classList.toggle("sidebar-open", open);
  mobileMenuToggle.setAttribute("aria-expanded", String(open));
  mobileMenuToggle.setAttribute(
    "aria-label",
    open ? "Close admin menu" : "Open admin menu"
  );
};

mobileMenuToggle?.addEventListener("click", () => {
  setSidebarOpen(!adminPanel.classList.contains("sidebar-open"));
});

sidebarBackdrop?.addEventListener("click", () => {
  setSidebarOpen(false);
});

dashboardNavLink?.addEventListener("click", () => {
  setSidebarOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && adminPanel?.classList.contains("sidebar-open")) {
    setSidebarOpen(false);
    mobileMenuToggle?.focus();
  }
});

const desktopShellQuery = window.matchMedia("(min-width: 901px)");
desktopShellQuery.addEventListener?.("change", (event) => {
  if (event.matches) setSidebarOpen(false);
});

if (!hasValidConfig) {
  showOnly(configPanel);
} else if (!window.supabase?.createClient) {
  showOnly(configPanel);
  configPanel.querySelector("h2").textContent = "Supabase client failed to load.";
  configPanel.querySelector("p:last-child").textContent =
    "Check your internet connection and reload the page.";
} else {
  const supabaseClient = window.supabase.createClient(
    ADMIN_CONFIG.supabaseUrl,
    ADMIN_CONFIG.supabaseAnonKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  );

  const recoveryRedirectUrl = new URL("./", window.location.href);
  recoveryRedirectUrl.search = "";
  recoveryRedirectUrl.hash = "";

  const setContentStoreStatus = (state, label) => {
    if (!contentStoreDot || !contentStoreStatus) return;

    contentStoreDot.classList.remove("checking", "ready", "missing");
    contentStoreDot.classList.add(state);
    contentStoreStatus.textContent = label;
  };

  const checkContentStore = async () => {
    setContentStoreStatus("checking", "Checking…");

    const { error } = await supabaseClient
      .from("cms_content_entries")
      .select("content_key", { head: true, count: "exact" });

    if (error) {
      console.warn("CMS content store check failed:", error.message);
      setContentStoreStatus("missing", "Migration required");
      return false;
    }

    setContentStoreStatus("ready", "Ready");
    return true;
  };

  const setRevisionStoreStatus = (state, label) => {
    if (!revisionStoreDot || !revisionStoreStatus) return;

    revisionStoreDot.classList.remove("checking", "ready", "missing");
    revisionStoreDot.classList.add(state);
    revisionStoreStatus.textContent = label;
  };

  const checkRevisionStore = async () => {
    setRevisionStoreStatus("checking", "Checking…");

    const { error } = await supabaseClient
      .from("cms_content_revisions")
      .select("revision_id", { head: true, count: "exact" });

    if (error) {
      console.warn("CMS revision store check failed:", error.message);
      setRevisionStoreStatus("missing", "Migration required");
      return false;
    }

    setRevisionStoreStatus("ready", "Ready");
    return true;
  };

  const setPublishActionStatus = (state, label) => {
    if (!publishActionDot || !publishActionStatus) return;

    publishActionDot.classList.remove("checking", "ready", "missing");
    publishActionDot.classList.add(state);
    publishActionStatus.textContent = label;
  };

  const checkPublishAction = async () => {
    setPublishActionStatus("checking", "Checking…");

    const { data, error } = await supabaseClient.rpc("cms_publish_foundation_ready");

    if (error || data !== true) {
      if (error) {
        console.warn("CMS publish action check failed:", error.message);
      }
      setPublishActionStatus("missing", "Migration required");
      return false;
    }

    setPublishActionStatus("ready", "Ready");
    return true;
  };

  const HERO_CONTENT_KEY = "homepage.hero";
  const HERO_MEDIA_BUCKET = "portfolio-media";
  const HERO_MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
  const HERO_ALLOWED_IMAGE_TYPES = Object.freeze({
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp"
  });

  const heroDefaults = Object.freeze({
    statusText: "Available for freelance and remote projects",
    eyebrow: "Graphic Designer • Brand Creator • Digital Systems",
    nameLine1: "MD MEHEDI",
    nameLine2: "HASAN SAWON",
    rolePrefix: "I create",
    highlight1: "bold visual identities",
    highlight2: "social and sports graphics",
    highlight3: "practical digital experiences",
    roleSuffix: "for growing brands and teams.",
    primaryLabel: "View selected work",
    primaryHref: "#work",
    secondaryLabel: "Let's Work Together",
    secondaryHref: "#contact",
    meta1: "Brand identity",
    meta2: "Social & sports design",
    meta3: "AI & business workflows",
    imageSrc: "assets/hero-visual.jpg",
    imageAlt: "MD Mehedi Hasan Sawon portrait"
  });

  let heroFormDirty = false;
  let heroLastLoadedDraft = null;

  const heroField = (name) => heroEditorForm?.elements?.namedItem(name);

  const setHeroEditorMessage = (message = "") => {
    if (heroEditorMessage) heroEditorMessage.textContent = message;
  };

  const setHeroEditorState = (label) => {
    if (heroEditorState) heroEditorState.textContent = label;
  };

  const setHeroImageUploadStatus = (message = "") => {
    if (heroImageUploadStatus) heroImageUploadStatus.textContent = message;
  };

  const setHeroImageUploadBusy = (busy) => {
    if (!heroImageUploadButton) return;
    heroImageUploadButton.disabled = busy;
    heroImageUploadButton.textContent = busy ? "Uploading…" : "Upload image";
  };

  const setEditorBusy = (busy) => {
    [heroPreviewButton, heroSaveButton, heroPublishButton].forEach((button) => {
      if (button) button.disabled = busy;
    });
  };

  const isSafeCmsHref = (value) => {
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
      const absolute = new URL(href);
      return ["https:", "http:", "mailto:", "tel:"].includes(absolute.protocol);
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

  const readHeroForm = () => {
    if (!heroEditorForm?.reportValidity()) return null;

    const data = {};
    Object.keys(heroDefaults).forEach((key) => {
      data[key] = String(heroField(key)?.value || "").trim();
    });

    if (!isSafeCmsHref(data.primaryHref) || !isSafeCmsHref(data.secondaryHref)) {
      setHeroEditorMessage("Use a safe internal link or http/https/mailto/tel URL for both buttons.");
      return null;
    }

    if (!isSafeImageSource(data.imageSrc)) {
      setHeroEditorMessage("Use an existing relative image path or an HTTPS image URL.");
      return null;
    }

    return data;
  };

  const resolvePreviewImage = (src) => {
    if (/^https:\/\//i.test(src)) return src;
    try {
      return new URL("../" + src.replace(/^\.\//, ""), window.location.href).href;
    } catch {
      return "";
    }
  };

  const syncHeroImageSelectionPreview = (src) => {
    if (!heroImageSelectionPreview) return;

    const resolved = resolvePreviewImage(String(src || "").trim());
    if (!resolved) {
      heroImageSelectionPreview.removeAttribute("src");
      return;
    }

    heroImageSelectionPreview.src = resolved;
  };

  const populateHeroForm = (data = {}) => {
    const content = { ...heroDefaults, ...data };

    Object.entries(content).forEach(([key, value]) => {
      const field = heroField(key);
      if (field) field.value = value ?? "";
    });

    syncHeroImageSelectionPreview(content.imageSrc);
    setHeroImageUploadStatus("");
    if (heroImageUploadInput) heroImageUploadInput.value = "";

    heroLastLoadedDraft = structuredClone(content);
    heroFormDirty = false;
    setHeroEditorState("Draft loaded");
  };

  const uploadHeroImage = async () => {
    const file = heroImageUploadInput?.files?.[0];

    if (!file) {
      setHeroImageUploadStatus("Choose an image first.");
      return;
    }

    const extension = HERO_ALLOWED_IMAGE_TYPES[file.type];

    if (!extension) {
      setHeroImageUploadStatus("Use JPG, PNG or WebP.");
      return;
    }

    if (file.size > HERO_MAX_UPLOAD_BYTES) {
      setHeroImageUploadStatus("Image is larger than 8 MB.");
      return;
    }

    setHeroImageUploadBusy(true);
    setHeroImageUploadStatus("Uploading image…");

    try {
      const uniquePart =
        globalThis.crypto?.randomUUID?.() ||
        Math.random().toString(36).slice(2, 12);

      const objectPath = `hero/${Date.now()}-${uniquePart}.${extension}`;

      const { error: uploadError } = await supabaseClient.storage
        .from(HERO_MEDIA_BUCKET)
        .upload(objectPath, file, {
          cacheControl: "31536000",
          contentType: file.type,
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabaseClient.storage
        .from(HERO_MEDIA_BUCKET)
        .getPublicUrl(objectPath);

      const publicUrl = publicUrlData?.publicUrl;

      if (!publicUrl) {
        throw new Error("Storage did not return a public image URL.");
      }

      const imageSrcField = heroField("imageSrc");
      if (imageSrcField) {
        imageSrcField.value = publicUrl;
      }

      syncHeroImageSelectionPreview(publicUrl);
      heroFormDirty = true;
      setHeroEditorState("Unsaved changes");
      setHeroImageUploadStatus("Image uploaded. Save draft to keep this selection.");
    } catch (error) {
      console.error("Hero image upload failed:", error);
      setHeroImageUploadStatus(
        error?.message || "Could not upload the Hero image."
      );
    } finally {
      setHeroImageUploadBusy(false);
    }
  };

  const renderHeroPreview = (data) => {
    const text = (selector, value) => {
      const element = document.querySelector(selector);
      if (element) element.textContent = value;
    };

    text("#previewHeroStatus", data.statusText);
    text("#previewHeroEyebrow", data.eyebrow);
    text("#previewHeroName1", data.nameLine1);
    text("#previewHeroName2", data.nameLine2);
    text("#previewHeroRolePrefix", data.rolePrefix);
    text("#previewHeroHighlight1", data.highlight1);
    text("#previewHeroHighlight2", data.highlight2);
    text("#previewHeroHighlight3", data.highlight3);
    text("#previewHeroRoleSuffix", data.roleSuffix);
    text("#previewHeroPrimary", data.primaryLabel + " →");
    text("#previewHeroSecondary", data.secondaryLabel);
    text("#previewHeroMeta1", data.meta1);
    text("#previewHeroMeta2", data.meta2);
    text("#previewHeroMeta3", data.meta3);

    const image = document.querySelector("#previewHeroImage");
    if (image) {
      image.src = resolvePreviewImage(data.imageSrc);
      image.alt = data.imageAlt;
    }

    heroDraftPreview.hidden = false;
    heroDraftPreview.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const showCmsView = (view) => {
    const isDashboard = view === "dashboard";
    const isHero = view === "hero";
    const isRealProjects = view === "real-projects";
    const isDesignShowcase = view === "design-showcase";

    dashboard.hidden = !isDashboard;
    homepageEditor.hidden = !isHero;
    realProjectsEditor.hidden = !isRealProjects;
    designShowcaseEditor.hidden = !isDesignShowcase;

    dashboardNavLink?.classList.toggle("active", isDashboard);
    homepageNavButton?.classList.toggle("active", isHero);
    realProjectsNavButton?.classList.toggle("active", isRealProjects);
    designShowcaseNavButton?.classList.toggle("active", isDesignShowcase);

    [dashboardNavLink, homepageNavButton, realProjectsNavButton, designShowcaseNavButton].forEach((item) => {
      item?.removeAttribute("aria-current");
    });

    if (isHero) {
      homepageNavButton?.setAttribute("aria-current", "page");
      cmsPageEyebrow.textContent = "HOMEPAGE CMS";
      cmsPageTitle.textContent = "Hero";
    } else if (isRealProjects) {
      realProjectsNavButton?.setAttribute("aria-current", "page");
      cmsPageEyebrow.textContent = "HOMEPAGE CMS";
      cmsPageTitle.textContent = "Real Life Projects";
    } else if (isDesignShowcase) {
      designShowcaseNavButton?.setAttribute("aria-current", "page");
      cmsPageEyebrow.textContent = "HOMEPAGE CMS";
      cmsPageTitle.textContent = "Design Showcase";
    } else {
      dashboardNavLink?.setAttribute("aria-current", "page");
      cmsPageEyebrow.textContent = "HOMEPAGE CMS";
      cmsPageTitle.textContent = "Dashboard";
    }

    setSidebarOpen(false);
  };

  const loadHeroEditor = async () => {
    setHeroEditorMessage("Loading Hero draft…");
    setHeroEditorState("Loading…");

    const { data, error } = await supabaseClient
      .from("cms_content_entries")
      .select("content_key,draft_data,published_data,draft_updated_at,published_at")
      .eq("content_key", HERO_CONTENT_KEY)
      .maybeSingle();

    if (error) {
      console.error("Hero CMS load failed:", error);
      populateHeroForm(heroDefaults);
      setHeroEditorState("Load failed");
      setHeroEditorMessage("Could not load the Hero content store.");
      return false;
    }

    if (!data) {
      populateHeroForm(heroDefaults);
      setHeroEditorState("Setup required");
      setHeroEditorMessage("Run the Phase 2A Hero seed migration before saving.");
      return false;
    }

    populateHeroForm(data.draft_data || heroDefaults);

    const draftMatchesPublished =
      JSON.stringify(data.draft_data || {}) === JSON.stringify(data.published_data || {});

    setHeroEditorState(draftMatchesPublished ? "Published · synced" : "Draft differs from live");
    setHeroEditorMessage(
      data.published_at
        ? "Hero draft loaded. Preview or edit before publishing."
        : "Hero draft loaded. This content has not been published yet."
    );

    return true;
  };

  dashboardNavLink?.addEventListener("click", (event) => {
    event.preventDefault();
    showCmsView("dashboard");
  });

  homepageNavButton?.addEventListener("click", async () => {
    showCmsView("hero");
    await loadHeroEditor();
  });

  heroEditorForm?.addEventListener("input", (event) => {
    if (event.target === heroImageUploadInput) return;

    heroFormDirty = true;
    setHeroEditorState("Unsaved changes");

    if (event.target === heroField("imageSrc")) {
      syncHeroImageSelectionPreview(event.target.value);
    }
  });

  heroImageUploadButton?.addEventListener("click", uploadHeroImage);

  heroImageUploadInput?.addEventListener("change", async () => {
    const file = heroImageUploadInput.files?.[0];

    if (!file) {
      setHeroImageUploadStatus("");
      return;
    }

    setHeroImageUploadStatus(`Selected: ${file.name} · starting upload…`);
    await uploadHeroImage();
  });

  heroPreviewButton?.addEventListener("click", () => {
    setHeroEditorMessage("");
    const data = readHeroForm();
    if (!data) return;
    renderHeroPreview(data);
  });

  closeHeroPreviewButton?.addEventListener("click", () => {
    heroDraftPreview.hidden = true;
  });

  heroEditorForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    setHeroEditorMessage("");

    const draft = readHeroForm();
    if (!draft) return;

    setEditorBusy(true);
    setHeroEditorState("Saving…");

    try {
      const { data, error } = await supabaseClient
        .from("cms_content_entries")
        .update({ draft_data: draft })
        .eq("content_key", HERO_CONTENT_KEY)
        .select("content_key,draft_updated_at")
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setHeroEditorState("Setup required");
        setHeroEditorMessage("Hero row is missing. Run the Phase 2A seed migration first.");
        return;
      }

      heroLastLoadedDraft = structuredClone(draft);
      heroFormDirty = false;
      setHeroEditorState("Draft saved");
      setHeroEditorMessage("Draft saved. The published CMS Hero has not changed.");
    } catch (error) {
      console.error("Hero draft save failed:", error);
      setHeroEditorState("Save failed");
      setHeroEditorMessage("Could not save the Hero draft.");
    } finally {
      setEditorBusy(false);
    }
  });

  heroPublishButton?.addEventListener("click", async () => {
    setHeroEditorMessage("");

    if (heroFormDirty) {
      setHeroEditorState("Unsaved changes");
      setHeroEditorMessage("Save the draft first, then publish.");
      return;
    }

    if (!heroLastLoadedDraft) {
      setHeroEditorMessage("Load or save the Hero draft before publishing.");
      return;
    }

    setEditorBusy(true);
    setHeroEditorState("Publishing…");

    try {
      const { data, error } = await supabaseClient.rpc("cms_publish_content", {
        p_content_key: HERO_CONTENT_KEY
      });

      if (error) throw error;
      if (!data?.length) throw new Error("Publish returned no Hero row.");

      setHeroEditorState("Published · synced");
      setHeroEditorMessage("Hero published to the CMS. Localhost reads this version now; the production website will use it only after an explicit live deployment.");
    } catch (error) {
      console.error("Hero publish failed:", error);
      setHeroEditorState("Publish failed");
      setHeroEditorMessage(error?.message || "Could not publish the Hero.");
    } finally {
      setEditorBusy(false);
    }
  });

  const REAL_PROJECTS_CONTENT_KEY = "homepage.real-life-projects";

  const realProjectsDefaults = Object.freeze({
    eyebrow: "Selected real-world work",
    titleMain: "REAL LIFE",
    titleAccent: "PROJECTS",
    projects: [
      {
        key: "ssfc",
        type: "link",
        category: "Sports Branding · Event Creative",
        title: "SSFC",
        description: "Tournament identity, event visuals, social graphics and organizing support.",
        actionLabel: "View case ↗",
        href: "ssfc.html",
        imageSrc: "assets/case-ssfc-final.jpg",
        imageAlt: "Shaheen School Football Championship case study cover"
      },
      {
        key: "biporjoy",
        type: "link",
        category: "Team Identity · Sports Design",
        title: "Biporjoy 18",
        description: "Football team identity, jersey direction and tournament-ready sports graphics.",
        actionLabel: "View project ↗",
        href: "biporjoy.html",
        imageSrc: "assets/case-biporjoy18-final.jpg",
        imageAlt: "Biporjoy 18 football team identity cover"
      },
      {
        key: "miuw",
        type: "preview",
        category: "ERP Workflow · Business System",
        title: "MIUW ERP",
        description: "Orders, inventory, sourcing, delivery, finance and reporting in one workflow.",
        actionLabel: "Preview ↗",
        imageSrc: "assets/case-miuw-final.jpg",
        imageAlt: "MIUW ERP business system cover"
      },
      {
        key: "portfolio",
        type: "preview",
        category: "Personal Brand · UI · Front-End",
        title: "PORTFOLIO",
        description: "Personal brand, selected work and digital systems presented in one experience.",
        actionLabel: "View build ↗",
        imageSrc: "assets/case-portfolio-final.jpg",
        imageAlt: "Mehedi Portfolio website cover"
      }
    ]
  });

  let realProjectsDirty = false;
  let realProjectsLastLoadedDraft = null;

  const cloneRealProjectsDefaults = () => structuredClone(realProjectsDefaults);

  const setRealProjectsMessage = (message = "") => {
    if (realProjectsEditorMessage) realProjectsEditorMessage.textContent = message;
  };

  const setRealProjectsState = (label) => {
    if (realProjectsEditorState) realProjectsEditorState.textContent = label;
  };

  const setRealProjectsBusy = (busy) => {
    [realProjectsPreviewButton, realProjectsSaveButton, realProjectsPublishButton].forEach((button) => {
      if (button) button.disabled = busy;
    });
  };

  const projectEditorCard = (project, index) => {
    const typeLabel = project.type === "link" ? "LINK CARD" : "PREVIEW CARD";

    return `
      <article class="project-editor-card" data-project-key="${project.key}" data-project-type="${project.type}">
        <header>
          <div>
            <small>PROJECT ${index + 1}</small>
            <h4>${project.title}</h4>
          </div>
          <b>${typeLabel}</b>
        </header>

        <div class="editor-grid two">
          <label>
            <span>Category / meta</span>
            <input data-project-field="category" type="text" maxlength="100" required>
          </label>
          <label>
            <span>Project title</span>
            <input data-project-field="title" type="text" maxlength="80" required>
          </label>
          <label class="editor-grid-span">
            <span>Description</span>
            <textarea data-project-field="description" rows="3" maxlength="220" required></textarea>
          </label>
          <label>
            <span>Action label</span>
            <input data-project-field="actionLabel" type="text" maxlength="50" required>
          </label>
          ${project.type === "link" ? `
          <label>
            <span>Project link</span>
            <input data-project-field="href" type="text" maxlength="240" required>
          </label>` : `
          <div class="project-fixed-note">
            <span>Card action</span>
            <strong>Existing private preview modal</strong>
          </div>`}
        </div>

        <div class="project-image-editor">
          <div class="project-upload-block">
            <span>Project image</span>
            <input data-project-upload type="file" accept="image/jpeg,image/png,image/webp">
            <small data-project-upload-status>JPG, PNG or WebP · maximum 8 MB</small>
          </div>

          <div class="project-image-current">
            <img data-project-image-preview alt="">
          </div>
        </div>

        <div class="editor-grid two">
          <label>
            <span>Image path / URL</span>
            <input data-project-field="imageSrc" type="text" maxlength="500" required>
          </label>
          <label>
            <span>Image alt text</span>
            <input data-project-field="imageAlt" type="text" maxlength="160" required>
          </label>
        </div>
      </article>
    `;
  };

  const renderRealProjectsEditorCards = () => {
    if (!realProjectsEditorList) return;

    realProjectsEditorList.innerHTML = realProjectsDefaults.projects
      .map(projectEditorCard)
      .join("");
  };

  const projectCardElement = (key) =>
    realProjectsEditorList?.querySelector(`[data-project-key="${key}"]`);

  const fillProjectEditorCard = (project) => {
    const card = projectCardElement(project.key);
    if (!card) return;

    Object.entries(project).forEach(([field, value]) => {
      if (["key", "type"].includes(field)) return;
      const input = card.querySelector(`[data-project-field="${field}"]`);
      if (input) input.value = value ?? "";
    });

    const preview = card.querySelector("[data-project-image-preview]");
    if (preview) {
      preview.src = resolvePreviewImage(project.imageSrc);
      preview.alt = project.imageAlt || project.title || "Project preview";
    }
  };

  const populateRealProjectsForm = (data = {}) => {
    const defaults = cloneRealProjectsDefaults();
    const incomingProjects = Array.isArray(data.projects) ? data.projects : [];

    const merged = {
      ...defaults,
      ...data,
      projects: defaults.projects.map((project) => {
        const incoming = incomingProjects.find((item) => item?.key === project.key) || {};
        return { ...project, ...incoming, key: project.key, type: project.type };
      })
    };

    realProjectsEditorForm.elements.namedItem("eyebrow").value = merged.eyebrow;
    realProjectsEditorForm.elements.namedItem("titleMain").value = merged.titleMain;
    realProjectsEditorForm.elements.namedItem("titleAccent").value = merged.titleAccent;

    merged.projects.forEach(fillProjectEditorCard);

    realProjectsLastLoadedDraft = structuredClone(merged);
    realProjectsDirty = false;
    setRealProjectsState("Draft loaded");
  };

  const readRealProjectsForm = () => {
    if (!realProjectsEditorForm) return null;

    const missingRequired = [...realProjectsEditorForm.querySelectorAll("[required]")].find(
      (field) => !String(field.value || "").trim()
    );

    if (missingRequired) {
      const projectCard = missingRequired.closest("[data-project-key]");
      const projectTitle =
        projectCard?.querySelector('[data-project-field="title"]')?.value?.trim() ||
        projectCard?.dataset.projectKey ||
        "section heading";
      const fieldLabel =
        missingRequired.closest("label")?.querySelector("span")?.textContent?.trim() ||
        "required field";

      setRealProjectsMessage(`Complete "${fieldLabel}" for ${projectTitle} before saving.`);
      missingRequired.focus();
      missingRequired.scrollIntoView({ behavior: "smooth", block: "center" });
      return null;
    }

    const projects = realProjectsDefaults.projects.map((project) => {
      const card = projectCardElement(project.key);
      const get = (field) =>
        String(card?.querySelector(`[data-project-field="${field}"]`)?.value || "").trim();

      const result = {
        key: project.key,
        type: project.type,
        category: get("category"),
        title: get("title"),
        description: get("description"),
        actionLabel: get("actionLabel"),
        imageSrc: get("imageSrc"),
        imageAlt: get("imageAlt")
      };

      if (project.type === "link") {
        result.href = get("href");
      }

      return result;
    });

    for (const project of projects) {
      if (!isSafeImageSource(project.imageSrc)) {
        setRealProjectsMessage(`Use a safe image path or HTTPS image URL for ${project.title}.`);
        return null;
      }

      if (project.type === "link" && !isSafeCmsHref(project.href)) {
        setRealProjectsMessage(`Use a safe project link for ${project.title}.`);
        return null;
      }
    }

    return {
      eyebrow: String(realProjectsEditorForm.elements.namedItem("eyebrow").value || "").trim(),
      titleMain: String(realProjectsEditorForm.elements.namedItem("titleMain").value || "").trim(),
      titleAccent: String(realProjectsEditorForm.elements.namedItem("titleAccent").value || "").trim(),
      projects
    };
  };

  const renderRealProjectsPreview = (data) => {
    document.querySelector("#previewRealProjectsEyebrow").textContent = data.eyebrow;
    document.querySelector("#previewRealProjectsTitleMain").textContent = data.titleMain;
    document.querySelector("#previewRealProjectsTitleAccent").textContent = data.titleAccent;

    realProjectsPreviewGrid.innerHTML = "";

    data.projects.forEach((project) => {
      const card = document.createElement("article");
      card.className = "real-projects-preview-card";

      const image = document.createElement("img");
      image.src = resolvePreviewImage(project.imageSrc);
      image.alt = project.imageAlt || project.title;

      const body = document.createElement("div");
      const category = document.createElement("small");
      category.textContent = project.category;
      const title = document.createElement("strong");
      title.textContent = project.title;
      const description = document.createElement("p");
      description.textContent = project.description;
      const action = document.createElement("span");
      action.textContent = project.actionLabel;

      body.append(category, title, description, action);
      card.append(image, body);
      realProjectsPreviewGrid.appendChild(card);
    });

    realProjectsDraftPreview.hidden = false;
    realProjectsDraftPreview.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const loadRealProjectsEditor = async () => {
    setRealProjectsMessage("Loading Real Life Projects draft…");
    setRealProjectsState("Loading…");

    const { data, error } = await supabaseClient
      .from("cms_content_entries")
      .select("content_key,draft_data,published_data,draft_updated_at,published_at")
      .eq("content_key", REAL_PROJECTS_CONTENT_KEY)
      .maybeSingle();

    if (error) {
      console.error("Real Life Projects CMS load failed:", error);
      populateRealProjectsForm(realProjectsDefaults);
      setRealProjectsState("Load failed");
      setRealProjectsMessage("Could not load the Real Life Projects content store.");
      return false;
    }

    if (!data) {
      populateRealProjectsForm(realProjectsDefaults);
      setRealProjectsState("Setup required");
      setRealProjectsMessage("Run the Phase 2B seed migration before saving.");
      return false;
    }

    populateRealProjectsForm(data.draft_data || realProjectsDefaults);

    const synced =
      JSON.stringify(data.draft_data || {}) === JSON.stringify(data.published_data || {});

    setRealProjectsState(synced ? "Published · synced" : "Draft differs from live");
    setRealProjectsMessage(
      data.published_at
        ? "Projects draft loaded. Preview or edit before publishing."
        : "Projects draft loaded. This content has not been published yet."
    );

    return true;
  };

  const uploadRealProjectImage = async (input) => {
    const file = input?.files?.[0];
    const card = input?.closest("[data-project-key]");
    const key = card?.dataset.projectKey;
    const status = card?.querySelector("[data-project-upload-status]");

    const setStatus = (message) => {
      if (status) status.textContent = message;
    };

    if (!file || !card || !key) return;

    const extension = HERO_ALLOWED_IMAGE_TYPES[file.type];

    if (!extension) {
      setStatus("Use JPG, PNG or WebP.");
      return;
    }

    if (file.size > HERO_MAX_UPLOAD_BYTES) {
      setStatus("Image is larger than 8 MB.");
      return;
    }

    setStatus("Uploading…");

    try {
      const uniquePart =
        globalThis.crypto?.randomUUID?.() ||
        Math.random().toString(36).slice(2, 12);

      const objectPath = `homepage-projects/${key}/${Date.now()}-${uniquePart}.${extension}`;

      const { error: uploadError } = await supabaseClient.storage
        .from(HERO_MEDIA_BUCKET)
        .upload(objectPath, file, {
          cacheControl: "31536000",
          contentType: file.type,
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabaseClient.storage
        .from(HERO_MEDIA_BUCKET)
        .getPublicUrl(objectPath);

      const publicUrl = publicUrlData?.publicUrl;
      if (!publicUrl) throw new Error("Storage did not return a public image URL.");

      const srcInput = card.querySelector('[data-project-field="imageSrc"]');
      const preview = card.querySelector("[data-project-image-preview]");

      if (srcInput) srcInput.value = publicUrl;
      if (preview) preview.src = publicUrl;

      realProjectsDirty = true;
      setRealProjectsState("Unsaved changes");
      setStatus("Uploaded. Save draft to keep this image.");
    } catch (error) {
      console.error("Project image upload failed:", error);
      setStatus(error?.message || "Could not upload image.");
    }
  };

  renderRealProjectsEditorCards();
  populateRealProjectsForm(realProjectsDefaults);

  realProjectsNavButton?.addEventListener("click", async () => {
    showCmsView("real-projects");
    await loadRealProjectsEditor();
  });

  realProjectsEditorForm?.addEventListener("input", (event) => {
    if (event.target.matches("[data-project-upload]")) return;

    realProjectsDirty = true;
    setRealProjectsState("Unsaved changes");

    if (event.target.matches('[data-project-field="imageSrc"]')) {
      const card = event.target.closest("[data-project-key]");
      const preview = card?.querySelector("[data-project-image-preview]");
      if (preview) preview.src = resolvePreviewImage(event.target.value);
    }
  });

  realProjectsEditorForm?.addEventListener("change", async (event) => {
    if (!event.target.matches("[data-project-upload]")) return;
    await uploadRealProjectImage(event.target);
  });

  realProjectsPreviewButton?.addEventListener("click", () => {
    setRealProjectsMessage("");
    const draft = readRealProjectsForm();
    if (!draft) return;
    renderRealProjectsPreview(draft);
  });

  closeRealProjectsPreviewButton?.addEventListener("click", () => {
    realProjectsDraftPreview.hidden = true;
  });

  const saveRealProjectsDraft = async () => {
    setRealProjectsMessage("");

    const draft = readRealProjectsForm();
    if (!draft) return false;

    setRealProjectsBusy(true);
    setRealProjectsState("Saving…");

    try {
      const { data, error } = await supabaseClient
        .from("cms_content_entries")
        .update({ draft_data: draft })
        .eq("content_key", REAL_PROJECTS_CONTENT_KEY)
        .select("content_key,draft_updated_at")
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setRealProjectsState("Setup required");
        setRealProjectsMessage("Real Life Projects row is missing. Run the Phase 2B seed migration first.");
        return false;
      }

      realProjectsLastLoadedDraft = structuredClone(draft);
      realProjectsDirty = false;
      setRealProjectsState("Draft saved");
      setRealProjectsMessage("Draft saved. Published project cards have not changed.");
      return true;
    } catch (error) {
      console.error("Real Life Projects draft save failed:", error);
      setRealProjectsState("Save failed");
      setRealProjectsMessage(
        error?.message
          ? `Could not save draft: ${error.message}`
          : "Could not save the Real Life Projects draft."
      );
      return false;
    } finally {
      setRealProjectsBusy(false);
    }
  };

  realProjectsSaveButton?.addEventListener("click", saveRealProjectsDraft);

  realProjectsEditorForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveRealProjectsDraft();
  });

  realProjectsPublishButton?.addEventListener("click", async () => {
    setRealProjectsMessage("");

    if (realProjectsDirty) {
      setRealProjectsState("Unsaved changes");
      setRealProjectsMessage("Save the draft first, then publish.");
      return;
    }

    if (!realProjectsLastLoadedDraft) {
      setRealProjectsMessage("Load or save the project draft before publishing.");
      return;
    }

    setRealProjectsBusy(true);
    setRealProjectsState("Publishing…");

    try {
      const { data, error } = await supabaseClient.rpc("cms_publish_content", {
        p_content_key: REAL_PROJECTS_CONTENT_KEY
      });

      if (error) throw error;
      if (!data?.length) throw new Error("Publish returned no project row.");

      setRealProjectsState("Published · synced");
      setRealProjectsMessage("Projects published to the CMS. Localhost reads this version now; production still waits for explicit live deployment.");
    } catch (error) {
      console.error("Real Life Projects publish failed:", error);
      setRealProjectsState("Publish failed");
      setRealProjectsMessage(error?.message || "Could not publish the project cards.");
    } finally {
      setRealProjectsBusy(false);
    }
  });

  const DESIGN_SHOWCASE_CONTENT_KEY = "homepage.design-showcase";

  const designShowcaseDefaults = Object.freeze({
    eyebrow: "Selected design work",
    titleMain: "DESIGN",
    titleAccent: "SHOWCASE",
    items: [
      {
        key: "sports-kit",
        cardTitle: "Custom Sports Kit",
        cardSubtitle: "Sportswear concept and jersey design.",
        modalTitle: "CUSTOM SPORTS KIT",
        modalEyebrow: "Design showcase",
        modalMeta: "Sportswear · Apparel Design",
        modalSummary: "A custom football kit concept focused on clear team identity, strong contrast and a presentation that works for both design review and sports promotion.",
        modalPoints: ["Jersey visual direction", "Front-and-back sportswear presentation", "Team-focused color and graphic treatment"],
        imageSrc: "assets/project-sportskit.jpg",
        imageAlt: "Custom sports kit design"
      },
      {
        key: "kings-kitchen",
        cardTitle: "King's Kitchen",
        cardSubtitle: "Restaurant menu and promotional design.",
        modalTitle: "KING'S KITCHEN",
        modalEyebrow: "Design showcase",
        modalMeta: "Menu Design · Restaurant Branding",
        modalSummary: "A restaurant-focused visual piece built around clear food presentation, readable hierarchy and a branded promotional look.",
        modalPoints: ["Menu-led information hierarchy", "Food and promotional visual balance", "Restaurant brand presentation"],
        imageSrc: "assets/project-kings.jpg",
        imageAlt: "King's Kitchen menu design"
      },
      {
        key: "long-lounge",
        cardTitle: "Long Lounge",
        cardSubtitle: "Hospitality social media promotional creative.",
        modalTitle: "LONG LOUNGE",
        modalEyebrow: "Design showcase",
        modalMeta: "Social Media Design · Hospitality",
        modalSummary: "A hospitality promotional creative designed to communicate the offer quickly while keeping the visual direction polished and social-media ready.",
        modalPoints: ["Promotional content hierarchy", "Hospitality-focused visual direction", "Social-media-ready composition"],
        imageSrc: "assets/project-lounge.jpg",
        imageAlt: "Long Lounge social media design"
      },
      {
        key: "cp-five-star",
        cardTitle: "CP Five Star",
        cardSubtitle: "Food promotion and social campaign creative.",
        modalTitle: "CP FIVE STAR",
        modalEyebrow: "Design showcase",
        modalMeta: "Social Media Design · Food Promotion",
        modalSummary: "A food-promotion creative that combines product focus, offer visibility and compact social advertising hierarchy.",
        modalPoints: ["Product-first composition", "Offer and callout hierarchy", "Platform-ready promotional design"],
        imageSrc: "assets/project-cp.jpg",
        imageAlt: "CP Five Star promotional design"
      }
    ]
  });

  let designShowcaseDirty = false;
  let designShowcaseLastLoadedDraft = null;

  const cloneDesignShowcaseDefaults = () => structuredClone(designShowcaseDefaults);

  const setDesignShowcaseMessage = (message = "") => {
    if (designShowcaseEditorMessage) designShowcaseEditorMessage.textContent = message;
  };

  const setDesignShowcaseState = (label) => {
    if (designShowcaseEditorState) designShowcaseEditorState.textContent = label;
  };

  const setDesignShowcaseBusy = (busy) => {
    [designShowcasePreviewButton, designShowcaseSaveButton, designShowcasePublishButton].forEach((button) => {
      if (button) button.disabled = busy;
    });
  };

  const designShowcaseEditorCard = (item, index) => `
    <article class="project-editor-card showcase-editor-card" data-showcase-key="${item.key}">
      <header>
        <div>
          <small>SHOWCASE ${index + 1}</small>
          <h4>${item.cardTitle}</h4>
        </div>
        <b>PROJECT SNAPSHOT</b>
      </header>

      <div class="editor-grid two">
        <label>
          <span>Card title</span>
          <input data-showcase-field="cardTitle" type="text" maxlength="80" required>
        </label>
        <label>
          <span>Card subtitle</span>
          <input data-showcase-field="cardSubtitle" type="text" maxlength="140" required>
        </label>
      </div>

      <div class="project-image-editor">
        <div class="project-upload-block">
          <span>Showcase image</span>
          <input data-showcase-upload type="file" accept="image/jpeg,image/png,image/webp">
          <small data-showcase-upload-status>JPG, PNG or WebP · maximum 8 MB</small>
        </div>
        <div class="project-image-current">
          <img data-showcase-image-preview alt="">
        </div>
      </div>

      <div class="editor-grid two">
        <label>
          <span>Image path / URL</span>
          <input data-showcase-field="imageSrc" type="text" maxlength="500" required>
        </label>
        <label>
          <span>Image alt text</span>
          <input data-showcase-field="imageAlt" type="text" maxlength="160" required>
        </label>
      </div>

      <div class="showcase-modal-fields">
        <p class="eyebrow">POPUP CONTENT</p>
        <div class="editor-grid two">
          <label>
            <span>Popup title</span>
            <input data-showcase-field="modalTitle" type="text" maxlength="100" required>
          </label>
          <label>
            <span>Popup eyebrow</span>
            <input data-showcase-field="modalEyebrow" type="text" maxlength="90" required>
          </label>
          <label class="editor-grid-span">
            <span>Popup meta</span>
            <input data-showcase-field="modalMeta" type="text" maxlength="140" required>
          </label>
          <label class="editor-grid-span">
            <span>Popup summary</span>
            <textarea data-showcase-field="modalSummary" rows="4" maxlength="500" required></textarea>
          </label>
          <label>
            <span>Point 1</span>
            <input data-showcase-field="modalPoint1" type="text" maxlength="160" required>
          </label>
          <label>
            <span>Point 2</span>
            <input data-showcase-field="modalPoint2" type="text" maxlength="160" required>
          </label>
          <label class="editor-grid-span">
            <span>Point 3</span>
            <input data-showcase-field="modalPoint3" type="text" maxlength="160" required>
          </label>
        </div>
      </div>
    </article>
  `;

  const renderDesignShowcaseEditorCards = () => {
    designShowcaseEditorList.innerHTML = designShowcaseDefaults.items
      .map(designShowcaseEditorCard)
      .join("");
  };

  const showcaseCardElement = (key) =>
    designShowcaseEditorList?.querySelector(`[data-showcase-key="${key}"]`);

  const fillDesignShowcaseCard = (item) => {
    const card = showcaseCardElement(item.key);
    if (!card) return;

    const simpleFields = ["cardTitle", "cardSubtitle", "modalTitle", "modalEyebrow", "modalMeta", "modalSummary", "imageSrc", "imageAlt"];
    simpleFields.forEach((field) => {
      const input = card.querySelector(`[data-showcase-field="${field}"]`);
      if (input) input.value = item[field] ?? "";
    });

    const points = Array.isArray(item.modalPoints) ? item.modalPoints : [];
    ["modalPoint1", "modalPoint2", "modalPoint3"].forEach((field, pointIndex) => {
      const input = card.querySelector(`[data-showcase-field="${field}"]`);
      if (input) input.value = points[pointIndex] ?? "";
    });

    const preview = card.querySelector("[data-showcase-image-preview]");
    if (preview) {
      preview.src = resolvePreviewImage(item.imageSrc);
      preview.alt = item.imageAlt || item.cardTitle || "Showcase preview";
    }
  };

  const populateDesignShowcaseForm = (data = {}) => {
    const defaults = cloneDesignShowcaseDefaults();
    const incomingItems = Array.isArray(data.items) ? data.items : [];

    const merged = {
      ...defaults,
      ...data,
      items: defaults.items.map((item) => {
        const incoming = incomingItems.find((candidate) => candidate?.key === item.key) || {};
        return { ...item, ...incoming, key: item.key };
      })
    };

    designShowcaseEditorForm.elements.namedItem("eyebrow").value = merged.eyebrow;
    designShowcaseEditorForm.elements.namedItem("titleMain").value = merged.titleMain;
    designShowcaseEditorForm.elements.namedItem("titleAccent").value = merged.titleAccent;
    merged.items.forEach(fillDesignShowcaseCard);

    designShowcaseLastLoadedDraft = structuredClone(merged);
    designShowcaseDirty = false;
    setDesignShowcaseState("Draft loaded");
  };

  const readDesignShowcaseForm = () => {
    if (!designShowcaseEditorForm) return null;

    const missingRequired = [...designShowcaseEditorForm.querySelectorAll("[required]")].find(
      (field) => !String(field.value || "").trim()
    );

    if (missingRequired) {
      const showcaseCard = missingRequired.closest("[data-showcase-key]");
      const showcaseTitle =
        showcaseCard?.querySelector('[data-showcase-field="cardTitle"]')?.value?.trim() ||
        showcaseCard?.dataset.showcaseKey ||
        "section heading";
      const fieldLabel =
        missingRequired.closest("label")?.querySelector("span")?.textContent?.trim() ||
        "required field";

      setDesignShowcaseMessage(`Complete "${fieldLabel}" for ${showcaseTitle} before saving.`);
      missingRequired.focus();
      missingRequired.scrollIntoView({ behavior: "smooth", block: "center" });
      return null;
    }

    const items = designShowcaseDefaults.items.map((item) => {
      const card = showcaseCardElement(item.key);
      const get = (field) =>
        String(card?.querySelector(`[data-showcase-field="${field}"]`)?.value || "").trim();

      return {
        key: item.key,
        cardTitle: get("cardTitle"),
        cardSubtitle: get("cardSubtitle"),
        modalTitle: get("modalTitle"),
        modalEyebrow: get("modalEyebrow"),
        modalMeta: get("modalMeta"),
        modalSummary: get("modalSummary"),
        modalPoints: [get("modalPoint1"), get("modalPoint2"), get("modalPoint3")],
        imageSrc: get("imageSrc"),
        imageAlt: get("imageAlt")
      };
    });

    for (const item of items) {
      if (!isSafeImageSource(item.imageSrc)) {
        setDesignShowcaseMessage(`Use a safe image path or HTTPS image URL for ${item.cardTitle}.`);
        return null;
      }
    }

    return {
      eyebrow: String(designShowcaseEditorForm.elements.namedItem("eyebrow").value || "").trim(),
      titleMain: String(designShowcaseEditorForm.elements.namedItem("titleMain").value || "").trim(),
      titleAccent: String(designShowcaseEditorForm.elements.namedItem("titleAccent").value || "").trim(),
      items
    };
  };

  const renderDesignShowcasePreview = (data) => {
    document.querySelector("#previewDesignShowcaseEyebrow").textContent = data.eyebrow;
    document.querySelector("#previewDesignShowcaseTitleMain").textContent = data.titleMain;
    document.querySelector("#previewDesignShowcaseTitleAccent").textContent = data.titleAccent;
    designShowcasePreviewGrid.innerHTML = "";

    data.items.forEach((item) => {
      const card = document.createElement("article");
      card.className = "design-showcase-preview-card";

      const image = document.createElement("img");
      image.src = resolvePreviewImage(item.imageSrc);
      image.alt = item.imageAlt || item.cardTitle;

      const body = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = item.cardTitle;
      const subtitle = document.createElement("small");
      subtitle.textContent = item.cardSubtitle;
      const modalMeta = document.createElement("span");
      modalMeta.textContent = item.modalMeta;

      body.append(title, subtitle, modalMeta);
      card.append(image, body);
      designShowcasePreviewGrid.appendChild(card);
    });

    designShowcaseDraftPreview.hidden = false;
    designShowcaseDraftPreview.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const loadDesignShowcaseEditor = async () => {
    setDesignShowcaseMessage("Loading Design Showcase draft…");
    setDesignShowcaseState("Loading…");

    const { data, error } = await supabaseClient
      .from("cms_content_entries")
      .select("content_key,draft_data,published_data,draft_updated_at,published_at")
      .eq("content_key", DESIGN_SHOWCASE_CONTENT_KEY)
      .maybeSingle();

    if (error) {
      console.error("Design Showcase CMS load failed:", error);
      populateDesignShowcaseForm(designShowcaseDefaults);
      setDesignShowcaseState("Load failed");
      setDesignShowcaseMessage("Could not load the Design Showcase content store.");
      return false;
    }

    if (!data) {
      populateDesignShowcaseForm(designShowcaseDefaults);
      setDesignShowcaseState("Setup required");
      setDesignShowcaseMessage("Run the Phase 2C seed migration before saving.");
      return false;
    }

    populateDesignShowcaseForm(data.draft_data || designShowcaseDefaults);

    const synced =
      JSON.stringify(data.draft_data || {}) === JSON.stringify(data.published_data || {});

    setDesignShowcaseState(synced ? "Published · synced" : "Draft differs from live");
    setDesignShowcaseMessage(
      data.published_at
        ? "Showcase draft loaded. Preview or edit before publishing."
        : "Showcase draft loaded. This content has not been published yet."
    );

    return true;
  };

  const uploadDesignShowcaseImage = async (input) => {
    const file = input?.files?.[0];
    const card = input?.closest("[data-showcase-key]");
    const key = card?.dataset.showcaseKey;
    const status = card?.querySelector("[data-showcase-upload-status]");

    const setStatus = (message) => {
      if (status) status.textContent = message;
    };

    if (!file || !card || !key) return;

    const extension = HERO_ALLOWED_IMAGE_TYPES[file.type];

    if (!extension) {
      setStatus("Use JPG, PNG or WebP.");
      return;
    }

    if (file.size > HERO_MAX_UPLOAD_BYTES) {
      setStatus("Image is larger than 8 MB.");
      return;
    }

    setStatus("Uploading…");

    try {
      const uniquePart =
        globalThis.crypto?.randomUUID?.() ||
        Math.random().toString(36).slice(2, 12);

      const objectPath = `design-showcase/${key}/${Date.now()}-${uniquePart}.${extension}`;

      const { error: uploadError } = await supabaseClient.storage
        .from(HERO_MEDIA_BUCKET)
        .upload(objectPath, file, {
          cacheControl: "31536000",
          contentType: file.type,
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabaseClient.storage
        .from(HERO_MEDIA_BUCKET)
        .getPublicUrl(objectPath);

      const publicUrl = publicUrlData?.publicUrl;
      if (!publicUrl) throw new Error("Storage did not return a public image URL.");

      const srcInput = card.querySelector('[data-showcase-field="imageSrc"]');
      const preview = card.querySelector("[data-showcase-image-preview]");
      if (srcInput) srcInput.value = publicUrl;
      if (preview) preview.src = publicUrl;

      designShowcaseDirty = true;
      setDesignShowcaseState("Unsaved changes");
      setStatus("Uploaded. Save draft to keep this image.");
    } catch (error) {
      console.error("Design Showcase image upload failed:", error);
      setStatus(error?.message || "Could not upload image.");
    }
  };

  renderDesignShowcaseEditorCards();
  populateDesignShowcaseForm(designShowcaseDefaults);

  designShowcaseNavButton?.addEventListener("click", async () => {
    showCmsView("design-showcase");
    await loadDesignShowcaseEditor();
  });

  designShowcaseEditorForm?.addEventListener("input", (event) => {
    if (event.target.matches("[data-showcase-upload]")) return;

    designShowcaseDirty = true;
    setDesignShowcaseState("Unsaved changes");

    if (event.target.matches('[data-showcase-field="imageSrc"]')) {
      const card = event.target.closest("[data-showcase-key]");
      const preview = card?.querySelector("[data-showcase-image-preview]");
      if (preview) preview.src = resolvePreviewImage(event.target.value);
    }
  });

  designShowcaseEditorForm?.addEventListener("change", async (event) => {
    if (!event.target.matches("[data-showcase-upload]")) return;
    await uploadDesignShowcaseImage(event.target);
  });

  designShowcasePreviewButton?.addEventListener("click", () => {
    setDesignShowcaseMessage("");
    const draft = readDesignShowcaseForm();
    if (!draft) return;
    renderDesignShowcasePreview(draft);
  });

  closeDesignShowcasePreviewButton?.addEventListener("click", () => {
    designShowcaseDraftPreview.hidden = true;
  });

  const saveDesignShowcaseDraft = async () => {
    setDesignShowcaseMessage("");
    const draft = readDesignShowcaseForm();
    if (!draft) return false;

    setDesignShowcaseBusy(true);
    setDesignShowcaseState("Saving…");

    try {
      const { data, error } = await supabaseClient
        .from("cms_content_entries")
        .update({ draft_data: draft })
        .eq("content_key", DESIGN_SHOWCASE_CONTENT_KEY)
        .select("content_key,draft_updated_at")
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setDesignShowcaseState("Setup required");
        setDesignShowcaseMessage("Design Showcase row is missing. Run the Phase 2C seed migration first.");
        return false;
      }

      designShowcaseLastLoadedDraft = structuredClone(draft);
      designShowcaseDirty = false;
      setDesignShowcaseState("Draft saved");
      setDesignShowcaseMessage("Draft saved. Published showcase content has not changed.");
      return true;
    } catch (error) {
      console.error("Design Showcase draft save failed:", error);
      setDesignShowcaseState("Save failed");
      setDesignShowcaseMessage(
        error?.message
          ? `Could not save draft: ${error.message}`
          : "Could not save the Design Showcase draft."
      );
      return false;
    } finally {
      setDesignShowcaseBusy(false);
    }
  };

  designShowcaseSaveButton?.addEventListener("click", saveDesignShowcaseDraft);

  designShowcaseEditorForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveDesignShowcaseDraft();
  });

  designShowcasePublishButton?.addEventListener("click", async () => {
    setDesignShowcaseMessage("");

    if (designShowcaseDirty) {
      setDesignShowcaseState("Unsaved changes");
      setDesignShowcaseMessage("Save the draft first, then publish.");
      return;
    }

    if (!designShowcaseLastLoadedDraft) {
      setDesignShowcaseMessage("Load or save the showcase draft before publishing.");
      return;
    }

    setDesignShowcaseBusy(true);
    setDesignShowcaseState("Publishing…");

    try {
      const { data, error } = await supabaseClient.rpc("cms_publish_content", {
        p_content_key: DESIGN_SHOWCASE_CONTENT_KEY
      });

      if (error) throw error;
      if (!data?.length) throw new Error("Publish returned no Design Showcase row.");

      setDesignShowcaseState("Published · synced");
      setDesignShowcaseMessage("Design Showcase published to the CMS. Localhost reads this version now; production still waits for explicit live deployment.");
    } catch (error) {
      console.error("Design Showcase publish failed:", error);
      setDesignShowcaseState("Publish failed");
      setDesignShowcaseMessage(error?.message || "Could not publish the Design Showcase.");
    } finally {
      setDesignShowcaseBusy(false);
    }
  });

  const checkAdminMembership = async (user) => {
    if (!user?.id) {
      return { allowed: false, reason: "No authenticated user." };
    }

    const { data, error } = await supabaseClient
      .from("admin_users")
      .select("user_id,email")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Admin membership check failed:", error);
      return {
        allowed: false,
        reason: "Admin security is not configured correctly yet."
      };
    }

    return {
      allowed: Boolean(data?.user_id),
      reason: data?.user_id ? "" : "This account is not authorized for the CMS."
    };
  };

  const enterAdmin = (user) => {
    recoveryMode = false;
    emailDisplay.textContent = user.email || "Authenticated admin";
    setMessage(adminMessage, "");
    setSidebarOpen(false);
    showOnly(adminPanel);
    showCmsView("dashboard");
    checkContentStore();
    checkRevisionStore();
    checkPublishAction();
  };

  const enterLogin = (message = "") => {
    recoveryMode = false;
    setSidebarOpen(false);
    setMessage(loginMessage, message);
    showOnly(loginPanel);
  };

  const enterPasswordUpdate = () => {
    recoveryMode = true;
    passwordUpdateForm.reset();
    setMessage(passwordUpdateMessage, "");
    showOnly(passwordUpdatePanel);
    document.querySelector("#newPassword")?.focus();
  };

  const openVerifiedRecovery = async (session) => {
    if (!session?.user) {
      return false;
    }

    const membership = await checkAdminMembership(session.user);

    if (!membership.allowed) {
      await supabaseClient.auth.signOut();
      enterLogin("This recovery account is not authorized for the CMS.");
      return true;
    }

    enterPasswordUpdate();

    if (window.location.hash || window.location.search) {
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
    }

    return true;
  };

  const guardSession = async (session) => {
    if (recoveryMode) return;

    if (!session?.user) {
      enterLogin();
      return;
    }

    const membership = await checkAdminMembership(session.user);

    if (!membership.allowed) {
      await supabaseClient.auth.signOut();
      enterLogin(membership.reason);
      return;
    }

    enterAdmin(session.user);
  };

  forgotPasswordButton.addEventListener("click", () => {
    recoveryRequestForm.reset();
    setMessage(recoveryRequestMessage, "");
    showOnly(recoveryRequestPanel);
    document.querySelector("#recoveryEmail")?.focus();
  });

  backToLoginButton.addEventListener("click", () => {
    enterLogin();
  });

  recoveryRequestForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setMessage(recoveryRequestMessage, "");

    const formData = new FormData(recoveryRequestForm);
    const email = String(formData.get("email") || "").trim();

    if (!email) {
      setMessage(recoveryRequestMessage, "Enter the admin email.");
      return;
    }

    setRecoveryRequestBusy(true);

    try {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: recoveryRedirectUrl.href
      });

      if (error) {
        setMessage(
          recoveryRequestMessage,
          "Could not send the recovery email. Check the redirect URL setup and try again."
        );
        return;
      }

      setMessage(
        recoveryRequestMessage,
        "If this email belongs to an account, a recovery link has been sent."
      );
    } catch (error) {
      console.error("Password recovery request failed:", error);
      setMessage(
        recoveryRequestMessage,
        "Could not reach the authentication service."
      );
    } finally {
      setRecoveryRequestBusy(false);
    }
  });

  passwordUpdateForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setMessage(passwordUpdateMessage, "");

    const formData = new FormData(passwordUpdateForm);
    const newPassword = String(formData.get("newPassword") || "");
    const confirmNewPassword = String(formData.get("confirmNewPassword") || "");

    if (newPassword.length < 10) {
      setMessage(passwordUpdateMessage, "Use at least 10 characters.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setMessage(passwordUpdateMessage, "The two passwords do not match.");
      return;
    }

    setPasswordUpdateBusy(true);

    try {
      const { error } = await supabaseClient.auth.updateUser({
        password: newPassword
      });

      if (error) {
        setMessage(
          passwordUpdateMessage,
          error.message || "Could not update the password."
        );
        return;
      }

      await supabaseClient.auth.signOut();
      enterLogin("Password updated. Sign in with your new password.");
    } catch (error) {
      console.error("Password update failed:", error);
      setMessage(
        passwordUpdateMessage,
        "Could not reach the authentication service."
      );
    } finally {
      setPasswordUpdateBusy(false);
    }
  });

  cancelRecoveryButton.addEventListener("click", async () => {
    try {
      await supabaseClient.auth.signOut();
    } finally {
      enterLogin("Recovery cancelled.");
    }
  });

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setMessage(loginMessage, "");

    const formData = new FormData(loginForm);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    if (!email || !password) {
      setMessage(loginMessage, "Enter both email and password.");
      return;
    }

    setLoginBusy(true);

    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (error || !data.session?.user) {
        setMessage(loginMessage, error?.message || "Sign in failed.");
        return;
      }

      const membership = await checkAdminMembership(data.session.user);

      if (!membership.allowed) {
        await supabaseClient.auth.signOut();
        setMessage(loginMessage, membership.reason);
        return;
      }

      loginForm.reset();
      enterAdmin(data.session.user);
    } catch (error) {
      console.error("Admin sign-in failed:", error);
      setMessage(loginMessage, "Could not reach the authentication service.");
    } finally {
      setLoginBusy(false);
    }
  });

  logoutButton.addEventListener("click", async () => {
    logoutButton.disabled = true;
    setMessage(adminMessage, "Signing out…");

    try {
      await supabaseClient.auth.signOut();
      enterLogin("Signed out securely.");
    } catch (error) {
      console.error("Admin sign-out failed:", error);
      setMessage(adminMessage, "Could not sign out. Please try again.");
    } finally {
      logoutButton.disabled = false;
    }
  });

  const handleAuthEvent = async (event, session) => {
    if (event === "PASSWORD_RECOVERY") {
      recoveryMode = true;
      await openVerifiedRecovery(session);
      return;
    }

    if (event === "SIGNED_OUT") {
      if (!recoveryMode) enterLogin();
      return;
    }

    if (
      event === "SIGNED_IN" &&
      session?.user &&
      adminPanel.hidden &&
      !recoveryMode
    ) {
      await guardSession(session);
    }
  };

  supabaseClient.auth.onAuthStateChange((event, session) => {
    window.setTimeout(() => {
      handleAuthEvent(event, session).catch((error) => {
        console.error("Auth event handling failed:", error);
      });
    }, 0);
  });

  const { data: sessionData, error: sessionError } =
    await supabaseClient.auth.getSession();

  if (sessionError) {
    console.error("Session check failed:", sessionError);
    enterLogin("Could not verify the current session.");
  } else if (initialRecoveryIntent) {
    recoveryMode = true;

    const opened = await openVerifiedRecovery(sessionData.session);

    if (!opened) {
      window.setTimeout(async () => {
        const { data, error } = await supabaseClient.auth.getSession();

        if (error) {
          console.error("Delayed recovery session check failed:", error);
          enterLogin("Recovery session could not be verified.");
          return;
        }

        const recovered = await openVerifiedRecovery(data.session);

        if (!recovered) {
          recoveryMode = false;
          enterLogin(
            "Recovery link could not establish a session. Request a fresh recovery email and open the newest link."
          );
        }
      }, 500);
    }
  } else if (!recoveryMode) {
    await guardSession(sessionData.session);
  }
}
