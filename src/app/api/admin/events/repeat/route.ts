import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

const repeatSchema = z.object({
  sourceId: z.string().uuid(),
  pattern: z.string().min(1),
  until: z.string().min(1).transform(s => new Date(s)),
});

function getNthDayOfWeek(year: number, month: number, dayOfWeek: number, n: number): Date {
  const d = new Date(year, month, 1);
  let count = 0;
  while (count < n) {
    if (d.getDay() === dayOfWeek) count++;
    if (count < n) d.setDate(d.getDate() + 1);
  }
  return d;
}

function generateDates(startDate: Date, pattern: string, until: Date): Date[] {
  const dates: Date[] = [];
  const start = new Date(startDate);
  const limit = until.getTime();

  switch (pattern) {
    case 'weekly': {
      const d = new Date(start);
      d.setDate(d.getDate() + 7);
      while (d.getTime() <= limit) {
        dates.push(new Date(d));
        d.setDate(d.getDate() + 7);
      }
      break;
    }
    case 'biweekly': {
      const d = new Date(start);
      d.setDate(d.getDate() + 14);
      while (d.getTime() <= limit) {
        dates.push(new Date(d));
        d.setDate(d.getDate() + 14);
      }
      break;
    }
    case '1st_3rd_tue':
    case '2nd_4th_tue': {
      const nths = pattern === '1st_3rd_tue' ? [1, 3] : [2, 4];
      const hours = start.getUTCHours();
      const mins = start.getUTCMinutes();
      let m = start.getMonth() + 1;
      let y = start.getFullYear();
      if (m > 11) { m = 0; y++; }
      for (let i = 0; i < 24; i++) {
        const month = (m + i) % 12;
        const year = y + Math.floor((m + i) / 12);
        for (const nth of nths) {
          const d = getNthDayOfWeek(year, month, 2, nth); // 2 = Tuesday
          d.setUTCHours(hours, mins, 0, 0);
          if (d.getTime() > start.getTime() && d.getTime() <= limit) {
            dates.push(d);
          }
        }
      }
      dates.sort((a, b) => a.getTime() - b.getTime());
      break;
    }
    case 'monthly': {
      const d = new Date(start);
      for (let i = 1; i <= 24; i++) {
        const next = new Date(d);
        next.setMonth(next.getMonth() + i);
        if (next.getTime() > limit) break;
        dates.push(next);
      }
      break;
    }
    case 'monthly_dow': {
      // Same Nth day-of-week each month
      const dow = start.getDay();
      const nthWeek = Math.ceil(start.getDate() / 7);
      const hours = start.getUTCHours();
      const mins = start.getUTCMinutes();
      let m = start.getMonth() + 1;
      let y = start.getFullYear();
      for (let i = 0; i < 24; i++) {
        const month = (m + i) % 12;
        const year = y + Math.floor((m + i) / 12);
        const d = getNthDayOfWeek(year, month, dow, nthWeek);
        d.setUTCHours(hours, mins, 0, 0);
        if (d.getTime() > start.getTime() && d.getTime() <= limit) {
          dates.push(d);
        }
      }
      break;
    }
    case 'quarterly': {
      const d = new Date(start);
      for (let i = 1; i <= 8; i++) {
        const next = new Date(d);
        next.setMonth(next.getMonth() + i * 3);
        if (next.getTime() > limit) break;
        dates.push(next);
      }
      break;
    }
    case 'annually': {
      const d = new Date(start);
      for (let i = 1; i <= 5; i++) {
        const next = new Date(d);
        next.setFullYear(next.getFullYear() + i);
        if (next.getTime() > limit) break;
        dates.push(next);
      }
      break;
    }
  }

  return dates;
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const { sourceId, pattern, until } = repeatSchema.parse(body);

    // Get source event
    const [source] = await db.select().from(schema.events).where(eq(schema.events.id, sourceId));
    if (!source) return NextResponse.json({ error: 'Source event not found' }, { status: 404 });

    const dates = generateDates(source.date, pattern, until);
    if (dates.length === 0) {
      return NextResponse.json({ error: 'No dates generated. Check the pattern and end date.' }, { status: 400 });
    }

    // Calculate duration if endDate exists
    const durationMs = source.endDate ? source.endDate.getTime() - source.date.getTime() : 0;

    let created = 0;
    for (const d of dates) {
      const endDate = durationMs > 0 ? new Date(d.getTime() + durationMs) : null;
      await db.insert(schema.events).values({
        titleEn: source.titleEn,
        titleEs: source.titleEs,
        descriptionEn: source.descriptionEn,
        descriptionEs: source.descriptionEs,
        date: d,
        endDate,
        location: source.location,
        maxRsvp: source.maxRsvp,
        isPublic: source.isPublic,
        category: source.category,
        createdBy: user.id,
      });
      created++;
    }

    await db.insert(schema.activityLog).values({
      type: 'event_series_created',
      title: `Created ${created} repeat events: ${source.titleEn}`,
      entityId: sourceId,
      entityType: 'events',
      userId: user.id,
    });

    return NextResponse.json({ created, pattern, until: until.toISOString() }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    console.error('[API/EVENTS/REPEAT] POST error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
