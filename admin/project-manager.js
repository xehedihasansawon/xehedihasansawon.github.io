export const initProjectManager = ({ supabaseClient, showCmsView }) => {
  const navButton = document.querySelector("#projectManagerNavButton");
  const state = document.querySelector("#projectManagerState");
  const message = document.querySelector("#projectManagerMessage");
  const refreshButton = document.querySelector("#projectManagerRefreshButton");

  const categoryForm = document.querySelector("#projectCategoryForm");
  const categoryIdInput = document.querySelector("#projectCategoryId");
  const categoryNameInput = document.querySelector("#projectCategoryName");
  const categorySlugInput = document.querySelector("#projectCategorySlug");
  const categoryDescriptionInput = document.querySelector("#projectCategoryDescription");
  const categoryActiveInput = document.querySelector("#projectCategoryActive");
  const categorySaveButton = document.querySelector("#projectCategorySaveButton");
  const categoryCancelButton = document.querySelector("#projectCategoryCancelButton");
  const categoryMessage = document.querySelector("#projectCategoryMessage");
  const categoryList = document.querySelector("#projectCategoryList");
  const categoryCount = document.querySelector("#projectCategoryCount");

  const projectForm = document.querySelector("#portfolioProjectForm");
  const projectIdInput = document.querySelector("#portfolioProjectId");
  const projectTitleInput = document.querySelector("#portfolioProjectTitle");
  const projectSlugInput = document.querySelector("#portfolioProjectSlug");
  const projectSummaryInput = document.querySelector("#portfolioProjectSummary");
  const projectCategoryInput = document.querySelector("#portfolioProjectCategory");
  const projectVisibilityInput = document.querySelector("#portfolioProjectVisibility");
  const projectMediaInput = document.querySelector("#portfolioProjectMedia");
  const projectCoverUrlInput = document.querySelector("#portfolioProjectCoverUrl");
  const projectCoverAltInput = document.querySelector("#portfolioProjectCoverAlt");
  const projectCoverPreview = document.querySelector("#portfolioProjectCoverPreview");
  const projectCoverPreviewEmpty = document.querySelector("#portfolioProjectCoverPreviewEmpty");
  const projectActionLabelInput = document.querySelector("#portfolioProjectActionLabel");
  const projectActionHrefInput = document.querySelector("#portfolioProjectActionHref");
  const projectSaveButton = document.querySelector("#portfolioProjectSaveButton");
  const projectPublishButton = document.querySelector("#portfolioProjectPublishButton");
  const projectUnpublishButton = document.querySelector("#portfolioProjectUnpublishButton");
  const projectCancelButton = document.querySelector("#portfolioProjectCancelButton");
  const projectFormMessage = document.querySelector("#portfolioProjectFormMessage");
  const projectList = document.querySelector("#portfolioProjectList");
  const projectCount = document.querySelector("#portfolioProjectCount");

  if (!navButton || !categoryForm || !projectForm) return;

  let categories = [];
  let mediaItems = [];
  let projects = [];
  let projectDirty = false;
  let projectPublishedAtLoad = false;

  const slugify = (value, max = 120) =>
    String(value || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, max);

  const isValidSlug = (value, max) => {
    const slug = String(value || "").trim();
    return (
      slug.length >= 2 &&
      slug.length <= max &&
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
    );
  };

  const isSafeHref = (value) => {
    const href = String(value || "").trim();
    if (!href) return true;

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
      const absolute = new URL(href);
      return ["https:", "http:", "mailto:", "tel:"].includes(absolute.protocol);
    } catch {
      try {
        const relative = new URL(href, window.location.origin + "/");
        return relative.origin === window.location.origin;
      } catch {
        return false;
      }
    }
  };

  const setState = (value) => {
    if (state) state.textContent = value;
  };

  const setMessage = (value = "") => {
    if (message) message.textContent = value;
  };

  const setCategoryMessage = (value = "") => {
    if (categoryMessage) categoryMessage.textContent = value;
  };

  const setProjectMessage = (value = "") => {
    if (projectFormMessage) projectFormMessage.textContent = value;
  };

  const setBusy = (busy) => {
    [
      refreshButton,
      categorySaveButton,
      categoryCancelButton,
      projectSaveButton,
      projectPublishButton,
      projectUnpublishButton,
      projectCancelButton
    ].forEach((button) => {
      if (button) button.disabled = busy;
    });
  };

  const resetCategoryForm = ({ clearMessage = true } = {}) => {
    categoryForm.reset();
    delete categorySlugInput.dataset.manual;
    categoryIdInput.value = "";
    categoryActiveInput.checked = true;
    categorySaveButton.textContent = "Save category";
    categoryCancelButton.hidden = true;

    if (clearMessage) setCategoryMessage("");
  };

  const syncProjectCoverPreview = () => {
    const src = projectCoverUrlInput.value.trim();

    if (!src) {
      projectCoverPreview.hidden = true;
      projectCoverPreview.removeAttribute("src");
      projectCoverPreview.alt = "";
      projectCoverPreviewEmpty.hidden = false;
      return;
    }

    projectCoverPreview.src = src;
    projectCoverPreview.alt =
      projectCoverAltInput.value.trim() || "Project cover preview";
    projectCoverPreview.hidden = false;
    projectCoverPreviewEmpty.hidden = true;
  };

  const resetProjectForm = ({ clearMessage = true } = {}) => {
    projectForm.reset();
    delete projectSlugInput.dataset.manual;
    projectIdInput.value = "";
    projectVisibilityInput.value = "public";
    projectMediaInput.value = "";
    projectCoverUrlInput.value = "";
    projectCoverAltInput.value = "";
    projectActionLabelInput.value = "View project";
    projectDirty = false;
    projectPublishedAtLoad = false;
    projectSaveButton.textContent = "Save draft";
    projectPublishButton.hidden = true;
    projectPublishButton.disabled = false;
    projectUnpublishButton.hidden = true;
    projectCancelButton.hidden = true;
    syncProjectCoverPreview();

    if (clearMessage) setProjectMessage("");
  };

  const formatUniqueError = (error, label) => {
    if (error?.code === "23505") {
      return "That " + label + " slug already exists. Use a different slug.";
    }

    return error?.message || "Could not save " + label + ".";
  };

  const renderCategorySelect = () => {
    const currentValue = projectCategoryInput.value;
    projectCategoryInput.innerHTML = "";

    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = "No category";
    projectCategoryInput.appendChild(emptyOption);

    categories.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.name + (item.is_active ? "" : " · inactive");
      projectCategoryInput.appendChild(option);
    });

    if (
      [...projectCategoryInput.options].some(
        (option) => option.value === currentValue
      )
    ) {
      projectCategoryInput.value = currentValue;
    }
  };

  const renderMediaSelect = () => {
    const currentValue = projectMediaInput.value;
    projectMediaInput.innerHTML = "";

    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = "No Media Library image";
    projectMediaInput.appendChild(emptyOption);

    mediaItems.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.original_filename;
      projectMediaInput.appendChild(option);
    });

    if (
      [...projectMediaInput.options].some(
        (option) => option.value === currentValue
      )
    ) {
      projectMediaInput.value = currentValue;
    }
  };

  const renderCategories = () => {
    categoryList.innerHTML = "";
    categoryCount.textContent =
      categories.length + (categories.length === 1 ? " category" : " categories");

    if (!categories.length) {
      const empty = document.createElement("div");
      empty.className = "manager-empty";
      empty.textContent = "No categories yet.";
      categoryList.appendChild(empty);
      return;
    }

    categories.forEach((item) => {
      const card = document.createElement("article");
      card.className = "manager-list-card";

      const copy = document.createElement("div");
      copy.className = "manager-list-copy";

      const title = document.createElement("strong");
      title.textContent = item.name;

      const meta = document.createElement("small");
      meta.textContent = item.slug + " · " + (item.is_active ? "Active" : "Inactive");

      const description = document.createElement("p");
      description.textContent = item.description || "No description";

      copy.append(title, meta, description);

      const actions = document.createElement("div");
      actions.className = "manager-list-actions";

      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.className = "secondary-button";
      editButton.textContent = "Edit";
      editButton.addEventListener("click", () => {
        categoryIdInput.value = item.id;
        categoryNameInput.value = item.name;
        categorySlugInput.value = item.slug;
        categoryDescriptionInput.value = item.description || "";
        categoryActiveInput.checked = item.is_active;
        categorySaveButton.textContent = "Update category";
        categoryCancelButton.hidden = false;
        setCategoryMessage("Editing " + item.name + ".");
        categoryNameInput.focus();
      });

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "text-button manager-delete-button";
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", async () => {
        const linkedCount = projects.filter(
          (project) => project.category_id === item.id
        ).length;

        const linkedNote = linkedCount
          ? " " + linkedCount + " linked project(s) will become uncategorized."
          : "";

        const confirmed = window.confirm(
          'Delete category "' + item.name + '"?' + linkedNote
        );

        if (!confirmed) return;

        setBusy(true);
        setCategoryMessage("Deleting category…");

        try {
          const result = await supabaseClient
            .from("portfolio_categories")
            .delete()
            .eq("id", item.id);

          if (result.error) throw result.error;

          if (categoryIdInput.value === item.id) {
            resetCategoryForm({ clearMessage: false });
          }

          await loadManagerData();
          setCategoryMessage("Category deleted.");
        } catch (error) {
          console.error("Category delete failed:", error);
          setCategoryMessage(error?.message || "Could not delete category.");
        } finally {
          setBusy(false);
        }
      });

      actions.append(editButton, deleteButton);
      card.append(copy, actions);
      categoryList.appendChild(card);
    });
  };

  const getCategoryName = (id) =>
    categories.find((item) => item.id === id)?.name || "Uncategorized";

  const renderProjects = () => {
    projectList.innerHTML = "";
    projectCount.textContent =
      projects.length + (projects.length === 1 ? " project" : " projects");

    if (!projects.length) {
      const empty = document.createElement("div");
      empty.className = "manager-empty";
      empty.textContent = "No dynamic projects yet.";
      projectList.appendChild(empty);
      return;
    }

    projects.forEach((item) => {
      const card = document.createElement("article");
      card.className = "manager-list-card";

      const copy = document.createElement("div");
      copy.className = "manager-list-copy";

      const title = document.createElement("strong");
      title.textContent = item.title;

      const meta = document.createElement("small");
      meta.textContent =
        item.slug +
        " · " +
        getCategoryName(item.category_id) +
        " · " +
        (item.visibility === "private" ? "Private" : "Public") +
        " · " +
        (item.is_published ? "Published" : "Draft");

      const summary = document.createElement("p");
      summary.textContent = item.summary || "No summary";

      copy.append(title, meta, summary);

      const actions = document.createElement("div");
      actions.className = "manager-list-actions";

      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.className = "secondary-button";
      editButton.textContent = "Edit draft";
      editButton.addEventListener("click", () => {
        projectIdInput.value = item.id;
        projectTitleInput.value = item.title || "";
        projectSlugInput.value = item.slug || "";
        projectSummaryInput.value = item.summary || "";
        projectCategoryInput.value = item.category_id || "";
        projectVisibilityInput.value = item.visibility || "public";
        projectCoverUrlInput.value = item.cover_image_url || "";
        projectCoverAltInput.value = item.cover_image_alt || "";

        const matchingMedia = mediaItems.find(
          (media) => media.display_url === item.cover_image_url
        );
        projectMediaInput.value = matchingMedia?.id || "";

        projectActionLabelInput.value = item.action_label || "View project";
        projectActionHrefInput.value = item.action_href || "";
        projectDirty = false;
        projectPublishedAtLoad = Boolean(item.is_published);
        projectSaveButton.textContent = item.is_published
          ? "Save as draft"
          : "Update draft";
        projectPublishButton.hidden = false;
        projectPublishButton.disabled = Boolean(item.is_published);
        projectUnpublishButton.hidden = !item.is_published;
        projectCancelButton.hidden = false;
        setProjectMessage(
          item.is_published
            ? "Published project loaded. Edit + Save as draft before publishing new changes."
            : "Draft project loaded. It can be published after saved changes are complete."
        );
        syncProjectCoverPreview();
        projectTitleInput.focus();
      });

      actions.append(editButton);
      card.append(copy, actions);
      projectList.appendChild(card);
    });
  };

  const loadManagerData = async () => {
    setBusy(true);
    setState("Loading…");
    setMessage("Loading categories, Media Library covers and project drafts…");

    try {
      const [categoryResult, mediaResult, projectResult] = await Promise.all([
        supabaseClient
          .from("portfolio_categories")
          .select("id,slug,name,description,sort_order,is_active,created_at,updated_at")
          .order("sort_order", { ascending: true })
          .order("name", { ascending: true }),
        supabaseClient
          .from("portfolio_media")
          .select("id,original_filename,alt_text,display_url,thumbnail_url,created_at")
          .order("created_at", { ascending: false })
          .limit(200),
        supabaseClient
          .from("portfolio_projects")
          .select(
            "id,slug,title,summary,category_id,cover_image_url,cover_image_alt,action_label,action_href,visibility,is_published,published_at,created_at,updated_at"
          )
          .order("created_at", { ascending: false })
      ]);

      if (categoryResult.error) throw categoryResult.error;
      if (mediaResult.error) throw mediaResult.error;
      if (projectResult.error) throw projectResult.error;

      categories = categoryResult.data || [];
      mediaItems = mediaResult.data || [];
      projects = projectResult.data || [];

      renderCategorySelect();
      renderMediaSelect();
      renderCategories();
      renderProjects();

      setState("Draft manager ready");
      setMessage(
        categories.length +
          (categories.length === 1 ? " category" : " categories") +
          " · " +
          projects.length +
          (projects.length === 1 ? " project" : " projects") +
          " · " +
          mediaItems.length +
          (mediaItems.length === 1 ? " media item" : " media items")
      );

      return true;
    } catch (error) {
      console.error("Project manager load failed:", error);
      setState("Load failed");
      setMessage(error?.message || "Could not load Portfolio Engine records.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  categoryNameInput.addEventListener("input", () => {
    if (!categoryIdInput.value && !categorySlugInput.dataset.manual) {
      categorySlugInput.value = slugify(categoryNameInput.value, 80);
    }
  });

  categorySlugInput.addEventListener("input", () => {
    categorySlugInput.dataset.manual = "true";
  });

  categoryCancelButton.addEventListener("click", () => {
    resetCategoryForm();
  });

  categoryForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setCategoryMessage("");

    const id = categoryIdInput.value.trim();
    const name = categoryNameInput.value.trim();
    const slug = categorySlugInput.value.trim();
    const description = categoryDescriptionInput.value.trim();

    if (!name) {
      setCategoryMessage("Add a category name.");
      return;
    }

    if (!isValidSlug(slug, 80)) {
      setCategoryMessage(
        "Category slug must be 2–80 characters using lowercase letters, numbers and hyphens."
      );
      return;
    }

    const payload = {
      name,
      slug,
      description,
      is_active: categoryActiveInput.checked
    };

    setBusy(true);
    categorySaveButton.textContent = id ? "Updating…" : "Saving…";

    try {
      const result = id
        ? await supabaseClient
            .from("portfolio_categories")
            .update(payload)
            .eq("id", id)
        : await supabaseClient
            .from("portfolio_categories")
            .insert(payload);

      if (result.error) throw result.error;

      resetCategoryForm({ clearMessage: false });
      await loadManagerData();
      setCategoryMessage(id ? "Category updated." : "Category created.");
    } catch (error) {
      console.error("Category save failed:", error);
      setCategoryMessage(formatUniqueError(error, "category"));
      categorySaveButton.textContent = id ? "Update category" : "Save category";
    } finally {
      setBusy(false);
    }
  });

  projectTitleInput.addEventListener("input", () => {
    if (!projectIdInput.value && !projectSlugInput.dataset.manual) {
      projectSlugInput.value = slugify(projectTitleInput.value, 120);
    }
  });

  projectSlugInput.addEventListener("input", () => {
    projectSlugInput.dataset.manual = "true";
  });

  projectForm.addEventListener("input", () => {
    if (!projectIdInput.value) return;
    projectDirty = true;
    projectPublishButton.hidden = false;
    projectPublishButton.disabled = false;
  });

  projectForm.addEventListener("change", () => {
    if (!projectIdInput.value) return;
    projectDirty = true;
    projectPublishButton.hidden = false;
    projectPublishButton.disabled = false;
  });

  projectMediaInput.addEventListener("change", () => {
    const media = mediaItems.find((item) => item.id === projectMediaInput.value);

    if (media) {
      projectCoverUrlInput.value = media.display_url;
      projectCoverAltInput.value = media.alt_text || "";
    } else {
      projectCoverUrlInput.value = "";
      projectCoverAltInput.value = "";
    }

    syncProjectCoverPreview();
  });

  projectCoverAltInput.addEventListener("input", syncProjectCoverPreview);

  projectCancelButton.addEventListener("click", () => {
    resetProjectForm();
  });

  projectForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setProjectMessage("");

    const id = projectIdInput.value.trim();
    const title = projectTitleInput.value.trim();
    const slug = projectSlugInput.value.trim();
    const summary = projectSummaryInput.value.trim();
    const coverUrl = projectCoverUrlInput.value.trim();
    const coverAlt = projectCoverAltInput.value.trim();
    const actionLabel = projectActionLabelInput.value.trim();
    const actionHref = projectActionHrefInput.value.trim();

    if (!title) {
      setProjectMessage("Add a project title.");
      return;
    }

    if (!isValidSlug(slug, 120)) {
      setProjectMessage(
        "Project slug must be 2–120 characters using lowercase letters, numbers and hyphens."
      );
      return;
    }

    if (coverUrl && !/^https:\/\//i.test(coverUrl)) {
      setProjectMessage("Choose an optimized HTTPS image from the Media Library.");
      return;
    }

    if (coverUrl && !coverAlt) {
      setProjectMessage("Add cover alt text for the selected project image.");
      return;
    }

    if (!actionLabel) {
      setProjectMessage("Add an action label.");
      return;
    }

    if (!isSafeHref(actionHref)) {
      setProjectMessage(
        "Use a safe relative link or http/https/mailto/tel action link."
      );
      return;
    }

    const payload = {
      title,
      slug,
      summary,
      category_id: projectCategoryInput.value || null,
      cover_image_url: coverUrl || null,
      cover_image_alt: coverAlt,
      action_label: actionLabel,
      action_href: actionHref || null,
      visibility:
        projectVisibilityInput.value === "private" ? "private" : "public",
      is_published: false
    };

    setBusy(true);
    projectSaveButton.textContent = id ? "Updating…" : "Saving…";

    try {
      const result = id
        ? await supabaseClient
            .from("portfolio_projects")
            .update(payload)
            .eq("id", id)
            .select("id")
            .single()
        : await supabaseClient
            .from("portfolio_projects")
            .insert(payload)
            .select("id")
            .single();

      if (result.error) throw result.error;

      const savedId = result.data.id;
      const wasPublished = projectPublishedAtLoad;
      resetProjectForm({ clearMessage: false });
      await loadManagerData();

      const saved = projects.find((item) => item.id === savedId);
      setProjectMessage(
        wasPublished
          ? "Saved as draft and unpublished. Review the saved draft, then publish when ready."
          : id
            ? "Project draft updated. Review the saved draft, then publish when ready."
            : "Project draft created. Review it, then publish when ready."
      );

      if (saved) {
        projectIdInput.value = saved.id;
        projectTitleInput.value = saved.title || "";
        projectSlugInput.value = saved.slug || "";
        projectSummaryInput.value = saved.summary || "";
        projectCategoryInput.value = saved.category_id || "";
        projectVisibilityInput.value = saved.visibility || "public";
        projectCoverUrlInput.value = saved.cover_image_url || "";
        projectCoverAltInput.value = saved.cover_image_alt || "";

        const matchingMedia = mediaItems.find(
          (media) => media.display_url === saved.cover_image_url
        );
        projectMediaInput.value = matchingMedia?.id || "";

        projectActionLabelInput.value = saved.action_label || "View project";
        projectActionHrefInput.value = saved.action_href || "";
        projectDirty = false;
        projectPublishedAtLoad = false;
        projectSaveButton.textContent = "Update draft";
        projectPublishButton.hidden = false;
        projectPublishButton.disabled = false;
        projectUnpublishButton.hidden = true;
        projectCancelButton.hidden = false;
        syncProjectCoverPreview();
      }
    } catch (error) {
      console.error("Project draft save failed:", error);
      setProjectMessage(formatUniqueError(error, "project"));
      projectSaveButton.textContent = id ? "Update draft" : "Save draft";
    } finally {
      setBusy(false);
    }
  });

  projectPublishButton.addEventListener("click", async () => {
    const id = projectIdInput.value.trim();

    if (!id) {
      setProjectMessage("Save the project draft first.");
      return;
    }

    if (projectDirty) {
      setProjectMessage("Save the latest draft changes before publishing.");
      return;
    }

    if (projectPublishedAtLoad) {
      setProjectMessage("This project is already published.");
      return;
    }

    setBusy(true);
    projectPublishButton.textContent = "Publishing…";

    try {
      const result = await supabaseClient
        .from("portfolio_projects")
        .update({ is_published: true })
        .eq("id", id)
        .select("id,is_published,published_at,visibility")
        .single();

      if (result.error) throw result.error;

      projectDirty = false;
      projectPublishedAtLoad = true;
      await loadManagerData();

      const saved = projects.find((item) => item.id === id);
      if (saved) {
        projectIdInput.value = saved.id;
        projectTitleInput.value = saved.title || "";
        projectSlugInput.value = saved.slug || "";
        projectSummaryInput.value = saved.summary || "";
        projectCategoryInput.value = saved.category_id || "";
        projectVisibilityInput.value = saved.visibility || "public";
        projectCoverUrlInput.value = saved.cover_image_url || "";
        projectCoverAltInput.value = saved.cover_image_alt || "";

        const matchingMedia = mediaItems.find(
          (media) => media.display_url === saved.cover_image_url
        );
        projectMediaInput.value = matchingMedia?.id || "";

        projectActionLabelInput.value = saved.action_label || "View project";
        projectActionHrefInput.value = saved.action_href || "";
        projectSaveButton.textContent = "Save as draft";
        projectPublishButton.hidden = false;
        projectPublishButton.disabled = true;
        projectUnpublishButton.hidden = false;
        projectCancelButton.hidden = false;
        syncProjectCoverPreview();
      }

      setProjectMessage(
        result.data.visibility === "private"
          ? "Published as PRIVATE. Anonymous visitors still cannot read this project."
          : "Project published in the Portfolio Engine data store. Homepage rendering is still unchanged."
      );
    } catch (error) {
      console.error("Project publish failed:", error);
      setProjectMessage(error?.message || "Could not publish project.");
    } finally {
      setBusy(false);
      projectPublishButton.textContent = "Publish project";
      projectPublishButton.disabled = projectPublishedAtLoad && !projectDirty;
    }
  });

  projectUnpublishButton.addEventListener("click", async () => {
    const id = projectIdInput.value.trim();
    if (!id) return;

    const confirmed = window.confirm(
      "Unpublish this project and return it to draft state?"
    );
    if (!confirmed) return;

    setBusy(true);

    try {
      const result = await supabaseClient
        .from("portfolio_projects")
        .update({ is_published: false })
        .eq("id", id)
        .select("id,is_published")
        .single();

      if (result.error) throw result.error;

      projectDirty = false;
      projectPublishedAtLoad = false;
      await loadManagerData();

      const saved = projects.find((item) => item.id === id);
      if (saved) {
        projectIdInput.value = saved.id;
        projectTitleInput.value = saved.title || "";
        projectSlugInput.value = saved.slug || "";
        projectSummaryInput.value = saved.summary || "";
        projectCategoryInput.value = saved.category_id || "";
        projectVisibilityInput.value = saved.visibility || "public";
        projectCoverUrlInput.value = saved.cover_image_url || "";
        projectCoverAltInput.value = saved.cover_image_alt || "";

        const matchingMedia = mediaItems.find(
          (media) => media.display_url === saved.cover_image_url
        );
        projectMediaInput.value = matchingMedia?.id || "";

        projectActionLabelInput.value = saved.action_label || "View project";
        projectActionHrefInput.value = saved.action_href || "";
        projectSaveButton.textContent = "Update draft";
        projectPublishButton.hidden = false;
        projectPublishButton.disabled = false;
        projectUnpublishButton.hidden = true;
        projectCancelButton.hidden = false;
        syncProjectCoverPreview();
      }

      setProjectMessage("Project unpublished and returned to draft.");
    } catch (error) {
      console.error("Project unpublish failed:", error);
      setProjectMessage(error?.message || "Could not unpublish project.");
    } finally {
      setBusy(false);
    }
  });

  refreshButton?.addEventListener("click", loadManagerData);

  navButton.addEventListener("click", async () => {
    showCmsView("project-manager");
    await loadManagerData();
  });

  resetCategoryForm();
  resetProjectForm();
};
