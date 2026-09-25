import { ADMIN_CONFIG } from "./config.js";
import { initMediaWorkflow } from "./media-workflow.js";
import { initProjectManager } from "./project-manager.js";

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
const creativeServicesNavButton = document.querySelector("#creativeServicesNavButton");
const digitalProjectsNavButton = document.querySelector("#digitalProjectsNavButton");
const aboutMeNavButton = document.querySelector("#aboutMeNavButton");
const skillsToolsNavButton = document.querySelector("#skillsToolsNavButton");
const experienceCommunityNavButton = document.querySelector("#experienceCommunityNavButton");
const contactCmsNavButton = document.querySelector("#contactCmsNavButton");
const footerCmsNavButton = document.querySelector("#footerCmsNavButton");
const sectionLayoutNavButton = document.querySelector("#sectionLayoutNavButton");
const projectsNavButton = document.querySelector("#projectsNavButton");
const mediaWorkflowNavButton = document.querySelector("#mediaWorkflowNavButton");
const projectManagerNavButton = document.querySelector("#projectManagerNavButton");
const dashboard = document.querySelector("#dashboard");
const homepageEditor = document.querySelector("#homepageEditor");
const realProjectsEditor = document.querySelector("#realProjectsEditor");
const designShowcaseEditor = document.querySelector("#designShowcaseEditor");
const creativeServicesEditor = document.querySelector("#creativeServicesEditor");
const digitalProjectsEditor = document.querySelector("#digitalProjectsEditor");
const aboutMeEditor = document.querySelector("#aboutMeEditor");
const skillsToolsEditor = document.querySelector("#skillsToolsEditor");
const experienceCommunityEditor = document.querySelector("#experienceCommunityEditor");
const contactCmsEditor = document.querySelector("#contactCmsEditor");
const footerCmsEditor = document.querySelector("#footerCmsEditor");
const sectionLayoutEditor = document.querySelector("#sectionLayoutEditor");
const portfolioFoundationEditor = document.querySelector("#portfolioFoundationEditor");
const mediaWorkflowEditor = document.querySelector("#mediaWorkflowEditor");
const projectManagerEditor = document.querySelector("#projectManagerEditor");
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

const creativeServicesEditorForm = document.querySelector("#creativeServicesEditorForm");
const creativeServicesEditorList = document.querySelector("#creativeServicesEditorList");
const creativeServicesEditorState = document.querySelector("#creativeServicesEditorState");
const creativeServicesEditorMessage = document.querySelector("#creativeServicesEditorMessage");
const creativeServicesPreviewButton = document.querySelector("#creativeServicesPreviewButton");
const creativeServicesSaveButton = document.querySelector("#creativeServicesSaveButton");
const creativeServicesPublishButton = document.querySelector("#creativeServicesPublishButton");
const creativeServicesDraftPreview = document.querySelector("#creativeServicesDraftPreview");
const closeCreativeServicesPreviewButton = document.querySelector("#closeCreativeServicesPreviewButton");
const creativeServicesPreviewGrid = document.querySelector("#creativeServicesPreviewGrid");

const digitalProjectsEditorForm = document.querySelector("#digitalProjectsEditorForm");
const digitalProjectsEditorList = document.querySelector("#digitalProjectsEditorList");
const digitalProjectsEditorState = document.querySelector("#digitalProjectsEditorState");
const digitalProjectsEditorMessage = document.querySelector("#digitalProjectsEditorMessage");
const digitalProjectsPreviewButton = document.querySelector("#digitalProjectsPreviewButton");
const digitalProjectsSaveButton = document.querySelector("#digitalProjectsSaveButton");
const digitalProjectsPublishButton = document.querySelector("#digitalProjectsPublishButton");
const digitalProjectsDraftPreview = document.querySelector("#digitalProjectsDraftPreview");
const closeDigitalProjectsPreviewButton = document.querySelector("#closeDigitalProjectsPreviewButton");
const digitalProjectsPreviewGrid = document.querySelector("#digitalProjectsPreviewGrid");

const aboutMeEditorForm = document.querySelector("#aboutMeEditorForm");
const aboutMeEditorState = document.querySelector("#aboutMeEditorState");
const aboutMeEditorMessage = document.querySelector("#aboutMeEditorMessage");
const aboutMePreviewButton = document.querySelector("#aboutMePreviewButton");
const aboutMeSaveButton = document.querySelector("#aboutMeSaveButton");
const aboutMePublishButton = document.querySelector("#aboutMePublishButton");
const aboutMeDraftPreview = document.querySelector("#aboutMeDraftPreview");
const closeAboutMePreviewButton = document.querySelector("#closeAboutMePreviewButton");

const skillsToolsEditorForm = document.querySelector("#skillsToolsEditorForm");
const skillsToolsCapabilityList = document.querySelector("#skillsToolsCapabilityList");
const skillsToolsToolList = document.querySelector("#skillsToolsToolList");
const skillsToolsEditorState = document.querySelector("#skillsToolsEditorState");
const skillsToolsEditorMessage = document.querySelector("#skillsToolsEditorMessage");
const skillsToolsPreviewButton = document.querySelector("#skillsToolsPreviewButton");
const skillsToolsSaveButton = document.querySelector("#skillsToolsSaveButton");
const skillsToolsPublishButton = document.querySelector("#skillsToolsPublishButton");
const skillsToolsDraftPreview = document.querySelector("#skillsToolsDraftPreview");
const closeSkillsToolsPreviewButton = document.querySelector("#closeSkillsToolsPreviewButton");
const skillsToolsCapabilityPreviewGrid = document.querySelector("#skillsToolsCapabilityPreviewGrid");
const skillsToolsToolPreviewGrid = document.querySelector("#skillsToolsToolPreviewGrid");

const experienceCommunityEditorForm = document.querySelector("#experienceCommunityEditorForm");
const experienceCommunityEditorList = document.querySelector("#experienceCommunityEditorList");
const experienceCommunityEditorState = document.querySelector("#experienceCommunityEditorState");
const experienceCommunityEditorMessage = document.querySelector("#experienceCommunityEditorMessage");
const experienceCommunityPreviewButton = document.querySelector("#experienceCommunityPreviewButton");
const experienceCommunitySaveButton = document.querySelector("#experienceCommunitySaveButton");
const experienceCommunityPublishButton = document.querySelector("#experienceCommunityPublishButton");
const experienceCommunityDraftPreview = document.querySelector("#experienceCommunityDraftPreview");
const closeExperienceCommunityPreviewButton = document.querySelector("#closeExperienceCommunityPreviewButton");
const experienceCommunityPreviewGrid = document.querySelector("#experienceCommunityPreviewGrid");

const contactCmsEditorForm = document.querySelector("#contactCmsEditorForm");
const contactCmsEditorState = document.querySelector("#contactCmsEditorState");
const contactCmsEditorMessage = document.querySelector("#contactCmsEditorMessage");
const contactCmsPreviewButton = document.querySelector("#contactCmsPreviewButton");
const contactCmsSaveButton = document.querySelector("#contactCmsSaveButton");
const contactCmsPublishButton = document.querySelector("#contactCmsPublishButton");
const contactCmsDraftPreview = document.querySelector("#contactCmsDraftPreview");
const closeContactCmsPreviewButton = document.querySelector("#closeContactCmsPreviewButton");

const footerCmsEditorForm = document.querySelector("#footerCmsEditorForm");
const footerNavEditorList = document.querySelector("#footerNavEditorList");
const footerProfileEditorList = document.querySelector("#footerProfileEditorList");
const footerBottomEditorList = document.querySelector("#footerBottomEditorList");
const footerCmsEditorState = document.querySelector("#footerCmsEditorState");
const footerCmsEditorMessage = document.querySelector("#footerCmsEditorMessage");
const footerCmsPreviewButton = document.querySelector("#footerCmsPreviewButton");
const footerCmsSaveButton = document.querySelector("#footerCmsSaveButton");
const footerCmsPublishButton = document.querySelector("#footerCmsPublishButton");
const footerCmsDraftPreview = document.querySelector("#footerCmsDraftPreview");
const closeFooterCmsPreviewButton = document.querySelector("#closeFooterCmsPreviewButton");

const sectionLayoutEditorForm = document.querySelector("#sectionLayoutEditorForm");
const sectionLayoutList = document.querySelector("#sectionLayoutList");
const sectionLayoutEditorState = document.querySelector("#sectionLayoutEditorState");
const sectionLayoutEditorMessage = document.querySelector("#sectionLayoutEditorMessage");
const sectionLayoutPreviewButton = document.querySelector("#sectionLayoutPreviewButton");
const sectionLayoutSaveButton = document.querySelector("#sectionLayoutSaveButton");
const sectionLayoutPublishButton = document.querySelector("#sectionLayoutPublishButton");
const sectionLayoutResetButton = document.querySelector("#sectionLayoutResetButton");
const sectionLayoutDraftPreview = document.querySelector("#sectionLayoutDraftPreview");
const sectionLayoutPreviewList = document.querySelector("#sectionLayoutPreviewList");
const closeSectionLayoutPreviewButton = document.querySelector("#closeSectionLayoutPreviewButton");

