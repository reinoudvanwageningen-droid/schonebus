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

  function updateCalculator() {
    var result = bereken(state);

    document.getElementById("result-total").textContent = formatEuro(result.totaal);
    document.getElementById("result-badge").textContent = "Totaal " + formatEuro(result.totaal);
    document.getElementById("result-mia-aftrek").textContent = formatEuro(result.miaAftrek);
    document.getElementById("result-mia-voordeel").textContent = formatEuro(result.miaVoordeel);
    document.getElementById("result-kia-aftrek").textContent = formatEuro(result.kiaAftrek);
    document.getElementById("result-kia-voordeel").textContent = formatEuro(result.kiaVoordeel);
    document.getElementById("result-totaal").textContent = formatEuro(result.totaal);
  }

  /* ── Calculator: price input ── */

  var prijsInput = document.getElementById("aanschafprijs");
  if (prijsInput) {
    prijsInput.addEventListener("input", function () {
      state.prijs = clamp(Number(this.value), 10000, 150000);
      updateCalculator();
    });
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

      updateCalculator();
    });
  });

  /* ── Calculator: income selects ── */

  var ibSelect = document.getElementById("ib-select");
  if (ibSelect) {
    ibSelect.addEventListener("change", function () {
      state.ibSchijf = this.value;
      updateCalculator();
    });
  }

  var vpbSelect = document.getElementById("vpb-select");
  if (vpbSelect) {
    vpbSelect.addEventListener("change", function () {
      state.vpbSchijf = this.value;
      updateCalculator();
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

      updateCalculator();
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

  if (burger && mobileMenu) {
    burger.addEventListener("click", function () {
      var isOpen = mobileMenu.classList.toggle("mobile-menu--open");
      burger.setAttribute("aria-expanded", isOpen);
      burger.setAttribute("aria-label", isOpen ? "Sluit menu" : "Open menu");
      if (menuIcon && closeIcon) {
        menuIcon.style.display = isOpen ? "none" : "";
        closeIcon.style.display = isOpen ? "" : "none";
      }
      if (isOpen) {
        header.classList.add("header--scrolled");
      } else {
        onScroll();
      }
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("mobile-menu--open");
        burger.setAttribute("aria-expanded", "false");
        burger.setAttribute("aria-label", "Open menu");
        if (menuIcon && closeIcon) {
          menuIcon.style.display = "";
          closeIcon.style.display = "none";
        }
        onScroll();
      });
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 768) {
        mobileMenu.classList.remove("mobile-menu--open");
        burger.setAttribute("aria-expanded", "false");
        if (menuIcon && closeIcon) {
          menuIcon.style.display = "";
          closeIcon.style.display = "none";
        }
        onScroll();
      }
    });
  }

  /* ── Contact form ── */

  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var naam = document.getElementById("naam").value.trim();
      var bedrijfsnaam = document.getElementById("bedrijfsnaam").value.trim();
      var email = document.getElementById("email").value.trim();
      var telefoon = document.getElementById("telefoon").value.trim();
      var busPrijs = document.getElementById("aanschafprijs-bus").value.trim();
      var bericht = document.getElementById("bericht").value.trim();

      var hasError = false;
      document.querySelectorAll(".field__error").forEach(function (el) { el.textContent = ""; });
      document.querySelectorAll(".field__input-wrap--error").forEach(function (el) { el.classList.remove("field__input-wrap--error"); });

      if (!naam) {
        document.getElementById("error-naam").textContent = "Vul je naam in.";
        document.getElementById("naam").closest(".field__input-wrap").classList.add("field__input-wrap--error");
        hasError = true;
      }
      if (!bedrijfsnaam) {
        document.getElementById("error-bedrijfsnaam").textContent = "Vul je bedrijfsnaam in.";
        document.getElementById("bedrijfsnaam").closest(".field__input-wrap").classList.add("field__input-wrap--error");
        hasError = true;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById("error-email").textContent = email ? "Vul een geldig e-mailadres in." : "Vul je e-mailadres in.";
        document.getElementById("email").closest(".field__input-wrap").classList.add("field__input-wrap--error");
        hasError = true;
      }

      if (hasError) return;

      var lines = [
        "Naam: " + naam,
        "Bedrijfsnaam: " + bedrijfsnaam,
        telefoon ? "Telefoon: " + telefoon : "",
        busPrijs ? "Aanschafprijs bus: €" + busPrijs : "",
        "",
        bericht || "",
      ].filter(Boolean);

      var subject = encodeURIComponent("Aanvraag schonebus.nl – " + bedrijfsnaam);
      var body = encodeURIComponent(lines.join("\n"));

      window.location.href = "mailto:aanvraag@zetgroep.nl?subject=" + subject + "&body=" + body;
    });
  }

  updateCalculator();
})();
