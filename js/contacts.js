const form = document.querySelector("form");
const fullname = document.getElementById("fullname");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const subject = document.getElementById("subject");
const message = document.getElementById("message");

// ===== Helpers for showing/clearing inline errors =====
function showError(field, text) {
  clearError(field);
  const error = document.createElement("span");
  error.className = "field-error";
  error.textContent = text;
  field.insertAdjacentElement("afterend", error);
  field.setAttribute("aria-invalid", "true");
}

function clearError(field) {
  field.removeAttribute("aria-invalid");
  const next = field.nextElementSibling;
  if (next && next.classList.contains("field-error")) {
    next.remove();
  }
}

// ===== Field validators =====
function validateFullname() {
  if (fullname.value.trim().length < 2) {
    showError(fullname, "Please enter your full name.");
    return false;
  }
  clearError(fullname);
  return true;
}

function validateEmail() {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(email.value.trim())) {
    showError(email, "Please enter a valid email address.");
    return false;
  }
  clearError(email);
  return true;
}

function validatePhone() {
  // Optional field — only validate if the user typed something
  if (phone.value.trim() === "") {
    clearError(phone);
    return true;
  }
  const pattern = /^[+]?[\d\s-]{7,15}$/;
  if (!pattern.test(phone.value.trim())) {
    showError(phone, "Please enter a valid phone number.");
    return false;
  }
  clearError(phone);
  return true;
}

function validateSubject() {
  if (subject.value === "") {
    showError(subject, "Please choose a subject.");
    return false;
  }
  clearError(subject);
  return true;
}

function validateMessage() {
  const len = message.value.trim().length;
  if (len < 50) {
    showError(message, `Message needs at least 50 characters (${len}/50 so far).`);
    return false;
  }
  clearError(message);
  return true;
}

// ===== Live character counter for the message field =====
const counter = document.createElement("small");
counter.className = "char-counter";
message.insertAdjacentElement("afterend", counter);

function updateCounter() {
  const len = message.value.trim().length;
  const remaining = Math.max(0, 50 - len);
  counter.textContent = remaining > 0
    ? `${remaining} more characters needed`
    : `${len} characters — looks good`;
  counter.classList.toggle("char-counter--ok", remaining === 0);
}

// ===== Live feedback as the user types/leaves a field =====
fullname.addEventListener("blur", validateFullname);
email.addEventListener("blur", validateEmail);
phone.addEventListener("blur", validatePhone);
subject.addEventListener("change", validateSubject);
message.addEventListener("input", () => {
  updateCounter();
  if (message.getAttribute("aria-invalid") === "true") {
    validateMessage();
  }
});

updateCounter();

// ===== Submit handling =====
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const validators = [
    validateFullname,
    validateEmail,
    validatePhone,
    validateSubject,
    validateMessage,
  ];

  const allValid = validators
    .map((fn) => fn())
    .every(Boolean);

  if (!allValid) {
    const firstError = form.querySelector('[aria-invalid="true"]');
    if (firstError) firstError.focus();
    return;
  }

  showSuccess();
  form.reset();
  updateCounter();
});

function showSuccess() {
  let banner = form.querySelector(".form-success");
  if (!banner) {
    banner = document.createElement("p");
    banner.className = "form-success";
    banner.setAttribute("role", "status");
    form.prepend(banner);
  }
  banner.textContent = "Thanks! Your message has been sent — I'll get back to you soon.";
}