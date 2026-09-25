const menuButton = document.getElementById('menuButton');
const mobileNav = document.getElementById('mobileNav');

const closeMobileNav = () => {
  mobileNav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
};

menuButton.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

mobileNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', closeMobileNav);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && mobileNav.classList.contains('open')) {
    closeMobileNav();
    menuButton.focus();
  }
});


/* =========================================================
   PROJECT SNAPSHOTS
   Rich, concise proof for showcase work without turning every
   homepage card into a full case-study page.
   ========================================================= */
const projectDetails = {
  miuw: {
    eyebrow: 'Business system project',
    meta: 'ERP Workflow · Inventory · Sales · Delivery · Reporting',
    summary: 'A practical business workflow concept that connects products, stock, customer orders, delivery status, expenses and reporting instead of treating each task as a separate process.',
    points: ['Workflow architecture and module planning','Inventory, order and delivery status structure','Expense and reporting flow designed for future expansion']
  },
  portfolio: {
    eyebrow: 'Personal digital project',
    meta: 'Personal Brand · Responsive UI · Front-End',
    summary: 'This portfolio is designed and built as one connected presentation system for real project work, design capability, digital workflows, experience and direct client contact.',
    points: ['Responsive section and interaction system','GitHub version-controlled iterative build','Case studies, service workflows and project previews']
  },
  'sports-kit': {
    eyebrow: 'Design showcase',
    meta: 'Sportswear · Apparel Design',
    summary: 'A custom football kit concept focused on clear team identity, strong contrast and a presentation that works for both design review and sports promotion.',
    points: ['Jersey visual direction','Front-and-back sportswear presentation','Team-focused color and graphic treatment']
  },
  'kings-kitchen': {
    eyebrow: 'Design showcase',
    meta: 'Menu Design · Restaurant Branding',
    summary: 'A restaurant-focused visual piece built around clear food presentation, readable hierarchy and a branded promotional look.',
    points: ['Menu-led information hierarchy','Food and promotional visual balance','Restaurant brand presentation']
  },
  'long-lounge': {
    eyebrow: 'Design showcase',
    meta: 'Social Media Design · Hospitality',
    summary: 'A hospitality promotional creative designed to communicate the offer quickly while keeping the visual direction polished and social-media ready.',
    points: ['Promotional content hierarchy','Hospitality-focused visual direction','Social-media-ready composition']
  },
  'cp-five-star': {
    eyebrow: 'Design showcase',
    meta: 'Social Media Design · Food Promotion',
    summary: 'A food-promotion creative that combines product focus, offer visibility and compact social advertising hierarchy.',
    points: ['Product-first composition','Offer and callout hierarchy','Platform-ready promotional design']
  }
};

const dialog = document.getElementById('projectDialog');
const dialogImage = document.getElementById('dialogImage');
const dialogEyebrow = document.getElementById('dialogEyebrow');
const dialogTitle = document.getElementById('dialogTitle');
const dialogMeta = document.getElementById('dialogMeta');
const dialogSummary = document.getElementById('dialogSummary');
const dialogPoints = document.getElementById('dialogPoints');

const openProjectDialog = card => {
  const img = card.querySelector('img');
  const fallback = projectDetails[card.dataset.project] || {};
  const cmsPoints = [
    card.dataset.dialogPoint1,
    card.dataset.dialogPoint2,
    card.dataset.dialogPoint3
  ].filter(Boolean);

  const detail = {
    eyebrow: card.dataset.dialogEyebrow || fallback.eyebrow,
    meta: card.dataset.dialogMeta || fallback.meta,
    summary: card.dataset.dialogSummary || fallback.summary,
    points: cmsPoints.length ? cmsPoints : (fallback.points || [])
  };

  dialogImage.src = img?.src || '';
  dialogImage.alt = img?.alt || card.dataset.title || 'Project preview';
  dialogEyebrow.textContent = detail.eyebrow || 'Project snapshot';
  dialogTitle.textContent = card.dataset.title || '';
  dialogMeta.textContent = detail.meta || card.dataset.meta || '';
  dialogSummary.textContent = detail.summary || 'Selected project work from my portfolio.';

  dialogPoints.innerHTML = '';
  detail.points.forEach(point => {
    const li = document.createElement('li');
    li.textContent = point;
    dialogPoints.appendChild(li);
  });

  dialog.showModal();
  document.body.style.overflow = 'hidden';
};

