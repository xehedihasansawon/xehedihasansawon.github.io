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

export const initSystemStateManager = ({ supabaseClient, showCmsView }) => {
  const navButton = byId("systemStatesNavButton");
  const editor = byId("systemStatesEditor");
  const form = byId("systemStatesForm");
  const state = byId("systemStatesState");
  const message = byId("systemStatesMessage");
  const refreshButton = byId("systemStatesRefreshButton");
  const saveButton = byId("systemStatesSaveButton");
  const enabledInput = byId("maintenanceEnabled");
  const eyebrowInput = byId("maintenanceEyebrow");
  const titleInput = byId("maintenanceTitle");
  const messageInput = byId("maintenanceMessage");
  const buttonLabelInput = byId("maintenanceButtonLabel");
  const buttonHrefInput = byId("maintenanceButtonHref");
  const updatedAtInput = byId("systemStatesUpdatedAt");
  const preview = byId("maintenanceAdminPreview");
  const previewEyebrow = byId("maintenancePreviewEyebrow");
  const previewTitle = byId("maintenancePreviewTitle");
  const previewMessage = byId("maintenancePreviewMessage");
  const previewButton = byId("maintenancePreviewButton");
  const previewStatus = byId("maintenancePreviewStatus");

  if (
    !navButton ||
    !editor ||
    !form ||
    !state ||
    !refreshButton ||
    !saveButton ||
    !enabledInput ||
    !eyebrowInput ||
    !titleInput ||
    !messageInput ||
    !buttonLabelInput ||
    !buttonHrefInput ||
    !preview ||
    !previewEyebrow ||
    !previewTitle ||
    !previewMessage ||
    !previewButton ||
    !previewStatus
  ) {
    return;
  }

  let busy = false;

  const setState = (value) => {
    state.textContent = value;
  };

  const setMessage = (value = "") => {
    if (message) message.textContent = value;
  };

  const setBusy = (value) => {
    busy = value;
    saveButton.disabled = value;
    refreshButton.disabled = value;
    saveButton.textContent = value ? "Saving…" : "Save system state";
  };

  const readForm = () => ({
    maintenance_enabled: Boolean(enabledInput.checked),
    maintenance_eyebrow: clean(eyebrowInput.value),
    maintenance_title: clean(titleInput.value),
    maintenance_message: clean(messageInput.value),
    maintenance_button_label: clean(buttonLabelInput.value),
    maintenance_button_href: clean(buttonHrefInput.value)
  });

  const validate = (data) => {
    if (
      !data.maintenance_eyebrow ||
      data.maintenance_eyebrow.length > 80
    ) {
      return "Maintenance eyebrow is required and must be 80 characters or less.";
    }

    if (
      !data.maintenance_title ||
      data.maintenance_title.length > 140
    ) {
      return "Maintenance title is required and must be 140 characters or less.";
    }

    if (
      !data.maintenance_message ||
      data.maintenance_message.length > 320
    ) {
      return "Maintenance message is required and must be 320 characters or less.";
    }

    if (
      !data.maintenance_button_label ||
      data.maintenance_button_label.length > 50
    ) {
      return "Button label is required and must be 50 characters or less.";
    }

    if (!isSafeHref(data.maintenance_button_href)) {
      return "Maintenance button link is missing or unsafe.";
    }

    return "";
  };

  const render = () => {
    const data = readForm();

    preview.dataset.enabled = String(data.maintenance_enabled);
    previewEyebrow.textContent =
      data.maintenance_eyebrow || "PORTFOLIO UPDATE";
    previewTitle.textContent =
      data.maintenance_title || "A short maintenance break.";
    previewMessage.textContent =
      data.maintenance_message ||
      "I am making a few updates to the portfolio. Please check back shortly.";
    previewButton.textContent =
      (data.maintenance_button_label || "Back to home") + " →";
    previewButton.setAttribute(
      "href",
      isSafeHref(data.maintenance_button_href)
        ? data.maintenance_button_href
        : "#"
    );
    previewStatus.textContent = data.maintenance_enabled
      ? "PUBLIC SITE · MAINTENANCE ON"
      : "PUBLIC SITE · NORMAL";
  };

  const populate = (row) => {
    enabledInput.checked = Boolean(row?.maintenance_enabled);
    eyebrowInput.value =
      clean(row?.maintenance_eyebrow) || "PORTFOLIO UPDATE";
    titleInput.value =
      clean(row?.maintenance_title) || "A short maintenance break.";
    messageInput.value =
      clean(row?.maintenance_message) ||
      "I am making a few updates to the portfolio. Please check back shortly.";
    buttonLabelInput.value =
      clean(row?.maintenance_button_label) || "Back to home";
    buttonHrefInput.value =
      clean(row?.maintenance_button_href) || "index.html";

    if (updatedAtInput) {
      updatedAtInput.value = row?.updated_at
        ? new Date(row.updated_at).toLocaleString()
        : "—";
    }

    render();
  };

  const load = async () => {
    setBusy(true);
    setState("Loading…");
    setMessage("Loading system state…");

    try {
      const { data, error } = await supabaseClient
        .from("portfolio_system_state")
        .select(
          "id,maintenance_enabled,maintenance_eyebrow,maintenance_title,maintenance_message,maintenance_button_label,maintenance_button_href,updated_at"
        )
        .eq("id", 1)
        .maybeSingle();

      if (error) {
        if (/portfolio_system_state/i.test(error.message || "")) {
          throw new Error(
            "System state table is missing. Run migration 024_branded_system_states.sql first."
          );
        }
        throw error;
      }

      if (!data) {
        throw new Error(
          "System state row is missing. Re-run migration 024_branded_system_states.sql."
        );
      }

      populate(data);
      setState(
        data.maintenance_enabled
          ? "Live · Maintenance on"
          : "Live · Normal site"
      );
      setMessage(
        data.maintenance_enabled
          ? "Maintenance mode is active on public portfolio pages."
          : "Public portfolio is operating normally. 404 and branded empty states remain available."
      );
      return true;
    } catch (error) {
      console.error("System state load failed:", error);
      setState("Setup required");
      setMessage(error?.message || "Could not load system state.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    if (busy) return false;

    const payload = readForm();
    const validation = validate(payload);

    if (validation) {
      setState("Check fields");
      setMessage(validation);
      return false;
    }

    setBusy(true);
    setState("Saving…");
    setMessage("Updating public system state…");

    try {
      const { data, error } = await supabaseClient
        .from("portfolio_system_state")
        .update(payload)
        .eq("id", 1)
        .select(
          "id,maintenance_enabled,maintenance_eyebrow,maintenance_title,maintenance_message,maintenance_button_label,maintenance_button_href,updated_at"
        )
        .single();

      if (error) throw error;

      populate(data);
      setState(
        data.maintenance_enabled
          ? "Saved · Maintenance on"
          : "Saved · Normal site"
      );
      setMessage(
        data.maintenance_enabled
          ? "Saved. Public portfolio pages now show the maintenance screen."
          : "Saved. Public portfolio pages are visible normally."
      );
      return true;
    } catch (error) {
      console.error("System state save failed:", error);
      setState("Save failed");
      setMessage(error?.message || "Could not save system state.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  navButton.addEventListener("click", async () => {
    showCmsView("system-states");
    await load();
  });

  refreshButton.addEventListener("click", load);

  form.addEventListener("input", () => {
    setState("Unsaved changes");
    render();
  });

  form.addEventListener("change", () => {
    setState("Unsaved changes");
    render();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await save();
  });

  render();
};
