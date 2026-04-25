(function () {
  var calculatorRoot = document.getElementById("calculator-flow");

  if (!calculatorRoot) return;

  var KIA_LIMITS = {
    minimum: 2901,
    firstMax: 71683,
    plateauMax: 132746,
    phaseOutMax: 398236,
    plateauAmount: 20072,
    percentage: 0.28,
    phaseOutPercentage: 0.0756,
  };

  var EIA_RULES = {
    deductionPercentage: 0.4,
    minInvestment: 2500,
    codes: {
      cooling: {
        code: "240208",
        label: "Elektrische koeling op koel/vries wegtransport",
        wholeVehicleEligible: false,
      },
      solar: {
        code: "251115",
        label: "Zonnepanelen of -folie op transportmiddelen",
        wholeVehicleEligible: false,
      },
      mirrorCamera: {
        code: "241225",
        label: "Spiegelcamera",
        wholeVehicleEligible: false,
      },
      tirePressure: {
        code: "240906",
        label: "Bandenspanningregelsysteem",
        wholeVehicleEligible: false,
      },
      genericExisting: {
        code: "340000",
        label: "Technische voorziening voor energiebesparing in of aan bestaande transportmiddelen",
        requiresPaybackPeriod: true,
      },
      genericNew: {
        code: "440000",
        label: "Technische voorziening voor energiebesparing in of aan nieuwe transportmiddelen",
        requiresPaybackPeriod: true,
      },
    },
  };

  var TAX_RATES = {
    ib: {
      low: 0.3575,
      middle: 0.3756,
      high: 0.495,
    },
    vpb: {
      low: 0.19,
      high: 0.258,
    },
  };

  var state = {
    currentStep: 1,
    situation: null,
    busType: null,
    obligationTiming: null,
    obligationDate: null,
    busPrice: 38500,
    eiaItems: [],
    eiaDetails: {
      cooling: {
        selected: false,
        insulatedVehicle: null,
        fullyElectric: null,
        hasDieselAggregate: null,
        halogenFreeRefrigerant: null,
        cost: 0,
      },
      solar: {
        selected: false,
        mountedOnVehicle: null,
        cost: 0,
      },
      mirrorCamera: {
        selected: false,
        replacesMirrors: null,
        hasSideScreens: null,
        cost: 0,
      },
      tirePressure: {
        selected: false,
        automaticCorrection: null,
        onlyMonitoring: null,
        cost: 0,
      },
      generic: {
        selected: false,
        newOrExisting: null,
        cost: 0,
        annualEnergySavingEuro: 0,
      },
    },
    otherInvestmentsPreset: null,
    otherInvestments: 0,
    legalForm: "ib",
    ibBracket: "middle",
    vpbBracket: "low",
    uncertainty: [],
  };

  var labelMaps = {
    situation: {
      purchased: "Ik heb al gekocht of financial lease getekend",
      quote: "Ik heb een offerte of opdrachtbevestiging",
      planning: "Ik wil binnenkort kopen of leasen",
      alreadyDriving: "Ik rij al elektrisch en wil weten of ik voordeel misloop",
      unknown: "Weet ik niet",
    },
    busType: {
      new: "Nieuwe elektrische bestelbus",
      used: "Gebruikte elektrische bestelbus",
      cooling: "Elektrische koel/vriesbus",
      bodywork: "Elektrische bestelbus met opbouw",
      financialLease: "Financial lease",
      operationalLease: "Operational lease",
      unknown: "Weet ik niet",
    },
    obligationTiming: {
      notSigned: "Nog niet getekend",
      lessThanMonth: "Minder dan 1 maand geleden",
      oneToThreeMonths: "1 tot 3 maanden geleden",
      moreThanThreeMonths: "Meer dan 3 maanden geleden",
      in2025: "In 2025",
      before2025: "Voor 2025",
      unknown: "Weet ik niet",
    },
    eiaItems: {
      cooling: "Elektrische koel/vriesinstallatie",
      solar: "Zonnepanelen of zonnefolie op de bus",
      mirrorCamera: "Spiegelcamera's in plaats van buitenspiegels",
      tirePressure: "Automatisch bandenspanningregelsysteem",
      generic: "Andere energiebesparende voorziening",
      none: "Geen van deze",
      unknown: "Weet ik niet",
    },
    otherInvestmentsPreset: {
      none: "Nee / bijna niets",
      under25000: "Ja, onder €25.000",
      between25000And75000: "Ja, €25.000 tot €75.000",
      above75000: "Ja, meer dan €75.000",
      unknown: "Weet ik niet",
    },
    legalForm: {
      ib: "Eenmanszaak / VOF",
      vpb: "BV",
      unknown: "Weet ik niet",
    },
    ibBracket: {
      low: "tot €38.883",
      middle: "€38.883 tot €78.426",
      high: "boven €78.426",
    },
    vpbBracket: {
      low: "tot €200.000 winst",
      high: "boven €200.000 winst",
    },
  };

  function calculateKia(investment) {
    if (investment < KIA_LIMITS.minimum) return 0;
    if (investment <= KIA_LIMITS.firstMax) return investment * KIA_LIMITS.percentage;
    if (investment <= KIA_LIMITS.plateauMax) return KIA_LIMITS.plateauAmount;
    if (investment <= KIA_LIMITS.phaseOutMax) {
      return Math.max(0, KIA_LIMITS.plateauAmount - KIA_LIMITS.phaseOutPercentage * (investment - KIA_LIMITS.plateauMax));
    }
    return 0;
  }

  function getTaxRate(currentState) {
    if (currentState.legalForm === "vpb") return TAX_RATES.vpb[currentState.vpbBracket] || TAX_RATES.vpb.low;
    return TAX_RATES.ib[currentState.ibBracket] || TAX_RATES.ib.middle;
  }

  function calculateKiaResult(currentState) {
    var taxRate = getTaxRate(currentState);
    var existingKia = calculateKia(currentState.otherInvestments);
    var totalInvestment = currentState.busPrice + currentState.otherInvestments;
    var totalKia = calculateKia(totalInvestment);
    var busKiaDeduction = Math.max(0, totalKia - existingKia);
    var kiaTaxBenefit = busKiaDeduction * taxRate;

    return {
      existingKia: existingKia,
      totalInvestment: totalInvestment,
      totalKia: totalKia,
      busKiaDeduction: busKiaDeduction,
      kiaTaxBenefit: kiaTaxBenefit,
    };
  }

  function calculateGenericPayback(cost, annualSaving) {
    if (!annualSaving || annualSaving <= 0) return null;
    return cost / annualSaving;
  }

  function createEiaItem(key, cost, rule, status, statusType, warnings) {
    var deduction = cost * EIA_RULES.deductionPercentage;

    return {
      key: key,
      code: rule.code,
      label: rule.label,
      cost: cost,
      deduction: deduction,
      status: status,
      statusType: statusType,
      warnings: warnings || [],
    };
  }

  function calculateEiaItems(currentState) {
    var details = currentState.eiaDetails;
    var items = [];
    var warnings = [];

    if (details.cooling.selected) {
      var coolingWarnings = [];
      if (details.cooling.cost < EIA_RULES.minInvestment) coolingWarnings.push("Koel/vrieskosten zijn lager dan €2.500.");
      if (details.cooling.fullyElectric !== true) coolingWarnings.push("Controle nodig of de koelinstallatie uitsluitend elektrisch is.");
      if (details.cooling.hasDieselAggregate === true) coolingWarnings.push("Dieselaggregaat ingevuld: koel/vriesvoorziening niet positief meegerekend.");
      if (details.cooling.insulatedVehicle === false) coolingWarnings.push("Isolatie voor koel/vriestransport ontbreekt volgens de invoer.");
      if (details.cooling.halogenFreeRefrigerant === null) coolingWarnings.push("Koudemiddel nog technisch controleren.");
      if (details.cooling.halogenFreeRefrigerant === false) coolingWarnings.push("Koudemiddel lijkt niet halogeenvrij; technische check nodig.");

      if (
        details.cooling.cost >= EIA_RULES.minInvestment &&
        details.cooling.fullyElectric === true &&
        details.cooling.hasDieselAggregate === false &&
        details.cooling.insulatedVehicle !== false
      ) {
        items.push(createEiaItem(
          "cooling",
          details.cooling.cost,
          EIA_RULES.codes.cooling,
          details.cooling.halogenFreeRefrigerant === true ? "Sterke EIA-kans" : "EIA-kans, technische check nodig",
          details.cooling.halogenFreeRefrigerant === true ? "positive" : "warning",
          coolingWarnings
        ));
      }

      warnings = warnings.concat(coolingWarnings);
    }

    if (details.solar.selected) {
      var solarWarnings = [];
      if (details.solar.cost < EIA_RULES.minInvestment) solarWarnings.push("Kosten zonnepanelen of folie zijn lager dan €2.500.");
      if (details.solar.mountedOnVehicle === false) solarWarnings.push("Panelen of folie lijken niet op de bus zelf te zitten.");

      if (details.solar.cost >= EIA_RULES.minInvestment && details.solar.mountedOnVehicle !== false) {
        items.push(createEiaItem(
          "solar",
          details.solar.cost,
          EIA_RULES.codes.solar,
          details.solar.mountedOnVehicle === true ? "Sterke EIA-kans" : "EIA-kans, technische check nodig",
          details.solar.mountedOnVehicle === true ? "positive" : "warning",
          solarWarnings
        ));
      }

      warnings = warnings.concat(solarWarnings);
    }

    if (details.mirrorCamera.selected) {
      var mirrorWarnings = [];
      if (details.mirrorCamera.cost < EIA_RULES.minInvestment) mirrorWarnings.push("Kosten spiegelcamera-systeem zijn lager dan €2.500.");
      if (details.mirrorCamera.replacesMirrors !== true) mirrorWarnings.push("Specificatie nodig: buitenspiegels moeten zijn vervangen door camera's.");
      if (details.mirrorCamera.hasSideScreens !== true) mirrorWarnings.push("Specificatie nodig: beeldschermen aan de zijkant in het voertuig.");

      if (
        details.mirrorCamera.cost >= EIA_RULES.minInvestment &&
        details.mirrorCamera.replacesMirrors === true &&
        details.mirrorCamera.hasSideScreens === true
      ) {
        items.push(createEiaItem("mirrorCamera", details.mirrorCamera.cost, EIA_RULES.codes.mirrorCamera, "Sterke EIA-kans", "positive", mirrorWarnings));
      }

      warnings = warnings.concat(mirrorWarnings);
    }

    if (details.tirePressure.selected) {
      var tireWarnings = [];
      if (details.tirePressure.cost < EIA_RULES.minInvestment) tireWarnings.push("Kosten bandenspanningregelsysteem zijn lager dan €2.500.");
      if (details.tirePressure.automaticCorrection !== true) tireWarnings.push("Specificatie nodig: systeem moet automatisch corrigeren.");
      if (details.tirePressure.onlyMonitoring === true) tireWarnings.push("Alleen meten is niet positief meegerekend.");

      if (
        details.tirePressure.cost >= EIA_RULES.minInvestment &&
        details.tirePressure.automaticCorrection === true &&
        details.tirePressure.onlyMonitoring !== true
      ) {
        items.push(createEiaItem("tirePressure", details.tirePressure.cost, EIA_RULES.codes.tirePressure, "Sterke EIA-kans", "positive", tireWarnings));
      }

      warnings = warnings.concat(tireWarnings);
    }

    if (details.generic.selected) {
      var payback = calculateGenericPayback(details.generic.cost, details.generic.annualEnergySavingEuro);
      var genericWarnings = [];
      var isExisting = details.generic.newOrExisting === "existing";
      var rule = isExisting ? EIA_RULES.codes.genericExisting : EIA_RULES.codes.genericNew;

      if (!details.generic.newOrExisting) genericWarnings.push("Bestaande of nieuwe bus nog kiezen voor generieke code.");
      if (details.generic.cost < EIA_RULES.minInvestment) genericWarnings.push("Kosten voorziening zijn lager dan €2.500.");
      if (!payback) genericWarnings.push("Jaarlijkse energiekostenbesparing nodig voor terugverdientijd.");
      if (payback && (payback < 5 || payback > 15)) genericWarnings.push("Extra onderbouwing nodig: terugverdientijd valt buiten 5 tot 15 jaar.");

      if (
        details.generic.newOrExisting &&
        details.generic.cost >= EIA_RULES.minInvestment &&
        details.generic.annualEnergySavingEuro > 0 &&
        payback >= 5 &&
        payback <= 15
      ) {
        items.push(createEiaItem(
          "generic",
          details.generic.cost,
          rule,
          "EIA-kans, technische check nodig",
          "warning",
          genericWarnings.concat(["Terugverdientijd indicatief: " + payback.toFixed(1).replace(".", ",") + " jaar."])
        ));
      }

      warnings = warnings.concat(genericWarnings);
    }

    return {
      items: items,
      warnings: warnings,
      eligibleInvestment: items.reduce(function (sum, item) { return sum + item.cost; }, 0),
      deduction: items.reduce(function (sum, item) { return sum + item.deduction; }, 0),
    };
  }

  function calculateEiaDeadlineStatus(currentState) {
    var statusMap = {
      notSigned: {
        key: "vooraf_checken",
        label: "Op tijd",
        text: "Vooraf checken: sterke positie.",
        resultText: "Vooraf checken, sterke positie.",
        type: "positive",
        excludesBenefit: false,
      },
      lessThanMonth: {
        key: "op_tijd",
        label: "Op tijd",
        text: "EIA-melding lijkt mogelijk op tijd.",
        resultText: "EIA-melding lijkt mogelijk op tijd.",
        type: "positive",
        excludesBenefit: false,
      },
      oneToThreeMonths: {
        key: "urgent",
        label: "Snel checken",
        text: "EIA-termijn loopt, snel checken.",
        resultText: "EIA-termijn loopt, snel checken.",
        type: "warning",
        excludesBenefit: false,
      },
      moreThanThreeMonths: {
        key: "risico_te_laat",
        label: "Termijnrisico",
        text: "Mogelijk termijnrisico.",
        resultText: "Mogelijk gemist voordeel: laat de termijn controleren.",
        type: "warning",
        excludesBenefit: true,
      },
      in2025: {
        key: "investeringsjaar_check",
        label: "Snel checken",
        text: "Investeringsjaar apart controleren.",
        resultText: "Investeringsjaar apart controleren.",
        type: "warning",
        excludesBenefit: false,
      },
      before2025: {
        key: "investeringsjaar_check",
        label: "Snel checken",
        text: "Investeringsjaar apart controleren.",
        resultText: "Investeringsjaar apart controleren.",
        type: "warning",
        excludesBenefit: false,
      },
      unknown: {
        key: "datum_onbekend",
        label: "Datum onbekend",
        text: "Datumcheck nodig.",
        resultText: "Datumcheck nodig.",
        type: "neutral",
        excludesBenefit: false,
      },
    };

    return statusMap[currentState.obligationTiming] || statusMap.unknown;
  }

  function calculateTotalResult(currentState) {
    var taxRate = getTaxRate(currentState);
    var kia = calculateKiaResult(currentState);
    var eia = calculateEiaItems(currentState);
    var deadline = calculateEiaDeadlineStatus(currentState);
    var eiaTaxBenefit = eia.deduction * taxRate;
    var eiaTaxBenefitWithoutDeadlineRisk = deadline.excludesBenefit ? 0 : eiaTaxBenefit;

    return {
      taxRate: taxRate,
      kia: kia,
      eia: eia,
      deadline: deadline,
      eiaTaxBenefit: eiaTaxBenefit,
      eiaTaxBenefitWithoutDeadlineRisk: eiaTaxBenefitWithoutDeadlineRisk,
      totalIndicativeBenefit: kia.kiaTaxBenefit + eiaTaxBenefitWithoutDeadlineRisk,
    };
  }

  function formatEuro(value) {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(Math.round(value || 0));
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function optionButton(group, value, label, active, multi) {
    return '<button type="button" class="check-card' + (active ? " check-card--active" : "") + '" data-action="' + (multi ? "toggle-multi" : "select") + '" data-group="' + group + '" data-value="' + value + '" aria-pressed="' + (active ? "true" : "false") + '">' +
      '<span>' + escapeHtml(label) + '</span>' +
      (active ? '<strong>Gekozen</strong>' : "") +
      '</button>';
  }

  function yesNoButtons(group, field, value) {
    return '<div class="check-mini-options" role="group">' +
      optionButton(group + "." + field, "true", "Ja", value === true, false) +
      optionButton(group + "." + field, "false", "Nee", value === false, false) +
      optionButton(group + "." + field, "unknown", "Weet ik niet", value === null, false) +
      '</div>';
  }

  function renderProgress() {
    var percentage = Math.max(0, Math.min(100, (state.currentStep / 8) * 100));

    return '<div class="check-flow__progress" aria-label="Voortgang calculator">' +
      '<div class="check-flow__progress-label"><span>Stap ' + state.currentStep + ' van 8</span><span>' + Math.round(percentage) + '%</span></div>' +
      '<div class="check-flow__bar" role="progressbar" aria-label="Voortgang voordeelcheck" aria-valuemin="1" aria-valuemax="8" aria-valuenow="' + state.currentStep + '">' +
      '<span style="width:' + percentage + '%"></span>' +
      '</div>' +
      '</div>';
  }

  function renderStepIntro(title, text) {
    return '<div class="check-flow__step">' +
      '<p class="check-flow__eyebrow">Subsidiecheck elektrische bestelbus</p>' +
      '<h3 class="section-subheading">' + title + '</h3>' +
      (text ? '<p class="section-text mt-3">' + text + '</p>' : "");
  }

  function renderActions(nextDisabled) {
    return '<div class="check-actions">' +
      (state.currentStep > 1 ? '<button type="button" class="btn btn--secondary btn--lg" data-action="prev">Vorige</button>' : '<span></span>') +
      (state.currentStep < 8 ? '<button type="button" class="btn btn--primary btn--lg" data-action="next" ' + (nextDisabled ? "disabled" : "") + '>Volgende</button>' : "") +
      '</div>';
  }

  function renderEuroInput(id, label, value, min, max, step, helper) {
    return '<label class="check-input">' +
      '<span class="field__label">' + label + '</span>' +
      '<span class="field__input-wrap">' +
      '<span class="field__prefix">€</span>' +
      '<input class="field__input field__input--has-prefix" type="number" id="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + escapeHtml(value) + '" inputmode="numeric" aria-describedby="error-' + id + '" aria-invalid="false">' +
      '</span>' +
      '<span class="field__error" id="error-' + id + '"></span>' +
      (helper ? '<span class="toggle-note">' + helper + '</span>' : "") +
      '</label>';
  }

  function renderTextInput(id, label, value, helper) {
    return '<label class="check-input">' +
      '<span class="field__label">' + label + '</span>' +
      '<span class="field__input-wrap">' +
      '<input class="field__input" type="text" id="' + id + '" value="' + escapeHtml(value || "") + '">' +
      '</span>' +
      (helper ? '<span class="toggle-note">' + helper + '</span>' : "") +
      '</label>';
  }

  function renderStep() {
    var html = '<p class="calculator__intro">Veel ondernemers laten fiscaal voordeel liggen bij de aanschaf of opbouw van een elektrische bestelbus. Deze check laat zien waar de kansen zitten.</p>';
    html += renderProgress();

    if (state.currentStep === 1) {
      html += renderStepIntro("Waar sta je met je elektrische bestelbus?", "Klik de situatie aan die het beste past.");
      html += '<div class="check-card-grid">';
      Object.keys(labelMaps.situation).forEach(function (key) {
        html += optionButton("situation", key, labelMaps.situation[key], state.situation === key, false);
      });
      html += '</div>' + renderActions(!state.situation) + '</div>';
    }

    if (state.currentStep === 2) {
      html += renderStepIntro("Wat voor bus gaat het om?", "Voor KIA en EIA maakt het uit hoe de investering is vastgelegd en welke onderdelen apart gespecificeerd zijn.");
      html += '<div class="check-card-grid">';
      Object.keys(labelMaps.busType).forEach(function (key) {
        html += optionButton("busType", key, labelMaps.busType[key], state.busType === key, false);
      });
      html += '</div>' + renderActions(!state.busType) + '</div>';
    }

    if (state.currentStep === 3) {
      var deadline = calculateEiaDeadlineStatus(state);
      html += renderStepIntro("Wanneer ben je de investeringsverplichting aangegaan?", "De datum van tekenen of bestellen bepaalt hoe scherp de EIA-termijn is.");
      html += '<div class="check-card-grid">';
      Object.keys(labelMaps.obligationTiming).forEach(function (key) {
        html += optionButton("obligationTiming", key, labelMaps.obligationTiming[key], state.obligationTiming === key, false);
      });
      html += '</div>';
      if (state.obligationTiming) {
        html += '<p class="deadline-badge deadline-badge--' + deadline.type + '">' + deadline.text + '</p>';
      }
      html += renderTextInput("obligation-date", "Exacte datum, als je die weet", state.obligationDate, "");
      html += renderActions(!state.obligationTiming) + '</div>';
    }

    if (state.currentStep === 4) {
      html += renderStepIntro("Wat kost de elektrische bestelbus ongeveer excl. btw?", "Dit bedrag gebruiken we voor de KIA-indicatie. EIA rekenen we alleen over onderdelen of opbouw die mogelijk op de Energielijst passen.");
      html += renderEuroInput("aanschafprijs", "Aanschafprijs bus excl. btw", state.busPrice, 10000, 150000, 500, "");
      html += renderActions(false) + '</div>';
    }

    if (state.currentStep === 5) {
      html += renderStepIntro("Zit er energiebesparende techniek of opbouw op de bus?", "Kies een of meer onderdelen. Daarna vragen we alleen de specificaties die nodig zijn voor een indicatie.");
      html += '<div class="check-card-grid">';
      Object.keys(labelMaps.eiaItems).forEach(function (key) {
        html += optionButton("eiaItems", key, labelMaps.eiaItems[key], state.eiaItems.indexOf(key) !== -1, true);
      });
      html += '</div>';
      html += renderEiaDetails();
      html += renderActions(state.eiaItems.length === 0) + '</div>';
    }

    if (state.currentStep === 6) {
      html += renderStepIntro("Heb je in hetzelfde jaar nog andere zakelijke investeringen gedaan?", "KIA wordt berekend over je totale jaarinvestering. Een grove keuze mag, een exact bedrag kan ook.");
      html += '<div class="check-card-grid">';
      Object.keys(labelMaps.otherInvestmentsPreset).forEach(function (key) {
        html += optionButton("otherInvestmentsPreset", key, labelMaps.otherInvestmentsPreset[key], state.otherInvestmentsPreset === key, false);
      });
      html += '</div>';
      if (state.otherInvestmentsPreset === "unknown") {
        html += '<p class="check-card check-card--warning">We rekenen voorlopig met €0 andere investeringen. Laat je totale jaarinvestering controleren.</p>';
      }
      html += renderEuroInput("andere-investeringen", "Exact bedrag andere investeringen excl. btw", state.otherInvestments, 0, 500000, 500, "");
      html += renderActions(!state.otherInvestmentsPreset) + '</div>';
    }

    if (state.currentStep === 7) {
      html += renderStepIntro("Welke rechtsvorm heb je?", "Het belastingtarief bepaalt het indicatieve effect van de aftrekpost.");
      html += '<div class="check-card-grid">';
      Object.keys(labelMaps.legalForm).forEach(function (key) {
        html += optionButton("legalForm", key, labelMaps.legalForm[key], state.legalForm === key, false);
      });
      html += '</div>';
      if (state.legalForm === "ib" || state.legalForm === "unknown") {
        html += '<h4 class="check-subtitle">IB-schijf</h4><div class="check-card-grid">';
        Object.keys(labelMaps.ibBracket).forEach(function (key) {
          html += optionButton("ibBracket", key, labelMaps.ibBracket[key], state.ibBracket === key, false);
        });
        html += '</div>';
      }
      if (state.legalForm === "vpb") {
        html += '<h4 class="check-subtitle">VPB-schijf</h4><div class="check-card-grid">';
        Object.keys(labelMaps.vpbBracket).forEach(function (key) {
          html += optionButton("vpbBracket", key, labelMaps.vpbBracket[key], state.vpbBracket === key, false);
        });
        html += '</div>';
      }
      if (state.legalForm === "unknown") {
        html += '<p class="check-card check-card--warning">We gebruiken IB midden als indicatie. Laat je fiscale positie controleren.</p>';
      }
      html += renderActions(!state.legalForm) + '</div>';
    }

    if (state.currentStep === 8) {
      html += renderResult();
    }

    calculatorRoot.innerHTML = html;
    bindRenderedControls();
  }

  function renderEiaDetails() {
    var html = "";

    if (state.eiaDetails.cooling.selected) {
      html += '<div class="check-detail"><h4>Elektrische koel/vriesinstallatie</h4>';
      html += '<p class="toggle-note">EIA-code 240208 — Elektrische koeling op koel/vries wegtransport.</p>';
      html += '<label class="field__label">Is de bus geïsoleerd voor koel/vriestransport?</label>' + yesNoButtons("cooling", "insulatedVehicle", state.eiaDetails.cooling.insulatedVehicle);
      html += '<label class="field__label">Is de koelinstallatie uitsluitend elektrisch?</label>' + yesNoButtons("cooling", "fullyElectric", state.eiaDetails.cooling.fullyElectric);
      html += '<label class="field__label">Zit er een dieselaggregaat op?</label>' + yesNoButtons("cooling", "hasDieselAggregate", state.eiaDetails.cooling.hasDieselAggregate);
      html += '<label class="field__label">Is het koudemiddel halogeenvrij?</label>' + yesNoButtons("cooling", "halogenFreeRefrigerant", state.eiaDetails.cooling.halogenFreeRefrigerant);
      html += renderEuroInput("cooling-cost", "Kosten koelinstallatie/opbouw excl. btw", state.eiaDetails.cooling.cost || "", 0, 250000, 100, "");
      html += '</div>';
    }

    if (state.eiaDetails.solar.selected) {
      html += '<div class="check-detail"><h4>Zonnepanelen of zonnefolie</h4>';
      html += '<p class="toggle-note">EIA-code 251115 — Zonnepanelen of -folie voor elektriciteitsopwekking op transportmiddelen.</p>';
      html += '<label class="field__label">Gaat het om panelen of folie op de bus zelf?</label>' + yesNoButtons("solar", "mountedOnVehicle", state.eiaDetails.solar.mountedOnVehicle);
      html += renderEuroInput("solar-cost", "Kosten zonnepanelen/folie inclusief eventuele omvormer/accu excl. btw", state.eiaDetails.solar.cost || "", 0, 250000, 100, "");
      html += '</div>';
    }

    if (state.eiaDetails.mirrorCamera.selected) {
      html += '<div class="check-detail"><h4>Spiegelcamera</h4>';
      html += '<p class="toggle-note">EIA-code 241225 — Spiegelcamera.</p>';
      html += '<label class="field__label">Zijn de buitenspiegels vervangen door camera’s?</label>' + yesNoButtons("mirrorCamera", "replacesMirrors", state.eiaDetails.mirrorCamera.replacesMirrors);
      html += '<label class="field__label">Zijn er beeldschermen aan de zijkant in het voertuig?</label>' + yesNoButtons("mirrorCamera", "hasSideScreens", state.eiaDetails.mirrorCamera.hasSideScreens);
      html += renderEuroInput("mirror-camera-cost", "Kosten spiegelcamera-systeem excl. btw", state.eiaDetails.mirrorCamera.cost || "", 0, 250000, 100, "");
      html += '</div>';
    }

    if (state.eiaDetails.tirePressure.selected) {
      html += '<div class="check-detail"><h4>Automatisch bandenspanningregelsysteem</h4>';
      html += '<p class="toggle-note">EIA-code 240906 — Bandenspanningregelsysteem.</p>';
      html += '<label class="field__label">Controleert en corrigeert het systeem automatisch de bandendruk?</label>' + yesNoButtons("tirePressure", "automaticCorrection", state.eiaDetails.tirePressure.automaticCorrection);
      html += '<label class="field__label">Meet het systeem alleen de bandenspanning?</label>' + yesNoButtons("tirePressure", "onlyMonitoring", state.eiaDetails.tirePressure.onlyMonitoring);
      html += renderEuroInput("tire-pressure-cost", "Kosten systeem excl. btw", state.eiaDetails.tirePressure.cost || "", 0, 250000, 100, "");
      html += '</div>';
    }

    if (state.eiaDetails.generic.selected) {
      html += '<div class="check-detail"><h4>Andere energiebesparende voorziening</h4>';
      html += '<label class="field__label">Gaat het om een bestaande of nieuwe bus?</label><div class="check-mini-options" role="group">';
      html += optionButton("generic.newOrExisting", "existing", "Bestaande bus", state.eiaDetails.generic.newOrExisting === "existing", false);
      html += optionButton("generic.newOrExisting", "new", "Nieuwe bus", state.eiaDetails.generic.newOrExisting === "new", false);
      html += '</div>';
      html += renderEuroInput("generic-cost", "Kosten voorziening excl. btw", state.eiaDetails.generic.cost || "", 0, 250000, 100, "");
      html += renderEuroInput("generic-saving", "Verwachte jaarlijkse energiekostenbesparing", state.eiaDetails.generic.annualEnergySavingEuro || "", 0, 250000, 100, "");
      var payback = calculateGenericPayback(state.eiaDetails.generic.cost, state.eiaDetails.generic.annualEnergySavingEuro);
      if (payback) {
        html += '<p class="deadline-badge deadline-badge--' + (payback >= 5 && payback <= 15 ? "positive" : "warning") + '">Terugverdientijd: ' + payback.toFixed(1).replace(".", ",") + ' jaar</p>';
      }
      html += '</div>';
    }

    return html;
  }

  function renderResult() {
    var result = calculateTotalResult(state);
    var eiaStatus = "Geen duidelijk EIA-onderdeel gevonden";
    var eiaPanelClass = "neutral";
    var codes = result.eia.items.map(function (item) { return item.code; });
    var warnings = result.eia.warnings.slice();

    if (result.eia.items.length > 0) {
      var hasWarning = result.eia.items.some(function (item) { return item.statusType === "warning"; });
      eiaStatus = hasWarning ? "EIA-kans, technische check nodig" : "Sterke EIA-kans";
      eiaPanelClass = hasWarning ? "warning" : "positive";
    }

    if (result.deadline.key === "risico_te_laat" && result.eia.items.length > 0) {
      eiaStatus = "Mogelijk gemist voordeel";
      eiaPanelClass = "warning";
      warnings.push("EIA-bedrag niet opgeteld bij direct indicatief voordeel door termijnrisico.");
    }

    if (state.eiaItems.indexOf("none") !== -1 || state.eiaItems.indexOf("unknown") !== -1) {
      warnings.push("Dossiercheck nodig om onderdelen of opbouw te beoordelen.");
    }

    var html = '<div class="check-flow__step" aria-live="polite">';
    html += '<div class="result-total">';
    html += '<p class="result__label">Jouw indicatieve fiscale voordeel</p>';
    html += '<p class="result-total__amount">' + formatEuro(result.totalIndicativeBenefit) + '</p>';
    html += '<p class="section-text">Indicatief belastingeffect: ' + formatEuro(result.totalIndicativeBenefit) + '</p>';
    html += '<p class="toggle-note">Gebaseerd op KIA en mogelijke EIA op onderdelen of opbouw. Geen gegarandeerde uitkomst.</p>';
    html += '</div>';

    html += '<div class="result-grid">';
    html += '<article class="result-panel result-panel--positive"><span class="result-badge">Mogelijk</span><h4>KIA op je elektrische bestelbus</h4><p class="result-panel__amount">Indicatief: ' + formatEuro(result.kia.kiaTaxBenefit) + '</p>';
    html += '<dl><div><dt>Extra KIA-aftrek</dt><dd>' + formatEuro(result.kia.busKiaDeduction) + '</dd></div><div><dt>Geschat belastingeffect</dt><dd>' + formatEuro(result.kia.kiaTaxBenefit) + '</dd></div><div><dt>Totale investering voor KIA</dt><dd>' + formatEuro(result.kia.totalInvestment) + '</dd></div></dl>';
    html += '<p>KIA loopt via je belastingaangifte. Dit is geen directe uitbetaling, maar een mogelijke verlaging van je fiscale winst.</p></article>';

    html += '<article class="result-panel result-panel--' + eiaPanelClass + '"><span class="result-badge">' + eiaStatus + '</span><h4>EIA op onderdelen of opbouw</h4><p class="result-panel__amount">' + (result.deadline.excludesBenefit && result.eia.items.length > 0 ? "Mogelijk gemist: " : "Indicatief: ") + formatEuro(result.eiaTaxBenefit) + '</p>';
    html += '<dl><div><dt>Mogelijke code(s)</dt><dd>' + (codes.length ? codes.map(function (code) { return '<span class="code-badge">' + code + '</span>'; }).join(" ") : "Nog niet gevonden") + '</dd></div><div><dt>Mogelijk EIA-investeringsbedrag</dt><dd>' + formatEuro(result.eia.eligibleInvestment) + '</dd></div><div><dt>EIA-aftrek</dt><dd>40% van ' + formatEuro(result.eia.eligibleInvestment) + ' = ' + formatEuro(result.eia.deduction) + '</dd></div><div><dt>Geschat belastingeffect</dt><dd>' + formatEuro(result.eiaTaxBenefit) + '</dd></div><div><dt>Deadline-status</dt><dd>' + result.deadline.resultText + '</dd></div></dl>';
    html += '<p>EIA geldt niet automatisch voor de hele bus. We rekenen alleen met onderdelen of opbouw die mogelijk op de Energielijst passen.</p>';
    if (state.eiaDetails.cooling.selected) {
      html += '<p class="toggle-note">Niet de hele bestelbus komt hiervoor in aanmerking, alleen de passende koel/vriesvoorziening en bijbehorende onderdelen.</p>';
    }
    html += '</article>';

    html += '<article class="result-panel result-panel--' + result.deadline.type + '"><span class="deadline-badge deadline-badge--' + result.deadline.type + '">' + result.deadline.label + '</span><h4>Termijn voor EIA</h4><p>Voor EIA is de datum van tekenen of bestellen belangrijk. Laat dit controleren voordat voordeel blijft liggen.</p><p class="toggle-note">' + result.deadline.resultText + '</p></article>';

    html += '<article class="result-panel result-panel--neutral"><span class="result-badge">Persoonlijke check</span><h4>Wat kunnen wij voor je doen?</h4><p>We controleren je opdrachtbevestiging, factuur, leasecontract en technische specificaties. Daarna weet je wat je boekhouder of aanvraagdossier nodig heeft.</p></article>';
    html += '</div>';

    if (warnings.length) {
      html += '<div class="check-card check-card--warning"><strong>Aandachtspunten voor je dossier</strong><ul>';
      unique(warnings).forEach(function (warning) {
        html += '<li>' + escapeHtml(warning) + '</li>';
      });
      html += '</ul></div>';
    }

    html += '<div class="lead-cta"><h3>Wil je weten wat je echt kunt benutten?</h3><p>Laat je telefoonnummer of e-mailadres achter. We controleren je elektrische bestelbus, KIA, EIA-onderdelen en termijnen.</p><button type="button" class="btn btn--primary btn--lg" data-action="contact">Laat mijn voordeel controleren</button></div>';
    html += '<div class="check-actions"><button type="button" class="btn btn--secondary btn--lg" data-action="prev">Vorige</button><button type="button" class="btn btn--outline btn--lg" data-action="restart">Opnieuw berekenen</button></div>';
    html += '</div>';

    syncLeadHiddenFields();
    updateHero(result);

    return html;
  }

  function unique(items) {
    return items.filter(function (item, index) {
      return item && items.indexOf(item) === index;
    });
  }

  function bindRenderedControls() {
    calculatorRoot.querySelectorAll("[data-action]").forEach(function (element) {
      element.addEventListener("click", handleAction);
    });

    bindNumberInput("aanschafprijs", function (value) { state.busPrice = value; }, 10000, 150000, "De aanschafprijs");
    bindNumberInput("andere-investeringen", function (value) { state.otherInvestments = value; }, 0, 500000, "Andere investeringen");
    bindNumberInput("cooling-cost", function (value) { state.eiaDetails.cooling.cost = value; }, 0, 250000, "Kosten koelinstallatie");
    bindNumberInput("solar-cost", function (value) { state.eiaDetails.solar.cost = value; }, 0, 250000, "Kosten zonnepanelen of folie");
    bindNumberInput("mirror-camera-cost", function (value) { state.eiaDetails.mirrorCamera.cost = value; }, 0, 250000, "Kosten spiegelcamera");
    bindNumberInput("tire-pressure-cost", function (value) { state.eiaDetails.tirePressure.cost = value; }, 0, 250000, "Kosten bandenspanningregelsysteem");
    bindNumberInput("generic-cost", function (value) { state.eiaDetails.generic.cost = value; }, 0, 250000, "Kosten voorziening");
    bindNumberInput("generic-saving", function (value) { state.eiaDetails.generic.annualEnergySavingEuro = value; }, 0, 250000, "Jaarlijkse energiekostenbesparing");

    var dateInput = document.getElementById("obligation-date");
    if (dateInput) {
      dateInput.addEventListener("input", function () {
        state.obligationDate = dateInput.value.trim();
        syncLeadHiddenFields();
      });
    }
  }

  function bindNumberInput(id, setter, min, max, label) {
    var input = document.getElementById(id);
    if (!input) return;

    input.addEventListener("input", function () {
      var value = validateNumberInput(input, min, max, label, false);
      if (value !== null) setter(value);
      syncLeadHiddenFields();
      updateHero(calculateTotalResult(state));
    });

    input.addEventListener("change", function () {
      var value = validateNumberInput(input, min, max, label, true);
      if (value !== null) setter(value);
      if (id === "generic-cost" || id === "generic-saving") renderStep();
    });
  }

  function validateNumberInput(input, min, max, label, showError) {
    var error = document.getElementById("error-" + input.id);
    var value = Number(input.value || 0);
    var message = "";

    if (!Number.isFinite(value) || value < min || value > max) {
      message = label + " moet tussen " + formatEuro(min) + " en " + formatEuro(max) + " liggen.";
    }

    if (error) error.textContent = showError ? message : "";
    input.setAttribute("aria-invalid", message && showError ? "true" : "false");
    if (input.closest(".field__input-wrap")) {
      input.closest(".field__input-wrap").classList.toggle("field__input-wrap--error", Boolean(message && showError));
    }

    return message ? null : value;
  }

  function handleAction(event) {
    var target = event.currentTarget;
    var action = target.getAttribute("data-action");
    var group = target.getAttribute("data-group");
    var value = target.getAttribute("data-value");

    if (action === "select") {
      setValue(group, value);
      renderStep();
      return;
    }

    if (action === "toggle-multi") {
      toggleEiaItem(value);
      renderStep();
      return;
    }

    if (action === "next") {
      if (state.currentStep < 8) state.currentStep += 1;
      renderStep();
      calculatorRoot.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (action === "prev") {
      if (state.currentStep > 1) state.currentStep -= 1;
      renderStep();
      calculatorRoot.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (action === "restart") {
      state.currentStep = 1;
      renderStep();
      calculatorRoot.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (action === "contact") {
      scrollToContact();
    }
  }

  function setValue(group, value) {
    if (group.indexOf(".") !== -1) {
      var parts = group.split(".");
      var parsedValue = value === "unknown" ? null : value === "true" ? true : value === "false" ? false : value;
      state.eiaDetails[parts[0]][parts[1]] = parsedValue;
      return;
    }

    if (group === "situation") state.situation = value;
    if (group === "busType") {
      state.busType = value;
      if (value === "cooling" && state.eiaItems.indexOf("cooling") === -1) toggleEiaItem("cooling");
    }
    if (group === "obligationTiming") state.obligationTiming = value;
    if (group === "otherInvestmentsPreset") {
      state.otherInvestmentsPreset = value;
      var presetValues = {
        none: 0,
        under25000: 15000,
        between25000And75000: 50000,
        above75000: 100000,
        unknown: 0,
      };
      state.otherInvestments = presetValues[value];
    }
    if (group === "legalForm") {
      state.legalForm = value;
      if (value === "unknown") state.ibBracket = "middle";
    }
    if (group === "ibBracket") state.ibBracket = value;
    if (group === "vpbBracket") state.vpbBracket = value;

    syncLeadHiddenFields();
    updateHero(calculateTotalResult(state));
  }

  function toggleEiaItem(value) {
    if (value === "none" || value === "unknown") {
      state.eiaItems = state.eiaItems.indexOf(value) === -1 ? [value] : [];
    } else {
      state.eiaItems = state.eiaItems.filter(function (item) { return item !== "none" && item !== "unknown"; });
      if (state.eiaItems.indexOf(value) === -1) {
        state.eiaItems.push(value);
      } else {
        state.eiaItems = state.eiaItems.filter(function (item) { return item !== value; });
      }
    }

    Object.keys(state.eiaDetails).forEach(function (key) {
      state.eiaDetails[key].selected = state.eiaItems.indexOf(key) !== -1;
    });

    syncLeadHiddenFields();
  }

  function updateHero(result) {
    var benefit = document.getElementById("hero-benefit");
    var price = document.getElementById("hero-price");

    if (benefit) benefit.textContent = formatEuro(result.totalIndicativeBenefit);
    if (price) price.textContent = "Indicatie bij een bus van " + formatEuro(state.busPrice);
  }

  function syncLeadHiddenFields() {
    var result = calculateTotalResult(state);
    var hiddenWarnings = result.eia.warnings.slice();
    if (result.deadline.excludesBenefit && result.eia.items.length > 0) {
      hiddenWarnings.push("Termijnrisico: EIA-bedrag niet opgeteld bij direct indicatief voordeel.");
    }

    var fields = {
      calculator_situation: labelMaps.situation[state.situation] || "",
      calculator_bus_type: labelMaps.busType[state.busType] || "",
      calculator_obligation_timing: labelMaps.obligationTiming[state.obligationTiming] || "",
      calculator_obligation_date: state.obligationDate || "",
      calculator_bus_price: formatEuro(state.busPrice),
      calculator_other_investments: formatEuro(state.otherInvestments),
      calculator_legal_form: labelMaps.legalForm[state.legalForm] || "",
      calculator_tax_rate: (result.taxRate * 100).toFixed(2).replace(".", ",") + "%",
      calculator_kia_deduction: formatEuro(result.kia.busKiaDeduction),
      calculator_kia_tax_benefit: formatEuro(result.kia.kiaTaxBenefit),
      calculator_eia_codes: result.eia.items.map(function (item) { return item.code + " " + item.label; }).join("; "),
      calculator_eia_eligible_investment: formatEuro(result.eia.eligibleInvestment),
      calculator_eia_deduction: formatEuro(result.eia.deduction),
      calculator_eia_tax_benefit: formatEuro(result.eiaTaxBenefit),
      calculator_eia_deadline_status: result.deadline.key + " - " + result.deadline.resultText,
      calculator_eia_warnings: unique(hiddenWarnings).join("; "),
      calculator_total_indicative_benefit: formatEuro(result.totalIndicativeBenefit),
      calculator_result_summary: "KIA voordeel " + formatEuro(result.kia.kiaTaxBenefit) + ", EIA indicatie " + formatEuro(result.deadline.excludesBenefit ? 0 : result.eiaTaxBenefit) + ", totaal " + formatEuro(result.totalIndicativeBenefit),
    };

    Object.keys(fields).forEach(function (id) {
      var field = document.getElementById(id);
      if (field) field.value = fields[id];
    });

    var contactBusPrice = document.getElementById("aanschafprijs-bus");
    if (contactBusPrice) contactBusPrice.value = formatEuro(state.busPrice);

    window.schonebusCalculator = {
      state: state,
      result: result,
      syncLeadHiddenFields: syncLeadHiddenFields,
      formatEuro: formatEuro,
    };
  }

  function scrollToContact() {
    syncLeadHiddenFields();
    var contact = document.getElementById("contact");
    var nameField = document.getElementById("naam");

    if (contact) contact.scrollIntoView({ behavior: "smooth", block: "start" });
    if (nameField) {
      window.setTimeout(function () {
        nameField.focus();
      }, 450);
    }
  }

  renderStep();
  syncLeadHiddenFields();
  updateHero(calculateTotalResult(state));
})();
