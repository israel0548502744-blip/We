/* ==========================================================
   SITE CONFIG – fill in the real details here
   ========================================================== */
const SITE_CONFIG = {
  // WhatsApp number in international format, digits only (e.g. "972501234567")
  whatsapp: "",
  // Email address for lecture inquiries
  email: "",
  social: {
    instagram: "https://www.instagram.com/simcha_lavii/",
    tiktok: "",   // e.g. "https://www.tiktok.com/@..."
    youtube: "",  // e.g. "https://www.youtube.com/@..."
  },
};

(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* ---------- year ---------- */
  $("#year").textContent = new Date().getFullYear();

  /* ---------- social links ---------- */
  $$("[data-social]").forEach((a) => {
    const key = a.dataset.social;
    if (key === "email") {
      if (SITE_CONFIG.email) a.href = `mailto:${SITE_CONFIG.email}`;
      a.removeAttribute("target");
      return;
    }
    const url = SITE_CONFIG.social[key];
    if (url) a.href = url;
    else a.closest("li").hidden = true; // hide until a real link is configured
  });

  /* ---------- header: scrolled state + mobile menu ---------- */
  const header = $(".site-header");
  const stickyCta = $(".sticky-cta");
  const hero = $(".hero");
  const contact = $("#contact");

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 40);
    const pastHero = y > hero.offsetHeight * 0.7;
    const atContact = contact.getBoundingClientRect().top < window.innerHeight * 0.8;
    stickyCta.classList.toggle("show", pastHero && !atContact);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const toggle = $("#menu-toggle");
  const nav = $("#main-nav");
  const setMenu = (open) => {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  };
  toggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  $$("a", nav).forEach((a) => a.addEventListener("click", () => setMenu(false)));

  /* ---------- active nav link ---------- */
  const navLinks = $$(".main-nav a:not(.nav-cta-mobile)");
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const id = "#" + e.target.id;
        navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === id));
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  /* ---------- reveal on scroll ---------- */
  const revealTargets = $$(
    ".panel, .chapter, .mini-chapter, .audience-grid li, .g-item, .contact-copy, .contact-form, .section-head"
  );
  revealTargets.forEach((el) => el.classList.add("reveal"));
  const revealer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          revealer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealTargets.forEach((el) => revealer.observe(el));

  /* ---------- modal (gallery + video) ---------- */
  const modal = $("#modal");
  const modalContent = $("#modal-content");
  let lastFocus = null;

  const openModal = (node) => {
    lastFocus = document.activeElement;
    modalContent.replaceChildren(node);
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    $(".modal-close", modal).focus();
  };
  const closeModal = () => {
    modal.hidden = true;
    modalContent.replaceChildren();
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  };
  $$("[data-close]", modal).forEach((el) => el.addEventListener("click", closeModal));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  $$(".g-item").forEach((btn) =>
    btn.addEventListener("click", () => {
      const img = document.createElement("img");
      img.src = btn.dataset.full;
      img.alt = $("img", btn).alt;
      openModal(img);
    })
  );

  $$("[data-video]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const src = btn.dataset.video;
      let node;
      if (!src) {
        node = document.createElement("div");
        node.className = "soon";
        node.innerHTML =
          '<h3>הסרטון בדרך</h3><p>בינתיים אפשר לראות קטעים מההרצאות באינסטגרם של שמחה.</p>' +
          '<a class="btn btn-pink" target="_blank" rel="noopener" href="' +
          SITE_CONFIG.social.instagram +
          '">לאינסטגרם</a>';
      } else if (/youtube\.com|youtu\.be|vimeo\.com/.test(src)) {
        node = document.createElement("iframe");
        node.src = src;
        node.title = btn.dataset.title || "וידאו";
        node.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
        node.allowFullscreen = true;
      } else {
        node = document.createElement("video");
        node.className = "vertical";
        node.src = src;
        if (btn.dataset.poster) node.poster = btn.dataset.poster;
        node.controls = true;
        node.autoplay = true;
        node.playsInline = true;
      }
      openModal(node);
    })
  );

  /* ---------- contact form ---------- */
  const form = $("#contact-form");
  const status = $("#form-status");

  const collect = () => {
    const d = Object.fromEntries(new FormData(form).entries());
    let ok = true;
    ["name", "phone"].forEach((k) => {
      const field = form.elements[k].closest(".field");
      const bad = !String(d[k] || "").trim();
      field.classList.toggle("invalid", bad);
      if (bad) ok = false;
    });
    if (!ok) {
      status.textContent = "נא למלא שם וטלפון כדי שנוכל לחזור אליכם.";
      return null;
    }
    const lines = [
      "היי שמחה, אשמח לפרטים על הרצאה 🙂",
      `שם: ${d.name}`,
      `טלפון: ${d.phone}`,
      d.org && `מוסד / ארגון: ${d.org}`,
      d.type && `סוג ההרצאה: ${d.type}`,
      d.date && `תאריך משוער: ${d.date}`,
      d.size && `מספר משתתפים: ${d.size}`,
      d.message && `פרטים: ${d.message}`,
    ].filter(Boolean);
    return lines.join("\n");
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = collect();
    if (!text) return;
    if (!SITE_CONFIG.whatsapp) {
      status.textContent = "מספר הוואטסאפ עוד לא הוגדר – אפשר לשלוח במייל.";
      return;
    }
    status.textContent = "פותחים וואטסאפ...";
    window.open(`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  });

  $("#send-email").addEventListener("click", () => {
    const text = collect();
    if (!text) return;
    if (!SITE_CONFIG.email) {
      status.textContent = "כתובת המייל עוד לא הוגדרה – אפשר לפנות באינסטגרם ‎@simcha_lavii.";
      return;
    }
    status.textContent = "פותחים את תוכנת המייל...";
    const subject = encodeURIComponent("הזמנת הרצאה – שמחה לביא");
    window.location.href = `mailto:${SITE_CONFIG.email}?subject=${subject}&body=${encodeURIComponent(text)}`;
  });
})();
