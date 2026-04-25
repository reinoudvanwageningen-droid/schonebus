(function () {
  var contactForm = document.getElementById("contact-form");
  var formSubmitSubject = document.getElementById("formsubmit-subject");
  var formSubmitReplyTo = document.getElementById("formsubmit-replyto");
  var submitButton = contactForm.querySelector('button[type="submit"]');
  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var PHONE_PATTERN = /^(?:\+31|0031|0)[\d\s().-]{8,}$/;

  function setFieldError(fieldId, message) {
    var field = document.getElementById(fieldId);
    var error = document.getElementById("error-" + fieldId);

    error.textContent = message;
    field.setAttribute("aria-invalid", message ? "true" : "false");
    field.closest(".field__input-wrap").classList.toggle("field__input-wrap--error", Boolean(message));
  }

  function clearFieldError(fieldId) {
    setFieldError(fieldId, "");
  }

  function requiredField(fieldId, message) {
    var field = document.getElementById(fieldId);
    var value = field.value.trim();

    if (!value) {
      setFieldError(fieldId, message);
      return false;
    }

    clearFieldError(fieldId);
    return true;
  }

  function validEmail() {
    var email = document.getElementById("email").value.trim();

    if (!email) {
      clearFieldError("email");
      return true;
    }

    if (!EMAIL_PATTERN.test(email)) {
      setFieldError("email", "Vul een geldig emailadres in.");
      return false;
    }

    clearFieldError("email");
    return true;
  }

  function validPhone() {
    var phone = document.getElementById("telefoon").value.trim();

    if (!phone) {
      clearFieldError("telefoon");
      return true;
    }

    if (!PHONE_PATTERN.test(phone) || phone.replace(/\D/g, "").length < 10) {
      setFieldError("telefoon", "Vul een geldig telefoonnummer in.");
      return false;
    }

    clearFieldError("telefoon");
    return true;
  }

  function validContactMethod() {
    var email = document.getElementById("email").value.trim();
    var phone = document.getElementById("telefoon").value.trim();

    if (!email && !phone) {
      setFieldError("email", "Vul je e-mailadres of telefoonnummer in.");
      setFieldError("telefoon", "Vul je e-mailadres of telefoonnummer in.");
      return false;
    }

    return validEmail() && validPhone();
  }

  function focusFirstInvalid() {
    var invalidField = contactForm.querySelector('[aria-invalid="true"]');

    if (invalidField) {
      invalidField.focus();
    }
  }

  ["naam", "bedrijfsnaam", "email", "telefoon"].forEach(function (fieldId) {
    document.getElementById(fieldId).addEventListener("input", function () {
      clearFieldError(fieldId);
      if (fieldId === "email" || fieldId === "telefoon") {
        clearFieldError(fieldId === "email" ? "telefoon" : "email");
      }
    });
  });

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (window.schonebusCalculator && typeof window.schonebusCalculator.syncLeadHiddenFields === "function") {
      window.schonebusCalculator.syncLeadHiddenFields();
    }

    var hasValidName = requiredField("naam", "Vul je naam in.");
    var hasValidCompany = requiredField("bedrijfsnaam", "Vul je bedrijfsnaam in.");
    var hasValidContactMethod = validContactMethod();

    if (!hasValidName || !hasValidCompany || !hasValidContactMethod) {
      focusFirstInvalid();
      return;
    }

    formSubmitSubject.value = "Aanvraag schonebus.nl voor " + document.getElementById("bedrijfsnaam").value.trim();
    formSubmitReplyTo.value = document.getElementById("email").value.trim();
    submitButton.disabled = true;
    submitButton.textContent = "Bezig met verzenden";
    contactForm.submit();
  });
})();
