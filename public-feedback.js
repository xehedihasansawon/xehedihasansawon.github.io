import { ADMIN_CONFIG } from "./admin/config.js";

const form = document.querySelector("#feedbackForm");
const submitButton = document.querySelector("#feedbackSubmit");
const message = document.querySelector("#feedbackFormMessage");
const grid = document.querySelector("#testimonialGrid");
const approvedWrap = document.querySelector("#approvedTestimonials");
const startedAt = performance.now();

const clean = (value) => String(value || "").trim();

const setMessage = (value = "") => {
  if (message) message.textContent = value;
};

const createText = (tag, value, className = "") => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = value;
  return element;
};

const renderTestimonials = (rows) => {
  if (!grid || !approvedWrap) return;

  grid.replaceChildren();

  (Array.isArray(rows) ? rows : []).forEach((item) => {
    const card = document.createElement("article");
    card.className = "testimonial-card";

    const quote = createText(
      "p",
      "“" + clean(item.feedback_text) + "”",
      "testimonial-quote"
    );

    const footer = document.createElement("footer");
    footer.className = "testimonial-meta";

    const identity = document.createElement("div");
    identity.appendChild(
      createText("strong", clean(item.client_name) || "Client")
    );

    const roleLine = [
      clean(item.client_role),
      clean(item.company)
    ].filter(Boolean).join(" · ");

    if (roleLine) {
      identity.appendChild(createText("span", roleLine));
    }

    const project = clean(item.project_label);
    if (project) {
      footer.append(identity, createText("small", project));
    } else {
      footer.append(identity);
    }

    card.append(quote, footer);
    grid.appendChild(card);
  });

  approvedWrap.hidden = grid.children.length === 0;
};

const loadTestimonials = async () => {
  if (
    !ADMIN_CONFIG.supabaseUrl ||
    !ADMIN_CONFIG.supabaseAnonKey ||
    !grid ||
    !approvedWrap
  ) {
    return;
  }

  try {
    const endpoint = new URL(
      "/rest/v1/portfolio_feedback",
      ADMIN_CONFIG.supabaseUrl
    );

    endpoint.searchParams.set(
      "select",
      "id,client_name,client_role,company,project_label,feedback_text,sort_order,submitted_at"
    );
    endpoint.searchParams.set("status", "eq.approved");
    endpoint.searchParams.set("consent_public", "eq.true");
    endpoint.searchParams.set(
      "order",
      "sort_order.asc,submitted_at.desc"
    );
    endpoint.searchParams.set("limit", "12");

    const response = await fetch(endpoint, {
      headers: {
        apikey: ADMIN_CONFIG.supabaseAnonKey,
        Authorization: "Bearer " + ADMIN_CONFIG.supabaseAnonKey,
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Testimonials request failed.");
    }

    renderTestimonials(await response.json());
  } catch {
    approvedWrap.hidden = true;
  }
};

const validate = (payload) => {
  if (!payload.name || payload.name.length > 100) {
    return "Please add your name.";
  }

  if (
    !payload.email ||
    payload.email.length > 254 ||
    !payload.email.includes("@")
  ) {
    return "Please add a valid email.";
  }

  if (payload.role.length > 120) return "Role is too long.";
  if (payload.company.length > 120) return "Company is too long.";
  if (payload.project.length > 160) return "Project name is too long.";

  if (
    payload.feedback.length < 20 ||
    payload.feedback.length > 1200
  ) {
    return "Feedback must be between 20 and 1200 characters.";
  }

  if (!payload.consent) {
    return "Please confirm the display consent.";
  }

  return "";
};

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    name: clean(form.elements.client_name?.value),
    email: clean(form.elements.client_email?.value),
    role: clean(form.elements.client_role?.value),
    company: clean(form.elements.company?.value),
    project: clean(form.elements.project_label?.value),
    feedback: clean(form.elements.feedback_text?.value),
    consent: Boolean(form.elements.consent_public?.checked),
    website: clean(form.elements.website?.value)
  };

  const validation = validate(payload);
  if (validation) {
    setMessage(validation);
    return;
  }

  if (
    !ADMIN_CONFIG.supabaseUrl ||
    !ADMIN_CONFIG.supabaseAnonKey
  ) {
    setMessage("Feedback service is not configured.");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Sending…";
  setMessage("Submitting feedback for review…");

  try {
    const endpoint = new URL(
      "/rest/v1/rpc/submit_portfolio_feedback",
      ADMIN_CONFIG.supabaseUrl
    );

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        apikey: ADMIN_CONFIG.supabaseAnonKey,
        Authorization: "Bearer " + ADMIN_CONFIG.supabaseAnonKey,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        p_client_name: payload.name,
        p_client_email: payload.email,
        p_client_role: payload.role,
        p_company: payload.company,
        p_project_label: payload.project,
        p_feedback_text: payload.feedback,
        p_consent_public: payload.consent,
        p_website: payload.website,
        p_elapsed_ms: Math.floor(performance.now() - startedAt)
      })
    });

    if (!response.ok) {
      let errorMessage = "Could not submit feedback.";
      try {
        const body = await response.json();
        if (body?.message) errorMessage = body.message;
      } catch {}
      throw new Error(errorMessage);
    }

    form.reset();
    setMessage(
      "Thanks. Your feedback was received for review and will not publish automatically."
    );
  } catch (error) {
    setMessage(error?.message || "Could not submit feedback.");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Send feedback";
  }
});

loadTestimonials();
