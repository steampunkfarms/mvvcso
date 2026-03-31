import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db, schema } from '@/lib/db';

export async function GET() {
  await requireAuth();
  const folders = await db.select().from(schema.documentFolders).orderBy(schema.documentFolders.sortOrder);
  return NextResponse.json(folders);
}
