import { requireAuth } from '@/lib/auth';
import { db, schema } from '@/lib/db';
import { desc, eq, sql, gte } from 'drizzle-orm';
import { format } from 'date-fns';
import { Users, Mail, TrendingUp } from 'lucide-react';

export default async function AdminNewsletterPage() {
  await requireAuth(['president', 'secretary', 'content_manager']);

  const subscribers = await db.select().from(schema.subscribers).orderBy(desc(schema.subscribers.createdAt));
  const active = subscribers.filter(s => s.status === 'active');
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const newThisMonth = subscribers.filter(s => s.createdAt >= startOfMonth && s.status === 'active');
  const enCount = active.filter(s => s.language === 'en').length;
  const esCount = active.filter(s => s.language === 'es').length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-(--text-primary)">Newsletter Management</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-(--text-muted)">Active Subscribers</span>
            <Users className="w-5 h-5 text-dusk-500" />
          </div>
          <div className="text-2xl font-bold text-(--text-primary)">{active.length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-(--text-muted)">New This Month</span>
            <TrendingUp className="w-5 h-5 text-sage-400" />
          </div>
          <div className="text-2xl font-bold text-(--text-primary)">{newThisMonth.length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-(--text-muted)">English</span>
            <Mail className="w-5 h-5 text-dusk-500" />
          </div>
          <div className="text-2xl font-bold text-(--text-primary)">{enCount}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-(--text-muted)">Spanish</span>
            <Mail className="w-5 h-5 text-gold-400" />
          </div>
          <div className="text-2xl font-bold text-(--text-primary)">{esCount}</div>
        </div>
      </div>

      {/* Subscriber list */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-stone-200 bg-stone-100">
          <span className="text-sm font-semibold text-(--text-primary)">All Subscribers ({subscribers.length})</span>
        </div>
        {subscribers.length === 0 ? (
          <p className="p-8 text-center text-(--text-muted)">No subscribers yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 text-left">
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Email</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Name</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Language</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Source</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Status</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/50">
              {subscribers.map(sub => (
                <tr key={sub.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 text-(--text-primary)">{sub.email}</td>
                  <td className="px-4 py-3 text-(--text-secondary)">{sub.name || '—'}</td>
                  <td className="px-4 py-3 text-(--text-secondary) uppercase text-xs">{sub.language}</td>
                  <td className="px-4 py-3 text-(--text-muted) text-xs">{sub.source}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${sub.status === 'active' ? 'bg-sage-50 text-sage-600' : 'bg-stone-100 text-(--text-muted)'}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-(--text-muted) text-xs">{format(sub.createdAt, 'MMM d, yyyy')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
