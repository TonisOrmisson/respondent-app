import { validatePhoneNumber, formatPhoneNumber, validateOTP, isValidEmail } from '../../utils/validation';

describe('validation utils', () => {
  describe('validatePhoneNumber', () => {
    it('should validate correct phone numbers', () => {
      expect(validatePhoneNumber('1234567890')).toBe(true);
      expect(validatePhoneNumber('+1 (555) 123-4567')).toBe(true);
      expect(validatePhoneNumber('555-123-4567')).toBe(true);
      expect(validatePhoneNumber('+44 20 7946 0958')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(validatePhoneNumber('123')).toBe(false);
      expect(validatePhoneNumber('12345678901234567890')).toBe(false);
      expect(validatePhoneNumber('')).toBe(false);
      expect(validatePhoneNumber('abc')).toBe(false);
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format US phone numbers correctly', () => {
      expect(formatPhoneNumber('1234567890')).toBe('+1 (123) 456-7890');
      expect(formatPhoneNumber('555-123-4567')).toBe('+1 (555) 123-4567');
    });

    it('should format international numbers with + prefix', () => {
      expect(formatPhoneNumber('447946000000')).toBe('+447946000000');
      expect(formatPhoneNumber('123456789012')).toBe('+123456789012');
    });
  });

  describe('validateOTP', () => {
    it('should validate correct OTP format', () => {
      expect(validateOTP('123456')).toBe(true);
      expect(validateOTP('000000')).toBe(true);
      expect(validateOTP('999999')).toBe(true);
    });

    it('should reject invalid OTP format', () => {
      expect(validateOTP('12345')).toBe(false);
      expect(validateOTP('1234567')).toBe(false);
      expect(validateOTP('abc123')).toBe(false);
      expect(validateOTP('')).toBe(false);
      expect(validateOTP('12 34 56')).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email formats', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('email+tag@gmail.com')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(isValidEmail('invalid.email')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('user space@domain.com')).toBe(false);
    });
  });
});