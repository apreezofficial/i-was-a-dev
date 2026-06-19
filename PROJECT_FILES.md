# iwasadev - Project Files Guide

## Frontend Files (Next.js React)

### Pages
- `app/page.tsx` - Homepage with header, hero section, and people listing
- `app/story/[id]/page.tsx` - Individual story page with detailed view and like functionality
- `app/layout.tsx` - Root layout with metadata and styling

### Components
- `components/people-directory.tsx` - Fetches and displays all stories from API
- `components/person-card.tsx` - Individual story card with like button
- `components/register-modal.tsx` - Registration form with PIN generation

### Styling & Config
- `app/globals.css` - Theme configuration with black/white colors and system preference support
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `next.config.mjs` - Next.js configuration

### Public Assets
- `public/` - Static files (icons, images)

---

## Backend Files (PHP/JSON)

**Location:** `backend/` folder

### Core Files
- **`backend/index.php`** (268 lines) - Main API handler with all endpoints
- **`backend/data.json`** (60 lines) - JSON database with stories and likes

### Documentation
- **`backend/README.md`** - Detailed API documentation and troubleshooting
- **`BACKEND_SETUP.md`** - Quick start guide for backend setup
- **`DEPLOYMENT.md`** - Complete deployment instructions

---

## API Endpoints

All endpoints are in `backend/index.php`:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/get-all` | GET | Fetch all stories |
| `/get-story` | GET | Fetch single story |
| `/register` | POST | Register new story (returns PIN) |
| `/like` | POST | Add like to story |
| `/unlike` | POST | Remove like from story |
| `/check-like` | GET | Check if device already liked |

---

## Data Flow

```
Frontend (Next.js)
       ↓
API Endpoints (index.php)
       ↓
data.json (JSON file)
       ↓
Responses back to Frontend
```

### Example: Get All Stories
1. Frontend calls: `fetch('API_BASE/get-all')`
2. Backend reads: `data.json`
3. Backend counts likes for each person
4. Backend returns: `{ success: true, data: [...] }`
5. Frontend displays stories in grid

### Example: Like a Story
1. Frontend calls: `fetch('API_BASE/like', { person_id: 'dev_001' })`
2. Backend checks device fingerprint (User-Agent + Accept-Language)
3. Backend prevents duplicate like from same device
4. Backend adds like record to data.json
5. Backend returns: `{ success: true, likes: 6 }`
6. Frontend updates UI with new count

---

## Features Implementation

### Like Tracking (Device-Based)
- **File:** `backend/index.php` - `getDeviceFingerprint()` function
- **Logic:** SHA256 hash of User-Agent + Accept-Language
- **Storage:** Each like record includes device hash in data.json
- **Result:** One like per device per story, no spam

### Story Registration
- **File:** `backend/index.php` - `handleRegister()` function
- **Input:** name, before (dev role), after (current role)
- **Output:** Unique ID, 6-digit PIN
- **Storage:** Added to data.json "people" array

### Individual Story Pages
- **File:** `app/story/[id]/page.tsx`
- **Route:** `/story/dev_001` (dynamic route with story ID)
- **Features:** Full story display, like button, back link
- **Data:** Fetched from API on page load

---

## Directory Structure

```
iwasadev/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── story/
│       └── [id]/
│           └── page.tsx
├── components/
│   ├── people-directory.tsx
│   ├── person-card.tsx
│   └── register-modal.tsx
├── public/
│   └── [assets]
├── backend/
│   ├── index.php           ← UPLOAD THIS
│   ├── data.json           ← UPLOAD THIS
│   └── README.md
├── DEPLOYMENT.md
├── BACKEND_SETUP.md
├── PROJECT_FILES.md        ← You are here
└── [other Next.js config files]
```

---

## What to Upload Where

### Backend (2 files only)
Upload to: `api.preciousadedokun.com.ng/iwasadev/`
- `backend/index.php`
- `backend/data.json`

### Frontend
Option 1: Deploy to Vercel (recommended)
- Push entire project to GitHub
- Connect Vercel to GitHub repo
- Auto-deploys on push

Option 2: Traditional hosting
- Build: `npm run build`
- Upload `.next` folder and `public` folder
- Configure Node.js

---

## Key Technologies

### Frontend
- **Next.js 16** - React framework
- **React 19** - UI library with hooks
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Lucide Icons** - Icon library

### Backend
- **PHP 5.5+** - Server language (no frameworks)
- **JSON** - Data storage (no SQL/database needed)
- **Standard Library** - No external dependencies

### Theme
- **Black & White** - Pure monochrome aesthetic
- **System Preference** - Auto light/dark mode
- **Responsive** - Mobile-first design

---

## Configuration

### Frontend API URL
Edit these files to point to your API:
- `components/people-directory.tsx` - line 15
- `components/register-modal.tsx` - line 9
- `app/story/[id]/page.tsx` - line 14

Current:
```javascript
const API_BASE = 'https://api.preciousadedokun.com.ng/iwasadev';
```

### Theme Colors
Edit `app/globals.css` for light/dark mode preferences.

---

## Deployment Checklist

- [ ] Upload `backend/index.php` to server
- [ ] Upload `backend/data.json` to server
- [ ] Set data.json permissions (chmod 644)
- [ ] Test API endpoint in browser
- [ ] Update frontend API_BASE if needed
- [ ] Deploy frontend to Vercel or server
- [ ] Test registration
- [ ] Test likes
- [ ] Test story pages
- [ ] Test on mobile
- [ ] Test dark mode
- [ ] Set up backups

---

## Support

**Built by:** Precious Adedokun
**Portfolio:** https://preciousadedokun.com.ng

For questions about specific files or features, refer to:
- `DEPLOYMENT.md` - Deployment guide
- `BACKEND_SETUP.md` - Backend quick start
- `backend/README.md` - API documentation
