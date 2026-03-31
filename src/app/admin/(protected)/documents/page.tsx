'use client';

import { useState, useEffect } from 'react';
import { FolderOpen, Upload, FileText, Search, Download, File } from 'lucide-react';
import { format } from 'date-fns';

interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  accessLevel: string;
  sortOrder: number;
}

interface Document {
  id: string;
  title: string;
  description: string | null;
  fileName: string;
  fileUrl: string;
  fileSize: number | null;
  mimeType: string | null;
  accessLevel: string;
  folderId: string | null;
  createdAt: string;
}

export default function DocumentsPage() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/documents/folders').then(r => r.json()).then(setFolders);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedFolder) params.set('folderId', selectedFolder);
    if (search) params.set('search', search);
    fetch(`/api/admin/documents?${params}`).then(r => r.json()).then(setDocuments);
  }, [selectedFolder, search]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const title = file.name.replace(/\.[^/.]+$/, '');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    if (selectedFolder) formData.append('folderId', selectedFolder);
    formData.append('accessLevel', 'board');

    setUploading(true);
    try {
      const res = await fetch('/api/admin/documents/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const params = new URLSearchParams();
        if (selectedFolder) params.set('folderId', selectedFolder);
        const docs = await fetch(`/api/admin/documents?${params}`).then(r => r.json());
        setDocuments(docs);
      }
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  const selectedFolderName = folders.find(f => f.id === selectedFolder)?.name;

  function formatFileSize(bytes: number | null) {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-(--text-primary)">Filing Cabinet</h1>
        <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-400 text-white text-sm font-semibold hover:bg-gold-500 transition-colors cursor-pointer ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
          <Upload className="w-4 h-4" />
          {uploading ? 'Uploading...' : 'Upload'}
          <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Folder tree */}
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <h3 className="text-sm font-semibold text-(--text-muted) uppercase tracking-wider mb-3">Folders</h3>
          <button
            onClick={() => setSelectedFolder(null)}
            className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors ${
              !selectedFolder ? 'bg-gold-400 text-white' : 'text-(--text-secondary) hover:bg-stone-100'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            All Documents
          </button>
          {folders.map(folder => (
            <button
              key={folder.id}
              onClick={() => setSelectedFolder(folder.id)}
              className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedFolder === folder.id ? 'bg-gold-400 text-white' : 'text-(--text-secondary) hover:bg-stone-100'
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              {folder.name}
            </button>
          ))}
        </div>

        {/* File list */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-muted)" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-200 bg-white text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:border-gold-400"
            />
          </div>

          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-stone-200 bg-stone-100">
              <span className="text-sm font-medium text-(--text-primary)">
                {selectedFolderName || 'All Documents'} ({documents.length})
              </span>
            </div>
            {documents.length === 0 ? (
              <p className="p-8 text-center text-(--text-muted)">No documents found.</p>
            ) : (
              <div className="divide-y divide-stone-200/50">
                {documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between px-5 py-3 hover:bg-stone-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <FileIcon mimeType={doc.mimeType} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-(--text-primary) truncate">{doc.title}</p>
                        <p className="text-xs text-(--text-muted)">
                          {formatFileSize(doc.fileSize)} · {format(new Date(doc.createdAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        doc.accessLevel === 'public' ? 'bg-sage-50 text-sage-600' :
                        doc.accessLevel === 'board' ? 'bg-terra-50 text-stone-700' :
                        'bg-stone-100 text-(--text-muted)'
                      }`}>
                        {doc.accessLevel}
                      </span>
                      <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer"
                        className="p-1.5 rounded hover:bg-stone-100 text-(--text-muted) hover:text-gold-400 transition-colors">
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FileIcon({ mimeType }: { mimeType: string | null }) {
  const isPdf = mimeType?.includes('pdf');
  const isImage = mimeType?.startsWith('image/');
  return (
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
      isPdf ? 'bg-red-50 text-red-500' :
      isImage ? 'bg-terra-50 text-stone-600' :
      'bg-stone-100 text-(--text-muted)'
    }`}>
      {isPdf ? <FileText className="w-4 h-4" /> :
       isImage ? <File className="w-4 h-4" /> :
       <File className="w-4 h-4" />}
    </div>
  );
}