let lastProjectTrigger = null;

document.querySelectorAll('.project-card').forEach(card => {
  const opener = card.matches('button') ? card : card.querySelector('.project-open');
  if (!opener || opener.tagName === 'A') return;

  opener.setAttribute('aria-haspopup', 'dialog');
  opener.addEventListener('click', () => {
    lastProjectTrigger = opener;
    openProjectDialog(card);
  });
});

document.getElementById('dialogClose').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.style.overflow = '';
  if (lastProjectTrigger) lastProjectTrigger.focus();
});


/* =========================================================
   PRIMARY NAVIGATION STATE
   Desktop and mobile stay in sync with the section in view.
   ========================================================= */
const sectionLinks = [...document.querySelectorAll('.desktop-nav a, .mobile-nav a')];
const sections = [...new Set(
  sectionLinks
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean)
)];

const setActiveSection = id => {
  sectionLinks.forEach(link => {
    const isActive = link.getAttribute('href') === id;
    link.classList.toggle('active', isActive);
    if (isActive) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
};

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    setActiveSection('#' + entry.target.id);
  });
}, {rootMargin:'-30% 0px -60% 0px', threshold:0});

sections.forEach(section => observer.observe(section));


const serviceDetails = {
  brand: {
    title: 'Brand Identity',
    summary: 'I build a practical visual identity system that can stay consistent across social media, print and everyday brand use.',
    workflow: [
      'Discovery and brief: understand the business, audience, goals, personality and where the identity will be used.',
      'Research and direction: review competitors, references and visual opportunities before choosing a clear creative direction.',
      'Concept development: create logo and identity concepts with typography, color and supporting visual elements.',
      'Refinement: improve the selected direction through feedback, spacing, balance, color and real-use testing.',
      'Brand system rollout: prepare the main logo, alternate marks and practical brand assets for common use cases.',
      'Final handoff: organize master files, exports and a clear usage reference so the identity is easy to use consistently.'
    ],
    deliverables: ['Primary and alternate logo files','Color and typography system','Brand marks / supporting assets','Social/profile assets as scoped','Basic brand usage reference'],
    tools: ['Adobe Illustrator','Adobe Photoshop','Mockups and presentation boards'],
    needs: ['Business/brand name and goals','Target audience','Competitors or references','Required applications','Deadline and key constraints'],
    handoff: 'Organized source and export files such as AI, SVG, PDF, PNG and JPG, plus color/font references based on the agreed scope.'
  },
  social: {
    title: 'Social & Marketing Design',
    summary: 'I turn a campaign, offer or content idea into a consistent set of platform-ready promotional visuals.',
    workflow: [
      'Campaign brief: define the goal, offer, audience, platform and required formats.',
      'Content and asset check: collect copy, product photos, logos, brand rules and any required call-to-action.',
      'Visual direction: establish hierarchy, layout, typography and a repeatable campaign look.',
      'Design production: create the main design first, then build required post, story, ad or banner variations.',
      'Review and revisions: refine messaging, visual balance and consistency based on feedback.',
      'Export and delivery: prepare correctly sized files for each platform and organize the final campaign set.'
    ],
    deliverables: ['Social media posts','Story / vertical formats','Ad and campaign visuals','Promotional banners','Editable template files when scoped'],
    tools: ['Adobe Photoshop','Adobe Illustrator','Platform size and export standards'],
    needs: ['Final or draft copy','Brand/logo assets','Product or campaign images','Target platform and sizes','Offer, CTA and deadline'],
    handoff: 'Platform-ready JPG/PNG files, plus editable source files when included in the project scope.'
  },
  sports: {
    title: 'Sports & Jersey Design',
    summary: 'I create team-focused visual systems that connect identity, jerseys and tournament or match-day graphics.',
    workflow: [
      'Team brief: collect team identity, colors, tournament context, sponsors and practical requirements.',
      'Visual direction: define a strong sports look that works across kit, social graphics and event communication.',
      'Jersey or graphic concepts: develop front/back layouts, typography, numbers, sponsor placement and supporting visuals.',
      'Mockup and review: show the design in realistic context and refine details with the team.',
      'Production preparation: clean dimensions, placements and export formats for printing or digital use.',
      'Final rollout: deliver the approved assets and any supporting match, tournament or team graphics included in scope.'
    ],
    deliverables: ['Jersey concepts and mockups','Team identity graphics','Match / tournament visuals','Sponsor and number placement','Print-ready artwork when required'],
    tools: ['Adobe Illustrator','Adobe Photoshop','Sportswear mockups and print templates'],
    needs: ['Team logo and colors','Sponsor logos','Player/number requirements','Printer/manufacturer template if available','Tournament or campaign needs'],
    handoff: 'Approved digital artwork and production-ready files based on the printer or manufacturer requirements provided.'
  },
  video: {
    title: 'Video & Motion Content',
    summary: 'I edit short-form promotional content with clear pacing, brand consistency and platform-focused delivery.',
    workflow: [
      'Brief and format: confirm objective, platform, duration, style and final aspect ratio.',
      'Asset review: organize footage, images, logo, script, captions and other supplied material.',
      'Rough cut: build the core sequence, pacing and story structure before detailed polish.',
      'Motion and brand layer: add titles, transitions, graphic elements and brand styling where needed.',
      'Review and refinement: adjust timing, text, sequence and visual details from feedback.',
      'Final export: deliver optimized versions for the requested social or digital platforms.'
    ],
    deliverables: ['Reels / short-form edits','Promotional videos','Branded text and motion graphics','Platform-specific versions','Thumbnail or cover support when scoped'],
    tools: ['Adobe Premiere Pro','CapCut','Photoshop / Illustrator for supporting graphics'],
    needs: ['Footage and source assets','Target platform','Desired duration','Script/copy if available','Brand assets and deadline'],
    handoff: 'Final MP4 exports in the agreed sizes and resolutions, with project/source files included only when part of the agreed scope.'
  },
  marketing: {
    title: 'Digital Marketing Support',
    summary: 'I connect campaign visuals with a practical content and customer-response flow so marketing is easier to run consistently.',
    workflow: [
      'Goal and offer review: define what the campaign needs to achieve and what action the audience should take.',
      'Audience and channel planning: choose the platform, message angle and content types that fit the campaign.',
      'Creative plan: map the required posts, ads, offers and supporting visuals.',
      'Campaign support: prepare content assets and help structure the launch or boosting workflow as scoped.',
      'Customer response flow: organize common replies, confirmation messages and follow-up steps where useful.',
      'Review and improve: look at available campaign results and identify practical changes for the next round.'
    ],
    deliverables: ['Campaign creative plan','Social content and ad variations','Offer / CTA structure','Customer response templates','Basic campaign review support'],
    tools: ['Design tools','Social platform publishing / campaign tools as available','Simple tracking and reporting sheets'],
    needs: ['Business goal and offer','Target customer','Budget or campaign limits when relevant','Existing page/account assets','Available performance data'],
    handoff: 'A clear set of campaign assets, content directions and operating notes based on the agreed level of marketing support.'
  },
  workflow: {
    title: 'Business Workflow Design',
    summary: 'I map repeated business tasks into a clearer digital workflow so products, orders, delivery and reporting are easier to manage.',
    workflow: [
      'Process discovery: understand how the business currently handles products, customers, orders, payments and reporting.',
      'Workflow mapping: define the stages, responsibilities, statuses and information that need to move between them.',
      'Module and data design: structure areas such as sourcing, inventory, pricing, sales, courier, expenses and reports.',
      'Interface / system planning: turn the workflow into practical screens, forms, tables and actions.',
      'Testing with real scenarios: check the flow using realistic orders, stock changes and business exceptions.',
      'Refinement and handoff: simplify confusing steps, document the final flow and prepare the agreed implementation or prototype.'
    ],
    deliverables: ['Process and module map','Data / status structure','Forms, tables and dashboard flow','Operational templates','Prototype or implementation scope as agreed'],
    tools: ['Workflow mapping','Spreadsheets / structured data','Web and database tools as required by the project'],
    needs: ['Current business process','Existing records or sample data','Roles and responsibilities','Problems to solve first','Required reports and outputs'],
    handoff: 'A documented operating flow with the agreed templates, prototype or system structure, organized so future features can be added without rebuilding the process from zero.'
  }
};

