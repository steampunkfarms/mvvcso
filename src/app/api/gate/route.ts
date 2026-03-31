// TODO(pre-DNS): Remove this route before flipping mvvcso.org DNS
import { NextRequest, NextResponse } from 'next/server';

const GATE_PASSWORD = process.env.SITE_GATE_PASSWORD?.trim() || 'R2nch1t@';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const pw = formData.get('gate')?.toString().trim() || '';

  if (pw !== GATE_PASSWORD) {
    return NextResponse.redirect(new URL('/admin/login?err=1', req.url), 303);
  }

  const res = NextResponse.redirect(new URL('/admin/login', req.url), 303);
  res.cookies.set('mvvcso_gate', 'granted', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/admin',
  });
  return res;
}
