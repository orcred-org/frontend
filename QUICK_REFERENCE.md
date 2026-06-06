# Quick Reference - Frontend Changes & Testing

## URLs to Visit (Right Now)

| URL | What You'll See | What Works | What Needs Backend |
|-----|---|---|---|
| http://localhost:3000/ | Landing page | ✅ Yes | N/A |
| http://localhost:3000/dashboard/auth | **Login form** (this is what we built) | ✅ UI loaded | 🔲 Email sending |
| http://localhost:3000/dashboard | Redirect logic | ✅ Redirects to auth | 🔲 Role checking |
| http://localhost:3000/dashboard/student | Student home (5-state) | ✅ UI loaded | 🔲 Data fetching |
| http://localhost:3000/dashboard/reviewer | Reviewer home | ✅ UI loaded | 🔲 Data fetching |
| http://localhost:3000/dashboard/admin | Admin home | ✅ UI loaded | 🔲 Data fetching |

---

## Start Here (Copy-Paste Commands)

```bash
# Terminal 1: Backend API Server
cd /Users/pragathii/backend
npm install  # first time only
npm run dev
# Wait for: ▲ Next.js - Local: http://localhost:3001

# Terminal 2: Frontend Dashboard
cd /Users/pragathii/frontend
npm run dev
# Wait for: ▲ Next.js - Local: http://localhost:3000

# Terminal 3 (or browser): Visit Dashboard
open http://localhost:3000/dashboard/auth
```

---

## What I Just Built (Files to Inspect)

### UI Pages
```
/app/dashboard/auth/page.tsx          → Login form with email input
/app/dashboard/student/page.tsx       → Student dashboard (5 states)
/app/dashboard/page.tsx               → Role-based redirector
```

### Styling
```
/tailwind.config.ts                   → Colors, typography, spacing
/app/globals.css                      → CSS variables
```

### API/Utilities
```
/lib/api.ts                           → Typed API client
/lib/types.ts                         → TypeScript interfaces
/lib/utils.ts                         → Helper functions
```

---

## Visual Tour - What You're Looking At

