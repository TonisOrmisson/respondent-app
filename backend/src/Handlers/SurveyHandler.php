<?php

namespace SurveyApp\Handlers;

use SurveyApp\Services\SurveyService;
use SurveyApp\Services\AuthService;

class SurveyHandler
{
    private SurveyService $surveyService;
    private AuthService $authService;
    
    public function __construct(SurveyService $surveyService, AuthService $authService)
    {
        $this->surveyService = $surveyService;
        $this->authService = $authService;
    }
    
    public function getSurveys(array $params): array
    {
        $user = $this->getAuthenticatedUser();
        $surveys = $this->surveyService->getSurveys($user['id']);
        
        return [
            'success' => true,
            'surveys' => $surveys,
            'count' => count($surveys)
        ];
    }
    
    public function getSurvey(array $params): array
    {
        $surveyId = $params['id'] ?? null;
        
        if (!$surveyId) {
            throw new \InvalidArgumentException('Survey ID is required');
        }
        
        $user = $this->getAuthenticatedUser();
        $survey = $this->surveyService->getSurvey($surveyId, $user['id']);
        
        if (!$survey) {
            throw new \Exception('Survey not found');
        }
        
        return [
            'success' => true,
            'survey' => $survey
        ];
    }
    
    public function completeSurvey(array $params): array
    {
        $surveyId = $params['surveyId'] ?? null;
        
        if (!$surveyId) {
            throw new \InvalidArgumentException('Survey ID is required');
        }
        
        $user = $this->getAuthenticatedUser();
        $result = $this->surveyService->completeSurvey($surveyId, $user['id']);
        
        return [
            'success' => true,
            'completion' => $result
        ];
    }
    
    public function createSurvey(array $params): array
    {
        // Only allow creating surveys if user is admin (for future implementation)
        $user = $this->getAuthenticatedUser();
        
        $requiredFields = ['title', 'description', 'url'];
        foreach ($requiredFields as $field) {
            if (empty($params[$field])) {
                throw new \InvalidArgumentException("Field '{$field}' is required");
            }
        }
        
        // Validate URL
        if (!filter_var($params['url'], FILTER_VALIDATE_URL)) {
            throw new \InvalidArgumentException('Invalid URL format');
        }
        
        $survey = $this->surveyService->createSurvey($params);
        
        return [
            'success' => true,
            'survey' => $survey,
            'message' => 'Survey created successfully'
        ];
    }
    
    public function getUserStats(array $params): array
    {
        $user = $this->getAuthenticatedUser();
        $stats = $this->surveyService->getUserStats($user['id']);
        
        return [
            'success' => true,
            'stats' => $stats,
            'user' => [
                'id' => $user['id'],
                'phoneNumber' => $user['phone_number']
            ]
        ];
    }
    
    private function getAuthenticatedUser(): array
    {
        $token = $this->getAuthToken();
        
        if (!$token) {
            throw new \Exception('Authentication required');
        }
        
        $user = $this->authService->getUserFromToken($token);
        
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