<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ─── Database Connection ───────────────────────────────────
include_once '../config/database.php';
$database = new Database();
$db = $database->getConnection();

// ─── Color palette for batches ────────────────────────────
$colors = [
    '#4F46E5', '#10B981', '#F59E0B', '#EC4899',
    '#8B5CF6', '#06B6D4', '#EF4444', '#84CC16',
    '#F97316', '#14B8A6', '#6366F1', '#D946EF',
    '#0EA5E9', '#22C55E', '#FB923C', '#A855F7',
    '#E11D48', '#0891B2', '#65A30D', '#DC2626',
    '#7C3AED'
];

// ─── Helper: fetch a URL with cURL ───────────────────────
function fetch_url($url, $timeout = 10) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_USERAGENT,
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36');
    $response  = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error     = curl_error($ch);
    curl_close($ch);
    return ['body' => $response, 'code' => $http_code, 'error' => $error];
}

// ─── STEP 1: Fetch the /PW/ page to get all batch IDs ────
$pw_page = fetch_url('https://rolexcoderz.in/PW/');

if ($pw_page['code'] !== 200 || empty($pw_page['body'])) {
    http_response_code(502);
    echo json_encode([
        'message'   => 'Could not load rolexcoderz.in/PW/ — check your internet connection.',
        'http_code' => $pw_page['code'],
        'error'     => $pw_page['error']
    ]);
    exit();
}

// ─── STEP 2: Extract all batchIds using regex ─────────────
// Matches: /RC/?batchId=XXXXXXXXXXXXXXXXXXXXXXXX
preg_match_all('/batchId=([a-f0-9]{24})/i', $pw_page['body'], $matches);

$batch_ids = array_unique($matches[1] ?? []);

if (empty($batch_ids)) {
    http_response_code(502);
    echo json_encode([
        'message' => 'No batch IDs found on rolexcoderz.in/PW/ — the site layout may have changed.',
        'preview' => substr(strip_tags($pw_page['body']), 0, 300)
    ]);
    exit();
}

// ─── STEP 3: DELETE all old batches ──────────────────────
try {
    $db->exec("DELETE FROM batches");
    // Reset auto-increment so IDs start fresh
    $db->exec("ALTER TABLE batches AUTO_INCREMENT = 1");
} catch (Exception $e) {
    http_response_code(503);
    echo json_encode(['message' => 'Failed to clear old batches: ' . $e->getMessage()]);
    exit();
}

// ─── STEP 4: For each batchId, fetch name + save to DB ───
$imported = [];
$failed   = [];

$insert_sql = "INSERT INTO batches 
               (name, description, students, status, start_date, end_date, banner_url, color, external_batch_id)
               VALUES 
               (:name, :description, :students, :status, :start_date, :end_date, :banner_url, :color, :external_id)
               ON DUPLICATE KEY UPDATE
               name = VALUES(name),
               description = VALUES(description),
               color = VALUES(color)";

// Try preparing with external_batch_id first; fallback without it
try {
    $stmt_test = $db->prepare("SELECT external_batch_id FROM batches LIMIT 1");
    $stmt_test->execute();
    $has_external_col = true;
} catch (Exception $e) {
    $has_external_col = false;
}

// Rebuild insert query if column doesn't exist
if (!$has_external_col) {
    $insert_sql = "INSERT INTO batches 
                   (name, description, students, status, start_date, end_date, banner_url, color)
                   VALUES 
                   (:name, :description, :students, :status, :start_date, :end_date, :banner_url, :color)";
}

foreach ($batch_ids as $index => $batch_id) {
    // Fetch the RC page for this batch to get its name from <title>
    $rc_url  = "https://rolexcoderz.in/RC/?batchId=" . $batch_id;
    $rc_page = fetch_url($rc_url, 8); // 8 second timeout per batch

    $batch_name = 'Batch ' . ($index + 1); // fallback name

    if ($rc_page['code'] === 200 && !empty($rc_page['body'])) {
        // Extract <title>...</title>
        if (preg_match('/<title[^>]*>(.*?)<\/title>/is', $rc_page['body'], $title_match)) {
            $raw_title = html_entity_decode(trim($title_match[1]), ENT_QUOTES, 'UTF-8');
            // Remove common site suffixes like " | RolexCoderZ"
            $raw_title = preg_replace('/\s*[\|\-–]\s*RolexCoderZ.*/i', '', $raw_title);
            $raw_title = trim($raw_title);
            if (!empty($raw_title)) {
                $batch_name = $raw_title;
            }
        }
    } else {
        $failed[] = ['batch_id' => $batch_id, 'reason' => 'Could not fetch RC page (HTTP ' . $rc_page['code'] . ')'];
    }

    $color      = $colors[$index % count($colors)];
    $start_date = date('Y-m-d');
    $end_date   = date('Y-m-d', strtotime('+1 year'));
    $description = 'Physics Wallah batch — imported from rolexcoderz.in';
    $banner_url  = '';
    $students    = 0;
    $status      = 'active';

    try {
        $stmt = $db->prepare($insert_sql);
        $stmt->bindParam(':name',        $batch_name);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':students',    $students,   \PDO::PARAM_INT);
        $stmt->bindParam(':status',      $status);
        $stmt->bindParam(':start_date',  $start_date);
        $stmt->bindParam(':end_date',    $end_date);
        $stmt->bindParam(':banner_url',  $banner_url);
        $stmt->bindParam(':color',       $color);

        if ($has_external_col) {
            $stmt->bindParam(':external_id', $batch_id);
        }

        $stmt->execute();

        $imported[] = [
            'id'               => (int)$db->lastInsertId(),
            'name'             => $batch_name,
            'color'            => $color,
            'status'           => $status,
            'description'      => $description,
            'banner_url'       => $banner_url,
            'external_batch_id'=> $batch_id,
            'rc_url'           => $rc_url
        ];
    } catch (Exception $e) {
        $failed[] = ['batch_id' => $batch_id, 'name' => $batch_name, 'error' => $e->getMessage()];
    }
}

// ─── STEP 5: Return result ────────────────────────────────
$imported_count = count($imported);
$failed_count   = count($failed);

if ($imported_count > 0) {
    http_response_code(201);
    echo json_encode([
        'message'        => "$imported_count batch(es) imported successfully from rolexcoderz.in. All old batches removed.",
        'imported_count' => $imported_count,
        'failed_count'   => $failed_count,
        'batch'          => $imported[0],      // first batch for Redux single-item fallback
        'all_imported'   => $imported,
        'failed'         => $failed
    ]);
} else {
    http_response_code(503);
    echo json_encode([
        'message' => 'No batches could be saved to the database.',
        'failed'  => $failed
    ]);
}
?>