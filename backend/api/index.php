<?php
// backend/api/index.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../db.php';
require_once 'controllers/AuthController.php';
require_once 'controllers/BookingController.php';
require_once 'controllers/ServiceController.php';
require_once 'controllers/SettingsController.php';

// Route formatting from .htaccess or fallback to REQUEST_URI parsing
$route = $_GET['route'] ?? null;

if (!$route) {
    // fallback if no .htaccess is used, parse REQUEST_URI
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    // Find where '/api/' is and take everything after it
    $pos = strpos($uri, '/api/');
    if ($pos !== false) {
        $route = substr($uri, $pos + 5);
    } else {
        $route = '';
    }
}

// Remove trailing slash
$route = rtrim($route, '/');
$method = $_SERVER['REQUEST_METHOD'];

// Parse JSON input globally if present
$inputData = json_decode(file_get_contents('php://input'), true) ?? [];

header('Content-Type: application/json');

switch ($route) {
    case 'services':
        if ($method === 'GET') {
            ServiceController::getServices($pdo);
        } else {
            http_response_code(405);
            echo json_encode(["error" => "Method not allowed"]);
        }
        break;

    case 'bookings':
        if ($method === 'GET') {
            BookingController::getBookings($pdo);
        } elseif ($method === 'POST') {
            BookingController::createBooking($pdo, $inputData);
        } else {
            http_response_code(405);
            echo json_encode(["error" => "Method not allowed"]);
        }
        break;

    case 'register':
        if ($method === 'POST') {
            AuthController::register($pdo, $inputData);
        } else {
            http_response_code(405);
            echo json_encode(["error" => "Method not allowed"]);
        }
        break;

    case 'login':
        if ($method === 'POST') {
            AuthController::login($pdo, $inputData);
        } else {
            http_response_code(405);
            echo json_encode(["error" => "Method not allowed"]);
        }
        break;

    case 'social-login':
        if ($method === 'POST') {
            AuthController::socialLogin($pdo, $inputData);
        } else {
            http_response_code(405);
            echo json_encode(["error" => "Method not allowed"]);
        }
        break;

    case 'settings':
        if ($method === 'PUT') {
            SettingsController::updateSettings($pdo, $inputData);
        } else {
            http_response_code(405);
            echo json_encode(["error" => "Method not allowed"]);
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(["error" => "Not Found", "route" => $route]);
        break;
}
