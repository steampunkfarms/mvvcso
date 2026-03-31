import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { db, schema } from '@/lib/db';
import { desc } from 'drizzle-orm';

const postSchema = z.object({
  slug: z.string().min(1),
  titleEn: z.string().min(1),
  titleEs: z.string().optional(),
  contentEn: z.string().min(1),
  contentEs: z.string().optional(),
  excerptEn: z.string().optional(),
  excerptEs: z.string().optional(),
  author: z.string().optional(),
  category: z.string().optional(),
  coverImage: z.string().optional(),
  published: z.boolean().default(false),
  publishedAt: z.string().optional(),
});

export async function GET() {
  await requireAuth(['president', 'secretary', 'content_manager']);
  const posts = await db.select().from(schema.blogPosts).orderBy(desc(schema.blogPosts.createdAt));
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const user = await requireAuth(['president', 'secretary', 'content_manager']);

  try {
    const body = await request.json();
    const data = postSchema.parse(body);

    const [post] = await db.insert(schema.blogPosts).values({
      slug: data.slug,
      titleEn: data.titleEn,
      titleEs: data.titleEs || null,
      contentEn: data.contentEn,
      contentEs: data.contentEs || null,
      excerptEn: data.excerptEn || null,
      excerptEs: data.excerptEs || null,
      author: data.author || 'MVVCSO',
      category: data.category || null,
      coverImage: data.coverImage || null,
      published: data.published,
      publishedAt: data.published ? new Date(data.publishedAt || Date.now()) : null,
    }).returning();

    if (data.published) {
      await db.insert(schema.activityLog).values({
        type: 'blog_published',
        title: `Blog post published: ${data.titleEn}`,
        entityId: post.id,
        entityType: 'blog',
        userId: user.id,
      });
    }

    return NextResponse.json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    console.error('Create blog post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
