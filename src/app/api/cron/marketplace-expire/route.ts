import { NextResponse } from 'next/server';
import { db, schema } from '@/lib/db';
import { eq, lte, and } from 'drizzle-orm';
import { verifyCronAuth } from '@/lib/cron-auth';

export async function GET(request: Request) {
  if (!verifyCronAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const result = await db
    .update(schema.marketplaceListings)
    .set({ status: 'expired', updatedAt: now })
    .where(
      and(
        eq(schema.marketplaceListings.status, 'active'),
        lte(schema.marketplaceListings.expiresAt, now)
      )
    );

  return NextResponse.json({ message: 'Marketplace listings expired', timestamp: now.toISOString() });
}