const serviceDialog = document.getElementById('serviceDialog');
const serviceDialogTitle = document.getElementById('serviceDialogTitle');
const serviceDialogSummary = document.getElementById('serviceDialogSummary');
const serviceDialogWorkflow = document.getElementById('serviceDialogWorkflow');
const serviceDialogDeliverables = document.getElementById('serviceDialogDeliverables');
const serviceDialogTools = document.getElementById('serviceDialogTools');
const serviceDialogNeeds = document.getElementById('serviceDialogNeeds');
const serviceDialogHandoff = document.getElementById('serviceDialogHandoff');

const fillServiceList = (element, items) => {
  element.innerHTML = '';
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    element.appendChild(li);
  });
};

let lastWorkflowTrigger = null;

document.querySelectorAll('.service-detail-card').forEach(card => {
  card.setAttribute('aria-haspopup', 'dialog');

  card.addEventListener('click', () => {
    lastWorkflowTrigger = card;
    const detail = card.__cmsServiceDetail || serviceDetails[card.dataset.service];
    if (!detail) return;

    serviceDialogEyebrow.textContent = detail.eyebrow || 'Service workflow';
    serviceDialogTitle.textContent = detail.title;
    serviceDialogSummary.textContent = detail.summary;
    fillServiceList(serviceDialogWorkflow, detail.workflow || []);
    fillServiceList(serviceDialogDeliverables, detail.deliverables || []);
    fillServiceList(serviceDialogTools, detail.tools || []);
    fillServiceList(serviceDialogNeeds, detail.needs || []);
    serviceDialogHandoff.textContent = detail.handoff || '';

    serviceDialog.showModal();
    document.body.style.overflow = 'hidden';
  });
});

