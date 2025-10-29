<?php

namespace SurveyApp\Handlers;

use SurveyApp\Database\DatabaseConnection;
use PDO;

class NotificationHandler
{
    private PDO $db;
    
    public function __construct(DatabaseConnection $database)
    {
        $this->db = $database->getConnection();
    }
    
    public function registerDevice(array $params): array
    {
        $deviceToken = $params['deviceToken'] ?? null;
        $platform = $params['platform'] ?? 'android';
        
        if (!$deviceToken) {
            throw new \InvalidArgumentException('Device token is required');
        }
        
        $user = $this->getAuthenticatedUser();
        
        // Check if token already exists for this user
        $stmt = $this->db->prepare(
            "SELECT id FROM device_tokens WHERE user_id = ? AND device_token = ?"
        );
        $stmt->execute([$user['id'], $deviceToken]);
        
        if ($stmt->fetch()) {
            // Update existing token
            $stmt = $this->db->prepare(
                "UPDATE device_tokens SET platform = ?, updated_at = datetime('now') 
                 WHERE user_id = ? AND device_token = ?"
            );
            $stmt->execute([$platform, $user['id'], $deviceToken]);
        } else {
            // Insert new token
            $stmt = $this->db->prepare(
                "INSERT INTO device_tokens (user_id, device_token, platform) VALUES (?, ?, ?)"
            );
            $stmt->execute([$user['id'], $deviceToken, $platform]);
        }
        
        return [
            'success' => true,
            'message' => 'Device registered for notifications',
            'deviceToken' => $deviceToken
        ];
    }
    
    public function sendNotification(array $params): array
    {
        $userId = $params['userId'] ?? null;
        $title = $params['title'] ?? 'New Survey Available';
        $body = $params['body'] ?? 'A new survey is available for you to complete.';
        $data = $params['data'] ?? [];
        
        if (!$userId) {
            throw new \InvalidArgumentException('User ID is required');
        }
        
        // Get device tokens for the user
        $stmt = $this->db->prepare(
            "SELECT device_token, platform FROM device_tokens WHERE user_id = ?"
        );
        $stmt->execute([$userId]);
        $devices = $stmt->fetchAll();
        
        if (empty($devices)) {
            throw new \Exception('No devices registered for this user');
        }
        
        $sentCount = 0;
        $errors = [];
        
        foreach ($devices as $device) {
            try {
                $sent = $this->sendPushNotification(
                    $device['device_token'],
                    $title,
                    $body,
                    $data,
                    $device['platform']
                );
                
                if ($sent) {
                    $sentCount++;
                }
            } catch (\Exception $e) {
                $errors[] = $e->getMessage();
            }
        }
        
        return [
            'success' => $sentCount > 0,
            'sent_to_devices' => $sentCount,
            'total_devices' => count($devices),
            'errors' => $errors
        ];
    }
    
    public function broadcastNotification(array $params): array
    {
        $title = $params['title'] ?? 'New Survey Available';
        $body = $params['body'] ?? 'A new survey is available for you to complete.';
        $data = $params['data'] ?? [];
        
        // Get all active device tokens
        $stmt = $this->db->query("SELECT device_token, platform FROM device_tokens");
        $devices = $stmt->fetchAll();
        
        if (empty($devices)) {
            throw new \Exception('No devices registered');
        }
        
        $sentCount = 0;
        $errors = [];
        
        foreach ($devices as $device) {
            try {
                $sent = $this->sendPushNotification(
                    $device['device_token'],
                    $title,
                    $body,
                    $data,
                    $device['platform']
                );
                
                if ($sent) {
                    $sentCount++;
                }
            } catch (\Exception $e) {
                $errors[] = $e->getMessage();
            }
        }
        
        return [
            'success' => $sentCount > 0,
            'sent_to_devices' => $sentCount,
            'total_devices' => count($devices),
            'errors' => $errors
        ];
    }
    
    private function sendPushNotification(
        string $deviceToken,
        string $title,
        string $body,
        array $data,
        string $platform
    ): bool {
        // In a real implementation, integrate with Firebase Cloud Messaging
        // For development, we'll just log the notification
        error_log("Push notification to {$platform} device {$deviceToken}: {$title} - {$body}");
        
        // For demo purposes, always return true
        // In production, return the actual FCM sending result
        return true;
    }
    
    private function getAuthenticatedUser(): array
    {
        $token = $this->getAuthToken();
        
        if (!$token) {
            throw new \Exception('Authentication required');
        }
        
        // This is simplified - in a real implementation, inject AuthService
        $stmt = $this->db->prepare("
            SELECT u.* 
            FROM users u 
            JOIN user_sessions s ON u.id = s.user_id 
            WHERE s.token = ? AND s.expires_at > datetime('now')
        ");
        $stmt->execute([$token]);
        $user = $stmt->fetch();
        
        if (!$user) {
            throw new \Exception('Invalid or expired token');
        }
        
        return $user;
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