export interface AuthResponse {
  token: string;
  user: {
    id: string;
    phoneNumber: string;
  };
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  reward: number;
  url: string;
  status: 'available' | 'completed' | 'expired';
}

export interface ApiError {
  message: string;
  code?: string | number;
}

export interface OTPRequest {
  phoneNumber: string;
}

export interface OTPVerification {
  phoneNumber: string;
  otp: string;
}