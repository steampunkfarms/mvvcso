import { requireAuth } from '@/lib/auth';
import { db, schema } from '@/lib/db';
import { desc, sql } from 'drizzle-orm';
import { Gamepad2, Users, Award, Palette } from 'lucide-react';

export default async function AdminKidsPage() {
  await requireAuth(['president', 'secretary']);

  const children = await db.select().from(schema.childAccounts).orderBy(desc(schema.childAccounts.createdAt));
  const active = children.filter(c => c.isActive);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-(--text-primary)">Kids Portal Admin</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-(--text-muted)">Active Children</span>
            <Users className="w-5 h-5 text-stone-600" />
          </div>
          <div className="text-2xl font-bold text-(--text-primary)">{active.length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-(--text-muted)">Total Accounts</span>
            <Gamepad2 className="w-5 h-5 text-gold-400" />
          </div>
          <div className="text-2xl font-bold text-(--text-primary)">{children.length}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-stone-200 bg-stone-100">
          <span className="text-sm font-semibold text-(--text-primary)">Child Accounts</span>
        </div>
        {children.length === 0 ? (
          <p className="p-8 text-center text-(--text-muted)">No child accounts yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 text-left">
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Display Name</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Age Range</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Status</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Consent Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/50">
              {children.map(child => (
                <tr key={child.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 text-(--text-primary) font-medium">{child.displayName}</td>
                  <td className="px-4 py-3 text-(--text-secondary)">{child.ageRange}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${child.isActive ? 'bg-sage-50 text-sage-600' : 'bg-stone-100 text-(--text-muted)'}`}>
                      {child.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-(--text-muted) text-xs">{child.consentDate.toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
