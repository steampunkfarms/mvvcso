import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// TODO(pre-DNS): Remove this gate HTML + /api/gate route before flipping mvvcso.org DNS
function siteGateHtml(error?: boolean) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>MVVCSO Admin</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui,sans-serif;background:#F8F4EE;color:#1C2B2F;display:flex;
align-items:center;justify-content:center;min-height:100vh;padding:1rem}
.card{background:#fff;border-radius:1rem;padding:2.5rem;max-width:24rem;width:100%;
box-shadow:0 1px 3px rgba(0,0,0,.08);border:1px solid #E0D8D0;text-align:center}
h1{font-size:1.5rem;margin-bottom:.5rem}
p{font-size:.875rem;color:#6B6355;margin-bottom:1.5rem}
.err{color:#C04040;font-size:.875rem;margin-bottom:1rem}
input{width:100%;padding:.75rem 1rem;border:1px solid #E0D8D0;border-radius:.5rem;
font-size:1rem;background:#F0EDE6;margin-bottom:1rem}
input:focus{outline:none;border-color:#E07F5C}
button{width:100%;padding:.75rem;border:none;border-radius:.5rem;background:#E07F5C;
color:#fff;font-size:1rem;font-weight:600;cursor:pointer}
button:hover{background:#C86E4E}
</style></head>
<body><div class="card">
<h1>MVVCSO Admin</h1>
<p>Enter the site password to continue.</p>
${error ? '<p class="err">Incorrect password.</p>' : ''}
<form method="post" action="/api/gate">
<input type="password" name="gate" placeholder="Password" required autofocus>
<button type="submit">Enter</button>
</form>
</div></body></html>`;
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin routes — require session cookie (server components verify DB-side)
  // TODO(pre-DNS): Remove site gate before flipping mvvcso.org DNS
  if (pathname.startsWith('/admin')) {
    // Site gate: require pre-launch password cookie on /admin/login
    if (pathname === '/admin/login') {
      const gatePass = req.cookies.get('mvvcso_gate')?.value;
      if (gatePass === 'granted') {
        return NextResponse.next();
      }
      const showError = req.nextUrl.searchParams.get('err') === '1';
      return new NextResponse(siteGateHtml(showError), {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }
    if (pathname === '/admin/verify') {
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

  // Kids portal — separate auth (PIN-based, handled server-side)
  if (pathname.startsWith('/kids')) {
    return NextResponse.next();
  }

  // Legacy/genealogy — require session for create/edit, public for viewing
  if (pathname.startsWith('/legacy')) {
    if (pathname === '/legacy' || pathname.startsWith('/legacy/oral-history') && !pathname.includes('record')) {
      return NextResponse.next(); // Public browsing
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
  matcher: ['/', '/(es)/:path*', '/admin/:path*', '/community/:path*', '/marketplace/:path*', '/register/:path*', '/kids/:path*', '/legacy/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
