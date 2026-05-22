(function () {
  'use strict';

  var config = {
    companyEmail: 'mgdwarkeshpansuriya@gmail.com',
    whatsappNumber: '+91 79842 63621 ',
    emailSubject: 'New Website Inquiry',
    emailjs: {
      publicKey: 'ukRAhpd6EVsaHl6L-',
      serviceId: 'service_zu8au47',
      templateId: 'template_ck2e4i8'
    }
  };

  var defaultWhatsappMessage = 'Hello, I visited your website and I am interested in your CNC/VMC/Laser Cutting services.';
  var successMessage = 'Thank you for contacting us. Our team will get back to you shortly.';
  var errorMessage = 'Something went wrong. Please try again later.';
  var logPrefix = '[Inquiry]';

  function log() {
    if (!window.console) return;
    console.log.apply(console, [logPrefix].concat(Array.prototype.slice.call(arguments)));
  }

  function logError() {
    if (!window.console) return;
    console.error.apply(console, [logPrefix].concat(Array.prototype.slice.call(arguments)));
  }

  function isEmailJsReady() {
    return window.emailjs &&
      Boolean(config.emailjs.publicKey) &&
      Boolean(config.emailjs.serviceId) &&
      Boolean(config.emailjs.templateId);
  }

  function encode(value) {
    return encodeURIComponent(value);
  }

  function normalizeSpace(value) {
    return (value || '').replace(/\s+/g, ' ').trim();
  }

  function getField(form, name) {
    return form.querySelector('[name="' + name + '"]');
  }

  function getValue(form, name) {
    var field = getField(form, name);
    return field ? field.value.trim() : '';
  }

  function ensureFeedback(field) {
    var next = field.nextElementSibling;
    if (next && next.classList.contains('inquiry-field-feedback')) return next;

    var feedback = document.createElement('div');
    feedback.className = 'inquiry-field-feedback';
    feedback.setAttribute('aria-live', 'polite');
    field.insertAdjacentElement('afterend', feedback);
    return feedback;
  }

  function setFieldError(field, message) {
    if (!field) return;
    field.classList.add('is-invalid');
    field.setAttribute('aria-invalid', 'true');
    ensureFeedback(field).textContent = message;
  }

  function clearFieldError(field) {
    if (!field) return;
    field.classList.remove('is-invalid');
    field.removeAttribute('aria-invalid');
    ensureFeedback(field).textContent = '';
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function isValidPhone(phone) {
    return /^[+]?[0-9\s().-]{7,18}$/.test(phone);
  }

  function validateForm(form) {
    var fields = {
      name: getField(form, 'name'),
      phone: getField(form, 'phone'),
      email: getField(form, 'email'),
      message: getField(form, 'message')
    };
    var isValid = true;

    Object.keys(fields).forEach(function (key) {
      clearFieldError(fields[key]);
    });

    if (!normalizeSpace(getValue(form, 'name'))) {
      setFieldError(fields.name, 'Please enter your name.');
      isValid = false;
    }

    var phone = normalizeSpace(getValue(form, 'phone'));
    if (!phone) {
      setFieldError(fields.phone, 'Please enter your phone number.');
      isValid = false;
    } else if (!isValidPhone(phone)) {
      setFieldError(fields.phone, 'Please enter a valid phone number.');
      isValid = false;
    }

    var email = normalizeSpace(getValue(form, 'email'));
    if (!email) {
      setFieldError(fields.email, 'Please enter your email address.');
      isValid = false;
    } else if (!isValidEmail(email)) {
      setFieldError(fields.email, 'Please enter a valid email address.');
      isValid = false;
    }

    if (!normalizeSpace(getValue(form, 'message'))) {
      setFieldError(fields.message, 'Please enter your inquiry message.');
      isValid = false;
    }

    return isValid;
  }

  function getFormData(form) {
    return {
      name: normalizeSpace(getValue(form, 'name')),
      phone: normalizeSpace(getValue(form, 'phone')),
      email: normalizeSpace(getValue(form, 'email')),
      company: normalizeSpace(getValue(form, 'company')),
      message: getValue(form, 'message').trim()
    };
  }

  function buildEmailBody(data) {
    return [
      'Name: ' + data.name,
      '',
      'Phone: ' + data.phone,
      '',
      'Email: ' + data.email,
      data.company ? '\nCompany: ' + data.company : '',
      '',
      'Message:',
      data.message
    ].filter(Boolean).join('\n');
  }

  function buildWhatsappMessage(data) {
    if (!data || (!data.name && !data.message)) return defaultWhatsappMessage;

    return [
      defaultWhatsappMessage,
      '',
      'Name: ' + data.name,
      'Phone: ' + data.phone,
      'Email: ' + data.email,
      data.company ? 'Company: ' + data.company : '',
      '',
      'Message:',
      data.message
    ].filter(Boolean).join('\n');
  }

  function whatsappUrl(message) {
    var number = config.whatsappNumber.replace(/\D/g, '');
    return 'https://wa.me/' + number + '?text=' + encode(message || defaultWhatsappMessage);
  }

  function updateWhatsappLinks() {
    document.querySelectorAll('a[href*="wa.me"]').forEach(function (link) {
      link.href = whatsappUrl(defaultWhatsappMessage);
    });
  }

  function ensureStatus(form) {
    var status = form.querySelector('.inquiry-status');
    if (status) return status;

    status = document.createElement('div');
    status.className = 'inquiry-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    form.appendChild(status);
    return status;
  }

  function showStatus(form, type, message) {
    var status = ensureStatus(form);
    var icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
    status.className = 'inquiry-status inquiry-status--' + type + ' is-visible';
    status.innerHTML = '<i class="fa-solid ' + icon + '" aria-hidden="true"></i><span>' + message + '</span>';
  }

  function setLoading(form, loading) {
    var button = form.querySelector('button[type="submit"]');
    if (!button) return;

    if (!button.dataset.originalText) button.dataset.originalText = button.innerHTML;
    button.disabled = loading;
    button.innerHTML = loading
      ? '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Sending Inquiry...'
      : button.dataset.originalText;
  }

  function sendEmail(data) {
    if (isEmailJsReady()) {
      var templateParams = {
        subject: config.emailSubject,
        from_name: data.name,
        from_email: data.email,
        reply_to: data.email,
        name: data.name,
        phone: data.phone,
        email: data.email,
        company: data.company,
        message: data.message,
        to_email: config.companyEmail
      };

      log('Sending EmailJS inquiry', {
        serviceId: config.emailjs.serviceId,
        templateId: config.emailjs.templateId,
        templateParams: templateParams
      });

      return window.emailjs.send(config.emailjs.serviceId, config.emailjs.templateId, templateParams);
    }

    logError('EmailJS is not ready. Opening mail client fallback.');
    window.location.href = 'mailto:' + config.companyEmail +
      '?subject=' + encode(config.emailSubject) +
      '&body=' + encode(buildEmailBody(data));

    return Promise.resolve();
  }

  function initEmailJs(hasForms) {
    if (isEmailJsReady()) {
      window.emailjs.init(config.emailjs.publicKey);
      log('EmailJS initialized successfully', {
        publicKey: config.emailjs.publicKey,
        serviceId: config.emailjs.serviceId,
        templateId: config.emailjs.templateId
      });
    } else if (hasForms) {
      logError('EmailJS not initialized. Check CDN load and credentials.', {
        hasEmailJs: Boolean(window.emailjs),
        publicKey: config.emailjs.publicKey,
        serviceId: config.emailjs.serviceId,
        templateId: config.emailjs.templateId
      });
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    var form = event.currentTarget;
    log('Form submit captured', form);
    if (!validateForm(form)) {
      var firstInvalid = form.querySelector('.is-invalid');
      logError('Form validation failed', {
        name: getValue(form, 'name'),
        phone: getValue(form, 'phone'),
        email: getValue(form, 'email'),
        hasMessage: Boolean(getValue(form, 'message'))
      });
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    var data = getFormData(form);
    log('Form validation passed', data);
    setLoading(form, true);

    sendEmail(data)
      .then(function (response) {
        log('EmailJS success response', response);
        showStatus(form, 'success', successMessage);
        form.reset();
        window.open(whatsappUrl(buildWhatsappMessage(data)), '_blank', 'noopener,noreferrer');
      })
      .catch(function (error) {
        logError('EmailJS error response', error);
        showStatus(form, 'error', errorMessage);
      })
      .finally(function () {
        setLoading(form, false);
      });
  }

  function bindForms() {
    var forms = document.querySelectorAll('form.contact-form');
    log('Contact forms found', forms.length);
    forms.forEach(function (form) {
      form.addEventListener('submit', handleSubmit);
      form.querySelectorAll('input, textarea').forEach(function (field) {
        field.addEventListener('input', function () {
          clearFieldError(field);
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var hasForms = Boolean(document.querySelector('form.contact-form'));
    initEmailJs(hasForms);
    updateWhatsappLinks();
    bindForms();
  });
})();
