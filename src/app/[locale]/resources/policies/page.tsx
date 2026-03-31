import { POLICIES } from '@/lib/transparency-docs';
import { DocCard } from '@/components/resources/doc-card';
import { SubPageHeader } from '@/components/resources/sub-page-header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Policies',
  description: 'Board-adopted policies covering ethics, privacy, fundraising, accessibility, and more.',
};

export default function PoliciesPage() {
  return (
    <div>
      <SubPageHeader
        title="Policies"
        description="17 board-adopted policies that govern how MVVCSO operates — from ethics and privacy to fundraising and accessibility."
        count={POLICIES.length}
      />

      <section className="py-(--section-padding) bg-stone-50">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {POLICIES.map((doc) => (
              <DocCard key={doc.slug} doc={doc} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
