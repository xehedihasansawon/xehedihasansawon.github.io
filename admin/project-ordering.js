export const initProjectOrdering = ({ supabaseClient, showCmsView }) => {
  const navButton = document.querySelector("#projectOrderingNavButton");
  const state = document.querySelector("#projectOrderingState");
  const message = document.querySelector("#projectOrderingMessage");
  const refreshButton = document.querySelector("#projectOrderingRefreshButton");
  const count = document.querySelector("#projectOrderingCount");
  const saveButton = document.querySelector("#projectOrderingSaveButton");
  const list = document.querySelector("#projectOrderingList");

  if (!navButton || !saveButton || !list) return;

  let projects = [];
  let categories = [];
  let workingOrder = [];
  let dirty = false;
  let busy = false;
  let dragId = null;

  const setState = (value) => {
    if (state) state.textContent = value;
  };

  const setMessage = (value = "") => {
    if (message) message.textContent = value;
  };

  const categoryName = (id) =>
    categories.find((item) => item.id === id)?.name || "Uncategorized";

  const compareProjects = (a, b) => {
    const orderDiff = (a.sort_order ?? 0) - (b.sort_order ?? 0);
    if (orderDiff) return orderDiff;

    const aDate = Date.parse(a.created_at || 0) || 0;
    const bDate = Date.parse(b.created_at || 0) || 0;
    return bDate - aDate;
  };

  const setBusy = (isBusy) => {
    busy = isBusy;

    if (refreshButton) refreshButton.disabled = isBusy;
    saveButton.disabled = isBusy || !dirty || !workingOrder.length;

    list.querySelectorAll("button").forEach((button) => {
      button.disabled = isBusy || button.dataset.boundary === "true";
    });

    list.querySelectorAll("[draggable]").forEach((row) => {
      row.setAttribute("draggable", isBusy ? "false" : "true");
    });
  };

  const setDirty = (value, note = "") => {
    dirty = value;
    saveButton.disabled = busy || !dirty || !workingOrder.length;
    if (note) setMessage(note);
  };

  const moveProject = (fromIndex, toIndex) => {
    if (
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= workingOrder.length ||
      toIndex >= workingOrder.length ||
      fromIndex === toIndex
    ) {
      return;
    }

    const [moved] = workingOrder.splice(fromIndex, 1);
    workingOrder.splice(toIndex, 0, moved);

    setDirty(true, "Order changed. Press Save order when ready.");
    renderList();
  };

  const renderList = () => {
    list.replaceChildren();

    if (count) {
      count.textContent =
        workingOrder.length +
        (workingOrder.length === 1 ? " project" : " projects");
    }

    if (!workingOrder.length) {
      const empty = document.createElement("div");
      empty.className = "manager-empty";
      empty.textContent = "No projects available to order.";
      list.appendChild(empty);
      saveButton.disabled = true;
      return;
    }

    workingOrder.forEach((project, index) => {
      const row = document.createElement("article");
      row.className = "project-ordering-row";
      row.dataset.projectId = project.id;
      row.setAttribute("draggable", busy ? "false" : "true");

      const handle = document.createElement("div");
      handle.className = "project-ordering-handle";
      handle.setAttribute("aria-hidden", "true");
      handle.textContent = "⋮⋮";

      const number = document.createElement("span");
      number.className = "project-ordering-number";
      number.textContent = String(index + 1).padStart(2, "0");

      const body = document.createElement("div");
      body.className = "project-ordering-body";

      const title = document.createElement("strong");
      title.textContent = project.title;

      const meta = document.createElement("small");
      meta.textContent =
        categoryName(project.category_id) +
        " · " +
        (project.is_published ? "Published" : "Draft") +
        " · " +
        (project.visibility === "private" ? "Private" : "Public");

      body.append(title, meta);

      const controls = document.createElement("div");
      controls.className = "project-ordering-controls";

      const up = document.createElement("button");
      up.type = "button";
      up.textContent = "↑";
      up.title = "Move up";
      up.setAttribute("aria-label", "Move " + project.title + " up");
      up.dataset.boundary = index === 0 ? "true" : "false";
      up.disabled = busy || index === 0;
      up.addEventListener("click", () => moveProject(index, index - 1));

      const down = document.createElement("button");
      down.type = "button";
      down.textContent = "↓";
      down.title = "Move down";
      down.setAttribute("aria-label", "Move " + project.title + " down");
      down.dataset.boundary =
        index === workingOrder.length - 1 ? "true" : "false";
      down.disabled = busy || index === workingOrder.length - 1;
      down.addEventListener("click", () => moveProject(index, index + 1));

      controls.append(up, down);
      row.append(handle, number, body, controls);

      row.addEventListener("dragstart", (event) => {
        if (busy) {
          event.preventDefault();
          return;
        }

        dragId = project.id;
        row.classList.add("dragging");

        if (event.dataTransfer) {
          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.setData("text/plain", project.id);
        }
      });

      row.addEventListener("dragend", () => {
        dragId = null;
        row.classList.remove("dragging");
        list
          .querySelectorAll(".drag-over")
          .forEach((item) => item.classList.remove("drag-over"));
      });

      row.addEventListener("dragover", (event) => {
        if (!dragId || dragId === project.id) return;
        event.preventDefault();

        list
          .querySelectorAll(".drag-over")
          .forEach((item) => item.classList.remove("drag-over"));

        row.classList.add("drag-over");

        if (event.dataTransfer) {
          event.dataTransfer.dropEffect = "move";
        }
      });

      row.addEventListener("dragleave", () => {
        row.classList.remove("drag-over");
      });

      row.addEventListener("drop", (event) => {
        event.preventDefault();
        row.classList.remove("drag-over");

        if (!dragId || dragId === project.id) return;

        const fromIndex = workingOrder.findIndex(
          (item) => item.id === dragId
        );
        const toIndex = workingOrder.findIndex(
          (item) => item.id === project.id
        );

        moveProject(fromIndex, toIndex);
        dragId = null;
      });

      list.appendChild(row);
    });

    saveButton.disabled = busy || !dirty;
  };

  const loadData = async () => {
    setBusy(true);
    setState("Loading…");
    setMessage("Loading project order…");

    try {
      const [categoryResult, projectResult] = await Promise.all([
        supabaseClient
          .from("portfolio_categories")
          .select("id,name")
          .order("name", { ascending: true }),
        supabaseClient
          .from("portfolio_projects")
          .select(
            "id,slug,title,category_id,visibility,is_published,sort_order,created_at"
          )
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false })
      ]);

      if (categoryResult.error) throw categoryResult.error;
      if (projectResult.error) throw projectResult.error;

      categories = categoryResult.data || [];
      projects = projectResult.data || [];
      workingOrder = [...projects].sort(compareProjects);
      dirty = false;

      setState("Ordering ready");
      setMessage(
        projects.length +
          (projects.length === 1 ? " project loaded." : " projects loaded.")
      );

      return true;
    } catch (error) {
      console.error("Project ordering load failed:", error);
      setState("Load failed");
      setMessage(error?.message || "Could not load project ordering.");
      return false;
    } finally {
      setBusy(false);
      renderList();
    }
  };

  refreshButton?.addEventListener("click", loadData);

  saveButton.addEventListener("click", async () => {
    if (!dirty || !workingOrder.length) {
      setMessage("No ordering changes to save.");
      return;
    }

    setBusy(true);
    saveButton.textContent = "Saving…";
    setMessage("Saving project order…");

    try {
      for (let index = 0; index < workingOrder.length; index += 1) {
        const project = workingOrder[index];

        const result = await supabaseClient
          .from("portfolio_projects")
          .update({ sort_order: index })
          .eq("id", project.id);

        if (result.error) throw result.error;

        project.sort_order = index;

        const source = projects.find((item) => item.id === project.id);
        if (source) source.sort_order = index;
      }

      setDirty(false);
      setMessage("Project order saved.");
      renderList();
    } catch (error) {
      console.error("Project ordering save failed:", error);
      setMessage(error?.message || "Could not save project order.");
    } finally {
      saveButton.textContent = "Save order";
      setBusy(false);
    }
  });

  navButton.addEventListener("click", async () => {
    showCmsView("project-ordering");
    await loadData();
  });
};
