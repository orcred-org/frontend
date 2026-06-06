# Testing Guide - Frontend Changes

## Quick Start (3 steps)

### Step 1: Clone Backend
```bash
cd /Users/pragathii
git clone https://github.com/orcred-org/backend.git
cd backend && npm install
```

### Step 2: Start Both Servers
```bash
# Terminal 1: Backend on port 3001
cd /Users/pragathii/backend
npm run dev

# Terminal 2: Frontend on port 3000
cd /Users/pragathii/frontend
npm run dev
```

### Step 3: Visit Dashboard
Open: **http://localhost:3000/dashboard/auth**

---

## What You'll See (Right Now)

### Login Page (Already Built ✅)
![What's visible]
- Orcred logo in orange
- "Enter your email to receive a login link" description
- Email input field with proper styling
- "Send Login Link" button (orange background)
- "First time here?" link at bottom

**Try it:** Type in your email and click the button
- Frontend will call `http://localhost:3001/api/v1/auth/magic-link`
- If backend is running → Check backend terminal for logs
- If backend NOT running → See "Failed to fetch" error (expected)

---

## Testing Checklist by Feature

### ✅ Design System Applied
Open DevTools (Cmd+Option+I) → Inspect element
- [ ] Background is warm cream (#faf7f2)
- [ ] Text is dark (#0f0d0c)
- [ ] Orange accents (#eb4511) on logo and button
- [ ] Button is pill-shaped (50px border radius)
- [ ] Card has 2px border (sharp edge, not rounded)
- [ ] Font is Inter (not serif)

### ✅ Responsive Layout
- [ ] On desktop (1400px max): form centered, good spacing
- [ ] On mobile (320px): form is readable, padding adjusts
- [ ] Try resizing browser → No overflow, responsive units

### ✅ Auth Page Functionality (needs backend)
- [ ] Enter email → "Send Login Link" button enabled
- [ ] Click button → Button shows "Sending..."
- [ ] Success → Shows "Check your email" message
- [ ] Error → Shows error text (if backend returns error)

### ✅ Role-Based Routing (needs backend + login)
- [ ] Visit `/dashboard` → Gets redirected
- [ ] After login as student → Goes to `/dashboard/student`
- [ ] After login as reviewer → Goes to `/dashboard/reviewer`
- [ ] After login as admin → Goes to `/dashboard/admin`

---

## Visual Reference - What Each Page Looks Like

### /dashboard/auth (Login Page)
```
┌─────────────────────────────────────┐
│                                     │
│         Orcred (orange)             │
│  Enter your email to receive a      │
│  login link                         │
│                                     │
│  Email Address                      │
│  ┌─────────────────────────────────┐│
│  │ you@example.com                 ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │ SEND LOGIN LINK  (orange pill)  ││
│  └─────────────────────────────────┘│
│                                     │
│  First time here? Learn about...   │
│                                     │
└─────────────────────────────────────┘
```

### /dashboard/student (Student Home - State 1: New)
```
┌─────────────────────────────────────┐
│ Orcred                              │  ← Header with logo
│ Welcome back, [Name]                │
├─────────────────────────────────────┤
│                                     │
│ ● Start Your Verification           │  ← Section label with dot
│                                     │
│ ╔─────────────────────────────────╗│
│ ║ Generate Your Project Idea      ║│
│ ║                                 ║│
│ ║ Not sure what to build? Let     ║│
│ ║ our AI help you generate a      ║│
│ ║ project idea...                 ║│
│ ║                                 ║│
│ ║ [GENERATE PROJECT IDEA] (button)║│
│ ╚─────────────────────────────────╝│
│                                     │
└─────────────────────────────────────┘
```

### /dashboard/student (State 2: Has Saved Idea)
```
┌─────────────────────────────────────┐
│ Orcred                              │
│ Welcome back, [Name]                │
├─────────────────────────────────────┤
│                                     │
│ ● Your Project                      │
│                                     │
│ ┌─────────────────────────────────┐│
│ │ AI Model Fine-Tuning Platform  ││
│ │ PyTorch, LangChain, FastAPI     ││
│ │                                 ││
│ │ [APPLY] [GENERATE NEW]          ││
│ └─────────────────────────────────┘│
│                                     │
└─────────────────────────────────────┘
```

---

## Browser DevTools Inspection

### Check Network Requests
1. Open DevTools → Network tab
2. Type email and click "Send Login Link"
3. Look for request to: `POST http://localhost:3001/api/v1/auth/magic-link`
4. Click on request → Response tab
5. Should see JSON like: `{ "sent": true }` or `{ "error": "..." }`

### Check Console for Errors
1. DevTools → Console tab
2. Should be no red errors (warnings are okay)
3. If error, it will show the fetch failure clearly

### Check Styles Applied
1. DevTools → Elements/Inspector
2. Click on email input field
3. In Styles panel, scroll down
4. Should see `background-color: var(--bg-page)` applied
5. Verify CSS variables are working

---

## API Endpoint Testing

### Test Backend is Running
```bash
curl http://localhost:3001/api/v1/health
# Should return: 200 OK
```

### Test Magic Link Endpoint
```bash
curl -X POST http://localhost:3001/api/v1/auth/magic-link \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Should return: { "sent": true } or error
```

### Test Auth Check
```bash
curl http://localhost:3001/api/v1/auth/me \
  -H "Cookie: session=<token>"

# Should return: { "id": "...", "account_type": "student" } or 401
```

---

## Troubleshooting

### Issue: "Failed to fetch" when clicking button
**Cause:** Backend not running
**Fix:** 
```bash
cd /Users/pragathii/backend
npm run dev
# Check it says: ▲ Next.js 16.2.6 - Local: http://localhost:3001
```

### Issue: CORS error in console
**Cause:** Backend not sending CORS headers for localhost:3000
**Fix:** Ask Shatrujay to check backend CORS config for localhost:3000

### Issue: Page redirects immediately to /dashboard/auth
**Cause:** `/api/v1/auth/me` returning 401 (not authenticated)
**Fix:** This is expected! You haven't logged in yet. Enter email first.

### Issue: Styling looks wrong (wrong colors/layout)
**Cause:** CSS variables not applied or Tailwind config not loaded
**Fix:**
```bash
# Rebuild Tailwind
npm run build

# Or restart dev server
npm run dev
```

### Issue: Form won't submit
**Cause:** Email validation failing
**Fix:** Make sure you enter a valid email format (test@example.com)

---

## Performance Checklist

### Page Load Time
- [ ] `/dashboard/auth` loads in < 500ms
- [ ] No layout shift when page loads
- [ ] Fonts load smoothly (check Network tab for font files)

### Interaction Responsiveness
- [ ] Typing in email field is instant
- [ ] Button click shows "Sending..." state immediately
- [ ] No lag or frozen UI

### Mobile Testing
- [ ] Resize browser to 375px width (mobile)
- [ ] Form still readable
- [ ] Button still clickable
- [ ] Text not cut off

---

## What to Share When Something Breaks

If you hit an issue, collect:

1. **Screenshot of error** (copy from browser or DevTools)
2. **Backend logs** (last 10 lines from `npm run dev`)
3. **Frontend console error** (red text in DevTools Console)
4. **URL you were visiting** (e.g., localhost:3000/dashboard/auth)
5. **What you clicked/did** (e.g., "entered email and clicked button")

Example:
```
I was at http://localhost:3000/dashboard/auth
Entered "test@example.com"
Clicked "Send Login Link"
Got error in console: "TypeError: fetch is not defined"
Backend log shows: "POST /api/v1/auth/magic-link 404"
```

---

## Next Steps After Testing

Once login works end-to-end:
1. Build student profile page
2. Build project generator UI
3. Build application form (4 steps)
4. Build reviewer dashboard
5. Build admin dashboard

Each will follow the same pattern:
- Design page in frontend with design system
- Wire up to backend API endpoints
- Test end-to-end with both servers running
