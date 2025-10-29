<?php

declare(strict_types=1);

require_once __DIR__ . '/../vendor/autoload.php';

use SurveyApp\Database\DatabaseConnection;
use SurveyApp\Handlers\AuthHandler;
use SurveyApp\Handlers\NotificationHandler;
use SurveyApp\Handlers\SurveyHandler;
use SurveyApp\Services\AuthService;
use SurveyApp\Services\OtpService;
use SurveyApp\Services\SurveyService;

// Basic JSON response header for all requests
header('Content-Type: application/json');

// Allow React Native bundler and devices to access the API during development
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(200);
    echo json_encode(['status' => 'ok']);
    exit;
}

try {
    $database = new DatabaseConnection();

    $authService = new AuthService($database);
    $surveyService = new SurveyService($database);
    $otpService = new OtpService();

    $authHandler = new AuthHandler($authService, $otpService);
    $surveyHandler = new SurveyHandler($surveyService, $authService);
    $notificationHandler = new NotificationHandler($database);

    $routes = [
        'POST /auth/send-otp' => [$authHandler, 'sendOtp'],
        'POST /auth/verify-otp' => [$authHandler, 'verifyOtp'],
        'POST /auth/refresh' => [$authHandler, 'refreshToken'],
        'POST /auth/logout' => [$authHandler, 'logout'],

        'GET /surveys' => [$surveyHandler, 'getSurveys'],
        'GET /surveys/get' => [$surveyHandler, 'getSurvey'],
        'POST /surveys/get' => [$surveyHandler, 'getSurvey'],
        'POST /surveys/complete' => [$surveyHandler, 'completeSurvey'],
        'POST /surveys/create' => [$surveyHandler, 'createSurvey'],
        'GET /surveys/stats' => [$surveyHandler, 'getUserStats'],

        'POST /notifications/register' => [$notificationHandler, 'registerDevice'],
        'POST /notifications/send' => [$notificationHandler, 'sendNotification'],
        'POST /notifications/broadcast' => [$notificationHandler, 'broadcastNotification'],

        'GET /health' => static fn () => ['status' => 'ok', 'timestamp' => date('c')],
    ];

    $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';
    $normalizedPath = $path === '/' ? '/' : rtrim($path, '/');
    $routeKey = sprintf('%s %s', $method, $normalizedPath);

    if (!isset($routes[$routeKey])) {
        http_response_code(404);
        echo json_encode([
            'error' => 'Not Found',
            'message' => sprintf('No route registered for %s %s', $method, $normalizedPath),
            'timestamp' => date('c'),
        ]);
        exit;
    }

    $params = $_GET;

    if ($method !== 'GET') {
        $rawInput = file_get_contents('php://input') ?: '';
        $payload = [];

        if ($rawInput !== '') {
            $decoded = json_decode($rawInput, true);
            if ($decoded === null && json_last_error() !== JSON_ERROR_NONE) {
                throw new \InvalidArgumentException('Invalid JSON payload: ' . json_last_error_msg());
            }
            if (is_array($decoded)) {
                $payload = $decoded;
            }
        }

        if (empty($payload) && !empty($_POST)) {
            $payload = $_POST;
        }

        if (!empty($payload)) {
            $params = array_merge($params, $payload);
        }
    }

    $handler = $routes[$routeKey];
    $result = $handler($params);

    http_response_code(200);
    echo json_encode($result, JSON_UNESCAPED_SLASHES);
} catch (\InvalidArgumentException $e) {
    http_response_code(400);
    echo json_encode([
        'error' => 'Bad Request',
        'message' => $e->getMessage(),
        'timestamp' => date('c'),
    ]);
} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Internal Server Error',
        'message' => $e->getMessage(),
        'timestamp' => date('c'),
    ]);
}
