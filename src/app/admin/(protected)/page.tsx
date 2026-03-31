import { count, eq, sql, desc, gte } from 'drizzle-orm';
import { Users, Mail, DollarSign, MessageSquare, Calendar, FileText } from 'lucide-react';
import Link from 'next/link';
import { db, schema } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { KpiCard } from '@/components/admin/kpi-card';
import { ActivityFeed } from '@/components/admin/activity-feed';

async function getDashboardData() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    [volunteerCount],
    [subscriberCount],
    [donationResult],
    [contactCount],
    [eventCount],
    [blogCount],
    recentActivity,
    upcomingEvents,
  ] = await Promise.all([
    db.select({ value: count() }).from(schema.volunteers).where(eq(schema.volunteers.status, 'active')),
    db.select({ value: count() }).from(schema.subscribers).where(eq(schema.subscribers.status, 'active')),
    db.select({ value: sql<string>`coalesce(sum(${schema.donations.amount}), 0)` }).from(schema.donations).where(gte(schema.donations.createdAt, startOfMonth)),
    db.select({ value: count() }).from(schema.contactSubmissions).where(eq(schema.contactSubmissions.status, 'new')),
    db.select({ value: count() }).from(schema.events).where(gte(schema.events.date, now)),
    db.select({ value: count() }).from(schema.blogPosts).where(eq(schema.blogPosts.published, true)),
    db.select().from(schema.activityLog).orderBy(desc(schema.activityLog.createdAt)).limit(10),
    db.select().from(schema.events).where(gte(schema.events.date, now)).orderBy(schema.events.date).limit(5),
  ]);

  return {
    volunteers: Number(volunteerCount.value),
    subscribers: Number(subscriberCount.value),
    donationsThisMonth: Number(donationResult.value) / 100, // cents to dollars
    newContacts: Number(contactCount.value),
    upcomingEventCount: Number(eventCount.value),
    publishedPosts: Number(blogCount.value),
    recentActivity,
    upcomingEvents,
  };
}

export default async function AdminDashboardPage() {
  const user = await getSession();
  const data = await getDashboardData();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-(--text-primary)">
          Welcome back, {user?.name?.split(' ')[0] ?? 'Admin'}
        </h1>
        <p className="text-sm text-(--text-muted) mt-1">
          MVVCSO Admin Dashboard
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <KpiCard label="Active Volunteers" value={data.volunteers} icon={Users} />
        <KpiCard label="Newsletter Subscribers" value={data.subscribers} icon={Mail} />
        <KpiCard
          label="Donations This Month"
          value={`$${data.donationsThisMonth.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
        />
        <KpiCard label="New Inquiries" value={data.newContacts} icon={MessageSquare} />
        <KpiCard label="Upcoming Events" value={data.upcomingEventCount} icon={Calendar} />
        <KpiCard label="Published Posts" value={data.publishedPosts} icon={FileText} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-sandy-gold p-6">
          <h2 className="text-lg font-bold text-(--text-primary) mb-4">Recent Activity</h2>
          <ActivityFeed items={data.recentActivity} />
        </div>

        {/* Quick Actions + Upcoming Events */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-sandy-gold p-6">
            <h2 className="text-lg font-bold text-(--text-primary) mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/admin/events"
                className="flex items-center gap-2 px-4 py-3 rounded-lg bg-terra-cotta/10 text-terra-cotta text-sm font-medium hover:bg-terra-cotta/20 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Create Event
              </Link>
              <Link
                href="/admin/blog"
                className="flex items-center gap-2 px-4 py-3 rounded-lg bg-chaparral/10 text-chaparral text-sm font-medium hover:bg-chaparral/20 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Write Blog Post
              </Link>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl border border-sandy-gold p-6">
            <h2 className="text-lg font-bold text-(--text-primary) mb-4">Upcoming Events</h2>
            {data.upcomingEvents.length === 0 ? (
              <p className="text-sm text-(--text-muted) text-center py-4">No upcoming events.</p>
            ) : (
              <div className="space-y-3">
                {data.upcomingEvents.map(event => (
                  <div key={event.id} className="flex items-center gap-3 py-2">
                    <div className="w-10 h-10 rounded-lg bg-sunset-peach/20 flex items-center justify-center text-xs font-bold text-terra-cotta shrink-0">
                      {event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).split(' ').map((p, i) => i === 0 ? <div key={i} className="text-[10px] uppercase">{p}</div> : <div key={i}>{p}</div>)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-(--text-primary) truncate">{event.titleEn}</p>
                      {event.location && (
                        <p className="text-xs text-(--text-muted) truncate">{event.location}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
