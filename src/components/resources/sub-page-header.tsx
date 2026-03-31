import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function SubPageHeader({
  title,
  description,
  count,
}: {
  title: string;
  description: string;
  count: number;
}) {
  return (
    <section className="py-(--section-padding) bg-stone-200/20">
      <div className="max-w-(--container-max) mx-auto px-(--container-padding)">
        <Link
          href="/resources"
          className="inline-flex items-center gap-1.5 text-sm text-gold-400 hover:text-gold-500 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> All Resources
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-(--text-primary) mb-2">
          {title}
        </h1>
        <p className="text-lg text-(--text-secondary) max-w-2xl">
          {description}
        </p>
        <p className="text-sm text-(--text-muted) mt-2">
          {count} {count === 1 ? 'document' : 'documents'}
        </p>
      </div>
    </section>
  );
}