const portfolioFoundationState = document.querySelector("#portfolioFoundationState");
const portfolioFoundationMessage = document.querySelector("#portfolioFoundationMessage");
const portfolioFoundationRefreshButton = document.querySelector("#portfolioFoundationRefreshButton");
const portfolioCategoriesDot = document.querySelector("#portfolioCategoriesDot");
const portfolioCategoriesStatus = document.querySelector("#portfolioCategoriesStatus");
const portfolioCategoriesCount = document.querySelector("#portfolioCategoriesCount");
const portfolioProjectsDot = document.querySelector("#portfolioProjectsDot");
const portfolioProjectsStatus = document.querySelector("#portfolioProjectsStatus");
const portfolioProjectsCount = document.querySelector("#portfolioProjectsCount");

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
    const isCreativeServices = view === "creative-services";
    const isDigitalProjects = view === "digital-projects";
    const isAboutMe = view === "about-me";
    const isSkillsTools = view === "skills-tools";
    const isExperienceCommunity = view === "experience-community";
    const isContact = view === "contact";
    const isFooter = view === "footer";
    const isSectionLayout = view === "section-layout";
    const isPortfolioFoundation = view === "portfolio-foundation";
    const isMediaWorkflow = view === "media-workflow";
    const isProjectManager = view === "project-manager";

    dashboard.hidden = !isDashboard;
    homepageEditor.hidden = !isHero;
    realProjectsEditor.hidden = !isRealProjects;
    designShowcaseEditor.hidden = !isDesignShowcase;
    creativeServicesEditor.hidden = !isCreativeServices;
    digitalProjectsEditor.hidden = !isDigitalProjects;
    aboutMeEditor.hidden = !isAboutMe;
    skillsToolsEditor.hidden = !isSkillsTools;
    experienceCommunityEditor.hidden = !isExperienceCommunity;
    contactCmsEditor.hidden = !isContact;
    footerCmsEditor.hidden = !isFooter;
    sectionLayoutEditor.hidden = !isSectionLayout;
    portfolioFoundationEditor.hidden = !isPortfolioFoundation;
    mediaWorkflowEditor.hidden = !isMediaWorkflow;
    projectManagerEditor.hidden = !isProjectManager;

    dashboardNavLink?.classList.toggle("active", isDashboard);
    homepageNavButton?.classList.toggle("active", isHero);
    realProjectsNavButton?.classList.toggle("active", isRealProjects);
    designShowcaseNavButton?.classList.toggle("active", isDesignShowcase);
    creativeServicesNavButton?.classList.toggle("active", isCreativeServices);
    digitalProjectsNavButton?.classList.toggle("active", isDigitalProjects);
    aboutMeNavButton?.classList.toggle("active", isAboutMe);
    skillsToolsNavButton?.classList.toggle("active", isSkillsTools);
    experienceCommunityNavButton?.classList.toggle("active", isExperienceCommunity);
    contactCmsNavButton?.classList.toggle("active", isContact);
    footerCmsNavButton?.classList.toggle("active", isFooter);
    sectionLayoutNavButton?.classList.toggle("active", isSectionLayout);
    projectsNavButton?.classList.toggle("active", isPortfolioFoundation);
    mediaWorkflowNavButton?.classList.toggle("active", isMediaWorkflow);
    projectManagerNavButton?.classList.toggle("active", isProjectManager);

    [dashboardNavLink, homepageNavButton, realProjectsNavButton, designShowcaseNavButton, creativeServicesNavButton, digitalProjectsNavButton, aboutMeNavButton, skillsToolsNavButton, experienceCommunityNavButton, contactCmsNavButton, footerCmsNavButton, sectionLayoutNavButton, projectsNavButton, mediaWorkflowNavButton, projectManagerNavButton].forEach((item) => {
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
    } else if (isCreativeServices) {
      creativeServicesNavButton?.setAttribute("aria-current", "page");
      cmsPageEyebrow.textContent = "HOMEPAGE CMS";
      cmsPageTitle.textContent = "Creative Services";
    } else if (isDigitalProjects) {
      digitalProjectsNavButton?.setAttribute("aria-current", "page");
      cmsPageEyebrow.textContent = "HOMEPAGE CMS";
      cmsPageTitle.textContent = "AI & Digital Projects";
    } else if (isAboutMe) {
      aboutMeNavButton?.setAttribute("aria-current", "page");
      cmsPageEyebrow.textContent = "HOMEPAGE CMS";
      cmsPageTitle.textContent = "About Me";
    } else if (isSkillsTools) {
      skillsToolsNavButton?.setAttribute("aria-current", "page");
      cmsPageEyebrow.textContent = "HOMEPAGE CMS";
      cmsPageTitle.textContent = "Skills & Tools";
    } else if (isExperienceCommunity) {
      experienceCommunityNavButton?.setAttribute("aria-current", "page");
      cmsPageEyebrow.textContent = "HOMEPAGE CMS";
      cmsPageTitle.textContent = "Experience / Community";
    } else if (isContact) {
      contactCmsNavButton?.setAttribute("aria-current", "page");
      cmsPageEyebrow.textContent = "HOMEPAGE CMS";
      cmsPageTitle.textContent = "Contact";
    } else if (isFooter) {
      footerCmsNavButton?.setAttribute("aria-current", "page");
      cmsPageEyebrow.textContent = "HOMEPAGE CMS";
      cmsPageTitle.textContent = "Footer";
    } else if (isSectionLayout) {
      sectionLayoutNavButton?.setAttribute("aria-current", "page");
      cmsPageEyebrow.textContent = "HOMEPAGE CMS";
      cmsPageTitle.textContent = "Section Order";
    } else if (isPortfolioFoundation) {
      projectsNavButton?.setAttribute("aria-current", "page");
      cmsPageEyebrow.textContent = "PORTFOLIO ENGINE";
      cmsPageTitle.textContent = "Projects Foundation";
    } else if (isMediaWorkflow) {
      mediaWorkflowNavButton?.setAttribute("aria-current", "page");
      cmsPageEyebrow.textContent = "PORTFOLIO ENGINE";
      cmsPageTitle.textContent = "Media";
    } else if (isProjectManager) {
      projectManagerNavButton?.setAttribute("aria-current", "page");
      cmsPageEyebrow.textContent = "PORTFOLIO ENGINE";
      cmsPageTitle.textContent = "Project Drafts";
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
        .upsert(
          {
            content_key: DESIGN_SHOWCASE_CONTENT_KEY,
            draft_data: draft
          },
          {
            onConflict: "content_key"
          }
        )
        .select("content_key,draft_updated_at")
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setDesignShowcaseState("Save failed");
        setDesignShowcaseMessage("Could not create or update the Design Showcase draft.");
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

  const CREATIVE_SERVICES_CONTENT_KEY = "homepage.creative-services";

  const creativeServicesDefaults = Object.freeze({
    eyebrow: "What I can help with",
    titleMain: "CREATIVE",
    titleAccent: "SERVICES",
    services: [
      {
        key: "brand",
        number: "01",
        cardTitle: "Brand Identity",
        cardDescription: "Logo systems, visual direction and consistent brand assets.",
        modalEyebrow: "Service workflow",
        modalTitle: "Brand Identity",
        modalSummary: "I build a practical visual identity system that can stay consistent across social media, print and everyday brand use.",
        workflow: [
          "Discovery and brief: understand the business, audience, goals, personality and where the identity will be used.",
          "Research and direction: review competitors, references and visual opportunities before choosing a clear creative direction.",
          "Concept development: create logo and identity concepts with typography, color and supporting visual elements.",
          "Refinement: improve the selected direction through feedback, spacing, balance, color and real-use testing.",
          "Brand system rollout: prepare the main logo, alternate marks and practical brand assets for common use cases.",
          "Final handoff: organize master files, exports and a clear usage reference so the identity is easy to use consistently."
        ],
        deliverables: ["Primary and alternate logo files","Color and typography system","Brand marks / supporting assets","Social/profile assets as scoped","Basic brand usage reference"],
        tools: ["Adobe Illustrator","Adobe Photoshop","Mockups and presentation boards"],
        needs: ["Business/brand name and goals","Target audience","Competitors or references","Required applications","Deadline and key constraints"],
        handoff: "Organized source and export files such as AI, SVG, PDF, PNG and JPG, plus color/font references based on the agreed scope."
      },
      {
        key: "social",
        number: "02",
        cardTitle: "Social & Marketing Design",
        cardDescription: "Campaign posts, ads and promotional social media visuals.",
        modalEyebrow: "Service workflow",
        modalTitle: "Social & Marketing Design",
        modalSummary: "I turn a campaign, offer or content idea into a consistent set of platform-ready promotional visuals.",
        workflow: [
          "Campaign brief: define the goal, offer, audience, platform and required formats.",
          "Content and asset check: collect copy, product photos, logos, brand rules and any required call-to-action.",
          "Visual direction: establish hierarchy, layout, typography and a repeatable campaign look.",
          "Design production: create the main design first, then build required post, story, ad or banner variations.",
          "Review and revisions: refine messaging, visual balance and consistency based on feedback.",
          "Export and delivery: prepare correctly sized files for each platform and organize the final campaign set."
        ],
        deliverables: ["Social media posts","Story / vertical formats","Ad and campaign visuals","Promotional banners","Editable template files when scoped"],
        tools: ["Adobe Photoshop","Adobe Illustrator","Platform size and export standards"],
        needs: ["Final or draft copy","Brand/logo assets","Product or campaign images","Target platform and sizes","Offer, CTA and deadline"],
        handoff: "Platform-ready JPG/PNG files, plus editable source files when included in the project scope."
      },
      {
        key: "sports",
        number: "03",
        cardTitle: "Sports & Jersey Design",
        cardDescription: "Team identity, match graphics and apparel concepts.",
        modalEyebrow: "Service workflow",
        modalTitle: "Sports & Jersey Design",
        modalSummary: "I create team-focused visual systems that connect identity, jerseys and tournament or match-day graphics.",
        workflow: [
          "Team brief: collect team identity, colors, tournament context, sponsors and practical requirements.",
          "Visual direction: define a strong sports look that works across kit, social graphics and event communication.",
          "Jersey or graphic concepts: develop front/back layouts, typography, numbers, sponsor placement and supporting visuals.",
          "Mockup and review: show the design in realistic context and refine details with the team.",
          "Production preparation: clean dimensions, placements and export formats for printing or digital use.",
          "Final rollout: deliver the approved assets and any supporting match, tournament or team graphics included in scope."
        ],
        deliverables: ["Jersey concepts and mockups","Team identity graphics","Match / tournament visuals","Sponsor and number placement","Print-ready artwork when required"],
        tools: ["Adobe Illustrator","Adobe Photoshop","Sportswear mockups and print templates"],
        needs: ["Team logo and colors","Sponsor logos","Player/number requirements","Printer/manufacturer template if available","Tournament or campaign needs"],
        handoff: "Approved digital artwork and production-ready files based on the printer or manufacturer requirements provided."
      },
      {
        key: "video",
        number: "04",
        cardTitle: "Video & Motion Content",
        cardDescription: "Short-form edits, reels and promotional motion content.",
        modalEyebrow: "Service workflow",
        modalTitle: "Video & Motion Content",
        modalSummary: "I edit short-form promotional content with clear pacing, brand consistency and platform-focused delivery.",
        workflow: [
          "Brief and format: confirm objective, platform, duration, style and final aspect ratio.",
          "Asset review: organize footage, images, logo, script, captions and other supplied material.",
          "Rough cut: build the core sequence, pacing and story structure before detailed polish.",
          "Motion and brand layer: add titles, transitions, graphic elements and brand styling where needed.",
          "Review and refinement: adjust timing, text, sequence and visual details from feedback.",
          "Final export: deliver optimized versions for the requested social or digital platforms."
        ],
        deliverables: ["Reels / short-form edits","Promotional videos","Branded text and motion graphics","Platform-specific versions","Thumbnail or cover support when scoped"],
        tools: ["Adobe Premiere Pro","CapCut","Photoshop / Illustrator for supporting graphics"],
        needs: ["Footage and source assets","Target platform","Desired duration","Script/copy if available","Brand assets and deadline"],
        handoff: "Final MP4 exports in the agreed sizes and resolutions, with project/source files included only when part of the agreed scope."
      },
      {
        key: "marketing",
        number: "05",
        cardTitle: "Digital Marketing Support",
        cardDescription: "Campaign support, social sales flow and customer handling.",
        modalEyebrow: "Service workflow",
        modalTitle: "Digital Marketing Support",
        modalSummary: "I connect campaign visuals with a practical content and customer-response flow so marketing is easier to run consistently.",
        workflow: [
          "Goal and offer review: define what the campaign needs to achieve and what action the audience should take.",
          "Audience and channel planning: choose the platform, message angle and content types that fit the campaign.",
          "Creative plan: map the required posts, ads, offers and supporting visuals.",
          "Campaign support: prepare content assets and help structure the launch or boosting workflow as scoped.",
          "Customer response flow: organize common replies, confirmation messages and follow-up steps where useful.",
          "Review and improve: look at available campaign results and identify practical changes for the next round."
        ],
        deliverables: ["Campaign creative plan","Social content and ad variations","Offer / CTA structure","Customer response templates","Basic campaign review support"],
        tools: ["Design tools","Social platform publishing / campaign tools as available","Simple tracking and reporting sheets"],
        needs: ["Business goal and offer","Target customer","Budget or campaign limits when relevant","Existing page/account assets","Available performance data"],
        handoff: "A clear set of campaign assets, content directions and operating notes based on the agreed level of marketing support."
      },
      {
        key: "workflow",
        number: "06",
        cardTitle: "Business Workflow Design",
        cardDescription: "Clear digital flows for inventory, orders and reporting.",
        modalEyebrow: "Service workflow",
        modalTitle: "Business Workflow Design",
        modalSummary: "I map repeated business tasks into a clearer digital workflow so products, orders, delivery and reporting are easier to manage.",
        workflow: [
          "Process discovery: understand how the business currently handles products, customers, orders, payments and reporting.",
          "Workflow mapping: define the stages, responsibilities, statuses and information that need to move between them.",
          "Module and data design: structure areas such as sourcing, inventory, pricing, sales, courier, expenses and reports.",
          "Interface / system planning: turn the workflow into practical screens, forms, tables and actions.",
          "Testing with real scenarios: check the flow using realistic orders, stock changes and business exceptions.",
          "Refinement and handoff: simplify confusing steps, document the final flow and prepare the agreed implementation or prototype."
        ],
        deliverables: ["Process and module map","Data / status structure","Forms, tables and dashboard flow","Operational templates","Prototype or implementation scope as agreed"],
        tools: ["Workflow mapping","Spreadsheets / structured data","Web and database tools as required by the project"],
        needs: ["Current business process","Existing records or sample data","Roles and responsibilities","Problems to solve first","Required reports and outputs"],
        handoff: "A documented operating flow with the agreed templates, prototype or system structure, organized so future features can be added without rebuilding the process from zero."
      }
    ]
  });

  let creativeServicesDirty = false;
  let creativeServicesLastLoadedDraft = null;

  const cloneCreativeServicesDefaults = () => structuredClone(creativeServicesDefaults);

  const listToText = (items) => (Array.isArray(items) ? items.join("\n") : "");
  const textToList = (value) =>
    String(value || "")
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);

  const setCreativeServicesMessage = (message = "") => {
    if (creativeServicesEditorMessage) creativeServicesEditorMessage.textContent = message;
  };

  const setCreativeServicesState = (label) => {
    if (creativeServicesEditorState) creativeServicesEditorState.textContent = label;
  };

  const setCreativeServicesBusy = (busy) => {
    [creativeServicesPreviewButton, creativeServicesSaveButton, creativeServicesPublishButton].forEach((button) => {
      if (button) button.disabled = busy;
    });
  };

  const creativeServiceEditorCard = (service, index) => `
    <article class="project-editor-card service-editor-card" data-service-key="${service.key}">
      <header>
        <div>
          <small>SERVICE ${service.number}</small>
          <h4>${service.cardTitle}</h4>
        </div>
        <b>WORKFLOW POPUP</b>
      </header>

      <div class="editor-grid two">
        <label>
          <span>Card title</span>
          <input data-service-field="cardTitle" type="text" maxlength="100" required>
        </label>
        <label>
          <span>Card description</span>
          <input data-service-field="cardDescription" type="text" maxlength="180" required>
        </label>
      </div>

      <div class="showcase-modal-fields">
        <p class="eyebrow">POPUP CONTENT</p>
        <div class="editor-grid two">
          <label>
            <span>Popup eyebrow</span>
            <input data-service-field="modalEyebrow" type="text" maxlength="90" required>
          </label>
          <label>
            <span>Popup title</span>
            <input data-service-field="modalTitle" type="text" maxlength="120" required>
          </label>
          <label class="editor-grid-span">
            <span>Popup summary</span>
            <textarea data-service-field="modalSummary" rows="3" maxlength="500" required></textarea>
          </label>
          <label class="editor-grid-span">
            <span>How I work — one step per line</span>
            <textarea data-service-field="workflowText" rows="7" maxlength="2400" required></textarea>
          </label>
          <label>
            <span>Deliverables — one item per line</span>
            <textarea data-service-field="deliverablesText" rows="6" maxlength="1400" required></textarea>
          </label>
          <label>
            <span>Tools & process — one item per line</span>
            <textarea data-service-field="toolsText" rows="6" maxlength="1200" required></textarea>
          </label>
          <label class="editor-grid-span">
            <span>What I need from you — one item per line</span>
            <textarea data-service-field="needsText" rows="6" maxlength="1400" required></textarea>
          </label>
          <label class="editor-grid-span">
            <span>Final handoff</span>
            <textarea data-service-field="handoff" rows="3" maxlength="600" required></textarea>
          </label>
        </div>
      </div>
    </article>
  `;

  const renderCreativeServicesEditorCards = () => {
    creativeServicesEditorList.innerHTML = creativeServicesDefaults.services
      .map(creativeServiceEditorCard)
      .join("");
  };

  const creativeServiceCardElement = (key) =>
    creativeServicesEditorList?.querySelector(`[data-service-key="${key}"]`);

  const fillCreativeServiceCard = (service) => {
    const card = creativeServiceCardElement(service.key);
    if (!card) return;

    const simpleFields = ["cardTitle", "cardDescription", "modalEyebrow", "modalTitle", "modalSummary", "handoff"];
    simpleFields.forEach((field) => {
      const input = card.querySelector(`[data-service-field="${field}"]`);
      if (input) input.value = service[field] ?? "";
    });

    const listFields = {
      workflowText: service.workflow,
      deliverablesText: service.deliverables,
      toolsText: service.tools,
      needsText: service.needs
    };

    Object.entries(listFields).forEach(([field, items]) => {
      const input = card.querySelector(`[data-service-field="${field}"]`);
      if (input) input.value = listToText(items);
    });
  };

  const populateCreativeServicesForm = (data = {}) => {
    const defaults = cloneCreativeServicesDefaults();
    const incomingServices = Array.isArray(data.services) ? data.services : [];

    const merged = {
      ...defaults,
      ...data,
      services: defaults.services.map((service) => {
        const incoming = incomingServices.find((candidate) => candidate?.key === service.key) || {};
        return { ...service, ...incoming, key: service.key, number: service.number };
      })
    };

    creativeServicesEditorForm.elements.namedItem("eyebrow").value = merged.eyebrow;
    creativeServicesEditorForm.elements.namedItem("titleMain").value = merged.titleMain;
    creativeServicesEditorForm.elements.namedItem("titleAccent").value = merged.titleAccent;
    merged.services.forEach(fillCreativeServiceCard);

    creativeServicesLastLoadedDraft = structuredClone(merged);
    creativeServicesDirty = false;
    setCreativeServicesState("Draft loaded");
  };

  const readCreativeServicesForm = () => {
    if (!creativeServicesEditorForm) return null;

    const missingRequired = [...creativeServicesEditorForm.querySelectorAll("[required]")].find(
      (field) => !String(field.value || "").trim()
    );

    if (missingRequired) {
      const serviceCard = missingRequired.closest("[data-service-key]");
      const serviceTitle =
        serviceCard?.querySelector('[data-service-field="cardTitle"]')?.value?.trim() ||
        serviceCard?.dataset.serviceKey ||
        "section heading";
      const fieldLabel =
        missingRequired.closest("label")?.querySelector("span")?.textContent?.trim() ||
        "required field";

      setCreativeServicesMessage(`Complete "${fieldLabel}" for ${serviceTitle} before saving.`);
      missingRequired.focus();
      missingRequired.scrollIntoView({ behavior: "smooth", block: "center" });
      return null;
    }

    const services = creativeServicesDefaults.services.map((service) => {
      const card = creativeServiceCardElement(service.key);
      const get = (field) =>
        String(card?.querySelector(`[data-service-field="${field}"]`)?.value || "").trim();

      return {
        key: service.key,
        number: service.number,
        cardTitle: get("cardTitle"),
        cardDescription: get("cardDescription"),
        modalEyebrow: get("modalEyebrow"),
        modalTitle: get("modalTitle"),
        modalSummary: get("modalSummary"),
        workflow: textToList(get("workflowText")),
        deliverables: textToList(get("deliverablesText")),
        tools: textToList(get("toolsText")),
        needs: textToList(get("needsText")),
        handoff: get("handoff")
      };
    });

    return {
      eyebrow: String(creativeServicesEditorForm.elements.namedItem("eyebrow").value || "").trim(),
      titleMain: String(creativeServicesEditorForm.elements.namedItem("titleMain").value || "").trim(),
      titleAccent: String(creativeServicesEditorForm.elements.namedItem("titleAccent").value || "").trim(),
      services
    };
  };

  const renderCreativeServicesPreview = (data) => {
    document.querySelector("#previewCreativeServicesEyebrow").textContent = data.eyebrow;
    document.querySelector("#previewCreativeServicesTitleMain").textContent = data.titleMain;
    document.querySelector("#previewCreativeServicesTitleAccent").textContent = data.titleAccent;
    creativeServicesPreviewGrid.innerHTML = "";

    data.services.forEach((service) => {
      const card = document.createElement("article");
      card.className = "creative-services-preview-card";

      const number = document.createElement("span");
      number.textContent = service.number;
      const title = document.createElement("strong");
      title.textContent = service.cardTitle;
      const description = document.createElement("p");
      description.textContent = service.cardDescription;
      const detail = document.createElement("small");
      detail.textContent = `${service.workflow.length} workflow steps · ${service.deliverables.length} deliverables`;

      card.append(number, title, description, detail);
      creativeServicesPreviewGrid.appendChild(card);
    });

    creativeServicesDraftPreview.hidden = false;
    creativeServicesDraftPreview.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const loadCreativeServicesEditor = async () => {
    setCreativeServicesMessage("Loading Creative Services draft…");
    setCreativeServicesState("Loading…");

    const { data, error } = await supabaseClient
      .from("cms_content_entries")
      .select("content_key,draft_data,published_data,draft_updated_at,published_at")
      .eq("content_key", CREATIVE_SERVICES_CONTENT_KEY)
      .maybeSingle();

    if (error) {
      console.error("Creative Services CMS load failed:", error);
      populateCreativeServicesForm(creativeServicesDefaults);
      setCreativeServicesState("Load failed");
      setCreativeServicesMessage("Could not load the Creative Services content store.");
      return false;
    }

    if (!data) {
      populateCreativeServicesForm(creativeServicesDefaults);
      setCreativeServicesState("Setup required");
      setCreativeServicesMessage("Run the Phase 2D seed migration or Save Draft to create the row.");
      return false;
    }

    populateCreativeServicesForm(data.draft_data || creativeServicesDefaults);

    const synced =
      JSON.stringify(data.draft_data || {}) === JSON.stringify(data.published_data || {});

    setCreativeServicesState(synced ? "Published · synced" : "Draft differs from live");
    setCreativeServicesMessage(
      data.published_at
        ? "Services draft loaded. Preview or edit before publishing."
        : "Services draft loaded. This content has not been published yet."
    );

    return true;
  };

  renderCreativeServicesEditorCards();
  populateCreativeServicesForm(creativeServicesDefaults);

  creativeServicesNavButton?.addEventListener("click", async () => {
    showCmsView("creative-services");
    await loadCreativeServicesEditor();
  });

  creativeServicesEditorForm?.addEventListener("input", () => {
    creativeServicesDirty = true;
    setCreativeServicesState("Unsaved changes");
  });

  creativeServicesPreviewButton?.addEventListener("click", () => {
    setCreativeServicesMessage("");
    const draft = readCreativeServicesForm();
    if (!draft) return;
    renderCreativeServicesPreview(draft);
  });

  closeCreativeServicesPreviewButton?.addEventListener("click", () => {
    creativeServicesDraftPreview.hidden = true;
  });

  const saveCreativeServicesDraft = async () => {
    setCreativeServicesMessage("");
    const draft = readCreativeServicesForm();
    if (!draft) return false;

    setCreativeServicesBusy(true);
    setCreativeServicesState("Saving…");

    try {
      const { data, error } = await supabaseClient
        .from("cms_content_entries")
        .upsert(
          {
            content_key: CREATIVE_SERVICES_CONTENT_KEY,
            draft_data: draft
          },
          {
            onConflict: "content_key"
          }
        )
        .select("content_key,draft_updated_at")
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setCreativeServicesState("Save failed");
        setCreativeServicesMessage("Could not create or update the Creative Services draft.");
        return false;
      }

      creativeServicesLastLoadedDraft = structuredClone(draft);
      creativeServicesDirty = false;
      setCreativeServicesState("Draft saved");
      setCreativeServicesMessage("Draft saved. Published service content has not changed.");
      return true;
    } catch (error) {
      console.error("Creative Services draft save failed:", error);
      setCreativeServicesState("Save failed");
      setCreativeServicesMessage(
        error?.message
          ? `Could not save draft: ${error.message}`
          : "Could not save the Creative Services draft."
      );
      return false;
    } finally {
      setCreativeServicesBusy(false);
    }
  };

  creativeServicesSaveButton?.addEventListener("click", saveCreativeServicesDraft);

  creativeServicesEditorForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveCreativeServicesDraft();
  });

  creativeServicesPublishButton?.addEventListener("click", async () => {
    setCreativeServicesMessage("");

    if (creativeServicesDirty) {
      setCreativeServicesState("Unsaved changes");
      setCreativeServicesMessage("Save the draft first, then publish.");
      return;
    }

    if (!creativeServicesLastLoadedDraft) {
      setCreativeServicesMessage("Load or save the services draft before publishing.");
      return;
    }

    setCreativeServicesBusy(true);
    setCreativeServicesState("Publishing…");

    try {
      const { data, error } = await supabaseClient.rpc("cms_publish_content", {
        p_content_key: CREATIVE_SERVICES_CONTENT_KEY
      });

      if (error) throw error;
      if (!data?.length) throw new Error("Publish returned no Creative Services row.");

      setCreativeServicesState("Published · synced");
      setCreativeServicesMessage("Creative Services published to the CMS. Localhost reads this version now; production still waits for explicit live deployment.");
    } catch (error) {
      console.error("Creative Services publish failed:", error);
      setCreativeServicesState("Publish failed");
      setCreativeServicesMessage(error?.message || "Could not publish Creative Services.");
    } finally {
      setCreativeServicesBusy(false);
    }
  });

  const DIGITAL_PROJECTS_CONTENT_KEY = "homepage.ai-digital-projects";

  const digitalProjectsDefaults = Object.freeze({
    eyebrow: "Beyond graphics",
    titleMain: "AI &",
    titleAccent: "DIGITAL PROJECTS",
    projects: [
      {
        key: "erp",
        type: "main",
        marker: "ERP / WORKFLOW",
        cardTitle: "From a product idea to an operating system.",
        cardDescription: "Sourcing, inventory, pricing, customer orders, courier status, expenses and reporting inside one connected workflow.",
        actionLabel: "View workflow ↗",
        chips: ["Inventory","Orders","Courier","Expenses","Reports"],
        modalEyebrow: "Digital project workflow",
        modalTitle: "ERP & Business Workflow",
        modalSummary: "I structure a business system around the real flow of products, stock, orders, delivery, expenses and reporting instead of treating each task as a separate sheet or tool.",
        workflow: [
          "Process discovery: map how sourcing, inventory, pricing, customer orders, delivery and finance currently move through the business.",
          "Module planning: separate the system into practical areas such as products, lots, inventory, sales, courier, expenses, salary and reporting.",
          "Data structure: define the fields, statuses and relationships needed so the same information does not have to be entered repeatedly.",
          "Interface planning: design clear forms, tables, filters, dashboards and actions around the daily operating flow.",
          "Scenario testing: test the workflow using realistic stock updates, orders, delivery changes, cancellations and expense entries.",
          "Refinement and rollout: simplify confusing steps, connect the modules and prepare the system for future features without rebuilding the core."
        ],
        deliverables: ["Workflow and module map","Inventory / order status structure","Forms, tables and dashboard flow","Reporting structure","Prototype or implementation scope"],
        tools: ["Workflow mapping","Front-end development tools","Database / structured data tools","GitHub version control"],
        needs: ["Current business process","Sample products and orders","Required statuses","User roles","Reports the business needs"],
        handoff: "A documented and organized system structure, with the agreed prototype or implementation prepared so new modules can be added later."
      },
      {
        key: "ai",
        type: "compact",
        marker: "AI",
        cardTitle: "AI-Assisted Creation",
        cardDescription: "Prompting, visual ideation and repeatable creative workflows.",
        actionLabel: "View workflow ↗",
        chips: [],
        modalEyebrow: "Digital project workflow",
        modalTitle: "AI-Assisted Creation",
        modalSummary: "I use AI as part of a controlled creative workflow for ideation, prompting, visual planning and repeatable content production while keeping the final direction intentional.",
        workflow: [
          "Goal definition: decide what needs to be created, who it is for and what the final output must achieve.",
          "Reference and constraint setup: collect brand rules, examples, visual references and consistency requirements.",
          "Prompt and concept development: build prompts and test directions until the visual or content structure is useful.",
          "Selection and refinement: choose the strongest output, correct inconsistencies and refine the creative direction.",
          "Production integration: combine AI output with design, editing or other production tools instead of using raw generations as the final result.",
          "Reusable workflow: document the successful process so similar content can be produced faster and more consistently later."
        ],
        deliverables: ["Prompt / concept direction","Visual or content variations","Refined production assets","Repeatable prompt workflow","Final creative output as scoped"],
        tools: ["ChatGPT / AI tools","Image and video generation tools","Adobe creative tools","Prompt documentation"],
        needs: ["Project goal","Reference style","Brand constraints","Required format","Examples of what should or should not be produced"],
        handoff: "The approved creative output plus the reusable direction or prompt structure included in the agreed scope."
      },
      {
        key: "web",
        type: "compact",
        marker: "WEB",
        cardTitle: "Web & Portfolio Builds",
        cardDescription: "Responsive digital experiences designed to present work clearly.",
        actionLabel: "View workflow ↗",
        chips: [],
        modalEyebrow: "Digital project workflow",
        modalTitle: "Web & Portfolio Builds",
        modalSummary: "I plan responsive websites around clear hierarchy, real content and practical navigation so the work or business is easy to understand on desktop and mobile.",
        workflow: [
          "Content and goal review: define the audience, pages, actions and information the website needs to communicate.",
          "Information architecture: organize sections, navigation and page flow before styling the interface.",
          "Visual system: establish typography, colors, spacing, cards and reusable components for consistent presentation.",
          "Responsive build: implement the interface and adapt the layout across desktop, tablet and mobile.",
          "Content integration and testing: add real content, check navigation, responsiveness and common interaction states.",
          "Polish and deployment preparation: refine the final experience, organize the code and prepare the agreed deployment or handoff."
        ],
        deliverables: ["Page / section structure","Responsive UI","Reusable visual components","Interactive states","Deployment-ready build as scoped"],
        tools: ["HTML / CSS / JavaScript","VS Code","GitHub","Design and image tools"],
        needs: ["Website goal","Page/content list","Brand assets","Images and copy","Required links or functionality"],
        handoff: "Organized website files and source code, with deployment or repository handoff based on the agreed project scope."
      },
      {
        key: "docs",
        type: "compact",
        marker: "OPS",
        cardTitle: "Business Documents",
        cardDescription: "Reusable operational templates for clear, consistent communication.",
        actionLabel: "View workflow ↗",
        chips: [],
        modalEyebrow: "Digital project workflow",
        modalTitle: "Business Documents",
        modalSummary: "I design reusable business documents that keep customer-facing and internal communication structured, consistent and easy to update.",
        workflow: [
          "Use-case review: identify who uses the document, when it is used and what information must always be included.",
          "Information hierarchy: organize headings, fields, tables, notes and actions in the order people actually need them.",
          "Visual system: apply consistent typography, spacing and brand styling without making the document cluttered.",
          "Template design: build the reusable layout for print, PDF or digital use depending on the workflow.",
          "Real-data testing: test the template with realistic names, quantities, prices, notes and longer content.",
          "Template handoff: prepare the master version and clear reusable structure for future records or reports."
        ],
        deliverables: ["Reusable document template","Print / PDF layout","Structured fields and tables","Brand-consistent formatting","Master editable version"],
        tools: ["Adobe design tools","Document / spreadsheet tools","PDF export workflow"],
        needs: ["Document purpose","Required fields","Example data","Brand details","Print or digital requirements"],
        handoff: "A clean master template with export-ready versions and the editable format included in the agreed scope."
      }
    ]
  });

  let digitalProjectsDirty = false;
  let digitalProjectsLastLoadedDraft = null;

  const cloneDigitalProjectsDefaults = () => structuredClone(digitalProjectsDefaults);

  const setDigitalProjectsMessage = (message = "") => {
    if (digitalProjectsEditorMessage) digitalProjectsEditorMessage.textContent = message;
  };

  const setDigitalProjectsState = (label) => {
    if (digitalProjectsEditorState) digitalProjectsEditorState.textContent = label;
  };

  const setDigitalProjectsBusy = (busy) => {
    [digitalProjectsPreviewButton, digitalProjectsSaveButton, digitalProjectsPublishButton].forEach((button) => {
      if (button) button.disabled = busy;
    });
  };

  const digitalProjectEditorCard = (project, index) => `
    <article class="project-editor-card digital-editor-card" data-digital-key="${project.key}" data-digital-type="${project.type}">
      <header>
        <div>
          <small>DIGITAL PROJECT ${index + 1}</small>
          <h4>${project.cardTitle}</h4>
        </div>
        <b>${project.type === "main" ? "FEATURED CARD" : "COMPACT CARD"}</b>
      </header>

      <div class="editor-grid two">
        <label>
          <span>${project.type === "main" ? "Badge" : "Icon text"}</span>
          <input data-digital-field="marker" type="text" maxlength="30" required>
        </label>
        <label>
          <span>Action label</span>
          <input data-digital-field="actionLabel" type="text" maxlength="50" required>
        </label>
        <label class="editor-grid-span">
          <span>Card title</span>
          <input data-digital-field="cardTitle" type="text" maxlength="140" required>
        </label>
        <label class="editor-grid-span">
          <span>Card description</span>
          <textarea data-digital-field="cardDescription" rows="3" maxlength="360" required></textarea>
        </label>
        ${project.type === "main" ? `
        <label class="editor-grid-span">
          <span>Featured chips — one item per line</span>
          <textarea data-digital-field="chipsText" rows="5" maxlength="500" required></textarea>
        </label>` : ""}
      </div>

      <div class="showcase-modal-fields">
        <p class="eyebrow">POPUP CONTENT</p>
        <div class="editor-grid two">
          <label>
            <span>Popup eyebrow</span>
            <input data-digital-field="modalEyebrow" type="text" maxlength="90" required>
          </label>
          <label>
            <span>Popup title</span>
            <input data-digital-field="modalTitle" type="text" maxlength="120" required>
          </label>
          <label class="editor-grid-span">
            <span>Popup summary</span>
            <textarea data-digital-field="modalSummary" rows="3" maxlength="600" required></textarea>
          </label>
          <label class="editor-grid-span">
            <span>Workflow — one step per line</span>
            <textarea data-digital-field="workflowText" rows="7" maxlength="2600" required></textarea>
          </label>
          <label>
            <span>Deliverables — one item per line</span>
            <textarea data-digital-field="deliverablesText" rows="6" maxlength="1500" required></textarea>
          </label>
          <label>
            <span>Tools — one item per line</span>
            <textarea data-digital-field="toolsText" rows="6" maxlength="1500" required></textarea>
          </label>
          <label class="editor-grid-span">
            <span>What I need — one item per line</span>
            <textarea data-digital-field="needsText" rows="6" maxlength="1500" required></textarea>
          </label>
          <label class="editor-grid-span">
            <span>Final handoff</span>
            <textarea data-digital-field="handoff" rows="3" maxlength="700" required></textarea>
          </label>
        </div>
      </div>
    </article>
  `;

  const renderDigitalProjectsEditorCards = () => {
    digitalProjectsEditorList.innerHTML = digitalProjectsDefaults.projects
      .map(digitalProjectEditorCard)
      .join("");
  };

  const digitalProjectCardElement = (key) =>
    digitalProjectsEditorList?.querySelector(`[data-digital-key="${key}"]`);

  const fillDigitalProjectCard = (project) => {
    const card = digitalProjectCardElement(project.key);
    if (!card) return;

    const simpleFields = ["marker","actionLabel","cardTitle","cardDescription","modalEyebrow","modalTitle","modalSummary","handoff"];
    simpleFields.forEach((field) => {
      const input = card.querySelector(`[data-digital-field="${field}"]`);
      if (input) input.value = project[field] ?? "";
    });

    const listFields = {
      workflowText: project.workflow,
      deliverablesText: project.deliverables,
      toolsText: project.tools,
      needsText: project.needs,
      chipsText: project.chips
    };

    Object.entries(listFields).forEach(([field, items]) => {
      const input = card.querySelector(`[data-digital-field="${field}"]`);
      if (input) input.value = listToText(items);
    });
  };

  const populateDigitalProjectsForm = (data = {}) => {
    const defaults = cloneDigitalProjectsDefaults();
    const incomingProjects = Array.isArray(data.projects) ? data.projects : [];

    const merged = {
      ...defaults,
      ...data,
      projects: defaults.projects.map((project) => {
        const incoming = incomingProjects.find((candidate) => candidate?.key === project.key) || {};
        return { ...project, ...incoming, key: project.key, type: project.type };
      })
    };

    digitalProjectsEditorForm.elements.namedItem("eyebrow").value = merged.eyebrow;
    digitalProjectsEditorForm.elements.namedItem("titleMain").value = merged.titleMain;
    digitalProjectsEditorForm.elements.namedItem("titleAccent").value = merged.titleAccent;
    merged.projects.forEach(fillDigitalProjectCard);

    digitalProjectsLastLoadedDraft = structuredClone(merged);
    digitalProjectsDirty = false;
    setDigitalProjectsState("Draft loaded");
  };

  const readDigitalProjectsForm = () => {
    if (!digitalProjectsEditorForm) return null;

    const missingRequired = [...digitalProjectsEditorForm.querySelectorAll("[required]")].find(
      (field) => !String(field.value || "").trim()
    );

    if (missingRequired) {
      const projectCard = missingRequired.closest("[data-digital-key]");
      const projectTitle =
        projectCard?.querySelector('[data-digital-field="cardTitle"]')?.value?.trim() ||
        projectCard?.dataset.digitalKey ||
        "section heading";
      const fieldLabel =
        missingRequired.closest("label")?.querySelector("span")?.textContent?.trim() ||
        "required field";

      setDigitalProjectsMessage(`Complete "${fieldLabel}" for ${projectTitle} before saving.`);
      missingRequired.focus();
      missingRequired.scrollIntoView({ behavior: "smooth", block: "center" });
      return null;
    }

    const projects = digitalProjectsDefaults.projects.map((project) => {
      const card = digitalProjectCardElement(project.key);
      const get = (field) =>
        String(card?.querySelector(`[data-digital-field="${field}"]`)?.value || "").trim();

      return {
        key: project.key,
        type: project.type,
        marker: get("marker"),
        cardTitle: get("cardTitle"),
        cardDescription: get("cardDescription"),
        actionLabel: get("actionLabel"),
        chips: project.type === "main" ? textToList(get("chipsText")) : [],
        modalEyebrow: get("modalEyebrow"),
        modalTitle: get("modalTitle"),
        modalSummary: get("modalSummary"),
        workflow: textToList(get("workflowText")),
        deliverables: textToList(get("deliverablesText")),
        tools: textToList(get("toolsText")),
        needs: textToList(get("needsText")),
        handoff: get("handoff")
      };
    });

    return {
      eyebrow: String(digitalProjectsEditorForm.elements.namedItem("eyebrow").value || "").trim(),
      titleMain: String(digitalProjectsEditorForm.elements.namedItem("titleMain").value || "").trim(),
      titleAccent: String(digitalProjectsEditorForm.elements.namedItem("titleAccent").value || "").trim(),
      projects
    };
  };

  const renderDigitalProjectsPreview = (data) => {
    document.querySelector("#previewDigitalProjectsEyebrow").textContent = data.eyebrow;
    document.querySelector("#previewDigitalProjectsTitleMain").textContent = data.titleMain;
    document.querySelector("#previewDigitalProjectsTitleAccent").textContent = data.titleAccent;
    digitalProjectsPreviewGrid.innerHTML = "";

    data.projects.forEach((project) => {
      const card = document.createElement("article");
      card.className = `digital-preview-card ${project.type === "main" ? "featured" : ""}`;

      const marker = document.createElement("span");
      marker.textContent = project.marker;
      const title = document.createElement("strong");
      title.textContent = project.cardTitle;
      const description = document.createElement("p");
      description.textContent = project.cardDescription;
      const action = document.createElement("small");
      action.textContent = project.actionLabel;

      card.append(marker, title, description);

      if (project.type === "main" && project.chips.length) {
        const chips = document.createElement("div");
        chips.className = "digital-preview-chips";
        project.chips.forEach((chip) => {
          const tag = document.createElement("i");
          tag.textContent = chip;
          chips.appendChild(tag);
        });
        card.appendChild(chips);
      }

      card.appendChild(action);
      digitalProjectsPreviewGrid.appendChild(card);
    });

    digitalProjectsDraftPreview.hidden = false;
    digitalProjectsDraftPreview.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const loadDigitalProjectsEditor = async () => {
    setDigitalProjectsMessage("Loading AI & Digital Projects draft…");
    setDigitalProjectsState("Loading…");

    const { data, error } = await supabaseClient
      .from("cms_content_entries")
      .select("content_key,draft_data,published_data,draft_updated_at,published_at")
      .eq("content_key", DIGITAL_PROJECTS_CONTENT_KEY)
      .maybeSingle();

    if (error) {
      console.error("AI & Digital Projects CMS load failed:", error);
      populateDigitalProjectsForm(digitalProjectsDefaults);
      setDigitalProjectsState("Load failed");
      setDigitalProjectsMessage("Could not load the AI & Digital Projects content store.");
      return false;
    }

    if (!data) {
      populateDigitalProjectsForm(digitalProjectsDefaults);
      setDigitalProjectsState("Setup required");
      setDigitalProjectsMessage("Save Draft to create the Phase 2E content row.");
      return false;
    }

    populateDigitalProjectsForm(data.draft_data || digitalProjectsDefaults);

    const synced =
      JSON.stringify(data.draft_data || {}) === JSON.stringify(data.published_data || {});

    setDigitalProjectsState(synced ? "Published · synced" : "Draft differs from live");
    setDigitalProjectsMessage(
      data.published_at
        ? "Digital Projects draft loaded. Preview or edit before publishing."
        : "Digital Projects draft loaded. This content has not been published yet."
    );

    return true;
  };

  renderDigitalProjectsEditorCards();
  populateDigitalProjectsForm(digitalProjectsDefaults);

  digitalProjectsNavButton?.addEventListener("click", async () => {
    showCmsView("digital-projects");
    await loadDigitalProjectsEditor();
  });

  digitalProjectsEditorForm?.addEventListener("input", () => {
    digitalProjectsDirty = true;
    setDigitalProjectsState("Unsaved changes");
  });

  digitalProjectsPreviewButton?.addEventListener("click", () => {
    setDigitalProjectsMessage("");
    const draft = readDigitalProjectsForm();
    if (!draft) return;
    renderDigitalProjectsPreview(draft);
  });

  closeDigitalProjectsPreviewButton?.addEventListener("click", () => {
    digitalProjectsDraftPreview.hidden = true;
  });

  const saveDigitalProjectsDraft = async () => {
    setDigitalProjectsMessage("");
    const draft = readDigitalProjectsForm();
    if (!draft) return false;

    setDigitalProjectsBusy(true);
    setDigitalProjectsState("Saving…");

    try {
      const { data, error } = await supabaseClient
        .from("cms_content_entries")
        .upsert(
          {
            content_key: DIGITAL_PROJECTS_CONTENT_KEY,
            draft_data: draft
          },
          {
            onConflict: "content_key"
          }
        )
        .select("content_key,draft_updated_at")
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setDigitalProjectsState("Save failed");
        setDigitalProjectsMessage("Could not create or update the AI & Digital Projects draft.");
        return false;
      }

      digitalProjectsLastLoadedDraft = structuredClone(draft);
      digitalProjectsDirty = false;
      setDigitalProjectsState("Draft saved");
      setDigitalProjectsMessage("Draft saved. Published digital-project content has not changed.");
      return true;
    } catch (error) {
      console.error("AI & Digital Projects draft save failed:", error);
      setDigitalProjectsState("Save failed");
      setDigitalProjectsMessage(
        error?.message
          ? `Could not save draft: ${error.message}`
          : "Could not save the AI & Digital Projects draft."
      );
      return false;
    } finally {
      setDigitalProjectsBusy(false);
    }
  };

  digitalProjectsSaveButton?.addEventListener("click", saveDigitalProjectsDraft);

  digitalProjectsEditorForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveDigitalProjectsDraft();
  });

  digitalProjectsPublishButton?.addEventListener("click", async () => {
    setDigitalProjectsMessage("");

    if (digitalProjectsDirty) {
      setDigitalProjectsState("Unsaved changes");
      setDigitalProjectsMessage("Save the draft first, then publish.");
      return;
    }

    if (!digitalProjectsLastLoadedDraft) {
      setDigitalProjectsMessage("Load or save the digital-project draft before publishing.");
      return;
    }

    setDigitalProjectsBusy(true);
    setDigitalProjectsState("Publishing…");

    try {
      const { data, error } = await supabaseClient.rpc("cms_publish_content", {
        p_content_key: DIGITAL_PROJECTS_CONTENT_KEY
      });

      if (error) throw error;
      if (!data?.length) throw new Error("Publish returned no AI & Digital Projects row.");

      setDigitalProjectsState("Published · synced");
      setDigitalProjectsMessage("AI & Digital Projects published to the CMS. Localhost reads this version now; production still waits for explicit live deployment.");
    } catch (error) {
      console.error("AI & Digital Projects publish failed:", error);
      setDigitalProjectsState("Publish failed");
      setDigitalProjectsMessage(error?.message || "Could not publish AI & Digital Projects.");
    } finally {
      setDigitalProjectsBusy(false);
    }
  });

  const ABOUT_ME_CONTENT_KEY = "homepage.about";

  const aboutMeDefaults = Object.freeze({
    eyebrow: "The person behind the work",
    titleMain: "ABOUT",
    titleAccent: "ME",
    headlineMain: "DESIGNER FIRST.",
    headlineAccent: "PROBLEM SOLVER ALWAYS.",
    paragraph1: "I’m Md Mehedi Hasan Sawon, a graphic designer focused on building bold, practical visual identities. My work goes beyond making things look good. I think about how a brand communicates, connects with people, and performs across digital platforms.",
    paragraph2: "From branding and social media to video, web and business systems, I combine creative thinking with practical execution to turn ideas into clear, useful experiences.",
    meta1Label: "Based in",
    meta1Value: "Bangladesh",
    meta2Label: "Open to",
    meta2Value: "Remote & freelance work"
  });

  let aboutMeDirty = false;
  let aboutMeLastLoadedDraft = null;

  const setAboutMeMessage = (message = "") => {
    if (aboutMeEditorMessage) aboutMeEditorMessage.textContent = message;
  };

  const setAboutMeState = (label) => {
    if (aboutMeEditorState) aboutMeEditorState.textContent = label;
  };

  const setAboutMeBusy = (busy) => {
    [aboutMePreviewButton, aboutMeSaveButton, aboutMePublishButton].forEach((button) => {
      if (button) button.disabled = busy;
    });
  };

  const populateAboutMeForm = (data = {}) => {
    const merged = { ...aboutMeDefaults, ...data };

    Object.entries(merged).forEach(([field, value]) => {
      const input = aboutMeEditorForm?.elements.namedItem(field);
      if (input) input.value = value ?? "";
    });

    aboutMeLastLoadedDraft = structuredClone(merged);
    aboutMeDirty = false;
    setAboutMeState("Draft loaded");
  };

  const readAboutMeForm = () => {
    if (!aboutMeEditorForm) return null;

    const missingRequired = [...aboutMeEditorForm.querySelectorAll("[required]")].find(
      (field) => !String(field.value || "").trim()
    );

    if (missingRequired) {
      const fieldLabel =
        missingRequired.closest("label")?.querySelector("span")?.textContent?.trim() ||
        "required field";

      setAboutMeMessage(`Complete "${fieldLabel}" before saving.`);
      missingRequired.focus();
      missingRequired.scrollIntoView({ behavior: "smooth", block: "center" });
      return null;
    }

    const get = (field) =>
      String(aboutMeEditorForm.elements.namedItem(field)?.value || "").trim();

    return {
      eyebrow: get("eyebrow"),
      titleMain: get("titleMain"),
      titleAccent: get("titleAccent"),
      headlineMain: get("headlineMain"),
      headlineAccent: get("headlineAccent"),
      paragraph1: get("paragraph1"),
      paragraph2: get("paragraph2"),
      meta1Label: get("meta1Label"),
      meta1Value: get("meta1Value"),
      meta2Label: get("meta2Label"),
      meta2Value: get("meta2Value")
    };
  };

  const renderAboutMePreview = (data) => {
    const previewValues = {
      previewAboutEyebrow: data.eyebrow,
      previewAboutTitleMain: data.titleMain,
      previewAboutTitleAccent: data.titleAccent,
      previewAboutHeadlineMain: data.headlineMain,
      previewAboutHeadlineAccent: data.headlineAccent,
      previewAboutParagraph1: data.paragraph1,
      previewAboutParagraph2: data.paragraph2,
      previewAboutMeta1Label: data.meta1Label,
      previewAboutMeta1Value: data.meta1Value,
      previewAboutMeta2Label: data.meta2Label,
      previewAboutMeta2Value: data.meta2Value
    };

    Object.entries(previewValues).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    });

    aboutMeDraftPreview.hidden = false;
    aboutMeDraftPreview.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const loadAboutMeEditor = async () => {
    setAboutMeMessage("Loading About Me draft…");
    setAboutMeState("Loading…");

    const { data, error } = await supabaseClient
      .from("cms_content_entries")
      .select("content_key,draft_data,published_data,draft_updated_at,published_at")
      .eq("content_key", ABOUT_ME_CONTENT_KEY)
      .maybeSingle();

    if (error) {
      console.error("About Me CMS load failed:", error);
      populateAboutMeForm(aboutMeDefaults);
      setAboutMeState("Load failed");
      setAboutMeMessage("Could not load the About Me content store.");
      return false;
    }

    if (!data) {
      populateAboutMeForm(aboutMeDefaults);
      setAboutMeState("Setup required");
      setAboutMeMessage("Save Draft to create the Phase 2F content row.");
      return false;
    }

    populateAboutMeForm(data.draft_data || aboutMeDefaults);

    const synced =
      JSON.stringify(data.draft_data || {}) === JSON.stringify(data.published_data || {});

    setAboutMeState(synced ? "Published · synced" : "Draft differs from live");
    setAboutMeMessage(
      data.published_at
        ? "About Me draft loaded. Preview or edit before publishing."
        : "About Me draft loaded. This content has not been published yet."
    );

    return true;
  };

  populateAboutMeForm(aboutMeDefaults);

  aboutMeNavButton?.addEventListener("click", async () => {
    showCmsView("about-me");
    await loadAboutMeEditor();
  });

  aboutMeEditorForm?.addEventListener("input", () => {
    aboutMeDirty = true;
    setAboutMeState("Unsaved changes");
  });

  aboutMePreviewButton?.addEventListener("click", () => {
    setAboutMeMessage("");
    const draft = readAboutMeForm();
    if (!draft) return;
    renderAboutMePreview(draft);
  });

  closeAboutMePreviewButton?.addEventListener("click", () => {
    aboutMeDraftPreview.hidden = true;
  });

  const saveAboutMeDraft = async () => {
    setAboutMeMessage("");
    const draft = readAboutMeForm();
    if (!draft) return false;

    setAboutMeBusy(true);
    setAboutMeState("Saving…");

    try {
      const { data, error } = await supabaseClient
        .from("cms_content_entries")
        .upsert(
          {
            content_key: ABOUT_ME_CONTENT_KEY,
            draft_data: draft
          },
          {
            onConflict: "content_key"
          }
        )
        .select("content_key,draft_updated_at")
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setAboutMeState("Save failed");
        setAboutMeMessage("Could not create or update the About Me draft.");
        return false;
      }

      aboutMeLastLoadedDraft = structuredClone(draft);
      aboutMeDirty = false;
      setAboutMeState("Draft saved");
      setAboutMeMessage("Draft saved. Published About Me content has not changed.");
      return true;
    } catch (error) {
      console.error("About Me draft save failed:", error);
      setAboutMeState("Save failed");
      setAboutMeMessage(
        error?.message
          ? `Could not save draft: ${error.message}`
          : "Could not save the About Me draft."
      );
      return false;
    } finally {
      setAboutMeBusy(false);
    }
  };

  aboutMeSaveButton?.addEventListener("click", saveAboutMeDraft);

  aboutMeEditorForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveAboutMeDraft();
  });

  aboutMePublishButton?.addEventListener("click", async () => {
    setAboutMeMessage("");

    if (aboutMeDirty) {
      setAboutMeState("Unsaved changes");
      setAboutMeMessage("Save the draft first, then publish.");
      return;
    }

    if (!aboutMeLastLoadedDraft) {
      setAboutMeMessage("Load or save the About Me draft before publishing.");
      return;
    }

    setAboutMeBusy(true);
    setAboutMeState("Publishing…");

    try {
      const { data, error } = await supabaseClient.rpc("cms_publish_content", {
        p_content_key: ABOUT_ME_CONTENT_KEY
      });

      if (error) throw error;
      if (!data?.length) throw new Error("Publish returned no About Me row.");

      setAboutMeState("Published · synced");
      setAboutMeMessage("About Me published to the CMS. Localhost reads this version now; production still waits for explicit live deployment.");
    } catch (error) {
      console.error("About Me publish failed:", error);
      setAboutMeState("Publish failed");
      setAboutMeMessage(error?.message || "Could not publish About Me.");
    } finally {
      setAboutMeBusy(false);
    }
  });

  const SKILLS_TOOLS_CONTENT_KEY = "homepage.skills-tools";

  const skillsToolsDefaults = Object.freeze({
    eyebrow: "Core capabilities & toolkit",
    titleAccent: "SKILLS",
    titleRest: "& TOOLS",
    skillsKicker: "Core capabilities",
    skillsTitle: "SKILLS",
    toolsKicker: "Software & platforms",
    toolsTitle: "TOOLS I USE",
    capabilities: [
      {
        key: "brand-social",
        number: "01",
        title: "BRAND & SOCIAL",
        description: "Visual identity and campaign-ready brand communication.",
        tags: ["Brand Identity", "Social Media Design"]
      },
      {
        key: "sports-design",
        number: "02",
        title: "SPORTS DESIGN",
        description: "Team identity, match visuals and apparel-focused design.",
        tags: ["Sports Graphics", "Jersey Design"]
      },
      {
        key: "motion-content",
        number: "03",
        title: "MOTION & CONTENT",
        description: "Short-form content, editing and AI-assisted creative workflows.",
        tags: ["Video Editing", "AI Workflows"]
      },
      {
        key: "digital-systems",
        number: "04",
        title: "DIGITAL SYSTEMS",
        description: "Practical web experiences and connected business workflows.",
        tags: ["Web Projects", "Business Systems"]
      }
    ],
    tools: [
      { key: "illustrator", name: "Illustrator", imageSrc: "assets/tool-illustrator.svg" },
      { key: "photoshop", name: "Photoshop", imageSrc: "assets/tool-photoshop.svg" },
      { key: "premiere-pro", name: "Premiere Pro", imageSrc: "assets/tool-premiere-pro.svg" },
      { key: "capcut", name: "CapCut", imageSrc: "assets/tool-capcut.png" },
      { key: "vscode", name: "VS Code", imageSrc: "assets/tool-vscode.png" },
      { key: "word", name: "Word", imageSrc: "assets/tool-word.png" },
      { key: "excel", name: "Excel", imageSrc: "assets/tool-excel.png" },
      { key: "powerpoint", name: "PowerPoint", imageSrc: "assets/tool-powerpoint.png" }
    ]
  });

  let skillsToolsDirty = false;
  let skillsToolsLastLoadedDraft = null;

  const cloneSkillsToolsDefaults = () => structuredClone(skillsToolsDefaults);

  const setSkillsToolsMessage = (message = "") => {
    if (skillsToolsEditorMessage) skillsToolsEditorMessage.textContent = message;
  };

  const setSkillsToolsState = (label) => {
    if (skillsToolsEditorState) skillsToolsEditorState.textContent = label;
  };

  const setSkillsToolsBusy = (busy) => {
    [skillsToolsPreviewButton, skillsToolsSaveButton, skillsToolsPublishButton].forEach((button) => {
      if (button) button.disabled = busy;
    });
    skillsToolsToolList?.querySelectorAll("[data-tool-upload]").forEach((input) => {
      input.disabled = busy;
    });
  };

  const capabilityEditorCard = (capability) => `
    <article class="project-editor-card skills-editor-card" data-skill-key="${capability.key}">
      <header>
        <div>
          <small>SKILL ${capability.number}</small>
          <h4>${capability.title}</h4>
        </div>
        <b>NUMBER FIXED</b>
      </header>
      <div class="editor-grid two">
        <label>
          <span>Skill title</span>
          <input data-skill-field="title" type="text" maxlength="90" required>
        </label>
        <label>
          <span>Description</span>
          <input data-skill-field="description" type="text" maxlength="220" required>
        </label>
        <label>
          <span>Tag 1</span>
          <input data-skill-field="tag1" type="text" maxlength="80" required>
        </label>
        <label>
          <span>Tag 2</span>
          <input data-skill-field="tag2" type="text" maxlength="80" required>
        </label>
      </div>
    </article>
  `;

  const toolEditorCard = (tool, index) => `
    <article class="project-editor-card tool-editor-card" data-tool-key="${tool.key}">
      <header>
        <div>
          <small>TOOL ${String(index + 1).padStart(2, "0")}</small>
          <h4>${tool.name}</h4>
        </div>
        <b>ORDER FIXED</b>
      </header>

      <div class="project-image-editor">
        <div class="project-upload-block">
          <span>Tool logo</span>
          <input data-tool-upload type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml">
          <small data-tool-upload-status>JPG, PNG, WebP or SVG · maximum 8 MB</small>
        </div>
        <div class="project-image-current tool-image-current">
          <img data-tool-image-preview alt="">
        </div>
      </div>

      <div class="editor-grid two">
        <label>
          <span>Tool name</span>
          <input data-tool-field="name" type="text" maxlength="80" required>
        </label>
        <label>
          <span>Logo path / URL</span>
          <input data-tool-field="imageSrc" type="text" maxlength="500" required>
        </label>
      </div>
    </article>
  `;

  const renderSkillsToolsEditorCards = () => {
    skillsToolsCapabilityList.innerHTML = skillsToolsDefaults.capabilities
      .map(capabilityEditorCard)
      .join("");
    skillsToolsToolList.innerHTML = skillsToolsDefaults.tools
      .map(toolEditorCard)
      .join("");
  };

  const skillCardElement = (key) =>
    skillsToolsCapabilityList?.querySelector(`[data-skill-key="${key}"]`);

  const toolCardElement = (key) =>
    skillsToolsToolList?.querySelector(`[data-tool-key="${key}"]`);

  const fillCapabilityCard = (capability) => {
    const card = skillCardElement(capability.key);
    if (!card) return;
    const tags = Array.isArray(capability.tags) ? capability.tags : [];
    const values = {
      title: capability.title,
      description: capability.description,
      tag1: tags[0] || "",
      tag2: tags[1] || ""
    };
    Object.entries(values).forEach(([field, value]) => {
      const input = card.querySelector(`[data-skill-field="${field}"]`);
      if (input) input.value = value;
    });
  };

  const fillToolCard = (tool) => {
    const card = toolCardElement(tool.key);
    if (!card) return;

    const name = card.querySelector('[data-tool-field="name"]');
    const imageSrc = card.querySelector('[data-tool-field="imageSrc"]');
    const preview = card.querySelector("[data-tool-image-preview]");

    if (name) name.value = tool.name || "";
    if (imageSrc) imageSrc.value = tool.imageSrc || "";
    if (preview) {
      preview.src = resolvePreviewImage(tool.imageSrc);
      preview.alt = tool.name ? `${tool.name} logo preview` : "Tool logo preview";
    }
  };

  const populateSkillsToolsForm = (data = {}) => {
    const defaults = cloneSkillsToolsDefaults();
    const incomingCapabilities = Array.isArray(data.capabilities) ? data.capabilities : [];
    const incomingTools = Array.isArray(data.tools) ? data.tools : [];

    const merged = {
      ...defaults,
      ...data,
      capabilities: defaults.capabilities.map((item) => {
        const incoming = incomingCapabilities.find((candidate) => candidate?.key === item.key) || {};
        return { ...item, ...incoming, key: item.key, number: item.number };
      }),
      tools: defaults.tools.map((item) => {
        const incoming = incomingTools.find((candidate) => candidate?.key === item.key) || {};
        return { ...item, ...incoming, key: item.key };
      })
    };

    ["eyebrow","titleAccent","titleRest","skillsKicker","skillsTitle","toolsKicker","toolsTitle"].forEach((field) => {
      const input = skillsToolsEditorForm?.elements.namedItem(field);
      if (input) input.value = merged[field] || "";
    });

    merged.capabilities.forEach(fillCapabilityCard);
    merged.tools.forEach(fillToolCard);

    skillsToolsLastLoadedDraft = structuredClone(merged);
    skillsToolsDirty = false;
    setSkillsToolsState("Draft loaded");
  };

  const readSkillsToolsForm = () => {
    if (!skillsToolsEditorForm) return null;

    const missingRequired = [...skillsToolsEditorForm.querySelectorAll("[required]")].find(
      (field) => !String(field.value || "").trim()
    );

    if (missingRequired) {
      const fieldLabel =
        missingRequired.closest("label")?.querySelector("span")?.textContent?.trim() ||
        "required field";
      const skillCard = missingRequired.closest("[data-skill-key]");
      const toolCard = missingRequired.closest("[data-tool-key]");
      const context =
        skillCard?.querySelector('[data-skill-field="title"]')?.value?.trim() ||
        toolCard?.querySelector('[data-tool-field="name"]')?.value?.trim() ||
        "Skills & Tools";

      setSkillsToolsMessage(`Complete "${fieldLabel}" for ${context} before saving.`);
      missingRequired.focus();
      missingRequired.scrollIntoView({ behavior: "smooth", block: "center" });
      return null;
    }

    const capabilities = skillsToolsDefaults.capabilities.map((item) => {
      const card = skillCardElement(item.key);
      const get = (field) =>
        String(card?.querySelector(`[data-skill-field="${field}"]`)?.value || "").trim();

      return {
        key: item.key,
        number: item.number,
        title: get("title"),
        description: get("description"),
        tags: [get("tag1"), get("tag2")]
      };
    });

    const tools = skillsToolsDefaults.tools.map((item) => {
      const card = toolCardElement(item.key);
      const get = (field) =>
        String(card?.querySelector(`[data-tool-field="${field}"]`)?.value || "").trim();

      return {
        key: item.key,
        name: get("name"),
        imageSrc: get("imageSrc")
      };
    });

    for (const tool of tools) {
      if (!isSafeImageSource(tool.imageSrc)) {
        setSkillsToolsMessage(`Use a safe logo path or HTTPS image URL for ${tool.name}.`);
        return null;
      }
    }

    const getHeader = (field) =>
      String(skillsToolsEditorForm.elements.namedItem(field)?.value || "").trim();

    return {
      eyebrow: getHeader("eyebrow"),
      titleAccent: getHeader("titleAccent"),
      titleRest: getHeader("titleRest"),
      skillsKicker: getHeader("skillsKicker"),
      skillsTitle: getHeader("skillsTitle"),
      toolsKicker: getHeader("toolsKicker"),
      toolsTitle: getHeader("toolsTitle"),
      capabilities,
      tools
    };
  };

  const renderSkillsToolsPreview = (data) => {
    const textMap = {
      previewSkillsToolsEyebrow: data.eyebrow,
      previewSkillsToolsTitleAccent: data.titleAccent,
      previewSkillsToolsTitleRest: data.titleRest,
      previewSkillsKicker: data.skillsKicker,
      previewSkillsTitle: data.skillsTitle,
      previewToolsKicker: data.toolsKicker,
      previewToolsTitle: data.toolsTitle
    };
    Object.entries(textMap).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    });

    skillsToolsCapabilityPreviewGrid.innerHTML = "";
    data.capabilities.forEach((capability) => {
      const card = document.createElement("article");
      card.className = "skills-preview-card";
      const number = document.createElement("span");
      number.textContent = capability.number;
      const title = document.createElement("strong");
      title.textContent = capability.title;
      const description = document.createElement("p");
      description.textContent = capability.description;
      const tags = document.createElement("div");
      capability.tags.forEach((tag) => {
        const item = document.createElement("i");
        item.textContent = tag;
        tags.appendChild(item);
      });
      card.append(number, title, description, tags);
      skillsToolsCapabilityPreviewGrid.appendChild(card);
    });

    skillsToolsToolPreviewGrid.innerHTML = "";
    data.tools.forEach((tool) => {
      const card = document.createElement("article");
      card.className = "tool-preview-card";
      const image = document.createElement("img");
      image.src = resolvePreviewImage(tool.imageSrc);
      image.alt = "";
      const name = document.createElement("strong");
      name.textContent = tool.name;
      card.append(image, name);
      skillsToolsToolPreviewGrid.appendChild(card);
    });

    skillsToolsDraftPreview.hidden = false;
    skillsToolsDraftPreview.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const loadSkillsToolsEditor = async () => {
    setSkillsToolsMessage("Loading Skills & Tools draft…");
    setSkillsToolsState("Loading…");

    const { data, error } = await supabaseClient
      .from("cms_content_entries")
      .select("content_key,draft_data,published_data,draft_updated_at,published_at")
      .eq("content_key", SKILLS_TOOLS_CONTENT_KEY)
      .maybeSingle();

    if (error) {
      console.error("Skills & Tools CMS load failed:", error);
      populateSkillsToolsForm(skillsToolsDefaults);
      setSkillsToolsState("Load failed");
      setSkillsToolsMessage("Could not load the Skills & Tools content store.");
      return false;
    }

    if (!data) {
      populateSkillsToolsForm(skillsToolsDefaults);
      setSkillsToolsState("Setup required");
      setSkillsToolsMessage("Save Draft to create the Phase 2G content row.");
      return false;
    }

    populateSkillsToolsForm(data.draft_data || skillsToolsDefaults);

    const synced =
      JSON.stringify(data.draft_data || {}) === JSON.stringify(data.published_data || {});

    setSkillsToolsState(synced ? "Published · synced" : "Draft differs from live");
    setSkillsToolsMessage(
      data.published_at
        ? "Skills & Tools draft loaded. Preview or edit before publishing."
        : "Skills & Tools draft loaded. This content has not been published yet."
    );
    return true;
  };

  const uploadToolLogo = async (input) => {
    const file = input?.files?.[0];
    const card = input?.closest("[data-tool-key]");
    const key = card?.dataset.toolKey;
    const status = card?.querySelector("[data-tool-upload-status]");

    const setStatus = (message) => {
      if (status) status.textContent = message;
    };

    if (!file || !card || !key) return;

    const allowedTypes = {
      ...HERO_ALLOWED_IMAGE_TYPES,
      "image/svg+xml": "svg"
    };
    const extension = allowedTypes[file.type];

    if (!extension) {
      setStatus("Use JPG, PNG, WebP or SVG.");
      return;
    }

    if (file.size > HERO_MAX_UPLOAD_BYTES) {
      setStatus("Logo is larger than 8 MB.");
      return;
    }

    setStatus("Uploading…");

    try {
      const uniquePart =
        globalThis.crypto?.randomUUID?.() ||
        Math.random().toString(36).slice(2, 12);
      const objectPath = `skills-tools/${key}/${Date.now()}-${uniquePart}.${extension}`;

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
      if (!publicUrl) throw new Error("Storage did not return a public logo URL.");

      const srcInput = card.querySelector('[data-tool-field="imageSrc"]');
      const preview = card.querySelector("[data-tool-image-preview]");
      if (srcInput) srcInput.value = publicUrl;
      if (preview) preview.src = publicUrl;

      skillsToolsDirty = true;
      setSkillsToolsState("Unsaved changes");
      setStatus("Uploaded. Save draft to keep this logo.");
    } catch (error) {
      console.error("Tool logo upload failed:", error);
      setStatus(error?.message || "Could not upload tool logo.");
    }
  };

  renderSkillsToolsEditorCards();
  populateSkillsToolsForm(skillsToolsDefaults);

  skillsToolsNavButton?.addEventListener("click", async () => {
    showCmsView("skills-tools");
    await loadSkillsToolsEditor();
  });

  skillsToolsEditorForm?.addEventListener("input", (event) => {
    if (event.target.matches("[data-tool-upload]")) return;

    skillsToolsDirty = true;
    setSkillsToolsState("Unsaved changes");

    if (event.target.matches('[data-tool-field="imageSrc"]')) {
      const card = event.target.closest("[data-tool-key]");
      const preview = card?.querySelector("[data-tool-image-preview]");
      if (preview) preview.src = resolvePreviewImage(event.target.value);
    }
  });

  skillsToolsEditorForm?.addEventListener("change", async (event) => {
    if (!event.target.matches("[data-tool-upload]")) return;
    await uploadToolLogo(event.target);
  });

  skillsToolsPreviewButton?.addEventListener("click", () => {
    setSkillsToolsMessage("");
    const draft = readSkillsToolsForm();
    if (!draft) return;
    renderSkillsToolsPreview(draft);
  });

  closeSkillsToolsPreviewButton?.addEventListener("click", () => {
    skillsToolsDraftPreview.hidden = true;
  });

  const saveSkillsToolsDraft = async () => {
    setSkillsToolsMessage("");
    const draft = readSkillsToolsForm();
    if (!draft) return false;

    setSkillsToolsBusy(true);
    setSkillsToolsState("Saving…");

    try {
      const { data, error } = await supabaseClient
        .from("cms_content_entries")
        .upsert(
          {
            content_key: SKILLS_TOOLS_CONTENT_KEY,
            draft_data: draft
          },
          {
            onConflict: "content_key"
          }
        )
        .select("content_key,draft_updated_at")
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setSkillsToolsState("Save failed");
        setSkillsToolsMessage("Could not create or update the Skills & Tools draft.");
        return false;
      }

      skillsToolsLastLoadedDraft = structuredClone(draft);
      skillsToolsDirty = false;
      setSkillsToolsState("Draft saved");
      setSkillsToolsMessage("Draft saved. Published Skills & Tools content has not changed.");
      return true;
    } catch (error) {
      console.error("Skills & Tools draft save failed:", error);
      setSkillsToolsState("Save failed");
      setSkillsToolsMessage(
        error?.message
          ? `Could not save draft: ${error.message}`
          : "Could not save the Skills & Tools draft."
      );
      return false;
    } finally {
      setSkillsToolsBusy(false);
    }
  };

  skillsToolsSaveButton?.addEventListener("click", saveSkillsToolsDraft);

  skillsToolsEditorForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveSkillsToolsDraft();
  });

  skillsToolsPublishButton?.addEventListener("click", async () => {
    setSkillsToolsMessage("");

    if (skillsToolsDirty) {
      setSkillsToolsState("Unsaved changes");
      setSkillsToolsMessage("Save the draft first, then publish.");
      return;
    }

    if (!skillsToolsLastLoadedDraft) {
      setSkillsToolsMessage("Load or save the Skills & Tools draft before publishing.");
      return;
    }

    setSkillsToolsBusy(true);
    setSkillsToolsState("Publishing…");

    try {
      const { data, error } = await supabaseClient.rpc("cms_publish_content", {
        p_content_key: SKILLS_TOOLS_CONTENT_KEY
      });

      if (error) throw error;
      if (!data?.length) throw new Error("Publish returned no Skills & Tools row.");

      setSkillsToolsState("Published · synced");
      setSkillsToolsMessage("Skills & Tools published to the CMS. Localhost reads this version now; production still waits for explicit live deployment.");
    } catch (error) {
      console.error("Skills & Tools publish failed:", error);
      setSkillsToolsState("Publish failed");
      setSkillsToolsMessage(error?.message || "Could not publish Skills & Tools.");
    } finally {
      setSkillsToolsBusy(false);
    }
  });

  const EXPERIENCE_COMMUNITY_CONTENT_KEY = "homepage.experience-community";

  const experienceCommunityDefaults = Object.freeze({
    eyebrow: "Work, responsibility & contribution",
    titleMain: "EXPERIENCE &",
    titleAccent: "COMMUNITY",
    items: [
      {
        key: "square-fashion",
        number: "01",
        type: "Professional",
        period: "2021–2025",
        title: "Square Fashion Limited",
        role: "Production Assistant → Computer Operator",
        description: "Managed production data, daily reporting, documentation and computer-based records while supporting coordination across factory operations.",
        tags: ["Production Reporting", "SAP / ETS", "Documentation", "Operations"]
      },
      {
        key: "freelance-design",
        number: "02",
        type: "Creative",
        period: "Ongoing",
        title: "Freelance Graphic Design",
        role: "Branding · Social Media · Sports Design",
        description: "Creating practical visual identities, campaign graphics and promotional content for brands, social platforms and sports projects.",
        tags: ["Brand Identity", "Social Campaigns", "Sports Design", "Client Projects"]
      },
      {
        key: "ssfc",
        number: "03",
        type: "Leadership",
        period: "Ongoing",
        title: "SSFC",
        role: "Technical Committee · Lead Graphic Designer",
        description: "Leading tournament visuals and communication across branding, match graphics, promotional materials and ongoing event operations.",
        tags: ["Creative Direction", "Tournament Branding", "Match Graphics", "Organizing"]
      },
      {
        key: "community-volunteer",
        number: "04",
        type: "Community",
        period: "Selected involvement",
        title: "Community & Volunteer Work",
        role: "Leo Club International · Great Wall Foundation",
        description: "Contributing to community programs, awareness campaigns and volunteer initiatives through teamwork and practical on-ground support.",
        tags: ["Volunteering", "Awareness Campaigns", "Teamwork", "Community Service"]
      }
    ]
  });

  let experienceCommunityDirty = false;
  let experienceCommunityLastLoadedDraft = null;

  const cloneExperienceCommunityDefaults = () => structuredClone(experienceCommunityDefaults);

  const setExperienceCommunityMessage = (message = "") => {
    if (experienceCommunityEditorMessage) experienceCommunityEditorMessage.textContent = message;
  };

  const setExperienceCommunityState = (label) => {
    if (experienceCommunityEditorState) experienceCommunityEditorState.textContent = label;
  };

  const setExperienceCommunityBusy = (busy) => {
    [experienceCommunityPreviewButton, experienceCommunitySaveButton, experienceCommunityPublishButton].forEach((button) => {
      if (button) button.disabled = busy;
    });
  };

  const experienceEditorCard = (item) => `
    <article class="project-editor-card experience-editor-card" data-experience-key="${item.key}">
      <header>
        <div>
          <small>EXPERIENCE ${item.number}</small>
          <h4>${item.title}</h4>
        </div>
        <b>NUMBER / ORDER FIXED</b>
      </header>

      <div class="editor-grid two">
        <label>
          <span>Type</span>
          <input data-experience-field="type" type="text" maxlength="60" required>
        </label>
        <label>
          <span>Period</span>
          <input data-experience-field="period" type="text" maxlength="80" required>
        </label>
        <label class="editor-grid-span">
          <span>Title</span>
          <input data-experience-field="title" type="text" maxlength="120" required>
        </label>
        <label class="editor-grid-span">
          <span>Role / subtitle</span>
          <input data-experience-field="role" type="text" maxlength="180" required>
        </label>
        <label class="editor-grid-span">
          <span>Description</span>
          <textarea data-experience-field="description" rows="4" maxlength="650" required></textarea>
        </label>
        <label>
          <span>Tag 1</span>
          <input data-experience-field="tag1" type="text" maxlength="70" required>
        </label>
        <label>
          <span>Tag 2</span>
          <input data-experience-field="tag2" type="text" maxlength="70" required>
        </label>
        <label>
          <span>Tag 3</span>
          <input data-experience-field="tag3" type="text" maxlength="70" required>
        </label>
        <label>
          <span>Tag 4</span>
          <input data-experience-field="tag4" type="text" maxlength="70" required>
        </label>
      </div>
    </article>
  `;

  const renderExperienceCommunityEditorCards = () => {
    experienceCommunityEditorList.innerHTML = experienceCommunityDefaults.items
      .map(experienceEditorCard)
      .join("");
  };

  const experienceCardElement = (key) =>
    experienceCommunityEditorList?.querySelector(`[data-experience-key="${key}"]`);

  const fillExperienceCard = (item) => {
    const card = experienceCardElement(item.key);
    if (!card) return;

    const tags = Array.isArray(item.tags) ? item.tags : [];
    const values = {
      type: item.type,
      period: item.period,
      title: item.title,
      role: item.role,
      description: item.description,
      tag1: tags[0] || "",
      tag2: tags[1] || "",
      tag3: tags[2] || "",
      tag4: tags[3] || ""
    };

    Object.entries(values).forEach(([field, value]) => {
      const input = card.querySelector(`[data-experience-field="${field}"]`);
      if (input) input.value = value;
    });
  };

  const populateExperienceCommunityForm = (data = {}) => {
    const defaults = cloneExperienceCommunityDefaults();
    const incomingItems = Array.isArray(data.items) ? data.items : [];

    const merged = {
      ...defaults,
      ...data,
      items: defaults.items.map((item) => {
        const incoming = incomingItems.find((candidate) => candidate?.key === item.key) || {};
        return { ...item, ...incoming, key: item.key, number: item.number };
      })
    };

    ["eyebrow", "titleMain", "titleAccent"].forEach((field) => {
      const input = experienceCommunityEditorForm?.elements.namedItem(field);
      if (input) input.value = merged[field] || "";
    });

    merged.items.forEach(fillExperienceCard);

    experienceCommunityLastLoadedDraft = structuredClone(merged);
    experienceCommunityDirty = false;
    setExperienceCommunityState("Draft loaded");
  };

  const readExperienceCommunityForm = () => {
    if (!experienceCommunityEditorForm) return null;

    const missingRequired = [...experienceCommunityEditorForm.querySelectorAll("[required]")].find(
      (field) => !String(field.value || "").trim()
    );

    if (missingRequired) {
      const fieldLabel =
        missingRequired.closest("label")?.querySelector("span")?.textContent?.trim() ||
        "required field";
      const card = missingRequired.closest("[data-experience-key]");
      const context =
        card?.querySelector('[data-experience-field="title"]')?.value?.trim() ||
        "Experience / Community";

      setExperienceCommunityMessage(`Complete "${fieldLabel}" for ${context} before saving.`);
      missingRequired.focus();
      missingRequired.scrollIntoView({ behavior: "smooth", block: "center" });
      return null;
    }

    const items = experienceCommunityDefaults.items.map((item) => {
      const card = experienceCardElement(item.key);
      const get = (field) =>
        String(card?.querySelector(`[data-experience-field="${field}"]`)?.value || "").trim();

      return {
        key: item.key,
        number: item.number,
        type: get("type"),
        period: get("period"),
        title: get("title"),
        role: get("role"),
        description: get("description"),
        tags: [get("tag1"), get("tag2"), get("tag3"), get("tag4")]
      };
    });

    const getHeader = (field) =>
      String(experienceCommunityEditorForm.elements.namedItem(field)?.value || "").trim();

    return {
      eyebrow: getHeader("eyebrow"),
      titleMain: getHeader("titleMain"),
      titleAccent: getHeader("titleAccent"),
      items
    };
  };

  const renderExperienceCommunityPreview = (data) => {
    document.getElementById("previewExperienceEyebrow").textContent = data.eyebrow;
    document.getElementById("previewExperienceTitleMain").textContent = data.titleMain;
    document.getElementById("previewExperienceTitleAccent").textContent = data.titleAccent;
    experienceCommunityPreviewGrid.innerHTML = "";

    data.items.forEach((item) => {
      const card = document.createElement("article");
      card.className = "experience-preview-card";

      const top = document.createElement("div");
      top.className = "experience-preview-top";
      const number = document.createElement("span");
      number.textContent = item.number;
      const type = document.createElement("b");
      type.textContent = item.type;
      const period = document.createElement("small");
      period.textContent = item.period;
      top.append(number, type, period);

      const title = document.createElement("strong");
      title.textContent = item.title;
      const role = document.createElement("em");
      role.textContent = item.role;
      const description = document.createElement("p");
      description.textContent = item.description;

      const tags = document.createElement("div");
      tags.className = "experience-preview-tags";
      item.tags.forEach((tag) => {
        const chip = document.createElement("i");
        chip.textContent = tag;
        tags.appendChild(chip);
      });

      card.append(top, title, role, description, tags);
      experienceCommunityPreviewGrid.appendChild(card);
    });

    experienceCommunityDraftPreview.hidden = false;
    experienceCommunityDraftPreview.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const loadExperienceCommunityEditor = async () => {
    setExperienceCommunityMessage("Loading Experience / Community draft…");
    setExperienceCommunityState("Loading…");

    const { data, error } = await supabaseClient
      .from("cms_content_entries")
      .select("content_key,draft_data,published_data,draft_updated_at,published_at")
      .eq("content_key", EXPERIENCE_COMMUNITY_CONTENT_KEY)
      .maybeSingle();

    if (error) {
      console.error("Experience / Community CMS load failed:", error);
      populateExperienceCommunityForm(experienceCommunityDefaults);
      setExperienceCommunityState("Load failed");
      setExperienceCommunityMessage("Could not load the Experience / Community content store.");
      return false;
    }

    if (!data) {
      populateExperienceCommunityForm(experienceCommunityDefaults);
      setExperienceCommunityState("Setup required");
      setExperienceCommunityMessage("Save Draft to create the Phase 2H content row.");
      return false;
    }

    populateExperienceCommunityForm(data.draft_data || experienceCommunityDefaults);

    const synced =
      JSON.stringify(data.draft_data || {}) === JSON.stringify(data.published_data || {});

    setExperienceCommunityState(synced ? "Published · synced" : "Draft differs from live");
    setExperienceCommunityMessage(
      data.published_at
        ? "Experience / Community draft loaded. Preview or edit before publishing."
        : "Experience / Community draft loaded. This content has not been published yet."
    );
    return true;
  };

  renderExperienceCommunityEditorCards();
  populateExperienceCommunityForm(experienceCommunityDefaults);

  experienceCommunityNavButton?.addEventListener("click", async () => {
    showCmsView("experience-community");
    await loadExperienceCommunityEditor();
  });

  experienceCommunityEditorForm?.addEventListener("input", () => {
    experienceCommunityDirty = true;
    setExperienceCommunityState("Unsaved changes");
  });

  experienceCommunityPreviewButton?.addEventListener("click", () => {
    setExperienceCommunityMessage("");
    const draft = readExperienceCommunityForm();
    if (!draft) return;
    renderExperienceCommunityPreview(draft);
  });

  closeExperienceCommunityPreviewButton?.addEventListener("click", () => {
    experienceCommunityDraftPreview.hidden = true;
  });

  const saveExperienceCommunityDraft = async () => {
    setExperienceCommunityMessage("");
    const draft = readExperienceCommunityForm();
    if (!draft) return false;

    setExperienceCommunityBusy(true);
    setExperienceCommunityState("Saving…");

    try {
      const { data, error } = await supabaseClient
        .from("cms_content_entries")
        .upsert(
          {
            content_key: EXPERIENCE_COMMUNITY_CONTENT_KEY,
            draft_data: draft
          },
          {
            onConflict: "content_key"
          }
        )
        .select("content_key,draft_updated_at")
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setExperienceCommunityState("Save failed");
        setExperienceCommunityMessage("Could not create or update the Experience / Community draft.");
        return false;
      }

      experienceCommunityLastLoadedDraft = structuredClone(draft);
      experienceCommunityDirty = false;
      setExperienceCommunityState("Draft saved");
      setExperienceCommunityMessage("Draft saved. Published Experience / Community content has not changed.");
      return true;
    } catch (error) {
      console.error("Experience / Community draft save failed:", error);
      setExperienceCommunityState("Save failed");
      setExperienceCommunityMessage(
        error?.message
          ? `Could not save draft: ${error.message}`
          : "Could not save the Experience / Community draft."
      );
      return false;
    } finally {
      setExperienceCommunityBusy(false);
    }
  };

  experienceCommunitySaveButton?.addEventListener("click", saveExperienceCommunityDraft);

  experienceCommunityEditorForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveExperienceCommunityDraft();
  });

  experienceCommunityPublishButton?.addEventListener("click", async () => {
    setExperienceCommunityMessage("");

    if (experienceCommunityDirty) {
      setExperienceCommunityState("Unsaved changes");
      setExperienceCommunityMessage("Save the draft first, then publish.");
      return;
    }

    if (!experienceCommunityLastLoadedDraft) {
      setExperienceCommunityMessage("Load or save the Experience / Community draft before publishing.");
      return;
    }

    setExperienceCommunityBusy(true);
    setExperienceCommunityState("Publishing…");

    try {
      const { data, error } = await supabaseClient.rpc("cms_publish_content", {
        p_content_key: EXPERIENCE_COMMUNITY_CONTENT_KEY
      });

      if (error) throw error;
      if (!data?.length) throw new Error("Publish returned no Experience / Community row.");

      setExperienceCommunityState("Published · synced");
      setExperienceCommunityMessage("Experience / Community published to the CMS. Localhost reads this version now; production still waits for explicit live deployment.");
    } catch (error) {
      console.error("Experience / Community publish failed:", error);
      setExperienceCommunityState("Publish failed");
      setExperienceCommunityMessage(error?.message || "Could not publish Experience / Community.");
    } finally {
      setExperienceCommunityBusy(false);
    }
  });

  const CONTACT_CONTENT_KEY = "homepage.contact";

  const contactDefaults = Object.freeze({
    statusText: "Available for freelance & remote projects",
    kicker: "Have a project, brand or system idea?",
    titleMain: "Let's Build Something",
    titleAccent: "Useful & Memorable.",
    description: "Need a brand identity, campaign design, sports creative, video content or a practical digital workflow? Tell me what you're building.",
    whatsappLabel: "WhatsApp",
    whatsappDisplay: "+60 17-472 3951",
    whatsappDescription: "Malaysia WhatsApp · Preferred for quick project conversations",
    whatsappAction: "Message ↗",
    whatsappHref: "https://wa.me/60174723951",
    emailLabel: "Email",
    emailAddress: "xehedi@gmail.com",
    emailDescription: "Best for briefs, files and detailed project info",
    emailAction: "Copy",
    socialGroupTitle: "Social & direct",
    callLabel: "Call · +880 17-8978 7218",
    callHref: "tel:+8801789787218",
    facebookLabel: "Facebook",
    facebookHref: "https://www.facebook.com/mdmehedihasansawoon/",
    instagramLabel: "Instagram",
    instagramHref: "https://www.instagram.com/honu______20",
    profilesGroupTitle: "Professional profiles",
    linkedinLabel: "LinkedIn",
    linkedinHref: "https://www.linkedin.com/in/mdmehedihasansawon/",
    githubLabel: "GitHub",
    githubHref: "https://github.com/xehedihasansawon",
    behanceLabel: "Behance",
    behanceHref: "https://www.behance.net/mehedihasan194"
  });

  let contactCmsDirty = false;
  let contactCmsLastLoadedDraft = null;

  const setContactCmsMessage = (message = "") => {
    if (contactCmsEditorMessage) contactCmsEditorMessage.textContent = message;
  };

  const setContactCmsState = (label) => {
    if (contactCmsEditorState) contactCmsEditorState.textContent = label;
  };

  const setContactCmsBusy = (busy) => {
    [contactCmsPreviewButton, contactCmsSaveButton, contactCmsPublishButton].forEach((button) => {
      if (button) button.disabled = busy;
    });
  };

  const populateContactCmsForm = (data = {}) => {
    const merged = { ...contactDefaults, ...data };

    Object.keys(contactDefaults).forEach((field) => {
      const input = contactCmsEditorForm?.elements.namedItem(field);
      if (input) input.value = merged[field] ?? "";
    });

    contactCmsLastLoadedDraft = structuredClone(merged);
    contactCmsDirty = false;
    setContactCmsState("Draft loaded");
  };

  const readContactCmsForm = () => {
    if (!contactCmsEditorForm) return null;

    const missingRequired = [...contactCmsEditorForm.querySelectorAll("[required]")].find(
      (field) => !String(field.value || "").trim()
    );

    if (missingRequired) {
      const fieldLabel =
        missingRequired.closest("label")?.querySelector("span")?.textContent?.trim() ||
        "required field";
      setContactCmsMessage(`Complete "${fieldLabel}" before saving.`);
      missingRequired.focus();
      missingRequired.scrollIntoView({ behavior: "smooth", block: "center" });
      return null;
    }

    const data = {};
    Object.keys(contactDefaults).forEach((field) => {
      data[field] = String(contactCmsEditorForm.elements.namedItem(field)?.value || "").trim();
    });

    const linkFields = [
      ["WhatsApp URL", data.whatsappHref],
      ["Call link", data.callHref],
      ["Facebook URL", data.facebookHref],
      ["Instagram URL", data.instagramHref],
      ["LinkedIn URL", data.linkedinHref],
      ["GitHub URL", data.githubHref],
      ["Behance URL", data.behanceHref]
    ];

    const invalidLink = linkFields.find(([, href]) => !isSafeCmsHref(href));
    if (invalidLink) {
      setContactCmsMessage(`Use a safe http/https/tel link for ${invalidLink[0]}.`);
      return null;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.emailAddress)) {
      setContactCmsMessage("Enter a valid email address.");
      return null;
    }

    return data;
  };

  const renderContactCmsPreview = (data) => {
    const previewValues = {
      previewContactStatus: data.statusText,
      previewContactKicker: data.kicker,
      previewContactTitleMain: data.titleMain,
      previewContactTitleAccent: data.titleAccent,
      previewContactDescription: data.description,
      previewWhatsappLabel: data.whatsappLabel,
      previewWhatsappDisplay: data.whatsappDisplay,
      previewWhatsappDescription: data.whatsappDescription,
      previewWhatsappAction: data.whatsappAction,
      previewEmailLabel: data.emailLabel,
      previewEmailAddress: data.emailAddress,
      previewEmailDescription: data.emailDescription,
      previewEmailAction: data.emailAction,
      previewSocialGroupTitle: data.socialGroupTitle,
      previewCallLabel: data.callLabel,
      previewFacebookLabel: data.facebookLabel,
      previewInstagramLabel: data.instagramLabel,
      previewProfilesGroupTitle: data.profilesGroupTitle,
      previewLinkedinLabel: data.linkedinLabel,
      previewGithubLabel: data.githubLabel,
      previewBehanceLabel: data.behanceLabel
    };

    Object.entries(previewValues).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    });

    contactCmsDraftPreview.hidden = false;
    contactCmsDraftPreview.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const loadContactCmsEditor = async () => {
    setContactCmsMessage("Loading Contact draft…");
    setContactCmsState("Loading…");

    const { data, error } = await supabaseClient
      .from("cms_content_entries")
      .select("content_key,draft_data,published_data,draft_updated_at,published_at")
      .eq("content_key", CONTACT_CONTENT_KEY)
      .maybeSingle();

    if (error) {
      console.error("Contact CMS load failed:", error);
      populateContactCmsForm(contactDefaults);
      setContactCmsState("Load failed");
      setContactCmsMessage("Could not load the Contact content store.");
      return false;
    }

    if (!data) {
      populateContactCmsForm(contactDefaults);
      setContactCmsState("Setup required");
      setContactCmsMessage("Save Draft to create the Phase 2I content row.");
      return false;
    }

    populateContactCmsForm(data.draft_data || contactDefaults);

    const synced =
      JSON.stringify(data.draft_data || {}) === JSON.stringify(data.published_data || {});

    setContactCmsState(synced ? "Published · synced" : "Draft differs from live");
    setContactCmsMessage(
      data.published_at
        ? "Contact draft loaded. Preview or edit before publishing."
        : "Contact draft loaded. This content has not been published yet."
    );

    return true;
  };

  populateContactCmsForm(contactDefaults);

  contactCmsNavButton?.addEventListener("click", async () => {
    showCmsView("contact");
    await loadContactCmsEditor();
  });

  contactCmsEditorForm?.addEventListener("input", () => {
    contactCmsDirty = true;
    setContactCmsState("Unsaved changes");
  });

  contactCmsPreviewButton?.addEventListener("click", () => {
    setContactCmsMessage("");
    const draft = readContactCmsForm();
    if (!draft) return;
    renderContactCmsPreview(draft);
  });

  closeContactCmsPreviewButton?.addEventListener("click", () => {
    contactCmsDraftPreview.hidden = true;
  });

  const saveContactCmsDraft = async () => {
    setContactCmsMessage("");
    const draft = readContactCmsForm();
    if (!draft) return false;

    setContactCmsBusy(true);
    setContactCmsState("Saving…");

    try {
      const { data, error } = await supabaseClient
        .from("cms_content_entries")
        .upsert(
          {
            content_key: CONTACT_CONTENT_KEY,
            draft_data: draft
          },
          {
            onConflict: "content_key"
          }
        )
        .select("content_key,draft_updated_at")
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setContactCmsState("Save failed");
        setContactCmsMessage("Could not create or update the Contact draft.");
        return false;
      }

      contactCmsLastLoadedDraft = structuredClone(draft);
      contactCmsDirty = false;
      setContactCmsState("Draft saved");
      setContactCmsMessage("Draft saved. Published Contact content has not changed.");
      return true;
    } catch (error) {
      console.error("Contact draft save failed:", error);
      setContactCmsState("Save failed");
      setContactCmsMessage(
        error?.message
          ? `Could not save draft: ${error.message}`
          : "Could not save the Contact draft."
      );
      return false;
    } finally {
      setContactCmsBusy(false);
    }
  };

  contactCmsSaveButton?.addEventListener("click", saveContactCmsDraft);

  contactCmsEditorForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveContactCmsDraft();
  });

  contactCmsPublishButton?.addEventListener("click", async () => {
    setContactCmsMessage("");

    if (contactCmsDirty) {
      setContactCmsState("Unsaved changes");
      setContactCmsMessage("Save the draft first, then publish.");
      return;
    }

    if (!contactCmsLastLoadedDraft) {
      setContactCmsMessage("Load or save the Contact draft before publishing.");
      return;
    }

    setContactCmsBusy(true);
    setContactCmsState("Publishing…");

    try {
      const { data, error } = await supabaseClient.rpc("cms_publish_content", {
        p_content_key: CONTACT_CONTENT_KEY
      });

      if (error) throw error;
      if (!data?.length) throw new Error("Publish returned no Contact row.");

      setContactCmsState("Published · synced");
      setContactCmsMessage("Contact published to the CMS. Localhost reads this version now; production still waits for explicit live deployment.");
    } catch (error) {
      console.error("Contact publish failed:", error);
      setContactCmsState("Publish failed");
      setContactCmsMessage(error?.message || "Could not publish Contact.");
    } finally {
      setContactCmsBusy(false);
    }
  });

  const FOOTER_CONTENT_KEY = "homepage.footer";

  const footerDefaults = Object.freeze({
    brandName: "MD MEHEDI HASAN SAWON",
    brandRole: "Graphic Designer · Brand & Digital Projects",
    navLinks: [
      { key: "home", label: "Home", href: "#home" },
      { key: "work", label: "Work", href: "#work" },
      { key: "services", label: "Services", href: "#services" },
      { key: "digital", label: "Digital", href: "#digital" },
      { key: "about", label: "About", href: "#about" },
      { key: "contact", label: "Contact", href: "#contact" }
    ],
    profileLinks: [
      { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/mdmehedihasansawon/" },
      { key: "github", label: "GitHub", href: "https://github.com/xehedihasansawon" },
      { key: "behance", label: "Behance", href: "https://www.behance.net/mehedihasan194" }
    ],
    copyrightText: "© 2026 Mehedi Hasan Sawon",
    rightsText: "All Rights Reserved.",
    bottomLinks: [
      { key: "facebook", label: "Facebook", href: "https://www.facebook.com/mdmehedihasansawoon/" },
      { key: "instagram", label: "Instagram", href: "https://www.instagram.com/honu______20" },
      { key: "whatsapp", label: "WhatsApp", href: "https://wa.me/60174723951" }
    ],
    backToTopLabel: "Back to top ↑",
    backToTopHref: "#home"
  });

  let footerCmsDirty = false;
  let footerCmsLastLoadedDraft = null;

  const cloneFooterDefaults = () => structuredClone(footerDefaults);

  const setFooterCmsMessage = (message = "") => {
    if (footerCmsEditorMessage) footerCmsEditorMessage.textContent = message;
  };

  const setFooterCmsState = (label) => {
    if (footerCmsEditorState) footerCmsEditorState.textContent = label;
  };

  const setFooterCmsBusy = (busy) => {
    [footerCmsPreviewButton, footerCmsSaveButton, footerCmsPublishButton].forEach((button) => {
      if (button) button.disabled = busy;
    });
  };

  const footerLinkEditorCard = (group, item, index) => `
    <article class="project-editor-card footer-link-editor-card" data-footer-group="${group}" data-footer-key="${item.key}">
      <header>
        <div>
          <small>${group.toUpperCase()} ${String(index + 1).padStart(2, "0")}</small>
          <h4>${item.label}</h4>
        </div>
        <b>ORDER FIXED</b>
      </header>
      <div class="editor-grid two">
        <label>
          <span>Label</span>
          <input data-footer-field="label" type="text" maxlength="80" required>
        </label>
        <label>
          <span>Link</span>
          <input data-footer-field="href" type="text" maxlength="500" required>
        </label>
      </div>
    </article>
  `;

  const renderFooterEditorLists = () => {
    footerNavEditorList.innerHTML = footerDefaults.navLinks
      .map((item, index) => footerLinkEditorCard("nav", item, index))
      .join("");
    footerProfileEditorList.innerHTML = footerDefaults.profileLinks
      .map((item, index) => footerLinkEditorCard("profile", item, index))
      .join("");
    footerBottomEditorList.innerHTML = footerDefaults.bottomLinks
      .map((item, index) => footerLinkEditorCard("bottom", item, index))
      .join("");
  };

  const footerLinkCard = (group, key) =>
    document.querySelector(`[data-footer-group="${group}"][data-footer-key="${key}"]`);

  const fillFooterLink = (group, item) => {
    const card = footerLinkCard(group, item.key);
    if (!card) return;
    const label = card.querySelector('[data-footer-field="label"]');
    const href = card.querySelector('[data-footer-field="href"]');
    if (label) label.value = item.label || "";
    if (href) href.value = item.href || "";
  };

  const mergeFooterLinks = (defaults, incoming) =>
    defaults.map((item) => {
      const match = Array.isArray(incoming)
        ? incoming.find((candidate) => candidate?.key === item.key)
        : null;
      return { ...item, ...(match || {}), key: item.key };
    });

  const populateFooterCmsForm = (data = {}) => {
    const defaults = cloneFooterDefaults();
    const merged = {
      ...defaults,
      ...data,
      navLinks: mergeFooterLinks(defaults.navLinks, data.navLinks),
      profileLinks: mergeFooterLinks(defaults.profileLinks, data.profileLinks),
      bottomLinks: mergeFooterLinks(defaults.bottomLinks, data.bottomLinks)
    };

    ["brandName","brandRole","copyrightText","rightsText","backToTopLabel","backToTopHref"].forEach((field) => {
      const input = footerCmsEditorForm?.elements.namedItem(field);
      if (input) input.value = merged[field] || "";
    });

    merged.navLinks.forEach((item) => fillFooterLink("nav", item));
    merged.profileLinks.forEach((item) => fillFooterLink("profile", item));
    merged.bottomLinks.forEach((item) => fillFooterLink("bottom", item));

    footerCmsLastLoadedDraft = structuredClone(merged);
    footerCmsDirty = false;
    setFooterCmsState("Draft loaded");
  };

  const readFooterLinkGroup = (group, defaults) =>
    defaults.map((item) => {
      const card = footerLinkCard(group, item.key);
      return {
        key: item.key,
        label: String(card?.querySelector('[data-footer-field="label"]')?.value || "").trim(),
        href: String(card?.querySelector('[data-footer-field="href"]')?.value || "").trim()
      };
    });

  const readFooterCmsForm = () => {
    if (!footerCmsEditorForm) return null;

    const missingRequired = [...footerCmsEditorForm.querySelectorAll("[required]")].find(
      (field) => !String(field.value || "").trim()
    );

    if (missingRequired) {
      const fieldLabel =
        missingRequired.closest("label")?.querySelector("span")?.textContent?.trim() ||
        "required field";
      setFooterCmsMessage(`Complete "${fieldLabel}" before saving.`);
      missingRequired.focus();
      missingRequired.scrollIntoView({ behavior: "smooth", block: "center" });
      return null;
    }

    const navLinks = readFooterLinkGroup("nav", footerDefaults.navLinks);
    const profileLinks = readFooterLinkGroup("profile", footerDefaults.profileLinks);
    const bottomLinks = readFooterLinkGroup("bottom", footerDefaults.bottomLinks);
    const backToTopHref = String(
      footerCmsEditorForm.elements.namedItem("backToTopHref")?.value || ""
    ).trim();

    const allLinks = [
      ...navLinks.map((item) => [item.label, item.href]),
      ...profileLinks.map((item) => [item.label, item.href]),
      ...bottomLinks.map((item) => [item.label, item.href]),
      ["Back to top", backToTopHref]
    ];

    const invalidLink = allLinks.find(([, href]) => !isSafeCmsHref(href));
    if (invalidLink) {
      setFooterCmsMessage(`Use a safe internal or http/https/tel/mailto link for ${invalidLink[0]}.`);
      return null;
    }

    const get = (field) =>
      String(footerCmsEditorForm.elements.namedItem(field)?.value || "").trim();

    return {
      brandName: get("brandName"),
      brandRole: get("brandRole"),
      navLinks,
      profileLinks,
      copyrightText: get("copyrightText"),
      rightsText: get("rightsText"),
      bottomLinks,
      backToTopLabel: get("backToTopLabel"),
      backToTopHref
    };
  };

  const renderFooterPreviewLinks = (containerId, links) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";
    links.forEach((item) => {
      const span = document.createElement("span");
      span.textContent = item.label;
      container.appendChild(span);
    });
  };

  const renderFooterCmsPreview = (data) => {
    document.getElementById("previewFooterBrandName").textContent = data.brandName;
    document.getElementById("previewFooterBrandRole").textContent = data.brandRole;
    document.getElementById("previewFooterCopyright").textContent = data.copyrightText;
    document.getElementById("previewFooterRights").textContent = data.rightsText;

    renderFooterPreviewLinks("previewFooterNav", data.navLinks);
    renderFooterPreviewLinks("previewFooterProfiles", data.profileLinks);
    renderFooterPreviewLinks("previewFooterBottomLinks", [
      ...data.bottomLinks,
      { label: data.backToTopLabel }
    ]);

    footerCmsDraftPreview.hidden = false;
    footerCmsDraftPreview.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const loadFooterCmsEditor = async () => {
    setFooterCmsMessage("Loading Footer draft…");
    setFooterCmsState("Loading…");

    const { data, error } = await supabaseClient
      .from("cms_content_entries")
      .select("content_key,draft_data,published_data,draft_updated_at,published_at")
      .eq("content_key", FOOTER_CONTENT_KEY)
      .maybeSingle();

    if (error) {
      console.error("Footer CMS load failed:", error);
      populateFooterCmsForm(footerDefaults);
      setFooterCmsState("Load failed");
      setFooterCmsMessage("Could not load the Footer content store.");
      return false;
    }

    if (!data) {
      populateFooterCmsForm(footerDefaults);
      setFooterCmsState("Setup required");
      setFooterCmsMessage("Save Draft to create the Phase 2J content row.");
      return false;
    }

    populateFooterCmsForm(data.draft_data || footerDefaults);

    const synced =
      JSON.stringify(data.draft_data || {}) === JSON.stringify(data.published_data || {});

    setFooterCmsState(synced ? "Published · synced" : "Draft differs from live");
    setFooterCmsMessage(
      data.published_at
        ? "Footer draft loaded. Preview or edit before publishing."
        : "Footer draft loaded. This content has not been published yet."
    );
    return true;
  };

  renderFooterEditorLists();
  populateFooterCmsForm(footerDefaults);

  footerCmsNavButton?.addEventListener("click", async () => {
    showCmsView("footer");
    await loadFooterCmsEditor();
  });

  footerCmsEditorForm?.addEventListener("input", () => {
    footerCmsDirty = true;
    setFooterCmsState("Unsaved changes");
  });

  footerCmsPreviewButton?.addEventListener("click", () => {
    setFooterCmsMessage("");
    const draft = readFooterCmsForm();
    if (!draft) return;
    renderFooterCmsPreview(draft);
  });

  closeFooterCmsPreviewButton?.addEventListener("click", () => {
    footerCmsDraftPreview.hidden = true;
  });

  const saveFooterCmsDraft = async () => {
    setFooterCmsMessage("");
    const draft = readFooterCmsForm();
    if (!draft) return false;

    setFooterCmsBusy(true);
    setFooterCmsState("Saving…");

    try {
      const { data, error } = await supabaseClient
        .from("cms_content_entries")
        .upsert(
          {
            content_key: FOOTER_CONTENT_KEY,
            draft_data: draft
          },
          {
            onConflict: "content_key"
          }
        )
        .select("content_key,draft_updated_at")
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setFooterCmsState("Save failed");
        setFooterCmsMessage("Could not create or update the Footer draft.");
        return false;
      }

      footerCmsLastLoadedDraft = structuredClone(draft);
      footerCmsDirty = false;
      setFooterCmsState("Draft saved");
      setFooterCmsMessage("Draft saved. Published Footer content has not changed.");
      return true;
    } catch (error) {
      console.error("Footer draft save failed:", error);
      setFooterCmsState("Save failed");
      setFooterCmsMessage(
        error?.message
          ? `Could not save draft: ${error.message}`
          : "Could not save the Footer draft."
      );
      return false;
    } finally {
      setFooterCmsBusy(false);
    }
  };

  footerCmsSaveButton?.addEventListener("click", saveFooterCmsDraft);

  footerCmsEditorForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveFooterCmsDraft();
  });

  footerCmsPublishButton?.addEventListener("click", async () => {
    setFooterCmsMessage("");

    if (footerCmsDirty) {
      setFooterCmsState("Unsaved changes");
      setFooterCmsMessage("Save the draft first, then publish.");
      return;
    }

    if (!footerCmsLastLoadedDraft) {
      setFooterCmsMessage("Load or save the Footer draft before publishing.");
      return;
    }

    setFooterCmsBusy(true);
    setFooterCmsState("Publishing…");

    try {
      const { data, error } = await supabaseClient.rpc("cms_publish_content", {
        p_content_key: FOOTER_CONTENT_KEY
      });

      if (error) throw error;
      if (!data?.length) throw new Error("Publish returned no Footer row.");

      setFooterCmsState("Published · synced");
      setFooterCmsMessage("Footer published to the CMS. Localhost reads this version now; production still waits for explicit live deployment.");
    } catch (error) {
      console.error("Footer publish failed:", error);
      setFooterCmsState("Publish failed");
      setFooterCmsMessage(error?.message || "Could not publish Footer.");
    } finally {
      setFooterCmsBusy(false);
    }
  });

  const SECTION_LAYOUT_CONTENT_KEY = "homepage.section-layout";

  const sectionLayoutDefaults = Object.freeze({
    sections: [
      { key: "home", label: "Hero", visible: true },
      { key: "work", label: "Real Life Projects", visible: true },
      { key: "design-showcase", label: "Design Showcase", visible: true },
      { key: "services", label: "Creative Services", visible: true },
      { key: "digital", label: "AI & Digital Projects", visible: true },
      { key: "about", label: "About Me", visible: true },
      { key: "skills", label: "Skills & Tools", visible: true },
      { key: "experience", label: "Experience / Community", visible: true },
      { key: "contact", label: "Contact", visible: true }
    ]
  });

  let sectionLayoutDirty = false;
  let sectionLayoutLastLoadedDraft = null;
  let draggedSectionKey = null;

  const cloneSectionLayoutDefaults = () => structuredClone(sectionLayoutDefaults);

  const setSectionLayoutMessage = (message = "") => {
    if (sectionLayoutEditorMessage) sectionLayoutEditorMessage.textContent = message;
  };

  const setSectionLayoutState = (label) => {
    if (sectionLayoutEditorState) sectionLayoutEditorState.textContent = label;
  };

  const setSectionLayoutBusy = (busy) => {
    [sectionLayoutPreviewButton, sectionLayoutSaveButton, sectionLayoutPublishButton, sectionLayoutResetButton].forEach((button) => {
      if (button) button.disabled = busy;
    });
  };

  const normalizeSectionLayout = (data = {}) => {
    const defaults = cloneSectionLayoutDefaults();
    const incoming = Array.isArray(data.sections) ? data.sections : [];
    const used = new Set();
    const sections = [];

    incoming.forEach((item) => {
      const fallback = defaults.sections.find((candidate) => candidate.key === item?.key);
      if (!fallback || used.has(fallback.key)) return;
      used.add(fallback.key);
      sections.push({
        key: fallback.key,
        label: fallback.label,
        visible: item.visible !== false
      });
    });

    defaults.sections.forEach((item) => {
      if (!used.has(item.key)) sections.push(item);
    });

    return { sections };
  };

  const sectionLayoutRow = (item, index) => `
    <article class="section-layout-row" draggable="true" data-section-key="${item.key}">
      <div class="section-layout-drag" aria-hidden="true">⋮⋮</div>
      <div class="section-layout-order">${String(index + 1).padStart(2, "0")}</div>
      <div class="section-layout-copy">
        <strong>${item.label}</strong>
        <small>#${item.key}</small>
      </div>
      <label class="section-layout-toggle">
        <input type="checkbox" data-section-visible ${item.visible !== false ? "checked" : ""}>
        <span>Visible</span>
      </label>
      <div class="section-layout-controls">
        <button type="button" data-section-move="up" aria-label="Move ${item.label} up">↑</button>
        <button type="button" data-section-move="down" aria-label="Move ${item.label} down">↓</button>
      </div>
    </article>
  `;

  const refreshSectionLayoutOrderNumbers = () => {
    [...sectionLayoutList.querySelectorAll(".section-layout-row")].forEach((row, index) => {
      const order = row.querySelector(".section-layout-order");
      if (order) order.textContent = String(index + 1).padStart(2, "0");
    });
  };

  const renderSectionLayoutList = (data) => {
    const normalized = normalizeSectionLayout(data);
    sectionLayoutList.innerHTML = normalized.sections.map(sectionLayoutRow).join("");
    refreshSectionLayoutOrderNumbers();
  };

  const readSectionLayoutForm = () => {
    const rows = [...sectionLayoutList.querySelectorAll(".section-layout-row")];
    if (rows.length !== sectionLayoutDefaults.sections.length) {
      setSectionLayoutMessage("All nine homepage sections are required.");
      return null;
    }

    const sections = rows.map((row) => {
      const key = row.dataset.sectionKey;
      const fallback = sectionLayoutDefaults.sections.find((item) => item.key === key);
      return {
        key,
        label: fallback?.label || key,
        visible: row.querySelector("[data-section-visible]")?.checked !== false
      };
    });

    if (new Set(sections.map((item) => item.key)).size !== sectionLayoutDefaults.sections.length) {
      setSectionLayoutMessage("Section order contains a duplicate or missing section.");
      return null;
    }

    return { sections };
  };

  const markSectionLayoutDirty = (message = "Unsaved changes") => {
    sectionLayoutDirty = true;
    setSectionLayoutState(message);
  };

  const renderSectionLayoutPreview = (data) => {
    sectionLayoutPreviewList.innerHTML = "";

    data.sections.forEach((item, index) => {
      const row = document.createElement("div");
      row.className = "section-layout-preview-row";
      row.innerHTML = `
        <span>${String(index + 1).padStart(2, "0")}</span>
        <strong></strong>
        <b class="${item.visible ? "visible" : "hidden"}">${item.visible ? "VISIBLE" : "HIDDEN"}</b>
      `;
      row.querySelector("strong").textContent = item.label;
      sectionLayoutPreviewList.appendChild(row);
    });

    sectionLayoutDraftPreview.hidden = false;
    sectionLayoutDraftPreview.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const loadSectionLayoutEditor = async () => {
    setSectionLayoutMessage("Loading section layout draft…");
    setSectionLayoutState("Loading…");

    const { data, error } = await supabaseClient
      .from("cms_content_entries")
      .select("content_key,draft_data,published_data,draft_updated_at,published_at")
      .eq("content_key", SECTION_LAYOUT_CONTENT_KEY)
      .maybeSingle();

    if (error) {
      console.error("Section layout CMS load failed:", error);
      renderSectionLayoutList(sectionLayoutDefaults);
      setSectionLayoutState("Load failed");
      setSectionLayoutMessage("Could not load the section layout content store.");
      return false;
    }

    if (!data) {
      renderSectionLayoutList(sectionLayoutDefaults);
      sectionLayoutLastLoadedDraft = cloneSectionLayoutDefaults();
      sectionLayoutDirty = false;
      setSectionLayoutState("Setup required");
      setSectionLayoutMessage("Save Draft to create the Phase 2K content row.");
      return false;
    }

    const draft = normalizeSectionLayout(data.draft_data || sectionLayoutDefaults);
    renderSectionLayoutList(draft);
    sectionLayoutLastLoadedDraft = structuredClone(draft);
    sectionLayoutDirty = false;

    const synced =
      JSON.stringify(draft) === JSON.stringify(normalizeSectionLayout(data.published_data || {}));

    setSectionLayoutState(synced ? "Published · synced" : "Draft differs from live");
    setSectionLayoutMessage(
      data.published_at
        ? "Section layout draft loaded. Reorder, preview or publish when ready."
        : "Section layout draft loaded. This structure has not been published yet."
    );
    return true;
  };

  renderSectionLayoutList(sectionLayoutDefaults);

  sectionLayoutNavButton?.addEventListener("click", async () => {
    showCmsView("section-layout");
    await loadSectionLayoutEditor();
  });

  sectionLayoutList?.addEventListener("change", (event) => {
    if (!event.target.matches("[data-section-visible]")) return;
    markSectionLayoutDirty();
  });

  sectionLayoutList?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-section-move]");
    if (!button) return;

    const row = button.closest(".section-layout-row");
    if (!row) return;

    if (button.dataset.sectionMove === "up") {
      const previous = row.previousElementSibling;
      if (previous) sectionLayoutList.insertBefore(row, previous);
    } else {
      const next = row.nextElementSibling;
      if (next) sectionLayoutList.insertBefore(next, row);
    }

    refreshSectionLayoutOrderNumbers();
    markSectionLayoutDirty();
  });

  sectionLayoutList?.addEventListener("dragstart", (event) => {
    const row = event.target.closest(".section-layout-row");
    if (!row) return;
    draggedSectionKey = row.dataset.sectionKey;
    row.classList.add("is-dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", draggedSectionKey);
  });

  sectionLayoutList?.addEventListener("dragend", (event) => {
    event.target.closest(".section-layout-row")?.classList.remove("is-dragging");
    draggedSectionKey = null;
    sectionLayoutList.querySelectorAll(".drag-target").forEach((row) => row.classList.remove("drag-target"));
  });

  sectionLayoutList?.addEventListener("dragover", (event) => {
    event.preventDefault();
    const row = event.target.closest(".section-layout-row");
    if (!row || row.dataset.sectionKey === draggedSectionKey) return;
    sectionLayoutList.querySelectorAll(".drag-target").forEach((item) => item.classList.remove("drag-target"));
    row.classList.add("drag-target");
    event.dataTransfer.dropEffect = "move";
  });

  sectionLayoutList?.addEventListener("drop", (event) => {
    event.preventDefault();
    const targetRow = event.target.closest(".section-layout-row");
    const draggedRow = sectionLayoutList.querySelector(`[data-section-key="${CSS.escape(draggedSectionKey || "")}"]`);
    if (!targetRow || !draggedRow || targetRow === draggedRow) return;

    const box = targetRow.getBoundingClientRect();
    const insertAfter = event.clientY > box.top + box.height / 2;
    sectionLayoutList.insertBefore(
      draggedRow,
      insertAfter ? targetRow.nextElementSibling : targetRow
    );

    sectionLayoutList.querySelectorAll(".drag-target").forEach((row) => row.classList.remove("drag-target"));
    refreshSectionLayoutOrderNumbers();
    markSectionLayoutDirty();
  });

  sectionLayoutResetButton?.addEventListener("click", () => {
    renderSectionLayoutList(sectionLayoutDefaults);
    markSectionLayoutDirty("Reset pending");
    setSectionLayoutMessage("Approved homepage order restored in the draft editor. Save Draft to keep it.");
  });

  sectionLayoutPreviewButton?.addEventListener("click", () => {
    setSectionLayoutMessage("");
    const draft = readSectionLayoutForm();
    if (!draft) return;
    renderSectionLayoutPreview(draft);
  });

  closeSectionLayoutPreviewButton?.addEventListener("click", () => {
    sectionLayoutDraftPreview.hidden = true;
  });

  const saveSectionLayoutDraft = async () => {
    setSectionLayoutMessage("");
    const draft = readSectionLayoutForm();
    if (!draft) return false;

    setSectionLayoutBusy(true);
    setSectionLayoutState("Saving…");

    try {
      const { data, error } = await supabaseClient
        .from("cms_content_entries")
        .upsert(
          {
            content_key: SECTION_LAYOUT_CONTENT_KEY,
            draft_data: draft
          },
          {
            onConflict: "content_key"
          }
        )
        .select("content_key,draft_updated_at")
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setSectionLayoutState("Save failed");
        setSectionLayoutMessage("Could not create or update the section layout draft.");
        return false;
      }

      sectionLayoutLastLoadedDraft = structuredClone(draft);
      sectionLayoutDirty = false;
      setSectionLayoutState("Draft saved");
      setSectionLayoutMessage("Draft saved. Published homepage section layout has not changed.");
      return true;
    } catch (error) {
      console.error("Section layout draft save failed:", error);
      setSectionLayoutState("Save failed");
      setSectionLayoutMessage(
        error?.message
          ? `Could not save draft: ${error.message}`
          : "Could not save the homepage section layout draft."
      );
      return false;
    } finally {
      setSectionLayoutBusy(false);
    }
  };

  sectionLayoutSaveButton?.addEventListener("click", saveSectionLayoutDraft);

  sectionLayoutEditorForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveSectionLayoutDraft();
  });

  sectionLayoutPublishButton?.addEventListener("click", async () => {
    setSectionLayoutMessage("");

    if (sectionLayoutDirty) {
      setSectionLayoutState("Unsaved changes");
      setSectionLayoutMessage("Save the draft first, then publish.");
      return;
    }

    if (!sectionLayoutLastLoadedDraft) {
      setSectionLayoutMessage("Load or save the section layout draft before publishing.");
      return;
    }

    setSectionLayoutBusy(true);
    setSectionLayoutState("Publishing…");

    try {
      const { data, error } = await supabaseClient.rpc("cms_publish_content", {
        p_content_key: SECTION_LAYOUT_CONTENT_KEY
      });

      if (error) throw error;
      if (!data?.length) throw new Error("Publish returned no section layout row.");

      setSectionLayoutState("Published · synced");
      setSectionLayoutMessage("Homepage section layout published to the CMS. Localhost reads this version now; production still waits for explicit live deployment.");
    } catch (error) {
      console.error("Section layout publish failed:", error);
      setSectionLayoutState("Publish failed");
      setSectionLayoutMessage(error?.message || "Could not publish the homepage section layout.");
    } finally {
      setSectionLayoutBusy(false);
    }
  });

  const setPortfolioFoundationCheck = (dot, status, count, state, label, countLabel = "—") => {
    if (dot) {
      dot.classList.remove("checking", "ready", "missing");
      dot.classList.add(state);
    }
    if (status) status.textContent = label;
    if (count) count.textContent = countLabel;
  };

  const checkPortfolioFoundation = async () => {
    if (!portfolioFoundationState) return false;

    portfolioFoundationRefreshButton.disabled = true;
    portfolioFoundationState.textContent = "Checking…";
    portfolioFoundationMessage.textContent = "Checking secure Portfolio Engine tables…";

    setPortfolioFoundationCheck(
      portfolioCategoriesDot,
      portfolioCategoriesStatus,
      portfolioCategoriesCount,
      "checking",
      "Checking…"
    );
    setPortfolioFoundationCheck(
      portfolioProjectsDot,
      portfolioProjectsStatus,
      portfolioProjectsCount,
      "checking",
      "Checking…"
    );

    const [categoriesResult, projectsResult] = await Promise.all([
      supabaseClient
        .from("portfolio_categories")
        .select("id", { head: true, count: "exact" }),
      supabaseClient
        .from("portfolio_projects")
        .select("id", { head: true, count: "exact" })
    ]);

    const categoriesReady = !categoriesResult.error;
    const projectsReady = !projectsResult.error;

    setPortfolioFoundationCheck(
      portfolioCategoriesDot,
      portfolioCategoriesStatus,
      portfolioCategoriesCount,
      categoriesReady ? "ready" : "missing",
      categoriesReady ? "Ready" : "Migration required",
      categoriesReady ? `${categoriesResult.count ?? 0} categories` : "Table not available"
    );

    setPortfolioFoundationCheck(
      portfolioProjectsDot,
      portfolioProjectsStatus,
      portfolioProjectsCount,
      projectsReady ? "ready" : "missing",
      projectsReady ? "Ready" : "Migration required",
      projectsReady ? `${projectsResult.count ?? 0} projects` : "Table not available"
    );

    const ready = categoriesReady && projectsReady;
    portfolioFoundationState.textContent = ready ? "Foundation ready" : "Setup required";
    portfolioFoundationMessage.textContent = ready
      ? "Phase 3A data foundation is ready. No public project output has changed."
      : "Run supabase/migrations/010_portfolio_engine_foundation.sql in Supabase SQL Editor, then click Check again.";

    portfolioFoundationRefreshButton.disabled = false;
    return ready;
  };

  projectsNavButton?.addEventListener("click", async () => {
    showCmsView("portfolio-foundation");
    await checkPortfolioFoundation();
  });

  portfolioFoundationRefreshButton?.addEventListener("click", checkPortfolioFoundation);

  initMediaWorkflow({ supabaseClient, showCmsView });
  initProjectManager({ supabaseClient, showCmsView });

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
