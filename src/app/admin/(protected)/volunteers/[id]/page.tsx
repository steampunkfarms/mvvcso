import { eq, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { db, schema } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { VolunteerActions } from './volunteer-actions';

export default async function VolunteerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth(['president', 'vice_president', 'secretary', 'volunteer_coordinator']);
  const { id } = await params;

  const [volunteer] = await db.select().from(schema.volunteers).where(eq(schema.volunteers.id, id));
  if (!volunteer) notFound();

  const hours = await db
    .select()
    .from(schema.volunteerHours)
    .where(eq(schema.volunteerHours.volunteerId, id))
    .orderBy(desc(schema.volunteerHours.date));

  return (
    <div>
      <Link href="/admin/volunteers" className="inline-flex items-center gap-1 text-sm text-gold-400 hover:text-gold-500 mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to volunteers
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-(--text-primary)">{volunteer.name}</h1>
                <p className="text-sm text-(--text-muted)">{volunteer.email}</p>
              </div>
              <VolunteerActions volunteer={volunteer} />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-(--text-muted)">Phone:</span>
                <span className="ml-2 text-(--text-primary)">{volunteer.phone || '—'}</span>
              </div>
              <div>
                <span className="text-(--text-muted)">Language:</span>
                <span className="ml-2 text-(--text-primary)">{volunteer.language === 'es' ? 'Spanish' : 'English'}</span>
              </div>
              <div>
                <span className="text-(--text-muted)">Availability:</span>
                <span className="ml-2 text-(--text-primary)">{volunteer.availability || '—'}</span>
              </div>
              <div>
                <span className="text-(--text-muted)">Background check:</span>
                <span className="ml-2 text-(--text-primary)">{(volunteer.backgroundCheck ?? 'not_started').replace('_', ' ')}</span>
              </div>
              <div className="col-span-2">
                <span className="text-(--text-muted)">Skills:</span>
                <span className="ml-2 text-(--text-primary)">{volunteer.skills || '—'}</span>
              </div>
              {volunteer.address && (
                <div className="col-span-2">
                  <span className="text-(--text-muted)">Address:</span>
                  <span className="ml-2 text-(--text-primary)">{volunteer.address}</span>
                </div>
              )}
            </div>

            {volunteer.notes && (
              <div className="mt-4 p-3 bg-stone-100 rounded-lg text-sm text-(--text-secondary)">
                <strong>Notes:</strong> {volunteer.notes}
              </div>
            )}
          </div>

          {/* Hours log */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-(--text-primary) flex items-center gap-2">
                <Clock className="w-5 h-5" /> Hours Log
              </h2>
              <span className="text-sm text-(--text-muted)">Total: {volunteer.totalHours ?? 0} hours</span>
            </div>

            {hours.length === 0 ? (
              <p className="text-sm text-(--text-muted) text-center py-6">No hours logged yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200/50">
                    <th className="text-left py-2 text-(--text-secondary) font-semibold">Date</th>
                    <th className="text-left py-2 text-(--text-secondary) font-semibold">Hours</th>
                    <th className="text-left py-2 text-(--text-secondary) font-semibold">Description</th>
                    <th className="text-left py-2 text-(--text-secondary) font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {hours.map(h => (
                    <tr key={h.id} className="border-b border-stone-200/20">
                      <td className="py-2 text-(--text-primary)">{format(new Date(h.date), 'MMM d, yyyy')}</td>
                      <td className="py-2 text-(--text-primary)">{h.hours}</td>
                      <td className="py-2 text-(--text-secondary)">{h.description || '—'}</td>
                      <td className="py-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          h.status === 'approved' ? 'bg-green-100 text-green-700' :
                          h.status === 'rejected' ? 'bg-red-100 text-red-600' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {h.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Quick stats sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-stone-200 p-5 text-center">
            <div className="text-3xl font-bold text-gold-400">{volunteer.totalHours ?? 0}</div>
            <div className="text-sm text-(--text-muted)">Total Hours</div>
          </div>
          <div className="bg-white rounded-xl border border-stone-200 p-5 text-center">
            <div className={`text-lg font-bold ${
              volunteer.status === 'active' ? 'text-green-600' :
              volunteer.status === 'pending' ? 'text-amber-600' : 'text-gray-500'
            }`}>
              {volunteer.status.replace('_', ' ')}
            </div>
            <div className="text-sm text-(--text-muted)">Status</div>
          </div>
          <div className="bg-white rounded-xl border border-stone-200 p-5 text-center">
            <div className="text-sm text-(--text-primary)">{format(new Date(volunteer.joinedAt), 'MMM d, yyyy')}</div>
            <div className="text-sm text-(--text-muted)">Joined</div>
          </div>
        </div>
      </div>
    </div>
  );
}
