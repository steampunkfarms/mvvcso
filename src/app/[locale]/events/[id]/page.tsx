import { eq, count } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { Calendar, MapPin, Users, Download } from 'lucide-react';
import { format } from 'date-fns';
import { db, schema } from '@/lib/db';
import type { Metadata } from 'next';
import { RsvpForm } from './rsvp-form';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const [event] = await db.select().from(schema.events).where(eq(schema.events.id, id));
  if (!event) return { title: 'Event Not Found' };
  return {
    title: event.titleEn,
    description: event.descriptionEn ?? `Join us for ${event.titleEn} at MVVCSO`,
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [event] = await db.select().from(schema.events).where(eq(schema.events.id, id));
  if (!event || !event.isPublic) notFound();

  const [{ value: rsvpCount }] = await db
    .select({ value: count() })
    .from(schema.eventRsvps)
    .where(eq(schema.eventRsvps.eventId, id));

  const isFull = event.maxRsvp ? Number(rsvpCount) >= event.maxRsvp : false;

  return (
    <div>
      <section className="py-(--section-padding) bg-sandy-gold/20">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding)">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-lg bg-sunset-peach/20 flex flex-col items-center justify-center text-terra-cotta shrink-0">
                <div className="text-xs font-bold uppercase leading-none">{format(event.date, 'MMM')}</div>
                <div className="text-2xl font-bold leading-none">{format(event.date, 'd')}</div>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-(--text-primary)">
                  {event.titleEn}
                </h1>
                {event.titleEs && (
                  <p className="text-(--text-muted) italic mt-1">{event.titleEs}</p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-(--text-secondary) mb-6">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-terra-cotta" />
                {format(event.date, 'EEEE, MMMM d, yyyy · h:mm a')}
                {event.endDate && ` — ${format(event.endDate, 'h:mm a')}`}
              </span>
              {event.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-terra-cotta" />
                  {event.location}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-terra-cotta" />
                {Number(rsvpCount)} attending{event.maxRsvp ? ` / ${event.maxRsvp} spots` : ''}
              </span>
            </div>

            <a
              href={`/api/events/${id}/ical`}
              className="inline-flex items-center gap-2 text-sm text-terra-cotta hover:text-terra-cotta-hover font-medium transition-colors mb-6"
            >
              <Download className="w-4 h-4" /> Add to calendar (.ics)
            </a>
          </div>
        </div>
      </section>

      <section className="py-(--section-padding) bg-desert-cream">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding)">
          <div className="max-w-3xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Description */}
            <div className="lg:col-span-3">
              {event.descriptionEn && (
                <div className="prose text-(--text-secondary)">
                  <p className="whitespace-pre-wrap">{event.descriptionEn}</p>
                </div>
              )}
              {event.descriptionEs && (
                <div className="mt-6 p-4 bg-sandy-gold/10 rounded-lg">
                  <p className="text-xs font-semibold text-(--text-muted) uppercase mb-2">En Español</p>
                  <p className="text-sm text-(--text-secondary) whitespace-pre-wrap">{event.descriptionEs}</p>
                </div>
              )}
            </div>

            {/* RSVP form */}
            <div className="lg:col-span-2">
              <RsvpForm eventId={id} isFull={isFull} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
