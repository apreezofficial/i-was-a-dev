<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Database file path
$dataFile = __DIR__ . '/data.json';

// Helper function to read data
function readData() {
    global $dataFile;
    if (!file_exists($dataFile)) {
        return ['people' => [], 'likes' => []];
    }
    return json_decode(file_get_contents($dataFile), true);
}

// Helper function to write data
function writeData($data) {
    global $dataFile;
    file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

// Get device fingerprint
function getDeviceFingerprint() {
    $fingerprint = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : 'unknown';
    $fingerprint .= isset($_SERVER['HTTP_ACCEPT_LANGUAGE']) ? $_SERVER['HTTP_ACCEPT_LANGUAGE'] : 'unknown';
    return hash('sha256', $fingerprint);
}

// Parse URL to determine action
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$parts = array_filter(explode('/', trim($requestUri, '/')));
$action = array_pop($parts);

// Route requests
switch ($action) {
    case 'get-all':
        handleGetAll();
        break;
    case 'get-story':
        handleGetStory();
        break;
    case 'register':
        handleRegister();
        break;
    case 'login':
        handleLogin();
        break;
    case 'update-profile':
        handleUpdateProfile();
        break;
    case 'upload-avatar':
        handleUploadAvatar();
        break;
    case 'like':
        handleLike();
        break;
    case 'unlike':
        handleUnlike();
        break;
    case 'check-like':
        handleCheckLike();
        break;
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
}

// Login handle
function handleLogin() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    $name = isset($input['name']) ? trim($input['name']) : null;
    $pin = isset($input['pin']) ? trim($input['pin']) : null;
    
    if (!$name || !$pin) {
        http_response_code(400);
        echo json_encode(['error' => 'Name and PIN are required']);
        return;
    }
    
    $data = readData();
    foreach ($data['people'] as $person) {
        if (strtolower($person['name']) === strtolower($name)) {
            if (password_verify($pin, $person['pin'])) {
                // Return person data without PIN
                $safePerson = $person;
                unset($safePerson['pin']);
                echo json_encode(['success' => true, 'data' => $safePerson]);
                return;
            }
        }
    }
    
    http_response_code(401);
    echo json_encode(['error' => 'Invalid name or PIN']);
}

// Update profile handle
function handleUpdateProfile() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    $id = isset($input['id']) ? $input['id'] : null;
    $pin = isset($input['pin']) ? $input['pin'] : null;
    
    if (!$id || !$pin) {
        http_response_code(400);
        echo json_encode(['error' => 'ID and PIN are required']);
        return;
    }
    
    $data = readData();
    foreach ($data['people'] as &$person) {
        if ($person['id'] === $id) {
            if (password_verify($pin, $person['pin'])) {
                if (isset($input['name'])) $person['name'] = htmlspecialchars($input['name']);
                if (isset($input['before'])) $person['before'] = htmlspecialchars($input['before']);
                if (isset($input['after'])) $person['after'] = htmlspecialchars($input['after']);
                if (isset($input['story'])) $person['story'] = htmlspecialchars($input['story']);
                if (isset($input['avatar'])) $person['avatar'] = $input['avatar'];
                
                writeData($data);
                
                $safePerson = $person;
                unset($safePerson['pin']);
                echo json_encode(['success' => true, 'data' => $safePerson]);
                return;
            } else {
                http_response_code(401);
                echo json_encode(['error' => 'Invalid PIN']);
                return;
            }
        }
    }
    
    http_response_code(404);
    echo json_encode(['error' => 'Profile not found']);
}

// Simple avatar upload (base64 for simplicity in this JSON setup, or file if possible)
function handleUploadAvatar() {
    // For now, we'll let the frontend handle base64 encoding or external URLs
    // But if we want to support file uploads:
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }

    if (!isset($_FILES['avatar'])) {
        http_response_code(400);
        echo json_encode(['error' => 'No file uploaded']);
        return;
    }

    $file = $_FILES['avatar'];
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = 'avatar_' . uniqid() . '.' . $ext;
    $uploadDir = __DIR__ . '/../public/uploads/';
    
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    if (move_uploaded_file($file['tmp_name'], $uploadDir . $filename)) {
        echo json_encode(['success' => true, 'url' => '/uploads/' . $filename]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to move uploaded file']);
    }
}

