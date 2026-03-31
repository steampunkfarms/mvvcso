import { gte, eq } from 'drizzle-orm';
import Link from 'next/link';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { db, schema } from '@/lib/db';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming community events from MVVCSO — meetings, trainings, fundraisers, and social gatherings in Ranchita.',
};

export default async function EventsPage() {
  const now = new Date();
  const events = await db
    .select()
    .from(schema.events)
    .where(gte(schema.events.date, now))
    .orderBy(schema.events.date);

  const publicEvents = events.filter(e => e.isPublic);

  return (
    <div>
      {/* Hero */}
      <section className="py-(--section-padding) bg-stone-200/20">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding) text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-(--text-primary)">
            Community Events
          </h1>
          <p className="text-lg text-(--text-secondary) max-w-2xl mx-auto">
            Join your Ranchita neighbors for meetings, trainings, fundraisers, and community gatherings.
          </p>
        </div>
      </section>

      {/* Events grid */}
      <section className="py-(--section-padding) bg-stone-50">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding)">
          {publicEvents.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="w-12 h-12 text-(--text-muted) mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-(--text-primary) mb-2">No upcoming events</h2>
              <p className="text-(--text-secondary)">Check back soon — we&apos;re always planning something!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {publicEvents.map(event => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="group bg-white rounded-xl border border-stone-200 p-6 hover:border-gold-400/30 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-lg bg-gold-100/20 flex flex-col items-center justify-center text-gold-400 shrink-0">
                      <div className="text-xs font-bold uppercase leading-none">{format(event.date, 'MMM')}</div>
                      <div className="text-xl font-bold leading-none">{format(event.date, 'd')}</div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold text-(--text-primary) group-hover:text-gold-400 transition-colors">
                        {event.titleEn}
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1 text-sm text-(--text-muted)">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {format(event.date, 'EEEE, h:mm a')}
                        </span>
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {event.location}
                          </span>
                        )}
                      </div>
                      {event.descriptionEn && (
                        <p className="text-sm text-(--text-secondary) mt-2 line-clamp-2">
                          {event.descriptionEn}
                        </p>
                      )}
                      <span className="inline-flex items-center gap-1 text-sm text-gold-400 font-medium mt-3">
                        Details & RSVP <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
