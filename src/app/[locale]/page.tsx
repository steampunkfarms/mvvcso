import { Hero } from '@/components/home/hero';
import { Mission } from '@/components/home/mission';
import { ProgramsPreview } from '@/components/home/programs-preview';
import { ImpactStats } from '@/components/home/impact-stats';
import { Partners } from '@/components/home/partners';
import { NewsletterSection } from '@/components/layout/newsletter-bar';
import { DonateCta } from '@/components/home/cta-section';

export default function HomePage() {
  return (
    <div>
      <Hero />
      <Mission />
      <ProgramsPreview />
      <ImpactStats />
      <Partners />
      <NewsletterSection />
      <DonateCta />
    </div>
  );
}
