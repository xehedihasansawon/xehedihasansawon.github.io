const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const clean = (value) => String(value || "").trim();

const isSecureImageUrl = (value) => {
  const url = clean(value);
  return !url || /^https:\/\//i.test(url);
};

export const initSeoManager = ({ supabaseClient, showCmsView }) => {
  const navButton = document.querySelector("#seoNavButton");
  const editor = document.querySelector("#seoEditor");
  const state = document.querySelector("#seoState");
  const message = document.querySelector("#seoMessage");
  const refreshButton = document.querySelector("#seoRefreshButton");
  const form = document.querySelector("#seoForm");
  const projectSelect = document.querySelector("#seoProjectSelect");
  const projectState = document.querySelector("#seoProjectState");
  const slugInput = document.querySelector("#seoProjectSlug");
  const coverAltInput = document.querySelector("#seoCoverAlt");
  const titleInput = document.querySelector("#seoTitle");
  const descriptionInput = document.querySelector("#seoDescription");
  const socialImageInput = document.querySelector("#seoSocialImageUrl");
  const socialAltInput = document.querySelector("#seoSocialImageAlt");
  const saveButton = document.querySelector("#seoSaveButton");
  const previewTitle = document.querySelector("#seoPreviewTitle");
  const previewDescription = document.querySelector("#seoPreviewDescription");
  const previewUrl = document.querySelector("#seoPreviewUrl");
  const previewImage = document.querySelector("#seoPreviewImage");
  const previewImageEmpty = document.querySelector("#seoPreviewImageEmpty");

  if (
    !navButton ||
    !editor ||
    !form ||
    !projectSelect ||
    !slugInput ||
    !coverAltInput ||
    !titleInput ||
    !descriptionInput ||
    !socialImageInput ||
    !socialAltInput ||
    !saveButton
  ) {
    return;
  }

  let projects = [];
  let seoByProject = new Map();
  let busy = false;

  const setState = (value) => {
    if (state) state.textContent = value;
  };

  const setMessage = (value = "") => {
    if (message) message.textContent = value;
  };

  const setBusy = (value) => {
    busy = value;
    projectSelect.disabled = value;
    refreshButton.disabled = value;
    saveButton.disabled = value || !projectSelect.value;
  };

  const currentProject = () =>
    projects.find((project) => project.id === projectSelect.value) || null;

  const currentSeo = () =>
    seoByProject.get(projectSelect.value) || null;

  const fallbackTitle = (project) =>
    project ? project.title + " Case Study | MD Mehedi Hasan Sawon" : "";

  const fallbackDescription = (project) =>
    clean(project?.summary) || "Project case study by MD Mehedi Hasan Sawon.";

  const renderPreview = () => {
    const project = currentProject();
    if (!project) {
      if (previewTitle) previewTitle.textContent = "Select a project";
      if (previewDescription) previewDescription.textContent = "SEO preview will appear here.";
      if (previewUrl) previewUrl.textContent = "";
      if (previewImage) {
        previewImage.hidden = true;
        previewImage.removeAttribute("src");
      }
      if (previewImageEmpty) previewImageEmpty.hidden = false;
      return;
    }

    const slug = clean(slugInput.value) || project.slug;
    const title = clean(titleInput.value) || fallbackTitle(project);
    const description =
      clean(descriptionInput.value) || fallbackDescription(project);
    const imageUrl = clean(socialImageInput.value) || clean(project.cover_image_url);

    if (previewTitle) previewTitle.textContent = title;
    if (previewDescription) previewDescription.textContent = description;
    if (previewUrl) {
      previewUrl.textContent =
        "xehedihasansawon.github.io/project.html?slug=" + slug;
    }

    if (previewImage && imageUrl) {
      previewImage.src = imageUrl;
      previewImage.alt =
        clean(socialAltInput.value) ||
        clean(coverAltInput.value) ||
        project.title ||
        "Project preview";
      previewImage.hidden = false;
      if (previewImageEmpty) previewImageEmpty.hidden = true;
    } else if (previewImage) {
      previewImage.hidden = true;
      previewImage.removeAttribute("src");
      if (previewImageEmpty) previewImageEmpty.hidden = false;
    }
  };

  const clearForm = () => {
    form.reset();
    projectSelect.value = "";
    if (projectState) projectState.textContent = "No project selected";
    setState("Select a project");
    saveButton.disabled = true;
    renderPreview();
  };

  const populateForm = () => {
    const project = currentProject();
    if (!project) {
      clearForm();
      return;
    }

    const seo = currentSeo();

    slugInput.value = project.slug || "";
    coverAltInput.value = project.cover_image_alt || "";
    titleInput.value = seo?.seo_title || "";
    descriptionInput.value = seo?.seo_description || "";
    socialImageInput.value = seo?.social_image_url || "";
    socialAltInput.value = seo?.social_image_alt || "";

    const publication = project.is_published ? "Published" : "Draft";
    const visibility = project.visibility === "private" ? "Private" : "Public";

    if (projectState) {
      projectState.textContent = visibility + " · " + publication;
    }

    setState("Editing " + project.title);
    setMessage(
      "Blank SEO fields safely fall back to the project/case-study content. Custom social images must use HTTPS."
    );
    saveButton.disabled = busy;
    renderPreview();
  };

  const renderProjectOptions = (selectedId = "") => {
    projectSelect.replaceChildren();

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select a project";
    projectSelect.appendChild(placeholder);

    projects.forEach((project) => {
      const option = document.createElement("option");
      option.value = project.id;
      option.textContent =
        project.title +
        (project.visibility === "private"
          ? " · Private"
          : project.is_published
            ? " · Live"
            : " · Draft");
      projectSelect.appendChild(option);
    });

    if (
      selectedId &&
      projects.some((project) => project.id === selectedId)
    ) {
      projectSelect.value = selectedId;
    }
  };

  const loadData = async () => {
    const selectedId = projectSelect.value;

    setBusy(true);
    setState("Loading…");
    setMessage("Loading project SEO settings…");

    try {
      const [projectsResult, seoResult] = await Promise.all([
        supabaseClient
          .from("portfolio_projects")
          .select(
            "id,slug,title,summary,cover_image_url,cover_image_alt,visibility,is_published"
          )
          .order("title", { ascending: true }),
        supabaseClient
          .from("portfolio_project_seo")
          .select(
            "project_id,seo_title,seo_description,social_image_url,social_image_alt,updated_at"
          )
      ]);

      if (projectsResult.error) throw projectsResult.error;

      if (seoResult.error) {
        if (/portfolio_project_seo/i.test(seoResult.error.message || "")) {
          throw new Error(
            "Phase 5C SEO table is missing. Run migration 016_project_seo_manager.sql first."
          );
        }
        throw seoResult.error;
      }

      projects = projectsResult.data || [];
      seoByProject = new Map(
        (seoResult.data || []).map((row) => [row.project_id, row])
      );

      renderProjectOptions(selectedId);

      if (projectSelect.value) {
        populateForm();
      } else {
        clearForm();
        setState("Ready");
        setMessage(
          projects.length
            ? "Select a project to manage its search and social metadata."
            : "No Portfolio Engine projects are available yet."
        );
      }

      return true;
    } catch (error) {
      console.error("SEO Manager load failed:", error);
      projects = [];
      seoByProject = new Map();
      renderProjectOptions();
      clearForm();
      setState("Load failed");
      setMessage(error?.message || "Could not load SEO Manager.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const validate = () => {
    const project = currentProject();
    if (!project) return "Select a project first.";

    const slug = clean(slugInput.value);
    if (
      slug.length < 2 ||
      slug.length > 120 ||
      !slugPattern.test(slug)
    ) {
      return "Slug must use lowercase letters, numbers and single hyphens only.";
    }

    if (clean(coverAltInput.value).length > 220) {
      return "Cover alt text must be 220 characters or less.";
    }

    if (clean(titleInput.value).length > 70) {
      return "SEO title must be 70 characters or less.";
    }

    if (clean(descriptionInput.value).length > 180) {
      return "SEO description must be 180 characters or less.";
    }

    if (!isSecureImageUrl(socialImageInput.value)) {
      return "Custom social image must use a secure HTTPS URL.";
    }

    if (clean(socialImageInput.value).length > 1200) {
      return "Social image URL is too long.";
    }

    if (clean(socialAltInput.value).length > 220) {
      return "Social image alt text must be 220 characters or less.";
    }

    return "";
  };

  const save = async () => {
    const project = currentProject();
    const validation = validate();

    if (validation) {
      setState("Check fields");
      setMessage(validation);
      return false;
    }

    setBusy(true);
    setState("Saving…");
    setMessage("Saving project SEO…");

    const payload = {
      p_project_id: project.id,
      p_slug: clean(slugInput.value),
      p_cover_image_alt: clean(coverAltInput.value),
      p_seo_title: clean(titleInput.value),
      p_seo_description: clean(descriptionInput.value),
      p_social_image_url: clean(socialImageInput.value),
      p_social_image_alt: clean(socialAltInput.value)
    };

    try {
      const { error } = await supabaseClient.rpc(
        "save_portfolio_project_seo",
        payload
      );

      if (error) {
        if (/save_portfolio_project_seo|portfolio_project_seo/i.test(error.message || "")) {
          throw new Error(
            "Phase 5C database setup is missing. Run migration 016_project_seo_manager.sql first."
          );
        }
        throw error;
      }

      project.slug = payload.p_slug;
      project.cover_image_alt = payload.p_cover_image_alt;

      seoByProject.set(project.id, {
        project_id: project.id,
        seo_title: payload.p_seo_title,
        seo_description: payload.p_seo_description,
        social_image_url: payload.p_social_image_url || null,
        social_image_alt: payload.p_social_image_alt
      });

      renderProjectOptions(project.id);
      populateForm();
      setState("SEO saved");
      setMessage(
        project.visibility === "public" && project.is_published
          ? "Saved. The public dynamic case-study page now uses these SEO settings."
          : "Saved. These settings stay non-public until the parent project is public and published."
      );

      return true;
    } catch (error) {
      console.error("SEO save failed:", error);
      setState("Save failed");
      setMessage(error?.message || "Could not save project SEO.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  projectSelect.addEventListener("change", populateForm);
  refreshButton.addEventListener("click", loadData);

  [
    slugInput,
    coverAltInput,
    titleInput,
    descriptionInput,
    socialImageInput,
    socialAltInput
  ].forEach((input) => input.addEventListener("input", renderPreview));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await save();
  });

  navButton.addEventListener("click", async () => {
    showCmsView("seo");
    await loadData();
  });

  clearForm();
};
