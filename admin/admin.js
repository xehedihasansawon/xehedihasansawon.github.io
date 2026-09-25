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
const dashboard = document.querySelector("#dashboard");
const homepageEditor = document.querySelector("#homepageEditor");
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

  const setEditorBusy = (busy) => {
    [heroPreviewButton, heroSaveButton, heroPublishButton].forEach((button) => {
      if (button) button.disabled = busy;
    });
  };

  const isSafeCmsHref = (value) => {
    const href = String(value || "").trim();
    if (!href) return false;
    if (href.startsWith("#") || href.startsWith("/") || href.startsWith("./") || href.startsWith("../")) return true;

    try {
      const url = new URL(href);
      return ["https:", "http:", "mailto:", "tel:"].includes(url.protocol);
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

  const populateHeroForm = (data = {}) => {
    const content = { ...heroDefaults, ...data };

    Object.entries(content).forEach(([key, value]) => {
      const field = heroField(key);
      if (field) field.value = value ?? "";
    });

    heroLastLoadedDraft = structuredClone(content);
    heroFormDirty = false;
    setHeroEditorState("Draft loaded");
  };

  const resolvePreviewImage = (src) => {
    if (/^https:\/\//i.test(src)) return src;
    try {
      return new URL("../" + src.replace(/^\.\//, ""), window.location.href).href;
    } catch {
      return "";
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
    const isHero = view === "hero";

    dashboard.hidden = isHero;
    homepageEditor.hidden = !isHero;

    dashboardNavLink?.classList.toggle("active", !isHero);
    homepageNavButton?.classList.toggle("active", isHero);

    if (isHero) {
      dashboardNavLink?.removeAttribute("aria-current");
      homepageNavButton?.setAttribute("aria-current", "page");
      cmsPageEyebrow.textContent = "HOMEPAGE CMS";
      cmsPageTitle.textContent = "Hero";
    } else {
      homepageNavButton?.removeAttribute("aria-current");
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

  heroEditorForm?.addEventListener("input", () => {
    heroFormDirty = true;
    setHeroEditorState("Unsaved changes");
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
      setHeroEditorMessage("Draft saved. The public Hero has not changed.");
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
      setHeroEditorMessage("Hero published successfully. Local/public pages now read this published version.");
    } catch (error) {
      console.error("Hero publish failed:", error);
      setHeroEditorState("Publish failed");
      setHeroEditorMessage(error?.message || "Could not publish the Hero.");
    } finally {
      setEditorBusy(false);
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
