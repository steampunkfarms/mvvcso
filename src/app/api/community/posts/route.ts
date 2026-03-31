import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db, schema } from '@/lib/db';
import { desc, eq, and } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channel = searchParams.get('channel');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

  let query = db
    .select({
      id: schema.communityPosts.id,
      content: schema.communityPosts.content,
      photosJson: schema.communityPosts.photosJson,
      channel: schema.communityPosts.channel,
      isPinned: schema.communityPosts.isPinned,
      isAnnouncement: schema.communityPosts.isAnnouncement,
      status: schema.communityPosts.status,
      createdAt: schema.communityPosts.createdAt,
      authorName: schema.authUsers.name,
      authorDisplayName: schema.authUsers.displayName,
      authorAvatar: schema.authUsers.avatarUrl,
      authorId: schema.communityPosts.authorId,
    })
    .from(schema.communityPosts)
    .innerJoin(schema.authUsers, eq(schema.communityPosts.authorId, schema.authUsers.id))
    .where(
      channel
        ? and(eq(schema.communityPosts.status, 'active'), eq(schema.communityPosts.channel, channel))
        : eq(schema.communityPosts.status, 'active')
    )
    .orderBy(desc(schema.communityPosts.isPinned), desc(schema.communityPosts.createdAt))
    .limit(limit)
    .offset(offset);

  const posts = await query;
  return NextResponse.json(posts);
}

const createPostSchema = z.object({
  content: z.string().min(1).max(2000),
  channel: z.string().default('general'),
  photosJson: z.string().optional(),
  isAnnouncement: z.boolean().optional(),
});

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const data = createPostSchema.parse(body);

    // Only board+ can post announcements
    const isBoardPlus = ['president', 'vice_president', 'secretary', 'treasurer', 'board_member'].includes(user.role);
    if (data.channel === 'announcements' && !isBoardPlus) {
      return NextResponse.json({ error: 'Only board members can post announcements' }, { status: 403 });
    }

    const [post] = await db.insert(schema.communityPosts).values({
      authorId: user.id,
      content: data.content,
      channel: data.channel,
      photosJson: data.photosJson || null,
      isAnnouncement: data.isAnnouncement && isBoardPlus ? true : false,
      language: user.language,
    }).returning();

    return NextResponse.json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
