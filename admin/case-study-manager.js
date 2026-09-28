const SECTION_TYPES = new Set(["text", "image", "gallery", "cards"]);
const CURRENT_HERO_VALUE = "__current_hero__";

const makeLocalId = () =>
  globalThis.crypto?.randomUUID?.() ||
  "section-" + Date.now() + "-" + Math.random().toString(16).slice(2);

const cleanText = (value, max = 2000) =>
  String(value || "").trim().slice(0, max);

const isSafeHref = (value) => {
  const href = String(value || "").trim();
  if (!href) return true;
  if (/^(https?:|mailto:|tel:)/i.test(href)) return true;
  if (/^(?![a-z][a-z0-9+.-]*:)[^\s]+$/i.test(href)) return true;
  return false;
};

const parseCardLines = (value) =>
  String(value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 8)
    .map((line) => {
      const [title, ...rest] = line.split("|");
      return {
        title: cleanText(title, 120),
        text: cleanText(rest.join("|"), 500)
      };
    })
    .filter((item) => item.title || item.text);

const cardsToText = (cards) =>
  (Array.isArray(cards) ? cards : [])
    .map((item) => {
      const title = cleanText(item?.title, 120);
      const text = cleanText(item?.text, 500);
      return text ? title + " | " + text : title;
    })
    .filter(Boolean)
    .join("\n");

const normalizeFacts = (facts) =>
  (Array.isArray(facts) ? facts : [])
    .map((item) => ({
      label: cleanText(item?.label, 80),
      value: cleanText(item?.value, 180)
    }))
    .filter((item) => item.label || item.value)
    .slice(0, 8);

const normalizeSections = (sections) =>
  (Array.isArray(sections) ? sections : [])
    .map((section) => {
      const type = SECTION_TYPES.has(section?.type) ? section.type : "text";
      const base = {
        id: cleanText(section?.id, 100) || makeLocalId(),
        type,
        eyebrow: cleanText(section?.eyebrow, 120),
        title: cleanText(section?.title, 220),
        body: cleanText(section?.body, 3000)
      };

      if (type === "image") {
        return {
          ...base,
          layout: section?.layout === "portrait" ? "portrait" : "wide",
          image_url: cleanText(section?.image_url, 1200),
          image_alt: cleanText(section?.image_alt, 220)
        };
      }

      if (type === "gallery") {
        return {
          ...base,
          images: (Array.isArray(section?.images) ? section.images : [])
            .map((image) => ({
              url: cleanText(image?.url, 1200),
              alt: cleanText(image?.alt, 220)
            }))
            .filter((image) => image.url)
            .slice(0, 12)
        };
      }

      if (type === "cards") {
        return {
          ...base,
          cards: (Array.isArray(section?.cards) ? section.cards : [])
            .map((item) => ({
              title: cleanText(item?.title, 120),
              text: cleanText(item?.text, 500)
            }))
            .filter((item) => item.title || item.text)
            .slice(0, 8)
        };
      }

      return base;
    })
    .slice(0, 20);

