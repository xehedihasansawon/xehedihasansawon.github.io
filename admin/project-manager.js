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

  if (!navButton || !categoryForm) return;

  let categories = [];

  const slugify = (value) =>
    String(value || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);

  const isValidSlug = (value) => {
    const slug = String(value || "").trim();
    return (
      slug.length >= 2 &&
      slug.length <= 80 &&
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
    );
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

  const setBusy = (busy) => {
    [refreshButton, categorySaveButton, categoryCancelButton].forEach((button) => {
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

    if (clearMessage) {
      setCategoryMessage("");
    }
  };

  const formatSaveError = (error) => {
    if (error?.code === "23505") {
      return "That category slug already exists. Use a different slug.";
    }

    return error?.message || "Could not save category.";
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
        const confirmed = window.confirm(
          'Delete category "' +
            item.name +
            '"? Any projects linked to this category will become uncategorized.'
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

          await loadCategories();
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

  const loadCategories = async () => {
    setBusy(true);
    setState("Loading…");
    setMessage("Loading portfolio categories…");

    try {
      const result = await supabaseClient
        .from("portfolio_categories")
        .select("id,slug,name,description,sort_order,is_active,created_at,updated_at")
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true });

      if (result.error) throw result.error;

      categories = result.data || [];
      renderCategories();

      setState("Categories ready");
      setMessage(
        categories.length +
          (categories.length === 1
            ? " category loaded. Project management comes after this checkpoint is approved."
            : " categories loaded. Project management comes after this checkpoint is approved.")
      );

      return true;
    } catch (error) {
      console.error("Category manager load failed:", error);
      setState("Load failed");
      setMessage(error?.message || "Could not load portfolio categories.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  categoryNameInput.addEventListener("input", () => {
    if (!categoryIdInput.value && !categorySlugInput.dataset.manual) {
      categorySlugInput.value = slugify(categoryNameInput.value);
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

    if (!isValidSlug(slug)) {
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
      await loadCategories();
      setCategoryMessage(id ? "Category updated." : "Category created.");
    } catch (error) {
      console.error("Category save failed:", error);
      setCategoryMessage(formatSaveError(error));
      categorySaveButton.textContent = id ? "Update category" : "Save category";
    } finally {
      setBusy(false);
    }
  });

  refreshButton?.addEventListener("click", loadCategories);

  navButton.addEventListener("click", async () => {
    showCmsView("project-manager");
    await loadCategories();
  });

  resetCategoryForm();
};
