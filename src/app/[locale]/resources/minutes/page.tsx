import { MEETING_MINUTES, MINUTE_YEARS, getMinutesByYear } from '@/lib/transparency-docs';
import { MinutesBrowser } from '@/components/resources/minutes-browser';
import { SubPageHeader } from '@/components/resources/sub-page-header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meeting Minutes',
  description: 'Board meeting minutes from 2020 to present — browse by year. Full transparency into MVVCSO governance.',
};

export default function MinutesPage() {
  const minutesByYear: Record<number, typeof MEETING_MINUTES> = {};
  for (const year of MINUTE_YEARS) {
    minutesByYear[year] = getMinutesByYear(year);
  }

  return (
    <div>
      <SubPageHeader
        title="Meeting Minutes"
        description="Board meeting minutes from 2020 to present. Browse by year to see regular meetings, special sessions, and attendance records."
        count={MEETING_MINUTES.length}
      />

      <section className="py-(--section-padding) bg-stone-50">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding)">
          <MinutesBrowser years={MINUTE_YEARS} minutesByYear={minutesByYear} />
        </div>
      </section>
    </div>
  );
}
