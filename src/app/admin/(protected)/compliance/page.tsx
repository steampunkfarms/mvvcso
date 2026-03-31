import { requireAuth } from '@/lib/auth';
import { db, schema } from '@/lib/db';
import { differenceInDays } from 'date-fns';
import { ShieldCheck, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { ComplianceTable } from '@/components/admin/compliance-table';

export default async function CompliancePage() {
  await requireAuth(['president', 'secretary', 'treasurer']);

  const tasks = await db
    .select()
    .from(schema.complianceTasks)
    .orderBy(schema.complianceTasks.dueDate);

  const now = new Date();
  const upcoming = tasks.filter(t => t.status !== 'completed' && differenceInDays(t.dueDate, now) <= 30 && differenceInDays(t.dueDate, now) >= 0);
  const overdue = tasks.filter(t => t.status !== 'completed' && t.dueDate < now);
  const completedThisYear = tasks.filter(t => t.status === 'completed' && t.completedDate && t.completedDate.getFullYear() === now.getFullYear());
  const pending = tasks.filter(t => t.status !== 'completed');

  // Serialize for client component
  const serializedTasks = tasks.map(t => ({
    id: t.id,
    title: t.title,
    titleEs: t.titleEs,
    description: t.description,
    category: t.category,
    dueDate: t.dueDate.toISOString(),
    priority: t.priority,
    status: t.status,
    recurrence: t.recurrence,
    notes: t.notes,
  }));

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-(--text-primary)">Compliance Hub</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-(--text-muted)">Upcoming (30 days)</span>
            <Clock className="w-5 h-5 text-stone-600" />
          </div>
          <div className="text-2xl font-bold text-(--text-primary)">{upcoming.length}</div>
        </div>
        <div className="bg-red-50 rounded-xl p-5 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-red-600">Overdue</span>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-700">{overdue.length}</div>
        </div>
        <div className="bg-green-50 rounded-xl p-5 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-green-600">Completed This Year</span>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-green-700">{completedThisYear.length}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-(--text-muted)">Total Tasks</span>
            <ShieldCheck className="w-5 h-5 text-stone-600" />
          </div>
          <div className="text-2xl font-bold text-(--text-primary)">{tasks.length}</div>
        </div>
      </div>

      {/* Overdue Alert */}
      {overdue.length > 0 && (
        <div className="bg-red-50 rounded-xl p-5 border border-red-200">
          <h2 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Overdue Tasks
          </h2>
          <div className="space-y-2">
            {overdue.map(task => (
              <div key={task.id} className="flex items-center justify-between py-2 border-b border-red-100 last:border-0">
                <div>
                  <span className="text-sm font-medium text-red-800">{task.title}</span>
                  <span className="text-xs text-red-600 ml-2">Due {task.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Table */}
      <ComplianceTable tasks={serializedTasks} />
    </div>
  );
}
