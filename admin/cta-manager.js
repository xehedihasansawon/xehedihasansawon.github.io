const byId = (id) => document.getElementById(id);

const PRESETS = Object.freeze({
  project: {
    style_key: "accent",
    eyebrow: "READY WHEN YOU ARE",
    title: "Have a project in mind?",
    description:
      "Tell me what you are building and I will help shape the right creative or digital direction.",
    primary_label: "Start a project",
    primary_href: "#contact",
    primary_new_tab: false,
    secondary_enabled: true,
    secondary_label: "View selected work",
    secondary_href: "#work",
    secondary_new_tab: false
  },
  design: {
    style_key: "dark",
    eyebrow: "NEED CREATIVE SUPPORT?",
    title: "Let’s make the next idea look stronger.",
    description:
      "Branding, social content, sports graphics or video — send the brief and I’ll help turn it into a clear visual direction.",
    primary_label: "Discuss the project",
    primary_href: "#contact",
    primary_new_tab: false,
    secondary_enabled: true,
    secondary_label: "See design work",
    secondary_href: "#work",
    secondary_new_tab: false
  },
  inquiry: {
    style_key: "outline",
    eyebrow: "START WITH A SHORT BRIEF",
    title: "You don’t need a perfect brief to get started.",
    description:
      "Share the goal, timeline and what you need. I can help organize the next steps from there.",
    primary_label: "Send project inquiry",
    primary_href: "#inquiryForm",
    primary_new_tab: false,
    secondary_enabled: false,
    secondary_label: "View selected work",
    secondary_href: "#work",
    secondary_new_tab: false
  }
});

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

const VALID_STYLES = new Set(["accent", "dark", "outline"]);