export const initCaseStudyManager = ({ supabaseClient, showCmsView }) => {
  const navButton = document.querySelector("#caseStudiesNavButton");
  const state = document.querySelector("#caseStudyState");
  const message = document.querySelector("#caseStudyMessage");
  const refreshButton = document.querySelector("#caseStudyRefreshButton");
  const form = document.querySelector("#caseStudyForm");
  const projectSelect = document.querySelector("#caseStudyProject");
  const kickerInput = document.querySelector("#caseStudyKicker");
  const headlineInput = document.querySelector("#caseStudyHeadline");
  const leadInput = document.querySelector("#caseStudyLead");
  const heroMediaSelect = document.querySelector("#caseStudyHeroMedia");
  const relatedSelect = document.querySelector("#caseStudyRelatedProject");
  const ctaLabelInput = document.querySelector("#caseStudyCtaLabel");
  const ctaHrefInput = document.querySelector("#caseStudyCtaHref");
  const addFactButton = document.querySelector("#caseStudyAddFact");
  const factsRoot = document.querySelector("#caseStudyFacts");
  const sectionsRoot = document.querySelector("#caseStudySections");
  const saveDraftButton = document.querySelector("#caseStudySaveDraft");
  const publishButton = document.querySelector("#caseStudyPublish");
  const unpublishButton = document.querySelector("#caseStudyUnpublish");
  const openPageButton = document.querySelector("#caseStudyOpenPage");
  const formMessage = document.querySelector("#caseStudyFormMessage");

  if (
    !navButton ||
    !form ||
    !projectSelect ||
    !factsRoot ||
    !sectionsRoot ||
    !saveDraftButton ||
    !publishButton
  ) {
    return;
  }

  let projects = [];
  let media = [];
  let caseStudies = [];
  let facts = [];
  let sections = [];
  let selectedCaseStudy = null;
  let busy = false;

  const setState = (value) => {
    if (state) state.textContent = value;
  };

  const setMessage = (value = "") => {
    if (message) message.textContent = value;
  };

  const setFormMessage = (value = "") => {
    if (formMessage) formMessage.textContent = value;
  };

  const getSelectedProject = () =>
    projects.find((project) => project.id === projectSelect.value) || null;

  const getMediaById = (id) =>
    media.find((item) => item.id === id) || null;

  const getMediaByUrl = (url) =>
    media.find((item) => item.display_url === url) || null;

  const fillProjectSelect = () => {
    const current = projectSelect.value;
    projectSelect.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select a project";
    projectSelect.appendChild(placeholder);

    projects.forEach((project) => {
      const option = document.createElement("option");
      option.value = project.id;
      option.textContent =
        project.title +
        " · " +
        (project.is_published ? "Published" : "Draft") +
        " · " +
        (project.visibility === "private" ? "Private" : "Public");
      projectSelect.appendChild(option);
    });

    if ([...projectSelect.options].some((option) => option.value === current)) {
      projectSelect.value = current;
    }
  };

  const fillRelatedSelect = () => {
    const current = relatedSelect.value;
    relatedSelect.innerHTML = "";

    const none = document.createElement("option");
    none.value = "";
    none.textContent = "No related project";
    relatedSelect.appendChild(none);

    projects
      .filter((project) => project.id !== projectSelect.value)
      .forEach((project) => {
        const option = document.createElement("option");
        option.value = project.id;
        option.textContent = project.title;
        relatedSelect.appendChild(option);
      });

    if ([...relatedSelect.options].some((option) => option.value === current)) {
      relatedSelect.value = current;
    }
  };

  const appendMediaOptions = (select, { multiple = false } = {}) => {
    const current = multiple
      ? new Set([...select.selectedOptions].map((option) => option.value))
      : new Set([select.value]);

    select.innerHTML = "";

    if (!multiple) {
      const fallback = document.createElement("option");
      fallback.value = "";
      fallback.textContent = "Use project cover";
      select.appendChild(fallback);
    }

    media.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.original_filename || "Media image";
      option.selected = current.has(item.id);
      select.appendChild(option);
    });
  };

  const setBusy = (isBusy) => {
    busy = isBusy;
    refreshButton.disabled = isBusy;
    projectSelect.disabled = isBusy;

    const noProject = !projectSelect.value;

    [
      kickerInput,
      headlineInput,
      leadInput,
      heroMediaSelect,
      relatedSelect,
      ctaLabelInput,
      ctaHrefInput,
      addFactButton
    ].forEach((control) => {
      if (control) control.disabled = isBusy || noProject;
    });

    document
      .querySelectorAll("[data-add-case-section]")
      .forEach((button) => {
        button.disabled = isBusy || noProject;
      });

    saveDraftButton.disabled = isBusy || noProject;
    publishButton.disabled = isBusy || noProject;
    unpublishButton.disabled =
      isBusy || noProject || !selectedCaseStudy?.is_published;

    const project = getSelectedProject();
    openPageButton.disabled =
      isBusy ||
      !selectedCaseStudy?.is_published ||
      !project?.is_published ||
      project?.visibility !== "public";

    factsRoot.querySelectorAll("input,button").forEach((control) => {
      control.disabled = isBusy || noProject;
    });

    sectionsRoot.querySelectorAll("input,textarea,select,button").forEach((control) => {
      control.disabled = isBusy || noProject;
    });
  };

  const renderFacts = () => {
    factsRoot.replaceChildren();

    if (!facts.length) {
      const empty = document.createElement("div");
      empty.className = "manager-empty";
      empty.textContent = "No summary facts yet. Add facts such as Role, Year, Location or Scope.";
      factsRoot.appendChild(empty);
      return;
    }

    facts.forEach((fact, index) => {
      const row = document.createElement("div");
      row.className = "case-fact-row";

      const label = document.createElement("input");
      label.type = "text";
      label.maxLength = 80;
      label.placeholder = "Label";
      label.value = fact.label || "";
      label.addEventListener("input", () => {
        fact.label = label.value;
      });

      const value = document.createElement("input");
      value.type = "text";
      value.maxLength = 180;
      value.placeholder = "Value";
      value.value = fact.value || "";
      value.addEventListener("input", () => {
        fact.value = value.value;
      });

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "secondary-button compact-button";
      remove.textContent = "Remove";
      remove.addEventListener("click", () => {
        facts.splice(index, 1);
        renderFacts();
        setBusy(false);
      });

      row.append(label, value, remove);
      factsRoot.appendChild(row);
    });

    setBusy(busy);
  };

  const createField = (labelText, control) => {
    const label = document.createElement("label");
    const span = document.createElement("span");
    span.textContent = labelText;
    label.append(span, control);
    return label;
  };

  const createTextInput = (value, max, placeholder, onInput) => {
    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = max;
    input.placeholder = placeholder;
    input.value = value || "";
    input.addEventListener("input", () => onInput(input.value));
    return input;
  };

  const createTextarea = (value, max, rows, placeholder, onInput) => {
    const area = document.createElement("textarea");
    area.maxLength = max;
    area.rows = rows;
    area.placeholder = placeholder;
    area.value = value || "";
    area.addEventListener("input", () => onInput(area.value));
    return area;
  };

  const renderSections = () => {
    sectionsRoot.replaceChildren();

    if (!sections.length) {
      const empty = document.createElement("div");
      empty.className = "manager-empty";
      empty.textContent = "No case-study sections yet. Add Text, Image, Gallery or Feature Cards.";
      sectionsRoot.appendChild(empty);
      return;
    }

    sections.forEach((section, index) => {
      const card = document.createElement("article");
      card.className = "case-section-editor-card";

      const header = document.createElement("div");
      header.className = "case-section-editor-head";

      const heading = document.createElement("div");
      const typeLabel = document.createElement("small");
      typeLabel.textContent = section.type.toUpperCase() + " SECTION";
      const title = document.createElement("strong");
      title.textContent = section.title || "Untitled section";
      heading.append(typeLabel, title);

      const actions = document.createElement("div");
      actions.className = "case-section-editor-actions";

      const up = document.createElement("button");
      up.type = "button";
      up.textContent = "↑";
      up.title = "Move section up";
      up.disabled = index === 0;
      up.addEventListener("click", () => {
        if (index === 0) return;
        [sections[index - 1], sections[index]] = [sections[index], sections[index - 1]];
        renderSections();
        setBusy(false);
      });

      const down = document.createElement("button");
      down.type = "button";
      down.textContent = "↓";
      down.title = "Move section down";
      down.disabled = index === sections.length - 1;
      down.addEventListener("click", () => {
        if (index === sections.length - 1) return;
        [sections[index + 1], sections[index]] = [sections[index], sections[index + 1]];
        renderSections();
        setBusy(false);
      });

      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "Delete";
      remove.addEventListener("click", () => {
        sections.splice(index, 1);
        renderSections();
        setBusy(false);
      });

      actions.append(up, down, remove);
      header.append(heading, actions);

      const fields = document.createElement("div");
      fields.className = "case-section-editor-fields";

      const eyebrow = createTextInput(
        section.eyebrow,
        120,
        "Section eyebrow",
        (value) => {
          section.eyebrow = value;
        }
      );

      const sectionTitle = createTextInput(
        section.title,
        220,
        "Section title",
        (value) => {
          section.title = value;
          title.textContent = value.trim() || "Untitled section";
        }
      );

      const body = createTextarea(
        section.body,
        3000,
        4,
        "Section description",
        (value) => {
          section.body = value;
        }
      );

      fields.append(
        createField("Eyebrow", eyebrow),
        createField("Title", sectionTitle),
        createField("Body", body)
      );

      if (section.type === "image") {
        const mediaSelect = document.createElement("select");
        const blank = document.createElement("option");
        blank.value = "";
        blank.textContent = "Select Media Library image";
        mediaSelect.appendChild(blank);

        media.forEach((item) => {
          const option = document.createElement("option");
          option.value = item.id;
          option.textContent = item.original_filename || "Media image";
          option.selected = item.display_url === section.image_url;
          mediaSelect.appendChild(option);
        });

        mediaSelect.addEventListener("change", () => {
          const item = getMediaById(mediaSelect.value);
          section.image_url = item?.display_url || "";
          section.image_alt = item?.alt_text || "";
        });

        const layout = document.createElement("select");
        [
          ["wide", "Wide / landscape"],
          ["portrait", "Portrait"]
        ].forEach(([value, label]) => {
          const option = document.createElement("option");
          option.value = value;
          option.textContent = label;
          option.selected = section.layout === value;
          layout.appendChild(option);
        });
        layout.addEventListener("change", () => {
          section.layout = layout.value;
        });

        fields.append(
          createField("Media Library image", mediaSelect),
          createField("Image layout", layout)
        );
      }

      if (section.type === "gallery") {
        const mediaSelect = document.createElement("select");
        mediaSelect.multiple = true;
        mediaSelect.size = Math.min(8, Math.max(4, media.length || 4));

        const selectedUrls = new Set(
          (section.images || []).map((image) => image.url)
        );

        media.forEach((item) => {
          const option = document.createElement("option");
          option.value = item.id;
          option.textContent = item.original_filename || "Media image";
          option.selected = selectedUrls.has(item.display_url);
          mediaSelect.appendChild(option);
        });

        mediaSelect.addEventListener("change", () => {
          section.images = [...mediaSelect.selectedOptions]
            .map((option) => getMediaById(option.value))
            .filter(Boolean)
            .map((item) => ({
              url: item.display_url,
              alt: item.alt_text || ""
            }))
            .slice(0, 12);
        });

        const hint = document.createElement("small");
        hint.className = "case-field-hint";
        hint.textContent = "Ctrl/Cmd + click to select multiple optimized images.";

        const wrapper = createField("Gallery images", mediaSelect);
        wrapper.appendChild(hint);
        fields.appendChild(wrapper);
      }

      if (section.type === "cards") {
        const cards = createTextarea(
          cardsToText(section.cards),
          5000,
          6,
          "Visual Identity | Consistent project look\nEvent Graphics | Large-format assets",
          (value) => {
            section.cards = parseCardLines(value);
          }
        );

        const wrapper = createField("Feature cards", cards);
        const hint = document.createElement("small");
        hint.className = "case-field-hint";
        hint.textContent = "One card per line: Title | Description";
        wrapper.appendChild(hint);
        fields.appendChild(wrapper);
      }

      card.append(header, fields);
      sectionsRoot.appendChild(card);
    });

    setBusy(busy);
  };

  const resetForm = () => {
    selectedCaseStudy = null;
    facts = [];
    sections = [];
    kickerInput.value = "";
    headlineInput.value = "";
    leadInput.value = "";
    heroMediaSelect.value = "";
    relatedSelect.value = "";
    ctaLabelInput.value = "";
    ctaHrefInput.value = "";
    renderFacts();
    renderSections();
    setFormMessage("");
    setBusy(false);
  };

  const populateForm = () => {
    fillRelatedSelect();

    const project = getSelectedProject();
    if (!project) {
      resetForm();
      return;
    }

    selectedCaseStudy =
      caseStudies.find((item) => item.project_id === project.id) || null;

    const record = selectedCaseStudy;

    kickerInput.value = record?.kicker || "";
    headlineInput.value = record?.headline || "";
    leadInput.value = record?.lead || "";
    relatedSelect.value = record?.related_project_id || "";
    ctaLabelInput.value = record?.cta_label || "";
    ctaHrefInput.value = record?.cta_href || "";

    [...heroMediaSelect.options]
      .filter((option) => option.value === CURRENT_HERO_VALUE)
      .forEach((option) => option.remove());

    const heroMedia = getMediaByUrl(record?.hero_image_url || "");
    const existingHeroUrl = cleanText(record?.hero_image_url || "", 1200);

    if (existingHeroUrl && !heroMedia) {
      const currentHeroOption = document.createElement("option");
      currentHeroOption.value = CURRENT_HERO_VALUE;
      currentHeroOption.textContent = "Keep current existing hero";
      heroMediaSelect.insertBefore(
        currentHeroOption,
        heroMediaSelect.options[1] || null
      );
      heroMediaSelect.value = CURRENT_HERO_VALUE;
    } else {
      heroMediaSelect.value = heroMedia?.id || "";
    }

    facts = normalizeFacts(record?.facts || []);
    sections = normalizeSections(record?.sections || []);

    renderFacts();
    renderSections();

    setFormMessage(
      record
        ? record.is_published
          ? "Published case study loaded."
          : "Draft case study loaded."
        : "No case study yet. Build it and save a draft."
    );

    setBusy(false);
  };

  const loadData = async () => {
    setBusy(true);
    setState("Loading…");
    setMessage("Loading Case Study data…");

    try {
      const [projectResult, mediaResult, caseResult] = await Promise.all([
        supabaseClient
          .from("portfolio_projects")
          .select(
            "id,slug,title,summary,category_id,cover_image_url,cover_image_alt,tags,visibility,is_published,sort_order"
          )
          .order("sort_order", { ascending: true })
          .order("title", { ascending: true }),
        supabaseClient
          .from("portfolio_media")
          .select(
            "id,original_filename,alt_text,display_url,thumbnail_url,display_width,display_height,created_at"
          )
          .order("created_at", { ascending: false }),
        supabaseClient
          .from("portfolio_case_studies")
          .select(
            "id,project_id,kicker,headline,lead,hero_image_url,hero_image_alt,facts,sections,related_project_id,cta_label,cta_href,is_published,published_at,created_at,updated_at"
          )
          .order("updated_at", { ascending: false })
      ]);

      if (projectResult.error) throw projectResult.error;
      if (mediaResult.error) throw mediaResult.error;
      if (caseResult.error) {
        if (/portfolio_case_studies/i.test(caseResult.error.message || "")) {
          throw new Error(
            "Phase 4 database table is missing. Run migration 012_case_study_engine.sql in Supabase first."
          );
        }
        throw caseResult.error;
      }

      projects = projectResult.data || [];
      media = mediaResult.data || [];
      caseStudies = caseResult.data || [];

      fillProjectSelect();
      appendMediaOptions(heroMediaSelect);
      populateForm();

      setState("Case studies ready");
      setMessage(
        projects.length +
          (projects.length === 1 ? " project loaded." : " projects loaded.") +
          " " +
          caseStudies.length +
          (caseStudies.length === 1 ? " case study." : " case studies.")
      );

      return true;
    } catch (error) {
      console.error("Case Study load failed:", error);
      setState("Load failed");
      setMessage(error?.message || "Could not load Case Study data.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const buildPayload = (publish) => {
    const project = getSelectedProject();
    if (!project) throw new Error("Select a project first.");

    const ctaHref = ctaHrefInput.value.trim();
    if (!isSafeHref(ctaHref)) {
      throw new Error("CTA link is not allowed. Use a relative link, http/https, mailto or tel.");
    }

    const heroMedia = getMediaById(heroMediaSelect.value);
    const preserveExistingHero =
      heroMediaSelect.value === CURRENT_HERO_VALUE &&
      Boolean(selectedCaseStudy?.hero_image_url) &&
      !getMediaByUrl(selectedCaseStudy.hero_image_url);

    return {
      project_id: project.id,
      kicker: cleanText(kickerInput.value, 120),
      headline: cleanText(headlineInput.value, 220),
      lead: cleanText(leadInput.value, 1200),
      hero_image_url: heroMedia?.display_url ||
        (preserveExistingHero
          ? cleanText(selectedCaseStudy.hero_image_url, 1200)
          : null),
      hero_image_alt: heroMedia
        ? cleanText(heroMedia.alt_text || "", 220)
        : preserveExistingHero
          ? cleanText(selectedCaseStudy.hero_image_alt || "", 220)
          : "",
      facts: normalizeFacts(facts),
      sections: normalizeSections(sections),
      related_project_id: relatedSelect.value || null,
      cta_label: cleanText(ctaLabelInput.value, 100),
      cta_href: ctaHref || null,
      is_published: Boolean(publish)
    };
  };

  const persist = async (publish) => {
    setBusy(true);
    setFormMessage(publish ? "Publishing case study…" : "Saving draft…");

    try {
      const payload = buildPayload(publish);
      let result;

      if (selectedCaseStudy?.id) {
        result = await supabaseClient
          .from("portfolio_case_studies")
          .update(payload)
          .eq("id", selectedCaseStudy.id)
          .select(
            "id,project_id,kicker,headline,lead,hero_image_url,hero_image_alt,facts,sections,related_project_id,cta_label,cta_href,is_published,published_at,created_at,updated_at"
          )
          .single();
      } else {
        result = await supabaseClient
          .from("portfolio_case_studies")
          .insert(payload)
          .select(
            "id,project_id,kicker,headline,lead,hero_image_url,hero_image_alt,facts,sections,related_project_id,cta_label,cta_href,is_published,published_at,created_at,updated_at"
          )
          .single();
      }

      if (result.error) throw result.error;

      selectedCaseStudy = result.data;

      const index = caseStudies.findIndex(
        (item) => item.project_id === selectedCaseStudy.project_id
      );

      if (index >= 0) {
        caseStudies[index] = selectedCaseStudy;
      } else {
        caseStudies.unshift(selectedCaseStudy);
      }

      facts = normalizeFacts(selectedCaseStudy.facts);
      sections = normalizeSections(selectedCaseStudy.sections);
      renderFacts();
      renderSections();

      setFormMessage(
        publish
          ? "Case study published."
          : "Case study saved as draft."
      );

      setBusy(false);
      return true;
    } catch (error) {
      console.error("Case Study save failed:", error);
      setFormMessage(error?.message || "Could not save case study.");
      setBusy(false);
      return false;
    }
  };

  projectSelect.addEventListener("change", populateForm);

  addFactButton.addEventListener("click", () => {
    if (facts.length >= 8) {
      setFormMessage("Maximum 8 summary facts.");
      return;
    }

    facts.push({ label: "", value: "" });
    renderFacts();
    setBusy(false);
  });

  document
    .querySelectorAll("[data-add-case-section]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        if (sections.length >= 20) {
          setFormMessage("Maximum 20 case-study sections.");
          return;
        }

        const type = button.dataset.addCaseSection;
        if (!SECTION_TYPES.has(type)) return;

        const section = {
          id: makeLocalId(),
          type,
          eyebrow: "",
          title: "",
          body: ""
        };

        if (type === "image") {
          section.layout = "wide";
          section.image_url = "";
          section.image_alt = "";
        }

        if (type === "gallery") section.images = [];
        if (type === "cards") section.cards = [];

        sections.push(section);
        renderSections();
        setBusy(false);
      });
    });

  saveDraftButton.addEventListener("click", () => persist(false));
  publishButton.addEventListener("click", () => persist(true));

  unpublishButton.addEventListener("click", async () => {
    if (!selectedCaseStudy?.id || !selectedCaseStudy.is_published) return;

    setBusy(true);
    setFormMessage("Unpublishing case study…");

    try {
      const result = await supabaseClient
        .from("portfolio_case_studies")
        .update({ is_published: false })
        .eq("id", selectedCaseStudy.id)
        .select(
          "id,project_id,kicker,headline,lead,hero_image_url,hero_image_alt,facts,sections,related_project_id,cta_label,cta_href,is_published,published_at,created_at,updated_at"
        )
        .single();

      if (result.error) throw result.error;

      selectedCaseStudy = result.data;
      const index = caseStudies.findIndex((item) => item.id === result.data.id);
      if (index >= 0) caseStudies[index] = result.data;

      setFormMessage("Case study unpublished and returned to draft.");
    } catch (error) {
      console.error("Case Study unpublish failed:", error);
      setFormMessage(error?.message || "Could not unpublish case study.");
    } finally {
      setBusy(false);
    }
  });

  openPageButton.addEventListener("click", () => {
    const project = getSelectedProject();
    if (!project || !selectedCaseStudy?.is_published) return;

    window.open(
      "../project.html?slug=" + encodeURIComponent(project.slug),
      "_blank",
      "noopener"
    );
  });

  refreshButton.addEventListener("click", loadData);

  navButton.addEventListener("click", async () => {
    showCmsView("case-studies");
    await loadData();
  });

  resetForm();
};
