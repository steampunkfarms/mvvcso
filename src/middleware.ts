import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin routes — require session cookie (server components verify DB-side)
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login' || pathname === '/admin/verify') {
      return NextResponse.next();
    }
    const sessionToken = req.cookies.get('mvvcso_session')?.value;
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    return NextResponse.next();
  }

  // Community + Marketplace routes — require session cookie (resident+)
  if (pathname.startsWith('/community') || pathname.startsWith('/marketplace')) {
    // Allow public viewing of marketplace listings
    if (pathname === '/marketplace' || pathname.match(/^\/marketplace\/[^/]+$/)) {
      return NextResponse.next();
    }
    const sessionToken = req.cookies.get('mvvcso_session')?.value;
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/register', req.url));
    }
    return NextResponse.next();
  }

  // Registration routes — always public
  if (pathname.startsWith('/register')) {
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
  matcher: ['/', '/(es)/:path*', '/admin/:path*', '/community/:path*', '/marketplace/:path*', '/register/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
