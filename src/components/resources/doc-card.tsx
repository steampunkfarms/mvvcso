import { FileText, Download, Globe, ZoomIn } from 'lucide-react';
import type { TransparencyDoc } from '@/lib/transparency-docs';

export function DocCard({ doc }: { doc: TransparencyDoc }) {
  const hasFile = !!doc.fileUrl;

  return (
    <div className="bg-white rounded-xl p-5 border border-stone-200 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
          <FileText className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-(--text-primary) leading-snug">
            {doc.title}
          </h3>
          {doc.description && (
            <p className="text-xs text-(--text-muted) mt-1">{doc.description}</p>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {hasFile ? (
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-700 hover:text-gold-500 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> English PDF
              </a>
            ) : (
              <span className="text-xs text-(--text-muted) italic">Upload pending</span>
            )}

            {doc.largeFileUrl && (
              <a
                href={doc.largeFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-700 hover:text-gold-500 transition-colors"
              >
                <ZoomIn className="w-3.5 h-3.5" /> Large Print
              </a>
            )}

            {doc.esFileUrl && (
              <a
                href={doc.esFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-terra-500 hover:text-gold-500 transition-colors"
              >
                <Globe className="w-3.5 h-3.5" /> Español
              </a>
            )}

            {doc.esLargeFileUrl && (
              <a
                href={doc.esLargeFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-terra-500 hover:text-gold-500 transition-colors"
              >
                <ZoomIn className="w-3.5 h-3.5" /> Español (Grande)
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
