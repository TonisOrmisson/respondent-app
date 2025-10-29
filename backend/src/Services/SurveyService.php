<?php

namespace SurveyApp\Services;

use SurveyApp\Database\DatabaseConnection;
use PDO;

class SurveyService
{
    private PDO $db;
    
    public function __construct(DatabaseConnection $database)
    {
        $this->db = $database->getConnection();
    }
    
    public function getSurveys(int $userId): array
    {
        // Get surveys that the user hasn't completed yet
        $stmt = $this->db->prepare("
            SELECT s.*, 
                   CASE WHEN sc.id IS NOT NULL THEN 'completed' ELSE 'available' END as status
            FROM surveys s
            LEFT JOIN survey_completions sc ON s.id = sc.survey_id AND sc.user_id = ?
            WHERE s.status = 'active'
            ORDER BY s.created_at DESC
        ");
        $stmt->execute([$userId]);
        
        return $stmt->fetchAll();
    }
    
    public function getSurvey(int $surveyId, int $userId): ?array
    {
        $stmt = $this->db->prepare("
            SELECT s.*, 
                   CASE WHEN sc.id IS NOT NULL THEN 'completed' ELSE 'available' END as status,
                   sc.completed_at,
                   sc.reward_earned
            FROM surveys s
            LEFT JOIN survey_completions sc ON s.id = sc.survey_id AND sc.user_id = ?
            WHERE s.id = ? AND s.status = 'active'
        ");
        $stmt->execute([$userId, $surveyId]);
        
        return $stmt->fetch() ?: null;
    }
    
    public function completeSurvey(int $surveyId, int $userId): array
    {
        // Check if survey exists and is active
        $survey = $this->getSurvey($surveyId, $userId);
        
        if (!$survey) {
            throw new \Exception('Survey not found or inactive');
        }
        
        if ($survey['status'] === 'completed') {
            throw new \Exception('Survey already completed');
        }
        
        // Mark survey as completed
        $stmt = $this->db->prepare("
            INSERT INTO survey_completions (user_id, survey_id, reward_earned) 
            VALUES (?, ?, ?)
        ");
        $stmt->execute([$userId, $surveyId, $survey['reward']]);
        
        return [
            'survey_id' => $surveyId,
            'completed_at' => date('Y-m-d H:i:s'),
            'reward_earned' => $survey['reward'],
            'message' => 'Survey completed successfully!'
        ];
    }
    
    public function createSurvey(array $data): array
    {
        $stmt = $this->db->prepare("
            INSERT INTO surveys (title, description, url, reward) 
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([
            $data['title'],
            $data['description'],
            $data['url'],
            $data['reward'] ?? 0.00
        ]);
        
        $surveyId = $this->db->lastInsertId();
        
        // Return the created survey
        $stmt = $this->db->prepare("SELECT * FROM surveys WHERE id = ?");
        $stmt->execute([$surveyId]);
        
        return $stmt->fetch();
    }
    
    public function getUserStats(int $userId): array
    {
        $stmt = $this->db->prepare("
            SELECT 
                COUNT(*) as surveys_completed,
                COALESCE(SUM(reward_earned), 0) as total_rewards
            FROM survey_completions 
            WHERE user_id = ?
        ");
        $stmt->execute([$userId]);
        
        return $stmt->fetch();
    }
}