// Get all people with like counts (paginated & cached)
function handleGetAll() {
    global $dataFile;
    
    // Simple ETag caching based on file modification time
    $lastModified = file_exists($dataFile) ? filemtime($dataFile) : time();
    $etag = md5($lastModified . $dataFile);
    
    header("ETag: $etag");
    header("Cache-Control: public, max-age=60"); // Cache for 60 seconds
    
    if (isset($_SERVER['HTTP_IF_NONE_MATCH']) && trim($_SERVER['HTTP_IF_NONE_MATCH']) === $etag) {
        http_response_code(304);
        exit;
    }

    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 25;
    $offset = ($page - 1) * $limit;

    $data = readData();
    
    // Sort people by creation date (newest first)
    usort($data['people'], function($a, $b) {
        return strtotime($b['created_at']) - strtotime($a['created_at']);
    });

    $total = count($data['people']);
    $paginatedPeople = array_slice($data['people'], $offset, $limit);
    
    $result = [];
    foreach ($paginatedPeople as $person) {
        $likeCount = 0;
        foreach ($data['likes'] as $like) {
            if ($like['person_id'] === $person['id']) {
                $likeCount++;
            }
        }
        $person['likes'] = $likeCount;
        unset($person['pin']); // Always ensure PIN is hidden
        $result[] = $person;
    }
    
    echo json_encode([
        'success' => true, 
        'data' => $result,
        'pagination' => [
            'total' => $total,
            'page' => $page,
            'limit' => $limit,
            'total_pages' => ceil($total / $limit)
        ]
    ]);
}

// Get single story
function handleGetStory() {
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID is required']);
        return;
    }
    
    $data = readData();
    
    foreach ($data['people'] as $person) {
        if ($person['id'] === $id) {
            $likeCount = 0;
            foreach ($data['likes'] as $like) {
                if ($like['person_id'] === $person['id']) {
                    $likeCount++;
                }
            }
            $person['likes'] = $likeCount;
            echo json_encode(['success' => true, 'data' => $person]);
            return;
        }
    }
    
    http_response_code(404);
    echo json_encode(['error' => 'Story not found']);
}

// Register new person
function handleRegister() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['name']) || !isset($input['before']) || !isset($input['after'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        return;
    }
    
    $data = readData();
    
    // Generate unique ID and PIN
    $id = 'dev_' . uniqid();
    $pin = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    
    $newPerson = [
        'id' => $id,
        'name' => htmlspecialchars($input['name']),
        'before' => htmlspecialchars($input['before']),
        'after' => htmlspecialchars($input['after']),
        'story' => isset($input['story']) ? htmlspecialchars($input['story']) : '',
        'avatar' => isset($input['avatar']) ? $input['avatar'] : null,
        'pin' => password_hash($pin, PASSWORD_DEFAULT),
        'created_at' => date('Y-m-d H:i:s')
    ];
    
    $data['people'][] = $newPerson;
    writeData($data);
    
    echo json_encode([
        'success' => true,
        'message' => 'Story registered successfully',
        'id' => $id,
        'pin' => $pin
    ]);
}

// Add like
function handleLike() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    $personId = isset($input['person_id']) ? $input['person_id'] : null;
    
    if (!$personId) {
        http_response_code(400);
        echo json_encode(['error' => 'Person ID is required']);
        return;
    }
    
    $data = readData();
    $deviceFingerprint = getDeviceFingerprint();
    
    // Check if already liked by this device
    foreach ($data['likes'] as $like) {
        if ($like['person_id'] === $personId && $like['device'] === $deviceFingerprint) {
            http_response_code(400);
            echo json_encode(['error' => 'You have already liked this story']);
            return;
        }
    }
    
    // Add like
    $data['likes'][] = [
        'person_id' => $personId,
        'device' => $deviceFingerprint,
        'liked_at' => date('Y-m-d H:i:s')
    ];
    
    writeData($data);
    
    // Count likes
    $likeCount = 0;
    foreach ($data['likes'] as $like) {
        if ($like['person_id'] === $personId) {
            $likeCount++;
        }
    }
    
    echo json_encode(['success' => true, 'likes' => $likeCount, 'message' => 'Like added']);
}

// Remove like
function handleUnlike() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    $personId = isset($input['person_id']) ? $input['person_id'] : null;
    
    if (!$personId) {
        http_response_code(400);
        echo json_encode(['error' => 'Person ID is required']);
        return;
    }
    
    $data = readData();
    $deviceFingerprint = getDeviceFingerprint();
    
    // Remove like
    $data['likes'] = array_filter($data['likes'], function($like) use ($personId, $deviceFingerprint) {
        return !($like['person_id'] === $personId && $like['device'] === $deviceFingerprint);
    });
    
    writeData($data);
    
    // Count likes
    $likeCount = 0;
    foreach ($data['likes'] as $like) {
        if ($like['person_id'] === $personId) {
            $likeCount++;
        }
    }
    
    echo json_encode(['success' => true, 'likes' => $likeCount, 'message' => 'Like removed']);
}

// Check if device has liked
function handleCheckLike() {
    $personId = isset($_GET['person_id']) ? $_GET['person_id'] : null;
    
    if (!$personId) {
        http_response_code(400);
        echo json_encode(['error' => 'Person ID is required']);
        return;
    }
    
    $data = readData();
    $deviceFingerprint = getDeviceFingerprint();
    
    foreach ($data['likes'] as $like) {
        if ($like['person_id'] === $personId && $like['device'] === $deviceFingerprint) {
            echo json_encode(['liked' => true]);
            return;
        }
    }
    
    echo json_encode(['liked' => false]);
}
?>
