<?php

namespace SurveyApp\Services;

use SurveyApp\Database\DatabaseConnection;
use PDO;

class OtpService
{
    private PDO $db;
    
    public function __construct(?DatabaseConnection $database = null)
    {
        if ($database) {
            $this->db = $database->getConnection();
        }
    }
    
    public function setDatabase(DatabaseConnection $database): void
    {
        $this->db = $database->getConnection();
    }
    
    public function generateOtp(string $phoneNumber): string
    {
        // Generate 6-digit OTP
        $otp = sprintf('%06d', random_int(100000, 999999));
        $expiresAt = date('Y-m-d H:i:s', strtotime('+10 minutes'));
        
        // Clean up old OTPs for this phone number
        $stmt = $this->db->prepare(
            "DELETE FROM otp_codes WHERE phone_number = ? AND used_at IS NULL"
        );
        $stmt->execute([$phoneNumber]);
        
        // Store new OTP
        $stmt = $this->db->prepare(
            "INSERT INTO otp_codes (phone_number, code, expires_at) VALUES (?, ?, ?)"
        );
        $stmt->execute([$phoneNumber, $otp, $expiresAt]);
        
        return $otp;
    }
    
    public function verifyOtp(string $phoneNumber, string $code): bool
    {
        $stmt = $this->db->prepare("
            SELECT * FROM otp_codes 
            WHERE phone_number = ? 
            AND code = ? 
            AND expires_at > datetime('now') 
            AND used_at IS NULL
        ");
        $stmt->execute([$phoneNumber, $code]);
        $otpRecord = $stmt->fetch();
        
        if (!$otpRecord) {
            return false;
        }
        
        // Mark OTP as used
        $stmt = $this->db->prepare(
            "UPDATE otp_codes SET used_at = datetime('now') WHERE id = ?"
        );
        $stmt->execute([$otpRecord['id']]);
        
        return true;
    }
    
    public function sendOtp(string $phoneNumber, string $otp): bool
    {
        // In a real implementation, integrate with SMS service like Twilio
        // For development, we'll just log the OTP
        error_log("OTP for {$phoneNumber}: {$otp}");
        
        // For demo purposes, always return true
        // In production, return the actual SMS sending result
        return true;
    }
    
    public function canRequestOtp(string $phoneNumber): bool
    {
        // Check if there's a recent OTP request (rate limiting)
        $stmt = $this->db->prepare("
            SELECT COUNT(*) as count 
            FROM otp_codes 
            WHERE phone_number = ? 
            AND created_at > datetime('now', '-1 minute')
        ");
        $stmt->execute([$phoneNumber]);
        $result = $stmt->fetch();
        
        return $result['count'] == 0;
    }
}