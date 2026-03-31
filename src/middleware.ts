import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin routes — check session cookie (actual verification happens server-side)
  if (pathname.startsWith('/admin')) {
    // Allow login and verify pages without auth
    if (pathname === '/admin/login' || pathname === '/admin/verify') {
      return NextResponse.next();
    }

    // Check for session cookie
    const sessionToken = req.cookies.get('mvvcso_session')?.value;
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    // Session exists — let the request through (server components verify DB-side)
    return NextResponse.next();
  }

  // API routes — skip i18n
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Everything else — i18n routing
  return intlMiddleware(req);
}

export const config = {
  matcher: ['/', '/(es)/:path*', '/admin/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
