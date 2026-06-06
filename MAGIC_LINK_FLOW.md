# Complete Magic Link Auth Flow - Setup & Testing

## What Happens (Overview)

```
1. User enters email → clicks "Send Login Link"
2. Frontend POST /api/v1/auth/magic-link
3. Backend calls Supabase to send magic link email via Resend
4. User gets email with link: /dashboard/auth?token=xxx&type=signup
5. User clicks link
6. Frontend validates token via /api/v1/auth/callback
7. Session created in Supabase
8. Frontend redirects to /dashboard
9. /dashboard checks /api/v1/auth/me
10. Gets user role (student/reviewer/admin)
11. Redirects to /dashboard/student (or reviewer/admin)
```

---

## Step 1: Test Magic Link Email Sending

### Go to Login Page
```
http://localhost:3001/dashboard/auth
```

### Send Test Email
1. Enter your email: `test@example.com`
2. Click "Send Login Link"
3. Watch for response:
   - **Success:** Shows "Check your email"
   - **Error:** Red error message

### Check Backend Logs
Look at your **backend terminal**. Should show:
```
POST /api/v1/auth/magic-link 200 45ms
```

### Check Email
Supabase will send email via Resend. Check:
- **Inbox** (might be spam folder)
- Look for link like: `localhost:3001/dashboard/auth?token=...&type=...`
- **Note:** If Resend not configured, email won't send (that's okay for testing)

---

## Step 2: Backend Callback Endpoint

Check that backend has the callback handler:

```bash
cat /Users/pragathii/backend/app/api/v1/auth/callback/route.ts
```

Should handle:
- Extract token from URL
- Validate with Supabase
- Create user session
- Return redirect URL or status

If missing, ask Shatrujay to create it.

---

## Step 3: Test Full Flow (With Real Email)

### Prerequisites
You need:
1. ✅ Valid Supabase credentials in backend `.env.local`
2. ✅ Resend API key configured
3. ✅ Email address to test with

### Step-by-Step

**Step 1: Send Magic Link**
```
1. Go to http://localhost:3001/dashboard/auth
2. Enter your real email
3. Click "Send Login Link"
4. See "Check your email" message
```

**Step 2: Check Email**
```
1. Check your inbox (and spam folder)
2. Look for email from Supabase/Orcred
3. Copy the link from email
```

**Step 3: Click the Link**
```
1. Paste the link in browser
2. Should redirect to /dashboard
3. Then redirect to /dashboard/student
```

**Step 4: Verify Session**
```
Open DevTools → Application → Cookies
Should see: "sb-xxx-auth-token" (Supabase session cookie)
```

---

## Step 4: Frontend Callback Handler

The auth page already handles the callback. Here's what it does:

**File:** `/Users/pragathii/frontend/app/dashboard/auth/page.tsx`

**Code (already there):**
```typescript
const token = searchParams.get('token');
const type = searchParams.get('type');

// Handle magic link callback
if (token && type) {
  return (
    <div>
      <h1>Signing you in...</h1>
      <p>Please wait while we verify your login link.</p>
    </div>
  );
}
```

**What it needs:**
1. Extract token from URL ✅
2. Send to backend `/api/v1/auth/callback` 
3. Backend returns authenticated session
4. Redirect to `/dashboard`

Currently it just shows a message. We need to add the actual callback logic.

---

## Step 5: Add Callback Logic (If Missing)

Update `/Users/pragathii/frontend/app/dashboard/auth/page.tsx` to handle the callback:

```typescript
// Inside AuthContent component, after the if (token && type) check:

if (token && type) {
  const [callbackError, setCallbackError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Call backend to verify token and create session
        const res = await fetch('/api/v1/auth/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, type }),
          credentials: 'include',
        });

        if (!res.ok) {
          setCallbackError('Invalid or expired link');
          return;
        }

        // Session created, redirect to dashboard
        router.push('/dashboard');
      } catch (err) {
        setCallbackError('Something went wrong');
      }
    };

    verifyToken();
  }, [token, type, router]);

  if (callbackError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="p-8 max-w-md" style={{ backgroundColor: 'var(--bg-card)' }}>
          <h2 style={{ color: 'var(--fg)' }}>Link Expired</h2>
          <p style={{ color: 'var(--fg-muted)' }}>{callbackError}</p>
          <button 
            onClick={() => router.push('/dashboard/auth')}
            className="btn-primary mt-6 w-full"
          >
            Request New Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'var(--orange)' }}>Signing you in...</h1>
        <p style={{ color: 'var(--fg-muted)' }}>Please wait...</p>
      </div>
    </div>
  );
}
```

---

## Step 6: Backend Callback Endpoint (If Missing)

If backend doesn't have `/api/v1/auth/callback`, ask Shatrujay to create it.

It should:
```typescript
// POST /api/v1/auth/callback
export async function POST(req: NextRequest) {
  const { token, type } = await req.json();

  const supabase = await createClient();

  // Verify OTP token with Supabase
  const { data, error } = await supabase.auth.verifyOtp({
    email: email, // need to extract from somewhere
    token: token,
    type: 'email',
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Session created, Supabase cookie set automatically
  return NextResponse.json({ success: true });
}
```

---

## Testing Checklist

- [ ] Login page loads at `/dashboard/auth`
- [ ] Can type email and submit form
- [ ] "Check your email" message appears
- [ ] Backend logs show POST 200
- [ ] Email received with magic link
- [ ] Click link in email
- [ ] Browser shows "Signing you in..." message
- [ ] Gets redirected to `/dashboard`
- [ ] `/dashboard/auth/me` call succeeds
- [ ] Gets redirected to `/dashboard/student`
- [ ] Sees student dashboard with name
- [ ] Session cookie present in browser

---

## Troubleshooting

### "Email not received"
**Cause:** Resend not configured
**Fix:** Ask Shatrujay for RESEND_API_KEY
**Workaround:** Test with a dummy token

### "Invalid link" error
**Cause:** Token expired (15 min limit) or already used
**Fix:** Request a new link

### "Stuck on 'Signing you in...'"
**Cause:** Backend callback not working
**Fix:** Check backend logs for errors
**Check:** `/api/v1/auth/callback` endpoint exists

### "Session cookie not set"
**Cause:** CORS or cookie config issue
**Fix:** Check backend CORS headers allow credentials

### "Redirected back to login"
**Cause:** `/api/v1/auth/me` failing
**Fix:** Verify session was created, check Supabase RLS

---

## What to Test Next

Once magic link works end-to-end:
1. ✅ Test student login → redirects to `/dashboard/student`
2. ✅ Test reviewer login → redirects to `/dashboard/reviewer`
3. ✅ Test admin login → redirects to `/dashboard/admin`
4. ✅ Test logout → clears session

Then build:
- Student profile form
- Project idea generator
- Application form (4 steps)
