const clean = (value) => String(value || "").trim();

const splitLines = (value) =>
  String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 60);

const byId = (id) => document.getElementById(id);

const create = (tag, text = "", className = "") => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
};

const emptyResume = () => ({
  personal: {
    fullName: "",
    headline: "",
    summary: "",
    location: "",
    email: "",
    phone: "",
    website: "",
    linkedin: "",
    behance: "",
    github: ""
  },
  skills: [],
  languages: [],
  certifications: [],
  experience: [],
  education: []
});

const normalizeResume = (value) => {
  const source = value && typeof value === "object" ? value : {};
  const personal =
    source.personal && typeof source.personal === "object"
      ? source.personal
      : {};

  const normalizeEntries = (items, keys) =>
    Array.isArray(items)
      ? items.slice(0, 20).map((item) => {
          const row = {};
          keys.forEach((key) => {
            row[key] = clean(item?.[key]);
          });
          return row;
        })
      : [];

  return {
    personal: {
      fullName: clean(personal.fullName),
      headline: clean(personal.headline),
      summary: clean(personal.summary),
      location: clean(personal.location),
      email: clean(personal.email),
      phone: clean(personal.phone),
      website: clean(personal.website),
      linkedin: clean(personal.linkedin),
      behance: clean(personal.behance),
      github: clean(personal.github)
    },
    skills: Array.isArray(source.skills)
      ? source.skills.map(clean).filter(Boolean).slice(0, 60)
      : [],
    languages: Array.isArray(source.languages)
      ? source.languages.map(clean).filter(Boolean).slice(0, 40)
      : [],
    certifications: Array.isArray(source.certifications)
      ? source.certifications.map(clean).filter(Boolean).slice(0, 40)
      : [],
    experience: normalizeEntries(source.experience, [
      "role",
      "company",
      "period",
      "details"
    ]),
    education: normalizeEntries(source.education, [
      "qualification",
      "institution",
      "period",
      "details"
    ])
  };
};

const makeExperienceRow = (data = {}) => {
  const row = create("article", "", "cv-entry-row");
  row.dataset.cvEntry = "experience";

  const grid = create("div", "", "cv-entry-grid");
  [
    ["role", "Role / position"],
    ["company", "Company / organization"],
    ["period", "Period"]
  ].forEach(([key, label]) => {
    const wrap = create("label");
    wrap.append(create("span", label));
    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = key === "period" ? 80 : 160;
    input.dataset.cvEntryField = key;
    input.value = clean(data[key]);
    wrap.append(input);
    grid.append(wrap);
  });

  const detailsWrap = create("label", "", "cv-entry-span");
  detailsWrap.append(create("span", "Details"));
  const details = document.createElement("textarea");
  details.rows = 3;
  details.maxLength = 1200;
  details.dataset.cvEntryField = "details";
  details.value = clean(data.details);
  detailsWrap.append(details);

  const actions = create("div", "", "cv-entry-actions");
  const up = create("button", "↑");
  const down = create("button", "↓");
  const remove = create("button", "Remove");
  [up, down, remove].forEach((button) => {
    button.type = "button";
  });
  remove.classList.add("danger-button");

  up.addEventListener("click", () => {
    const previous = row.previousElementSibling;
    if (previous) row.parentElement.insertBefore(row, previous);
    row.closest("form")?.dispatchEvent(new Event("input", { bubbles: true }));
  });

  down.addEventListener("click", () => {
    const next = row.nextElementSibling;
    if (next) row.parentElement.insertBefore(next, row);
    row.closest("form")?.dispatchEvent(new Event("input", { bubbles: true }));
  });

  remove.addEventListener("click", () => {
    const form = row.closest("form");
    row.remove();
    form?.dispatchEvent(new Event("input", { bubbles: true }));
  });

  actions.append(up, down, remove);
  row.append(grid, detailsWrap, actions);
  return row;
};

