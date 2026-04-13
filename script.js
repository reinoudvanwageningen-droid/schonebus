(function () {
  /* ── Calculator logic ── */

  var MIA_PERCENTAGE = 0.27;

  var TARIEF = {
    ib_laag: 0.3697,
    ib_midden: 0.3697,
    ib_hoog: 0.495,
    vpb_laag: 0.19,
    vpb_hoog: 0.258,
  };

  function kia(investering) {
    if (investering < 2901) return 0;
    if (investering <= 70602) return investering * 0.28;
    if (investering <= 130744) return 19769;
    if (investering <= 392230) return 19769 - 0.0758 * (investering - 130744);
    return 0;
  }

  function bereken(input) {
    var miaAftrek = input.prijs * MIA_PERCENTAGE;
    var kiaAftrek = input.andereInvesteringen ? 0 : kia(input.prijs);

    var tarief;
    if (input.rechtsvorm === "ib") {
      tarief = TARIEF["ib_" + (input.ibSchijf || "midden")];
    } else {
      tarief = TARIEF["vpb_" + (input.vpbSchijf || "laag")];
    }

    var miaVoordeel = miaAftrek * tarief;
    var kiaVoordeel = kiaAftrek * tarief;
    var totaal = miaVoordeel + kiaVoordeel;

    return {
      miaAftrek: miaAftrek,
      kiaAftrek: kiaAftrek,
      miaVoordeel: Math.round(miaVoordeel),
      kiaVoordeel: Math.round(kiaVoordeel),
      totaal: Math.round(totaal),
    };
  }

  function formatEuro(value) {
    return "€ " + new Intl.NumberFormat("nl-NL").format(Math.round(value));
  }

  function clamp(val, min, max) {
    if (!isFinite(val)) return 38500;
    return Math.min(max, Math.max(min, val));
  }

  /* ── State ── */

  var state = {
    prijs: 38500,
    rechtsvorm: "ib",
    ibSchijf: "midden",
    vpbSchijf: "laag",
    andereInvesteringen: false,
  };
  var resultRegion = document.querySelector(".result");
  var mainContent = document.getElementById("main-content");

  function setText(id, value) {
    var element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  }

  function updateCalculator() {
    var result = bereken(state);

    setText("result-total", formatEuro(result.totaal));
    setText("result-badge", "Totaal " + formatEuro(result.totaal));
    setText("result-mia-aftrek", formatEuro(result.miaAftrek));
    setText("result-mia-voordeel", formatEuro(result.miaVoordeel));
    setText("result-kia-aftrek", formatEuro(result.kiaAftrek));
    setText("result-kia-voordeel", formatEuro(result.kiaVoordeel));
    setText("result-totaal", formatEuro(result.totaal));
    setText("hero-benefit", formatEuro(result.totaal));
    setText("hero-price", "op een bus van " + formatEuro(state.prijs));
  }

  function refreshCalculator(announce) {
    if (resultRegion) {
      resultRegion.setAttribute("aria-live", announce ? "polite" : "off");
    }
    updateCalculator();
  }

  /* ── Calculator: price input ── */

  var prijsInput = document.getElementById("aanschafprijs");
  if (prijsInput) {
    function syncPriceInput() {
      state.prijs = clamp(Number(prijsInput.value), 10000, 150000);
      prijsInput.value = state.prijs;
      refreshCalculator(true);
    }

    prijsInput.addEventListener("input", function () {
      var rawValue = Number(this.value);
      if (Number.isFinite(rawValue) && rawValue >= 10000 && rawValue <= 150000) {
        state.prijs = rawValue;
        refreshCalculator(false);
      }
    });

    prijsInput.addEventListener("blur", syncPriceInput);
    prijsInput.addEventListener("change", syncPriceInput);
  }

  /* ── Calculator: rechtsvorm radios ── */

  var rechtsvormRadios = document.querySelectorAll('input[name="rechtsvorm"]');
  rechtsvormRadios.forEach(function (radio) {
    radio.addEventListener("change", function () {
      state.rechtsvorm = this.value;

      rechtsvormRadios.forEach(function (r) {
        r.closest(".radio-option").classList.toggle("radio-option--active", r.checked);
      });

      var ibOptions = document.getElementById("ib-options");
      var vpbOptions = document.getElementById("vpb-options");
      if (ibOptions && vpbOptions) {
        if (state.rechtsvorm === "ib") {
          ibOptions.style.display = "";
          vpbOptions.style.display = "none";
        } else {
          ibOptions.style.display = "none";
          vpbOptions.style.display = "";
        }
      }

      refreshCalculator(true);
    });
  });

  /* ── Calculator: income selects ── */

  var ibSelect = document.getElementById("ib-select");
  if (ibSelect) {
    ibSelect.addEventListener("change", function () {
      state.ibSchijf = this.value;
      refreshCalculator(true);
    });
  }

  var vpbSelect = document.getElementById("vpb-select");
  if (vpbSelect) {
    vpbSelect.addEventListener("change", function () {
      state.vpbSchijf = this.value;
      refreshCalculator(true);
    });
  }

  /* ── Calculator: andere investeringen toggle ── */

  var toggleBtns = document.querySelectorAll(".toggle-btn");
  var toggleNote = document.getElementById("toggle-note");

  toggleBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var val = this.dataset.value === "true";
      state.andereInvesteringen = val;

      toggleBtns.forEach(function (b) {
        var isActive = b.dataset.value === String(val);
        b.classList.toggle("toggle-btn--active", isActive);
        b.setAttribute("aria-pressed", isActive);
      });

      if (toggleNote) {
        toggleNote.style.display = val ? "" : "none";
      }

      refreshCalculator(true);
    });
  });

  /* ── Calculator: CTA ── */

  var calcCta = document.getElementById("calc-cta");
  if (calcCta) {
    calcCta.addEventListener("click", function () {
      var contactSection = document.getElementById("contact");
      if (contactSection) contactSection.scrollIntoView({ behavior: "smooth" });

      var busField = document.getElementById("aanschafprijs-bus");
      if (busField) {
        busField.value = new Intl.NumberFormat("nl-NL").format(state.prijs);
      }
    });
  }

  /* ── Header scroll ── */

  var header = document.getElementById("site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("header--scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ── Mobile menu ── */

  var burger = document.getElementById("burger");
  var mobileMenu = document.getElementById("mobile-menu");
  var menuIcon = document.getElementById("burger-menu");
  var closeIcon = document.getElementById("burger-close");
  var menuLinks = mobileMenu ? Array.prototype.slice.call(mobileMenu.querySelectorAll("a")) : [];

  if (burger && mobileMenu) {
    function isMenuOpen() {
      return mobileMenu.classList.contains("mobile-menu--open");
    }

    function updateMenuIcons(isOpen) {
      if (menuIcon && closeIcon) {
        menuIcon.style.display = isOpen ? "none" : "";
        closeIcon.style.display = isOpen ? "" : "none";
      }
    }

    function openMenu() {
      mobileMenu.classList.add("mobile-menu--open");
      burger.setAttribute("aria-expanded", "true");
      burger.setAttribute("aria-label", "Sluit menu");
      document.body.classList.add("menu-open");
      if (mainContent) {
        mainContent.inert = true;
        mainContent.setAttribute("aria-hidden", "true");
      }
      updateMenuIcons(true);
      if (header) {
        header.classList.add("header--scrolled");
      }
      if (menuLinks[0]) {
        menuLinks[0].focus();
      }
    }

    function closeMenu(restoreFocus) {
      mobileMenu.classList.remove("mobile-menu--open");
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Open menu");
      document.body.classList.remove("menu-open");
      if (mainContent) {
        mainContent.inert = false;
        mainContent.removeAttribute("aria-hidden");
      }
      updateMenuIcons(false);
      onScroll();
      if (restoreFocus !== false) {
        burger.focus();
      }
    }

    burger.addEventListener("click", function () {
      if (isMenuOpen()) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenu(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (!isMenuOpen()) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key === "Tab" && menuLinks.length > 1) {
        var firstLink = menuLinks[0];
        var lastLink = menuLinks[menuLinks.length - 1];

        if (event.shiftKey && document.activeElement === firstLink) {
          event.preventDefault();
          lastLink.focus();
        } else if (!event.shiftKey && document.activeElement === lastLink) {
          event.preventDefault();
          firstLink.focus();
        }
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 768 && isMenuOpen()) {
        closeMenu(false);
      }
    });
  }

  /* ── Contact form ── */

  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    var formSubmitSubject = document.getElementById("formsubmit-subject");
    var formSubmitReplyTo = document.getElementById("formsubmit-replyto");
    var contactSubmitButton = contactForm.querySelector('button[type="submit"]');

    function setFieldError(fieldId, errorId, message) {
      var field = document.getElementById(fieldId);
      var error = document.getElementById(errorId);
      if (error) {
        error.textContent = message;
      }
      if (field) {
        field.setAttribute("aria-invalid", "true");
        var wrap = field.closest(".field__input-wrap");
        if (wrap) {
          wrap.classList.add("field__input-wrap--error");
        }
      }
    }

    function clearFieldError(fieldId, errorId) {
      var field = document.getElementById(fieldId);
      var error = document.getElementById(errorId);
      if (error) {
        error.textContent = "";
      }
      if (field) {
        field.setAttribute("aria-invalid", "false");
        var wrap = field.closest(".field__input-wrap");
        if (wrap) {
          wrap.classList.remove("field__input-wrap--error");
        }
      }
    }

    ["naam", "bedrijfsnaam", "email"].forEach(function (fieldId) {
      var errorId = "error-" + fieldId;
      var field = document.getElementById(fieldId);
      if (field) {
        field.addEventListener("input", function () {
          clearFieldError(fieldId, errorId);
        });
      }
    });

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var naam = document.getElementById("naam").value.trim();
      var bedrijfsnaam = document.getElementById("bedrijfsnaam").value.trim();
      var email = document.getElementById("email").value.trim();
      var hasError = false;
      var firstInvalidField = null;
      clearFieldError("naam", "error-naam");
      clearFieldError("bedrijfsnaam", "error-bedrijfsnaam");
      clearFieldError("email", "error-email");

      if (!naam) {
        setFieldError("naam", "error-naam", "Vul je naam in.");
        firstInvalidField = firstInvalidField || document.getElementById("naam");
        hasError = true;
      }
      if (!bedrijfsnaam) {
        setFieldError("bedrijfsnaam", "error-bedrijfsnaam", "Vul je bedrijfsnaam in.");
        firstInvalidField = firstInvalidField || document.getElementById("bedrijfsnaam");
        hasError = true;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setFieldError("email", "error-email", email ? "Vul een geldig emailadres in." : "Vul je emailadres in.");
        firstInvalidField = firstInvalidField || document.getElementById("email");
        hasError = true;
      }

      if (hasError) {
        if (firstInvalidField) {
          firstInvalidField.focus();
        }
        return;
      }

      if (formSubmitSubject) {
        formSubmitSubject.value = "Aanvraag schonebus.nl voor " + bedrijfsnaam;
      }

      if (formSubmitReplyTo) {
        formSubmitReplyTo.value = email;
      }

      if (contactSubmitButton) {
        contactSubmitButton.disabled = true;
        contactSubmitButton.textContent = "Bezig met verzenden";
      }

      contactForm.submit();
    });
  }

  refreshCalculator(false);
})();
