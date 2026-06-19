# iwasadev - Complete Deployment Guide

## Project Overview

**iwasadev** is a platform celebrating developers who've transitioned careers. It consists of:
- **Frontend:** Next.js React app (modern, black & white theme, system color preference support)
- **Backend:** Pure PHP with JSON database (no external dependencies)

---

## Backend Setup (PHP/JSON)

### Step 1: Prepare Files
The backend requires only 2 files:
- `backend/index.php` - API handler
- `backend/data.json` - JSON database

### Step 2: Upload to Server
1. Access your web hosting via FTP/File Manager
2. Navigate to: `api.preciousadedokun.com.ng/iwasadev/`
3. Upload both files:
   ```
   api.preciousadedokun.com.ng/iwasadev/
   ├── index.php
   └── data.json
   ```

### Step 3: Set File Permissions
Make `data.json` writable:
```bash
chmod 644 data.json
```

### Step 4: Test the API
Visit in your browser:
```
https://api.preciousadedokun.com.ng/iwasadev/get-all
```

Should return JSON data like:
```json
{
  "success": true,
  "data": [...]
}
```

---

## Frontend Setup (Next.js)

### Option A: Deploy to Vercel (Recommended)
1. Push your Next.js code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" → Import your GitHub repo
4. Deploy automatically

### Option B: Deploy to Standard Hosting
1. Run production build:
   ```bash
   npm run build
   ```
2. Upload the `.next` folder and `public` folder to your server
3. Configure Node.js to run the app
4. Set environment if needed

### Step 3: Update API URL
In your React components, ensure the API URL is correct:

Search for: `API_BASE`

In these files:
- `components/people-directory.tsx`
- `components/register-modal.tsx`
- `app/story/[id]/page.tsx`

Change from:
```javascript
const API_BASE = 'https://api.preciousadedokun.com.ng/iwasadev';
```

To your actual backend URL if different.

---

## API Endpoints Reference

All endpoints return JSON and support CORS.

### 1. Get All Stories
```
GET /api/iwasadev/get-all
```
Returns list of all developer stories with like counts.

### 2. Get Single Story
```
GET /api/iwasadev/get-story?id=dev_001
```
Returns detailed story page data.

### 3. Register New Story
```
POST /api/iwasadev/register
Body: {
  "name": "John Doe",
  "before": "Backend Engineer",
  "after": "Product Manager"
}
```
Returns generated PIN for the user.

### 4. Like a Story
```
POST /api/iwasadev/like
Body: { "person_id": "dev_001" }
```
Adds like from current device (one per device).

### 5. Unlike a Story
```
POST /api/iwasadev/unlike
Body: { "person_id": "dev_001" }
```
Removes like from current device.

### 6. Check If Liked
```
GET /api/iwasadev/check-like?person_id=dev_001
```
Returns `{"liked": true/false}`.

---

## Data Format

### data.json Structure
```json
{
  "people": [
    {
      "id": "dev_001",
      "name": "Sarah Chen",
      "before": "Full-Stack Developer (10 yrs)",
      "after": "Product Manager @ Tech Startup",
      "pin": "$2y$10$hashedpin",
      "created_at": "2024-01-15 10:30:00"
    }
  ],
  "likes": [
    {
      "person_id": "dev_001",
      "device": "sha256_hash",
      "liked_at": "2024-01-15 10:35:00"
    }
  ]
}
```

---

## Features

### Like System
- **Device-based tracking:** Uses device fingerprint (User-Agent + Accept-Language)
- **One like per device:** Users can't spam likes from the same device
- **Cross-device support:** Same user can like from different devices/browsers
- **Like counts:** Displayed on listing and story pages

### Registration Flow
1. User fills form (name, previous dev role, current role)
2. API generates unique 6-digit PIN
3. PIN is hashed and stored in data.json
4. User receives PIN for future login

### Story Pages
- Individual story view with detailed info
- Like button with real-time count
- Separate like tracking per story
- Back to listing navigation

---

## Theme Support

The frontend automatically adapts to system preferences:
- **Light mode:** White background, black text
- **Dark mode:** Near-black background, off-white text
- Users can toggle in their OS settings, and the site updates automatically

---

## Maintenance & Backups

### Backup data.json
```bash
# Download via FTP
# Or SSH:
scp user@server:iwasadev/data.json ./backup/data.json-$(date +%Y%m%d).json
```

### Add Story Manually
Edit `data.json` and add to `people` array with new ID and timestamp.

### Clear All Likes
Set `"likes": []` in data.json and save.

---

## Troubleshooting

### API Returns 404
- Check URL is correct
- Verify PHP file exists on server
- Check file permissions

### Likes Not Saving
- Ensure `data.json` is writable
- Check file permissions: `chmod 644 data.json`

### Frontend Can't Connect to API
- Check CORS headers are sent (index.php does this automatically)
- Verify API URL in components
- Check browser console for errors

### Stories Not Loading
- Verify `data.json` exists
- Check data.json is valid JSON (use JSON validator)
- Ensure API returns success in response

---

## Security Notes

1. **PIN Hashing:** PINs are bcrypt hashed before storage
2. **Input Sanitization:** User inputs are escaped with htmlspecialchars()
3. **Device Fingerprinting:** Prevents like spam from same device
4. **CORS Enabled:** Allows frontend-backend communication
5. **No External Dependencies:** Pure PHP (PHP 5.5+)

---

## Environment Details

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **Backend:** PHP 5.5+, JSON flat file database
- **Database:** data.json (no SQL required)
- **Styling:** Pure black and white theme with system color preference
- **Mobile:** Fully responsive design

---

## Support & Portfolio

Built by: **Precious Adedokun**
Portfolio: [preciousadedokun.com.ng](https://preciousadedokun.com.ng)

---

## Quick Checklist

- [ ] Upload backend files (index.php, data.json) to API server
- [ ] Set data.json permissions to 644
- [ ] Test API endpoint in browser
- [ ] Update frontend API_BASE URL to your backend URL
- [ ] Deploy frontend to Vercel or your server
- [ ] Test registration flow
- [ ] Test like functionality
- [ ] Verify story pages load correctly
- [ ] Test on mobile and dark mode
- [ ] Set up automated backups for data.json
