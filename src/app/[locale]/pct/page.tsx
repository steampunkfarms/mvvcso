import { useTranslations } from 'next-intl';
import { ExternalLink, Mountain, Map } from 'lucide-react';
import type { Metadata } from 'next';
import { TrailMapWrapper } from '@/components/pct/trail-map-wrapper';

export const metadata: Metadata = {
  title: 'Virtual PCT Hike',
  description:
    'Explore the Pacific Crest Trail through Ranchita — interactive map, waypoints, and trail resources for the San Diego backcountry.',
};

const waypoints = [
  {
    name: 'Barrel Spring',
    lat: 33.1375,
    lng: -116.5528,
    elevation: '3,200 ft',
    description: 'A reliable water source for PCT hikers, Barrel Spring marks the transition from desert lowlands into the Montezuma Valley. Ranchita volunteers have maintained a water cache here for years.',
  },
  {
    name: 'Montezuma Valley Road Crossing',
    lat: 33.0800,
    lng: -116.4700,
    elevation: '3,800 ft',
    description: 'Where the PCT crosses S22 / Montezuma Valley Road. This is the closest point to Ranchita — hikers often walk or hitch into town for resupply.',
  },
  {
    name: 'San Felipe Hills',
    lat: 33.0600,
    lng: -116.4400,
    elevation: '3,400 ft',
    description: 'Rolling high desert hills with panoramic views of the Anza-Borrego Desert. Spring wildflowers paint the landscape in March and April.',
  },
  {
    name: 'Scissors Crossing',
    lat: 33.0247,
    lng: -116.4619,
    elevation: '2,200 ft',
    description: 'A major PCT trail landmark where Highway 78 and S2 intersect. Hikers often find trail magic here — water, snacks, and encouragement left by trail angels.',
  },
  {
    name: 'Ranchita Town Center',
    lat: 33.0550,
    lng: -116.5100,
    elevation: '4,000 ft',
    description: 'The heart of the Ranchita community. Home to the MVVCSO community center, Station 58, and the legendary Rancheti Yeti statue on S22.',
  },
  {
    name: 'Granite Mountain',
    lat: 33.1100,
    lng: -116.5000,
    elevation: '5,600 ft',
    description: 'Rising above the Montezuma Valley, Granite Mountain offers commanding views of the high desert and distant peaks. The PCT skirts its western slope.',
  },
];

export default function PctPage() {
  const t = useTranslations('pct');

  return (
    <div>
      {/* Hero */}
      <section className="py-(--section-padding) bg-stone-200/20">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding) text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-(--text-primary)">
            {t('title')}
          </h1>
          <p className="text-lg text-(--text-secondary) max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Map */}
      <section className="py-(--section-padding) bg-stone-50">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding)">
          <TrailMapWrapper waypoints={waypoints} />
        </div>
      </section>

      {/* Waypoints list */}
      <section className="py-(--section-padding) bg-stone-100">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {waypoints.map((wp) => (
              <div
                key={wp.name}
                className="bg-white rounded-xl p-6 shadow-sm border border-stone-200"
              >
                <div className="flex items-start gap-3 mb-3">
                  <Mountain className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-(--text-primary)">{wp.name}</h3>
                    <p className="text-xs text-dusk-500">{wp.elevation}</p>
                  </div>
                </div>
                <p className="text-sm text-(--text-secondary) leading-relaxed">
                  {wp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community context */}
      <section className="py-(--section-padding) bg-stone-50">
        <div className="max-w-3xl mx-auto px-(--container-padding) text-center">
          <h2 className="text-2xl font-bold mb-4 text-(--text-primary)">
            {t('community_title')}
          </h2>
          <p className="text-(--text-secondary) leading-relaxed mb-8">
            {t('community_text')}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://www.pcta.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-300/40 text-sm text-(--text-secondary) hover:border-gold-400 hover:text-gold-400 transition-colors"
            >
              <Map className="w-4 h-4" />
              Pacific Crest Trail Association
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://www.alltrails.com/trail/us/california/pacific-crest-trail-scissors-crossing-to-barrel-spring"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-300/40 text-sm text-(--text-secondary) hover:border-gold-400 hover:text-gold-400 transition-colors"
            >
              <Mountain className="w-4 h-4" />
              AllTrails
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
