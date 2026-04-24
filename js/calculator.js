(function () {
  var KIA_LIMITS = {
    minimum: 2901,
    firstMax: 71683,
    plateauMax: 132746,
    phaseOutMax: 398236,
    plateauAmount: 20072,
    percentage: 0.28,
    phaseOutPercentage: 0.0756,
  };

  var TAX_RATE = {
    ib_laag: 0.3575,
    ib_midden: 0.3756,
    ib_hoog: 0.495,
    vpb_laag: 0.19,
    vpb_hoog: 0.258,
  };

  var state = {
    prijs: 38500,
    rechtsvorm: "ib",
    ibSchijf: "midden",
    vpbSchijf: "laag",
    andereInvesteringen: 0,
  };

  var resultRegion = document.querySelector(".result");
  var priceInput = document.getElementById("aanschafprijs");
  var otherInput = document.getElementById("andere-investeringen");
  var priceError = document.getElementById("error-aanschafprijs");
  var otherError = document.getElementById("error-andere-investeringen");

  function kia(investering) {
    if (investering < KIA_LIMITS.minimum) return 0;
    if (investering <= KIA_LIMITS.firstMax) return investering * KIA_LIMITS.percentage;
    if (investering <= KIA_LIMITS.plateauMax) return KIA_LIMITS.plateauAmount;
    if (investering <= KIA_LIMITS.phaseOutMax) {
      return KIA_LIMITS.plateauAmount - KIA_LIMITS.phaseOutPercentage * (investering - KIA_LIMITS.plateauMax);
    }
    return 0;
  }

  function taxRate() {
    if (state.rechtsvorm === "ib") {
      return TAX_RATE["ib_" + state.ibSchijf];
    }
    return TAX_RATE["vpb_" + state.vpbSchijf];
  }

  function calculate() {
    var existingKia = kia(state.andereInvesteringen);
    var totalInvestment = state.prijs + state.andereInvesteringen;
    var totalKia = kia(totalInvestment);
    var busKia = totalKia - existingKia;
    var taxBenefit = busKia * taxRate();

    return {
      totalInvestment: totalInvestment,
      totalKia: Math.round(totalKia),
      busKia: Math.round(busKia),
      taxBenefit: Math.round(taxBenefit),
    };
  }

  function formatEuro(value) {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(Math.round(value));
  }

  function setText(id, value) {
    document.getElementById(id).textContent = value;
  }

  function setInputError(input, errorElement, message) {
    input.setAttribute("aria-invalid", message ? "true" : "false");
    errorElement.textContent = message;
    input.closest(".field__input-wrap").classList.toggle("field__input-wrap--error", Boolean(message));
  }

  function readEuroInput(input, errorElement, min, max, label) {
    var value = Number(input.value);
    if (!Number.isFinite(value) || value < min || value > max) {
      setInputError(input, errorElement, label + " moet tussen " + formatEuro(min) + " en " + formatEuro(max) + " liggen.");
      return null;
    }

    setInputError(input, errorElement, "");
    return value;
  }

  function updateCalculator(announce) {
    var result = calculate();

    if (resultRegion) {
      resultRegion.setAttribute("aria-live", announce ? "polite" : "off");
    }

    setText("result-total", formatEuro(result.taxBenefit));
    setText("result-badge", "KIA voordeel " + formatEuro(result.taxBenefit));
    setText("result-kia-aftrek", formatEuro(result.busKia));
    setText("result-kia-voordeel", formatEuro(result.taxBenefit));
    setText("result-investering-totaal", formatEuro(result.totalInvestment));
    setText("result-totaal", formatEuro(result.taxBenefit));
    setText("hero-benefit", formatEuro(result.taxBenefit));
    setText("hero-price", "KIA-indicatie bij een bus van " + formatEuro(state.prijs));
  }

  function syncPrice(announce) {
    var value = readEuroInput(priceInput, priceError, 10000, 150000, "De aanschafprijs");
    if (value === null) return;
    state.prijs = value;
    updateCalculator(announce);
  }

  function syncOtherInvestments(announce) {
    var value = readEuroInput(otherInput, otherError, 0, 500000, "Andere investeringen");
    if (value === null) return;
    state.andereInvesteringen = value;
    updateCalculator(announce);
  }

  function bindInvestmentInput(input, sync) {
    input.addEventListener("input", function () {
      sync(false);
    });
    input.addEventListener("change", function () {
      sync(true);
    });
    input.addEventListener("blur", function () {
      sync(true);
    });
  }

  function updateLegalForm() {
    var ibOptions = document.getElementById("ib-options");
    var vpbOptions = document.getElementById("vpb-options");
    var isIb = state.rechtsvorm === "ib";

    ibOptions.hidden = !isIb;
    vpbOptions.hidden = isIb;

    document.querySelectorAll('input[name="rechtsvorm"]').forEach(function (radio) {
      radio.closest(".radio-option").classList.toggle("radio-option--active", radio.checked);
    });
  }

  bindInvestmentInput(priceInput, syncPrice);
  bindInvestmentInput(otherInput, syncOtherInvestments);

  document.querySelectorAll('input[name="rechtsvorm"]').forEach(function (radio) {
    radio.addEventListener("change", function () {
      state.rechtsvorm = this.value;
      updateLegalForm();
      updateCalculator(true);
    });
  });

  document.getElementById("ib-select").addEventListener("change", function () {
    state.ibSchijf = this.value;
    updateCalculator(true);
  });

  document.getElementById("vpb-select").addEventListener("change", function () {
    state.vpbSchijf = this.value;
    updateCalculator(true);
  });

  document.getElementById("calc-cta").addEventListener("click", function () {
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
    document.getElementById("aanschafprijs-bus").value = formatEuro(state.prijs);
  });

  updateLegalForm();
  updateCalculator(false);
})();
