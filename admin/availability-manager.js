const byId = (id) => document.getElementById(id);

const PRESETS = Object.freeze({
  available: {
    label: "Available",
    text: "Available for freelance & remote projects"
  },
  limited: {
    label: "Limited",
    text: "Limited availability · Select projects only"
  },
  busy: {
    label: "Busy",
    text: "Currently booked · New projects by arrangement"
  },
  unavailable: {
    label: "Unavailable",
    text: "Not accepting new projects right now"
  }
});

const isStatusKey = (value) =>
  Object.prototype.hasOwnProperty.call(PRESETS, value);

export const initAvailabilityManager = ({ supabaseClient, showCmsView }) => {
  const navButton = byId("availabilityNavButton");
  const editor = byId("availabilityEditor");
  const state = byId("availabilityState");
  const message = byId("availabilityMessage");
  const form = byId("availabilityForm");
  const statusInput = byId("availabilityStatusKey");
  const textInput = byId("availabilityStatusText");
  const saveButton = byId("availabilitySaveButton");
  const refreshButton = byId("availabilityRefreshButton");
  const updatedAt = byId("availabilityUpdatedAt");
  const preview = byId("availabilityPreview");
  const previewDot = byId("availabilityPreviewDot");
  const previewText = byId("availabilityPreviewText");
  const presetButtons = [
    ...document.querySelectorAll("[data-availability-preset]")
  ];

  if (
    !navButton ||
    !editor ||
    !state ||
    !form ||
    !statusInput ||
    !textInput ||
    !saveButton ||
    !refreshButton ||
    !preview ||
    !previewDot ||
    !previewText
  ) {
    return;
  }

  let busy = false;

  const setMessage = (value = "") => {
    if (message) message.textContent = value;
  };

  const setState = (value) => {
    state.textContent = value;
  };

  const setBusy = (value) => {
    busy = value;
    saveButton.disabled = value;
    refreshButton.disabled = value;
    presetButtons.forEach((button) => {
      button.disabled = value;
    });
    saveButton.textContent = value ? "Saving…" : "Save live status";
  };

  const render = () => {
    const key = isStatusKey(statusInput.value)
      ? statusInput.value
      : "available";
    const text = textInput.value.trim() || PRESETS[key].text;

    preview.dataset.status = key;
    previewDot.dataset.status = key;
    previewText.textContent = text;

    presetButtons.forEach((button) => {
      const active = button.dataset.availabilityPreset === key;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  };

  const populate = (row) => {
    const key = isStatusKey(row?.status_key)
      ? row.status_key
      : "available";

    statusInput.value = key;
    textInput.value =
      typeof row?.status_text === "string" && row.status_text.trim()
        ? row.status_text.trim()
        : PRESETS[key].text;

    updatedAt.textContent = row?.updated_at
      ? new Date(row.updated_at).toLocaleString()
      : "—";

    render();
  };

  const load = async () => {
    setBusy(true);
    setState("Loading…");
    setMessage("Loading live availability status…");

    try {
      const { data, error } = await supabaseClient
        .from("portfolio_availability")
        .select("id,status_key,status_text,updated_at")
        .eq("id", 1)
        .maybeSingle();

      if (error) {
        if (/portfolio_availability/i.test(error.message || "")) {
          throw new Error(
            "Availability table is missing. Run migration 022_availability_status_control.sql first."
          );
        }
        throw error;
      }

      if (!data) {
        throw new Error(
          "Availability row is missing. Re-run migration 022_availability_status_control.sql."
        );
      }

      populate(data);
      setState("Live status loaded");
      setMessage(
        "This status controls both the Hero and Contact availability labels."
      );
      return true;
    } catch (error) {
      console.error("Availability load failed:", error);
      setState("Setup required");
      setMessage(error?.message || "Could not load availability status.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    if (busy) return false;

    const key = statusInput.value;
    const text = textInput.value.trim();

    if (!isStatusKey(key)) {
      setState("Check status");
      setMessage("Choose a valid availability status.");
      return false;
    }

    if (!text || text.length > 120) {
      setState("Check text");
      setMessage("Public status text is required and must be 120 characters or less.");
      return false;
    }

    setBusy(true);
    setState("Saving…");
    setMessage("Updating live availability…");

    try {
      const { data, error } = await supabaseClient
        .from("portfolio_availability")
        .update({
          status_key: key,
          status_text: text
        })
        .eq("id", 1)
        .select("id,status_key,status_text,updated_at")
        .single();

      if (error) throw error;

      populate(data);
      setState("Live · " + PRESETS[data.status_key].label);
      setMessage(
        "Saved. The public Hero and Contact status now use this availability."
      );
      return true;
    } catch (error) {
      console.error("Availability save failed:", error);
      setState("Save failed");
      setMessage(error?.message || "Could not save availability status.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  navButton.addEventListener("click", async () => {
    showCmsView("availability");
    await load();
  });

  refreshButton.addEventListener("click", load);

  presetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.availabilityPreset;
      if (!isStatusKey(key)) return;

      statusInput.value = key;
      textInput.value = PRESETS[key].text;
      setState("Unsaved changes");
      setMessage("Preset selected. Save to update the public portfolio.");
      render();
    });
  });

  statusInput.addEventListener("change", () => {
    const key = statusInput.value;
    if (isStatusKey(key)) textInput.value = PRESETS[key].text;
    setState("Unsaved changes");
    render();
  });

  textInput.addEventListener("input", () => {
    setState("Unsaved changes");
    render();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await save();
  });

  render();
};
