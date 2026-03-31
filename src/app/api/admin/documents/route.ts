import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db, schema } from '@/lib/db';
import { desc, eq, ilike, or } from 'drizzle-orm';

export async function GET(request: Request) {
  await requireAuth();

  const { searchParams } = new URL(request.url);
  const folderId = searchParams.get('folderId');
  const search = searchParams.get('search');

  let query = db.select().from(schema.documents).orderBy(desc(schema.documents.createdAt));

  if (folderId) {
    query = query.where(eq(schema.documents.folderId, folderId)) as typeof query;
  }

  if (search) {
    query = query.where(
      or(
        ilike(schema.documents.title, `%${search}%`),
        ilike(schema.documents.description, `%${search}%`),
        ilike(schema.documents.tags, `%${search}%`)
      )
    ) as typeof query;
  }

  const docs = await query;
  return NextResponse.json(docs);
}
