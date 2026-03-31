import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth(['president', 'secretary', 'content_manager']);
  const { id } = await params;

  try {
    const body = await request.json();
    const updateData: Record<string, unknown> = { updatedAt: new Date() };

    const allowedFields = ['titleEn', 'titleEs', 'contentEn', 'contentEs', 'excerptEn', 'excerptEs', 'author', 'category', 'coverImage', 'published', 'slug'];
    for (const field of allowedFields) {
      if (body[field] !== undefined) updateData[field] = body[field];
    }

    if (body.published && !body.publishedAt) {
      updateData.publishedAt = new Date();
    } else if (body.publishedAt) {
      updateData.publishedAt = new Date(body.publishedAt);
    }

    await db.update(schema.blogPosts).set(updateData).where(eq(schema.blogPosts.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update blog post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAuth(['president', 'secretary', 'content_manager']);
  const { id } = await params;

  await db.delete(schema.blogPosts).where(eq(schema.blogPosts.id, id));
  return NextResponse.json({ success: true });
}
