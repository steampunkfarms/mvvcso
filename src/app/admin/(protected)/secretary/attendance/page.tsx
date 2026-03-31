import { requireAuth } from '@/lib/auth';
import { db, schema } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { format } from 'date-fns';

export default async function AttendancePage() {
  await requireAuth(['president', 'secretary']);

  // Get all meetings with attendance
  const meetings = await db
    .select()
    .from(schema.boardMeetings)
    .orderBy(desc(schema.boardMeetings.meetingDate))
    .limit(20);

  const members = await db
    .select()
    .from(schema.authUsers)
    .where(eq(schema.authUsers.isActive, true));

  const allAttendance = await db
    .select()
    .from(schema.meetingAttendance)
    .innerJoin(schema.authUsers, eq(schema.meetingAttendance.memberId, schema.authUsers.id));

  // Build attendance matrix
  const attendanceMap = new Map<string, Map<string, string>>();
  for (const record of allAttendance) {
    const meetingId = record.meeting_attendance.meetingId;
    const memberId = record.meeting_attendance.memberId;
    if (!attendanceMap.has(meetingId)) attendanceMap.set(meetingId, new Map());
    attendanceMap.get(meetingId)!.set(memberId, record.meeting_attendance.status);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-(--text-primary)">Attendance History</h1>

      <div className="bg-white rounded-xl border border-stone-200 overflow-x-auto">
        {meetings.length === 0 ? (
          <p className="p-8 text-center text-(--text-muted)">No meetings recorded yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-200/10 text-left">
                <th className="px-4 py-3 font-semibold text-(--text-primary) sticky left-0 bg-stone-200/10">Member</th>
                {meetings.map(m => (
                  <th key={m.id} className="px-3 py-3 font-semibold text-(--text-primary) text-center text-xs whitespace-nowrap">
                    {format(m.meetingDate, 'M/d/yy')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/30">
              {members.map(member => (
                <tr key={member.id} className="hover:bg-stone-200/5">
                  <td className="px-4 py-2 font-medium text-(--text-primary) sticky left-0 bg-white whitespace-nowrap">
                    {member.name}
                  </td>
                  {meetings.map(m => {
                    const status = attendanceMap.get(m.id)?.get(member.id);
                    return (
                      <td key={m.id} className="px-3 py-2 text-center">
                        <AttendanceDot status={status} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex gap-4 text-xs text-(--text-muted)">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500" /> Present</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-sky-500" /> Remote</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-stone-200" /> Excused</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-400" /> Absent</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-200" /> N/A</span>
      </div>
    </div>
  );
}

function AttendanceDot({ status }: { status?: string }) {
  const colors: Record<string, string> = {
    present: 'bg-green-500',
    remote: 'bg-sky-500',
    excused: 'bg-stone-200',
    absent: 'bg-red-400',
  };

  return (
    <span className={`inline-block w-3 h-3 rounded-full ${colors[status || ''] || 'bg-gray-200'}`} />
  );
}
