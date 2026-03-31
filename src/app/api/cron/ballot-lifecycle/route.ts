import { NextResponse } from 'next/server';
import { verifyCronAuth } from '@/lib/cron-auth';

export async function GET(request: Request) {
  if (!verifyCronAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // TODO: Open/close ballots at scheduled times
  return NextResponse.json({ message: 'Ballot lifecycle checked', timestamp: new Date().toISOString() });
}