export const initCtaManager = ({ supabaseClient, showCmsView }) => {
  const navButton = byId("ctaManagerNavButton");
  const editor = byId("ctaManagerEditor");
  const form = byId("ctaManagerForm");
  const state = byId("ctaManagerState");
  const message = byId("ctaManagerMessage");
  const refreshButton = byId("ctaManagerRefreshButton");
  const saveButton = byId("ctaManagerSaveButton");
  const enabledInput = byId("ctaEnabled");
  const styleInput = byId("ctaStyleKey");
  const eyebrowInput = byId("ctaEyebrow");
  const titleInput = byId("ctaTitle");
  const descriptionInput = byId("ctaDescription");
  const primaryLabelInput = byId("ctaPrimaryLabel");
  const primaryHrefInput = byId("ctaPrimaryHref");
  const primaryNewTabInput = byId("ctaPrimaryNewTab");
  const secondaryEnabledInput = byId("ctaSecondaryEnabled");
  const secondaryLabelInput = byId("ctaSecondaryLabel");
  const secondaryHrefInput = byId("ctaSecondaryHref");
  const secondaryNewTabInput = byId("ctaSecondaryNewTab");
  const updatedAt = byId("ctaUpdatedAt");
  const preview = byId("ctaManagerPreview");
  const previewEyebrow = byId("ctaPreviewEyebrow");
  const previewTitle = byId("ctaPreviewTitle");
  const previewDescription = byId("ctaPreviewDescription");
  const previewPrimary = byId("ctaPreviewPrimary");
  const previewSecondary = byId("ctaPreviewSecondary");
  const previewVisibility = byId("ctaPreviewVisibility");
  const presetButtons = [
    ...document.querySelectorAll("[data-cta-preset]")
  ];

  if (
    !navButton ||
    !editor ||
    !form ||
    !state ||
    !refreshButton ||
    !saveButton ||
    !enabledInput ||
    !styleInput ||
    !eyebrowInput ||
    !titleInput ||
    !descriptionInput ||
    !primaryLabelInput ||
    !primaryHrefInput ||
    !primaryNewTabInput ||
    !secondaryEnabledInput ||
    !secondaryLabelInput ||
    !secondaryHrefInput ||
    !secondaryNewTabInput ||
    !preview ||
    !previewEyebrow ||
    !previewTitle ||
    !previewDescription ||
    !previewPrimary ||
    !previewSecondary ||
    !previewVisibility
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
    presetButtons.forEach((button) => {
      button.disabled = value;
    });
    saveButton.textContent = value ? "Saving…" : "Save live CTA";
  };

  const readForm = () => ({
    enabled: Boolean(enabledInput.checked),
    style_key: styleInput.value,
    eyebrow: clean(eyebrowInput.value),
    title: clean(titleInput.value),
    description: clean(descriptionInput.value),
    primary_label: clean(primaryLabelInput.value),
    primary_href: clean(primaryHrefInput.value),
    primary_new_tab: Boolean(primaryNewTabInput.checked),
    secondary_enabled: Boolean(secondaryEnabledInput.checked),
    secondary_label: clean(secondaryLabelInput.value),
    secondary_href: clean(secondaryHrefInput.value),
    secondary_new_tab: Boolean(secondaryNewTabInput.checked)
  });

  const validate = (data) => {
    if (!VALID_STYLES.has(data.style_key)) return "Choose a valid CTA style.";
    if (!data.eyebrow || data.eyebrow.length > 80) {
      return "Eyebrow is required and must be 80 characters or less.";
    }
    if (!data.title || data.title.length > 140) {
      return "Title is required and must be 140 characters or less.";
    }
    if (!data.description || data.description.length > 320) {
      return "Description is required and must be 320 characters or less.";
    }
    if (!data.primary_label || data.primary_label.length > 50) {
      return "Primary button label is required and must be 50 characters or less.";
    }
    if (!isSafeHref(data.primary_href)) {
      return "Primary button link is missing or unsafe.";
    }
    if (data.secondary_enabled) {
      if (!data.secondary_label || data.secondary_label.length > 50) {
        return "Secondary button label is required when the button is enabled.";
      }
      if (!isSafeHref(data.secondary_href)) {
        return "Secondary button link is missing or unsafe.";
      }
    }
    return "";
  };

  const render = () => {
    const data = readForm();

    preview.dataset.style = VALID_STYLES.has(data.style_key)
      ? data.style_key
      : "accent";
    preview.dataset.enabled = String(data.enabled);

    previewEyebrow.textContent = data.eyebrow || "CTA EYEBROW";
    previewTitle.textContent = data.title || "Custom CTA title";
    previewDescription.textContent =
      data.description || "Your CTA description will appear here.";
    previewPrimary.textContent = data.primary_label || "Primary action";
    previewPrimary.setAttribute(
      "href",
      isSafeHref(data.primary_href) ? data.primary_href : "#"
    );

    previewSecondary.hidden = !data.secondary_enabled;
    previewSecondary.textContent =
      data.secondary_label || "Secondary action";
    previewSecondary.setAttribute(
      "href",
      isSafeHref(data.secondary_href) ? data.secondary_href : "#"
    );

    previewVisibility.textContent = data.enabled
      ? "PUBLIC CTA · ON"
      : "PUBLIC CTA · OFF";

    secondaryLabelInput.disabled = !data.secondary_enabled;
    secondaryHrefInput.disabled = !data.secondary_enabled;
    secondaryNewTabInput.disabled = !data.secondary_enabled;

    presetButtons.forEach((button) => {
      const key = button.dataset.ctaPreset;
      button.classList.toggle("active", false);
      button.setAttribute("aria-pressed", "false");

      const preset = PRESETS[key];
      if (!preset) return;

      const matches =
        data.style_key === preset.style_key &&
        data.eyebrow === preset.eyebrow &&
        data.title === preset.title &&
        data.description === preset.description &&
        data.primary_label === preset.primary_label &&
        data.primary_href === preset.primary_href &&
        data.secondary_enabled === preset.secondary_enabled &&
        data.secondary_label === preset.secondary_label &&
        data.secondary_href === preset.secondary_href;

      if (matches) {
        button.classList.add("active");
        button.setAttribute("aria-pressed", "true");
      }
    });
  };

  const populate = (row) => {
    enabledInput.checked = Boolean(row?.enabled);
    styleInput.value = VALID_STYLES.has(row?.style_key)
      ? row.style_key
      : "accent";
    eyebrowInput.value = clean(row?.eyebrow) || PRESETS.project.eyebrow;
    titleInput.value = clean(row?.title) || PRESETS.project.title;
    descriptionInput.value =
      clean(row?.description) || PRESETS.project.description;
    primaryLabelInput.value =
      clean(row?.primary_label) || PRESETS.project.primary_label;
    primaryHrefInput.value =
      clean(row?.primary_href) || PRESETS.project.primary_href;
    primaryNewTabInput.checked = Boolean(row?.primary_new_tab);
    secondaryEnabledInput.checked =
      row?.secondary_enabled !== false;
    secondaryLabelInput.value =
      clean(row?.secondary_label) || PRESETS.project.secondary_label;
    secondaryHrefInput.value =
      clean(row?.secondary_href) || PRESETS.project.secondary_href;
    secondaryNewTabInput.checked = Boolean(row?.secondary_new_tab);

    if (updatedAt) {
      updatedAt.value = row?.updated_at
        ? new Date(row.updated_at).toLocaleString()
        : "—";
    }

    render();
  };

  const load = async () => {
    setBusy(true);
    setState("Loading…");
    setMessage("Loading live CTA…");

    try {
      const { data, error } = await supabaseClient
        .from("portfolio_custom_cta")
        .select(
          "id,enabled,style_key,eyebrow,title,description,primary_label,primary_href,primary_new_tab,secondary_enabled,secondary_label,secondary_href,secondary_new_tab,updated_at"
        )
        .eq("id", 1)
        .maybeSingle();

      if (error) {
        if (/portfolio_custom_cta/i.test(error.message || "")) {
          throw new Error(
            "Custom CTA table is missing. Run migration 023_custom_cta_manager.sql first."
          );
        }
        throw error;
      }

      if (!data) {
        throw new Error(
          "Custom CTA row is missing. Re-run migration 023_custom_cta_manager.sql."
        );
      }

      populate(data);
      setState(data.enabled ? "Live · CTA on" : "Live · CTA off");
      setMessage(
        data.enabled
          ? "Custom CTA is currently visible on the public portfolio."
          : "Custom CTA is currently hidden from the public portfolio."
      );
      return true;
    } catch (error) {
      console.error("Custom CTA load failed:", error);
      setState("Setup required");
      setMessage(error?.message || "Could not load Custom CTA.");
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
    setMessage("Updating live Custom CTA…");

    try {
      const { data, error } = await supabaseClient
        .from("portfolio_custom_cta")
        .update(payload)
        .eq("id", 1)
        .select(
          "id,enabled,style_key,eyebrow,title,description,primary_label,primary_href,primary_new_tab,secondary_enabled,secondary_label,secondary_href,secondary_new_tab,updated_at"
        )
        .single();

      if (error) throw error;

      populate(data);
      setState(data.enabled ? "Saved · CTA on" : "Saved · CTA off");
      setMessage(
        data.enabled
          ? "Saved. The public Custom CTA is now live."
          : "Saved. The Custom CTA is hidden from the public portfolio."
      );
      return true;
    } catch (error) {
      console.error("Custom CTA save failed:", error);
      setState("Save failed");
      setMessage(error?.message || "Could not save Custom CTA.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  navButton.addEventListener("click", async () => {
    showCmsView("custom-cta");
    await load();
  });

  refreshButton.addEventListener("click", load);

  presetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const preset = PRESETS[button.dataset.ctaPreset];
      if (!preset) return;

      styleInput.value = preset.style_key;
      eyebrowInput.value = preset.eyebrow;
      titleInput.value = preset.title;
      descriptionInput.value = preset.description;
      primaryLabelInput.value = preset.primary_label;
      primaryHrefInput.value = preset.primary_href;
      primaryNewTabInput.checked = preset.primary_new_tab;
      secondaryEnabledInput.checked = preset.secondary_enabled;
      secondaryLabelInput.value = preset.secondary_label;
      secondaryHrefInput.value = preset.secondary_href;
      secondaryNewTabInput.checked = preset.secondary_new_tab;

      setState("Unsaved changes");
      setMessage("Preset loaded. Edit anything you want, then save.");
      render();
    });
  });

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
