const clean = (value) => String(value || "").trim();

const isSafeCvImageSource = (value) => {
  const src = clean(value);
  if (!src) return false;
  if (
    src.startsWith("/") ||
    src.startsWith("./") ||
    src.startsWith("../") ||
    /^[a-z0-9_-]+\//i.test(src)
  ) return true;
  try {
    return new URL(src).protocol === "https:";
  } catch {
    return false;
  }
};

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

const CV_CATEGORIES = [
  { key: "graphic_design", label: "Graphic Design", role: "Graphic Designer" },
  { key: "video_editing", label: "Video Editing", role: "Video Editor" },
  { key: "event_management", label: "Event Management", role: "Event Coordinator / Event Management" },
  { key: "computer_admin", label: "Computer Operator / Admin", role: "Computer Operator / Administrative Support" },
  { key: "hospitality", label: "Hotel / Waiter / Service", role: "Waiter / Hospitality Staff" },
  { key: "customer_travel", label: "Customer Service / Travel", role: "Customer Service / Travel Support" },
  { key: "ecommerce", label: "E-commerce / Product Listing", role: "E-commerce / Product Listing Assistant" },
  { key: "operations", label: "Shop / Operations", role: "Shop / Operations Assistant" },
  { key: "general", label: "General / Full CV", role: "General Professional CV" }
];

const categoryMeta = (key) =>
  CV_CATEGORIES.find((item) => item.key === key) ||
  CV_CATEGORIES[CV_CATEGORIES.length - 1];

const CV_TOOL_NAMES = new Set([
  "Adobe Photoshop",
  "Adobe Illustrator",
  "Adobe Premiere Pro",
  "CapCut",
  "Microsoft Word",
  "Microsoft Excel",
  "Microsoft PowerPoint",
  "VS Code / GitHub / Supabase",
  "SAP / ETS Production Workflow"
]);

const formatCvLink = (value) => {
  const raw = clean(value);
  if (!raw) return "";

  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : "https://" + raw);
    const host = url.hostname.replace(/^www\./i, "");
    const path = url.pathname.replace(/\/$/, "");
    return host + (path && path !== "/" ? path : "");
  } catch {
    return raw.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
  }
};

const relevanceRank = (categories, categoryKey) => {
  const keys = Array.isArray(categories) ? categories : [];
  if (keys.includes(categoryKey)) return 0;
  if (keys.includes("general")) return 1;
  return 2;
};

const normalizeCategories = (value) =>
  Array.isArray(value)
    ? value
        .map(clean)
        .filter((item) => CV_CATEGORIES.some((category) => category.key === item))
    : [];

const normalizeTaggedValues = (items) =>
  Array.isArray(items)
    ? items
        .slice(0, 100)
        .map((item) => {
          if (typeof item === "string") {
            return { value: clean(item), categories: ["general"] };
          }
          return {
            value: clean(item?.value),
            categories: normalizeCategories(item?.categories)
          };
        })
        .filter((item) => item.value)
    : [];

const normalizeMasterProfile = (value) => {
  const source = value && typeof value === "object" ? value : {};
  const personal =
    source.personal && typeof source.personal === "object"
      ? source.personal
      : {};

  const normalizeEducation = (items) =>
    Array.isArray(items)
      ? items
          .slice(0, 20)
          .map((item) => ({
            qualification: clean(item?.qualification),
            institution: clean(item?.institution),
            period: clean(item?.period),
            details: clean(item?.details)
          }))
          .filter((item) => Object.values(item).some(Boolean))
      : [];

  const normalizeExperiences = (items) =>
    Array.isArray(items)
      ? items
          .slice(0, 40)
          .map((item) => ({
            role: clean(item?.role),
            company: clean(item?.company),
            period: clean(item?.period),
            details: clean(item?.details),
            categories: normalizeCategories(item?.categories)
          }))
          .filter((item) =>
            [item.role, item.company, item.period, item.details].some(Boolean)
          )
      : [];

  const normalizeRoleText = (input) => {
    const output = {};
    if (input && typeof input === "object") {
      CV_CATEGORIES.forEach(({ key }) => {
        const text = clean(input[key]);
        if (text) output[key] = text;
      });
    }
    return output;
  };

  return {
    personal: {
      fullName: clean(personal.fullName),
      headline: clean(personal.headline),
      location: clean(personal.location),
      email: clean(personal.email),
      phone: clean(personal.phone),
      website: clean(personal.website),
      linkedin: clean(personal.linkedin),
      behance: clean(personal.behance),
      github: clean(personal.github),
      photoUrl: clean(personal.photoUrl)
    },
    education: normalizeEducation(source.education),
    experiences: normalizeExperiences(source.experiences),
    skills: normalizeTaggedValues(source.skills),
    languages: Array.isArray(source.languages)
      ? source.languages.map(clean).filter(Boolean).slice(0, 40)
      : [],
    certifications: normalizeTaggedValues(source.certifications),
    headlines: normalizeRoleText(source.headlines),
    summaries: normalizeRoleText(source.summaries)
  };
};

