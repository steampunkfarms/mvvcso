import { NextRequest, NextResponse } from 'next/server';
import { verifyMagicLink, createSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login?error=missing_token', req.url));
  }

  const user = await verifyMagicLink(token);

  if (!user) {
    return NextResponse.redirect(new URL('/admin/login?error=invalid_or_expired', req.url));
  }

  await createSession(user);

  return NextResponse.redirect(new URL('/admin', req.url));
}