### Login Page (`/dashboard/auth`)
When you visit this page, you see:
- **Logo** "Orcred" in orange (#eb4511) at top
- **Description** "Enter your email to receive a login link"
- **Email input** with cream background (#f5f1e9)
- **Button** "SEND LOGIN LINK" in orange pill shape
- **Footer** "First time here?" link to landing page

**Interactive:**
- Type email → Button becomes enabled
- Click button → Shows "Sending..." state
- Success → Shows "Check your email" message
- Click "Send another link" → Back to form

### Student Dashboard (`/dashboard/student`)
Shows 5 different states depending on application progress:

**State 1: New (No project)**
```
Generate Your Project Idea
[Button] GENERATE PROJECT IDEA
```

**State 2: Has Project Idea**
```
Your Project
Project Name: AI Model Fine-Tuning
Tech Stack: PyTorch, LangChain
[Button] APPLY FOR VERIFICATION [Button] GENERATE NEW IDEA
```

**State 3: Applied (Awaiting Reviewer)**
```
Application Status
Status: Submitted
(Progress tracker showing 5 steps)
```

**State 4: Scheduled (Review Date Set)**
```
Application Status
Status: Scheduled
Review Date: June 15, 2026 at 10:00 AM
[Button] JOIN SESSION
```

**State 5: Completed (Passed)**
```
Orcred Credential
Score: 75
[Button] DOWNLOAD CERTIFICATE [Button] ADD TO LINKEDIN
```

---

## Testing Workflow

### 1. Quick Visual Check (No Backend Needed)
```bash
npm run dev
open http://localhost:3000/dashboard/auth

# Look for:
# ✅ Orange colors applied
# ✅ Cream background
# ✅ Form centered on page
# ✅ Button is pill-shaped
# ✅ Text is readable
```

### 2. Responsive Check
```bash
# In browser:
# 1. Open DevTools (Cmd+Option+I)
# 2. Toggle device toolbar (Cmd+Shift+M)
# 3. Test on iPhone 12 (390px width)
# ✅ Form should be responsive
# ✅ Button should be tappable
```

### 3. API Connection Check (Needs Backend)
```bash
# Make sure backend is running on localhost:3001
# Then test:

# Open DevTools → Console tab
# Type and enter:
fetch('http://localhost:3001/api/v1/health')
  .then(r => r.json())
  .then(console.log)

# Should log: { "status": "ok" }
```

### 4. Full Auth Flow (Needs Backend + Supabase)
```bash
# 1. Go to http://localhost:3000/dashboard/auth
# 2. Enter your email
# 3. Click "Send Login Link"
# 4. Check email for link from Resend
# 5. Click link → Should redirect to /dashboard
# 6. Should then go to /dashboard/student
# ✅ Full flow works!
```

---

## Build Verification

The build was successful. Check with:
```bash
npm run build

# Should show:
# ✓ Compiled successfully
# ├ ○ /
# ├ ○ /dashboard/auth
# ├ ○ /dashboard/student
# ├ ○ /dashboard/reviewer
# ├ ○ /dashboard/admin
# └ ○ /dashboard
```

---

## Files Changed Summary

```
Created:
  app/dashboard/auth/page.tsx         (485 lines)
  app/dashboard/student/page.tsx      (180 lines)
  app/dashboard/reviewer/page.tsx     (40 lines)
  app/dashboard/admin/page.tsx        (40 lines)
  app/dashboard/layout.tsx            (15 lines)
  app/dashboard/page.tsx              (45 lines)
  lib/api.ts                          (120 lines)
  lib/types.ts                        (100 lines)
  lib/utils.ts                        (60 lines)
  .env.example                        (7 lines)
  SETUP_LOCAL_DEV.md                  (Documentation)

Modified:
  tailwind.config.ts                  (Config updated)
  app/globals.css                     (Complete rewrite)

Total: ~1000+ lines of new code
```

---

## Architecture (How Data Flows)

```
User's Browser
    ↓
Frontend (localhost:3000)
    ├─ User sees login form
    ├─ Types email
    ├─ Clicks button
    ↓
Backend (localhost:3001)
    ├─ Receives POST /api/v1/auth/magic-link
    ├─ Validates email with Supabase
    ├─ Calls Resend to send email
    ├─ Returns { "sent": true }
    ↓
Frontend receives response
    ├─ Shows "Check your email" message
    ├─ User clicks link in email
    ↓
Backend validates magic link token
    ├─ Creates session
    ├─ Redirects to /dashboard
    ↓
Frontend checks /api/v1/auth/me
    ├─ Gets user role (student/reviewer/admin)
    ├─ Redirects to correct dashboard
    ↓
User lands on role-specific page
    ├─ Student → /dashboard/student
    ├─ Reviewer → /dashboard/reviewer
    └─ Admin → /dashboard/admin
```

---

## Environment Variables Needed

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_DEBUG=true
```

### Backend (.env.local)
Ask Shatrujay for these:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
ANTHROPIC_API_KEY=
ADMIN_IP_ALLOWLIST=127.0.0.1
```

---

## Common Commands

```bash
# Frontend
npm run dev              # Start dev server
npm run build           # Build for production
npm run lint            # Run linter

# Backend
npm run dev             # Start dev server
npm run build           # Build for production

# Git
git status              # See changes
git log --oneline       # See commit history
git diff                # See what changed
```

---

## Checklist Before Showing Demo

- [ ] Both servers running (backend on 3001, frontend on 3000)
- [ ] Environment variables set (.env.local)
- [ ] Supabase credentials configured
- [ ] Visit http://localhost:3000/dashboard/auth
- [ ] See login form with proper styling
- [ ] Try entering email (doesn't need to work, just see the UI)
- [ ] Verify button shows "Sending..." when clicked
- [ ] Check DevTools to see API call attempts

---

## Next Feature to Build

Once auth is working, build:
**Student Profile Page** (`/dashboard/student/profile`)

Features:
- Form with fields: Full name, College, Graduation year, LinkedIn URL
- Completion percentage indicator
- Save button
- Prefilled from backend if user already has profile

Follow same pattern:
1. Design page matching design system
2. Create page component
3. Wire up to `/api/v1/student/profile` endpoint
4. Test with backend running

---

## Questions?

For issues, check:
1. **SETUP_LOCAL_DEV.md** - Complete setup guide
2. **TESTING_GUIDE.md** - Detailed testing steps
3. **DASHBOARD_STRUCTURE.md** - Project structure explanation
