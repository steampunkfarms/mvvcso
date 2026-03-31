'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Tag, DollarSign } from 'lucide-react';

interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  price: number | null;
  photosJson: string | null;
  condition: string | null;
  location: string;
  createdAt: string;
  sellerName: string;
  sellerDisplayName: string | null;
}

const categories = ['tools', 'furniture', 'vehicles', 'livestock', 'produce', 'services', 'free', 'wanted', 'housing', 'other'];

function formatPrice(price: number | null, type: string): string {
  if (type === 'free') return 'Free';
  if (type === 'wanted') return 'Wanted';
  if (type === 'for_trade') return 'Trade';
  if (!price) return 'Contact for price';
  return `$${(price / 100).toFixed(price % 100 === 0 ? 0 : 2)}`;
}

export default function MarketplacePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    fetch(`/api/marketplace/listings?${params}`)
      .then(r => r.json())
      .then(setListings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category, search]);

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-(--container-max) mx-auto px-(--container-padding) py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-(--text-primary)">Ranchita Marketplace</h1>
          <Link href="/marketplace/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-400 text-white text-sm font-semibold hover:bg-gold-500 transition-colors">
            <Plus className="w-4 h-4" /> List Item
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-muted)" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search listings..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-200 bg-white text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:border-gold-400" />
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-stone-200 bg-white text-(--text-primary) focus:outline-none focus:border-gold-400 capitalize">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Listings grid */}
        {loading ? (
          <p className="text-center text-(--text-muted) py-12">Loading...</p>
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-xl p-12 border border-stone-200 text-center">
            <p className="text-(--text-muted)">No listings found. Be the first to list something!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map(listing => (
              <Link key={listing.id} href={`/marketplace/${listing.id}`}
                className="bg-white rounded-xl overflow-hidden border border-stone-200 hover:shadow-md transition-shadow">
                <div className="h-40 bg-stone-100 flex items-center justify-center">
                  <Tag className="w-8 h-8 text-(--text-muted)" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs capitalize text-stone-600 bg-terra-50 px-2 py-0.5 rounded">{listing.category}</span>
                    <span className={`text-sm font-bold ${listing.type === 'free' ? 'text-sage-600' : 'text-gold-600'}`}>
                      {formatPrice(listing.price, listing.type)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-(--text-primary) mb-1 truncate">{listing.title}</h3>
                  <p className="text-xs text-(--text-muted) truncate">{listing.description}</p>
                  <p className="text-xs text-(--text-muted) mt-2">{listing.sellerDisplayName || listing.sellerName} · {listing.location}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
