const clean = (value) => String(value || "").trim();

const create = (tag, text = "", className = "") => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
};

export const initTestimonialsManager = ({ supabaseClient, showCmsView }) => {
  const navButton = document.querySelector("#testimonialsNavButton");
  const editor = document.querySelector("#testimonialsEditor");
  const state = document.querySelector("#testimonialsState");
  const message = document.querySelector("#testimonialsMessage");
  const refreshButton = document.querySelector("#testimonialsRefreshButton");
  const filter = document.querySelector("#testimonialsFilter");
  const count = document.querySelector("#testimonialsCount");
  const list = document.querySelector("#testimonialsList");

  const form = document.querySelector("#testimonialAdminForm");
  const idInput = document.querySelector("#testimonialId");
  const nameInput = document.querySelector("#testimonialName");
  const emailInput = document.querySelector("#testimonialEmail");
  const roleInput = document.querySelector("#testimonialRole");
  const companyInput = document.querySelector("#testimonialCompany");
  const projectInput = document.querySelector("#testimonialProject");
  const feedbackInput = document.querySelector("#testimonialFeedback");
  const consentInput = document.querySelector("#testimonialConsent");
  const statusInput = document.querySelector("#testimonialStatus");
  const orderInput = document.querySelector("#testimonialOrder");
  const saveButton = document.querySelector("#testimonialSaveButton");
  const newButton = document.querySelector("#testimonialNewButton");
  const deleteButton = document.querySelector("#testimonialDeleteButton");

  if (
    !navButton ||
    !editor ||
    !state ||
    !message ||
    !refreshButton ||
    !filter ||
    !count ||
    !list ||
    !form ||
    !idInput ||
    !nameInput ||
    !emailInput ||
    !roleInput ||
    !companyInput ||
    !projectInput ||
    !feedbackInput ||
    !consentInput ||
    !statusInput ||
    !orderInput ||
    !saveButton ||
    !newButton ||
    !deleteButton
  ) {
    return;
  }

  let rows = [];
  let busy = false;

  const setState = (value) => {
    state.textContent = value;
  };

  const setMessage = (value = "") => {
    message.textContent = value;
  };

  const setBusy = (value) => {
    busy = value;
    [
      refreshButton,
      filter,
      saveButton,
      newButton,
      deleteButton
    ].forEach((item) => {
      item.disabled = value;
    });
    saveButton.textContent = value ? "Saving…" : "Save feedback";
  };

  const selected = () =>
    rows.find((row) => row.id === idInput.value) || null;

  const resetForm = ({ keepMessage = false } = {}) => {
    form.reset();
    idInput.value = "";
    statusInput.value = "pending";
    orderInput.value = "0";
    consentInput.checked = false;
    deleteButton.hidden = true;
    setState("New feedback");
    if (!keepMessage) setMessage("Create a testimonial manually or select submitted feedback to review.");
  };

  const populateForm = (row) => {
    if (!row) {
      resetForm();
      return;
    }

    idInput.value = row.id;
    nameInput.value = row.client_name || "";
    emailInput.value = row.client_email || "";
    roleInput.value = row.client_role || "";
    companyInput.value = row.company || "";
    projectInput.value = row.project_label || "";
    feedbackInput.value = row.feedback_text || "";
    consentInput.checked = row.consent_public === true;
    statusInput.value = row.status || "pending";
    orderInput.value = String(row.sort_order ?? 0);
    deleteButton.hidden = false;
    setState("Editing " + (row.client_name || "feedback"));
    setMessage(
      row.status === "approved"
        ? "Approved feedback is public only when display consent is checked."
        : "Review the feedback before approving it for public display."
    );
  };

  const visibleRows = () => {
    const value = filter.value;
    return value === "all"
      ? rows
      : rows.filter((row) => row.status === value);
  };

  const renderList = () => {
    list.replaceChildren();

    const filtered = visibleRows();
    count.textContent = filtered.length + (filtered.length === 1 ? " item" : " items");

    if (!filtered.length) {
      const empty = create(
        "div",
        "No feedback in this view.",
        "manager-empty"
      );
      list.appendChild(empty);
      return;
    }

    filtered.forEach((row) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "testimonial-list-item";
      if (row.id === idInput.value) button.classList.add("active");

      const top = create("div", "", "testimonial-list-top");
      top.append(
        create("strong", row.client_name || "Client"),
        create("span", row.status || "pending")
      );

      const context = [
        clean(row.client_role),
        clean(row.company),
        clean(row.project_label)
      ].filter(Boolean).join(" · ");

      const excerpt =
        clean(row.feedback_text).length > 130
          ? clean(row.feedback_text).slice(0, 127) + "…"
          : clean(row.feedback_text);

      button.append(
        top,
        create("small", context || "No client context"),
        create("p", excerpt)
      );

      button.addEventListener("click", () => {
        populateForm(row);
        renderList();
      });

      list.appendChild(button);
    });
  };

  const load = async () => {
    setBusy(true);
    setState("Loading…");
    setMessage("Loading client feedback…");

    try {
      const { data, error } = await supabaseClient
        .from("portfolio_feedback")
        .select(
          "id,client_name,client_email,client_role,company,project_label,feedback_text,consent_public,status,sort_order,submitted_at,updated_at"
        )
        .order("submitted_at", { ascending: false });

      if (error) {
        if (/portfolio_feedback/i.test(error.message || "")) {
          throw new Error(
            "Phase 5D feedback table is missing. Run migration 018_client_feedback_testimonials.sql first."
          );
        }
        throw error;
      }

      rows = data || [];
      renderList();

      const current = selected();
      if (current) populateForm(current);
      else resetForm({ keepMessage: true });

      setState("Ready");
      setMessage(
        rows.length
          ? "Select submitted feedback to review, approve, hide or edit."
          : "No feedback yet. Public submissions will appear here as Pending."
      );

      return true;
    } catch (error) {
      console.error("Testimonials load failed:", error);
      rows = [];
      renderList();
      resetForm({ keepMessage: true });
      setState("Load failed");
      setMessage(error?.message || "Could not load client feedback.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const validate = () => {
    if (!clean(nameInput.value)) return "Client name is required.";
    if (clean(nameInput.value).length > 100) return "Client name is too long.";

    const email = clean(emailInput.value);
    if (!email || email.length > 254 || !email.includes("@")) {
      return "A valid private client email is required.";
    }

    if (clean(roleInput.value).length > 120) return "Client role is too long.";
    if (clean(companyInput.value).length > 120) return "Company is too long.";
    if (clean(projectInput.value).length > 160) return "Project label is too long.";

    const feedback = clean(feedbackInput.value);
    if (feedback.length < 20 || feedback.length > 1200) {
      return "Feedback must be between 20 and 1200 characters.";
    }

    const sortOrder = Number.parseInt(orderInput.value, 10);
    if (!Number.isInteger(sortOrder) || sortOrder < 0) {
      return "Sort order must be zero or higher.";
    }

    if (statusInput.value === "approved" && !consentInput.checked) {
      return "Approved testimonials require public display consent.";
    }

    return "";
  };

  const save = async () => {
    const validation = validate();
    if (validation) {
      setState("Check fields");
      setMessage(validation);
      return false;
    }

    const payload = {
      client_name: clean(nameInput.value),
      client_email: clean(emailInput.value).toLowerCase(),
      client_role: clean(roleInput.value),
      company: clean(companyInput.value),
      project_label: clean(projectInput.value),
      feedback_text: clean(feedbackInput.value),
      consent_public: consentInput.checked,
      status: statusInput.value,
      sort_order: Number.parseInt(orderInput.value, 10)
    };

    setBusy(true);
    setState("Saving…");
    setMessage("Saving client feedback…");

    try {
      let result;

      if (idInput.value) {
        result = await supabaseClient
          .from("portfolio_feedback")
          .update(payload)
          .eq("id", idInput.value)
          .select(
            "id,client_name,client_email,client_role,company,project_label,feedback_text,consent_public,status,sort_order,submitted_at,updated_at"
          )
          .single();
      } else {
        result = await supabaseClient
          .from("portfolio_feedback")
          .insert(payload)
          .select(
            "id,client_name,client_email,client_role,company,project_label,feedback_text,consent_public,status,sort_order,submitted_at,updated_at"
          )
          .single();
      }

      if (result.error) throw result.error;

      const saved = result.data;
      const index = rows.findIndex((row) => row.id === saved.id);
      if (index >= 0) rows[index] = saved;
      else rows.unshift(saved);

      idInput.value = saved.id;
      populateForm(saved);
      renderList();

      setState("Saved");
      setMessage(
        saved.status === "approved"
          ? "Saved. This testimonial is eligible for public display."
          : "Saved. This feedback is not public."
      );

      return true;
    } catch (error) {
      console.error("Testimonials save failed:", error);
      setState("Save failed");
      setMessage(error?.message || "Could not save client feedback.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    const row = selected();
    if (!row || busy) return;

    const confirmed = window.confirm(
      "Permanently delete this client feedback?"
    );
    if (!confirmed) return;

    setBusy(true);
    setState("Deleting…");
    setMessage("Deleting client feedback…");

    try {
      const { error } = await supabaseClient
        .from("portfolio_feedback")
        .delete()
        .eq("id", row.id);

      if (error) throw error;

      rows = rows.filter((item) => item.id !== row.id);
      resetForm({ keepMessage: true });
      renderList();
      setState("Deleted");
      setMessage("Client feedback permanently deleted.");
    } catch (error) {
      console.error("Testimonials delete failed:", error);
      setState("Delete failed");
      setMessage(error?.message || "Could not delete client feedback.");
    } finally {
      setBusy(false);
    }
  };

  navButton.addEventListener("click", async () => {
    showCmsView("testimonials");
    await load();
  });

  refreshButton.addEventListener("click", load);
  filter.addEventListener("change", renderList);
  newButton.addEventListener("click", () => {
    resetForm();
    renderList();
  });
  deleteButton.addEventListener("click", remove);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await save();
  });

  resetForm();
};
