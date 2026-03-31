import { FORMS } from '@/lib/transparency-docs';
import { DocCard } from '@/components/resources/doc-card';
import { SubPageHeader } from '@/components/resources/sub-page-header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forms & Applications',
  description: 'Membership applications, misconduct reporting, and other forms — available in English and Spanish.',
};

export default function FormsPage() {
  return (
    <div>
      <SubPageHeader
        title="Forms & Applications"
        description="Membership applications, misconduct reporting, and other forms. Available in English and Spanish."
        count={FORMS.length}
      />

      <section className="py-(--section-padding) bg-stone-50">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding)">
          <div className="space-y-4">
            {FORMS.map((doc) => (
              <DocCard key={doc.slug} doc={doc} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
