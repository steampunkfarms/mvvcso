'use client';

import { useEffect, useRef } from 'react';

const timelineEvents = [
  {
    year: 1973,
    title: 'MVVFD Founded',
    description:
      'Residents of Ranchita establish the Montezuma Valley Volunteer Fire Department to provide fire protection for the remote backcountry community.',
  },
  {
    year: 1977,
    title: 'Incorporated as Nonprofit',
    description:
      'MVVFD incorporates as a nonprofit with federal tax-exempt status. Patty Miller listed as principal officer — she would serve for decades.',
  },
  {
    year: 1990,
    title: 'Community Institution',
    description:
      'MVVFD hosts annual community BBQ fundraisers and award nights. Multiple generations of local families serve as volunteers. Fire Chief Gary Loyd and Patty Miller lead through the decade.',
  },
  {
    year: 2002,
    title: 'Pines Fire Response',
    description:
      "Volunteers stand vigilant during the Pines Fire, protecting homes and ranches along the fire lines in San Diego's backcountry.",
  },
  {
    year: 2003,
    title: 'Cedar Fire Response',
    description:
      'MVVFD responds to the devastating Cedar Fire. Volunteers protect the community as wildfires threaten Ranchita, earning recognition for bravery and rapid response.',
  },
  {
    year: 2004,
    title: 'FEMA Grant Awarded',
    description:
      'MVVFD secures a FEMA Assistance to Firefighters Grant of approximately $41,500, funding critical equipment purchases and facility improvements.',
  },
  {
    year: 2008,
    title: 'County Fire Integration',
    description:
      'MVVFD integrates into the San Diego Regional Fire Authority. Station 58 in Ranchita transitions to CAL FIRE management while the volunteer organization retains property ownership.',
  },
  {
    year: 2014,
    title: 'New Fire Station Built',
    description:
      'A new state-of-the-art fire station opens in Ranchita, funded by approximately $880,000 from the County, replacing the original volunteer-built facility.',
  },
  {
    year: 2020,
    title: 'Rebrand to MVVCSO',
    description:
      'The organization rebrands as the Montezuma Valley Volunteer Community Service Organization, expanding its mission beyond firefighting to comprehensive community services.',
  },
  {
    year: 2021,
    title: 'Market Fire Response',
    description:
      "When the Montezuma Valley Market — Ranchita's only store — is destroyed by fire, MVVCSO volunteers rally the community for response and recovery. The Rancheti Yeti statue survives.",
  },
  {
    year: 2025,
    title: 'New Board, New Era',
    description:
      'A new 7-member board takes office, bringing fresh energy to programs including CERT training, youth engagement, food security partnerships, and the community center campaign.',
  },
];

export function HistoryTimeline() {
  return (
    <div className="relative max-w-3xl mx-auto">
      {/* Vertical line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-stone-200 md:-translate-x-px" />

      <div className="space-y-12">
        {timelineEvents.map((event, i) => (
          <TimelineNode key={event.year} event={event} index={i} />
        ))}
      </div>
    </div>
  );
}

function TimelineNode({
  event,
  index,
}: {
  event: (typeof timelineEvents)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('opacity-100', 'translate-y-0');
          el.classList.remove('opacity-0', 'translate-y-4');
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isLeft = index % 2 === 0;

  return (
    <div
      ref={ref}
      className="relative opacity-0 translate-y-4 transition-all duration-700 ease-out pl-12 md:pl-0"
    >
      {/* Dot on the line */}
      <div className="absolute left-4 md:left-1/2 top-1 w-3 h-3 rounded-full bg-gold-400 border-2 border-stone-50 -translate-x-1/2 z-10" />

      {/* Content card */}
      <div
        className={`md:w-[calc(50%-2rem)] ${
          isLeft ? 'md:mr-auto md:pr-0' : 'md:ml-auto md:pl-0'
        }`}
      >
        <div className="bg-white rounded-xl p-5 shadow-sm border border-stone-200">
          <span className="inline-block text-sm font-bold text-gold-400 mb-1">
            {event.year}
          </span>
          <h3 className="text-lg font-semibold text-(--text-primary) mb-2">
            {event.title}
          </h3>
          <p className="text-sm text-(--text-secondary) leading-relaxed">
            {event.description}
          </p>
        </div>
      </div>
    </div>
  );
}
