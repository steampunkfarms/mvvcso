import { db, schema } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';
import { Store } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ranchita Mercantile',
  description: 'Shop local artisan goods from Ranchita craftspeople. 10% supports MVVCSO community programs.',
};

export const dynamic = 'force-dynamic';

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default async function MercantilePage() {
  const products = await db
    .select({
      id: schema.artisanProducts.id,
      title: schema.artisanProducts.title,
      description: schema.artisanProducts.description,
      category: schema.artisanProducts.category,
      price: schema.artisanProducts.price,
      photosJson: schema.artisanProducts.photosJson,
      fulfillment: schema.artisanProducts.fulfillment,
      isFeatured: schema.artisanProducts.isFeatured,
      vendorName: schema.artisanVendors.shopName,
      vendorId: schema.artisanProducts.vendorId,
    })
    .from(schema.artisanProducts)
    .innerJoin(schema.artisanVendors, eq(schema.artisanProducts.vendorId, schema.artisanVendors.id))
    .where(eq(schema.artisanProducts.isActive, true))
    .orderBy(desc(schema.artisanProducts.isFeatured), desc(schema.artisanProducts.createdAt));

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="py-(--section-padding) bg-stone-100">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding) text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-(--text-primary) mb-4">Ranchita Mercantile</h1>
          <p className="text-lg text-(--text-secondary) max-w-2xl mx-auto">
            Handcrafted goods from Ranchita artisans. 10% of every purchase supports MVVCSO programs.
          </p>
          <Link href="/mercantile/apply" className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg border border-stone-300 text-sm font-medium text-(--text-secondary) hover:border-gold-400 hover:text-gold-400 transition-colors">
            <Store className="w-4 h-4" /> Apply to Sell
          </Link>
        </div>
      </section>

      <section className="py-(--section-padding) bg-stone-50">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding)">
          {products.length === 0 ? (
            <div className="bg-white rounded-xl p-12 border border-stone-200 text-center">
              <Store className="w-10 h-10 text-(--text-muted) mx-auto mb-3" />
              <p className="text-(--text-primary) font-medium">The mercantile is opening soon!</p>
              <p className="text-sm text-(--text-muted) mt-1">Local artisans are setting up shop. Check back soon or apply to sell.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <Link key={product.id} href={`/mercantile/product/${product.id}`}
                  className="bg-white rounded-xl overflow-hidden border border-stone-200 hover:shadow-md transition-shadow group">
                  <div className="h-48 bg-stone-100 flex items-center justify-center">
                    <Store className="w-8 h-8 text-(--text-muted)" />
                  </div>
                  <div className="p-4">
                    {product.isFeatured && (
                      <span className="text-xs font-semibold text-gold-600 bg-gold-50 px-2 py-0.5 rounded">Featured</span>
                    )}
                    <h3 className="font-semibold text-(--text-primary) mt-1 group-hover:text-gold-400 transition-colors">{product.title}</h3>
                    <p className="text-xs text-(--text-muted) mt-1">by {product.vendorName}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-gold-600 font-bold">{formatPrice(product.price)}</span>
                      <span className="text-xs text-(--text-muted) capitalize">{product.fulfillment.replace('_', ' ')}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
