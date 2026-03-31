import { eq, count } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Users, Download, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { db, schema } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();
  const { id } = await params;

  const [event] = await db.select().from(schema.events).where(eq(schema.events.id, id));
  if (!event) notFound();

  const rsvps = await db.select().from(schema.eventRsvps).where(eq(schema.eventRsvps.eventId, id));
  const [{ value: rsvpCount }] = await db.select({ value: count() }).from(schema.eventRsvps).where(eq(schema.eventRsvps.eventId, id));

  return (
    <div>
      <Link href="/admin/events" className="inline-flex items-center gap-1 text-sm text-gold-400 hover:text-gold-500 mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to events
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Event details */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-(--text-primary)">{event.titleEn}</h1>
                {event.titleEs && (
                  <p className="text-sm text-(--text-muted) italic mt-1">{event.titleEs}</p>
                )}
              </div>
              <div className="flex gap-2">
                {event.category && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-terra-500/10 text-stone-600">
                    {event.category}
                  </span>
                )}
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  event.isPublic ? 'bg-green-100 text-green-700' : 'bg-terra-50/10 text-terra-400'
                }`}>
                  {event.isPublic ? 'Public' : 'Private'}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center gap-2 text-(--text-secondary)">
                <Calendar className="w-4 h-4 text-(--text-muted)" />
                {format(event.date, 'EEEE, MMMM d, yyyy · h:mm a')}
                {event.endDate && ` — ${format(event.endDate, 'h:mm a')}`}
              </div>
              {event.location && (
                <div className="flex items-center gap-2 text-(--text-secondary)">
                  <MapPin className="w-4 h-4 text-(--text-muted)" />
                  {event.location}
                </div>
              )}
              <div className="flex items-center gap-2 text-(--text-secondary)">
                <Users className="w-4 h-4 text-(--text-muted)" />
                {Number(rsvpCount)} RSVPs{event.maxRsvp ? ` / ${event.maxRsvp} max` : ''}
              </div>
            </div>

            {event.descriptionEn && (
              <div className="prose prose-sm text-(--text-secondary) max-w-none">
                <p className="whitespace-pre-wrap">{event.descriptionEn}</p>
              </div>
            )}
          </div>

          {/* RSVP list */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h2 className="text-lg font-bold text-(--text-primary) mb-4">RSVPs ({Number(rsvpCount)})</h2>

            {rsvps.length === 0 ? (
              <p className="text-sm text-(--text-muted) text-center py-6">No RSVPs yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200/50">
                    <th className="text-left py-2 text-(--text-secondary) font-semibold">Name</th>
                    <th className="text-left py-2 text-(--text-secondary) font-semibold hidden sm:table-cell">Email</th>
                    <th className="text-left py-2 text-(--text-secondary) font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rsvps.map(r => (
                    <tr key={r.id} className="border-b border-stone-200/20">
                      <td className="py-2 text-(--text-primary)">{r.name}</td>
                      <td className="py-2 text-(--text-secondary) hidden sm:table-cell">{r.email}</td>
                      <td className="py-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          r.status === 'attending' ? 'bg-green-100 text-green-700' :
                          r.status === 'maybe' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Link
            href={`/admin/events/${id}/edit`}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-gold-400 text-white text-sm font-semibold hover:bg-gold-500 transition-colors"
          >
            <Pencil className="w-4 h-4" /> Edit Event
          </Link>
          <a
            href={`/api/events/${id}/ical`}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg border border-stone-200 text-sm font-medium text-(--text-secondary) hover:bg-stone-100 transition-colors"
          >
            <Download className="w-4 h-4" /> Download .ics
          </a>
          {event.isPublic && (
            <Link
              href={`/en/events/${id}`}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg border border-stone-200 text-sm font-medium text-(--text-secondary) hover:bg-stone-100 transition-colors"
              target="_blank"
            >
              View public page ↗
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
