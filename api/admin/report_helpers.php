<?php

declare(strict_types=1);

const CANTEEN_NAMES = [
    'snackers' => 'Snackers',
    'nescafe' => 'Nescafe',
    'yadav' => 'Yadav Canteen',
    'night' => 'Night Canteen',
    'campus' => 'Campus Cafe',
];

function getIsoYearForWeek(?int $year = null): int
{
    return $year ?? (int) gmdate('o');
}

function getWeekDateRange(int $week, ?int $year = null): array
{
    $isoYear = getIsoYearForWeek($year);
    $start = new DateTimeImmutable('now', new DateTimeZone('UTC'));
    $start = $start->setISODate($isoYear, $week)->setTime(0, 0, 0);
    $end = $start->modify('+6 days')->setTime(23, 59, 59);

    return [
        'start' => $start,
        'end' => $end,
    ];
}

function getWeeklyReport(PDO $pdo, string $canteenId, int $week, ?int $year = null): array
{
    $range = getWeekDateRange($week, $year);
    $start = $range['start']->format('Y-m-d H:i:s');
    $end = $range['end']->format('Y-m-d H:i:s');

    $summaryStmt = $pdo->prepare(
        'SELECT 
            COUNT(*) AS total_reviews,
            COALESCE(AVG(rating), 0) AS avg_rating,
            COALESCE(SUM(CASE WHEN is_complaint = 1 THEN 1 ELSE 0 END), 0) AS complaint_count
         FROM reviews
         WHERE canteen_id = :canteen_id
           AND created_at BETWEEN :start_date AND :end_date'
    );
    $summaryStmt->execute([
        ':canteen_id' => $canteenId,
        ':start_date' => $start,
        ':end_date' => $end,
    ]);
    $summary = $summaryStmt->fetch() ?: [
        'total_reviews' => 0,
        'avg_rating' => 0,
        'complaint_count' => 0,
    ];

    $distributionStmt = $pdo->prepare(
        'SELECT rating, COUNT(*) AS total
         FROM reviews
         WHERE canteen_id = :canteen_id
           AND created_at BETWEEN :start_date AND :end_date
         GROUP BY rating'
    );
    $distributionStmt->execute([
        ':canteen_id' => $canteenId,
        ':start_date' => $start,
        ':end_date' => $end,
    ]);

    $ratingDistribution = [
        '1' => 0,
        '2' => 0,
        '3' => 0,
        '4' => 0,
        '5' => 0,
    ];

    foreach ($distributionStmt->fetchAll() as $row) {
        $ratingDistribution[(string) $row['rating']] = (int) $row['total'];
    }

    $topItemsStmt = $pdo->prepare(
        'SELECT item_name, COUNT(*) AS review_count, ROUND(AVG(rating), 2) AS avg_rating
         FROM reviews
         WHERE canteen_id = :canteen_id
           AND created_at BETWEEN :start_date AND :end_date
         GROUP BY item_id, item_name
         ORDER BY avg_rating DESC, review_count DESC, item_name ASC
         LIMIT 5'
    );
    $topItemsStmt->execute([
        ':canteen_id' => $canteenId,
        ':start_date' => $start,
        ':end_date' => $end,
    ]);
    $topItems = array_map(
        static fn(array $row): array => [
            'item_name' => $row['item_name'],
            'review_count' => (int) $row['review_count'],
            'avg_rating' => (float) $row['avg_rating'],
        ],
        $topItemsStmt->fetchAll()
    );

    $recentFeedbackStmt = $pdo->prepare(
        'SELECT comment, rating, is_complaint, created_at
         FROM reviews
         WHERE canteen_id = :canteen_id
           AND created_at BETWEEN :start_date AND :end_date
           AND comment IS NOT NULL
           AND TRIM(comment) <> \'\'
         ORDER BY created_at DESC
         LIMIT 10'
    );
    $recentFeedbackStmt->execute([
        ':canteen_id' => $canteenId,
        ':start_date' => $start,
        ':end_date' => $end,
    ]);
    $recentFeedback = array_map(
        static fn(array $row): array => [
            'comment' => $row['comment'],
            'rating' => (int) $row['rating'],
            'is_complaint' => (int) $row['is_complaint'],
            'created_at' => $row['created_at'],
        ],
        $recentFeedbackStmt->fetchAll()
    );

    return [
        'canteen_id' => $canteenId,
        'canteen_name' => CANTEEN_NAMES[$canteenId] ?? $canteenId,
        'week' => $week,
        'week_range' => [
            'start' => $range['start']->format(DateTimeInterface::ATOM),
            'end' => $range['end']->format(DateTimeInterface::ATOM),
        ],
        'total_reviews' => (int) $summary['total_reviews'],
        'avg_rating' => round((float) $summary['avg_rating'], 2),
        'rating_distribution' => $ratingDistribution,
        'top_items' => $topItems,
        'recent_feedback' => $recentFeedback,
        'complaint_count' => (int) $summary['complaint_count'],
    ];
}

function getWeeklyTrend(PDO $pdo, string $canteenId, int $limit = 12): array
{
    $trendStmt = $pdo->prepare(
        'SELECT
            YEARWEEK(created_at, 3) AS week_key,
            WEEK(created_at, 3) AS week,
            ROUND(AVG(rating), 2) AS avg_rating,
            COUNT(*) AS review_count
         FROM reviews
         WHERE canteen_id = :canteen_id
         GROUP BY YEARWEEK(created_at, 3), WEEK(created_at, 3)
         ORDER BY week_key DESC
         LIMIT :trend_limit'
    );
    $trendStmt->bindValue(':canteen_id', $canteenId, PDO::PARAM_STR);
    $trendStmt->bindValue(':trend_limit', $limit, PDO::PARAM_INT);
    $trendStmt->execute();

    $trendRows = array_reverse($trendStmt->fetchAll() ?: []);

    return array_map(
        static fn(array $row): array => [
            'week' => 'Week ' . (int) $row['week'],
            'week_number' => (int) $row['week'],
            'avg_rating' => round((float) $row['avg_rating'], 2),
            'review_count' => (int) $row['review_count'],
            'week_key' => (int) $row['week_key'],
        ],
        $trendRows
    );
}
