<?php

declare(strict_types=1);

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/report_helpers.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

$token = getBearerToken();
$payload = validateJWT($token, JWT_SECRET);
if ($payload === false) {
    jsonResponse(['success' => false, 'message' => 'Unauthorized'], 401);
}

$canteenId = sanitizeCanteenId((string) ($_GET['canteen_id'] ?? ''));

if ($canteenId === '') {
    jsonResponse(['success' => false, 'message' => 'Valid canteen_id is required'], 422);
}

if (($payload['canteen_id'] ?? '') !== $canteenId) {
    jsonResponse(['success' => false, 'message' => 'Forbidden'], 403);
}

try {
    $trend = getWeeklyTrend(getPDO(), $canteenId);
    jsonResponse($trend);
} catch (Throwable $exception) {
    jsonResponse(['success' => false, 'message' => 'Unable to load weekly trend'], 500);
}
