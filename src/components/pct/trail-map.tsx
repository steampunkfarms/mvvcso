'use client';

import { useEffect, useRef } from 'react';

interface Waypoint {
  name: string;
  lat: number;
  lng: number;
  elevation: string;
  description: string;
}

interface TrailMapProps {
  waypoints: Waypoint[];
}

export function TrailMap({ waypoints }: TrailMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Dynamically import Leaflet
    import('leaflet').then((L) => {
      import('leaflet/dist/leaflet.css');

      const map = L.map(mapRef.current!, {
        scrollWheelZoom: false,
      }).setView([33.07, -116.48], 11);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      // Custom marker icon
      const markerIcon = L.divIcon({
        html: `<div style="width:12px;height:12px;border-radius:50%;background:#ca7e56;border:2px solid #fff1da;box-shadow:0 1px 3px rgba(0,0,0,0.3)"></div>`,
        className: '',
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      });

      // Add waypoints
      waypoints.forEach((wp) => {
        L.marker([wp.lat, wp.lng], { icon: markerIcon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:system-ui;max-width:220px">
              <strong style="color:#3d2e1f">${wp.name}</strong>
              <br/><span style="color:#878763;font-size:12px">${wp.elevation}</span>
              <br/><span style="color:#6b5744;font-size:13px;line-height:1.4">${wp.description}</span>
            </div>`
          );
      });

      // Draw approximate PCT trail line
      const trailCoords: [number, number][] = [
        [33.16, -116.57],
        [33.1375, -116.5528],
        [33.11, -116.50],
        [33.08, -116.47],
        [33.06, -116.44],
        [33.04, -116.45],
        [33.0247, -116.4619],
      ];

      L.polyline(trailCoords, {
        color: '#ca7e56',
        weight: 3,
        opacity: 0.7,
        dashArray: '8,6',
      }).addTo(map);

      mapInstance.current = map;
    });

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, [waypoints]);

  return (
    <div
      ref={mapRef}
      className="h-[500px] rounded-xl border border-sandy-gold overflow-hidden"
      style={{ zIndex: 0 }}
    />
  );
}
