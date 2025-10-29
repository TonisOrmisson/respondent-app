<?php

namespace SurveyApp\Handlers;

use SurveyApp\Services\AuthService;
use SurveyApp\Services\OtpService;

class AuthHandler
{
    private AuthService $authService;
    private OtpService $otpService;
    
    public function __construct(AuthService $authService, OtpService $otpService)
    {
        $this->authService = $authService;
        $this->otpService = $otpService;
    }
    
    public function sendOtp(array $params): array
    {
        $phoneNumber = $params['phoneNumber'] ?? null;
        
        if (!$phoneNumber) {
            throw new \InvalidArgumentException('Phone number is required');
        }
        
        // Validate phone number format
        if (!$this->isValidPhoneNumber($phoneNumber)) {
            throw new \InvalidArgumentException('Invalid phone number format');
        }
        
        // Check rate limiting
        if (!$this->otpService->canRequestOtp($phoneNumber)) {
            throw new \Exception('Please wait before requesting another OTP');
        }
        
        // Generate and send OTP
        $otp = $this->otpService->generateOtp($phoneNumber);
        $sent = $this->otpService->sendOtp($phoneNumber, $otp);
        
        if (!$sent) {
            throw new \Exception('Failed to send OTP');
        }
        
        return [
            'success' => true,
            'message' => 'OTP sent successfully',
            'phoneNumber' => $phoneNumber
        ];
    }
    
    public function verifyOtp(array $params): array
    {
        $phoneNumber = $params['phoneNumber'] ?? null;
        $otp = $params['otp'] ?? null;
        
        if (!$phoneNumber || !$otp) {
            throw new \InvalidArgumentException('Phone number and OTP are required');
        }
        
        // Verify OTP
        if (!$this->otpService->verifyOtp($phoneNumber, $otp)) {
            throw new \Exception('Invalid or expired OTP');
        }
        
        // Find or create user
        $user = $this->authService->findOrCreateUser($phoneNumber);
        
        // Create session token
        $token = $this->authService->createSession($user['id']);
        
        return [
            'success' => true,
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'phoneNumber' => $user['phone_number']
            ],
            'message' => 'Authentication successful'
        ];
    }
    
    public function refreshToken(array $params): array
    {
        $token = $this->getAuthToken();
        
        if (!$token) {
            throw new \Exception('Authentication token required');
        }
        
        $newToken = $this->authService->refreshToken($token);
        
        if (!$newToken) {
            throw new \Exception('Invalid or expired token');
        }
        
        $user = $this->authService->getUserFromToken($newToken);
        
        return [
            'success' => true,
            'token' => $newToken,
            'user' => [
                'id' => $user['id'],
                'phoneNumber' => $user['phone_number']
            ]
        ];
    }
    
    public function logout(array $params): array
    {
        $token = $this->getAuthToken();
        
        if ($token) {
            $this->authService->revokeToken($token);
        }
        
        return [
            'success' => true,
            'message' => 'Logged out successfully'
        ];
    }
    
    private function isValidPhoneNumber(string $phoneNumber): bool
    {
        // Remove all non-digit characters
        $cleaned = preg_replace('/\D/', '', $phoneNumber);
        
        // Check if it's a valid length (10-15 digits)
        return strlen($cleaned) >= 10 && strlen($cleaned) <= 15;
    }
    
    private function getAuthToken(): ?string
    {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;
        
        if ($authHeader && strpos($authHeader, 'Bearer ') === 0) {
            return substr($authHeader, 7);
        }
        
        return null;
    }
}