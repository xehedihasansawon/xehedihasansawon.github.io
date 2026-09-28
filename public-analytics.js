import { ADMIN_CONFIG } from "./admin/config.js";

const DO_NOT_TRACK =
  navigator.doNotTrack === "1" ||
  window.doNotTrack === "1";

const SESSION_KEY = "portfolio.analytics.session.v1";

const safePath = () =>
  String(window.location.pathname).slice(0, 500) || "/";

const validSlug = (value) =>
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(value || ""));

const makeUuid = () => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  if (!globalThis.crypto?.getRandomValues) return "";

  const bytes = new Uint8Array(16);
  globalThis.crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, "0"));
  return [
    hex.slice(0, 4).join(""),
    hex.slice(4, 6).join(""),
    hex.slice(6, 8).join(""),
    hex.slice(8, 10).join(""),
    hex.slice(10).join("")
  ].join("-");
};

const getSessionId = () => {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (/^[0-9a-f-]{36}$/i.test(existing || "")) return existing;

    const created = makeUuid();
    if (!created) return "";
    sessionStorage.setItem(SESSION_KEY, created);
    return created;
  } catch {
    return makeUuid();
  }
};

const sessionId = DO_NOT_TRACK ? "" : getSessionId();

const track = async ({
  eventType,
  eventKey = "",
  projectSlug = null
}) => {
  if (DO_NOT_TRACK || !sessionId) return;

  const cleanKey = String(eventKey || "").trim().slice(0, 160);
  const cleanSlug = validSlug(projectSlug) ? projectSlug : null;

  try {
    const endpoint = new URL(
      "/rest/v1/portfolio_analytics_events",
      ADMIN_CONFIG.supabaseUrl
    );

    await fetch(endpoint, {
      method: "POST",
      keepalive: true,
      headers: {
        apikey: ADMIN_CONFIG.supabaseAnonKey,
        Authorization: "Bearer " + ADMIN_CONFIG.supabaseAnonKey,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify({
        event_type: eventType,
        event_key: cleanKey,
        page_path: safePath(),
        project_slug: cleanSlug,
        session_id: sessionId
      })
    });
  } catch {
    // Analytics must never block or break the portfolio experience.
  }
};

const getPageKey = () => {
  const pathname = window.location.pathname.toLowerCase();
  if (pathname.endsWith("/project.html")) return "dynamic-project";
  if (pathname.endsWith("/ssfc.html")) return "ssfc";
  if (pathname.endsWith("/biporjoy.html")) return "biporjoy-18";
  if (pathname.endsWith("/index.html") || pathname.endsWith("/")) return "home";
  return pathname.split("/").pop() || "page";
};

const getProjectSlug = () => {
  const pathname = window.location.pathname.toLowerCase();

  if (pathname.endsWith("/project.html")) {
    const slug = new URLSearchParams(window.location.search)
      .get("slug")
      ?.trim()
      .toLowerCase();

    return validSlug(slug) ? slug : null;
  }

  if (pathname.endsWith("/ssfc.html")) return "ssfc";
  if (pathname.endsWith("/biporjoy.html")) return "biporjoy-18";

  return null;
};

track({
  eventType: "page_view",
  eventKey: getPageKey()
});

const projectSlug = getProjectSlug();
if (projectSlug) {
  track({
    eventType: "project_view",
    eventKey: projectSlug,
    projectSlug
  });
}

const CONTACT_IDS = {
  contactWhatsappLink: "whatsapp",
  contactEmailAction: "email_copy",
  contactCallLink: "call",
  contactFacebookLink: "facebook",
  contactInstagramLink: "instagram",
  contactLinkedinLink: "linkedin",
  contactGithubLink: "github",
  contactBehanceLink: "behance"
};

document.addEventListener(
  "click",
  (event) => {
    const target = event.target.closest?.(
      "#contactWhatsappLink,#contactEmailAction,#contactCallLink,#contactFacebookLink,#contactInstagramLink,#contactLinkedinLink,#contactGithubLink,#contactBehanceLink,[data-cms-footer-bottom],[data-cms-footer-profile],a[href^='mailto:']"
    );

    if (!target) return;

    let key = CONTACT_IDS[target.id] || "";

    if (!key && target.dataset.cmsFooterBottom) {
      key = "footer_" + target.dataset.cmsFooterBottom;
    }

    if (!key && target.dataset.cmsFooterProfile) {
      key = "footer_" + target.dataset.cmsFooterProfile;
    }

    if (!key && target.matches("a[href^='mailto:']")) {
      key = "email";
    }

    if (!key) return;

    track({
      eventType: "contact_click",
      eventKey: key
    });
  },
  true
);
