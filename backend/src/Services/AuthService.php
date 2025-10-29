<?php

namespace SurveyApp\Services;

use SurveyApp\Database\DatabaseConnection;
use PDO;

class AuthService
{
    private PDO $db;
    
    public function __construct(DatabaseConnection $database)
    {
        $this->db = $database->getConnection();
    }
    
    public function findOrCreateUser(string $phoneNumber): array
    {
        // Try to find existing user
        $stmt = $this->db->prepare("SELECT * FROM users WHERE phone_number = ?");
        $stmt->execute([$phoneNumber]);
        $user = $stmt->fetch();
        
        if (!$user) {
            // Create new user
            $stmt = $this->db->prepare(
                "INSERT INTO users (phone_number) VALUES (?)"
            );
            $stmt->execute([$phoneNumber]);
            
            $userId = $this->db->lastInsertId();
            
            $user = [
                'id' => $userId,
                'phone_number' => $phoneNumber,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ];
        }
        
        return $user;
    }
    
    public function createSession(int $userId): string
    {
        // Generate unique token
        $token = bin2hex(random_bytes(32));
        $expiresAt = date('Y-m-d H:i:s', strtotime('+30 days'));
        
        // Clean up old sessions for this user
        $stmt = $this->db->prepare("DELETE FROM user_sessions WHERE user_id = ?");
        $stmt->execute([$userId]);
        
        // Create new session
        $stmt = $this->db->prepare(
            "INSERT INTO user_sessions (user_id, token, expires_at) VALUES (?, ?, ?)"
        );
        $stmt->execute([$userId, $token, $expiresAt]);
        
        return $token;
    }
    
    public function validateToken(string $token): ?array
    {
        $stmt = $this->db->prepare("
            SELECT u.*, s.expires_at 
            FROM users u 
            JOIN user_sessions s ON u.id = s.user_id 
            WHERE s.token = ? AND s.expires_at > datetime('now')
        ");
        $stmt->execute([$token]);
        
        return $stmt->fetch() ?: null;
    }
    
    public function refreshToken(string $oldToken): ?string
    {
        $user = $this->validateToken($oldToken);
        
        if (!$user) {
            return null;
        }
        
        // Create new session
        return $this->createSession($user['id']);
    }
    
    public function revokeToken(string $token): bool
    {
        $stmt = $this->db->prepare("DELETE FROM user_sessions WHERE token = ?");
        return $stmt->execute([$token]);
    }
    
    public function getUserFromToken(string $token): ?array
    {
        return $this->validateToken($token);
    }
}