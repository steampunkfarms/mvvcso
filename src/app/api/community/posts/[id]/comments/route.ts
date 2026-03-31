import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db, schema } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const comments = await db
    .select({
      id: schema.communityComments.id,
      content: schema.communityComments.content,
      createdAt: schema.communityComments.createdAt,
      authorName: schema.authUsers.name,
      authorDisplayName: schema.authUsers.displayName,
      authorAvatar: schema.authUsers.avatarUrl,
    })
    .from(schema.communityComments)
    .innerJoin(schema.authUsers, eq(schema.communityComments.authorId, schema.authUsers.id))
    .where(eq(schema.communityComments.postId, id))
    .orderBy(desc(schema.communityComments.createdAt));

  return NextResponse.json(comments);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;

  const { content } = z.object({ content: z.string().min(1).max(500) }).parse(await request.json());

  const [comment] = await db.insert(schema.communityComments).values({
    postId: id,
    authorId: user.id,
    content,
  }).returning();

  return NextResponse.json(comment);
}
