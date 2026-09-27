const BADGE_PRESETS = Object.freeze([
  "Featured",
  "New",
  "Live",
  "Private",
  "Case Study",
  "Concept"
]);

const normalizeTags = (value) => {
  const seen = new Set();
  const output = [];

  String(value || "")
    .split(",")
    .map((item) => item.trim().replace(/\s+/g, " "))
    .filter(Boolean)
    .forEach((item) => {
      const clean = item.slice(0, 50);
      const key = clean.toLowerCase();
      if (!key || seen.has(key)) return;
      seen.add(key);
      output.push(clean);
    });

  return output.slice(0, 20);
};

export const initProjectMetadata = ({ supabaseClient, showCmsView }) => {
  const navButton = document.querySelector("#projectMetadataNavButton");
  const state = document.querySelector("#projectMetadataState");
  const message = document.querySelector("#projectMetadataMessage");
  const refreshButton = document.querySelector("#projectMetadataRefreshButton");
  const count = document.querySelector("#projectMetadataCount");
  const form = document.querySelector("#projectMetadataForm");
  const projectSelect = document.querySelector("#projectMetadataProject");
  const tagsInput = document.querySelector("#projectMetadataTags");
  const badgeOptions = document.querySelector("#projectMetadataBadgeOptions");
  const saveButton = document.querySelector("#projectMetadataSaveButton");
  const formMessage = document.querySelector("#projectMetadataFormMessage");
  const previewStatus = document.querySelector("#projectMetadataPreviewStatus");
  const preview = document.querySelector("#projectMetadataPreview");

  if (!navButton || !form || !projectSelect || !badgeOptions || !saveButton) {
    return;
  }

  let projects = [];
  let categories = [];

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

  const setBusy = (busy) => {
    refreshButton.disabled = busy;
    projectSelect.disabled = busy;
    tagsInput.disabled = busy || !projectSelect.value;
    badgeOptions.querySelectorAll("input").forEach((input) => {
      input.disabled = busy || !projectSelect.value;
    });
    saveButton.disabled = busy || !projectSelect.value;
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

    const tags = normalizeTags(tagsInput.value);
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

    if (tags.length) {
      tags.forEach((tag) => {
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

  const populateProjectForm = () => {
    const project = getSelectedProject();

    if (!project) {
      tagsInput.value = "";
      badgeOptions.querySelectorAll("input").forEach((input) => {
        input.checked = false;
      });
      saveButton.disabled = true;
      setFormMessage("");
      renderPreview();
      return;
    }

    tagsInput.value = Array.isArray(project.tags) ? project.tags.join(", ") : "";

    const projectBadges = new Set(
      Array.isArray(project.badges) ? project.badges : []
    );

    badgeOptions.querySelectorAll("input").forEach((input) => {
      input.checked = projectBadges.has(input.value);
    });

    saveButton.disabled = false;
    tagsInput.disabled = false;
    badgeOptions.querySelectorAll("input").forEach((input) => {
      input.disabled = false;
    });

    setFormMessage("Editing metadata for " + project.title + ".");
    renderPreview();
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
          (projects.length === 1
            ? " project loaded."
            : " projects loaded.")
      );

      return true;
    } catch (error) {
      console.error("Project metadata load failed:", error);
      setState("Load failed");
      setMessage(error?.message || "Could not load project metadata.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  projectSelect.addEventListener("change", populateProjectForm);
  tagsInput.addEventListener("input", renderPreview);
  badgeOptions.addEventListener("change", renderPreview);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const project = getSelectedProject();

    if (!project) {
      setFormMessage("Select a project first.");
      return;
    }

    const tags = normalizeTags(tagsInput.value);
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

      project.tags = result.data.tags || [];
      project.badges = result.data.badges || [];
      project.updated_at = result.data.updated_at;

      tagsInput.value = project.tags.join(", ");
      setFormMessage("Project tags and badges saved.");
      renderPreview();
    } catch (error) {
      console.error("Project metadata save failed:", error);
      setFormMessage(error?.message || "Could not save project metadata.");
    } finally {
      saveButton.textContent = "Save metadata";
      setBusy(false);
    }
  });

  refreshButton.addEventListener("click", loadData);

  navButton.addEventListener("click", async () => {
    showCmsView("project-metadata");
    await loadData();
  });

  setBusy(false);
  renderPreview();
};
