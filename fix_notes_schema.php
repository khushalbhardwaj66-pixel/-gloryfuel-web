<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
include_once 'C:/xampp/htdocs/gloryfuel-api/config/database.php';
try {
    $database = new Database();
    $db = $database->getConnection();

    echo "Fixing notes table schema...\n";

    // Add subject_id if not exists
    $columns = $db->query("DESCRIBE notes")->fetchAll(PDO::FETCH_COLUMN);

    if (!in_array('subject_id', $columns)) {
        echo "Adding subject_id...\n";
        $db->exec("ALTER TABLE notes ADD COLUMN subject_id INT AFTER title");
    }

    if (in_array('file_path', $columns) && !in_array('file_url', $columns)) {
        echo "Renaming file_path to file_url...\n";
        $db->exec("ALTER TABLE notes CHANGE COLUMN file_path file_url TEXT");
    }

    echo "Table fixed.\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>