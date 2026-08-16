/**
 * HARSH BAJPAI — CONTACT FORM & EMAILJS INTEGRATION
 * Form validation, EmailJS submission handler with customizable credentials,
 * status alerts, and floating toast notifications.
 */

(function () {
  'use strict';

  /**
   * =========================================================================
   * EMAILJS CONFIGURATION PLACEHOLDERS
   * Replace these 3 variables with your credentials from https://emailjs.com
   * =========================================================================
   */
  const EMAILJS_CONFIG = {
    PUBLIC_KEY: "YOUR_PUBLIC_KEY",     // e.g. "user_xxxxxxxxxxxxxx"
    SERVICE_ID: "YOUR_SERVICE_ID",     // e.g. "service_xxxxxxx"
    TEMPLATE_ID: "YOUR_TEMPLATE_ID"    // e.g. "template_xxxxxxx"
  };

  // Initialize EmailJS if public key is provided and not default placeholder
  let isEmailJSReady = false;
  if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.PUBLIC_KEY && EMAILJS_CONFIG.PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
    try {
      emailjs.init({ publicKey: EMAILJS_CONFIG.PUBLIC_KEY });
      isEmailJSReady = true;
    } catch (e) {
      console.warn('EmailJS initialization failed:', e);
    }
  }

  // DOM Elements
  const form = document.getElementById('portfolio-contact-form');
  const nameInput = document.getElementById('user_name');
  const emailInput = document.getElementById('user_email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');
  const submitBtn = document.getElementById('contact-submit-btn');
  const statusAlert = document.getElementById('form-status-alert');
  const toastContainer = document.getElementById('toast-container');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  if (!form) return;

  // Toast Notification Helper
  function showToast(message, type = 'success') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast-message toast-${type}`;
    
    const icon = type === 'success' 
      ? '<i class="fa-solid fa-circle-check text-emerald"></i>' 
      : '<i class="fa-solid fa-circle-exclamation text-rose"></i>';

    toast.innerHTML = `${icon} <span>${message}</span>`;
    toastContainer.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto remove after 4.5s
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }

  // Email Format Regex
  function isValidEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase().trim());
  }

  // Validation Logic
  function validateForm() {
    let isValid = true;

    // Reset error messages
    nameError.textContent = '';
    emailError.textContent = '';
    messageError.textContent = '';

    // Validate Name
    if (!nameInput.value.trim()) {
      nameError.textContent = 'Please enter your name.';
      isValid = false;
    } else if (nameInput.value.trim().length < 2) {
      nameError.textContent = 'Name must be at least 2 characters.';
      isValid = false;
    }

    // Validate Email
    if (!emailInput.value.trim()) {
      emailError.textContent = 'Please enter your email address.';
      isValid = false;
    } else if (!isValidEmail(emailInput.value)) {
      emailError.textContent = 'Please enter a valid email address.';
      isValid = false;
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      messageError.textContent = 'Please write your message.';
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      messageError.textContent = 'Message must be at least 10 characters long.';
      isValid = false;
    }

    return isValid;
  }

  // Live input cleaning on focus/input
  [nameInput, emailInput, messageInput].forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        const errEl = document.getElementById(`${input.name.replace('user_', '')}-error`);
        if (errEl) errEl.textContent = '';
        if (statusAlert) statusAlert.hidden = true;
      });
    }
  });

  // Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Please fix the errors in the form.', 'error');
      return;
    }

    // Prepare UI for submission state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    if (statusAlert) statusAlert.hidden = true;

    const templateParams = {
      user_name: nameInput.value.trim(),
      user_email: emailInput.value.trim(),
      subject: subjectInput.value.trim() || 'General Inquiry from Portfolio',
      message: messageInput.value.trim()
    };

    // Check if EmailJS is fully configured by the user
    if (isEmailJSReady && EMAILJS_CONFIG.SERVICE_ID !== "YOUR_SERVICE_ID") {
      try {
        await emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_ID,
          templateParams
        );

        // Success
        form.reset();
        showToast('Thank you Harsh! Your message has been sent successfully.', 'success');
        if (statusAlert) {
          statusAlert.className = 'form-alert success';
          statusAlert.innerHTML = '<i class="fa-solid fa-circle-check"></i> Message sent successfully! Harsh will reply shortly.';
          statusAlert.hidden = false;
        }
      } catch (error) {
        console.error('EmailJS Send Error:', error);
        showToast('Failed to send message via EmailJS. Please message on WhatsApp directly.', 'error');
        if (statusAlert) {
          statusAlert.className = 'form-alert error';
          statusAlert.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Error sending message. Please use WhatsApp for instant communication.';
          statusAlert.hidden = false;
        }
      } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
      }
    } else {
      // Demo / Placeholder mode: Simulate a successful dispatch with informative guidance
      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;

        form.reset();
        showToast('Demo Mode: Message recorded! (Configure EmailJS credentials in js/contact.js to send live emails).', 'success');

        if (statusAlert) {
          statusAlert.className = 'form-alert success';
          statusAlert.innerHTML = '<i class="fa-solid fa-info-circle"></i> <strong>Demo Dispatch Simulated:</strong> Ready for live email forwarding once you insert your EmailJS Keys in <code>js/contact.js</code>!';
          statusAlert.hidden = false;
        }
      }, 1000);
    }
  });

})();
