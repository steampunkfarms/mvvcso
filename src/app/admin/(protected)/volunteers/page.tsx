import { eq, desc, count, sql } from 'drizzle-orm';
import Link from 'next/link';
import { Users, UserPlus, Search, Filter } from 'lucide-react';
import { db, schema } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { VolunteerTable } from './volunteer-table';

async function getVolunteers() {
  return db.select().from(schema.volunteers).orderBy(desc(schema.volunteers.createdAt));
}

async function getStats() {
  const [active] = await db.select({ value: count() }).from(schema.volunteers).where(eq(schema.volunteers.status, 'active'));
  const [pending] = await db.select({ value: count() }).from(schema.volunteers).where(eq(schema.volunteers.status, 'pending'));
  const [totalHours] = await db.select({ value: sql<string>`coalesce(sum(${schema.volunteers.totalHours}), 0)` }).from(schema.volunteers);
  return {
    active: Number(active.value),
    pending: Number(pending.value),
    totalHours: Number(totalHours.value),
  };
}

export default async function VolunteersPage() {
  await requireAuth(['president', 'vice_president', 'secretary', 'volunteer_coordinator']);
  const [volunteers, stats] = await Promise.all([getVolunteers(), getStats()]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-(--text-primary)">Volunteers</h1>
          <p className="text-sm text-(--text-muted) mt-1">
            {stats.active} active · {stats.pending} pending · {stats.totalHours} total hours
          </p>
        </div>
        <Link
          href="/admin/volunteers/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gold-400 text-white text-sm font-semibold hover:bg-gold-500 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add Volunteer
        </Link>
      </div>

      <VolunteerTable volunteers={volunteers} />
    </div>
  );
}
