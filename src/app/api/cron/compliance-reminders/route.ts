import { NextResponse } from 'next/server';
import { verifyCronAuth } from '@/lib/cron-auth';

export async function GET(request: Request) {
  if (!verifyCronAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // TODO: Check compliance tasks due in 30/14/7 days, send reminders
  return NextResponse.json({ message: 'Compliance reminders checked', timestamp: new Date().toISOString() });
}