const masterHasUsefulData = (profile) =>
  Boolean(
    profile.personal.fullName ||
      profile.education.length ||
      profile.experiences.length ||
      profile.skills.length ||
      profile.languages.length ||
      profile.certifications.length
  );

const matchesCategory = (categories, categoryKey) => {
  if (categoryKey === "general") return true;
  const keys = Array.isArray(categories) ? categories : [];
  return keys.includes(categoryKey) || keys.includes("general");
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
    github: "",
    photoUrl: ""
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
      github: clean(personal.github),
      photoUrl: clean(personal.photoUrl)
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
  const categoryLibrary = byId("cvCategoryLibrary");
  const masterState = byId("cvMasterState");
  const masterRefreshButton = byId("cvMasterRefreshButton");
  const masterBuildButton = byId("cvMasterBuildButton");

  const form = byId("cvManagerForm");
  const idInput = byId("cvId");
  const labelInput = byId("cvLabel");
  const targetRoleInput = byId("cvTargetRole");
  const categoryInput = byId("cvCategory");
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
  const photoUrlInput = byId("cvPhotoUrl");

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
    !categoryLibrary ||
    !masterState ||
    !masterRefreshButton ||
    !masterBuildButton ||
    !categoryInput ||
    !preview ||
    !experienceList ||
    !educationList
  ) {
    return;
  }

  let rows = [];
  let busy = false;
  let activeCategory = "graphic_design";
  let masterProfile = normalizeMasterProfile({});
  let masterReady = false;

  const setState = (value) => {
    if (state) state.textContent = value;
  };

  const setMessage = (value = "") => {
    if (message) message.textContent = value;
  };

  const setBusy = (value) => {
    busy = value;

    [refreshButton, newButton, saveButton, masterRefreshButton].forEach((button) => {
      if (button) button.disabled = value;
    });

    if (duplicateButton) duplicateButton.disabled = value || !idInput.value;
    if (deleteButton) deleteButton.disabled = value || !idInput.value;
    if (printButton) printButton.disabled = value || !idInput.value;
    if (masterBuildButton) {
      masterBuildButton.disabled = value || !masterReady;
    }

    if (saveButton) saveButton.textContent = value ? "Saving…" : "Save CV";
  };

  const selected = () =>
    rows.find((row) => row.id === idInput.value) || null;

  const setMasterState = (value, tone = "") => {
    masterState.textContent = value;
    masterState.dataset.tone = tone;
  };

  const mergePersonal = (current, source) => {
    const merged = { ...current };
    Object.entries(source || {}).forEach(([key, value]) => {
      const cleaned = clean(value);
      if (cleaned) merged[key] = cleaned;
    });
    return merged;
  };

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
    category_key: categoryInput.value,
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
        github: clean(githubInput.value),
        photoUrl: clean(photoUrlInput.value)
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

    if (!CV_CATEGORIES.some((item) => item.key === payload.category_key)) {
      return "Choose a valid CV category.";
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
    if (p.photoUrl.length > 1000) return "Profile photo URL is too long.";
    if (p.photoUrl && !isSafeCvImageSource(p.photoUrl)) {
      return "Profile photo must use HTTPS or a local project asset path.";
    }

    return "";
  };

  const resetForm = (categoryKey = activeCategory) => {
    form.reset();
    idInput.value = "";

    const meta = categoryMeta(categoryKey);
    activeCategory = meta.key;
    categoryInput.value = meta.key;
    labelInput.value = meta.label + " CV";
    targetRoleInput.value = meta.role;
    templateInput.value = "modern";
    orderInput.value = "0";

    experienceList.replaceChildren();
    educationList.replaceChildren();
    experienceList.append(makeExperienceRow());
    educationList.append(makeEducationRow());

    deleteButton.hidden = true;
    duplicateButton.disabled = true;
    printButton.disabled = true;

    setState("New " + meta.label + " CV");
    setMessage("No saved version in this category yet. Create it once, then it stays ready for PDF export.");
    renderPreview(readForm());
    renderCategoryLibrary();
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
    activeCategory = row.category_key || "general";
    categoryInput.value = activeCategory;
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
    photoUrlInput.value = resume.personal.photoUrl;

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
    renderCategoryLibrary();
    renderList();
  };

  const loadMasterProfile = async ({ quiet = false } = {}) => {
    setMasterState("Loading private Master Profile…");

    try {
      const { data, error } = await supabaseClient
        .from("portfolio_cv_master_profiles")
        .select("id,profile_data,updated_at")
        .eq("id", 1)
        .maybeSingle();

      if (error) {
        if (/portfolio_cv_master_profiles/i.test(error.message || "")) {
          throw new Error(
            "Master Profile table is missing. Run migration 021_private_cv_master_profile.sql first."
          );
        }
        throw error;
      }

      masterProfile = normalizeMasterProfile(data?.profile_data || {});
      masterReady = masterHasUsefulData(masterProfile);
      masterBuildButton.disabled = !masterReady || busy;

      if (masterReady) {
        setMasterState("Master Profile ready · role-specific CV auto-build enabled", "ready");
      } else {
        setMasterState("Master Profile table ready · A–Z profile data not loaded yet", "empty");
      }

      renderCategoryLibrary();
      if (!quiet && masterReady) {
        setMessage("Private Master Profile refreshed.");
      }

      return masterReady;
    } catch (error) {
      console.error("CV Master Profile load failed:", error);
      masterProfile = normalizeMasterProfile({});
      masterReady = false;
      masterBuildButton.disabled = true;
      setMasterState(error?.message || "Could not load private Master Profile.", "error");
      return false;
    }
  };

  const applyMasterToForm = (categoryKey, { keepId = true } = {}) => {
    if (!masterReady) return false;

    const meta = categoryMeta(categoryKey);
    const existingId = keepId ? idInput.value : "";

    if (!keepId) {
      resetForm(meta.key);
    }

    activeCategory = meta.key;
    categoryInput.value = meta.key;
    targetRoleInput.value = meta.role;
    if (!existingId) labelInput.value = meta.label + " CV";

    const current = normalizeResume(readForm().resume_data);
    const personal = mergePersonal(current.personal, masterProfile.personal);

    fullNameInput.value = personal.fullName;
    photoUrlInput.value = personal.photoUrl;
    headlineInput.value =
      masterProfile.headlines[meta.key] ||
      personal.headline ||
      meta.role;
    summaryInput.value = masterProfile.summaries[meta.key] || "";
    locationInput.value = personal.location;
    emailInput.value = personal.email;
    phoneInput.value = personal.phone;
    websiteInput.value = personal.website;
    linkedinInput.value = personal.linkedin;
    behanceInput.value = personal.behance;
    githubInput.value = personal.github;

    const roleSpecific = meta.key !== "general";
    const experiences = masterProfile.experiences
      .filter((item) => matchesCategory(item.categories, meta.key))
      .sort(
        (a, b) =>
          relevanceRank(a.categories, meta.key) -
          relevanceRank(b.categories, meta.key)
      )
      .slice(0, roleSpecific ? 4 : 10);

    experienceList.replaceChildren();
    (experiences.length ? experiences : [{}]).forEach((item) => {
      experienceList.append(makeExperienceRow(item));
    });

    const education = masterProfile.education.slice(0, roleSpecific ? 3 : 6);
    educationList.replaceChildren();
    (education.length ? education : [{}]).forEach((item) => {
      educationList.append(makeEducationRow(item));
    });

    const skills = masterProfile.skills
      .filter((item) => matchesCategory(item.categories, meta.key))
      .sort(
        (a, b) =>
          relevanceRank(a.categories, meta.key) -
          relevanceRank(b.categories, meta.key)
      )
      .slice(0, roleSpecific ? 9 : 18)
      .map((item) => item.value);

    const certifications = masterProfile.certifications
      .filter((item) => matchesCategory(item.categories, meta.key))
      .sort(
        (a, b) =>
          relevanceRank(a.categories, meta.key) -
          relevanceRank(b.categories, meta.key)
      )
      .slice(0, roleSpecific ? 5 : 10)
      .map((item) => item.value);

    skillsInput.value = skills.join("\n");
    languagesInput.value = masterProfile.languages
      .slice(0, roleSpecific ? 4 : 8)
      .join("\n");
    certificationsInput.value = certifications.join("\n");

    if (existingId) idInput.value = existingId;

    setState("Built from Master · " + meta.label);
    setMessage("Relevant Master Profile data applied to this CV category.");
    renderPreview(readForm());
    renderCategoryLibrary();
    renderList();
    return true;
  };

  const renderCategoryLibrary = () => {
    categoryLibrary.replaceChildren();

    CV_CATEGORIES.forEach((meta) => {
      const matching = rows
        .filter((row) => (row.category_key || "general") === meta.key)
        .sort(
          (a, b) =>
            (a.sort_order ?? 0) - (b.sort_order ?? 0) ||
            String(a.label || "").localeCompare(String(b.label || ""))
        );

      const button = document.createElement("button");
      button.type = "button";
      button.className = "cv-category-button";
      if (activeCategory === meta.key) button.classList.add("active");

      const top = create("span", "", "cv-category-button-top");
      top.append(
        create("strong", meta.label),
        create("b", String(matching.length))
      );

      button.append(
        top,
        create(
          "small",
          matching.length
            ? "Ready CV version"
            : masterReady
              ? "Create from Master Profile"
              : "Master Profile data required"
        )
      );

      button.addEventListener("click", async () => {
        activeCategory = meta.key;

        if (matching.length) {
          populate(matching[0]);
          return;
        }

        if (masterReady) {
          applyMasterToForm(meta.key, { keepId: false });
          await save();
          return;
        }

        resetForm(meta.key);
      });

      categoryLibrary.append(button);
    });
  };

  const renderList = () => {
    list.replaceChildren();

    const ordered = rows
      .filter((row) => (row.category_key || "general") === activeCategory)
      .sort(
        (a, b) =>
          (a.sort_order ?? 0) - (b.sort_order ?? 0) ||
          String(a.label || "").localeCompare(String(b.label || ""))
      );

    const meta = categoryMeta(activeCategory);
    count.textContent =
      meta.label + " · " + ordered.length + (ordered.length === 1 ? " CV" : " CVs");

    if (!ordered.length) {
      list.append(
        create(
          "div",
          "No saved " + categoryMeta(activeCategory).label + " CV yet.",
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

  const estimateCvDensity = (resume, payload) => {
    const experienceChars = resume.experience.reduce(
      (sum, item) =>
        sum +
        clean(item.role).length +
        clean(item.company).length +
        clean(item.period).length +
        clean(item.details).length,
      0
    );

    const educationChars = resume.education.reduce(
      (sum, item) =>
        sum +
        clean(item.qualification).length +
        clean(item.institution).length +
        clean(item.period).length +
        clean(item.details).length,
      0
    );

    const linkCount = [
      resume.personal.website,
      resume.personal.linkedin,
      resume.personal.behance,
      resume.personal.github
    ].filter(Boolean).length;

    let score =
      resume.experience.length * 3.2 +
      resume.education.length * 1.45 +
      resume.skills.length * 0.72 +
      resume.languages.length * 0.52 +
      resume.certifications.length * 0.72 +
      linkCount * 0.48 +
      clean(resume.personal.summary).length / 105 +
      experienceChars / 175 +
      educationChars / 230;

    if (payload.category_key === "video_editing") score += 1.4;

    if (score < 23) return "spacious";
    if (score < 36) return "balanced";
    return "compact";
  };

  const enforceOnePageDensity = (layout) => {
    const order = ["spacious", "balanced", "compact"];
    let index = Math.max(0, order.indexOf(preview.dataset.density || "balanced"));

    const fits = () => {
      const available = preview.clientHeight || layout.clientHeight;
      return layout.scrollHeight <= available + 3;
    };

    while (!fits() && index < order.length - 1) {
      index += 1;
      preview.dataset.density = order[index];
      void layout.offsetHeight;
    }
  };

  const tuneColumnFill = (column) => {
    if (!column || !column.lastElementChild) return;

    const levels = ["normal", "roomy", "full", "max"];
    const targetFree = 10;
    let accepted = "normal";

    const freeSpace = () => {
      const columnRect = column.getBoundingClientRect();
      const lastRect = column.lastElementChild.getBoundingClientRect();
      return columnRect.bottom - lastRect.bottom;
    };

    const overflows = () => freeSpace() < 8;

    column.dataset.fill = "normal";
    void column.offsetHeight;

    for (const level of levels.slice(1)) {
      const before = accepted;
      column.dataset.fill = level;
      void column.offsetHeight;

      if (overflows()) {
        column.dataset.fill = before;
        void column.offsetHeight;
        break;
      }

      accepted = level;
      if (freeSpace() <= targetFree) break;
    }
  };

  const tuneModernFill = (main, sidebar, layout) => {
    enforceOnePageDensity(layout);
    tuneColumnFill(main);
    tuneColumnFill(sidebar);

    const previewRect = preview.getBoundingClientRect();
    const layoutRect = layout.getBoundingClientRect();

    if (layoutRect.bottom > previewRect.bottom + 2) {
      main.dataset.fill = "normal";
      sidebar.dataset.fill = "normal";
      preview.dataset.density = "compact";
      void layout.offsetHeight;
      tuneColumnFill(main);
      tuneColumnFill(sidebar);
    }
  };

  const renderPreview = (payload) => {
    const resume = normalizeResume(payload.resume_data);
    preview.replaceChildren();
    preview.dataset.template = payload.template_key || "modern";
    preview.dataset.density = estimateCvDensity(resume, payload);

    const renderTimelineSection = (title, items, type) => {
      if (!items.length) return null;

      const body = create("div", "", "cv-preview-timeline");

      items.forEach((item) => {
        const card = create("article", "", "cv-preview-entry");
        const top = create("div", "", "cv-preview-entry-top");

        if (type === "experience") {
          let displayRole = item.role || "Role";

          let displayDetails = item.details || "";

          if (
            payload.category_key === "video_editing" &&
            /graphic designer.*visual content creator/i.test(displayRole)
          ) {
            displayRole = "Freelance Video Editor & Visual Content Creator";
            displayDetails =
              "Edited short-form and promotional video content using Adobe Premiere Pro and CapCut, supported by graphic design and visual communication skills for social media content.";
          }

          top.append(
            create("strong", displayRole),
            create("span", item.period)
          );
          card.append(top);
          if (item.company) card.append(create("b", item.company));
          if (displayDetails) {
            card.append(create("p", displayDetails));
          }
        } else {
          top.append(
            create("strong", item.qualification || "Qualification"),
            create("span", item.period)
          );
          card.append(top);
          if (item.institution) card.append(create("b", item.institution));
        }

        if (type !== "experience" && item.details) {
          card.append(create("p", item.details));
        }
        body.append(card);
      });

      return previewSection(title, body);
    };

    const renderStandardPreview = () => {
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
        const section = previewSection(
          "Profile",
          create("p", resume.personal.summary)
        );
        if (section) preview.append(section);
      }

      const experience = renderTimelineSection(
        "Experience",
        resume.experience,
        "experience"
      );
      if (experience) preview.append(experience);

      const education = renderTimelineSection(
        "Education",
        resume.education,
        "education"
      );
      if (education) preview.append(education);

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

    if (payload.template_key !== "modern") {
      renderStandardPreview();
      return;
    }

    const fullName = resume.personal.fullName || "Your Name";
    const nameParts = fullName.split(/\s+/).filter(Boolean);
    const initials = (
      (nameParts[0]?.[0] || "M") +
      (nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : "")
    ).toUpperCase();

    const layout = create("div", "", "cv-ref-layout");
    const main = create("div", "", "cv-ref-main");
    const sidebar = create("aside", "", "cv-ref-sidebar");
    const hero = create("header", "", "cv-ref-hero");

    const photoWrap = create("div", "", "cv-ref-photo-wrap");
    const photoSource = isSafeCvImageSource(resume.personal.photoUrl)
      ? resume.personal.photoUrl
      : "../assets/hero-visual.jpg";

    if (isSafeCvImageSource(photoSource)) {
      const photo = document.createElement("img");
      photo.className = "cv-ref-photo";
      photo.src = photoSource;
      photo.alt = fullName + " profile photo";
      photoWrap.append(photo);
    } else {
      photoWrap.append(create("span", initials || "CV", "cv-ref-photo-fallback"));
    }

    const heroBand = create("div", "", "cv-ref-hero-band");
    const heroCopy = create("div", "", "cv-ref-hero-copy");
    heroCopy.append(
      create("span", payload.target_role || "PROFESSIONAL CV", "cv-ref-kicker"),
      create("h1", fullName),
      create(
        "h2",
        resume.personal.headline ||
          payload.target_role ||
          "Professional headline"
      )
    );

    const heroContacts = [
      resume.personal.phone ? "☎  " + resume.personal.phone : "",
      resume.personal.email ? "✉  " + resume.personal.email : "",
      resume.personal.location ? "⌖  " + resume.personal.location : ""
    ].filter(Boolean);

    if (heroContacts.length) {
      const contactLine = create("div", "", "cv-ref-hero-contact");
      heroContacts.forEach((item) => contactLine.append(create("span", item)));
      heroCopy.append(contactLine);
    }

    heroBand.append(heroCopy);
    hero.append(photoWrap, heroBand);

    const addMainSection = (title, node) => {
      if (!node) return;
      const section = create("section", "", "cv-ref-main-section");
      section.dataset.section = title.toLowerCase().replace(/\s+/g, "-");
      section.append(create("h3", title), node);
      main.append(section);
    };

    if (resume.personal.summary) {
      addMainSection("Profile", create("p", resume.personal.summary));
    }

    const experience = renderTimelineSection(
      "Experience",
      resume.experience,
      "experience"
    );
    if (experience) {
      const body = experience.querySelector(".cv-preview-timeline");
      if (body) addMainSection("Experience", body);
    }

    if (payload.category_key === "video_editing") {
      const focus = create("ul", "", "cv-ref-focus-list");
      [
        "Short-form & promotional video content",
        "Social media content editing",
        "Graphic design support for stronger visual communication"
      ].forEach((item) => focus.append(create("li", item)));
      addMainSection("Creative Focus", focus);
    }

    const education = renderTimelineSection(
      "Education",
      resume.education,
      "education"
    );
    if (education) {
      const body = education.querySelector(".cv-preview-timeline");
      if (body) addMainSection("Education", body);
    }

    if (
      !resume.personal.summary &&
      !resume.experience.length &&
      !resume.education.length
    ) {
      const empty = create("div", "", "cv-ref-empty");
      empty.append(
        create("strong", "BUILD YOUR ROLE-FOCUSED CV"),
        create(
          "p",
          "Add your summary, experience and education. The main CV content will build here automatically."
        )
      );
      main.append(empty);
    }

    const addSideSection = (title, values, className = "") => {
      const cleanValues = values.map(clean).filter(Boolean);
      if (!cleanValues.length) return;

      const section = create("section", "", "cv-ref-side-section");
      section.append(create("h3", title));
      const list = create("ul", "", className || "cv-ref-side-list");
      cleanValues.forEach((item) => list.append(create("li", item)));
      section.append(list);
      sidebar.append(section);
    };

    const tools = resume.skills.filter((item) => CV_TOOL_NAMES.has(item));
    const coreSkills = resume.skills.filter((item) => !CV_TOOL_NAMES.has(item));

    addSideSection("Language Skills", resume.languages);
    addSideSection("Creative / Work Tools", tools, "cv-ref-tool-list");
    addSideSection("Core Skills", coreSkills, "cv-ref-skill-list");

    const addLinkSection = (items) => {
      const cleanItems = items.filter((item) => clean(item.value));
      if (!cleanItems.length) return;

      const section = create("section", "", "cv-ref-side-section cv-ref-links-section");
      section.append(create("h3", "Professional Links"));
      const list = create("div", "", "cv-ref-link-list");

      cleanItems.forEach((item) => {
        const row = create("div", "", "cv-ref-link-row");
        row.append(
          create("small", item.label),
          create("span", formatCvLink(item.value))
        );
        list.append(row);
      });

      section.append(list);
      sidebar.append(section);
    };

    addLinkSection([
      { label: "Portfolio", value: resume.personal.website },
      { label: "LinkedIn", value: resume.personal.linkedin },
      { label: "Behance", value: resume.personal.behance },
      { label: "GitHub", value: resume.personal.github }
    ]);

    addSideSection("Courses & Certifications", resume.certifications);

    layout.append(main, sidebar, hero);
    preview.append(layout);

    requestAnimationFrame(() => {
      tuneModernFill(main, sidebar, layout);
    });
  };
  const load = async () => {
    setBusy(true);
    setState("Loading…");
    setMessage("Loading private CV versions…");

    try {
      await loadMasterProfile({ quiet: true });

      const { data, error } = await supabaseClient
        .from("portfolio_cvs")
        .select(
          "id,label,target_role,category_key,template_key,resume_data,sort_order,created_at,updated_at"
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
      renderCategoryLibrary();
      renderList();

      const current = selected();
      if (current) {
        populate(current);
      } else if (rows.length) {
        const firstGraphic =
          rows.find((row) => (row.category_key || "general") === "graphic_design") ||
          rows[0];
        populate(firstGraphic);
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
            "id,label,target_role,category_key,template_key,resume_data,sort_order,created_at,updated_at"
          )
          .single();
      } else {
        result = await supabaseClient
          .from("portfolio_cvs")
          .insert(payload)
          .select(
            "id,label,target_role,category_key,template_key,resume_data,sort_order,created_at,updated_at"
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
          category_key: row.category_key || "general",
          template_key: row.template_key || "modern",
          resume_data: normalizeResume(row.resume_data),
          sort_order: (row.sort_order ?? 0) + 1
        })
        .select(
          "id,label,target_role,category_key,template_key,resume_data,sort_order,created_at,updated_at"
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
  masterRefreshButton?.addEventListener("click", async () => {
    await loadMasterProfile();
  });
  masterBuildButton?.addEventListener("click", async () => {
    if (!masterReady) return;

    if (
      idInput.value &&
      !window.confirm(
        "Refresh this saved CV from the Master Profile? Current role-specific CV content will be replaced by the latest matching Master data."
      )
    ) {
      return;
    }

    applyMasterToForm(activeCategory, { keepId: Boolean(idInput.value) });
    await save();
  });
  newButton?.addEventListener("click", () => {
    if (masterReady) {
      applyMasterToForm(activeCategory, { keepId: false });
      return;
    }
    resetForm(activeCategory);
  });
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
  form.addEventListener("change", (event) => {
    if (event.target === categoryInput) {
      activeCategory = categoryInput.value;
      renderCategoryLibrary();
      renderList();
    }
    updatePreview();
  });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await save();
  });

  resetForm();
};
