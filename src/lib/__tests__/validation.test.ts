import {
  sanitizeString,
  validateEmail,
  validatePhone,
  validateAccountName,
  validateAccountNumber,
  validateBankName,
  validateDriveLink,
  validateFileSize,
  validateImageType,
} from '../validation';

describe('Validation Utilities', () => {
  describe('sanitizeString', () => {
    it('should trim whitespace', () => {
      expect(sanitizeString('  hello  ')).toBe('hello');
    });

    it('should remove angle brackets', () => {
      expect(sanitizeString('<script>alert("xss")</script>')).toBe(
        'scriptalert("xss")/script'
      );
    });

    it('should limit string length to 500', () => {
      const longString = 'a'.repeat(600);
      expect(sanitizeString(longString).length).toBe(500);
    });

    it('should return empty string for undefined', () => {
      expect(sanitizeString(undefined)).toBe('');
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });

    it('should reject invalid email format', () => {
      expect(validateEmail('not-an-email')).toBe(false);
    });

    it('should reject empty email', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail(undefined)).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('should validate correct phone number', () => {
      expect(validatePhone('+234 803 123 4567')).toBe(true);
    });

    it('should validate phone with dashes', () => {
      expect(validatePhone('234-803-1234')).toBe(true);
    });

    it('should reject too short number', () => {
      expect(validatePhone('123')).toBe(false);
    });

    it('should reject empty phone', () => {
      expect(validatePhone('')).toBe(false);
    });
  });

  describe('validateAccountName', () => {
    it('should validate valid account name', () => {
      expect(validateAccountName('John Doe')).toBe(true);
      expect(validateAccountName('Mary-Jane')).toBe(true);
    });

    it('should reject invalid characters', () => {
      expect(validateAccountName('John123')).toBe(false);
      expect(validateAccountName('john@example')).toBe(false);
    });

    it('should reject too short name', () => {
      expect(validateAccountName('J')).toBe(false);
    });
  });

  describe('validateAccountNumber', () => {
    it('should validate correct account number', () => {
      expect(validateAccountNumber('1234567890')).toBe(true);
    });

    it('should accept account number with dashes', () => {
      expect(validateAccountNumber('1234-5678-90')).toBe(true);
    });

    it('should reject too short account', () => {
      expect(validateAccountNumber('1234567')).toBe(false);
    });

    it('should reject with letters', () => {
      expect(validateAccountNumber('123ABC456')).toBe(false);
    });
  });

  describe('validateBankName', () => {
    it('should validate valid bank name', () => {
      expect(validateBankName('First Bank')).toBe(true);
      expect(validateBankName('GTBank')).toBe(true);
    });

    it('should reject too short name', () => {
      expect(validateBankName('A')).toBe(false);
    });

    it('should reject too long name', () => {
      const longName = 'a'.repeat(101);
      expect(validateBankName(longName)).toBe(false);
    });
  });

  describe('validateDriveLink', () => {
    it('should validate Google Drive link', () => {
      expect(
        validateDriveLink(
          'https://drive.google.com/file/d/1abc123/view?usp=sharing'
        )
      ).toBe(true);
    });

    it('should validate Google Docs link', () => {
      expect(
        validateDriveLink(
          'https://docs.google.com/document/d/1abc123/edit'
        )
      ).toBe(true);
    });

    it('should reject non-Google links', () => {
      expect(validateDriveLink('https://dropbox.com/file')).toBe(false);
    });

    it('should reject invalid URLs', () => {
      expect(validateDriveLink('not-a-url')).toBe(false);
    });
  });

  describe('validateFileSize', () => {
    it('should validate small file', () => {
      expect(validateFileSize(1024 * 1024, 10)).toBe(true); // 1MB, max 10MB
    });

    it('should reject oversized file', () => {
      expect(validateFileSize(15 * 1024 * 1024, 10)).toBe(false); // 15MB, max 10MB
    });

    it('should validate with custom max size', () => {
      expect(validateFileSize(5 * 1024 * 1024, 5)).toBe(true); // 5MB, max 5MB
      expect(validateFileSize(6 * 1024 * 1024, 5)).toBe(false); // 6MB, max 5MB
    });
  });

  describe('validateImageType', () => {
    it('should validate supported image types', () => {
      expect(validateImageType('image/jpeg')).toBe(true);
      expect(validateImageType('image/png')).toBe(true);
      expect(validateImageType('image/webp')).toBe(true);
      expect(validateImageType('image/gif')).toBe(true);
    });

    it('should reject unsupported types', () => {
      expect(validateImageType('image/svg+xml')).toBe(false);
      expect(validateImageType('video/mp4')).toBe(false);
      expect(validateImageType('text/plain')).toBe(false);
    });
  });
});
