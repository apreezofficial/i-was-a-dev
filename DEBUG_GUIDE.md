# iWasADev - Debugging Guide

## Error: "Error registering. Please try again."

This error means the frontend cannot connect to the backend API. Here's how to fix it:

### Step 1: Check Browser Console
1. Open DevTools (F12 or Right-click → Inspect)
2. Go to the **Console** tab
3. Try registering again
4. Look for `[v0]` logs showing:
   - The registration data being sent
   - Response status code
   - The actual error from the API

### Step 2: Verify Backend is Running

**Test the backend with curl:**

```bash
# Test if backend responds
curl -X GET https://api.preciousadedokun.com.ng/iwasadev/get-all

# Should return: {"success":true,"data":[...]}
```

If you get a 404 or connection refused:
- Backend is not deployed yet
- File path is wrong
- PHP is not configured correctly

### Step 3: Check API Endpoint

The frontend expects the API at:
```
https://api.preciousadedokun.com.ng/iwasadev
```

**Files must be in this directory:**
```
api.preciousadedokun.com.ng/
└── iwasadev/
    ├── index.php
    └── data.json
```

### Step 4: Verify Backend Files

Inside `index.php`, check these are present:

```php
header('Access-Control-Allow-Origin: *');  // CORS headers required
```

The data.json must be writable:
```bash
chmod 666 /path/to/data.json
```

### Step 5: Test Locally First

Before uploading to production, test locally:

```bash
# Start a local PHP server
cd backend/
php -S localhost:8000

# In another terminal, test the API
curl -X POST http://localhost:8000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","before":"Dev","after":"Manager"}'

# Should return: {"success":true,"id":"dev_xxx","pin":"123456"}
```

### Step 6: Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| `CORS error` | Add `header('Access-Control-Allow-Origin: *');` to index.php |
| `data.json` not found | Create it in same directory as index.php with initial data |
| `file_put_contents` fails | Make data.json writable: `chmod 666 data.json` |
| `json_decode` error | Ensure data.json is valid JSON |
| `404 Endpoint not found` | Check routing logic in index.php - action must match case statement |

### Step 7: Check Network Tab

1. Open DevTools → **Network** tab
2. Click Register button
3. Look for the `register` request
4. Click it and check:
   - **Headers**: See request details
   - **Response**: See server response
   - **Status**: Should be 200 if successful

### Step 8: Enable Detailed Logging

Add this to the top of `backend/index.php` to log all requests:

```php
error_log("Request: " . $_SERVER['REQUEST_METHOD'] . " " . $_SERVER['REQUEST_URI']);
error_log("Body: " . file_get_contents('php://input'));
```

Then check your server's error log:
```bash
tail -f /var/log/php-errors.log
# or
tail -f /var/log/apache2/error.log
```

## Quick Checklist

- [ ] Backend files uploaded to `api.preciousadedokun.com.ng/iwasadev/`
- [ ] `index.php` contains CORS headers
- [ ] `data.json` exists and is writable
- [ ] Can access `https://api.preciousadedokun.com.ng/iwasadev/get-all` in browser
- [ ] Browser console shows `[v0]` logs with status 200
- [ ] Response contains `"success":true`

## API Endpoints Reference

All endpoints return JSON responses.

### GET /get-all
Returns all registered stories with like counts.

**Request:**
```
GET /get-all
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "dev_123",
      "name": "Sarah Chen",
      "before": "Full-Stack Developer",
      "after": "Product Manager",
      "likes": 45,
      "created_at": "2024-01-15 10:30:00"
    }
  ]
}
```

### POST /register
Registers a new story and generates a PIN.

**Request:**
```json
{
  "name": "John Doe",
  "before": "Backend Engineer",
  "after": "Tech Lead"
}
```

**Response:**
```json
{
  "success": true,
  "id": "dev_xyz",
  "pin": "123456"
}
```

### POST /like
Likes a story (once per device).

**Request:**
```json
{
  "person_id": "dev_123"
}
```

**Response:**
```json
{
  "success": true,
  "likes": 46
}
```

### GET /check-like
Checks if current device already liked a story.

**Request:**
```
GET /check-like?person_id=dev_123
```

**Response:**
```json
{
  "liked": true
}
```

## Still Having Issues?

1. Check the browser DevTools **Console** tab for `[v0]` debug messages
2. Check the **Network** tab for actual request/response
3. Verify backend logs in `/var/log/php-errors.log`
4. Test the API directly with curl or Postman
5. Ensure JSON in data.json is valid: use `jq data.json` to validate

