const BADGE_PRESETS = Object.freeze([
  "Featured",
  "New",
  "Live",
  "Private",
  "Case Study",
  "Concept"
]);

const cleanTag = (value) =>
  String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 50);

const normalizeTags = (values) => {
  const source = Array.isArray(values)
    ? values
    : String(values || "").split(",");

  const seen = new Set();
  const output = [];

  source.forEach((value) => {
    const clean = cleanTag(value);
    const key = clean.toLowerCase();

    if (!clean || seen.has(key) || output.length >= 20) return;

    seen.add(key);
    output.push(clean);
  });

  return output;
};

export const initProjectMetadata = ({ supabaseClient, showCmsView }) => {
  const navButton = document.querySelector("#projectMetadataNavButton");
  const state = document.querySelector("#projectMetadataState");
  const message = document.querySelector("#projectMetadataMessage");
  const refreshButton = document.querySelector("#projectMetadataRefreshButton");
  const count = document.querySelector("#projectMetadataCount");
  const form = document.querySelector("#projectMetadataForm");
  const projectSelect = document.querySelector("#projectMetadataProject");
  const tagEditor = document.querySelector("#projectMetadataTagEditor");
  const tagList = document.querySelector("#projectMetadataTagList");
  const tagInput = document.querySelector("#projectMetadataTagInput");
  const badgeOptions = document.querySelector("#projectMetadataBadgeOptions");
  const saveButton = document.querySelector("#projectMetadataSaveButton");
  const formMessage = document.querySelector("#projectMetadataFormMessage");
  const previewStatus = document.querySelector("#projectMetadataPreviewStatus");
  const preview = document.querySelector("#projectMetadataPreview");

  if (
    !navButton ||
    !form ||
    !projectSelect ||
    !tagEditor ||
    !tagList ||
    !tagInput ||
    !badgeOptions ||
    !saveButton
  ) {
    return;
  }

  let projects = [];
  let categories = [];
  let currentTags = [];
  let busy = false;

  const setState = (value) => {
    if (state) state.textContent = value;
  };

  const setMessage = (value = "") => {
    if (message) message.textContent = value;
  };

  const setFormMessage = (value = "") => {
    if (formMessage) formMessage.textContent = value;
  };

  const categoryName = (id) =>
    categories.find((item) => item.id === id)?.name || "Uncategorized";

  const getSelectedProject = () =>
    projects.find((project) => project.id === projectSelect.value) || null;

  const getSelectedBadges = () =>
    [...badgeOptions.querySelectorAll('input[type="checkbox"]:checked')]
      .map((input) => input.value)
      .filter((value) => BADGE_PRESETS.includes(value));

  const renderTagEditor = () => {
    tagList.replaceChildren();

    currentTags.forEach((tag) => {
      const chip = document.createElement("span");
      chip.className = "metadata-tag-chip";

      const label = document.createElement("span");
      label.textContent = tag;

      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "×";
      remove.setAttribute("aria-label", "Remove tag " + tag);
      remove.disabled = busy || !projectSelect.value;

      remove.addEventListener("click", () => {
        currentTags = currentTags.filter(
          (item) => item.toLowerCase() !== tag.toLowerCase()
        );
        setFormMessage("Tag removed. Save metadata when ready.");
        renderTagEditor();
        renderPreview();
        tagInput.focus();
      });

      chip.append(label, remove);
      tagList.appendChild(chip);
    });

    tagEditor.classList.toggle("has-tags", currentTags.length > 0);
  };

  const setBusy = (isBusy) => {
    busy = isBusy;

    refreshButton.disabled = isBusy;
    projectSelect.disabled = isBusy;

    const noProject = !projectSelect.value;
    tagInput.disabled = isBusy || noProject;

    badgeOptions.querySelectorAll("input").forEach((input) => {
      input.disabled = isBusy || noProject;
    });

    saveButton.disabled = isBusy || noProject;

    tagList.querySelectorAll("button").forEach((button) => {
      button.disabled = isBusy || noProject;
    });
  };

  const renderPreview = () => {
    preview.innerHTML = "";
    const project = getSelectedProject();

    if (!project) {
      previewStatus.textContent = "No project selected";
      const empty = document.createElement("div");
      empty.className = "manager-empty";
      empty.textContent = "Select a project to preview its tags and badges.";
      preview.appendChild(empty);
      return;
    }

    const badges = getSelectedBadges();

    previewStatus.textContent =
      (project.is_published ? "Published" : "Draft") +
      " · " +
      (project.visibility === "private" ? "Private" : "Public");

    const card = document.createElement("article");
    card.className = "project-metadata-preview-card";

    const top = document.createElement("div");
    top.className = "project-metadata-preview-top";

    const copy = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = project.title;

    const meta = document.createElement("small");
    meta.textContent = categoryName(project.category_id) + " · " + project.slug;

    copy.append(title, meta);
    top.appendChild(copy);

    const badgeRow = document.createElement("div");
    badgeRow.className = "project-metadata-chip-row badges";

    if (badges.length) {
      badges.forEach((badge) => {
        const chip = document.createElement("span");
        chip.textContent = badge;
        badgeRow.appendChild(chip);
      });
    } else {
      const emptyBadge = document.createElement("span");
      emptyBadge.className = "muted-chip";
      emptyBadge.textContent = "No badges";
      badgeRow.appendChild(emptyBadge);
    }

    const tagRow = document.createElement("div");
    tagRow.className = "project-metadata-chip-row";

    if (currentTags.length) {
      currentTags.forEach((tag) => {
        const chip = document.createElement("span");
        chip.textContent = tag;
        tagRow.appendChild(chip);
      });
    } else {
      const emptyTag = document.createElement("span");
      emptyTag.className = "muted-chip";
      emptyTag.textContent = "No tags";
      tagRow.appendChild(emptyTag);
    }

    card.append(top, badgeRow, tagRow);
    preview.appendChild(card);
  };

  const addTags = (rawValue) => {
    const incoming = normalizeTags(String(rawValue || "").split(","));

    if (!incoming.length) {
      tagInput.value = "";
      return;
    }

    const before = currentTags.length;
    const existing = new Set(currentTags.map((tag) => tag.toLowerCase()));

    incoming.forEach((tag) => {
      const key = tag.toLowerCase();
      if (existing.has(key) || currentTags.length >= 20) return;
      existing.add(key);
      currentTags.push(tag);
    });

    tagInput.value = "";

    if (currentTags.length === before) {
      setFormMessage(
        currentTags.length >= 20
          ? "Maximum 20 tags reached."
          : "That tag already exists."
      );
    } else {
      setFormMessage("Tag added. Save metadata when ready.");
    }

    renderTagEditor();
    renderPreview();
    setBusy(false);
  };

  const populateProjectForm = () => {
    const project = getSelectedProject();
    tagInput.value = "";

    if (!project) {
      currentTags = [];
      badgeOptions.querySelectorAll("input").forEach((input) => {
        input.checked = false;
      });

      setFormMessage("");
      renderTagEditor();
      renderPreview();
      setBusy(false);
      return;
    }

    currentTags = normalizeTags(project.tags || []);

    const projectBadges = new Set(
      Array.isArray(project.badges) ? project.badges : []
    );

    badgeOptions.querySelectorAll("input").forEach((input) => {
      input.checked = projectBadges.has(input.value);
    });

    setFormMessage("Editing metadata for " + project.title + ".");
    renderTagEditor();
    renderPreview();
    setBusy(false);
  };

  const renderProjectSelect = () => {
    const current = projectSelect.value;
    projectSelect.innerHTML = "";

    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = "Select a project";
    projectSelect.appendChild(empty);

    projects.forEach((project) => {
      const option = document.createElement("option");
      option.value = project.id;
      option.textContent =
        project.title +
        " · " +
        (project.is_published ? "Published" : "Draft") +
        " · " +
        (project.visibility === "private" ? "Private" : "Public");
      projectSelect.appendChild(option);
    });

    if (
      [...projectSelect.options].some((option) => option.value === current)
    ) {
      projectSelect.value = current;
    }
  };

  const loadData = async () => {
    setBusy(true);
    setState("Loading…");
    setMessage("Loading project metadata…");

    try {
      const [categoryResult, projectResult] = await Promise.all([
        supabaseClient
          .from("portfolio_categories")
          .select("id,name,slug,is_active")
          .order("name", { ascending: true }),
        supabaseClient
          .from("portfolio_projects")
          .select(
            "id,slug,title,summary,category_id,tags,badges,visibility,is_published,show_on_homepage,is_featured,updated_at"
          )
          .order("updated_at", { ascending: false })
      ]);

      if (categoryResult.error) throw categoryResult.error;
      if (projectResult.error) throw projectResult.error;

      categories = categoryResult.data || [];
      projects = projectResult.data || [];

      if (count) {
        count.textContent =
          projects.length + (projects.length === 1 ? " project" : " projects");
      }

      renderProjectSelect();
      populateProjectForm();

      setState("Metadata ready");
      setMessage(
        projects.length +
          (projects.length === 1 ? " project loaded." : " projects loaded.")
      );

      return true;
    } catch (error) {
      console.error("Project metadata load failed:", error);
      setState("Load failed");
      setMessage(error?.message || "Could not load project metadata.");
      return false;
    } finally {
      setBusy(false);
      renderTagEditor();
    }
  };

  projectSelect.addEventListener("change", populateProjectForm);

  tagEditor.addEventListener("click", (event) => {
    if (event.target === tagEditor || event.target === tagList) {
      tagInput.focus();
    }
  });

  tagInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTags(tagInput.value);
      return;
    }

    if (
      event.key === "Backspace" &&
      !tagInput.value &&
      currentTags.length
    ) {
      const removed = currentTags.pop();
      setFormMessage("Removed " + removed + ". Save metadata when ready.");
      renderTagEditor();
      renderPreview();
    }
  });

  tagInput.addEventListener("blur", () => {
    if (tagInput.value.trim()) {
      addTags(tagInput.value);
    }
  });

  tagInput.addEventListener("paste", (event) => {
    const pasted = event.clipboardData?.getData("text") || "";
    if (!pasted.includes(",")) return;

    event.preventDefault();
    addTags(pasted);
  });

  badgeOptions.addEventListener("change", () => {
    setFormMessage("Badge selection changed. Save metadata when ready.");
    renderPreview();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const project = getSelectedProject();

    if (!project) {
      setFormMessage("Select a project first.");
      return;
    }

    if (tagInput.value.trim()) {
      addTags(tagInput.value);
    }

    const tags = normalizeTags(currentTags);
    const badges = getSelectedBadges();

    setBusy(true);
    saveButton.textContent = "Saving…";
    setFormMessage("Saving project metadata…");

    try {
      const result = await supabaseClient
        .from("portfolio_projects")
        .update({ tags, badges })
        .eq("id", project.id)
        .select("id,tags,badges,updated_at")
        .single();

      if (result.error) throw result.error;

      project.tags = normalizeTags(result.data.tags || []);
      project.badges = Array.isArray(result.data.badges)
        ? result.data.badges
        : [];
      project.updated_at = result.data.updated_at;

      currentTags = [...project.tags];

      const savedBadges = new Set(project.badges);
      badgeOptions.querySelectorAll("input").forEach((input) => {
        input.checked = savedBadges.has(input.value);
      });

      setFormMessage("Project tags and badges saved.");
      renderTagEditor();
      renderPreview();
    } catch (error) {
      console.error("Project metadata save failed:", error);
      setFormMessage(error?.message || "Could not save project metadata.");
    } finally {
      saveButton.textContent = "Save metadata";
      setBusy(false);
      renderTagEditor();
    }
  });

  refreshButton.addEventListener("click", loadData);

  navButton.addEventListener("click", async () => {
    showCmsView("project-metadata");
    await loadData();
  });

  renderTagEditor();
  renderPreview();
  setBusy(false);
};