document.getElementById('serviceDialogClose').addEventListener('click', () => serviceDialog.close());
serviceDialog.addEventListener('click', event => {
  if (event.target === serviceDialog) serviceDialog.close();
});
serviceDialog.addEventListener('close', () => {
  document.body.style.overflow = '';
  if (lastWorkflowTrigger) lastWorkflowTrigger.focus();
});


const digitalProjectDetails = {
  erp: {
    eyebrow: 'Digital project workflow',
    title: 'ERP & Business Workflow',
    summary: 'I structure a business system around the real flow of products, stock, orders, delivery, expenses and reporting instead of treating each task as a separate sheet or tool.',
    workflow: [
      'Process discovery: map how sourcing, inventory, pricing, customer orders, delivery and finance currently move through the business.',
      'Module planning: separate the system into practical areas such as products, lots, inventory, sales, courier, expenses, salary and reporting.',
      'Data structure: define the fields, statuses and relationships needed so the same information does not have to be entered repeatedly.',
      'Interface planning: design clear forms, tables, filters, dashboards and actions around the daily operating flow.',
      'Scenario testing: test the workflow using realistic stock updates, orders, delivery changes, cancellations and expense entries.',
      'Refinement and rollout: simplify confusing steps, connect the modules and prepare the system for future features without rebuilding the core.'
    ],
    deliverables: ['Workflow and module map','Inventory / order status structure','Forms, tables and dashboard flow','Reporting structure','Prototype or implementation scope'],
    tools: ['Workflow mapping','Front-end development tools','Database / structured data tools','GitHub version control'],
    needs: ['Current business process','Sample products and orders','Required statuses','User roles','Reports the business needs'],
    handoff: 'A documented and organized system structure, with the agreed prototype or implementation prepared so new modules can be added later.'
  },
  ai: {
    eyebrow: 'Digital project workflow',
    title: 'AI-Assisted Creation',
    summary: 'I use AI as part of a controlled creative workflow for ideation, prompting, visual planning and repeatable content production while keeping the final direction intentional.',
    workflow: [
      'Goal definition: decide what needs to be created, who it is for and what the final output must achieve.',
      'Reference and constraint setup: collect brand rules, examples, visual references and consistency requirements.',
      'Prompt and concept development: build prompts and test directions until the visual or content structure is useful.',
      'Selection and refinement: choose the strongest output, correct inconsistencies and refine the creative direction.',
      'Production integration: combine AI output with design, editing or other production tools instead of using raw generations as the final result.',
      'Reusable workflow: document the successful process so similar content can be produced faster and more consistently later.'
    ],
    deliverables: ['Prompt / concept direction','Visual or content variations','Refined production assets','Repeatable prompt workflow','Final creative output as scoped'],
    tools: ['ChatGPT / AI tools','Image and video generation tools','Adobe creative tools','Prompt documentation'],
    needs: ['Project goal','Reference style','Brand constraints','Required format','Examples of what should or should not be produced'],
    handoff: 'The approved creative output plus the reusable direction or prompt structure included in the agreed scope.'
  },
  web: {
    eyebrow: 'Digital project workflow',
    title: 'Web & Portfolio Builds',
    summary: 'I plan responsive websites around clear hierarchy, real content and practical navigation so the work or business is easy to understand on desktop and mobile.',
    workflow: [
      'Content and goal review: define the audience, pages, actions and information the website needs to communicate.',
      'Information architecture: organize sections, navigation and page flow before styling the interface.',
      'Visual system: establish typography, colors, spacing, cards and reusable components for consistent presentation.',
      'Responsive build: implement the interface and adapt the layout across desktop, tablet and mobile.',
      'Content integration and testing: add real content, check navigation, responsiveness and common interaction states.',
      'Polish and deployment preparation: refine the final experience, organize the code and prepare the agreed deployment or handoff.'
    ],
    deliverables: ['Page / section structure','Responsive UI','Reusable visual components','Interactive states','Deployment-ready build as scoped'],
    tools: ['HTML / CSS / JavaScript','VS Code','GitHub','Design and image tools'],
    needs: ['Website goal','Page/content list','Brand assets','Images and copy','Required links or functionality'],
    handoff: 'Organized website files and source code, with deployment or repository handoff based on the agreed project scope.'
  },
  docs: {
    eyebrow: 'Digital project workflow',
    title: 'Business Documents',
    summary: 'I design reusable business documents that keep customer-facing and internal communication structured, consistent and easy to update.',
    workflow: [
      'Use-case review: identify who uses the document, when it is used and what information must always be included.',
      'Information hierarchy: organize headings, fields, tables, notes and actions in the order people actually need them.',
      'Visual system: apply consistent typography, spacing and brand styling without making the document cluttered.',
      'Template design: build the reusable layout for print, PDF or digital use depending on the workflow.',
      'Real-data testing: test the template with realistic names, quantities, prices, notes and longer content.',
      'Template handoff: prepare the master version and clear reusable structure for future records or reports.'
    ],
    deliverables: ['Reusable document template','Print / PDF layout','Structured fields and tables','Brand-consistent formatting','Master editable version'],
    tools: ['Adobe design tools','Document / spreadsheet tools','PDF export workflow'],
    needs: ['Document purpose','Required fields','Example data','Brand details','Print or digital requirements'],
    handoff: 'A clean master template with export-ready versions and the editable format included in the agreed scope.'
  }
};

