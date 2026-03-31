import { desc, gte, lt, count, eq } from 'drizzle-orm';
import Link from 'next/link';
import { Calendar, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { db, schema } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

async function getEvents() {
  const now = new Date();
  const [upcoming, past] = await Promise.all([
    db.select().from(schema.events).where(gte(schema.events.date, now)).orderBy(schema.events.date),
    db.select().from(schema.events).where(lt(schema.events.date, now)).orderBy(desc(schema.events.date)).limit(20),
  ]);
  return { upcoming, past };
}

export default async function EventsAdminPage() {
  await requireAuth();
  const { upcoming, past } = await getEvents();

  function EventRow({ event }: { event: typeof upcoming[0] }) {
    return (
      <Link
        href={`/admin/events/${event.id}`}
        className="flex items-center gap-4 p-4 hover:bg-stone-100/50 transition-colors border-b border-stone-200/20 last:border-0"
      >
        <div className="w-12 h-12 rounded-lg bg-gold-100/20 flex flex-col items-center justify-center text-gold-400 shrink-0">
          <div className="text-[10px] font-bold uppercase leading-none">{format(event.date, 'MMM')}</div>
          <div className="text-lg font-bold leading-none">{format(event.date, 'd')}</div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-medium text-(--text-primary) truncate">{event.titleEn}</div>
          <div className="text-xs text-(--text-muted)">
            {format(event.date, 'h:mm a')}
            {event.location && ` · ${event.location}`}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {event.category && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-terra-500/10 text-stone-600">
              {event.category}
            </span>
          )}
          {!event.isPublic && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-terra-50/10 text-terra-400">
              Private
            </span>
          )}
        </div>
      </Link>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-(--text-primary)">Events</h1>
          <p className="text-sm text-(--text-muted) mt-1">
            {upcoming.length} upcoming · {past.length} past
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gold-400 text-white text-sm font-semibold hover:bg-gold-500 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Event
        </Link>
      </div>

      {/* Upcoming */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-(--text-secondary) uppercase tracking-wider mb-3">Upcoming</h2>
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          {upcoming.length === 0 ? (
            <div className="p-8 text-center text-(--text-muted) text-sm">No upcoming events. Create one!</div>
          ) : (
            upcoming.map(e => <EventRow key={e.id} event={e} />)
          )}
        </div>
      </div>

      {/* Past */}
      {past.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-(--text-secondary) uppercase tracking-wider mb-3">Past</h2>
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden opacity-75">
            {past.map(e => <EventRow key={e.id} event={e} />)}
          </div>
        </div>
      )}
    </div>
  );
}
