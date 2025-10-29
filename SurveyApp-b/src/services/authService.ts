import { apiService } from './api';
import { AuthResponse, OTPRequest, OTPVerification } from '../types';

export class AuthService {
  async sendOTP(phoneNumber: string): Promise<void> {
    const payload: OTPRequest = { phoneNumber };
    await apiService.post('/auth/send-otp', payload);
  }

  async verifyOTP(phoneNumber: string, otp: string): Promise<AuthResponse> {
    const payload: OTPVerification = { phoneNumber, otp };
    return await apiService.post<AuthResponse>('/auth/verify-otp', payload);
  }

  async refreshToken(): Promise<AuthResponse> {
    return await apiService.post<AuthResponse>('/auth/refresh');
  }

  async logout(): Promise<void> {
    await apiService.post('/auth/logout');
  }
}

export const authService = new AuthService();