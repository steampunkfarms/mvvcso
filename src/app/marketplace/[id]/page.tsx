'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Tag, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { LaunchingSoon } from '@/components/shared/launching-soon';

interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  price: number | null;
  condition: string | null;
  location: string;
  createdAt: string;
  sellerName: string;
  sellerDisplayName: string | null;
}

function formatPrice(price: number | null, type: string): string {
  if (type === 'free') return 'Free';
  if (type === 'wanted') return 'Wanted';
  if (type === 'for_trade') return 'Trade';
  if (!price) return 'Contact for price';
  return `$${(price / 100).toFixed(price % 100 === 0 ? 0 : 2)}`;
}

export default function ListingDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [listing, setListing] = useState<Listing | null>(null);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    fetch(`/api/marketplace/listings`).then(r => r.json()).then((listings: Listing[]) => {
      const found = listings.find((l: Listing) => l.id === id);
      if (found) setListing(found);
    });
  }, [id]);

  if (!listing) return <div className="min-h-screen bg-stone-50 flex items-center justify-center"><p className="text-(--text-muted)">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-(--container-max) mx-auto px-(--container-padding) py-8">
        <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm text-gold-400 hover:text-gold-500 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to marketplace
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2">
            <div className="bg-stone-100 rounded-xl h-64 flex items-center justify-center mb-6">
              <Tag className="w-12 h-12 text-(--text-muted)" />
            </div>

            <h1 className="text-2xl font-bold text-(--text-primary) mb-2">{listing.title}</h1>

            <div className="flex items-center gap-3 mb-4">
              <span className={`text-xl font-bold ${listing.type === 'free' ? 'text-sage-600' : 'text-gold-600'}`}>
                {formatPrice(listing.price, listing.type)}
              </span>
              <span className="text-xs capitalize bg-terra-50 text-stone-700 px-2 py-0.5 rounded">{listing.category}</span>
              {listing.condition && (
                <span className="text-xs capitalize bg-stone-100 text-(--text-muted) px-2 py-0.5 rounded">{listing.condition}</span>
              )}
            </div>

            <p className="text-(--text-secondary) leading-relaxed mb-6">{listing.description}</p>

            <div className="flex items-center gap-2 text-sm text-(--text-muted)">
              <MapPin className="w-4 h-4" /> {listing.location}
              <span className="mx-2">·</span>
              Posted {formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 border border-stone-200">
              <h3 className="font-semibold text-(--text-primary) mb-3">Seller</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-terra-100 flex items-center justify-center text-sm font-bold text-stone-700">
                  {(listing.sellerDisplayName || listing.sellerName).charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-(--text-primary)">{listing.sellerDisplayName || listing.sellerName}</span>
              </div>
              <button onClick={() => setShowMessage(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gold-400 text-white font-semibold hover:bg-gold-500 transition-colors">
                <MessageCircle className="w-4 h-4" /> Message Seller
              </button>
            </div>

            {showMessage && (
              <div className="bg-white rounded-xl p-6 border border-stone-200">
                <LaunchingSoon feature="Messaging" description="In-platform messaging is launching soon. For now, reach out through the community feed." />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
