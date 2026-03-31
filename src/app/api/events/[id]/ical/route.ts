import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db, schema } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const [event] = await db.select().from(schema.events).where(eq(schema.events.id, id));
  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }

  const formatDate = (d: Date) =>
    d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

  const endDate = event.endDate ?? new Date(event.date.getTime() + 2 * 60 * 60 * 1000);

  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MVVCSO//Events//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}@mvvcso.org`,
    `DTSTART:${formatDate(event.date)}`,
    `DTEND:${formatDate(endDate)}`,
    `SUMMARY:${event.titleEn}`,
    event.descriptionEn ? `DESCRIPTION:${event.descriptionEn.replace(/\n/g, '\\n')}` : '',
    event.location ? `LOCATION:${event.location}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n');

  return new NextResponse(ical, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${event.titleEn.replace(/[^a-zA-Z0-9]/g, '-')}.ics"`,
    },
  });
}