const makeEducationRow = (data = {}) => {
  const row = create("article", "", "cv-entry-row");
  row.dataset.cvEntry = "education";

  const grid = create("div", "", "cv-entry-grid");
  [
    ["qualification", "Qualification / program"],
    ["institution", "Institution"],
    ["period", "Period"]
  ].forEach(([key, label]) => {
    const wrap = create("label");
    wrap.append(create("span", label));
    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = key === "period" ? 80 : 180;
    input.dataset.cvEntryField = key;
    input.value = clean(data[key]);
    wrap.append(input);
    grid.append(wrap);
  });

  const detailsWrap = create("label", "", "cv-entry-span");
  detailsWrap.append(create("span", "Details"));
  const details = document.createElement("textarea");
  details.rows = 3;
  details.maxLength = 1200;
  details.dataset.cvEntryField = "details";
  details.value = clean(data.details);
  detailsWrap.append(details);

  const actions = create("div", "", "cv-entry-actions");
  const up = create("button", "↑");
  const down = create("button", "↓");
  const remove = create("button", "Remove");
  [up, down, remove].forEach((button) => {
    button.type = "button";
  });
  remove.classList.add("danger-button");

  up.addEventListener("click", () => {
    const previous = row.previousElementSibling;
    if (previous) row.parentElement.insertBefore(row, previous);
    row.closest("form")?.dispatchEvent(new Event("input", { bubbles: true }));
  });

  down.addEventListener("click", () => {
    const next = row.nextElementSibling;
    if (next) row.parentElement.insertBefore(next, row);
    row.closest("form")?.dispatchEvent(new Event("input", { bubbles: true }));
  });

  remove.addEventListener("click", () => {
    const form = row.closest("form");
    row.remove();
    form?.dispatchEvent(new Event("input", { bubbles: true }));
  });

  actions.append(up, down, remove);
  row.append(grid, detailsWrap, actions);
  return row;
};

const appendList = (parent, items, className = "") => {
  const values = items.filter(Boolean);
  if (!values.length) return;

  const ul = create("ul", "", className);
  values.forEach((item) => ul.append(create("li", item)));
  parent.append(ul);
};

