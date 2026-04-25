<?php
// batches/sync_cron.php
// Scheduled Job to Sync Batches from rolexcoderz.in
// Usage: php batches/sync_cron.php

// 1. CLI Security Check
if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    die("Access Denied: This script can only be run from the command line.\n");
}

// Configuration
$LOCK_FILE   = __DIR__ . '/sync.lock';
$LOG_FILE    = __DIR__ . '/sync.log';
$API_KEY     = getenv('ROLEX_API_KEY') ?: 'YOUR_API_KEY_HERE'; // Set in server env
$API_URL     = 'https://rolexcoderz.in/PY/?action=get_contents';
$TIMEOUT_SEC = 30;

// Logging Helper
function write_log($message)
{
    global $LOG_FILE;
    $timestamp = date('[Y-m-d H:i:s]');
    if (is_array($message) || is_object($message)) {
        $message = print_r($message, true);
    }
    file_put_contents($LOG_FILE, "$timestamp $message\n", FILE_APPEND);
    echo "$timestamp $message\n";
}

// 2. Prevent Multiple Instances
if (file_exists($LOCK_FILE)) {
    if (time() - filemtime($LOCK_FILE) > 600) {
        write_log("WARNING: Found stale lock file. Removing and proceeding.");
        unlink($LOCK_FILE);
    } else {
        die("Sync is already running.\n");
    }
}
touch($LOCK_FILE);

register_shutdown_function(function () use ($LOCK_FILE) {
    if (file_exists($LOCK_FILE))
        unlink($LOCK_FILE);
});

try {
    write_log("Starting Full Sync (Batches, Videos, Notes, Live Classes)...");

    // 3. Database Connection
    $db_config = __DIR__ . '/../config/database.php';
    if (!file_exists($db_config))
        throw new Exception("DB Config not found: $db_config");

    require_once $db_config;
    $database = new Database();
    $db = $database->getConnection();
    if (!$db)
        throw new Exception("Failed to connect to database.");

    // 4. Fetch External Data
    write_log("Fetching data from rolexcoderz.in...");
    $post_data = json_encode(['api_key' => $API_KEY]);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $API_URL);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, $TIMEOUT_SEC);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_USERAGENT, 'GloryFuel-Sync-Bot/1.0');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $API_KEY,
        'X-API-Key: ' . $API_KEY,
        'Content-Length: ' . strlen($post_data)
    ]);

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($http_code !== 200)
        throw new Exception("API returned HTTP $http_code");

    $json = json_decode($response, true);
    if (!$json)
        throw new Exception("Could not parse JSON response from rolexcoderz.in.");

    // Resolve the batch list from whatever key the API uses
    $batches_raw = [];
    if (isset($json['data']) && is_array($json['data']))         $batches_raw = $json['data'];
    elseif (isset($json['batches']) && is_array($json['batches'])) $batches_raw = $json['batches'];
    elseif (isset($json['contents']) && is_array($json['contents'])) $batches_raw = $json['contents'];
    elseif (is_array($json) && isset($json[0]))                   $batches_raw = $json;
    else                                                           $batches_raw = [$json];

    write_log("Found " . count($batches_raw) . " batch(es) from rolexcoderz.in.");

    // --- BATCH UPSERT (all batches from rolexcoderz.in) ---
    foreach ($batches_raw as $item) {
        $batch_name = $item['name'] ?? $item['title'] ?? $item['batch_name'] ?? 'Imported Batch';
        $batch_desc = $item['description'] ?? $item['desc'] ?? '';
        $batch_banner = $item['banner_url'] ?? $item['thumbnail'] ?? $item['image'] ?? '';
        $batch_color = $item['color'] ?? '#10B981';
        $batch_status = $item['status'] ?? 'active';
        $batch_start = $item['start_date'] ?? $item['created_at'] ?? date("Y-m-d");
        $batch_end = $item['end_date'] ?? $item['expires_at'] ?? date("Y-m-d", strtotime("+6 months"));
        $batch_students = (int)($item['students'] ?? $item['student_count'] ?? 0);

        // Check if batch already exists (upsert)
        $check_sql = "SELECT id FROM batches WHERE name = :name LIMIT 1";
        $stmt = $db->prepare($check_sql);
        $stmt->execute([':name' => $batch_name]);

        if ($stmt->rowCount() > 0) {
            $batch_id = $stmt->fetch(PDO::FETCH_ASSOC)['id'];
            $update_sql = "UPDATE batches SET description=:desc, students=:students, status=:status, banner_url=:banner, color=:color WHERE id=:id";
            $db->prepare($update_sql)->execute([
                ':desc' => $batch_desc, ':students' => $batch_students,
                ':status' => $batch_status, ':banner' => $batch_banner,
                ':color' => $batch_color, ':id' => $batch_id
            ]);
            write_log("Updated batch: '$batch_name' (ID: $batch_id)");
        } else {
            $insert_sql = "INSERT INTO batches (name, description, students, status, start_date, end_date, banner_url, color) VALUES (:name,:desc,:students,:status,:start,:end,:banner,:color)";
            $db->prepare($insert_sql)->execute([
                ':name' => $batch_name, ':desc' => $batch_desc,
                ':students' => $batch_students, ':status' => $batch_status,
                ':start' => $batch_start, ':end' => $batch_end,
                ':banner' => $batch_banner, ':color' => $batch_color
            ]);
            $batch_id = $db->lastInsertId();
            write_log("Inserted new batch: '$batch_name' (ID: $batch_id)");
        }
    }

    write_log("Sync Completed Successfully.");

} catch (Exception $e) {
    write_log("ERROR: " . $e->getMessage());
    exit(1);
}
?>