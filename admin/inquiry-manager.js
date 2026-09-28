const STATUS_LABELS = {
  new: "New",
  read: "Read",
  replied: "Replied",
  archived: "Archived"
};

const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Unknown date"
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short"
      }).format(date);
};

const cleanText = (value, max = 3000) =>
  String(value || "").trim().slice(0, max);

export const initInquiryManager = ({ supabaseClient, showCmsView }) => {
  const navButton = document.querySelector("#inquiryNavButton");
  const state = document.querySelector("#inquiryState");
  const message = document.querySelector("#inquiryMessage");
  const refreshButton = document.querySelector("#inquiryRefreshButton");
  const filter = document.querySelector("#inquiryStatusFilter");
  const list = document.querySelector("#inquiryList");
  const empty = document.querySelector("#inquiryEmpty");
  const detail = document.querySelector("#inquiryDetail");
  const detailEmpty = document.querySelector("#inquiryDetailEmpty");
  const detailName = document.querySelector("#inquiryDetailName");
  const detailEmail = document.querySelector("#inquiryDetailEmail");
  const detailMeta = document.querySelector("#inquiryDetailMeta");
  const detailMessage = document.querySelector("#inquiryDetailMessage");
  const detailSource = document.querySelector("#inquiryDetailSource");
  const detailCreated = document.querySelector("#inquiryDetailCreated");
  const statusSelect = document.querySelector("#inquiryDetailStatus");
  const notes = document.querySelector("#inquiryAdminNotes");
  const saveButton = document.querySelector("#inquirySaveButton");
  const deleteButton = document.querySelector("#inquiryDeleteButton");
  const actionMessage = document.querySelector("#inquiryActionMessage");

  if (
    !navButton ||
    !list ||
    !detail ||
    !statusSelect ||
    !notes ||
    !saveButton ||
    !deleteButton
  ) {
    return;
  }

  let inquiries = [];
  let selectedId = "";
  let busy = false;

  const setState = (value) => {
    if (state) state.textContent = value;
  };

  const setMessage = (value = "") => {
    if (message) message.textContent = value;
  };

  const setActionMessage = (value = "") => {
    if (actionMessage) actionMessage.textContent = value;
  };

  const getSelected = () =>
    inquiries.find((item) => item.id === selectedId) || null;

  const setBusy = (value) => {
    busy = value;
    refreshButton.disabled = value;
    filter.disabled = value;
    statusSelect.disabled = value || !selectedId;
    notes.disabled = value || !selectedId;
    saveButton.disabled = value || !selectedId;
    deleteButton.disabled = value || !selectedId;
  };

  const renderDetail = () => {
    const item = getSelected();
    const hasItem = Boolean(item);

    detail.hidden = !hasItem;
    if (detailEmpty) detailEmpty.hidden = hasItem;

    if (!item) {
      setBusy(busy);
      return;
    }

    detailName.textContent = item.name || "Unnamed inquiry";
    detailEmail.textContent = item.email || "—";
    detailEmail.href = item.email
      ? "mailto:" + encodeURIComponent(item.email)
      : "#";

    const metaParts = [
      item.project_type,
      item.budget || "Budget not specified",
      item.timeline || "Timeline not specified"
    ].filter(Boolean);

    detailMeta.textContent = metaParts.join(" · ");
    detailMessage.textContent = item.message || "";
    detailSource.textContent = item.source_page || "/";
    detailCreated.textContent = formatDate(item.created_at);
    statusSelect.value = item.status || "new";
    notes.value = item.admin_notes || "";
    setActionMessage("");
    setBusy(busy);
  };

  const visibleInquiries = () => {
    const value = filter.value;
    if (!value || value === "all") return inquiries;
    return inquiries.filter((item) => item.status === value);
  };

  const renderList = () => {
    list.replaceChildren();
    const visible = visibleInquiries();

    if (empty) empty.hidden = visible.length > 0;

    visible.forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "inquiry-list-item";
      button.classList.toggle("active", item.id === selectedId);
      button.dataset.status = item.status || "new";

      const top = document.createElement("div");
      top.className = "inquiry-list-top";

      const name = document.createElement("strong");
      name.textContent = item.name || "Unnamed inquiry";

      const status = document.createElement("span");
      status.className = "inquiry-status-chip";
      status.textContent = STATUS_LABELS[item.status] || "New";

      top.append(name, status);

      const project = document.createElement("span");
      project.textContent = item.project_type || "Project inquiry";

      const preview = document.createElement("small");
      preview.textContent =
        cleanText(item.message, 110) || "No message preview";

      const time = document.createElement("time");
      time.textContent = formatDate(item.created_at);

      button.append(top, project, preview, time);
      button.addEventListener("click", async () => {
        selectedId = item.id;

        if (item.status === "new") {
          const { data, error } = await supabaseClient
            .from("portfolio_inquiries")
            .update({ status: "read" })
            .eq("id", item.id)
            .select(
              "id,name,email,project_type,budget,timeline,message,source_page,status,admin_notes,created_at,updated_at"
            )
            .single();

          if (!error && data) {
            const index = inquiries.findIndex((row) => row.id === item.id);
            if (index >= 0) inquiries[index] = data;
          }
        }

        renderList();
        renderDetail();
      });

      list.appendChild(button);
    });

    const newCount = inquiries.filter((item) => item.status === "new").length;
    setState(
      inquiries.length +
        (inquiries.length === 1 ? " inquiry" : " inquiries") +
        (newCount ? " · " + newCount + " new" : "")
    );
  };

  const loadData = async () => {
    setBusy(true);
    setMessage("Loading client inquiries…");
    setActionMessage("");

    try {
      const { data, error } = await supabaseClient
        .from("portfolio_inquiries")
        .select(
          "id,name,email,project_type,budget,timeline,message,source_page,status,admin_notes,created_at,updated_at"
        )
        .order("created_at", { ascending: false });

      if (error) {
        if (/portfolio_inquiries/i.test(error.message || "")) {
          throw new Error(
            "Phase 5A inquiry table is missing. Run migration 014_client_inquiry_system.sql first."
          );
        }
        throw error;
      }

      inquiries = data || [];

      if (selectedId && !inquiries.some((item) => item.id === selectedId)) {
        selectedId = "";
      }

      renderList();
      renderDetail();
      setMessage(
        inquiries.length
          ? "Inbox ready. Opening a New inquiry marks it as Read."
          : "No inquiries yet."
      );
      return true;
    } catch (error) {
      console.error("Inquiry inbox load failed:", error);
      inquiries = [];
      selectedId = "";
      renderList();
      renderDetail();
      setState("Load failed");
      setMessage(error?.message || "Could not load client inquiries.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  filter.addEventListener("change", () => {
    if (
      selectedId &&
      !visibleInquiries().some((item) => item.id === selectedId)
    ) {
      selectedId = "";
    }
    renderList();
    renderDetail();
  });

  saveButton.addEventListener("click", async () => {
    const item = getSelected();
    if (!item) return;

    setBusy(true);
    setActionMessage("Saving…");

    try {
      const payload = {
        status: statusSelect.value,
        admin_notes: cleanText(notes.value, 3000)
      };

      const { data, error } = await supabaseClient
        .from("portfolio_inquiries")
        .update(payload)
        .eq("id", item.id)
        .select(
          "id,name,email,project_type,budget,timeline,message,source_page,status,admin_notes,created_at,updated_at"
        )
        .single();

      if (error) throw error;

      const index = inquiries.findIndex((row) => row.id === item.id);
      if (index >= 0) inquiries[index] = data;

      renderList();
      renderDetail();
      setActionMessage("Saved.");
    } catch (error) {
      console.error("Inquiry update failed:", error);
      setActionMessage(error?.message || "Could not save this inquiry.");
    } finally {
      setBusy(false);
    }
  });

  deleteButton.addEventListener("click", async () => {
    const item = getSelected();
    if (!item) return;

    const confirmed = window.confirm(
      "Delete this inquiry permanently? This cannot be undone."
    );
    if (!confirmed) return;

    setBusy(true);
    setActionMessage("Deleting…");

    try {
      const { error } = await supabaseClient
        .from("portfolio_inquiries")
        .delete()
        .eq("id", item.id);

      if (error) throw error;

      inquiries = inquiries.filter((row) => row.id !== item.id);
      selectedId = "";
      renderList();
      renderDetail();
      setMessage("Inquiry deleted.");
    } catch (error) {
      console.error("Inquiry delete failed:", error);
      setActionMessage(error?.message || "Could not delete this inquiry.");
    } finally {
      setBusy(false);
    }
  });

  refreshButton.addEventListener("click", loadData);

  navButton.addEventListener("click", async () => {
    showCmsView("inquiries");
    await loadData();
  });

  renderList();
  renderDetail();
};
