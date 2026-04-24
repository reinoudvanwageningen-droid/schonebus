(function () {
  var contactForm = document.getElementById("contact-form");
  var formSubmitSubject = document.getElementById("formsubmit-subject");
  var formSubmitReplyTo = document.getElementById("formsubmit-replyto");
  var submitButton = contactForm.querySelector('button[type="submit"]');

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
      setFieldError("email", "Vul je emailadres in.");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError("email", "Vul een geldig emailadres in.");
      return false;
    }

    clearFieldError("email");
    return true;
  }

  function focusFirstInvalid() {
    var invalidField = contactForm.querySelector('[aria-invalid="true"]');

    if (invalidField) {
      invalidField.focus();
    }
  }

  ["naam", "bedrijfsnaam", "email"].forEach(function (fieldId) {
    document.getElementById(fieldId).addEventListener("input", function () {
      clearFieldError(fieldId);
    });
  });

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var hasValidName = requiredField("naam", "Vul je naam in.");
    var hasValidCompany = requiredField("bedrijfsnaam", "Vul je bedrijfsnaam in.");
    var hasValidEmail = validEmail();

    if (!hasValidName || !hasValidCompany || !hasValidEmail) {
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
