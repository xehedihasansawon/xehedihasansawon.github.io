import { ADMIN_CONFIG } from "./admin/config.js";

const form = document.querySelector("#inquiryForm");
const submitButton = document.querySelector("#inquirySubmit");
const messageBox = document.querySelector("#inquiryFormMessage");
const honeypot = document.querySelector("#inquiryWebsite");

if (form && submitButton && messageBox) {
  let startedAt = Date.now();
  let busy = false;

  const setMessage = (message, type = "") => {
    messageBox.textContent = message;
    messageBox.dataset.state = type;
  };

  const clean = (value, max) =>
    String(value || "").trim().slice(0, max);

  const validEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());

  const setBusy = (value) => {
    busy = value;
    submitButton.disabled = value;
    submitButton.textContent = value ? "Sending…" : "Send project inquiry";
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (busy) return;

    if (honeypot?.value) {
      form.reset();
      setMessage("Thanks. Your message has been received.", "success");
      return;
    }

    if (Date.now() - startedAt < 1200) {
      setMessage("Please check the form and try again.", "error");
      return;
    }

    const name = clean(form.elements.name?.value, 100);
    const email = clean(form.elements.email?.value, 254);
    const projectType = clean(form.elements.project_type?.value, 100);
    const budget = clean(form.elements.budget?.value, 100);
    const timeline = clean(form.elements.timeline?.value, 100);
    const message = clean(form.elements.message?.value, 3000);
    const consent = Boolean(form.elements.consent?.checked);

    if (name.length < 2) {
      setMessage("Please enter your name.", "error");
      form.elements.name?.focus();
      return;
    }

    if (!validEmail(email)) {
      setMessage("Please enter a valid email address.", "error");
      form.elements.email?.focus();
      return;
    }

    if (!projectType) {
      setMessage("Please choose a project type.", "error");
      form.elements.project_type?.focus();
      return;
    }

    if (message.length < 20) {
      setMessage("Tell me a little more about the project.", "error");
      form.elements.message?.focus();
      return;
    }

    if (!consent) {
      setMessage("Please confirm that I may use these details to reply.", "error");
      form.elements.consent?.focus();
      return;
    }

    setBusy(true);
    setMessage("Sending your inquiry…");

    try {
      const endpoint = new URL(
        "/rest/v1/portfolio_inquiries",
        ADMIN_CONFIG.supabaseUrl
      );

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          apikey: ADMIN_CONFIG.supabaseAnonKey,
          Authorization: "Bearer " + ADMIN_CONFIG.supabaseAnonKey,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify({
          name,
          email,
          project_type: projectType,
          budget,
          timeline,
          message,
          source_page: clean(
            window.location.pathname + window.location.search,
            500
          ) || "/",
          consent: true
        })
      });

      if (!response.ok) {
        throw new Error("Inquiry request failed with status " + response.status);
      }

      form.reset();
      startedAt = Date.now();
      setMessage(
        "Message sent. I’ll use the email you provided to reply.",
        "success"
      );
    } catch (error) {
      console.error("Project inquiry submission failed:", error);
      setMessage(
        "Could not send the inquiry right now. Please use WhatsApp or email instead.",
        "error"
      );
    } finally {
      setBusy(false);
    }
  });

  form.addEventListener("input", () => {
    if (messageBox.dataset.state === "error") {
      setMessage("");
    }
  });
}
