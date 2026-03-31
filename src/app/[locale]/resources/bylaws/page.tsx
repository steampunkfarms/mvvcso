import { BYLAWS } from '@/lib/transparency-docs';
import { DocCard } from '@/components/resources/doc-card';
import { SubPageHeader } from '@/components/resources/sub-page-header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bylaws',
  description: 'The governing bylaws of MVVCSO, ratified by the membership. Available in English and Spanish.',
};

export default function BylawsPage() {
  return (
    <div>
      <SubPageHeader
        title="Bylaws"
        description="The governing document of MVVCSO, ratified by membership vote. Available in English and Spanish, including large-print versions."
        count={BYLAWS.length}
      />

      <section className="py-(--section-padding) bg-stone-50">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding)">
          <div className="space-y-4">
            {BYLAWS.map((doc) => (
              <DocCard key={doc.slug} doc={doc} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
