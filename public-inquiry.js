// Project inquiry form. No server or database: the form builds the message
// and opens it in WhatsApp or the visitor's email app, ready to send.

const WHATSAPP_NUMBER = "60174723951";
const EMAIL_ADDRESS = "xehedi@gmail.com";

const form = document.querySelector("#inquiryForm");
const messageBox = document.querySelector("#inquiryFormMessage");

if (form && messageBox) {
  const setMessage = (message, type = "") => {
    messageBox.textContent = message;
    messageBox.dataset.state = type;
  };

  const value = (name, max) =>
    String(form.elements[name]?.value || "").trim().slice(0, max);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const channel = event.submitter?.value === "email" ? "email" : "whatsapp";
    const name = value("name", 100);
    const company = value("company", 120);
    const projectType = value("project_type", 100);
    const budget = value("budget", 100);
    const timeline = value("timeline", 100);
    const brief = value("message", 3000);

    if (name.length < 2) {
      setMessage("Please enter your name.", "error");
      form.elements.name?.focus();
      return;
    }

    if (!projectType) {
      setMessage("Please choose a project type.", "error");
      form.elements.project_type?.focus();
      return;
    }

    if (brief.length < 20) {
      setMessage("Tell me a little more about the project.", "error");
      form.elements.message?.focus();
      return;
    }

    const lines = [
      `Hi Mehedi, I'm ${name}${company ? ` from ${company}` : ""}.`,
      "",
      `Project type: ${projectType}`,
      budget ? `Budget: ${budget}` : "",
      timeline ? `Timeline: ${timeline}` : "",
      "",
      brief
    ].filter((line, index, all) => line !== "" || all[index - 1] !== "");

    const text = lines.join("\n");

    if (channel === "email") {
      const subject = `Project inquiry: ${projectType}`;
      window.location.href =
        `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
      setMessage("Your email app should open with the message ready. Just press send.", "success");
    } else {
      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
        "_blank",
        "noopener"
      );
      setMessage("WhatsApp opened with your message ready. Just press send.", "success");
    }
  });

  form.addEventListener("input", () => {
    if (messageBox.dataset.state === "error") setMessage("");
  });
}
