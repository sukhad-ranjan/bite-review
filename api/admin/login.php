<?php

declare(strict_types=1);

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../middleware/auth.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

$input = readJsonInput();
$canteenId = sanitizeCanteenId((string) ($input['canteen_id'] ?? ''));
$password = trim((string) ($input['password'] ?? ''));

if ($canteenId === '' || $password === '') {
    jsonResponse(['success' => false, 'message' => 'Canteen and password are required'], 422);
}

try {
    $pdo = getPDO();
    $stmt = $pdo->prepare('SELECT canteen_id, password_hash FROM admins WHERE canteen_id = :canteen_id LIMIT 1');
    $stmt->execute([':canteen_id' => $canteenId]);
    $admin = $stmt->fetch();

    if (!$admin || !password_verify($password, $admin['password_hash'])) {
        jsonResponse(['success' => false, 'message' => 'Invalid credentials'], 401);
    }

    $issuedAt = time();
    $expiresAt = $issuedAt + (8 * 60 * 60);

    $header = ['typ' => 'JWT', 'alg' => 'HS256'];
    $payload = [
        'canteen_id' => $admin['canteen_id'],
        'iat' => $issuedAt,
        'exp' => $expiresAt,
    ];

    $encodedHeader = base64UrlEncode(json_encode($header, JSON_UNESCAPED_SLASHES));
    $encodedPayload = base64UrlEncode(json_encode($payload, JSON_UNESCAPED_SLASHES));
    $signature = base64UrlEncode(hash_hmac('sha256', $encodedHeader . '.' . $encodedPayload, JWT_SECRET, true));
    $token = $encodedHeader . '.' . $encodedPayload . '.' . $signature;

    jsonResponse([
        'success' => true,
        'token' => $token,
        'canteen_id' => $admin['canteen_id'],
    ]);
} catch (Throwable $exception) {
    jsonResponse(['success' => false, 'message' => 'Unable to process login'], 500);
}

