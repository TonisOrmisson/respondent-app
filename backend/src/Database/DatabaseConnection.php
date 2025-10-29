<?php

namespace SurveyApp\Database;

use PDO;
use PDOException;

class DatabaseConnection
{
    private PDO $connection;
    
    public function __construct()
    {
        $this->initializeConnection();
        $this->createTables();
    }
    
    private function initializeConnection(): void
    {
        $dbPath = __DIR__ . '/../../storage/database.sqlite';
        $dbDir = dirname($dbPath);
        
        if (!is_dir($dbDir)) {
            mkdir($dbDir, 0755, true);
        }
        
        try {
            $this->connection = new PDO("sqlite:$dbPath");
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new \Exception("Database connection failed: " . $e->getMessage());
        }
    }
    
    private function createTables(): void
    {
        $queries = [
            // Users table
            "CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                phone_number VARCHAR(20) UNIQUE NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )",
            
            // OTP codes table
            "CREATE TABLE IF NOT EXISTS otp_codes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                phone_number VARCHAR(20) NOT NULL,
                code VARCHAR(6) NOT NULL,
                expires_at DATETIME NOT NULL,
                used_at DATETIME NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )",
            
            // User sessions/tokens table
            "CREATE TABLE IF NOT EXISTS user_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                token VARCHAR(255) UNIQUE NOT NULL,
                expires_at DATETIME NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )",
            
            // Surveys table
            "CREATE TABLE IF NOT EXISTS surveys (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                url VARCHAR(500) NOT NULL,
                reward DECIMAL(10,2) DEFAULT 0.00,
                status VARCHAR(20) DEFAULT 'active',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )",
            
            // Survey completions table
            "CREATE TABLE IF NOT EXISTS survey_completions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                survey_id INTEGER NOT NULL,
                completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                reward_earned DECIMAL(10,2) DEFAULT 0.00,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (survey_id) REFERENCES surveys(id),
                UNIQUE(user_id, survey_id)
            )",
            
            // Device tokens for push notifications
            "CREATE TABLE IF NOT EXISTS device_tokens (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                device_token VARCHAR(255) NOT NULL,
                platform VARCHAR(20) DEFAULT 'android',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )"
        ];
        
        foreach ($queries as $query) {
            $this->connection->exec($query);
        }
        
        // Insert sample survey data
        $this->insertSampleData();
    }
    
    private function insertSampleData(): void
    {
        // Check if surveys already exist
        $stmt = $this->connection->query("SELECT COUNT(*) as count FROM surveys");
        $result = $stmt->fetch();
        
        if ($result['count'] == 0) {
            $sampleSurveys = [
                [
                    'title' => 'Customer Satisfaction Survey',
                    'description' => 'Help us improve our services by sharing your feedback',
                    'url' => 'https://forms.gle/example1',
                    'reward' => 5.00
                ],
                [
                    'title' => 'Product Feedback Survey',
                    'description' => 'Tell us about your experience with our latest product',
                    'url' => 'https://forms.gle/example2',
                    'reward' => 10.00
                ],
                [
                    'title' => 'Mobile App Experience',
                    'description' => 'Share your thoughts about our mobile application',
                    'url' => 'https://forms.gle/example3',
                    'reward' => 7.50
                ]
            ];
            
            $stmt = $this->connection->prepare(
                "INSERT INTO surveys (title, description, url, reward) VALUES (?, ?, ?, ?)"
            );
            
            foreach ($sampleSurveys as $survey) {
                $stmt->execute([
                    $survey['title'],
                    $survey['description'],
                    $survey['url'],
                    $survey['reward']
                ]);
            }
        }
    }
    
    public function getConnection(): PDO
    {
        return $this->connection;
    }
}