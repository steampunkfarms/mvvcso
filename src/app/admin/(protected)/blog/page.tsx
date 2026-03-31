import Link from 'next/link';
import { requireAuth } from '@/lib/auth';
import { db, schema } from '@/lib/db';
import { desc } from 'drizzle-orm';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';

export default async function AdminBlogPage() {
  await requireAuth(['president', 'secretary', 'content_manager']);
  const posts = await db.select().from(schema.blogPosts).orderBy(desc(schema.blogPosts.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-(--text-primary)">Blog Management</h1>
        <Link href="/admin/blog/new" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-400 text-white text-sm font-semibold hover:bg-gold-500 transition-colors">
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        {posts.length === 0 ? (
          <p className="p-8 text-center text-(--text-muted)">No blog posts yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-100 text-left">
                <th className="px-5 py-3 font-semibold text-(--text-primary)">Title</th>
                <th className="px-5 py-3 font-semibold text-(--text-primary)">Category</th>
                <th className="px-5 py-3 font-semibold text-(--text-primary)">Status</th>
                <th className="px-5 py-3 font-semibold text-(--text-primary)">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/50">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-5 py-3">
                    <Link href={`/admin/blog/${post.id}`} className="text-gold-400 hover:underline font-medium">
                      {post.titleEn}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-(--text-secondary) capitalize">{post.category || '—'}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${post.published ? 'bg-sage-50 text-sage-600' : 'bg-stone-100 text-(--text-muted)'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-(--text-muted) text-xs">
                    {post.publishedAt ? format(post.publishedAt, 'MMM d, yyyy') : format(post.createdAt, 'MMM d, yyyy')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
