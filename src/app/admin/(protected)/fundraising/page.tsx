import Link from 'next/link';
import { requireAuth } from '@/lib/auth';
import { db, schema } from '@/lib/db';
import { desc } from 'drizzle-orm';
import { format } from 'date-fns';
import { Plus, Target } from 'lucide-react';

function formatCents(cents: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

export default async function AdminFundraisingPage() {
  await requireAuth(['president', 'treasurer']);
  const allCampaigns = await db.select().from(schema.campaigns).orderBy(desc(schema.campaigns.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-(--text-primary)">Fundraising Campaigns</h1>
        <Link href="/admin/fundraising/new" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-400 text-white text-sm font-semibold hover:bg-gold-500 transition-colors">
          <Plus className="w-4 h-4" /> New Campaign
        </Link>
      </div>

      {allCampaigns.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-stone-200 text-center">
          <Target className="w-10 h-10 text-(--text-muted) mx-auto mb-3" />
          <p className="text-(--text-primary) font-medium">No campaigns yet</p>
          <p className="text-sm text-(--text-muted) mt-1">Create your first fundraising campaign.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {allCampaigns.map(campaign => {
            const pct = campaign.goalAmount
              ? Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100)
              : 0;

            return (
              <div key={campaign.id} className="bg-white rounded-xl p-6 border border-stone-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-(--text-primary)">{campaign.name}</h3>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${campaign.isActive ? 'bg-sage-50 text-sage-600' : 'bg-stone-100 text-(--text-muted)'}`}>
                    {campaign.isActive ? 'Active' : 'Ended'}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-(--text-secondary) mb-3">
                  <span>Raised: <strong className="text-sage-600">{formatCents(campaign.raisedAmount)}</strong></span>
                  {campaign.goalAmount && <span>Goal: {formatCents(campaign.goalAmount)}</span>}
                  {campaign.endDate && <span>Ends: {format(campaign.endDate, 'MMM d, yyyy')}</span>}
                </div>
                {campaign.goalAmount && (
                  <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gold-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
