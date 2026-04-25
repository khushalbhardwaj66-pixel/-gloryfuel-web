<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
include_once 'C:/xampp/htdocs/gloryfuel-api/config/database.php';
$db = (new Database())->getConnection();
$stmt = $db->query("SHOW TABLES");
$tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
echo "TABLES:\n";
foreach ($tables as $t) {
    echo "- $t\n";
}
?>