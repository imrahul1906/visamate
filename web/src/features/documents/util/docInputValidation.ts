/**
 * docInputValidation.ts
 *
 * Shared, field-level validation helpers for the cover letter builder.
 * Import these wherever you need per-field validation rules.
 *
 * Usage:
 *   import { validators, applyValidation } from "./coverLetterValidation";
 *
 *   // Block non-digit keystrokes on a phone input:
 *   <input onKeyDown={validators.phone.onKeyDown} onChange={...} />
 *
 *   // Validate a value on blur / submit:
 *   const err = validators.phone.validate(value);  // returns string | null
 */

/* ─────────────────────────────────────────────────────────────────────
   Types
──────────────────────────────────────────────────────────────────────── */

export interface FieldValidator {
  /** Returns an error message, or null if the value is valid. */
  validate: (value: string) => string | null;
  /**
   * Optional onKeyDown handler to block invalid characters in real time.
   * Attach directly to <input onKeyDown={...}>.
   */
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  /**
   * Optional onChange handler to sanitise the value as the user types.
   * Returns the cleaned value to pass to your state setter.
   */
  sanitise?: (raw: string) => string;
}

/* ─────────────────────────────────────────────────────────────────────
   Helpers
──────────────────────────────────────────────────────────────────────── */

/** Keys that should always be allowed regardless of validation rule. */
const CONTROL_KEYS = new Set([
  "Backspace", "Delete", "Tab", "Enter", "Escape",
  "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
  "Home", "End",
]);

function isControlKey(e: React.KeyboardEvent): boolean {
  return CONTROL_KEYS.has(e.key) || e.metaKey || e.ctrlKey;
}

/* ─────────────────────────────────────────────────────────────────────
   Individual validators
──────────────────────────────────────────────────────────────────────── */

/**
 * Phone number — Indian mobile / landline format.
 *  • Only digits (and an optional leading +)
 *  • 10 digits required (or 11–13 with country code)
 */
const phone: FieldValidator = {
  validate(value) {
    if (!value) return null; // optional field — no value is fine
    const digits = value.replace(/\D/g, "");
    if (digits.length < 10) return "Phone must have at least 10 digits";
    if (digits.length > 13) return "Phone number is too long";
    return null;
  },
  onKeyDown(e) {
    if (isControlKey(e)) return;
    // Allow +, digits only
    if (!/^[0-9+]$/.test(e.key)) e.preventDefault();
  },
  sanitise(raw) {
    // Strip everything except digits and a leading +
    return raw.replace(/(?!^\+)[^0-9]/g, "");
  },
};

/**
 * Email address — basic RFC-like check.
 */
const email: FieldValidator = {
  validate(value) {
    if (!value) return null;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      return "Enter a valid email address";
    }
    return null;
  },
};

/**
 * Indian passport number — letter + 7 digits (e.g. P1234567).
 * Force upper-case while typing.
 */
const passport: FieldValidator = {
  validate(value) {
    if (!value) return null;
    if (!/^[A-Z][0-9]{7}$/.test(value.toUpperCase())) {
      return "Passport must be 1 letter followed by 7 digits (e.g. P1234567)";
    }
    return null;
  },
  onKeyDown(e) {
    if (isControlKey(e)) return;
    // Allow letters and digits only, max 8 chars
    if (!/^[A-Za-z0-9]$/.test(e.key)) e.preventDefault();
  },
  sanitise(raw) {
    // Strip non-alphanumeric, upper-case, cap at 8 chars
    return raw.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 8);
  },
};

/**
 * Bank balance — positive number, decimals allowed, no letters.
 * e.g. "250000" or "2,50,000" or "1500.50"
 */
const bankBalance: FieldValidator = {
  validate(value) {
    if (!value) return null;
    const numeric = parseFloat(value.replace(/,/g, ""));
    if (isNaN(numeric) || numeric < 0) return "Enter a valid amount";
    return null;
  },
  onKeyDown(e) {
    if (isControlKey(e)) return;
    if (!/^[0-9.,]$/.test(e.key)) e.preventDefault();
  },
  sanitise(raw) {
    return raw.replace(/[^0-9.,]/g, "");
  },
};

/**
 * Generic "text only" — no digits or special characters.
 * Useful for name fields.
 */
const nameOnly: FieldValidator = {
  validate(value) {
    if (!value) return null;
    if (/\d/.test(value)) return "Name should not contain numbers";
    return null;
  },
  onKeyDown(e) {
    if (isControlKey(e)) return;
    if (/\d/.test(e.key)) e.preventDefault();
  },
};

/**
 * Required field — simply checks non-empty (trimmed).
 */
const required: FieldValidator = {
  validate(value) {
    if (!value || !value.trim()) return "This field is required";
    return null;
  },
};

/**
 * Departure city — must be a non-empty string (only letters/spaces/hyphens).
 */
const city: FieldValidator = {
  validate(value) {
    if (!value || !value.trim()) return "Departure city is required";
    if (!/^[A-Za-z\s\-'.]+$/.test(value.trim())) {
      return "City name should contain letters only";
    }
    return null;
  },
};

/* ─────────────────────────────────────────────────────────────────────
   Exported validators map
──────────────────────────────────────────────────────────────────────── */

export const validators = {
  phone,
  email,
  passport,
  bankBalance,
  nameOnly,
  required,
  city,
} as const;

/* ─────────────────────────────────────────────────────────────────────
   Utility: run multiple validators in order, return first error
──────────────────────────────────────────────────────────────────────── */

/**
 * Runs a list of validators in order and returns the first error, or null.
 *
 * @example
 *   const err = applyValidation(value, [validators.required, validators.email]);
 */
export function applyValidation(
  value: string,
  rules: FieldValidator[]
): string | null {
  for (const rule of rules) {
    const err = rule.validate(value);
    if (err) return err;
  }
  return null;
}

/* ─────────────────────────────────────────────────────────────────────
   Utility: validate all contact rows
──────────────────────────────────────────────────────────────────────── */

export interface ContactErrors {
  phone?: string;
  email?: string;
}

/**
 * Validates a single emergency contact row.
 * Returns an object with per-field errors (only fields that are invalid).
 */
export function validateContact(contact: {
  name: string;
  rel: string;
  phone: string;
  email: string;
}): ContactErrors {
  const errs: ContactErrors = {};
  const phoneErr = validators.phone.validate(contact.phone);
  if (phoneErr) errs.phone = phoneErr;
  const emailErr = validators.email.validate(contact.email);
  if (emailErr) errs.email = emailErr;
  return errs;
}

/**
 * Validates all contact rows and returns a flat boolean — true if all valid.
 */
export function areContactsValid(
  contacts: Array<{ name: string; rel: string; phone: string; email: string }>
): boolean {
  return contacts.every((c) => {
    const e = validateContact(c);
    return !e.phone && !e.email;
  });
}
