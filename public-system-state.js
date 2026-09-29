import { ADMIN_CONFIG } from "./admin/config.js";

const byId = (id) => document.getElementById(id);
const clean = (value) => String(value || "").trim();

const isSafeHref = (value) => {
  const href = clean(value);
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
    return ["https:", "http:", "mailto:", "tel:"].includes(
      new URL(href).protocol
    );
  } catch {
    try {
      const relative = new URL(href, window.location.origin + "/");
      return relative.origin === window.location.origin;
    } catch {
      return false;
    }
  }
};

const enhanceEmptyStates = () => {
  const explorerEmpty = byId("projectExplorerEmpty");
  if (explorerEmpty && explorerEmpty.dataset.phase5h !== "ready") {
    explorerEmpty.dataset.phase5h = "ready";
    explorerEmpty.classList.add("system-empty-state");

    const marker = document.createElement("span");
    marker.className = "system-empty-state-marker";
    marker.setAttribute("aria-hidden", "true");
    marker.textContent = "Mhs.";
    explorerEmpty.prepend(marker);
  }

  const caseError = byId("caseError");
  const caseErrorShell = caseError?.querySelector(".shell");
  if (caseErrorShell && caseErrorShell.dataset.phase5h !== "ready") {
    caseErrorShell.dataset.phase5h = "ready";
    caseErrorShell.classList.add("system-case-empty");

    const marker = document.createElement("span");
    marker.className = "system-empty-state-marker";
    marker.setAttribute("aria-hidden", "true");
    marker.textContent = "Mhs.";
    caseErrorShell.prepend(marker);
  }
};

const setUnderlyingPageInert = (maintenanceRoot) => {
  [...document.body.children].forEach((child) => {
    if (child === maintenanceRoot) return;
    child.setAttribute("aria-hidden", "true");
    if ("inert" in child) {
      child.inert = true;
    }
  });
};

const renderMaintenance = (row) => {
  if (!row?.maintenance_enabled || byId("portfolioMaintenanceScreen")) return;

  const eyebrow = clean(row.maintenance_eyebrow);
  const title = clean(row.maintenance_title);
  const message = clean(row.maintenance_message);
  const buttonLabel = clean(row.maintenance_button_label);
  const buttonHref = clean(row.maintenance_button_href);

  if (!eyebrow || !title || !message) return;

  const screen = document.createElement("main");
  screen.id = "portfolioMaintenanceScreen";
  screen.className = "portfolio-maintenance-screen";
  screen.setAttribute("role", "main");
  screen.setAttribute("aria-labelledby", "maintenanceTitle");

  const shell = document.createElement("section");
  shell.className = "portfolio-maintenance-card";

  const brand = document.createElement("span");
  brand.className = "portfolio-maintenance-brand";
  brand.textContent = "Mhs.";

  const eyebrowEl = document.createElement("p");
  eyebrowEl.className = "portfolio-maintenance-eyebrow";
  eyebrowEl.textContent = eyebrow;

  const titleEl = document.createElement("h1");
  titleEl.id = "maintenanceTitle";
  titleEl.textContent = title;

  const messageEl = document.createElement("p");
  messageEl.className = "portfolio-maintenance-message";
  messageEl.textContent = message;

  const meta = document.createElement("div");
  meta.className = "portfolio-maintenance-meta";
  meta.innerHTML =
    "<span>MD MEHEDI HASAN SAWON</span><span>Graphic Designer · Brand & Digital Projects</span>";

  shell.append(brand, eyebrowEl, titleEl, messageEl);

  if (buttonLabel && isSafeHref(buttonHref)) {
    const button = document.createElement("a");
    button.className = "portfolio-maintenance-button";
    button.href = buttonHref;
    button.textContent = buttonLabel + " →";
    shell.appendChild(button);
  }

  shell.appendChild(meta);
  screen.appendChild(shell);
  document.body.appendChild(screen);
  document.body.classList.add("maintenance-mode-active");
  document.documentElement.dataset.maintenanceMode = "on";
  document.title = "Portfolio Maintenance | MD Mehedi Hasan Sawon";
  setUnderlyingPageInert(screen);
  screen.focus?.();
};

const loadSystemState = async () => {
  try {
    if (!ADMIN_CONFIG?.supabaseUrl || !ADMIN_CONFIG?.supabaseAnonKey) return;

    const endpoint = new URL(
      "/rest/v1/portfolio_system_state",
      ADMIN_CONFIG.supabaseUrl
    );
    endpoint.searchParams.set(
      "select",
      "maintenance_enabled,maintenance_eyebrow,maintenance_title,maintenance_message,maintenance_button_label,maintenance_button_href"
    );
    endpoint.searchParams.set("id", "eq.1");
    endpoint.searchParams.set("limit", "1");

    const response = await fetch(endpoint, {
      headers: {
        apikey: ADMIN_CONFIG.supabaseAnonKey,
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(
        `System state request failed with status ${response.status}`
      );
    }

    const rows = await response.json();
    const row = Array.isArray(rows) ? rows[0] : null;

    if (row?.maintenance_enabled) {
      renderMaintenance(row);
    } else {
      document.documentElement.dataset.maintenanceMode = "off";
    }
  } catch (error) {
    document.documentElement.dataset.maintenanceMode = "unavailable";
    console.warn(
      "System state unavailable; public portfolio remains accessible.",
      error
    );
  }
};

enhanceEmptyStates();
loadSystemState();