const serviceDialogEyebrow = document.getElementById('serviceDialogEyebrow');

const openWorkflowDialog = detail => {
  if (!detail) return;

  serviceDialogEyebrow.textContent = detail.eyebrow || 'Service workflow';
  serviceDialogTitle.textContent = detail.title;
  serviceDialogSummary.textContent = detail.summary;
  fillServiceList(serviceDialogWorkflow, detail.workflow);
  fillServiceList(serviceDialogDeliverables, detail.deliverables);
  fillServiceList(serviceDialogTools, detail.tools);
  fillServiceList(serviceDialogNeeds, detail.needs);
  serviceDialogHandoff.textContent = detail.handoff;

  serviceDialog.showModal();
  document.body.style.overflow = 'hidden';
};

document.querySelectorAll('.digital-detail-card').forEach(card => {
  card.setAttribute('aria-haspopup', 'dialog');

  const openDigital = () => {
    lastWorkflowTrigger = card;
    openWorkflowDialog(card.__cmsDigitalDetail || digitalProjectDetails[card.dataset.digital]);
  };

  card.addEventListener('click', openDigital);
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openDigital();
    }
  });
});


/* =========================================================
   CONTACT — COPY EMAIL
   Avoid mail-client dependency and provide direct feedback.
   ========================================================= */
const copyEmailButtons = document.querySelectorAll('[data-copy-email]');

const copyTextToClipboard = async text => {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  let copied = false;
  try {
    copied = document.execCommand('copy');
  } catch (error) {
    copied = false;
  }

  textarea.remove();
  return copied;
};

copyEmailButtons.forEach(button => {
  const originalText = button.textContent.trim();
  button.setAttribute('aria-live', 'polite');

  button.addEventListener('click', async () => {
    const email = button.dataset.copyEmail;
    if (!email) return;

    const copied = await copyTextToClipboard(email);

    button.textContent = copied ? 'Email copied ✓' : email;
    button.classList.toggle('is-copied', copied);

    window.setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('is-copied');
    }, 1800);
  });
});
