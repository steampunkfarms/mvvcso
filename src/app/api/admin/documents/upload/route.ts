import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { requireAuth } from '@/lib/auth';
import { db, schema } from '@/lib/db';

export async function POST(request: Request) {
  const user = await requireAuth(['president', 'secretary', 'treasurer', 'content_manager']);

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const folderId = formData.get('folderId') as string | null;
    const accessLevel = (formData.get('accessLevel') as string) || 'board';
    const description = formData.get('description') as string | null;

    if (!file || !title) {
      return NextResponse.json({ error: 'File and title required' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
    }

    const blob = await put(`documents/${Date.now()}-${file.name}`, file, {
      access: 'public',
    });

    const [doc] = await db.insert(schema.documents).values({
      title: title.trim(),
      description: description?.trim() || null,
      category: 'general',
      folderId: folderId || null,
      fileUrl: blob.url,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type || 'application/octet-stream',
      accessLevel,
      uploadedBy: user.id,
    }).returning();

    await db.insert(schema.activityLog).values({
      type: 'document_uploaded',
      title: `Document uploaded: ${title.trim()}`,
      entityId: doc.id,
      entityType: 'document',
      userId: user.id,
    });

    return NextResponse.json(doc);
  } catch (error) {
    console.error('Document upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
