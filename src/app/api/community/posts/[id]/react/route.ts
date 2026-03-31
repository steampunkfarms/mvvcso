import { NextResponse } from 'next/server';
import { db, schema } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;

  const { type = 'like' } = await request.json();

  // Toggle: if reaction exists, remove it; if not, add it
  const [existing] = await db
    .select()
    .from(schema.communityReactions)
    .where(
      and(
        eq(schema.communityReactions.postId, id),
        eq(schema.communityReactions.userId, user.id),
        eq(schema.communityReactions.type, type)
      )
    );

  if (existing) {
    await db.delete(schema.communityReactions).where(eq(schema.communityReactions.id, existing.id));
    return NextResponse.json({ removed: true });
  } else {
    await db.insert(schema.communityReactions).values({
      postId: id,
      userId: user.id,
      type,
    });
    return NextResponse.json({ added: true });
  }
}
