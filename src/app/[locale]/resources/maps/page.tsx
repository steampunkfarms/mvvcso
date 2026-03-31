import { MAPS } from '@/lib/transparency-docs';
import { DocCard } from '@/components/resources/doc-card';
import { SubPageHeader } from '@/components/resources/sub-page-header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Boundary Maps',
  description: 'Defined precinct boundaries for MVVCSO voting membership — English and Spanish.',
};

export default function MapsPage() {
  return (
    <div>
      <SubPageHeader
        title="Boundary Maps"
        description="Geographic boundaries defining MVVCSO voting membership eligibility. Available in English and Spanish."
        count={MAPS.length}
      />

      <section className="py-(--section-padding) bg-stone-50">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding)">
          <div className="space-y-4">
            {MAPS.map((doc) => (
              <DocCard key={doc.slug} doc={doc} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
