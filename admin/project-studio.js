const TEST_PROJECT_SLUGS = ["ordering-test-2", "test-portfolio-project"];
const LEGACY_PROJECT_SLUGS = ["ssfc", "biporjoy-18"];
const SHOWCASE_SECTION_ID = "project-gallery";
const BUCKET = "portfolio-media";

const clean = (value, max = 2000) =>
  String(value || "").trim().slice(0, max);

const slugify = (value, max = 120) =>
  clean(value, max)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, max);

const isValidSlug = (value) =>
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(value || ""));

const isSafeHref = (value) => {
  const href = clean(value, 1000);
  if (!href) return true;
  if (/^\s*(javascript|data|vbscript):/i.test(href) || href.startsWith("//")) {
    return false;
  }
  if (/^(#|\/|\.\/|\.\.\/)/.test(href)) return true;
  try {
    return ["https:", "http:", "mailto:", "tel:"].includes(new URL(href).protocol);
  } catch {
    return !/^[a-z][a-z0-9+.-]*:/i.test(href);
  }
};

const normalizeList = (value, maxItems = 20, maxLength = 50) => {
  const source = Array.isArray(value) ? value : String(value || "").split(",");
  const seen = new Set();
  const output = [];
  source.forEach((item) => {
    const next = clean(item, maxLength).replace(/\s+/g, " ");
    const key = next.toLowerCase();
    if (!next || seen.has(key) || output.length >= maxItems) return;
    seen.add(key);
    output.push(next);
  });
  return output;
};

const createLegacyCaseStudy = (slug, relatedProjectId = null) => {
  if (slug === "ssfc") {
    return {
      kicker: "Featured Case Study · SSFC",
      headline: "Shaheen School Football Championship",
      lead: "A multi-season football tournament design system covering social media, match graphics, jerseys, notices, event branding and large-format print, with Season 4 organizing responsibility.",
      hero_image_url: "assets/ssfc/stage-16x8.svg",
      hero_image_alt: "SSFC stage banner",
      facts: [
        { label: "PROJECT", value: "SSFC · Seasons 1–4" },
        { label: "ROLE", value: "Lead Graphic Designer" },
        { label: "SEASON 4", value: "Co-Organizer" },
        { label: "LOCATION", value: "Tangail, Bangladesh" }
      ],
      sections: [
        {
          id: "ssfc-overview",
          type: "text",
          eyebrow: "Project Scope",
          title: "One tournament, many formats",
          body: "SSFC needs graphics for social posts, fixtures, match graphics, jerseys, notices, champion posts, stage backdrops, rally materials and stadium banners."
        },
        {
          id: "ssfc-stadium",
          type: "image",
          eyebrow: "Stadium Outside",
          title: "16 × 4 FT Banner",
          body: "Large-format stadium artwork kept in its natural proportion.",
          layout: "portrait",
          image_url: "assets/ssfc/stadium-16x4.svg",
          image_alt: "SSFC 16 by 4 ft stadium outside banner"
        },
        {
          id: "ssfc-stage",
          type: "image",
          eyebrow: "Stage Backdrop",
          title: "16 × 8 FT Stage Banner",
          body: "Wide stage backdrop with tournament and team information.",
          layout: "wide",
          image_url: "assets/ssfc/stage-16x8.svg",
          image_alt: "SSFC 16 by 8 ft stage banner"
        },
        {
          id: "ssfc-rally",
          type: "image",
          eyebrow: "Grand Rally",
          title: "7 × 4 FT Rally Graphic",
          body: "Rally artwork presented in its natural landscape proportion.",
          layout: "wide",
          image_url: "assets/ssfc/rally-7x4.svg",
          image_alt: "SSFC 7 by 4 ft rally graphic"
        },
        {
          id: "ssfc-role",
          type: "cards",
          eyebrow: "Role & Responsibility",
          title: "More than design",
          body: "Across the tournament I handled visual work and supported real event operations.",
          cards: [
            { title: "Visual Identity", text: "Consistent tournament look across digital and print materials." },
            { title: "Match Content", text: "Fixtures, match graphics, notices, champion posts and social assets." },
            { title: "Event Graphics", text: "Stage, stadium, rally, banner and other large-format designs." },
            { title: "Organization", text: "Season 4 organizing responsibility alongside the design work." }
          ]
        },
        {
          id: SHOWCASE_SECTION_ID,
          type: "gallery",
          eyebrow: "More Work",
          title: "SSFC Project Gallery",
          body: "Additional fixtures, match graphics, jerseys, notices, champion posts and event visuals.",
          images: []
        }
      ],
      related_project_id: relatedProjectId,
      cta_label: "",
      cta_href: null,
      is_published: true
    };
  }

  return {
    kicker: "Complete Team Identity",
    headline: "Biporjoy 18",
    lead: "A football team identity for SSC Batch 2018, from the logo and visual direction to jerseys, social media graphics and match-day presentation.",
    hero_image_url: "assets/project-biporjoy.jpg",
    hero_image_alt: "Biporjoy 18 team branding",
    facts: [
      { label: "PROJECT", value: "Biporjoy 18" },
      { label: "ROLE", value: "Team Manager · Lead Designer" },
      { label: "TEAM", value: "SSC Batch 2018" },
      { label: "SCOPE", value: "Branding · Jersey · Graphics" }
    ],
    sections: [
      {
        id: "biporjoy-overview",
        type: "text",
        eyebrow: "The Identity",
        title: "Designed as one complete system",
        body: "Biporjoy 18 was built as a consistent football identity rather than a collection of unrelated graphics. The team look carries from the logo into jerseys and tournament communication."
      },
      {
        id: "biporjoy-core-gallery",
        type: "gallery",
        eyebrow: "Brand & Apparel",
        title: "Identity and jersey work",
        body: "Core team branding and kit applications.",
        images: [
          { url: "assets/project-biporjoy.jpg", alt: "Biporjoy 18 team logo and identity" },
          { url: "assets/project-jersey.jpg", alt: "Biporjoy 18 jersey design" }
        ]
      },
      {
        id: "biporjoy-role",
        type: "cards",
        eyebrow: "My Contribution",
        title: "Design and team responsibility",
        body: "Creative direction was combined with team-management responsibility.",
        cards: [
          { title: "Identity", text: "Logo and recognizable team visual language." },
          { title: "Jerseys", text: "Home and away kit concepts and presentation." },
          { title: "Social Graphics", text: "Team and tournament communication visuals." },
          { title: "Management", text: "Team Manager responsibilities alongside creative work." }
        ]
      },
      {
        id: SHOWCASE_SECTION_ID,
        type: "gallery",
        eyebrow: "More Work",
        title: "Biporjoy 18 Project Gallery",
        body: "Additional team, tournament and match-day visuals.",
        images: []
      }
    ],
    related_project_id: relatedProjectId,
    cta_label: "",
    cta_href: null,
    is_published: true
  };
};

export const initProjectStudio = ({ supabaseClient, showCmsView }) => {
  const navButton = document.querySelector("#projectStudioNavButton");
  const state = document.querySelector("#projectStudioState");
  const message = document.querySelector("#projectStudioMessage");
  const refreshButton = document.querySelector("#projectStudioRefreshButton");
  const newButton = document.querySelector("#projectStudioNewButton");
  const list = document.querySelector("#projectStudioList");
  const form = document.querySelector("#projectStudioForm");
  const formMessage = document.querySelector("#projectStudioFormMessage");

  const idInput = document.querySelector("#projectStudioId");
  const titleInput = document.querySelector("#projectStudioTitle");
  const slugInput = document.querySelector("#projectStudioSlug");
  const summaryInput = document.querySelector("#projectStudioSummary");
  const categoryInput = document.querySelector("#projectStudioCategory");
  const visibilityInput = document.querySelector("#projectStudioVisibility");
  const homepageInput = document.querySelector("#projectStudioHomepage");
  const featuredInput = document.querySelector("#projectStudioFeatured");
  const tagsInput = document.querySelector("#projectStudioTags");
  const badgesInput = document.querySelector("#projectStudioBadges");
  const actionLabelInput = document.querySelector("#projectStudioActionLabel");
  const actionHrefInput = document.querySelector("#projectStudioActionHref");

  const coverInput = document.querySelector("#projectStudioCoverInput");
  const coverUrlInput = document.querySelector("#projectStudioCoverUrl");
  const coverAltInput = document.querySelector("#projectStudioCoverAlt");
  const coverPreview = document.querySelector("#projectStudioCoverPreview");
  const coverStatus = document.querySelector("#projectStudioCoverStatus");

  const kickerInput = document.querySelector("#projectStudioKicker");
  const headlineInput = document.querySelector("#projectStudioHeadline");
  const leadInput = document.querySelector("#projectStudioLead");
  const galleryTitleInput = document.querySelector("#projectStudioGalleryTitle");
  const galleryInput = document.querySelector("#projectStudioGalleryInput");
  const galleryStatus = document.querySelector("#projectStudioGalleryStatus");
  const galleryGrid = document.querySelector("#projectStudioGalleryGrid");

  const heroImageInput = document.querySelector("#projectStudioHeroImageInput");
  const heroImageUrlInput = document.querySelector("#projectStudioHeroImageUrl");
  const heroImageAltInput = document.querySelector("#projectStudioHeroImageAlt");
  const heroImagePreview = document.querySelector("#projectStudioHeroImagePreview");
  const heroImageStatus = document.querySelector("#projectStudioHeroImageStatus");
  const factsRoot = document.querySelector("#projectStudioFacts");
  const existingSectionsRoot = document.querySelector("#projectStudioExistingSections");

  const saveButton = document.querySelector("#projectStudioSaveButton");
  const publishButton = document.querySelector("#projectStudioPublishButton");
  const unpublishButton = document.querySelector("#projectStudioUnpublishButton");
  const deleteButton = document.querySelector("#projectStudioDeleteButton");
  const openButton = document.querySelector("#projectStudioOpenButton");

  if (!navButton || !form || !list) return;

  let categories = [];
  let projects = [];
  let caseStudies = [];
  let currentProject = null;
  let currentCaseStudy = null;
  let showcaseItems = [];
  let caseFactsDraft = [];
  let existingSectionsDraft = [];
  let busy = false;
  let repairAttempted = false;

  const setState = (value) => {
    if (state) state.textContent = value;
  };

  const setMessage = (value = "") => {
    if (message) message.textContent = value;
  };

  const setFormMessage = (value = "") => {
    if (formMessage) formMessage.textContent = value;
  };

  const setBusy = (value) => {
    busy = value;
    [
      refreshButton,
      newButton,
      saveButton,
      publishButton,
      unpublishButton,
      deleteButton,
      openButton,
      coverInput,
      galleryInput,
      heroImageInput
    ].forEach((element) => {
      if (element) element.disabled = value;
    });
  };

  const categoryName = (id) =>
    categories.find((item) => item.id === id)?.name || "Uncategorized";

  const getManagedShowcase = (sections = []) =>
    (Array.isArray(sections) ? sections : []).find(
      (section) => section?.id === SHOWCASE_SECTION_ID
    ) || null;

  const normalizeShowcaseItem = (item, index = 0) => {
    const legacyUrl = clean(item?.url || item?.image_url, 1200);
    const legacyAlt = clean(item?.alt || item?.image_alt, 220);
    return {
      image_url: legacyUrl,
      image_alt: legacyAlt || "Project artwork",
      label: clean(item?.label || item?.eyebrow || "Project Artwork", 100),
      title: clean(
        item?.title ||
          legacyAlt ||
          "Project Artwork " + String(index + 1).padStart(2, "0"),
        220
      ),
      description: clean(item?.description || item?.body, 1200),
      meta: clean(
        Array.isArray(item?.meta) ? item.meta.join(" | ") : item?.meta,
        500
      )
    };
  };

  const withManagedShowcase = (sections = []) => {
    const source = Array.isArray(sections) ? sections : [];
    const next = source.filter((section) => section?.id !== SHOWCASE_SECTION_ID);
    const items = showcaseItems
      .filter((item) => item?.image_url)
      .map((item, index) => normalizeShowcaseItem(item, index));

    if (items.length) {
      next.push({
        id: SHOWCASE_SECTION_ID,
        type: "showcase",
        eyebrow: "Selected Work",
        title: clean(galleryTitleInput?.value || "Project Showcase", 220) || "Project Showcase",
        body: "Selected project work presented one piece at a time with its own details.",
        items
      });
    }

    return next.slice(0, 20);
  };

  const renderCategories = () => {
    const current = categoryInput.value;
    categoryInput.replaceChildren();

    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = "No category";
    categoryInput.appendChild(empty);

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      categoryInput.appendChild(option);
    });

    if ([...categoryInput.options].some((option) => option.value === current)) {
      categoryInput.value = current;
    }
  };

  const syncCoverPreview = () => {
    const src = clean(coverUrlInput.value, 1200);
    if (!src) {
      coverPreview.hidden = true;
      coverPreview.removeAttribute("src");
      return;
    }
    coverPreview.src = src;
    coverPreview.alt = clean(coverAltInput.value, 220) || "Project cover preview";
    coverPreview.hidden = false;
  };

  const renderShowcase = () => {
    galleryGrid.replaceChildren();

    if (!showcaseItems.length) {
      const empty = document.createElement("div");
      empty.className = "manager-empty";
      empty.textContent = "No showcase items yet. Upload images above, then add details for each one.";
      galleryGrid.appendChild(empty);
      return;
    }

    showcaseItems.forEach((item, index) => {
      const card = document.createElement("article");
      card.className = "project-studio-showcase-card";

      const preview = document.createElement("div");
      preview.className = "project-studio-showcase-preview";

      const image = document.createElement("img");
      image.src = item.image_url;
      image.alt = item.image_alt || item.title || "Project artwork";
      image.loading = "lazy";
      image.decoding = "async";
      preview.appendChild(image);

      const fields = document.createElement("div");
      fields.className = "project-studio-showcase-fields";

      const makeField = (labelText, field) => {
        const label = document.createElement("label");
        const span = document.createElement("span");
        span.textContent = labelText;
        label.append(span, field);
        return label;
      };

      const labelInput = document.createElement("input");
      labelInput.type = "text";
      labelInput.maxLength = 100;
      labelInput.value = item.label || "";
      labelInput.placeholder = "Match Graphic / Banner / Jersey";
      labelInput.addEventListener("change", async () => {
        item.label = clean(labelInput.value, 100);
        await saveShowcaseOnly("Item label saved.");
      });

      const title = document.createElement("input");
      title.type = "text";
      title.maxLength = 220;
      title.value = item.title || "";
      title.placeholder = "Season 4 Opening Poster";
      title.addEventListener("change", async () => {
        item.title = clean(title.value, 220);
        await saveShowcaseOnly("Item title saved.");
      });

      const description = document.createElement("textarea");
      description.maxLength = 1200;
      description.rows = 4;
      description.value = item.description || "";
      description.placeholder = "What this design was for, your role and what makes it important.";
      description.addEventListener("change", async () => {
        item.description = clean(description.value, 1200);
        await saveShowcaseOnly("Item description saved.");
      });

      const meta = document.createElement("input");
      meta.type = "text";
      meta.maxLength = 500;
      meta.value = item.meta || "";
      meta.placeholder = "16 × 8 FT | Season 4 | Large Format";
      meta.addEventListener("change", async () => {
        item.meta = clean(meta.value, 500);
        await saveShowcaseOnly("Item details saved.");
      });

      const alt = document.createElement("input");
      alt.type = "text";
      alt.maxLength = 220;
      alt.value = item.image_alt || "";
      alt.placeholder = "Describe this image";
      alt.addEventListener("change", async () => {
        item.image_alt = clean(alt.value, 220) || "Project artwork";
        await saveShowcaseOnly("Image alt text saved.");
      });

      fields.append(
        makeField("Label", labelInput),
        makeField("Title", title),
        makeField("Description", description),
        makeField("Details", meta),
        makeField("Image alt text", alt)
      );

      const actions = document.createElement("div");
      actions.className = "project-studio-showcase-actions";

      const up = document.createElement("button");
      up.type = "button";
      up.className = "secondary-button";
      up.textContent = "Move up";
      up.disabled = busy || index === 0;
      up.addEventListener("click", async () => {
        [showcaseItems[index - 1], showcaseItems[index]] = [
          showcaseItems[index],
          showcaseItems[index - 1]
        ];
        renderShowcase();
        await saveShowcaseOnly("Showcase order saved.");
      });

      const down = document.createElement("button");
      down.type = "button";
      down.className = "secondary-button";
      down.textContent = "Move down";
      down.disabled = busy || index === showcaseItems.length - 1;
      down.addEventListener("click", async () => {
        [showcaseItems[index + 1], showcaseItems[index]] = [
          showcaseItems[index],
          showcaseItems[index + 1]
        ];
        renderShowcase();
        await saveShowcaseOnly("Showcase order saved.");
      });

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "text-button manager-delete-button";
      remove.textContent = "Remove";
      remove.addEventListener("click", async () => {
        showcaseItems.splice(index, 1);
        renderShowcase();
        await saveShowcaseOnly("Item removed from project showcase.");
      });

      actions.append(up, down, remove);
      card.append(preview, fields, actions);
      galleryGrid.appendChild(card);
    });
  };

  const syncHeroImagePreview = () => {
    const src = clean(heroImageUrlInput?.value, 1200);
    if (!heroImagePreview) return;

    if (!src) {
      heroImagePreview.hidden = true;
      heroImagePreview.removeAttribute("src");
      heroImagePreview.alt = "";
      return;
    }

    heroImagePreview.src = src;
    heroImagePreview.alt =
      clean(heroImageAltInput?.value, 220) || "Case-study hero preview";
    heroImagePreview.hidden = false;
  };

  const renderFacts = () => {
    if (!factsRoot) return;
    factsRoot.replaceChildren();

    if (!caseFactsDraft.length) {
      caseFactsDraft = [
        { label: "PROJECT", value: currentProject?.title || "" },
        { label: "ROLE", value: "" },
        { label: "YEAR", value: "" },
        { label: "LOCATION", value: "" }
      ];
    }

    caseFactsDraft.forEach((fact, index) => {
      const row = document.createElement("div");
      row.className = "project-studio-fact-row";

      const label = document.createElement("input");
      label.type = "text";
      label.maxLength = 80;
      label.placeholder = "Label";
      label.value = clean(fact?.label, 80);
      label.addEventListener("input", () => {
        caseFactsDraft[index].label = clean(label.value, 80);
      });

      const value = document.createElement("input");
      value.type = "text";
      value.maxLength = 220;
      value.placeholder = "Value";
      value.value = clean(fact?.value, 220);
      value.addEventListener("input", () => {
        caseFactsDraft[index].value = clean(value.value, 220);
      });

      row.append(label, value);
      factsRoot.appendChild(row);
    });
  };

  const makeExistingField = ({
    labelText,
    value = "",
    maxLength = 1200,
    multiline = false,
    wide = false,
    onInput
  }) => {
    const label = document.createElement("label");
    if (wide) label.classList.add("wide");

    const span = document.createElement("span");
    span.textContent = labelText;

    const field = multiline
      ? document.createElement("textarea")
      : document.createElement("input");

    if (multiline) {
      field.rows = 4;
    } else {
      field.type = "text";
    }

    field.maxLength = maxLength;
    field.value = clean(value, maxLength);
    field.addEventListener("input", () => onInput(clean(field.value, maxLength)));

    label.append(span, field);
    return label;
  };

  const renderExistingSections = () => {
    if (!existingSectionsRoot) return;
    existingSectionsRoot.replaceChildren();

    if (!existingSectionsDraft.length) {
      const empty = document.createElement("div");
      empty.className = "manager-empty";
      empty.textContent = "No existing case-study blocks. Add new detailed items in Project Showcase below.";
      existingSectionsRoot.appendChild(empty);
      return;
    }

    existingSectionsDraft.forEach((section, sectionIndex) => {
      const card = document.createElement("article");
      card.className = "project-studio-existing-card";

      const head = document.createElement("div");
      head.className = "project-studio-existing-card-head";

      const name = document.createElement("strong");
      name.textContent = section.title || section.eyebrow || "Case-study block";

      const type = document.createElement("span");
      type.textContent = section.type || "text";

      head.append(name, type);
      card.appendChild(head);

      const fields = document.createElement("div");
      fields.className = "project-studio-existing-fields";

      fields.append(
        makeExistingField({
          labelText: "Small label",
          value: section.eyebrow,
          maxLength: 120,
          onInput: (value) => {
            existingSectionsDraft[sectionIndex].eyebrow = value;
            name.textContent = existingSectionsDraft[sectionIndex].title || value || "Case-study block";
          }
        }),
        makeExistingField({
          labelText: "Title",
          value: section.title,
          maxLength: 220,
          onInput: (value) => {
            existingSectionsDraft[sectionIndex].title = value;
            name.textContent = value || existingSectionsDraft[sectionIndex].eyebrow || "Case-study block";
          }
        }),
        makeExistingField({
          labelText: "Description",
          value: section.body,
          maxLength: 1600,
          multiline: true,
          wide: true,
          onInput: (value) => {
            existingSectionsDraft[sectionIndex].body = value;
          }
        })
      );

      card.appendChild(fields);

      if (section.type === "image") {
        const imageRow = document.createElement("div");
        imageRow.className = "project-studio-existing-image-row";

        const imageFields = document.createElement("div");
        imageFields.className = "project-studio-existing-fields";

        const urlField = makeExistingField({
          labelText: "Image URL",
          value: section.image_url,
          maxLength: 1200,
          wide: true,
          onInput: (value) => {
            existingSectionsDraft[sectionIndex].image_url = value;
            previewImage.src = value;
          }
        });

        const altField = makeExistingField({
          labelText: "Image alt text",
          value: section.image_alt,
          maxLength: 220,
          wide: true,
          onInput: (value) => {
            existingSectionsDraft[sectionIndex].image_alt = value;
            previewImage.alt = value || "Project artwork";
          }
        });

        const uploadLabel = document.createElement("label");
        uploadLabel.className = "wide media-file-field";
        const uploadSpan = document.createElement("span");
        uploadSpan.textContent = "Replace this image";
        const upload = document.createElement("input");
        upload.type = "file";
        upload.accept = "image/jpeg,image/png,image/webp";
        const uploadSmall = document.createElement("small");
        uploadSmall.textContent = "Choose a JPG, PNG or WebP replacement.";
        uploadLabel.append(uploadSpan, upload, uploadSmall);

        imageFields.append(urlField, altField, uploadLabel);

        const preview = document.createElement("div");
        preview.className = "project-studio-existing-image-preview";
        const previewImage = document.createElement("img");
        previewImage.src = clean(section.image_url, 1200);
        previewImage.alt = clean(section.image_alt, 220) || "Project artwork";
        preview.appendChild(previewImage);

        upload.addEventListener("change", async () => {
          const file = upload.files?.[0];
          if (!file) return;
          setBusy(true);
          try {
            const url = await uploadImage(file, "section");
            const defaultAlt =
              clean(file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "), 220) ||
              "Project artwork";
            existingSectionsDraft[sectionIndex].image_url = url;
            if (!existingSectionsDraft[sectionIndex].image_alt) {
              existingSectionsDraft[sectionIndex].image_alt = defaultAlt;
            }
            renderExistingSections();
            setFormMessage("Replacement image uploaded. Press Save changes or Publish project.");
          } catch (error) {
            setFormMessage(error?.message || "Could not replace this image.");
          } finally {
            setBusy(false);
          }
        });

        imageRow.append(imageFields, preview);
        card.appendChild(imageRow);
      }

      if (section.type === "cards") {
        const cardsRoot = document.createElement("div");
        cardsRoot.className = "project-studio-existing-cards";
        const cards = Array.isArray(section.cards) ? section.cards : [];

        cards.forEach((miniCard, cardIndex) => {
          const mini = document.createElement("div");
          mini.className = "project-studio-existing-mini-card";

          mini.append(
            makeExistingField({
              labelText: "Card title",
              value: miniCard?.title,
              maxLength: 160,
              onInput: (value) => {
                existingSectionsDraft[sectionIndex].cards[cardIndex].title = value;
              }
            }),
            makeExistingField({
              labelText: "Card text",
              value: miniCard?.text,
              maxLength: 600,
              onInput: (value) => {
                existingSectionsDraft[sectionIndex].cards[cardIndex].text = value;
              }
            })
          );

          cardsRoot.appendChild(mini);
        });

        card.appendChild(cardsRoot);
      }

      if (section.type === "gallery") {
        const images = Array.isArray(section.images) ? section.images : [];
        const galleryRoot = document.createElement("div");
        galleryRoot.className = "project-studio-existing-cards";

        images.forEach((galleryImage, imageIndex) => {
          const imageRow = document.createElement("div");
          imageRow.className = "project-studio-existing-image-row";

          const imageFields = document.createElement("div");
          imageFields.className = "project-studio-existing-fields";

          imageFields.append(
            makeExistingField({
              labelText: "Image URL",
              value: galleryImage?.url,
              maxLength: 1200,
              wide: true,
              onInput: (value) => {
                existingSectionsDraft[sectionIndex].images[imageIndex].url = value;
                previewImage.src = value;
              }
            }),
            makeExistingField({
              labelText: "Image alt text",
              value: galleryImage?.alt,
              maxLength: 220,
              wide: true,
              onInput: (value) => {
                existingSectionsDraft[sectionIndex].images[imageIndex].alt = value;
                previewImage.alt = value || "Project artwork";
              }
            })
          );

          const preview = document.createElement("div");
          preview.className = "project-studio-existing-image-preview";
          const previewImage = document.createElement("img");
          previewImage.src = clean(galleryImage?.url, 1200);
          previewImage.alt = clean(galleryImage?.alt, 220) || "Project artwork";
          preview.appendChild(previewImage);

          imageRow.append(imageFields, preview);
          galleryRoot.appendChild(imageRow);
        });

        card.appendChild(galleryRoot);
      }

      existingSectionsRoot.appendChild(card);
    });
  };

  const renderProjectList = () => {
    list.replaceChildren();

    if (!projects.length) {
      const empty = document.createElement("div");
      empty.className = "manager-empty";
      empty.textContent = "No projects yet. Create the first project from Project Studio.";
      list.appendChild(empty);
      return;
    }

    projects.forEach((project) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "project-studio-list-card";
      card.classList.toggle("active", currentProject?.id === project.id);

      const copy = document.createElement("span");
      const title = document.createElement("strong");
      title.textContent = project.title;
      const meta = document.createElement("small");
      meta.textContent = [
        categoryName(project.category_id),
        project.visibility === "private" ? "Private" : "Public",
        project.is_published ? "Published" : "Draft"
      ].join(" · ");
      copy.append(title, meta);

      const edit = document.createElement("b");
      edit.textContent = "Edit →";
      card.append(copy, edit);
      card.addEventListener("click", () => selectProject(project.id));
      list.appendChild(card);
    });
  };

  const resetForm = () => {
    currentProject = null;
    currentCaseStudy = null;
    showcaseItems = [];
    caseFactsDraft = [];
    existingSectionsDraft = [];
    form.reset();
    delete slugInput.dataset.manual;
    idInput.value = "";
    visibilityInput.value = "public";
    actionLabelInput.value = "View project";
    coverUrlInput.value = "";
    coverAltInput.value = "";
    galleryTitleInput.value = "Project Showcase";
    if (heroImageUrlInput) heroImageUrlInput.value = "";
    if (heroImageAltInput) heroImageAltInput.value = "";
    if (heroImageInput) heroImageInput.value = "";
    if (heroImageStatus) heroImageStatus.textContent = "";
    homepageInput.checked = false;
    featuredInput.checked = false;
    publishButton.textContent = "Publish project";
    unpublishButton.hidden = true;
    deleteButton.hidden = true;
    openButton.hidden = true;
    syncCoverPreview();
    syncHeroImagePreview();
    renderFacts();
    renderExistingSections();
    renderShowcase();
    renderProjectList();
    setFormMessage("Create a project here. Cover, showcase items and case-study content stay together in this editor.");
  };

  const selectProject = (id) => {
    const project = projects.find((item) => item.id === id);
    if (!project) return;

    currentProject = project;
    currentCaseStudy = caseStudies.find((item) => item.project_id === id) || null;

    idInput.value = project.id;
    titleInput.value = project.title || "";
    slugInput.value = project.slug || "";
    slugInput.dataset.manual = "true";
    summaryInput.value = project.summary || "";
    categoryInput.value = project.category_id || "";
    visibilityInput.value = project.visibility || "public";
    homepageInput.checked = Boolean(project.show_on_homepage);
    featuredInput.checked = Boolean(project.is_featured);
    tagsInput.value = (project.tags || []).join(", ");
    badgesInput.value = (project.badges || []).join(", ");
    actionLabelInput.value = project.action_label || "View project";
    actionHrefInput.value = project.action_href || "";
    coverUrlInput.value = project.cover_image_url || "";
    coverAltInput.value = project.cover_image_alt || "";

    kickerInput.value = currentCaseStudy?.kicker || "";
    headlineInput.value = currentCaseStudy?.headline || "";
    leadInput.value = currentCaseStudy?.lead || "";

    if (heroImageUrlInput) {
      heroImageUrlInput.value =
        currentCaseStudy?.hero_image_url || project.cover_image_url || "";
    }
    if (heroImageAltInput) {
      heroImageAltInput.value =
        currentCaseStudy?.hero_image_alt || project.cover_image_alt || "";
    }

    caseFactsDraft = structuredClone(
      Array.isArray(currentCaseStudy?.facts) ? currentCaseStudy.facts : []
    );

    existingSectionsDraft = structuredClone(
      (Array.isArray(currentCaseStudy?.sections) ? currentCaseStudy.sections : [])
        .filter((section) => section?.id !== SHOWCASE_SECTION_ID)
    );

    const showcase = getManagedShowcase(currentCaseStudy?.sections || []);
    galleryTitleInput.value = showcase?.title || "Project Showcase";

    if (Array.isArray(showcase?.items)) {
      showcaseItems = showcase.items
        .filter((item) => item?.image_url || item?.url)
        .map((item, index) => normalizeShowcaseItem(item, index));
    } else {
      showcaseItems = (Array.isArray(showcase?.images) ? showcase.images : [])
        .filter((item) => item?.url)
        .map((item, index) => normalizeShowcaseItem(item, index));
    }

    unpublishButton.hidden = !project.is_published;
    deleteButton.hidden = false;
    openButton.hidden = !(project.is_published && project.visibility === "public");
    publishButton.textContent = project.is_published ? "Save & keep published" : "Publish project";
    syncCoverPreview();
    syncHeroImagePreview();
    renderFacts();
    renderExistingSections();
    renderShowcase();
    renderProjectList();
    setFormMessage("Editing " + project.title + ". Everything important for this project is on this page.");
    titleInput.focus();
  };

  const loadImage = async (file) => {
    const objectUrl = URL.createObjectURL(file);
    try {
      const image = await new Promise((resolve, reject) => {
        const preview = new Image();
        preview.onload = () => resolve(preview);
        preview.onerror = () => reject(new Error("Could not read " + file.name));
        preview.src = objectUrl;
      });
      return image;
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  };

  const optimizeImage = async (file, maxWidth = 2000) => {
    if (!/^image\/(jpeg|png|webp)$/i.test(file.type || "")) {
      throw new Error("Use JPG, PNG or WebP images.");
    }
    if (file.size > 25 * 1024 * 1024) {
      throw new Error(file.name + " is larger than 25 MB.");
    }

    const image = await loadImage(file);
    const sourceWidth = image.naturalWidth || image.width;
    const sourceHeight = image.naturalHeight || image.height;
    const width = Math.min(sourceWidth, maxWidth);
    const height = Math.max(1, Math.round(sourceHeight * (width / sourceWidth)));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) throw new Error("Image optimization is unavailable in this browser.");
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(image, 0, 0, sourceWidth, sourceHeight, 0, 0, width, height);

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (value) => value ? resolve(value) : reject(new Error("Could not optimize " + file.name)),
        "image/webp",
        0.84
      );
    });

    return { blob, width, height };
  };

  const uploadImage = async (file, area) => {
    const optimized = await optimizeImage(file, area === "cover" ? 1800 : 2200);
    const unique = globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2);
    const projectPart = currentProject?.slug || slugify(slugInput.value || titleInput.value) || "draft";
    const path = `projects/studio/${projectPart}/${area}/${Date.now()}-${unique}.webp`;

    const upload = await supabaseClient.storage
      .from(BUCKET)
      .upload(path, optimized.blob, {
        cacheControl: "31536000",
        contentType: "image/webp",
        upsert: false
      });

    if (upload.error) throw upload.error;

    const publicResult = supabaseClient.storage.from(BUCKET).getPublicUrl(path);
    const publicUrl = publicResult?.data?.publicUrl;
    if (!publicUrl) throw new Error("Storage did not return an image URL.");

    return publicUrl;
  };

  const persistCaseStudy = async ({ publish = null } = {}) => {
    if (!currentProject?.id) return null;

    const payload = {
      project_id: currentProject.id,
      kicker: clean(kickerInput.value, 120),
      headline: clean(headlineInput.value, 220),
      lead: clean(leadInput.value, 1200),
      hero_image_url:
        clean(heroImageUrlInput?.value, 1200) ||
        currentProject.cover_image_url ||
        null,
      hero_image_alt:
        clean(heroImageAltInput?.value, 220) ||
        currentProject.cover_image_alt ||
        "",
      facts: caseFactsDraft
        .map((fact) => ({
          label: clean(fact?.label, 80),
          value: clean(fact?.value, 220)
        }))
        .filter((fact) => fact.label || fact.value)
        .slice(0, 8),
      sections: withManagedShowcase(existingSectionsDraft),
      related_project_id: currentCaseStudy?.related_project_id || null,
      cta_label: currentCaseStudy?.cta_label || "",
      cta_href: currentCaseStudy?.cta_href || null,
      is_published: publish === null
        ? Boolean(currentCaseStudy?.is_published)
        : Boolean(publish)
    };

    const result = currentCaseStudy?.id
      ? await supabaseClient
          .from("portfolio_case_studies")
          .update(payload)
          .eq("id", currentCaseStudy.id)
          .select("*")
          .single()
      : await supabaseClient
          .from("portfolio_case_studies")
          .insert(payload)
          .select("*")
          .single();

    if (result.error) throw result.error;
    currentCaseStudy = result.data;
    return result.data;
  };

  async function saveShowcaseOnly(successMessage = "Project showcase saved.") {
    if (!currentProject?.id || busy) return;
    setBusy(true);
    if (galleryStatus) galleryStatus.textContent = "Saving showcase…";
    try {
      await persistCaseStudy();
      const index = caseStudies.findIndex((item) => item.project_id === currentProject.id);
      if (index >= 0) caseStudies[index] = currentCaseStudy;
      else caseStudies.push(currentCaseStudy);
      if (galleryStatus) galleryStatus.textContent = successMessage;
    } catch (error) {
      console.error("Project Studio showcase save failed:", error);
      if (galleryStatus) galleryStatus.textContent = error?.message || "Could not save the showcase.";
    } finally {
      setBusy(false);
      renderFacts();
      renderExistingSections();
      renderShowcase();
    }
  }

  const readProjectPayload = (publish = null) => {
    const title = clean(titleInput.value, 160);
    const slug = clean(slugInput.value, 120).toLowerCase();
    const summary = clean(summaryInput.value, 900);
    const coverUrl = clean(coverUrlInput.value, 1200);
    const coverAlt = clean(coverAltInput.value, 220);
    const actionLabel = clean(actionLabelInput.value, 80) || "View project";
    const actionHref = clean(actionHrefInput.value, 500);

    if (!title) throw new Error("Add a project title.");
    if (!isValidSlug(slug)) throw new Error("Use lowercase letters, numbers and hyphens for the slug.");
    if (coverUrl && !coverAlt) throw new Error("Add cover alt text.");
    if (!isSafeHref(actionHref)) throw new Error("The project action link is not allowed.");
    if (homepageInput.checked && visibilityInput.value === "private") {
      throw new Error("A private project cannot be selected for the public homepage.");
    }

    const selectedElsewhere = projects.filter(
      (item) => item.id !== currentProject?.id && item.show_on_homepage
    ).length;
    if (homepageInput.checked && selectedElsewhere >= 4) {
      throw new Error("Homepage already has 4 selected projects. Turn one off first.");
    }

    return {
      title,
      slug,
      summary,
      category_id: categoryInput.value || null,
      cover_image_url: coverUrl || null,
      cover_image_alt: coverAlt,
      action_label: actionLabel,
      action_href: actionHref || null,
      tags: normalizeList(tagsInput.value, 20, 50),
      badges: normalizeList(badgesInput.value, 10, 50),
      show_on_homepage: Boolean(homepageInput.checked),
      is_featured: Boolean(homepageInput.checked && featuredInput.checked),
      visibility: visibilityInput.value === "private" ? "private" : "public",
      is_published: publish === null
        ? Boolean(currentProject?.is_published)
        : Boolean(publish)
    };
  };

  const saveProject = async ({ publish = null } = {}) => {
    setBusy(true);
    setFormMessage(publish === true ? "Publishing project…" : "Saving project…");

    try {
      const payload = readProjectPayload(publish);
      let result;

      if (currentProject?.id) {
        result = await supabaseClient
          .from("portfolio_projects")
          .update(payload)
          .eq("id", currentProject.id)
          .select("*")
          .single();
      } else {
        result = await supabaseClient
          .from("portfolio_projects")
          .insert(payload)
          .select("*")
          .single();
      }

      if (result.error) throw result.error;
      currentProject = result.data;
      idInput.value = currentProject.id;

      await persistCaseStudy({ publish: publish === null ? null : publish });
      await loadData({ repair: false, selectId: currentProject.id });

      setFormMessage(
        publish === true
          ? "Project and case study published."
          : "Changes saved. Cover, homepage settings and case study stay connected here."
      );
      return true;
    } catch (error) {
      console.error("Project Studio save failed:", error);
      setFormMessage(error?.message || "Could not save the project.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const ensureLegacyProjects = async () => {
    if (repairAttempted) return;
    repairAttempted = true;

    try {
      const cleanup = await supabaseClient
        .from("portfolio_projects")
        .delete()
        .in("slug", TEST_PROJECT_SLUGS);
      if (cleanup.error) throw cleanup.error;

      let categoryResult = await supabaseClient
        .from("portfolio_categories")
        .select("id,slug")
        .eq("slug", "sports-branding")
        .maybeSingle();

      if (categoryResult.error) throw categoryResult.error;

      let sportsCategoryId = categoryResult.data?.id || null;
      if (!sportsCategoryId) {
        const inserted = await supabaseClient
          .from("portfolio_categories")
          .insert({
            slug: "sports-branding",
            name: "Sports Branding",
            description: "Tournament, team identity, jersey and sports communication projects.",
            sort_order: 20,
            is_active: true
          })
          .select("id")
          .single();
        if (inserted.error) throw inserted.error;
        sportsCategoryId = inserted.data.id;
      }

      const existingResult = await supabaseClient
        .from("portfolio_projects")
        .select("id,slug")
        .in("slug", LEGACY_PROJECT_SLUGS);
      if (existingResult.error) throw existingResult.error;

      const existing = new Map((existingResult.data || []).map((item) => [item.slug, item.id]));

      if (!existing.has("ssfc")) {
        const inserted = await supabaseClient
          .from("portfolio_projects")
          .insert({
            slug: "ssfc",
            title: "SSFC",
            summary: "Tournament identity, event visuals, social graphics and organizing support for Shaheen School Football Championship.",
            category_id: sportsCategoryId,
            cover_image_url: "assets/case-ssfc-final.jpg",
            cover_image_alt: "Shaheen School Football Championship case study cover",
            action_label: "View case",
            action_href: "project.html?slug=ssfc",
            tags: ["Sports Branding", "Event Design", "Large Format", "Social Media"],
            badges: ["Case Study"],
            show_on_homepage: true,
            is_featured: true,
            sort_order: 10,
            visibility: "public",
            is_published: true
          })
          .select("id,slug")
          .single();
        if (inserted.error) throw inserted.error;
        existing.set("ssfc", inserted.data.id);
      }

      if (!existing.has("biporjoy-18")) {
        const inserted = await supabaseClient
          .from("portfolio_projects")
          .insert({
            slug: "biporjoy-18",
            title: "Biporjoy 18",
            summary: "Football team identity, jersey direction and tournament-ready sports graphics for SSC Batch 2018.",
            category_id: sportsCategoryId,
            cover_image_url: "assets/case-biporjoy18-final.jpg",
            cover_image_alt: "Biporjoy 18 football team identity cover",
            action_label: "View project",
            action_href: "project.html?slug=biporjoy-18",
            tags: ["Team Branding", "Logo Design", "Jersey Design", "Sports Graphics"],
            badges: ["Case Study"],
            show_on_homepage: true,
            is_featured: false,
            sort_order: 20,
            visibility: "public",
            is_published: true
          })
          .select("id,slug")
          .single();
        if (inserted.error) throw inserted.error;
        existing.set("biporjoy-18", inserted.data.id);
      }

      const projectRows = await supabaseClient
        .from("portfolio_projects")
        .select("id,slug")
        .in("slug", LEGACY_PROJECT_SLUGS);
      if (projectRows.error) throw projectRows.error;
      const ids = new Map((projectRows.data || []).map((item) => [item.slug, item.id]));

      const caseRows = await supabaseClient
        .from("portfolio_case_studies")
        .select("id,project_id")
        .in("project_id", [...ids.values()]);
      if (caseRows.error) throw caseRows.error;
      const caseByProject = new Map((caseRows.data || []).map((item) => [item.project_id, item.id]));

      for (const slug of LEGACY_PROJECT_SLUGS) {
        const projectId = ids.get(slug);
        if (!projectId || caseByProject.has(projectId)) continue;
        const relatedId = slug === "ssfc" ? ids.get("biporjoy-18") : ids.get("ssfc");
        const payload = createLegacyCaseStudy(slug, relatedId || null);
        const inserted = await supabaseClient
          .from("portfolio_case_studies")
          .insert({ project_id: projectId, ...payload });
        if (inserted.error) throw inserted.error;
      }

      setMessage("Project Studio ready. SSFC + Biporjoy 18 are connected and old test projects are cleaned up.");
    } catch (error) {
      console.warn("Project Studio legacy repair skipped:", error);
      setMessage(error?.message || "Project Studio loaded, but automatic legacy cleanup could not finish.");
    }
  };

  async function loadData({ repair = true, selectId = null } = {}) {
    setBusy(true);
    setState("Loading…");
    if (!message.textContent) setMessage("Loading projects…");

    try {
      if (repair) await ensureLegacyProjects();

      const [categoryResult, projectResult, caseResult] = await Promise.all([
        supabaseClient
          .from("portfolio_categories")
          .select("id,name,slug,is_active,sort_order")
          .order("sort_order", { ascending: true })
          .order("name", { ascending: true }),
        supabaseClient
          .from("portfolio_projects")
          .select("id,slug,title,summary,category_id,cover_image_url,cover_image_alt,action_label,action_href,tags,badges,is_featured,show_on_homepage,sort_order,visibility,is_published,published_at,created_at,updated_at")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false }),
        supabaseClient
          .from("portfolio_case_studies")
          .select("id,project_id,kicker,headline,lead,hero_image_url,hero_image_alt,facts,sections,related_project_id,cta_label,cta_href,is_published,published_at,updated_at")
          .order("updated_at", { ascending: false })
      ]);

      if (categoryResult.error) throw categoryResult.error;
      if (projectResult.error) throw projectResult.error;
      if (caseResult.error) throw caseResult.error;

      categories = categoryResult.data || [];
      projects = projectResult.data || [];
      caseStudies = caseResult.data || [];
      renderCategories();
      renderProjectList();

      const targetId = selectId || currentProject?.id;
      if (targetId && projects.some((item) => item.id === targetId)) {
        selectProject(targetId);
      } else if (!currentProject) {
        resetForm();
      }

      setState("Ready");
      if (!message.textContent || message.textContent === "Loading projects…") {
        setMessage(projects.length + (projects.length === 1 ? " project" : " projects") + " ready in one editor.");
      }
      return true;
    } catch (error) {
      console.error("Project Studio load failed:", error);
      setState("Load failed");
      setMessage(error?.message || "Could not load Project Studio.");
      return false;
    } finally {
      setBusy(false);
      renderShowcase();
    }
  }

  titleInput.addEventListener("input", () => {
    if (!currentProject && !slugInput.dataset.manual) {
      slugInput.value = slugify(titleInput.value);
    }
  });

  slugInput.addEventListener("input", () => {
    slugInput.dataset.manual = "true";
  });

  coverUrlInput.addEventListener("input", syncCoverPreview);
  coverAltInput.addEventListener("input", syncCoverPreview);
  heroImageUrlInput?.addEventListener("input", syncHeroImagePreview);
  heroImageAltInput?.addEventListener("input", syncHeroImagePreview);

  heroImageInput?.addEventListener("change", async () => {
    const file = heroImageInput.files?.[0];
    if (!file) return;

    setBusy(true);
    if (heroImageStatus) heroImageStatus.textContent = "Optimizing & uploading hero image…";

    try {
      const url = await uploadImage(file, "hero");
      const defaultAlt =
        clean(file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "), 220) ||
        "Case-study hero image";

      if (heroImageUrlInput) heroImageUrlInput.value = url;
      if (heroImageAltInput && !heroImageAltInput.value.trim()) {
        heroImageAltInput.value = defaultAlt;
      }

      syncHeroImagePreview();
      if (heroImageStatus) {
        heroImageStatus.textContent = "Hero image uploaded. Press Save changes or Publish project.";
      }
    } catch (error) {
      if (heroImageStatus) {
        heroImageStatus.textContent = error?.message || "Could not upload hero image.";
      }
    } finally {
      heroImageInput.value = "";
      setBusy(false);
    }
  });

  coverInput.addEventListener("change", async () => {
    const file = coverInput.files?.[0];
    if (!file) return;
    setBusy(true);
    coverStatus.textContent = "Optimizing & uploading cover…";
    try {
      const url = await uploadImage(file, "cover");
      coverUrlInput.value = url;
      if (!coverAltInput.value.trim()) {
        coverAltInput.value = clean(file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "), 220);
      }
      syncCoverPreview();
      coverStatus.textContent = "Cover uploaded. Save changes when ready.";
    } catch (error) {
      coverStatus.textContent = error?.message || "Could not upload cover.";
    } finally {
      coverInput.value = "";
      setBusy(false);
    }
  });

  galleryInput.addEventListener("change", async () => {
    const files = [...(galleryInput.files || [])];
    if (!files.length) return;

    if (!currentProject?.id) {
      galleryStatus.textContent = "Save this new project once before adding showcase images.";
      galleryInput.value = "";
      return;
    }

    if (files.length > 25) {
      galleryStatus.textContent = "Upload up to 25 images at a time.";
      galleryInput.value = "";
      return;
    }

    setBusy(true);
    try {
      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        galleryStatus.textContent = `Uploading ${index + 1} of ${files.length}…`;
        const url = await uploadImage(file, "showcase");
        const baseTitle = clean(
          file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
          220
        ) || "Project Artwork";

        showcaseItems.push({
          image_url: url,
          image_alt: baseTitle,
          label: "Project Artwork",
          title: baseTitle,
          description: "",
          meta: ""
        });
      }

      await persistCaseStudy();
      const caseIndex = caseStudies.findIndex((item) => item.project_id === currentProject.id);
      if (caseIndex >= 0) caseStudies[caseIndex] = currentCaseStudy;
      else caseStudies.push(currentCaseStudy);

      galleryStatus.textContent =
        files.length +
        (files.length === 1
          ? " showcase item added. Add its title and details below."
          : " showcase items added. Add details for each one below.");
      renderShowcase();
    } catch (error) {
      console.error("Project Studio showcase upload failed:", error);
      galleryStatus.textContent = error?.message || "Could not upload showcase images.";
    } finally {
      galleryInput.value = "";
      setBusy(false);
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveProject();
  });

  publishButton.addEventListener("click", async () => {
    await saveProject({ publish: true });
  });

  unpublishButton.addEventListener("click", async () => {
    if (!currentProject?.id) return;
    if (!window.confirm("Unpublish this project and its case study?")) return;
    setBusy(true);
    try {
      const projectResult = await supabaseClient
        .from("portfolio_projects")
        .update({ is_published: false, show_on_homepage: false, is_featured: false })
        .eq("id", currentProject.id);
      if (projectResult.error) throw projectResult.error;

      const caseResult = await supabaseClient
        .from("portfolio_case_studies")
        .update({ is_published: false })
        .eq("project_id", currentProject.id);
      if (caseResult.error) throw caseResult.error;

      await loadData({ repair: false, selectId: currentProject.id });
      setFormMessage("Project unpublished.");
    } catch (error) {
      setFormMessage(error?.message || "Could not unpublish project.");
    } finally {
      setBusy(false);
    }
  });

  deleteButton.addEventListener("click", async () => {
    if (!currentProject?.id) return;
    if (!window.confirm('Delete "' + currentProject.title + '" permanently?')) return;
    setBusy(true);
    try {
      const result = await supabaseClient
        .from("portfolio_projects")
        .delete()
        .eq("id", currentProject.id);
      if (result.error) throw result.error;
      currentProject = null;
      currentCaseStudy = null;
      await loadData({ repair: false });
      resetForm();
      setMessage("Project deleted.");
    } catch (error) {
      setFormMessage(error?.message || "Could not delete project.");
    } finally {
      setBusy(false);
    }
  });

  openButton.addEventListener("click", () => {
    if (!currentProject?.slug) return;
    window.open("../project.html?slug=" + encodeURIComponent(currentProject.slug), "_blank", "noopener");
  });

  newButton.addEventListener("click", resetForm);
  refreshButton.addEventListener("click", () => loadData({ repair: false, selectId: currentProject?.id || null }));

  navButton.addEventListener("click", async () => {
    showCmsView("project-studio");
    await loadData({ repair: true });
  });

  resetForm();
};
