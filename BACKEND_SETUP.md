# Backend Setup - Quick Start

## Files to Upload

You need to upload **only 2 files** to your server:

```
/backend/index.php          ← API handler (268 lines)
/backend/data.json          ← Database file (60 lines)
```

## Upload Location

Upload both files to:
```
https://api.preciousadedokun.com.ng/iwasadev/
```

So the full URLs will be:
- `https://api.preciousadedokun.com.ng/iwasadev/index.php`
- `https://api.preciousadedokun.com.ng/iwasadev/data.json`

## After Upload

1. Set file permissions for data.json:
   ```bash
   chmod 644 data.json
   ```

2. Test the API by visiting:
   ```
   https://api.preciousadedokun.com.ng/iwasadev/get-all
   ```
   
   Should return JSON with the 6 demo stories.

3. That's it! Your backend is ready.

## What Each File Does

### index.php
- Handles all API requests
- Manages like/unlike with device fingerprinting
- Registers new stories with PIN generation
- Returns JSON responses
- Handles CORS for frontend communication

### data.json
- Stores all developer stories
- Stores all likes with device tracking
- Automatically updated by index.php when:
  - New story is registered
  - Someone likes/unlikes a story

## How It Works

1. **Frontend** (Next.js React app) sends requests to:
   - `/get-all` → fetch all stories
   - `/register` → submit new story
   - `/like` → add like
   - `/unlike` → remove like
   - `/check-like` → check if device already liked

2. **Backend** (index.php) processes requests and updates data.json

3. **Device Tracking** ensures one like per device:
   - Uses User-Agent + Accept-Language header
   - SHA256 hashed for storage
   - Different browsers/devices = different fingerprints

## Initial Data

data.json comes with 6 demo stories:
- Sarah Chen - Product Manager
- Marcus Johnson - Founder
- Elena Rodriguez - UX Designer
- David Kim - Solutions Architect
- Sophie Laurent - Tech Writer
- James Wilson - Business Consultant

## That's All!

Your backend is a simple, powerful system:
- ✅ No database setup needed
- ✅ No dependencies
- ✅ Pure PHP
- ✅ Self-contained JSON storage
- ✅ One-time like tracking per device
- ✅ Automatic data persistence

The frontend will automatically connect and work perfectly.

---

## Frontend Integration

Make sure the frontend has the correct API URL:

In these files, update `API_BASE`:
- `components/people-directory.tsx`
- `components/register-modal.tsx`  
- `app/story/[id]/page.tsx`

Current setting:
```javascript
const API_BASE = 'https://api.preciousadedokun.com.ng/iwasadev';
```

Change only if your API is on a different domain.

---

## Maintenance

### Backup Your Data
```bash
scp user@api.preciousadedokun.com.ng:iwasadev/data.json ./backup/
```

### Add Stories Manually
Edit data.json directly - add a new object to the "people" array.

### Clear Likes
Set `"likes": []` in data.json to empty the likes array.

### Monitor Traffic
Check server logs for API requests to monitor activity.

---

That's everything! Upload those 2 files and you're done. ✨
