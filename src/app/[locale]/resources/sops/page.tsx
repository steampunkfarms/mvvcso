import { SOPS } from '@/lib/transparency-docs';
import { DocCard } from '@/components/resources/doc-card';
import { SubPageHeader } from '@/components/resources/sub-page-header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Standard Operating Procedures',
  description: 'SOPs for MVVCSO committees, officers, and volunteers — how the organization operates day-to-day.',
};

export default function SOPsPage() {
  return (
    <div>
      <SubPageHeader
        title="Standard Operating Procedures"
        description="How committees, officers, and volunteers operate day-to-day. These SOPs define roles, responsibilities, and workflows."
        count={SOPS.length}
      />

      <section className="py-(--section-padding) bg-stone-50">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SOPS.map((doc) => (
              <DocCard key={doc.slug} doc={doc} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
