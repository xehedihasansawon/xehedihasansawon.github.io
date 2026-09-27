export const initHomepageSelection = ({ supabaseClient, showCmsView }) => {
  const navButton = document.querySelector("#homepageSelectionNavButton");
  const state = document.querySelector("#homepageSelectionState");
  const message = document.querySelector("#homepageSelectionMessage");
  const refreshButton = document.querySelector("#homepageSelectionRefreshButton");
  const categoryFilter = document.querySelector("#homepageSelectionCategoryFilter");
  const saveButton = document.querySelector("#homepageSelectionSaveButton");
  const count = document.querySelector("#homepageSelectionCount");
  const list = document.querySelector("#homepageSelectionList");
  const preview = document.querySelector("#homepageSelectionPreview");

  if (
    !navButton ||
    !categoryFilter ||
    !saveButton ||
    !list ||
    !preview
  ) {
    return;
  }

  let categories = [];
  let projects = [];
  let baseline = new Map();

  const setState = (value) => {
    if (state) state.textContent = value;
  };

  const setMessage = (value = "") => {
    if (message) message.textContent = value;
  };

  const setBusy = (busy) => {
    [refreshButton, categoryFilter, saveButton].forEach((element) => {
      if (element) element.disabled = busy;
    });

    list.querySelectorAll("input").forEach((input) => {
      input.disabled = busy || input.dataset.locked === "true";
    });
  };

  const categoryName = (id) =>
    categories.find((item) => item.id === id)?.name || "Uncategorized";

  const isEligible = (project) =>
    project.is_published === true &&
    project.visibility === "public" &&
    Boolean(String(project.cover_image_url || "").trim());

  const selectedProjects = () =>
    projects.filter((project) => project.show_on_homepage);

  const selectedCount = () => selectedProjects().length;

  const sortForHomepage = (items) =>
    [...items].sort((a, b) => {
      if (a.is_featured !== b.is_featured) {
        return a.is_featured ? -1 : 1;
      }

      const orderDiff = (a.sort_order ?? 0) - (b.sort_order ?? 0);
      if (orderDiff) return orderDiff;

      const aDate = Date.parse(a.published_at || a.created_at || 0) || 0;
      const bDate = Date.parse(b.published_at || b.created_at || 0) || 0;
      return bDate - aDate;
    });

  const renderCategoryFilter = () => {
    const current = categoryFilter.value;
    categoryFilter.innerHTML = "";

    const all = document.createElement("option");
    all.value = "";
    all.textContent = "All categories";
    categoryFilter.appendChild(all);

    const none = document.createElement("option");
    none.value = "__none__";
    none.textContent = "Uncategorized";
    categoryFilter.appendChild(none);

    categories.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.name + (item.is_active ? "" : " · inactive");
      categoryFilter.appendChild(option);
    });

    if ([...categoryFilter.options].some((option) => option.value === current)) {
      categoryFilter.value = current;
    }
  };

  const renderPreview = () => {
    preview.innerHTML = "";

    const selected = sortForHomepage(selectedProjects()).slice(0, 4);

    if (!selected.length) {
      const empty = document.createElement("div");
      empty.className = "manager-empty";
      empty.textContent =
        "No Portfolio Engine homepage projects selected. The existing Phase 2 cards remain the public fallback.";
      preview.appendChild(empty);
      return;
    }

    selected.forEach((project, index) => {
      const card = document.createElement("article");
      card.className = "homepage-selection-preview-card";

      const number = document.createElement("span");
      number.textContent = String(index + 1).padStart(2, "0");

      const copy = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = project.title;

      const meta = document.createElement("small");
      meta.textContent =
        categoryName(project.category_id) +
        (project.is_featured ? " · Featured priority" : "");

      copy.append(title, meta);

      card.append(number, copy);
      preview.appendChild(card);
    });
  };

  const renderList = () => {
    list.innerHTML = "";

    if (count) {
      count.textContent = selectedCount() + " / 4 selected";
    }

    const filter = categoryFilter.value;
    const visible = projects.filter((project) => {
      if (!filter) return true;
      if (filter === "__none__") return !project.category_id;
      return project.category_id === filter;
    });

    if (!visible.length) {
      const empty = document.createElement("div");
      empty.className = "manager-empty";
      empty.textContent = "No projects match this category filter.";
      list.appendChild(empty);
      renderPreview();
      return;
    }

    visible.forEach((project) => {
      const eligible = isEligible(project);
      const card = document.createElement("article");
      card.className = "homepage-selection-card";

      const visual = document.createElement("div");
      visual.className = "homepage-selection-visual";

      if (project.cover_image_url) {
        const image = document.createElement("img");
        image.src = project.cover_image_url;
        image.alt = project.cover_image_alt || "";
        image.loading = "lazy";
        visual.appendChild(image);
      } else {
        const missing = document.createElement("span");
        missing.textContent = "NO COVER";
        visual.appendChild(missing);
      }

      const body = document.createElement("div");
      body.className = "homepage-selection-body";

      const top = document.createElement("div");
      top.className = "homepage-selection-top";

      const titleBlock = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = project.title;
      const meta = document.createElement("small");
      meta.textContent =
        categoryName(project.category_id) +
        " · " +
        (project.is_published ? "Published" : "Draft") +
        " · " +
        (project.visibility === "private" ? "Private" : "Public");
      titleBlock.append(title, meta);

      const eligibility = document.createElement("b");
      eligibility.className = eligible ? "eligible" : "ineligible";
      eligibility.textContent = eligible ? "Eligible" : "Not eligible";

      top.append(titleBlock, eligibility);

      const summary = document.createElement("p");
      summary.textContent = project.summary || "No summary";

      const controls = document.createElement("div");
      controls.className = "homepage-selection-controls";

      const showLabel = document.createElement("label");
      const showInput = document.createElement("input");
      showInput.type = "checkbox";
      showInput.checked = Boolean(project.show_on_homepage);

      const mayTurnOffStaleSelection =
        project.show_on_homepage && !eligible;

      showInput.disabled = !eligible && !mayTurnOffStaleSelection;
      if (showInput.disabled) showInput.dataset.locked = "true";

      const showText = document.createElement("span");
      showText.textContent = "Show on homepage";
      showLabel.append(showInput, showText);

      const featuredLabel = document.createElement("label");
      const featuredInput = document.createElement("input");
      featuredInput.type = "checkbox";
      featuredInput.checked = Boolean(project.is_featured);
      featuredInput.disabled = !project.show_on_homepage || !eligible;
      if (featuredInput.disabled) featuredInput.dataset.locked = "true";

      const featuredText = document.createElement("span");
      featuredText.textContent = "Featured priority";
      featuredLabel.append(featuredInput, featuredText);

      showInput.addEventListener("change", () => {
        if (showInput.checked) {
          if (!eligible) {
            showInput.checked = false;
            setMessage("Only published public projects with a cover can be selected.");
            return;
          }

          if (selectedCount() >= 4 && !project.show_on_homepage) {
            showInput.checked = false;
            setMessage("Homepage is limited to 4 Portfolio Engine projects.");
            return;
          }

          project.show_on_homepage = true;
        } else {
          project.show_on_homepage = false;
          project.is_featured = false;
        }

        setMessage("Selection changed. Save homepage selection when ready.");
        renderList();
      });

      featuredInput.addEventListener("change", () => {
        if (featuredInput.checked) {
          if (!eligible) {
            featuredInput.checked = false;
            setMessage("Only eligible homepage projects can be featured.");
            return;
          }

          if (!project.show_on_homepage) {
            if (selectedCount() >= 4) {
              featuredInput.checked = false;
              setMessage("Homepage is limited to 4 Portfolio Engine projects.");
              return;
            }
            project.show_on_homepage = true;
          }

          projects.forEach((item) => {
            item.is_featured = item.id === project.id;
          });
        } else {
          project.is_featured = false;
        }

        setMessage("Featured priority changed. Save homepage selection when ready.");
        renderList();
      });

      controls.append(showLabel, featuredLabel);

      const reason = document.createElement("small");
      reason.className = "homepage-selection-reason";

      if (eligible) {
        reason.textContent =
          "Published + public + optimized cover. Ready for homepage selection.";
      } else if (!project.is_published) {
        reason.textContent = "Publish this project in Phase 3C before selecting it.";
      } else if (project.visibility !== "public") {
        reason.textContent = "Private projects cannot appear on the public homepage.";
      } else {
        reason.textContent = "Attach an optimized cover in Phase 3C before selecting it.";
      }

      body.append(top, summary, controls, reason);
      card.append(visual, body);
      list.appendChild(card);
    });

    renderPreview();
  };

  const loadData = async () => {
    setBusy(true);
    setState("Loading…");
    setMessage("Loading published project selection data…");

    try {
      const [categoryResult, projectResult] = await Promise.all([
        supabaseClient
          .from("portfolio_categories")
          .select("id,name,slug,is_active")
          .order("name", { ascending: true }),
        supabaseClient
          .from("portfolio_projects")
          .select(
            "id,slug,title,summary,category_id,cover_image_url,cover_image_alt,action_label,action_href,is_featured,show_on_homepage,sort_order,visibility,is_published,published_at,created_at"
          )
          .order("sort_order", { ascending: true })
          .order("published_at", { ascending: false, nullsFirst: false })
          .order("created_at", { ascending: false })
      ]);

      if (categoryResult.error) throw categoryResult.error;
      if (projectResult.error) throw projectResult.error;

      categories = categoryResult.data || [];
      projects = projectResult.data || [];

      baseline = new Map(
        projects.map((project) => [
          project.id,
          {
            show_on_homepage: Boolean(project.show_on_homepage),
            is_featured: Boolean(project.is_featured)
          }
        ])
      );

      renderCategoryFilter();
      renderList();

      setState("Selection ready");
      setMessage(
        projects.length +
          (projects.length === 1 ? " project loaded. " : " projects loaded. ") +
          selectedCount() +
          " selected for homepage."
      );

      return true;
    } catch (error) {
      console.error("Homepage selection load failed:", error);
      setState("Load failed");
      setMessage(error?.message || "Could not load Phase 3D project selection.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  saveButton.addEventListener("click", async () => {
    const changed = projects.filter((project) => {
      const initial = baseline.get(project.id);
      if (!initial) return false;

      return (
        initial.show_on_homepage !== Boolean(project.show_on_homepage) ||
        initial.is_featured !== Boolean(project.is_featured)
      );
    });

    if (!changed.length) {
      setMessage("No homepage selection changes to save.");
      return;
    }

    if (selectedCount() > 4) {
      setMessage("Homepage is limited to 4 Portfolio Engine projects.");
      return;
    }

    const invalidSelected = projects.find(
      (project) => project.show_on_homepage && !isEligible(project)
    );

    if (invalidSelected) {
      setMessage(
        'Remove "' +
          invalidSelected.title +
          '" from homepage selection before saving because it is not eligible.'
      );
      return;
    }

    setBusy(true);
    saveButton.textContent = "Saving…";
    setMessage("Saving homepage selection…");

    try {
      for (const project of changed) {
        const result = await supabaseClient
          .from("portfolio_projects")
          .update({
            show_on_homepage: Boolean(project.show_on_homepage),
            is_featured:
              Boolean(project.show_on_homepage) && Boolean(project.is_featured)
          })
          .eq("id", project.id);

        if (result.error) throw result.error;
      }

      await loadData();
      setMessage(
        "Homepage selection saved. Public homepage will use eligible selected projects; empty selection keeps the Phase 2 fallback."
      );
    } catch (error) {
      console.error("Homepage selection save failed:", error);
      setMessage(error?.message || "Could not save homepage selection.");
    } finally {
      saveButton.textContent = "Save homepage selection";
      setBusy(false);
    }
  });

  categoryFilter.addEventListener("change", renderList);
  refreshButton?.addEventListener("click", loadData);

  navButton.addEventListener("click", async () => {
    showCmsView("homepage-selection");
    await loadData();
  });
};
