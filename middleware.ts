import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const code = searchParams.get('code');

  // When Supabase falls back to Site URL, the PKCE code lands at /
  // Forward it to the callback page which knows how to exchange it.
  if (code && pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard/auth/callback';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/',
};
