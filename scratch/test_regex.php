<?php
function fetch_html($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0');
    $body = curl_exec($ch);
    curl_close($ch);
    return $body;
}
$pw_html = fetch_html('https://rolexcoderz.in/PW/');
preg_match_all('/onclick="location\.href=\'.*?batchId=([a-f0-9]{24})\'.*?<img src="([^"]+)".*?<div class="card-name">([^<]+)<\/div>/is', $pw_html, $matches, PREG_SET_ORDER);
echo "Count: " . count($matches) . "\n";
foreach($matches as $m) echo $m[1] . " - " . $m[3] . "\n";
?>
