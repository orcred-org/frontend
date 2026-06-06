# Local Development Setup - Frontend + Backend Connection

## Step 1: Clone the Backend Repository

First, you need the backend repo alongside the frontend:

```bash
# From your projects directory
cd /Users/pragathii
git clone https://github.com/orcred-org/backend.git
```

Your structure should be:
```
/Users/pragathii/
├── frontend/          (this repo)
└── backend/           (orcred-org/backend)
```

## Step 2: Set Up Backend Locally

```bash
cd /Users/pragathii/backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Ask Shatrujay for:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - ADMIN_IP_ALLOWLIST (set to your local IP, e.g., 127.0.0.1)
```

## Step 3: Update Frontend Environment

```bash
cd /Users/pragathii/frontend

# Edit .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=<ask Shatrujay>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<ask Shatrujay>
```

## Step 4: Start Both Servers

**Terminal 1 - Backend (API server):**
```bash
cd /Users/pragathii/backend
npm run dev

# Output should show:
# ▲ Next.js 16.2.6
# - Local: http://localhost:3001
```

**Terminal 2 - Frontend (Dashboard):**
```bash
cd /Users/pragathii/frontend
npm run dev

# Output should show:
# ▲ Next.js 16.2.6
# - Local: http://localhost:3000
```

## Step 5: Test the Connection

### Test 1: Auth Flow
1. Open browser: `http://localhost:3000/dashboard/auth`
2. Enter an email: `test@example.com`
3. Click "Send Login Link"
4. Check backend console - should see request logged
5. Supabase should send email (check Resend logs)

### Test 2: Check API Health
```bash
# From any terminal
curl -i http://localhost:3001/api/v1/health

# Should return 200 OK
```

### Test 3: Test Auth Callback
```bash
# Get a token from Supabase magic link email
# Open the link: http://localhost:3000/dashboard/auth?token=xxx&type=signup

# Should redirect to /dashboard
# Dashboard page will call /api/v1/auth/me to check role
# Then redirect to /dashboard/student or /dashboard/reviewer
```

---

## Network Flow Diagram

```
Browser (localhost:3000)
    ↓
Frontend Dashboard
    ├→ POST /api/v1/auth/magic-link
    ├→ GET /api/v1/auth/me
    ├→ GET /api/v1/student/dashboard
    └→ etc...
    ↓
Backend API (localhost:3001)
    ├→ Supabase Auth (magic link validation)
    ├→ Supabase Postgres (data queries)
    ├→ Resend (email sending)
    └→ Claude API (project generation)
```

---

## Common Issues & Fixes

### Issue: "Failed to fetch - CORS error"
**Solution:** Backend needs CORS headers for localhost:3000
```javascript
// In backend next.config.js
headers: [
  {
    source: '/api/:path*',
    headers: [
      { key: 'Access-Control-Allow-Origin', value: 'http://localhost:3000' },
      { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE' },
      { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
    ],
  },
],
```

### Issue: "Cannot read cookie - session invalid"
**Solution:** Check that:
- Frontend is sending `credentials: 'include'` (✅ already in lib/api.ts)
- Backend is setting `SameSite=Lax` cookies (frontend and backend on same domain)
- For localhost: `SameSite=None` + `Secure: false` needed

### Issue: "POST /api/v1/auth/magic-link returns 404"
**Solution:** Backend route might not exist yet. Check:
```bash
ls /Users/pragathii/backend/app/api/v1/auth/
# Should have: magic-link.ts, callback.ts, me.ts
```

---

## Testing Checklist

Use this checklist as you build each feature:

### Magic Link Auth ✅
- [ ] Email input on `/dashboard/auth` shows
- [ ] "Send Login Link" button sends POST to `/api/v1/auth/magic-link`
- [ ] Supabase sends email with link
- [ ] Clicking link lands on `/dashboard/auth?token=...`
- [ ] Token validated, session created
- [ ] Redirected to `/dashboard/student` (or reviewer/admin)

### Student Dashboard ✅
- [ ] Page loads without redirect loop
- [ ] Calls `/api/v1/student/dashboard` 
- [ ] Displays student name from backend
- [ ] Shows correct state (new/has_idea/applied/scheduled/completed)

### Project Generator (next)
- [ ] Form accepts inputs (role, stack, experience)
- [ ] Submits to `/api/v1/generator/generate`
- [ ] Shows loading spinner while Claude processes
- [ ] Displays generated ideas with difficulty, tech stack, etc.
- [ ] "Save" button persists to database

---

## Database Checks

To verify data is flowing correctly, you can query Supabase directly:

```bash
# Check if user was created
supabase postgres query "SELECT * FROM users WHERE email = 'test@example.com';"

# Check if project idea was saved
supabase postgres query "SELECT * FROM project_ideas WHERE user_id = '<user_id>';"

# Check if application was submitted
supabase postgres query "SELECT * FROM applications WHERE user_id = '<user_id>';"
```

Or use Supabase Dashboard: https://app.supabase.com/projects

---

## Environment Variables Reference

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_DEBUG=true
```

**Backend (.env.local):**
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
ADMIN_IP_ALLOWLIST=127.0.0.1
RESEND_API_KEY=xxx
UPSTASH_REDIS_URL=xxx
ANTHROPIC_API_KEY=xxx
```

---

## Debugging Tips

**Check network requests in browser:**
1. Open DevTools (Cmd+Option+I on Mac)
2. Go to Network tab
3. Try login
4. Look for POST to http://localhost:3001/api/v1/auth/magic-link
5. Check response status and body

**Check backend logs:**
```bash
# Terminal running backend should show:
POST /api/v1/auth/magic-link 200 45ms
```

**Check console errors:**
- Frontend console (browser DevTools) for JS errors
- Backend terminal for stack traces

**Test API directly with curl:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/magic-link \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

---

## Next: Actual Development Flow

Once everything is connected:

1. Make UI changes in frontend → See live updates at localhost:3000
2. Make API changes in backend → Restart server, frontend calls new endpoint
3. Both repos stay in sync via Git
4. Test complete user flows end-to-end
5. Deploy together when ready

Good luck! Ask if anything gets stuck.
