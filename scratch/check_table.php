<?php
$db = new PDO('mysql:host=localhost;dbname=gloryfuel', 'root', '');
var_dump($db->query("DESCRIBE videos")->fetchAll(PDO::FETCH_ASSOC));
