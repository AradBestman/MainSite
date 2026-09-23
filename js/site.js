(() => {
  "use strict";

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Mark JS as available; hero/reveal CSS keys off this class so a
     no-JS visitor still sees full, unanimated content. */
  document.documentElement.classList.add("js-ready");

  const initNav = () => {
    const toggle = document.querySelector(".nav-toggle");
    const panel = document.querySelector(".mobile-nav");
    if (!toggle || !panel) return;

    const links = panel.querySelectorAll("a");

    const closeMenu = (focusToggle) => {
      toggle.setAttribute("aria-expanded", "false");
      panel.hidden = true;
      if (focusToggle) toggle.focus();
    };

    const openMenu = () => {
      toggle.setAttribute("aria-expanded", "true");
      panel.hidden = false;
      const first = panel.querySelector("a");
      if (first) first.focus();
    };

    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      expanded ? closeMenu(false) : openMenu();
    });

    links.forEach((link) => {
      link.addEventListener("click", () => closeMenu(false));
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        closeMenu(true);
      }
    });

    document.addEventListener("click", (e) => {
      if (toggle.getAttribute("aria-expanded") !== "true") return;
      if (panel.contains(e.target) || toggle.contains(e.target)) return;
      closeMenu(false);
    });
  };

  const initHeaderScroll = () => {
    const header = document.querySelector(".site-header");
    const sentinel = document.querySelector("#scroll-sentinel");
    if (!header || !sentinel) return;

    const io = new IntersectionObserver(
      ([entry]) => header.classList.toggle("is-scrolled", !entry.isIntersecting),
      { rootMargin: "-1px 0px 0px 0px", threshold: 0 }
    );
    io.observe(sentinel);
  };

  const initActiveLink = () => {
    const sections = document.querySelectorAll("main [id]");
    const navLinks = document.querySelectorAll(".site-nav a, .mobile-nav a");
    if (!sections.length || !navLinks.length) return;

    const linkFor = (id) =>
      [...navLinks].filter((a) => a.getAttribute("href") === `#${id}`);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((a) => a.removeAttribute("aria-current"));
          linkFor(entry.target.id).forEach((a) => a.setAttribute("aria-current", "true"));
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => io.observe(s));
  };

  const initReveal = () => {
    const items = document.querySelectorAll(".js-reveal");
    if (!items.length) return;

    if (reduceMotion) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach((el) => io.observe(el));
  };

  const initForm = () => {
    const form = document.querySelector(".contact-form");
    if (!form) return;

    const status = form.querySelector(".form-status");
    const serviceId = form.dataset.emailjsService || "";
    const templateId = form.dataset.emailjsTemplate || "";
    const publicKey = form.dataset.emailjsPublicKey || "";

    if (window.emailjs && publicKey) {
      window.emailjs.init({ publicKey });
    }

    const setError = (field, message) => {
      const wrap = field.closest(".field");
      const errorEl = wrap ? wrap.querySelector(".field-error") : null;
      if (message) {
        wrap.classList.add("has-error");
        field.setAttribute("aria-invalid", "true");
        if (errorEl) errorEl.textContent = message;
      } else {
        wrap.classList.remove("has-error");
        field.removeAttribute("aria-invalid");
        if (errorEl) errorEl.textContent = "";
      }
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = form.querySelector("#fullname");
      const email = form.querySelector("#email");
      const message = form.querySelector("#message");

      let firstInvalid = null;
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name.value.trim()) {
        setError(name, "Please enter your name.");
        firstInvalid = firstInvalid || name;
      } else {
        setError(name, "");
      }

      if (!email.value.trim() || !emailPattern.test(email.value.trim())) {
        setError(email, "Please enter a valid email address.");
        firstInvalid = firstInvalid || email;
      } else {
        setError(email, "");
      }

      if (!message.value.trim()) {
        setError(message, "Please enter a message.");
        firstInvalid = firstInvalid || message;
      } else {
        setError(message, "");
      }

      if (firstInvalid) {
        firstInvalid.focus();
        status.textContent = "Please fix the highlighted fields.";
        return;
      }

      const phone = form.querySelector("#phone");
      const submitBtn = form.querySelector("button[type='submit']");

      if (!window.emailjs || !serviceId || !templateId || !publicKey) {
        status.textContent = "Sorry, the contact form isn't configured correctly. Please try again later.";
        return;
      }

      submitBtn.disabled = true;
      status.textContent = "Sending…";

      window.emailjs
        .send(serviceId, templateId, {
          fullname: name.value.trim(),
          email: email.value.trim(),
          phone: phone && phone.value.trim() ? phone.value.trim() : "—",
          message: message.value.trim(),
        })
        .then(() => {
          status.textContent = "Thanks! Your message has been sent.";
          form.reset();
        })
        .catch(() => {
          status.textContent = "Something went wrong sending your message. Please try again or email directly.";
        })
        .finally(() => {
          submitBtn.disabled = false;
        });
    });
  };

  const initYear = () => {
    const el = document.querySelector("#year");
    if (el) el.textContent = new Date().getFullYear();
  };

  initNav();
  initHeaderScroll();
  initActiveLink();
  initReveal();
  initForm();
  initYear();
})();
