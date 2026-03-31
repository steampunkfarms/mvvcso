'use client';

import dynamic from 'next/dynamic';

const TrailMap = dynamic(
  () => import('./trail-map').then((m) => m.TrailMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] rounded-xl bg-sandy-gold/20 flex items-center justify-center">
        <p className="text-(--text-muted)">Loading map...</p>
      </div>
    ),
  }
);

interface Waypoint {
  name: string;
  lat: number;
  lng: number;
  elevation: string;
  description: string;
}

export function TrailMapWrapper({ waypoints }: { waypoints: Waypoint[] }) {
  return <TrailMap waypoints={waypoints} />;
}
