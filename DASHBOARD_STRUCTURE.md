# Dashboard Project Structure

## Folder Organization

```
app/
├── (root pages)          # Landing page routes
├── api/                  # Backend API routes
└── dashboard/            # Dashboard routes - separate from landing page
    ├── auth/             # Authentication (magic link)
    │   └── page.tsx      # Login/magic link handler
    ├── student/          # Student dashboard
    │   └── page.tsx      # Student home dashboard
    ├── reviewer/         # Reviewer dashboard
    │   └── page.tsx      # Reviewer assignments & scoring
    ├── admin/            # Admin dashboard
    │   └── page.tsx      # Admin management
    ├── settings/         # Settings pages
    ├── layout.tsx        # Dashboard layout wrapper
    └── page.tsx          # Redirect to role-specific dashboard

components/
├── dashboard/            # Dashboard-specific components
├── auth/                 # Auth-related components
└── common/               # Reusable components

lib/
├── api.ts               # API client utilities
├── types.ts             # TypeScript type definitions
└── utils.ts             # Common utilities
```

## Key Features

### Authentication Flow
1. User visits `/dashboard/auth`
2. Enters email, receives magic link via `/api/v1/auth/magic-link`
3. Clicks link: `/dashboard/auth?token=...&type=...`
4. Token verified, session created
5. Redirected to `/dashboard` which checks role and redirects to appropriate dashboard

### Dashboard Separation
- Landing page: orcred.com (uses root layout with Navbar/Footer)
- Dashboard: app.orcred.com (uses dashboard/layout.tsx, no Navbar/Footer)
- API: api.orcred.com (separate backend deployment)

### Environment Variables
- `.env.local` - Local development (API_URL=http://localhost:3001)
- `.env.example` - Template for environment setup
- Production: Use Vercel environment variables for api.orcred.com

## Design System Integration

All components use CSS variables from globals.css:
- `--bg-page`: #faf7f2
- `--bg-alt`: #f0ebe0
- `--bg-card`: #f5f1e9
- `--fg`: #0f0d0c
- `--orange`: #eb4511

Tailwind config includes custom spacing, colors, and typography matching Orcred design system.

## Next Steps

1. Create shared dashboard components in `/components/dashboard/`
2. Implement API routes in backend (separate repo)
3. Build student application form with multi-step UI
4. Add project idea generator with Claude integration
5. Implement reviewer and admin dashboards
6. Add email integration with Resend
