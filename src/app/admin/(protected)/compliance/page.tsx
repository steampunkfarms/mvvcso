import { requireAuth } from '@/lib/auth';
import { db, schema } from '@/lib/db';
import { desc, eq, gte, lte, and } from 'drizzle-orm';
import { format, differenceInDays } from 'date-fns';
import { ShieldCheck, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

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

  const priorityColors: Record<string, string> = {
    critical: 'bg-red-100 text-red-700',
    high: 'bg-sunset-peach/20 text-terra-cotta',
    normal: 'bg-sandy-gold/20 text-chaparral',
    low: 'bg-cream-light text-(--text-muted)',
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-(--text-primary)">Compliance Hub</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-sandy-gold">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-(--text-muted)">Upcoming (30 days)</span>
            <Clock className="w-5 h-5 text-chaparral" />
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
        <div className="bg-white rounded-xl p-5 border border-sandy-gold">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-(--text-muted)">Total Tasks</span>
            <ShieldCheck className="w-5 h-5 text-chaparral" />
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
                  <span className="text-xs text-red-600 ml-2">Due {format(task.dueDate, 'MMM d, yyyy')}</span>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${priorityColors[task.priority]}`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Tasks */}
      <div className="bg-white rounded-xl border border-sandy-gold overflow-hidden">
        <div className="px-5 py-4 border-b border-sandy-gold">
          <h2 className="font-semibold text-(--text-primary)">All Compliance Tasks</h2>
        </div>
        {pending.length === 0 ? (
          <p className="p-8 text-center text-(--text-muted)">No pending compliance tasks. Seed annual tasks to get started.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-sandy-gold/10 text-left">
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Task</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Category</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Due Date</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Priority</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sandy-gold/30">
              {pending.map(task => {
                const daysUntil = differenceInDays(task.dueDate, now);
                return (
                  <tr key={task.id} className="hover:bg-sandy-gold/5">
                    <td className="px-4 py-3">
                      <span className="text-(--text-primary) font-medium">{task.title}</span>
                      {task.description && (
                        <p className="text-xs text-(--text-muted) mt-0.5 line-clamp-1">{task.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-(--text-secondary) capitalize text-xs">{task.category.replace('_', ' ')}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs ${daysUntil < 0 ? 'text-red-600 font-bold' : daysUntil <= 7 ? 'text-terra-cotta font-medium' : 'text-(--text-secondary)'}`}>
                        {format(task.dueDate, 'MMM d, yyyy')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded capitalize ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded capitalize ${
                        task.status === 'completed' ? 'bg-green-100 text-green-700' :
                        task.status === 'in_progress' ? 'bg-sky-100 text-sky-700' :
                        task.status === 'overdue' ? 'bg-red-100 text-red-700' :
                        'bg-sandy-gold/20 text-chaparral'
                      }`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
