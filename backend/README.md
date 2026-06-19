# iwasadev Backend API

Pure PHP backend with JSON database for the iwasadev platform.

## Installation

1. Upload both files to your server:
   - `index.php` - Main API handler
   - `data.json` - JSON database file

2. Make sure `data.json` is writable by the web server:
   ```bash
   chmod 644 data.json
   ```

3. Update the frontend API URL in the React components to point to your server:
   - Change `https://api.preciousadedokun.com.ng/iwasadev` to your actual API endpoint

## API Endpoints

All responses are in JSON format. CORS is enabled for all origins.

### Get All Stories
**Endpoint:** `GET /get-all`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "dev_001",
      "name": "Sarah Chen",
      "before": "Full-Stack Developer (10 yrs)",
      "after": "Product Manager @ Tech Startup",
      "likes": 5
    }
  ]
}
```

### Get Single Story
**Endpoint:** `GET /get-story?id=dev_001`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "dev_001",
    "name": "Sarah Chen",
    "before": "Full-Stack Developer (10 yrs)",
    "after": "Product Manager @ Tech Startup",
    "likes": 5,
    "created_at": "2024-01-15 10:30:00"
  }
}
```

### Register New Story
**Endpoint:** `POST /register`

**Request Body:**
```json
{
  "name": "John Doe",
  "before": "Backend Engineer (5 years)",
  "after": "Startup Founder"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Story registered successfully",
  "id": "dev_007",
  "pin": "123456"
}
```

### Like a Story
**Endpoint:** `POST /like`

**Request Body:**
```json
{
  "person_id": "dev_001"
}
```

**Response:**
```json
{
  "success": true,
  "likes": 6,
  "message": "Like added"
}
```

**Note:** Each device can only like once. The API tracks devices using a SHA256 hash of User-Agent and Accept-Language headers.

### Unlike a Story
**Endpoint:** `POST /unlike`

**Request Body:**
```json
{
  "person_id": "dev_001"
}
```

**Response:**
```json
{
  "success": true,
  "likes": 5,
  "message": "Like removed"
}
```

### Check if Device Liked Story
**Endpoint:** `GET /check-like?person_id=dev_001`

**Response:**
```json
{
  "liked": true
}
```

## Data Structure

### data.json Format

```json
{
  "people": [
    {
      "id": "dev_001",
      "name": "Sarah Chen",
      "before": "Full-Stack Developer (10 yrs)",
      "after": "Product Manager @ Tech Startup",
      "pin": "$2y$10$hashedpinhere",
      "created_at": "2024-01-15 10:30:00"
    }
  ],
  "likes": [
    {
      "person_id": "dev_001",
      "device": "sha256_hash_of_device_fingerprint",
      "liked_at": "2024-01-15 10:35:00"
    }
  ]
}
```

## Like Tracking System

The API prevents duplicate likes using device fingerprinting:
- Each device is identified by a SHA256 hash of its User-Agent and Accept-Language headers
- A device can only like each story once
- Users can unlike stories using the same device
- Different devices/browsers will have different fingerprints, so users can like from multiple devices

## Error Handling

### Already Liked
```json
{
  "error": "You have already liked this story"
}
```
HTTP Status: 400

### Story Not Found
```json
{
  "error": "Story not found"
}
```
HTTP Status: 404

### Missing Fields
```json
{
  "error": "Missing required fields"
}
```
HTTP Status: 400

## Security Features

1. **Data Sanitization:** User inputs are escaped with `htmlspecialchars()`
2. **Password Hashing:** PINs are hashed with bcrypt (PASSWORD_DEFAULT)
3. **CORS:** Enabled for all origins to allow frontend requests
4. **Device Fingerprinting:** Prevents duplicate likes per device

## Database Backup

Regularly backup `data.json` to prevent data loss. Since it's a JSON file, you can:
- Keep a copy on your local machine
- Use FTP/SFTP to download periodically
- Implement automated backups via cron jobs

## Maintenance

### Add New Story Manually
Edit `data.json` and add to the `people` array:

```json
{
  "id": "dev_007",
  "name": "New Person",
  "before": "Developer Role",
  "after": "New Career",
  "pin": "$2y$10$hashedpin",
  "created_at": "2024-01-20 12:00:00"
}
```

### Clear All Likes
Remove all entries from the `likes` array in `data.json`.

### Generate PIN for Testing
```bash
# In PHP CLI:
echo password_hash("123456", PASSWORD_DEFAULT);
```

## Troubleshooting

### 404 Not Found
- Check that `.htaccess` is configured correctly for URL rewriting (if needed)
- Ensure the endpoint path is correct in frontend

### data.json Permission Error
- Run: `chmod 777 data.json` (less secure)
- Or ensure web server user owns the file

### CORS Errors
- The API already sends proper CORS headers
- Check browser console for specific errors

## Frontend Integration

The frontend automatically:
1. Fetches all stories on page load
2. Checks if each story was liked by the current device
3. Sends like/unlike requests with device fingerprinting
4. Displays updated like counts in real-time

Update the `API_BASE` constant in React components to match your server URL.
