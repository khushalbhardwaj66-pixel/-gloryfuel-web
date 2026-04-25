<?php
require_once 'c:/xampp/htdocs/gloryfuel-api/config/database.php';
$database = new Database();
$db = $database->getConnection();
$tables = ['batches', 'subjects', 'topics', 'videos', 'notes', 'live_classes'];
$counts = [];
foreach ($tables as $t) {
    try {
        $stmt = $db->query("SELECT COUNT(*) as cnt FROM `$t` ");
        $counts[$t] = $stmt->fetch(PDO::FETCH_ASSOC)['cnt'];
    } catch(Exception $e) {
        $counts[$t] = "Error: " . $e->getMessage();
    }
}
echo json_encode($counts);
?>
