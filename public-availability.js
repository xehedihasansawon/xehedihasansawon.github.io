import { ADMIN_CONFIG } from "./admin/config.js";

const VALID_STATUSES = new Set([
  "available",
  "limited",
  "busy",
  "unavailable"
]);

const byId = (id) => document.getElementById(id);

const applyAvailability = (row) => {
  const key = VALID_STATUSES.has(row?.status_key)
    ? row.status_key
    : "available";
  const text =
    typeof row?.status_text === "string" && row.status_text.trim()
      ? row.status_text.trim()
      : "Available for freelance & remote projects";

  document.documentElement.dataset.availabilityLoaded = "true";
  document.documentElement.dataset.availabilityStatus = key;

  const heroText = byId("heroStatusText");
  const heroWrap = heroText?.closest(".hero-v5-topline");
  if (heroText) heroText.textContent = text;
  if (heroWrap) heroWrap.dataset.availabilityStatus = key;

  const contact = byId("contactStatus");
  const contactText = byId("contactStatusText");
  if (contactText) contactText.textContent = text;
  if (contact) contact.dataset.availabilityStatus = key;
};

const loadAvailability = async () => {
  try {
    const endpoint = new URL(
      "/rest/v1/portfolio_availability",
      ADMIN_CONFIG.supabaseUrl
    );
    endpoint.searchParams.set("select", "status_key,status_text");
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
        `Availability request failed with status ${response.status}`
      );
    }

    const rows = await response.json();
    const row = Array.isArray(rows) ? rows[0] : null;
    if (row) applyAvailability(row);
  } catch (error) {
    console.warn(
      "Availability status unavailable; using existing Hero/Contact fallback.",
      error
    );
  }
};

loadAvailability();
