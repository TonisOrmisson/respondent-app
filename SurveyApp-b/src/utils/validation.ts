export const validatePhoneNumber = (phoneNumber: string): boolean => {
  // Remove all non-digit characters
  const cleanedNumber = phoneNumber.replace(/\D/g, '');
  
  // Check if it's a valid length (10-15 digits)
  return cleanedNumber.length >= 10 && cleanedNumber.length <= 15;
};

export const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format as +1 (XXX) XXX-XXXX for US numbers
  if (cleaned.length === 10) {
    return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // For international numbers, just add + prefix
  return `+${cleaned}`;
};

export const validateOTP = (otp: string): boolean => {
  // OTP should be exactly 6 digits
  return /^\d{6}$/.test(otp);
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};