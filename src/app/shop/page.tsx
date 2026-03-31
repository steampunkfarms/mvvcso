import { db, schema } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rancheti Shop',
  description: 'Official MVVCSO merchandise — 100% of proceeds support Ranchita community programs.',
};

export const dynamic = 'force-dynamic';

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default async function ShopPage() {
  const products = await db
    .select()
    .from(schema.shopProducts)
    .where(eq(schema.shopProducts.isActive, true))
    .orderBy(schema.shopProducts.sortOrder);

  const variants = await db.select().from(schema.shopVariants);

  const productPrices = new Map<string, { min: number; max: number }>();
  for (const v of variants) {
    const existing = productPrices.get(v.productId);
    if (!existing) {
      productPrices.set(v.productId, { min: v.retailPrice, max: v.retailPrice });
    } else {
      existing.min = Math.min(existing.min, v.retailPrice);
      existing.max = Math.max(existing.max, v.retailPrice);
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="py-(--section-padding) bg-stone-100">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding) text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-(--text-primary) mb-4">Rancheti Shop</h1>
          <p className="text-lg text-(--text-secondary) max-w-2xl mx-auto">
            Official MVVCSO merchandise. 100% of proceeds support Ranchita community programs.
          </p>
        </div>
      </section>

      <section className="py-(--section-padding) bg-stone-50">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding)">
          {products.length === 0 ? (
            <div className="bg-white rounded-xl p-12 border border-stone-200 text-center">
              <ShoppingBag className="w-10 h-10 text-(--text-muted) mx-auto mb-3" />
              <p className="text-(--text-primary) font-medium">Shop coming soon!</p>
              <p className="text-sm text-(--text-muted) mt-1">Rancheti merch is on the way. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => {
                const prices = productPrices.get(product.id);
                const priceDisplay = prices
                  ? prices.min === prices.max
                    ? formatPrice(prices.min)
                    : `${formatPrice(prices.min)} – ${formatPrice(prices.max)}`
                  : '—';

                return (
                  <Link key={product.id} href={`/shop/${product.id}`}
                    className="bg-white rounded-xl overflow-hidden border border-stone-200 hover:shadow-md transition-shadow group">
                    <div className="h-48 bg-stone-100 flex items-center justify-center">
                      {product.thumbnailUrl ? (
                        <img src={product.thumbnailUrl} alt={product.name} className="h-full w-full object-cover" />
                      ) : (
                        <ShoppingBag className="w-10 h-10 text-(--text-muted)" />
                      )}
                    </div>
                    <div className="p-4">
                      <span className="text-xs capitalize text-stone-600 bg-terra-50 px-2 py-0.5 rounded">{product.category}</span>
                      <h3 className="font-semibold text-(--text-primary) mt-2 group-hover:text-gold-400 transition-colors">{product.name}</h3>
                      <p className="text-gold-600 font-bold mt-1">{priceDisplay}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
