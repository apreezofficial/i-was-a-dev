# Complete iwasadev Features Guide

## New Features Added

### 1. User Authentication & Login
- **Login Page** (`/login`): Users enter their 6-digit PIN to access their profile
- PIN validation against backend database
- Persistent session using localStorage
- Logout functionality

### 2. Dashboard System
- **Protected Dashboard** (`/dashboard`): Only accessible to logged-in users
- Tab navigation between "Why I Left" and "My Story"
- User welcome message with name
- Session management and auto-redirect

### 3. Profile Management ("Why I Left" Tab)
- **Reason for Leaving**: Users explain why they left development
- **Current Role**: Users specify what they do now
- Save to backend with PIN verification
- Success/error feedback

### 4. Advanced Story Editor ("My Story" Tab)
- **Rich Text Editing**: Full textarea for writing stories
- **AI-Powered Story Drafting**: Click "Ask AI to Draft" to generate initial story
  - Uses Groq API for AI generation
  - Creates authentic, inspiring career transition narratives
  - Users can edit and customize the AI-generated content
- **Image Upload**: Add multiple images to stories
  - Upload directly from device
  - Preview images in a grid layout
  - Remove images with one click
  - Images stored as base64 in database
- **Character Counter**: Shows story length in real-time
- **Save Story**: Persist story and images to backend

### 5. AI Integration with Groq
- **API Endpoint**: `/api/draft-story`
- **Model**: Groq Mixtral 8x7b (fast, affordable, high-quality)
- **Use Case**: Generate inspiring career transition stories
- **Prompt**: Customizable based on reason for leaving and current role
- **Response**: ~200-300 word authentic story draft

## File Structure

```
app/
├── login/page.tsx              # Login page
├── dashboard/page.tsx          # Protected dashboard
└── api/
    └── draft-story/route.ts    # AI story drafting API

components/
├── reason-form.tsx             # Profile update form
├── story-editor.tsx            # Advanced story editor
├── register-modal.tsx           # Registration modal (existing)
└── ... other components

backend/
├── index.php                   # Updated with new endpoints
└── data.json                   # JSON database
```

## New Backend Endpoints

### 1. Login (`/login`)
```json
POST /login
{
  "pin": "123456"
}

Response:
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "before": "Frontend Developer",
    "after": "Product Manager",
    "pin": "123456",
    "reason_for_leaving": "...",
    "story": "..."
  }
}
```

### 2. Update Profile (`/update-profile`)
```json
POST /update-profile
{
  "pin": "123456",
  "reason_for_leaving": "I wanted to focus on product strategy...",
  "current_role": "Product Manager"
}

Response:
{
  "success": true,
  "message": "Profile updated successfully"
}
```

### 3. Save Story (`/save-story`)
```json
POST /save-story
{
  "pin": "123456",
  "story": "Long story text...",
  "images": ["data:image/png;base64,...", "..."]
}

Response:
{
  "success": true,
  "message": "Story saved successfully"
}
```

## How It Works

### User Journey

1. **Register** (Homepage)
   - Fill out name, previous role, current role
   - Get 6-digit PIN

2. **Login** (/login)
   - Enter PIN
   - Redirected to dashboard

3. **Update Profile** (Dashboard > Why I Left tab)
   - Write reason for leaving
   - Specify current role
   - Save

4. **Write Story** (Dashboard > My Story tab)
   - Type story manually OR
   - Click "Ask AI to Draft" for AI-generated content
   - Add images
   - Save

5. **View Profile** (Homepage listing)
   - Story appears in the public listing
   - Others can like and view full story

## Environment Variables

```
GROQ_API_KEY=your_groq_api_key_here
```

Set this in your project's environment variables section.

## AI Story Generation Details

### Prompt Structure
```
I stopped being a developer because: [reason]
Now I work as: [current_role]

Please write an inspiring and authentic story (200-300 words)...
```

### Why Groq?
- Fast inference (low latency)
- Cost-effective
- High-quality outputs with Mixtral 8x7b
- Perfect for real-time user-facing features

### Customization
Edit the prompt in `/app/api/draft-story/route.ts` to change:
- Story length
- Tone and style
- Required sections
- Output format

## Image Handling

- Upload as JPEG, PNG, WebP
- Converted to base64 for storage
- No file size limits enforced (but recommended < 5MB per image)
- Stored in data.json
- Can be displayed directly in stories

## Security Considerations

- PIN verification on all profile endpoints
- No authentication middleware (PIN-based)
- CORS enabled for frontend access
- Input validation on backend

## Testing

### Login Test
1. Go to `/login`
2. Use any generated PIN from registration
3. Should redirect to dashboard on success

### Story Draft Test
1. Go to dashboard > My Story tab
2. Click "Ask AI to Draft"
3. Should generate a story within 10 seconds

### Upload Test
1. Click "Add Images"
2. Select image from device
3. Image appears in preview grid
4. Click X to remove

## Troubleshooting

### Login Not Working
- Verify PIN is exactly 6 digits
- Check backend is running at api.preciousadedokun.com.ng
- Check console for error messages

### AI Draft Not Generating
- Verify GROQ_API_KEY is set in environment
- Check Groq account has remaining quota
- Try again (may be rate-limited)

### Images Not Uploading
- Check file size (< 100MB for now)
- Ensure browser allows file input
- Try different image format (JPEG/PNG)

## Future Enhancements

- Social sharing (Twitter, LinkedIn)
- Story editing history
- Comments and discussions
- Email notifications
- Video uploads
- Multiple story types (career pivot, entrepreneurship, etc.)
