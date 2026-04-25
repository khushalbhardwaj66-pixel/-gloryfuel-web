<?php
$db = new PDO('mysql:host=localhost;dbname=gloryfuel', 'root', '');
$stmt = $db->prepare("SELECT s.id, s.name, (SELECT COUNT(*) FROM videos v WHERE v.subject_id=s.id) as v_count FROM subjects s JOIN batches b ON s.batch_id=b.id WHERE b.external_id='108'");
$stmt->execute();
$results = $stmt->fetchAll(PDO::FETCH_ASSOC);
foreach($results as $r) {
    echo "{$r['id']} | {$r['name']} | Videos: {$r['v_count']}\n";
}
