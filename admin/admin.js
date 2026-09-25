import { ADMIN_CONFIG } from "./config.js";

const configPanel = document.querySelector("#configPanel");
const loginPanel = document.querySelector("#loginPanel");
const adminPanel = document.querySelector("#adminPanel");
const loginForm = document.querySelector("#loginForm");
const loginButton = document.querySelector("#loginButton");
const logoutButton = document.querySelector("#logoutButton");
const loginMessage = document.querySelector("#loginMessage");
const adminMessage = document.querySelector("#adminMessage");
const emailDisplay = document.querySelector("#adminEmailDisplay");

const isPlaceholder = (value) =>
  !value ||
  value.startsWith("YOUR_") ||
  value.includes("example.supabase.co");

const hasValidConfig =
  !isPlaceholder(ADMIN_CONFIG.supabaseUrl) &&
  !isPlaceholder(ADMIN_CONFIG.supabaseAnonKey);

const showOnly = (panel) => {
  [configPanel, loginPanel, adminPanel].forEach((item) => {
    item.hidden = item !== panel;
  });
};

const setLoginMessage = (message = "") => {
  loginMessage.textContent = message;
};

const setAdminMessage = (message = "") => {
  adminMessage.textContent = message;
};

const setLoginBusy = (busy) => {
  loginButton.disabled = busy;
  loginButton.textContent = busy ? "Checking access…" : "Sign in securely";
};

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
    emailDisplay.textContent = user.email || "Authenticated admin";
    setAdminMessage("");
    showOnly(adminPanel);
  };

  const enterLogin = (message = "") => {
    setLoginMessage(message);
    showOnly(loginPanel);
  };

  const guardSession = async (session) => {
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

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setLoginMessage("");

    const formData = new FormData(loginForm);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    if (!email || !password) {
      setLoginMessage("Enter both email and password.");
      return;
    }

    setLoginBusy(true);

    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (error || !data.session?.user) {
        setLoginMessage(error?.message || "Sign in failed.");
        return;
      }

      const membership = await checkAdminMembership(data.session.user);

      if (!membership.allowed) {
        await supabaseClient.auth.signOut();
        setLoginMessage(membership.reason);
        return;
      }

      loginForm.reset();
      enterAdmin(data.session.user);
    } catch (error) {
      console.error("Admin sign-in failed:", error);
      setLoginMessage("Could not reach the authentication service.");
    } finally {
      setLoginBusy(false);
    }
  });

  logoutButton.addEventListener("click", async () => {
    logoutButton.disabled = true;
    setAdminMessage("Signing out…");

    try {
      await supabaseClient.auth.signOut();
      enterLogin("Signed out securely.");
    } catch (error) {
      console.error("Admin sign-out failed:", error);
      setAdminMessage("Could not sign out. Please try again.");
    } finally {
      logoutButton.disabled = false;
    }
  });

  const { data: sessionData, error: sessionError } =
    await supabaseClient.auth.getSession();

  if (sessionError) {
    console.error("Session check failed:", sessionError);
    enterLogin("Could not verify the current session.");
  } else {
    await guardSession(sessionData.session);
  }

  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT") {
      enterLogin();
      return;
    }

    if (event === "SIGNED_IN" && session?.user && adminPanel.hidden) {
      guardSession(session);
    }
  });
}
