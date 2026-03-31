import { requireAuth } from '@/lib/auth';
import { db, schema } from '@/lib/db';
import { desc, eq } from 'drizzle-orm';
import { format } from 'date-fns';
import { Store } from 'lucide-react';
import { getRoleLabel } from '@/lib/permissions';

export default async function AdminMercantilePage() {
  await requireAuth(['president', 'treasurer']);

  const vendors = await db
    .select({
      id: schema.artisanVendors.id,
      shopName: schema.artisanVendors.shopName,
      status: schema.artisanVendors.status,
      stripeOnboardingComplete: schema.artisanVendors.stripeOnboardingComplete,
      createdAt: schema.artisanVendors.createdAt,
      userName: schema.authUsers.name,
      userEmail: schema.authUsers.email,
    })
    .from(schema.artisanVendors)
    .innerJoin(schema.authUsers, eq(schema.artisanVendors.userId, schema.authUsers.id))
    .orderBy(desc(schema.artisanVendors.createdAt));

  const statusColors: Record<string, string> = {
    pending: 'bg-gold-50 text-gold-600',
    approved: 'bg-dusk-50 text-dusk-600',
    active: 'bg-sage-50 text-sage-600',
    suspended: 'bg-red-50 text-red-600',
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-(--text-primary)">Artisan Mercantile Admin</h1>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-stone-200 bg-stone-100">
          <span className="text-sm font-semibold text-(--text-primary)">Vendors ({vendors.length})</span>
        </div>
        {vendors.length === 0 ? (
          <div className="p-8 text-center">
            <Store className="w-8 h-8 text-(--text-muted) mx-auto mb-3" />
            <p className="text-(--text-muted)">No vendor applications yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 text-left">
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Shop Name</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Owner</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Status</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Stripe</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Applied</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/50">
              {vendors.map(v => (
                <tr key={v.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 text-(--text-primary) font-medium">{v.shopName}</td>
                  <td className="px-4 py-3 text-(--text-secondary)">{v.userName}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded capitalize ${statusColors[v.status] || 'bg-stone-100'}`}>{v.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs ${v.stripeOnboardingComplete ? 'text-sage-600' : 'text-(--text-muted)'}`}>
                      {v.stripeOnboardingComplete ? 'Complete' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-(--text-muted) text-xs">{format(v.createdAt, 'MMM d, yyyy')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