export const initCvManager = ({ supabaseClient, showCmsView }) => {
  const navButton = byId("cvManagerNavButton");
  const editor = byId("cvManagerEditor");
  const state = byId("cvManagerState");
  const message = byId("cvManagerMessage");
  const refreshButton = byId("cvManagerRefreshButton");
  const newButton = byId("cvManagerNewButton");
  const duplicateButton = byId("cvManagerDuplicateButton");
  const deleteButton = byId("cvManagerDeleteButton");
  const printButton = byId("cvManagerPrintButton");
  const list = byId("cvManagerList");
  const count = byId("cvManagerCount");

  const form = byId("cvManagerForm");
  const idInput = byId("cvId");
  const labelInput = byId("cvLabel");
  const targetRoleInput = byId("cvTargetRole");
  const templateInput = byId("cvTemplate");
  const orderInput = byId("cvSortOrder");

  const fullNameInput = byId("cvFullName");
  const headlineInput = byId("cvHeadline");
  const summaryInput = byId("cvSummary");
  const locationInput = byId("cvLocation");
  const emailInput = byId("cvEmail");
  const phoneInput = byId("cvPhone");
  const websiteInput = byId("cvWebsite");
  const linkedinInput = byId("cvLinkedin");
  const behanceInput = byId("cvBehance");
  const githubInput = byId("cvGithub");

  const skillsInput = byId("cvSkills");
  const languagesInput = byId("cvLanguages");
  const certificationsInput = byId("cvCertifications");

  const experienceList = byId("cvExperienceList");
  const addExperienceButton = byId("cvAddExperienceButton");
  const educationList = byId("cvEducationList");
  const addEducationButton = byId("cvAddEducationButton");

  const saveButton = byId("cvManagerSaveButton");
  const preview = byId("cvPreview");

  if (
    !navButton ||
    !editor ||
    !form ||
    !list ||
    !preview ||
    !experienceList ||
    !educationList
  ) {
    return;
  }

  let rows = [];
  let busy = false;

  const setState = (value) => {
    if (state) state.textContent = value;
  };

  const setMessage = (value = "") => {
    if (message) message.textContent = value;
  };

  const setBusy = (value) => {
    busy = value;

    [refreshButton, newButton, saveButton].forEach((button) => {
      if (button) button.disabled = value;
    });

    if (duplicateButton) duplicateButton.disabled = value || !idInput.value;
    if (deleteButton) deleteButton.disabled = value || !idInput.value;
    if (printButton) printButton.disabled = value || !idInput.value;

    if (saveButton) saveButton.textContent = value ? "Saving…" : "Save CV";
  };

  const selected = () =>
    rows.find((row) => row.id === idInput.value) || null;

  const readEntries = (container, keys) =>
    [...container.querySelectorAll(".cv-entry-row")].map((row) => {
      const item = {};
      keys.forEach((key) => {
        item[key] = clean(
          row.querySelector(`[data-cv-entry-field="${key}"]`)?.value
        );
      });
      return item;
    }).filter((item) => Object.values(item).some(Boolean));

  const readForm = () => ({
    label: clean(labelInput.value),
    target_role: clean(targetRoleInput.value),
    template_key: templateInput.value,
    sort_order: Number.parseInt(orderInput.value || "0", 10),
    resume_data: {
      personal: {
        fullName: clean(fullNameInput.value),
        headline: clean(headlineInput.value),
        summary: clean(summaryInput.value),
        location: clean(locationInput.value),
        email: clean(emailInput.value),
        phone: clean(phoneInput.value),
        website: clean(websiteInput.value),
        linkedin: clean(linkedinInput.value),
        behance: clean(behanceInput.value),
        github: clean(githubInput.value)
      },
      skills: splitLines(skillsInput.value),
      languages: splitLines(languagesInput.value),
      certifications: splitLines(certificationsInput.value),
      experience: readEntries(experienceList, [
        "role",
        "company",
        "period",
        "details"
      ]),
      education: readEntries(educationList, [
        "qualification",
        "institution",
        "period",
        "details"
      ])
    }
  });

  const validate = (payload) => {
    if (!payload.label || payload.label.length > 80) {
      return "CV name is required and must be 80 characters or less.";
    }

    if (payload.target_role.length > 120) {
      return "Target role is too long.";
    }

    if (!["modern", "compact", "europass"].includes(payload.template_key)) {
      return "Choose a valid CV template.";
    }

    if (!Number.isInteger(payload.sort_order) || payload.sort_order < 0) {
      return "Sort order must be zero or higher.";
    }

    const p = payload.resume_data.personal;
    if (!p.fullName || p.fullName.length > 140) {
      return "Full name is required.";
    }

    if (p.headline.length > 180) return "Headline is too long.";
    if (p.location.length > 160) return "Location is too long.";
    if (p.email.length > 254) return "Email is too long.";
    if (p.phone.length > 80) return "Phone is too long.";

    return "";
  };

  const resetForm = () => {
    form.reset();
    idInput.value = "";
    templateInput.value = "modern";
    orderInput.value = "0";
    experienceList.replaceChildren();
    educationList.replaceChildren();
    experienceList.append(makeExperienceRow());
    educationList.append(makeEducationRow());
    deleteButton.hidden = true;
    duplicateButton.disabled = true;
    printButton.disabled = true;
    setState("New CV");
    setMessage("Create a private CV version. Nothing here is public.");
    renderPreview(readForm());
    renderList();
  };

  const populate = (row) => {
    if (!row) {
      resetForm();
      return;
    }

    const resume = normalizeResume(row.resume_data);

    idInput.value = row.id;
    labelInput.value = row.label || "";
    targetRoleInput.value = row.target_role || "";
    templateInput.value = row.template_key || "modern";
    orderInput.value = String(row.sort_order ?? 0);

    fullNameInput.value = resume.personal.fullName;
    headlineInput.value = resume.personal.headline;
    summaryInput.value = resume.personal.summary;
    locationInput.value = resume.personal.location;
    emailInput.value = resume.personal.email;
    phoneInput.value = resume.personal.phone;
    websiteInput.value = resume.personal.website;
    linkedinInput.value = resume.personal.linkedin;
    behanceInput.value = resume.personal.behance;
    githubInput.value = resume.personal.github;

    skillsInput.value = resume.skills.join("\n");
    languagesInput.value = resume.languages.join("\n");
    certificationsInput.value = resume.certifications.join("\n");

    experienceList.replaceChildren();
    (resume.experience.length ? resume.experience : [{}]).forEach((item) => {
      experienceList.append(makeExperienceRow(item));
    });

    educationList.replaceChildren();
    (resume.education.length ? resume.education : [{}]).forEach((item) => {
      educationList.append(makeEducationRow(item));
    });

    deleteButton.hidden = false;
    duplicateButton.disabled = false;
    printButton.disabled = false;
    setState("Editing " + row.label);
    setMessage("Private Admin-only CV loaded.");
    renderPreview(readForm());
    renderList();
  };

  const renderList = () => {
    list.replaceChildren();

    const ordered = [...rows].sort(
      (a, b) =>
        (a.sort_order ?? 0) - (b.sort_order ?? 0) ||
        String(a.label || "").localeCompare(String(b.label || ""))
    );

    count.textContent =
      ordered.length + (ordered.length === 1 ? " CV" : " CVs");

    if (!ordered.length) {
      list.append(
        create(
          "div",
          "No CV versions yet. Create your first private CV.",
          "manager-empty"
        )
      );
      return;
    }

    ordered.forEach((row) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "cv-manager-list-item";
      if (row.id === idInput.value) button.classList.add("active");

      const top = create("div", "", "cv-manager-list-top");
      top.append(
        create("strong", row.label || "Untitled CV"),
        create("span", row.template_key || "modern")
      );

      button.append(
        top,
        create("small", row.target_role || "No target role")
      );

      button.addEventListener("click", () => populate(row));
      list.append(button);
    });
  };

  const previewSection = (title, body) => {
    if (!body || !body.childNodes.length) return null;

    const section = create("section", "", "cv-preview-section");
    section.append(create("h3", title), body);
    return section;
  };

  const renderPreview = (payload) => {
    const resume = normalizeResume(payload.resume_data);
    preview.replaceChildren();
    preview.dataset.template = payload.template_key || "modern";

    const header = create("header", "", "cv-preview-header");
    header.append(
      create("h1", resume.personal.fullName || "Your Name"),
      create(
        "h2",
        resume.personal.headline ||
          payload.target_role ||
          "Professional headline"
      )
    );

    const contacts = [
      resume.personal.location,
      resume.personal.email,
      resume.personal.phone,
      resume.personal.website,
      resume.personal.linkedin,
      resume.personal.behance,
      resume.personal.github
    ].filter(Boolean);

    if (contacts.length) {
      const meta = create("div", "", "cv-preview-contact");
      contacts.forEach((item) => meta.append(create("span", item)));
      header.append(meta);
    }

    preview.append(header);

    if (resume.personal.summary) {
      const body = create("p", resume.personal.summary);
      const section = previewSection("Profile", body);
      if (section) preview.append(section);
    }

    if (resume.experience.length) {
      const body = create("div", "", "cv-preview-timeline");
      resume.experience.forEach((item) => {
        const card = create("article", "", "cv-preview-entry");
        const top = create("div", "", "cv-preview-entry-top");
        top.append(
          create("strong", item.role || "Role"),
          create("span", item.period)
        );
        card.append(top);
        if (item.company) card.append(create("b", item.company));
        if (item.details) card.append(create("p", item.details));
        body.append(card);
      });
      preview.append(previewSection("Experience", body));
    }

    if (resume.education.length) {
      const body = create("div", "", "cv-preview-timeline");
      resume.education.forEach((item) => {
        const card = create("article", "", "cv-preview-entry");
        const top = create("div", "", "cv-preview-entry-top");
        top.append(
          create("strong", item.qualification || "Qualification"),
          create("span", item.period)
        );
        card.append(top);
        if (item.institution) card.append(create("b", item.institution));
        if (item.details) card.append(create("p", item.details));
        body.append(card);
      });
      preview.append(previewSection("Education", body));
    }

    if (resume.skills.length) {
      const wrap = create("div");
      appendList(wrap, resume.skills, "cv-preview-chips");
      preview.append(previewSection("Skills", wrap));
    }

    if (resume.languages.length) {
      const wrap = create("div");
      appendList(wrap, resume.languages, "cv-preview-inline-list");
      preview.append(previewSection("Languages", wrap));
    }

    if (resume.certifications.length) {
      const wrap = create("div");
      appendList(wrap, resume.certifications, "cv-preview-list");
      preview.append(previewSection("Courses & Certifications", wrap));
    }
  };

  const load = async () => {
    setBusy(true);
    setState("Loading…");
    setMessage("Loading private CV versions…");

    try {
      const { data, error } = await supabaseClient
        .from("portfolio_cvs")
        .select(
          "id,label,target_role,template_key,resume_data,sort_order,created_at,updated_at"
        )
        .order("sort_order", { ascending: true })
        .order("updated_at", { ascending: false });

      if (error) {
        if (/portfolio_cvs/i.test(error.message || "")) {
          throw new Error(
            "Phase 5E CV table is missing. Run migration 019_multiple_cv_manager.sql first."
          );
        }
        throw error;
      }

      rows = data || [];
      renderList();

      const current = selected();
      if (current) {
        populate(current);
      } else if (rows.length) {
        populate(rows[0]);
      } else {
        resetForm();
        setState("Ready");
        setMessage("No CV versions yet. Create your first private CV.");
      }

      return true;
    } catch (error) {
      console.error("CV Manager load failed:", error);
      rows = [];
      renderList();
      resetForm();
      setState("Load failed");
      setMessage(error?.message || "Could not load private CV versions.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    const payload = readForm();
    const validation = validate(payload);

    if (validation) {
      setState("Check fields");
      setMessage(validation);
      return false;
    }

    setBusy(true);
    setState("Saving…");
    setMessage("Saving private CV…");

    try {
      let result;

      if (idInput.value) {
        result = await supabaseClient
          .from("portfolio_cvs")
          .update(payload)
          .eq("id", idInput.value)
          .select(
            "id,label,target_role,template_key,resume_data,sort_order,created_at,updated_at"
          )
          .single();
      } else {
        result = await supabaseClient
          .from("portfolio_cvs")
          .insert(payload)
          .select(
            "id,label,target_role,template_key,resume_data,sort_order,created_at,updated_at"
          )
          .single();
      }

      if (result.error) throw result.error;

      const saved = result.data;
      const index = rows.findIndex((row) => row.id === saved.id);
      if (index >= 0) rows[index] = saved;
      else rows.push(saved);

      populate(saved);
      setState("Saved");
      setMessage("Private CV saved. Nothing was published publicly.");
      return true;
    } catch (error) {
      console.error("CV save failed:", error);
      setState("Save failed");
      setMessage(
        /portfolio_cvs_label_lower_uidx/i.test(error?.message || "")
          ? "A CV with this name already exists."
          : error?.message || "Could not save CV."
      );
      return false;
    } finally {
      setBusy(false);
    }
  };

  const duplicate = async () => {
    const row = selected();
    if (!row || busy) return;

    const base = clean(row.label) || "CV";
    let label = base + " Copy";
    let suffix = 2;

    const labels = new Set(rows.map((item) => clean(item.label).toLowerCase()));
    while (labels.has(label.toLowerCase())) {
      label = base + " Copy " + suffix;
      suffix += 1;
    }

    setBusy(true);
    setState("Duplicating…");
    setMessage("Creating a new private CV version…");

    try {
      const { data, error } = await supabaseClient
        .from("portfolio_cvs")
        .insert({
          label,
          target_role: row.target_role || "",
          template_key: row.template_key || "modern",
          resume_data: normalizeResume(row.resume_data),
          sort_order: (row.sort_order ?? 0) + 1
        })
        .select(
          "id,label,target_role,template_key,resume_data,sort_order,created_at,updated_at"
        )
        .single();

      if (error) throw error;

      rows.push(data);
      populate(data);
      setState("Duplicated");
      setMessage("New CV version created. Edit the role/content, then save.");
    } catch (error) {
      console.error("CV duplicate failed:", error);
      setState("Duplicate failed");
      setMessage(error?.message || "Could not duplicate CV.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    const row = selected();
    if (!row || busy) return;

    if (!window.confirm("Permanently delete this private CV version?")) return;

    setBusy(true);
    setState("Deleting…");
    setMessage("Deleting private CV…");

    try {
      const { error } = await supabaseClient
        .from("portfolio_cvs")
        .delete()
        .eq("id", row.id);

      if (error) throw error;

      rows = rows.filter((item) => item.id !== row.id);
      if (rows.length) populate(rows[0]);
      else resetForm();

      setState("Deleted");
      setMessage("CV version permanently deleted.");
    } catch (error) {
      console.error("CV delete failed:", error);
      setState("Delete failed");
      setMessage(error?.message || "Could not delete CV.");
    } finally {
      setBusy(false);
    }
  };

  const updatePreview = () => {
    try {
      renderPreview(readForm());
    } catch (error) {
      console.warn("CV preview update failed:", error);
    }
  };

  navButton.addEventListener("click", async () => {
    showCmsView("cv-manager");
    await load();
  });

  refreshButton?.addEventListener("click", load);
  newButton?.addEventListener("click", resetForm);
  duplicateButton?.addEventListener("click", duplicate);
  deleteButton?.addEventListener("click", remove);
  printButton?.addEventListener("click", () => {
    updatePreview();
    window.print();
  });

  addExperienceButton?.addEventListener("click", () => {
    experienceList.append(makeExperienceRow());
    updatePreview();
  });

  addEducationButton?.addEventListener("click", () => {
    educationList.append(makeEducationRow());
    updatePreview();
  });

  form.addEventListener("input", updatePreview);
  form.addEventListener("change", updatePreview);
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await save();
  });

  resetForm();
};
