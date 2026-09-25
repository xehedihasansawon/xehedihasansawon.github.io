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
const dashboardNavLink = document.querySelector(".cms-nav .nav-item.active");
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
