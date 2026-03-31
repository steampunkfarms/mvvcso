import { requireAuth } from '@/lib/auth';
import { db, schema } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { Shield, AlertTriangle } from 'lucide-react';

export default async function ModerationPage() {
  await requireAuth(['president', 'vice_president', 'secretary', 'board_member']);

  const flaggedPosts = await db
    .select()
    .from(schema.communityPosts)
    .where(eq(schema.communityPosts.status, 'flagged'))
    .orderBy(desc(schema.communityPosts.createdAt));

  const flaggedListings = await db
    .select()
    .from(schema.marketplaceListings)
    .where(eq(schema.marketplaceListings.status, 'flagged'))
    .orderBy(desc(schema.marketplaceListings.createdAt));

  const totalFlagged = flaggedPosts.length + flaggedListings.length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-(--text-primary)">Moderation Queue</h1>

      {totalFlagged === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-stone-200 text-center">
          <Shield className="w-10 h-10 text-sage-400 mx-auto mb-3" />
          <p className="text-(--text-primary) font-medium">All clear!</p>
          <p className="text-sm text-(--text-muted) mt-1">No flagged content to review.</p>
        </div>
      ) : (
        <>
          {flaggedPosts.length > 0 && (
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-stone-200 bg-stone-100 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-gold-400" />
                <span className="text-sm font-semibold text-(--text-primary)">Flagged Community Posts ({flaggedPosts.length})</span>
              </div>
              <div className="divide-y divide-stone-200/50">
                {flaggedPosts.map(post => (
                  <div key={post.id} className="px-5 py-3">
                    <p className="text-sm text-(--text-primary)">{post.content.slice(0, 200)}...</p>
                    <p className="text-xs text-(--text-muted) mt-1">Channel: {post.channel}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {flaggedListings.length > 0 && (
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-stone-200 bg-stone-100 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-gold-400" />
                <span className="text-sm font-semibold text-(--text-primary)">Flagged Marketplace Listings ({flaggedListings.length})</span>
              </div>
              <div className="divide-y divide-stone-200/50">
                {flaggedListings.map(listing => (
                  <div key={listing.id} className="px-5 py-3">
                    <p className="text-sm font-medium text-(--text-primary)">{listing.title}</p>
                    <p className="text-xs text-(--text-muted) mt-1">{listing.category} · {listing.type}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
