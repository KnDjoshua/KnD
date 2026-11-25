(function () {
  "use strict";

  const assistant = document.querySelector(".site-assistant");
  const toggle = document.querySelector(".assistant-toggle");
  const closeButton = document.querySelector(".assistant-close");
  const panel = document.querySelector("#assistant-panel");
  const messages = document.querySelector("#assistant-messages");
  const form = document.querySelector("#assistant-form");
  const input = document.querySelector("#assistant-input");
  const suggestions = document.querySelectorAll("[data-assistant-prompt]");

  if (!assistant || !toggle || !closeButton || !panel || !messages || !form || !input) {
    return;
  }

  const answers = [
    {
      match: /\b(price|prices|cost|costs|package|packages|quote|budget|how much)\b/i,
      text: "The website packages currently shown are Basic ($196.59), Pro ($249.01), and Ultimate ($510). You can compare what’s included and start an enquiry on the pricing section.",
      link: { label: "View website packages", href: "#prices" },
    },
    {
      match: /\b(service|services|website|web design|design|cyber|security|network|penetration)\b/i,
      text: "KnDjoshua creates websites and digital experiences. The site also highlights a background in web design, network security, and penetration testing. Share what you’re looking for and he can discuss the right fit.",
      link: { label: "Explore the website packages", href: "#prices" },
    },
    {
      match: /\b(contact|phone|call|email|whatsapp|reach|message)\b/i,
      text: "You can reach KnDjoshua in Kampala by phone at +256 760 447 637, or use the contact form on the site.",
      link: { label: "Go to contact", href: "#contact" },
    },
    {
      match: /\b(learn|learning|course|courses|class|training|academy|teach)\b/i,
      text: "Interested in learning? Open the Learn option in the site navigation to see the Code & Conquer Academy registration form.",
      link: { label: "Explore learning options", href: "#learnModal", modal: true },
    },
    {
      match: /\b(store|shop|buy|product)\b/i,
      text: "You can visit the KnDjoshua online store using the Support My Store link in the navigation.",
      link: { label: "Visit the store", href: "https://flutterwave.com/store/knd", external: true },
    },
    {
      match: /\b(hi|hello|hey|good morning|good afternoon)\b/i,
      text: "Hello! I can help with services, website packages, learning options, or getting in touch. What would you like to know?",
    },
  ];

  const setOpen = (isOpen) => {
    assistant.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close chat assistant" : "Open chat assistant");
    panel.setAttribute("aria-hidden", String(!isOpen));

    if (isOpen) {
      input.focus();
    } else {
      toggle.focus();
    }
  };

  const appendMessage = (text, sender, link) => {
    const message = document.createElement("div");
    message.className = `assistant-message assistant-message--${sender}`;
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    message.append(paragraph);

    if (link) {
      const anchor = document.createElement("a");
      anchor.textContent = link.label;
      anchor.href = link.href;

      if (link.external) {
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
      } else if (link.modal) {
        anchor.setAttribute("data-bs-toggle", "modal");
        anchor.setAttribute("data-bs-target", "#learnModal");
      } else {
        anchor.classList.add("scrollto");
      }

      message.append(anchor);
    }

    messages.append(message);
    messages.scrollTop = messages.scrollHeight;
  };

  const appendTypingIndicator = () => {
    const indicator = document.createElement("div");
    indicator.className = "assistant-message assistant-message--bot assistant-typing";
    indicator.setAttribute("role", "status");
    indicator.setAttribute("aria-label", "KnD assistant is typing");

    for (let index = 0; index < 3; index += 1) {
      const dot = document.createElement("span");
      dot.setAttribute("aria-hidden", "true");
      indicator.append(dot);
    }

    messages.append(indicator);
    messages.scrollTop = messages.scrollHeight;
    return indicator;
  };

  const replyTo = (question) => {
    const answer = answers.find((item) => item.match.test(question));
    const typingIndicator = appendTypingIndicator();

    window.setTimeout(() => {
      typingIndicator.remove();
      appendMessage(
        answer
          ? answer.text
          : "I can help with website packages, services, learning options, or getting in touch. Try one of those topics, or use the contact form for something specific.",
        "bot",
        answer && answer.link
      );
    }, 550);
  };

  const submitQuestion = (question) => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      return;
    }

    appendMessage(trimmedQuestion, "user");
    replyTo(trimmedQuestion);
  };

  toggle.addEventListener("click", () => {
    setOpen(!assistant.classList.contains("is-open"));
  });

  closeButton.addEventListener("click", () => setOpen(false));

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitQuestion(input.value);
    input.value = "";
    input.focus();
  });

  suggestions.forEach((suggestion) => {
    suggestion.addEventListener("click", () => {
      submitQuestion(suggestion.dataset.assistantPrompt || "");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && assistant.classList.contains("is-open")) {
      setOpen(false);
    }
  });

  messages.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLAnchorElement && !target.target) {
      setOpen(false);
    }
  });
})();
