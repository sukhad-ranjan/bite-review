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

$autoloadPath = dirname(__DIR__, 2) . '/vendor/autoload.php';
if (!file_exists($autoloadPath)) {
    jsonResponse(['success' => false, 'message' => 'Composer dependencies are not installed'], 500);
}

require_once $autoloadPath;

try {
    $report = getWeeklyReport(getPDO(), $canteenId, (int) gmdate('W'));
    $topItem = $report['top_items'][0]['item_name'] ?? 'No standout item yet';

    $html = sprintf(
        '<html><body style="font-family: DejaVu Sans, sans-serif;">
            <h1>Bite Review Weekly Report</h1>
            <h2>%s - Week %d</h2>
            <table width="100%%" border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
                <tr><th align="left">Total Reviews</th><td>%d</td></tr>
                <tr><th align="left">Average Rating</th><td>%.2f</td></tr>
                <tr><th align="left">Top Rated Item</th><td>%s</td></tr>
                <tr><th align="left">Complaint Count</th><td>%d</td></tr>
            </table>
        </body></html>',
        htmlspecialchars($report['canteen_name'], ENT_QUOTES, 'UTF-8'),
        $report['week'],
        $report['total_reviews'],
        $report['avg_rating'],
        htmlspecialchars($topItem, ENT_QUOTES, 'UTF-8'),
        $report['complaint_count']
    );

    $options = new \Dompdf\Options();
    $options->set('isRemoteEnabled', false);

    $dompdf = new \Dompdf\Dompdf($options);
    $dompdf->loadHtml($html);
    $dompdf->setPaper('A4', 'portrait');
    $dompdf->render();

    header_remove('Content-Type');
    header('Content-Type: application/pdf');
    header('Content-Disposition: attachment; filename="' . $canteenId . '-weekly-report.pdf"');
    echo $dompdf->output();
    exit;
} catch (Throwable $exception) {
    jsonResponse(['success' => false, 'message' => 'Unable to export PDF'], 500);
}
