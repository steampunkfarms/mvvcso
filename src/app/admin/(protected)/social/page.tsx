import { requireAuth } from '@/lib/auth';
import { db, schema } from '@/lib/db';
import { desc } from 'drizzle-orm';
import { format } from 'date-fns';
import { Megaphone } from 'lucide-react';

export default async function AdminSocialPage() {
  await requireAuth(['president', 'secretary', 'content_manager']);
  const posts = await db.select().from(schema.socialPosts).orderBy(desc(schema.socialPosts.createdAt));

  const draft = posts.filter(p => p.status === 'draft');
  const scheduled = posts.filter(p => p.status === 'scheduled');
  const published = posts.filter(p => p.status === 'published');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-(--text-primary)">Social Media</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-stone-200">
          <span className="text-sm text-(--text-muted)">Drafts</span>
          <div className="text-2xl font-bold text-(--text-primary)">{draft.length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-stone-200">
          <span className="text-sm text-(--text-muted)">Scheduled</span>
          <div className="text-2xl font-bold text-(--text-primary)">{scheduled.length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-stone-200">
          <span className="text-sm text-(--text-muted)">Published</span>
          <div className="text-2xl font-bold text-(--text-primary)">{published.length}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-200">
          <h2 className="font-semibold text-(--text-primary)">All Social Posts</h2>
        </div>
        {posts.length === 0 ? (
          <div className="p-8 text-center">
            <Megaphone className="w-8 h-8 text-(--text-muted) mx-auto mb-3" />
            <p className="text-(--text-muted)">No social posts yet. Share a Commons post to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-200/50">
            {posts.map(post => (
              <div key={post.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <span className="text-sm text-(--text-primary)">{post.content.slice(0, 80)}...</span>
                  <div className="text-xs text-(--text-muted) mt-1">
                    {post.platform} · {format(post.createdAt, 'MMM d, yyyy')}
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded capitalize ${
                  post.status === 'published' ? 'bg-sage-50 text-sage-600' :
                  post.status === 'scheduled' ? 'bg-terra-50 text-stone-700' :
                  'bg-stone-100 text-(--text-muted)'
                }`}>{post.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
