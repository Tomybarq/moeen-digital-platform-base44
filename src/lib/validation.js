/**
 * Input Validation & Sanitization Library
 * Mo'een Platform — Security Layer
 * Prevents XSS, injection, and malformed data entry.
 */

// ── Sanitization ──────────────────────────────────────────────────────────────

/**
 * Strip all HTML tags and dangerous characters to prevent XSS.
 * Returns a clean plain-text string.
 */
export function sanitizeText(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/<[^>]*>/g, "")           // strip HTML tags
    .replace(/javascript:/gi, "")      // strip JS protocol
    .replace(/on\w+\s*=/gi, "")        // strip inline event handlers
    .replace(/[<>'"]/g, (c) => ({      // encode residual dangerous chars
      "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
    }[c]))
    .trim();
}

/**
 * Sanitize and normalize a phone number (Saudi format).
 * Strips spaces, dashes, and non-numeric characters.
 */
export function sanitizePhone(value) {
  if (!value) return "";
  return String(value).replace(/[^0-9+]/g, "").trim();
}

/**
 * Sanitize a national ID — digits only, max 10 chars.
 */
export function sanitizeNationalId(value) {
  if (!value) return "";
  return String(value).replace(/\D/g, "").slice(0, 10);
}

/**
 * Sanitize a notes/free-text field — allow Arabic, English, digits, common punctuation.
 * No HTML, no script injection.
 */
export function sanitizeNotes(value) {
  if (!value) return "";
  return String(value)
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .slice(0, 2000)
    .trim();
}

// ── Validators ────────────────────────────────────────────────────────────────

/** Validates Saudi phone: starts with 05 and is 10 digits. */
export function isValidSaudiPhone(phone) {
  const cleaned = sanitizePhone(phone);
  return /^05\d{8}$/.test(cleaned);
}

/** Validates Saudi National ID: starts with 1 or 2, exactly 10 digits. */
export function isValidNationalId(id) {
  const cleaned = sanitizeNationalId(id);
  return /^[12]\d{9}$/.test(cleaned);
}

/** Validates email address format. */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

/** Validates age is a reasonable number between 1 and 120. */
export function isValidAge(age) {
  const n = Number(age);
  return !isNaN(n) && n >= 1 && n <= 120;
}

/** Validates a required text field is non-empty after sanitization. */
export function isRequiredText(value) {
  return sanitizeText(value).length > 0;
}

// ── Form-level validators ─────────────────────────────────────────────────────

/**
 * Validate the Beneficiary form.
 * Returns { valid: boolean, errors: { field: "message" } }
 */
export function validateBeneficiaryForm(form) {
  const errors = {};

  if (!isRequiredText(form.full_name)) {
    errors.full_name = "الاسم الكامل مطلوب";
  } else if (sanitizeText(form.full_name).length < 3) {
    errors.full_name = "الاسم يجب أن يكون 3 أحرف على الأقل";
  }

  if (form.phone && !isValidSaudiPhone(form.phone)) {
    errors.phone = "رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام";
  } else if (!isRequiredText(form.phone)) {
    errors.phone = "رقم الجوال مطلوب";
  }

  if (form.national_id && !isValidNationalId(form.national_id)) {
    errors.national_id = "رقم الهوية يجب أن يبدأ بـ 1 أو 2 ويتكون من 10 أرقام";
  }

  if (form.age && !isValidAge(form.age)) {
    errors.age = "العمر يجب أن يكون بين 1 و 120";
  }

  if (!isRequiredText(form.city)) {
    errors.city = "المدينة مطلوبة";
  }

  if (!form.case_type) {
    errors.case_type = "نوع الحالة مطلوب";
  }

  if (!form.priority) {
    errors.priority = "الأولوية مطلوبة";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Validate the NGO form.
 */
export function validateNGOForm(form) {
  const errors = {};

  if (!isRequiredText(form.name)) errors.name = "اسم المنظمة مطلوب";
  if (!isRequiredText(form.responsible_person)) errors.responsible_person = "اسم المسؤول مطلوب";
  if (!isRequiredText(form.phone)) {
    errors.phone = "رقم التواصل مطلوب";
  }
  if (form.email && !isValidEmail(form.email)) {
    errors.email = "البريد الإلكتروني غير صحيح";
  }
  if (form.donation_url && !/^https?:\/\/.+/.test(form.donation_url)) {
    errors.donation_url = "رابط التبرع يجب أن يبدأ بـ http:// أو https://";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Validate the Marketer form.
 */
export function validateMarketerForm(form) {
  const errors = {};

  if (!isRequiredText(form.full_name)) errors.full_name = "الاسم الكامل مطلوب";
  if (!isRequiredText(form.phone)) {
    errors.phone = "رقم الجوال مطلوب";
  } else if (!isValidSaudiPhone(form.phone)) {
    errors.phone = "رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام";
  }
  if (form.email && !isValidEmail(form.email)) {
    errors.email = "البريد الإلكتروني غير صحيح";
  }
  if (!isRequiredText(form.ngo_name)) errors.ngo_name = "اسم المنظمة مطلوب";

  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Sanitize an entire form object by applying sanitizeText to all string fields.
 * Safe to call before submitting any form.
 */
export function sanitizeFormData(data) {
  const sanitized = {};
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "string") {
      // Phone and national_id get their own sanitizers
      if (key === "phone") sanitized[key] = sanitizePhone(value);
      else if (key === "national_id") sanitized[key] = sanitizeNationalId(value);
      else if (key === "notes" || key === "description") sanitized[key] = sanitizeNotes(value);
      else sanitized[key] = sanitizeText(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}