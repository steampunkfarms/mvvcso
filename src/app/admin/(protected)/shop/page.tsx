import { requireAuth } from '@/lib/auth';
import { db, schema } from '@/lib/db';
import { desc } from 'drizzle-orm';
import { format } from 'date-fns';
import { ShoppingBag, DollarSign, Package, TrendingUp } from 'lucide-react';

function formatCents(cents: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

export default async function AdminShopPage() {
  await requireAuth(['president', 'treasurer']);

  const orders = await db.select().from(schema.shopOrders).orderBy(desc(schema.shopOrders.createdAt));
  const products = await db.select().from(schema.shopProducts);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalMargin = orders.reduce((sum, o) => sum + (o.margin || 0), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-(--text-primary)">Merch Shop Admin</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-(--text-muted)">Total Orders</span>
            <Package className="w-5 h-5 text-stone-600" />
          </div>
          <div className="text-2xl font-bold text-(--text-primary)">{orders.length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-(--text-muted)">Revenue</span>
            <DollarSign className="w-5 h-5 text-sage-400" />
          </div>
          <div className="text-2xl font-bold text-(--text-primary)">{formatCents(totalRevenue)}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-(--text-muted)">Margin</span>
            <TrendingUp className="w-5 h-5 text-sage-400" />
          </div>
          <div className="text-2xl font-bold text-(--text-primary)">{formatCents(totalMargin)}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-(--text-muted)">Products</span>
            <ShoppingBag className="w-5 h-5 text-stone-600" />
          </div>
          <div className="text-2xl font-bold text-(--text-primary)">{products.length}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-stone-200 bg-stone-100">
          <span className="text-sm font-semibold text-(--text-primary)">Recent Orders</span>
        </div>
        {orders.length === 0 ? (
          <p className="p-8 text-center text-(--text-muted)">No orders yet. Products will appear after Printful sync.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 text-left">
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Date</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Customer</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary) text-right">Total</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/50">
              {orders.map(o => (
                <tr key={o.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 text-(--text-muted) text-xs">{format(o.createdAt, 'MMM d, yyyy')}</td>
                  <td className="px-4 py-3 text-(--text-primary)">{o.customerName}</td>
                  <td className="px-4 py-3 text-right font-semibold text-(--text-primary)">{formatCents(o.total)}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-stone-100 text-(--text-muted) capitalize">{o.status}</span>
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
