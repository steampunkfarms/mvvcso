import { db, schema } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { FileText, Download, File } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resources',
  description: 'Public documents and resources from MVVCSO — meeting minutes, bylaws, financial reports, and community information.',
};

export const dynamic = 'force-dynamic';

export default async function ResourcesPage() {
  let documents: {
    id: string;
    title: string;
    titleEs: string | null;
    description: string | null;
    fileUrl: string;
    fileName: string;
    mimeType: string | null;
    fileSize: number | null;
    category: string;
    createdAt: Date;
    folderName: string | null;
  }[] = [];

  try {
    documents = await db
      .select({
        id: schema.documents.id,
        title: schema.documents.title,
        titleEs: schema.documents.titleEs,
        description: schema.documents.description,
        fileUrl: schema.documents.fileUrl,
        fileName: schema.documents.fileName,
        mimeType: schema.documents.mimeType,
        fileSize: schema.documents.fileSize,
        category: schema.documents.category,
        createdAt: schema.documents.createdAt,
        folderName: schema.documentFolders.name,
      })
      .from(schema.documents)
      .leftJoin(schema.documentFolders, eq(schema.documents.folderId, schema.documentFolders.id))
      .where(eq(schema.documents.accessLevel, 'public'))
      .orderBy(desc(schema.documents.createdAt));
  } catch (error) {
    console.error('Failed to load resources:', error);
  }

  // Group by folder
  const grouped = new Map<string, typeof documents>();
  for (const doc of documents) {
    const folder = doc.folderName || 'General';
    if (!grouped.has(folder)) grouped.set(folder, []);
    grouped.get(folder)!.push(doc);
  }

  return (
    <div>
      <section className="py-(--section-padding) bg-stone-200/20">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding) text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-(--text-primary)">Resources</h1>
          <p className="text-lg text-(--text-secondary) max-w-2xl mx-auto">
            Public documents, meeting minutes, and community resources.
          </p>
        </div>
      </section>

      <section className="py-(--section-padding) bg-stone-50">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding)">
          {documents.length === 0 ? (
            <p className="text-center text-(--text-muted) py-12">No public documents available yet.</p>
          ) : (
            <div className="space-y-8">
              {Array.from(grouped.entries()).map(([folder, docs]) => (
                <div key={folder}>
                  <h2 className="text-xl font-bold text-(--text-primary) mb-4">{folder}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {docs.map(doc => (
                      <a
                        key={doc.id}
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 bg-white rounded-xl p-4 border border-stone-200 hover:shadow-md transition-shadow"
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          doc.mimeType?.includes('pdf') ? 'bg-red-50 text-red-500' : 'bg-terra-50 text-stone-600'
                        }`}>
                          {doc.mimeType?.includes('pdf') ? <FileText className="w-5 h-5" /> : <File className="w-5 h-5" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-(--text-primary) truncate">{doc.title}</p>
                          {doc.description && <p className="text-xs text-(--text-muted) truncate">{doc.description}</p>}
                        </div>
                        <Download className="w-4 h-4 text-(--text-muted) shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
