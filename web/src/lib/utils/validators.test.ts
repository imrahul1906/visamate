import { describe, it, expect } from 'vitest';
import { validators, applyValidation, validateContact, areContactsValid } from './validators';
import type React from 'react';

// Helper mock to simulate React KeyboardEvents
function createMockKeyboardEvent(key: string, overrides: Partial<React.KeyboardEvent<HTMLInputElement>> = {}): React.KeyboardEvent<HTMLInputElement> {
  let defaultPrevented = false;
  return {
    key,
    preventDefault: () => { defaultPrevented = true; },
    isDefaultPrevented: () => defaultPrevented,
    metaKey: false,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    ...overrides,
  } as unknown as React.KeyboardEvent<HTMLInputElement>;
}

describe('validators.ts', () => {

  describe('phone validator', () => {
    const { validate, onKeyDown, sanitise } = validators.phone;

    it('should validate correctly', () => {
      // Optional field, so empty values are fine
      expect(validate('')).toBeNull();
      expect(validate(null as any)).toBeNull();

      // 10 digits
      expect(validate('9876543210')).toBeNull();
      // 11 to 13 digits with country code
      expect(validate('919876543210')).toBeNull();
      expect(validate('0919876543210')).toBeNull();

      // Errors
      expect(validate('123456789')).toBe('Phone must have at least 10 digits');
      expect(validate('91987654321098')).toBe('Phone number is too long');
    });

    it('should sanitise correctly', () => {
      if (sanitise) {
        expect(sanitise('+91-98765-43210')).toBe('+919876543210');
        expect(sanitise('abc9876543210xyz')).toBe('9876543210');
        expect(sanitise('98765+43210')).toBe('9876543210'); // Leading only +
      }
    });

    it('should handle onKeyDown correctly', () => {
      if (onKeyDown) {
        // Control key (e.g. Backspace) - should not preventDefault
        const eventBackspace = createMockKeyboardEvent('Backspace');
        onKeyDown(eventBackspace);
        expect(eventBackspace.isDefaultPrevented()).toBe(false);

        // Digits - should not preventDefault
        const eventDigit = createMockKeyboardEvent('5');
        onKeyDown(eventDigit);
        expect(eventDigit.isDefaultPrevented()).toBe(false);

        // Plus - should not preventDefault
        const eventPlus = createMockKeyboardEvent('+');
        onKeyDown(eventPlus);
        expect(eventPlus.isDefaultPrevented()).toBe(false);

        // Letters - should preventDefault
        const eventLetter = createMockKeyboardEvent('a');
        onKeyDown(eventLetter);
        expect(eventLetter.isDefaultPrevented()).toBe(true);
      }
    });
  });

  describe('email validator', () => {
    const { validate } = validators.email;

    it('should validate correctly', () => {
      expect(validate('')).toBeNull();
      expect(validate('test@example.com')).toBeNull();
      expect(validate('user.name+tag@sub.domain.co.in')).toBeNull();

      expect(validate('invalid-email')).toBe('Enter a valid email address');
      expect(validate('test@example')).toBe('Enter a valid email address');
      expect(validate('@example.com')).toBe('Enter a valid email address');
    });
  });

  describe('passport validator', () => {
    const { validate, onKeyDown, sanitise } = validators.passport;

    it('should validate correctly', () => {
      expect(validate('')).toBeNull();
      expect(validate('P1234567')).toBeNull();
      expect(validate('p1234567')).toBeNull(); // case-insensitive check
      expect(validate('PA123456')).toBeNull(); // new ePassport format
      expect(validate('pa123456')).toBeNull(); // case-insensitive ePassport
      expect(validate('AD444444')).toBeNull(); // user example format

      const expectedError = 'Passport must be 8 characters: 1 letter followed by 7 digits, or 2 letters followed by 6 digits (e.g. P1234567 or AD123456)';
      expect(validate('12345678')).toBe(expectedError);
      expect(validate('P123456')).toBe(expectedError);
      expect(validate('P12345678')).toBe(expectedError);
      expect(validate('PA12345')).toBe(expectedError);
    });

    it('should sanitise correctly', () => {
      if (sanitise) {
        expect(sanitise('z1234567')).toBe('Z1234567');
        expect(sanitise('p-123_4567')).toBe('P1234567');
        expect(sanitise('p1234567890')).toBe('P1234567'); // slice to 8 chars
      }
    });

    it('should handle onKeyDown correctly', () => {
      if (onKeyDown) {
        const eventLetter = createMockKeyboardEvent('A');
        onKeyDown(eventLetter);
        expect(eventLetter.isDefaultPrevented()).toBe(false);

        const eventDigit = createMockKeyboardEvent('9');
        onKeyDown(eventDigit);
        expect(eventDigit.isDefaultPrevented()).toBe(false);

        const eventSpecial = createMockKeyboardEvent('-');
        onKeyDown(eventSpecial);
        expect(eventSpecial.isDefaultPrevented()).toBe(true);
      }
    });
  });

  describe('bankBalance validator', () => {
    const { validate, onKeyDown, sanitise } = validators.bankBalance;

    it('should validate correctly', () => {
      expect(validate('')).toBeNull();
      expect(validate('250000')).toBeNull();
      expect(validate('2,50,000')).toBeNull();
      expect(validate('1500.50')).toBeNull();

      expect(validate('-100')).toBe('Enter a valid amount');
      expect(validate('abc')).toBe('Enter a valid amount');
    });

    it('should sanitise correctly', () => {
      if (sanitise) {
        expect(sanitise('250,000.50 abc')).toBe('250,000.50');
      }
    });

    it('should handle onKeyDown correctly', () => {
      if (onKeyDown) {
        const eventComma = createMockKeyboardEvent(',');
        onKeyDown(eventComma);
        expect(eventComma.isDefaultPrevented()).toBe(false);

        const eventDot = createMockKeyboardEvent('.');
        onKeyDown(eventDot);
        expect(eventDot.isDefaultPrevented()).toBe(false);

        const eventLetter = createMockKeyboardEvent('a');
        onKeyDown(eventLetter);
        expect(eventLetter.isDefaultPrevented()).toBe(true);
      }
    });
  });

  describe('nameOnly validator', () => {
    const { validate, onKeyDown } = validators.nameOnly;

    it('should validate correctly', () => {
      expect(validate('')).toBeNull();
      expect(validate('Rahul Kumar')).toBeNull();

      expect(validate('Rahul 123')).toBe('Name should not contain numbers');
    });

    it('should handle onKeyDown correctly', () => {
      if (onKeyDown) {
        const eventLetter = createMockKeyboardEvent('R');
        onKeyDown(eventLetter);
        expect(eventLetter.isDefaultPrevented()).toBe(false);

        const eventDigit = createMockKeyboardEvent('4');
        onKeyDown(eventDigit);
        expect(eventDigit.isDefaultPrevented()).toBe(true);
      }
    });
  });

  describe('required validator', () => {
    const { validate } = validators.required;

    it('should validate correctly', () => {
      expect(validate('hello')).toBeNull();
      expect(validate('  ok  ')).toBeNull();

      expect(validate('')).toBe('This field is required');
      expect(validate('    ')).toBe('This field is required');
    });
  });

  describe('city validator', () => {
    const { validate } = validators.city;

    it('should validate correctly', () => {
      expect(validate('New Delhi')).toBeNull();
      expect(validate('Kolkata-City')).toBeNull();

      expect(validate('')).toBe('Departure city is required');
      expect(validate('   ')).toBe('Departure city is required');
      expect(validate('Delhi 123')).toBe('City name should contain letters only');
      expect(validate('Delhi @#')).toBe('City name should contain letters only');
    });
  });

  describe('applyValidation utility', () => {
    it('should run list of validators in order and return first error', () => {
      const rules = [validators.required, validators.city];

      // Required fails
      expect(applyValidation('', rules)).toBe('This field is required');

      // City fails
      expect(applyValidation('Delhi 123', rules)).toBe('City name should contain letters only');

      // Valid passes
      expect(applyValidation('New Delhi', rules)).toBeNull();
    });
  });

  describe('validateContact and areContactsValid utilities', () => {
    const validContact = {
      name: 'John Doe',
      rel: 'Brother',
      phone: '9876543210',
      email: 'john@example.com'
    };

    const invalidContact = {
      name: 'John Doe',
      rel: 'Brother',
      phone: '123',
      email: 'bad-email'
    };

    it('should validate single contact correctly', () => {
      expect(validateContact(validContact)).toEqual({});
      expect(validateContact(invalidContact)).toEqual({
        phone: 'Phone must have at least 10 digits',
        email: 'Enter a valid email address'
      });
    });

    it('should check list validity correctly', () => {
      expect(areContactsValid([validContact, validContact])).toBe(true);
      expect(areContactsValid([validContact, invalidContact])).toBe(false);
    });
  });

});
