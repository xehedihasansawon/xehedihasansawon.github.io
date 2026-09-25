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
  const projectMediaInput = document.querySelector("#portfolioProjectMedia");
  const projectCoverUrlInput = document.querySelector("#portfolioProjectCoverUrl");
  const projectCoverAltInput = document.querySelector("#portfolioProjectCoverAlt");
  const projectActionLabelInput = document.querySelector("#portfolioProjectActionLabel");
  const projectActionHrefInput = document.querySelector("#portfolioProjectActionHref");
  const projectVisibilityInput = document.querySelector("#portfolioProjectVisibility");
  const projectSaveButton = document.querySelector("#portfolioProjectSaveButton");
  const projectPublishButton = document.querySelector("#portfolioProjectPublishButton");
  const projectUnpublishButton = document.querySelector("#portfolioProjectUnpublishButton");
  const projectCancelButton = document.querySelector("#portfolioProjectCancelButton");
  const projectFormMessage = document.querySelector("#portfolioProjectFormMessage");
  const projectList = document.querySelector("#portfolioProjectList");
  const projectCount = document.querySelector("#portfolioProjectCount");
  const projectCoverPreview = document.querySelector("#portfolioProjectCoverPreview");
  const projectCoverPreviewEmpty = document.querySelector("#portfolioProjectCoverPreviewEmpty");

  if (!navButton || !categoryForm || !projectForm) return;

  let categories = [];
  let mediaItems = [];
  let projects = [];
  let projectDirty = false;
  let projectPublishedAtLoad = false;

  const slugify = (value) =>
    String(value || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 120);

  const isValidSlug = (value, max = 120) => {
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

  const setMessage = (value = "") => {
    if (message) message.textContent = value;
  };

  const setCategoryMessage = (value = "") => {
    if (categoryMessage) categoryMessage.textContent = value;
  };

  const setProjectMessage = (value = "") => {
    if (projectFormMessage) projectFormMessage.textContent = value;
  };

  const setState = (value) => {
    if (state) state.textContent = value;
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

  const resetCategoryForm = () => {
    categoryForm.reset();
    categoryIdInput.value = "";
    categoryActiveInput.checked = true;
    categorySaveButton.textContent = "Save category";
    categoryCancelButton.hidden = true;
    setCategoryMessage("");
  };

  const syncProjectCoverPreview = () => {
    const src = projectCoverUrlInput.value.trim();
    if (!src) {
      projectCoverPreview.hidden = true;
      projectCoverPreview.removeAttribute("src");
      projectCoverPreviewEmpty.hidden = false;
      return;
    }

    projectCoverPreview.src = src;
    projectCoverPreview.alt = projectCoverAltInput.value.trim() || "Project cover preview";
    projectCoverPreview.hidden = false;
    projectCoverPreviewEmpty.hidden = true;
  };

  const resetProjectForm = () => {
    projectForm.reset();
    projectIdInput.value = "";
    projectCoverUrlInput.value = "";
    projectCoverAltInput.value = "";
    projectActionLabelInput.value = "View project";
    projectVisibilityInput.value = "public";
    projectMediaInput.value = "";
    projectDirty = false;
    projectPublishedAtLoad = false;
    projectSaveButton.textContent = "Save draft";
    projectPublishButton.hidden = true;
    projectUnpublishButton.hidden = true;
    projectCancelButton.hidden = true;
    setProjectMessage("");
    syncProjectCoverPreview();
  };

  const renderCategorySelect = () => {
    const current = projectCategoryInput.value;
    projectCategoryInput.innerHTML = "";

    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = "No category";
    projectCategoryInput.appendChild(empty);

    categories.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.name + (item.is_active ? "" : " · inactive");
      projectCategoryInput.appendChild(option);
    });

    if ([...projectCategoryInput.options].some((option) => option.value === current)) {
      projectCategoryInput.value = current;
    }
  };

  const renderMediaSelect = () => {
    const current = projectMediaInput.value;
    projectMediaInput.innerHTML = "";

    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = "No Media Library image";
    projectMediaInput.appendChild(empty);

    mediaItems.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.original_filename;
      projectMediaInput.appendChild(option);
    });

    if ([...projectMediaInput.options].some((option) => option.value === current)) {
      projectMediaInput.value = current;
    }
  };

  const renderCategories = () => {
    categoryList.innerHTML = "";
    categoryCount.textContent = categories.length + (categories.length === 1 ? " category" : " categories");

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

      const desc = document.createElement("p");
      desc.textContent = item.description || "No description";

      copy.append(title, meta, desc);

      const actions = document.createElement("div");
      actions.className = "manager-list-actions";

      const edit = document.createElement("button");
      edit.type = "button";
      edit.className = "secondary-button";
      edit.textContent = "Edit";
      edit.addEventListener("click", () => {
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

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "text-button manager-delete-button";
      remove.textContent = "Delete";
      remove.addEventListener("click", async () => {
        const linkedCount = projects.filter((project) => project.category_id === item.id).length;
        const note = linkedCount
          ? " " + linkedCount + " project(s) will become uncategorized."
          : "";

        if (!window.confirm('Delete category "' + item.name + '"?' + note)) return;

        remove.disabled = true;
        const result = await supabaseClient
          .from("portfolio_categories")
          .delete()
          .eq("id", item.id);

        if (result.error) {
          setCategoryMessage(result.error.message || "Could not delete category.");
          remove.disabled = false;
          return;
        }

        if (categoryIdInput.value === item.id) resetCategoryForm();
        setCategoryMessage("Category deleted.");
        await loadManagerData();
      });

      actions.append(edit, remove);
      card.append(copy, actions);
      categoryList.appendChild(card);
    });
  };

  const getCategoryName = (id) =>
    categories.find((item) => item.id === id)?.name || "Uncategorized";

  const renderProjects = () => {
    projectList.innerHTML = "";
    projectCount.textContent = projects.length + (projects.length === 1 ? " project" : " projects");

    if (!projects.length) {
      const empty = document.createElement("div");
      empty.className = "manager-empty";
      empty.textContent = "No dynamic projects yet.";
      projectList.appendChild(empty);
      return;
    }

    projects.forEach((item) => {
      const card = document.createElement("article");
      card.className = "project-manager-card";

      const visual = document.createElement("div");
      visual.className = "project-manager-visual";

      if (item.cover_image_url) {
        const image = document.createElement("img");
        image.src = item.cover_image_url;
        image.alt = item.cover_image_alt || "";
        visual.appendChild(image);
      } else {
        const empty = document.createElement("span");
        empty.textContent = "NO COVER";
        visual.appendChild(empty);
      }

      const body = document.createElement("div");
      body.className = "project-manager-body";

      const top = document.createElement("div");
      top.className = "project-manager-top";

      const status = document.createElement("div");
      status.className = "project-manager-status";

      const publishBadge = document.createElement("b");
      publishBadge.className = item.is_published ? "published" : "draft";
      publishBadge.textContent = item.is_published ? "PUBLISHED" : "DRAFT";

      const visibilityBadge = document.createElement("span");
      visibilityBadge.textContent = item.visibility === "private" ? "PRIVATE" : "PUBLIC";

      status.append(publishBadge, visibilityBadge);

      const title = document.createElement("strong");
      title.textContent = item.title;

      const meta = document.createElement("small");
      meta.textContent = getCategoryName(item.category_id) + " · " + item.slug;

      const summary = document.createElement("p");
      summary.textContent = item.summary || "No summary";

      const actions = document.createElement("div");
      actions.className = "manager-list-actions";

      const edit = document.createElement("button");
      edit.type = "button";
      edit.className = "secondary-button";
      edit.textContent = "Edit";
      edit.addEventListener("click", () => loadProjectIntoForm(item));

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "text-button manager-delete-button";
      remove.textContent = "Delete";
      remove.addEventListener("click", async () => {
        if (!window.confirm('Delete project "' + item.title + '"? This cannot be undone.')) return;

        remove.disabled = true;
        const result = await supabaseClient
          .from("portfolio_projects")
          .delete()
          .eq("id", item.id);

        if (result.error) {
          setProjectMessage(result.error.message || "Could not delete project.");
          remove.disabled = false;
          return;
        }

        if (projectIdInput.value === item.id) resetProjectForm();
        setProjectMessage("Project deleted.");
        await loadManagerData();
      });

      actions.append(edit, remove);
      top.append(status, actions);
      body.append(top, title, meta, summary);
      card.append(visual, body);
      projectList.appendChild(card);
    });
  };

  const loadProjectIntoForm = (item) => {
    projectIdInput.value = item.id;
    projectTitleInput.value = item.title || "";
    projectSlugInput.value = item.slug || "";
    projectSummaryInput.value = item.summary || "";
    projectCategoryInput.value = item.category_id || "";
    projectCoverUrlInput.value = item.cover_image_url || "";
    projectCoverAltInput.value = item.cover_image_alt || "";
    projectActionLabelInput.value = item.action_label || "View project";
    projectActionHrefInput.value = item.action_href || "";
    projectVisibilityInput.value = item.visibility || "public";

    const matchingMedia = mediaItems.find(
      (media) => media.display_url === item.cover_image_url
    );
    projectMediaInput.value = matchingMedia?.id || "";

    projectDirty = false;
    projectPublishedAtLoad = Boolean(item.is_published);
    projectSaveButton.textContent = item.is_published ? "Save as draft" : "Save draft";
    projectPublishButton.hidden = false;
    projectPublishButton.disabled = item.is_published;
    projectUnpublishButton.hidden = !item.is_published;
    projectCancelButton.hidden = false;

    setProjectMessage(
      item.is_published
        ? "Published project loaded. Editing + Save as draft will unpublish it first."
        : "Draft project loaded."
    );

    syncProjectCoverPreview();
    projectTitleInput.focus();
  };

  const loadManagerData = async () => {
    setBusy(true);
    setState("Loading…");
    setMessage("Loading categories, media and projects…");

    try {
      const results = await Promise.all([
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
            "id,slug,title,summary,category_id,cover_image_url,cover_image_alt,action_label,action_href,is_featured,show_on_homepage,sort_order,category_sort_order,visibility,is_published,published_at,created_at,updated_at"
          )
          .order("created_at", { ascending: false })
      ]);

      const categoryResult = results[0];
      const mediaResult = results[1];
      const projectResult = results[2];

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

      setState("Manager ready");
      setMessage(
        categories.length + " categories · " +
        projects.length + " projects · " +
        mediaItems.length + " media items"
      );
      return true;
    } catch (error) {
      console.error("Project manager load failed:", error);
      setState("Load failed");
      setMessage(error && error.message ? error.message : "Could not load Portfolio Engine data.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  categoryNameInput.addEventListener("input", () => {
    if (!categoryIdInput.value && !categorySlugInput.dataset.manual) {
      categorySlugInput.value = slugify(categoryNameInput.value).slice(0, 80);
    }
  });

  categorySlugInput.addEventListener("input", () => {
    categorySlugInput.dataset.manual = "true";
  });

  categoryCancelButton.addEventListener("click", () => {
    delete categorySlugInput.dataset.manual;
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
      setCategoryMessage("Category slug must use lowercase letters, numbers and hyphens.");
      return;
    }

    categorySaveButton.disabled = true;

    const payload = {
      name,
      slug,
      description,
      is_active: categoryActiveInput.checked
    };

    const result = id
      ? await supabaseClient
          .from("portfolio_categories")
          .update(payload)
          .eq("id", id)
      : await supabaseClient
          .from("portfolio_categories")
          .insert(payload);

    categorySaveButton.disabled = false;

    if (result.error) {
      setCategoryMessage(result.error.message || "Could not save category.");
      return;
    }

    setCategoryMessage(id ? "Category updated." : "Category created.");
    delete categorySlugInput.dataset.manual;
    resetCategoryForm();
    await loadManagerData();
  });

  projectTitleInput.addEventListener("input", () => {
    projectDirty = true;
    if (!projectIdInput.value && !projectSlugInput.dataset.manual) {
      projectSlugInput.value = slugify(projectTitleInput.value);
    }
  });

  projectSlugInput.addEventListener("input", () => {
    projectDirty = true;
    projectSlugInput.dataset.manual = "true";
  });

  projectForm.addEventListener("input", (event) => {
    if (event.target === projectTitleInput || event.target === projectSlugInput) return;
    projectDirty = true;
    if (projectIdInput.value) projectPublishButton.disabled = true;
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

    projectDirty = true;
    syncProjectCoverPreview();
  });

  projectCoverUrlInput.addEventListener("input", syncProjectCoverPreview);
  projectCoverAltInput.addEventListener("input", syncProjectCoverPreview);

  projectCancelButton.addEventListener("click", () => {
    delete projectSlugInput.dataset.manual;
    resetProjectForm();
  });

  const readProjectPayload = () => {
    const title = projectTitleInput.value.trim();
    const slug = projectSlugInput.value.trim();
    const summary = projectSummaryInput.value.trim();
    const coverUrl = projectCoverUrlInput.value.trim();
    const coverAlt = projectCoverAltInput.value.trim();
    const actionLabel = projectActionLabelInput.value.trim();
    const actionHref = projectActionHrefInput.value.trim();

    if (!title) {
      setProjectMessage("Add a project title.");
      return null;
    }

    if (!isValidSlug(slug, 120)) {
      setProjectMessage("Project slug must use lowercase letters, numbers and hyphens.");
      return null;
    }

    if (!actionLabel) {
      setProjectMessage("Add an action label.");
      return null;
    }

    if (!isSafeHref(actionHref)) {
      setProjectMessage("Use a safe internal or http/https/mailto/tel action link.");
      return null;
    }

    if (coverUrl && !/^https:\/\//i.test(coverUrl)) {
      setProjectMessage("Choose a Media Library image or use an HTTPS cover URL.");
      return null;
    }

    return {
      title,
      slug,
      summary,
      category_id: projectCategoryInput.value || null,
      cover_image_url: coverUrl || null,
      cover_image_alt: coverAlt,
      action_label: actionLabel,
      action_href: actionHref || null,
      visibility: projectVisibilityInput.value === "private" ? "private" : "public"
    };
  };

  projectForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setProjectMessage("");

    const payload = readProjectPayload();
    if (!payload) return;

    const id = projectIdInput.value.trim();

    setBusy(true);
    projectSaveButton.textContent = "Saving…";

    try {
      const writePayload = {
        ...payload,
        is_published: false
      };

      const result = id
        ? await supabaseClient
            .from("portfolio_projects")
            .update(writePayload)
            .eq("id", id)
            .select("id")
            .single()
        : await supabaseClient
            .from("portfolio_projects")
            .insert(writePayload)
            .select("id")
            .single();

      if (result.error) throw result.error;

      projectDirty = false;
      projectPublishedAtLoad = false;
      projectIdInput.value = result.data.id;
      projectSaveButton.textContent = "Save draft";
      projectPublishButton.hidden = false;
      projectPublishButton.disabled = false;
      projectUnpublishButton.hidden = true;
      projectCancelButton.hidden = false;
      setProjectMessage(
        projectPublishedAtLoad
          ? "Saved as draft and unpublished."
          : "Draft saved. Public project data has not been published."
      );

      await loadManagerData();

      const saved = projects.find((item) => item.id === result.data.id);
      if (saved) loadProjectIntoForm(saved);
    } catch (error) {
      console.error("Project save failed:", error);
      setProjectMessage(error && error.message ? error.message : "Could not save project draft.");
    } finally {
      setBusy(false);
      if (projectIdInput.value) projectSaveButton.textContent = "Save draft";
    }
  });

  projectPublishButton.addEventListener("click", async () => {
    const id = projectIdInput.value.trim();
    if (!id) {
      setProjectMessage("Save the project draft first.");
      return;
    }

    if (projectDirty) {
      setProjectMessage("Save the draft first, then publish.");
      return;
    }

    setBusy(true);
    projectPublishButton.textContent = "Publishing…";

    try {
      const result = await supabaseClient
        .from("portfolio_projects")
        .update({ is_published: true })
        .eq("id", id)
        .select("id,is_published,published_at")
        .single();

      if (result.error) throw result.error;

      setProjectMessage(
        projectVisibilityInput.value === "private"
          ? "Published as PRIVATE. Anonymous visitors still cannot read it."
          : "Project published in the Portfolio Engine data store. Public site rendering is still unchanged in Phase 3C."
      );

      projectDirty = false;
      projectPublishedAtLoad = true;
      await loadManagerData();
      const saved = projects.find((item) => item.id === id);
      if (saved) loadProjectIntoForm(saved);
    } catch (error) {
      console.error("Project publish failed:", error);
      setProjectMessage(error && error.message ? error.message : "Could not publish project.");
    } finally {
      setBusy(false);
      projectPublishButton.textContent = "Publish project";
    }
  });

  projectUnpublishButton.addEventListener("click", async () => {
    const id = projectIdInput.value.trim();
    if (!id) return;

    if (!window.confirm("Unpublish this project and return it to draft state?")) return;

    setBusy(true);

    try {
      const result = await supabaseClient
        .from("portfolio_projects")
        .update({ is_published: false })
        .eq("id", id);

      if (result.error) throw result.error;

      setProjectMessage("Project unpublished and returned to draft.");
      await loadManagerData();
      const saved = projects.find((item) => item.id === id);
      if (saved) loadProjectIntoForm(saved);
    } catch (error) {
      setProjectMessage(error && error.message ? error.message : "Could not unpublish project.");
    } finally {
      setBusy(false);
    }
  });

  refreshButton.addEventListener("click", loadManagerData);

  navButton.addEventListener("click", async () => {
    showCmsView("project-manager");
    await loadManagerData();
  });

  resetCategoryForm();
  resetProjectForm();
};
