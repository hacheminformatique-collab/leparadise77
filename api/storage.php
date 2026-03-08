<?php
ini_set('post_max_size', '20M');
ini_set('memory_limit', '128M');

// CORS headers – restrict to same host and localhost for local development
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$scheme = ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http');
$sameOrigin = $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? '');
$isLocalDev = (bool) preg_match('/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/', $origin);

if ($origin !== '' && ($origin === $sameOrigin || $isLocalDev)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Handle pre-flight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Validate key: only alphanumeric characters and underscores are accepted
$key = $_GET['key'] ?? '';
if (!preg_match('/^[a-zA-Z0-9_]+$/', $key)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid key']);
    exit;
}

// Ensure the data directory exists (owner-and-group access only)
$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0750, true);
}

$file = $dataDir . '/' . $key . '.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!file_exists($file)) {
        http_response_code(404);
        echo json_encode(null);
        exit;
    }
    echo file_get_contents($file);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = file_get_contents('php://input');
    if ($body === false || $body === '') {
        http_response_code(400);
        echo json_encode(['error' => 'Empty body']);
        exit;
    }
    // Validate that the body is valid JSON before writing
    $incoming = json_decode($body, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON']);
        exit;
    }

    // Special merge logic for paradise_clients to prevent race-condition overwrites.
    // When the key is paradise_clients we merge the incoming array with the existing
    // one (keyed by "id" then "devisNumber") so that a stale client posting an older
    // snapshot cannot silently delete records added by other sessions.
    if ($key === 'paradise_clients' && is_array($incoming) && file_exists($file)) {
        $existingJson = file_get_contents($file);
        $existing = $existingJson !== false ? json_decode($existingJson, true) : null;
        if (is_array($existing)) {
            // Build a lookup of existing records by stable id, then merge.
            $merged = [];
            $indexById = [];
            $indexByDevisNumber = [];
            foreach ($existing as $i => $record) {
                if (!empty($record['id'])) {
                    $indexById[$record['id']] = $i;
                }
                if (!empty($record['devisNumber'])) {
                    $indexByDevisNumber[$record['devisNumber']] = $i;
                }
                $merged[] = $record;
            }
            foreach ($incoming as $record) {
                $id = !empty($record['id']) ? $record['id'] : null;
                $devisNumber = !empty($record['devisNumber']) ? $record['devisNumber'] : null;
                if ($id !== null && isset($indexById[$id])) {
                    // Overwrite existing record with incoming version (incoming wins)
                    $merged[$indexById[$id]] = $record;
                } elseif ($devisNumber !== null && isset($indexByDevisNumber[$devisNumber])) {
                    $merged[$indexByDevisNumber[$devisNumber]] = $record;
                } else {
                    // New record not present in existing data – append it
                    $merged[] = $record;
                }
            }
            $body = json_encode(array_values($merged));
        }
        // If existing data is not a valid array, fall through and overwrite (safe compat fallback)
    }

    if (file_put_contents($file, $body, LOCK_EX) === false) {
        http_response_code(500);
        echo json_encode(['error' => 'Write failed']);
        exit;
    }
    echo json_encode(['success' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
