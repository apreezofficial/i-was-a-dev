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
    case 'like':
        handleLike();
        break;
    case 'unlike':
        handleUnlike();
        break;
    case 'check-like':
        handleCheckLike();
        break;
    case 'login':
        handleLogin();
        break;
    case 'update-profile':
        handleUpdateProfile();
        break;
    case 'save-story':
        handleSaveStory();
        break;
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
}

// Get all people with like counts
function handleGetAll() {
    $data = readData();
    
    $people = [];
    foreach ($data['people'] as $person) {
        $likeCount = 0;
        foreach ($data['likes'] as $like) {
            if ($like['person_id'] === $person['id']) {
                $likeCount++;
            }
        }
        $person['likes'] = $likeCount;
        $people[] = $person;
    }
    
    echo json_encode(['success' => true, 'data' => $people]);
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

// Login handler
function handleLogin() {
    $input = json_decode(file_get_contents('php://input'), true);
    $pin = $input['pin'] ?? null;
    
    if (!$pin) {
        http_response_code(400);
        echo json_encode(['error' => 'PIN is required']);
        return;
    }
    
    $data = readData();
    
    foreach ($data['people'] as $person) {
        if ($person['pin'] === $pin) {
            // Return user data
            echo json_encode([
                'success' => true,
                'user' => [
                    'id' => $person['id'],
                    'name' => $person['name'],
                    'before' => $person['before'],
                    'after' => $person['after'] ?? '',
                    'pin' => $pin,
                    'reason_for_leaving' => $person['reason_for_leaving'] ?? '',
                    'story' => $person['story'] ?? '',
                ]
            ]);
            return;
        }
    }
    
    http_response_code(401);
    echo json_encode(['error' => 'Invalid PIN']);
}

// Update profile handler
function handleUpdateProfile() {
    $input = json_decode(file_get_contents('php://input'), true);
    $pin = $input['pin'] ?? null;
    $reasonForLeaving = $input['reason_for_leaving'] ?? '';
    $currentRole = $input['current_role'] ?? '';
    
    if (!$pin) {
        http_response_code(400);
        echo json_encode(['error' => 'PIN is required']);
        return;
    }
    
    $data = readData();
    
    foreach ($data['people'] as &$person) {
        if ($person['pin'] === $pin) {
            $person['reason_for_leaving'] = $reasonForLeaving;
            $person['after'] = $currentRole;
            writeData($data);
            
            echo json_encode([
                'success' => true,
                'message' => 'Profile updated successfully'
            ]);
            return;
        }
    }
    
    http_response_code(401);
    echo json_encode(['error' => 'Invalid PIN']);
}

// Save story handler
function handleSaveStory() {
    $input = json_decode(file_get_contents('php://input'), true);
    $pin = $input['pin'] ?? null;
    $story = $input['story'] ?? '';
    $images = $input['images'] ?? [];
    
    if (!$pin) {
        http_response_code(400);
        echo json_encode(['error' => 'PIN is required']);
        return;
    }
    
    if (!$story) {
        http_response_code(400);
        echo json_encode(['error' => 'Story is required']);
        return;
    }
    
    $data = readData();
    
    foreach ($data['people'] as &$person) {
        if ($person['pin'] === $pin) {
            $person['story'] = $story;
            $person['images'] = $images;
            $person['updated_at'] = date('Y-m-d H:i:s');
            writeData($data);
            
            echo json_encode([
                'success' => true,
                'message' => 'Story saved successfully'
            ]);
            return;
        }
    }
    
    http_response_code(401);
    echo json_encode(['error' => 'Invalid PIN']);
}
?>
