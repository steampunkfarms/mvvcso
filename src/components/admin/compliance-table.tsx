'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Pencil } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  titleEs: string | null;
  description: string | null;
  category: string;
  dueDate: string;
  priority: string;
  status: string;
  recurrence: string | null;
  notes: string | null;
}

const CATEGORIES = [
  { value: 'tax_filing', label: 'Tax Filing' },
  { value: 'state_filing', label: 'State Filing' },
  { value: 'governance', label: 'Governance' },
  { value: 'financial', label: 'Financial' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'reporting', label: 'Reporting' },
  { value: 'other', label: 'Other' },
];

const PRIORITIES = ['critical', 'high', 'normal', 'low'];
const STATUSES = ['pending', 'in_progress', 'completed', 'overdue'];
const RECURRENCES = [
  { value: '', label: 'None' },
  { value: 'annual', label: 'Annual' },
  { value: 'biennial', label: 'Biennial (every 2 years)' },
  { value: 'every_5_years', label: 'Every 5 years' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'monthly', label: 'Monthly' },
];

const OFFICER_ROLES = [
  { value: '', label: 'Unassigned' },
  { value: 'President', label: 'President' },
  { value: 'Vice President', label: 'Vice President' },
  { value: 'Secretary', label: 'Secretary' },
  { value: 'Treasurer', label: 'Treasurer' },
  { value: 'Secretary & Treasurer', label: 'Secretary & Treasurer' },
  { value: 'Treasurer & Grant Committee', label: 'Treasurer & Grant Committee' },
  { value: 'Secretary & Ethics Committee', label: 'Secretary & Ethics Committee' },
];

function extractAssignedRole(notes: string | null): string {
  if (!notes) return '';
  const match = notes.match(/^Assigned to: (.+?)(\n|$)/);
  return match ? match[1] : '';
}

function stripAssignedRole(notes: string | null): string {
  if (!notes) return '';
  return notes.replace(/^Assigned to: .+?\n?/, '').trim();
}

const priorityColors: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-gold-100/20 text-gold-400',
  normal: 'bg-stone-200/20 text-stone-600',
  low: 'bg-stone-100 text-(--text-muted)',
};

export function ComplianceTable({ tasks }: { tasks: Task[] }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [title, setTitle] = useState('');
  const [titleEs, setTitleEs] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('governance');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('normal');
  const [status, setStatus] = useState('pending');
  const [recurrence, setRecurrence] = useState('');
  const [assignedRole, setAssignedRole] = useState('');
  const [notes, setNotes] = useState('');

  function openAdd() {
    setEditingTask(null);
    setTitle(''); setTitleEs(''); setDescription(''); setCategory('governance');
    setDueDate(''); setPriority('normal'); setStatus('pending');
    setRecurrence(''); setAssignedRole(''); setNotes('');
    setError('');
    setShowModal(true);
  }

  function openEdit(task: Task) {
    setEditingTask(task);
    setTitle(task.title);
    setTitleEs(task.titleEs || '');
    setDescription(task.description || '');
    setCategory(task.category);
    setDueDate(task.dueDate.slice(0, 10)); // YYYY-MM-DD
    setPriority(task.priority);
    setStatus(task.status);
    setRecurrence(task.recurrence || '');
    setAssignedRole(extractAssignedRole(task.notes));
    setNotes(stripAssignedRole(task.notes));
    setError('');
    setShowModal(true);
  }

  function close() { setShowModal(false); setEditingTask(null); setError(''); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...(editingTask ? { id: editingTask.id } : {}),
      title, titleEs: titleEs || null,
      description: description || null,
      category, dueDate, priority, status,
      recurrence: recurrence || null,
      assignedRole: assignedRole || null,
      notes: notes || null,
    };

    try {
      const res = await fetch('/api/admin/compliance', {
        method: editingTask ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed'); setSaving(false); return; }
      close();
      router.refresh();
    } catch { setError('Unable to connect'); } finally { setSaving(false); }
  }

  const now = new Date();
  const daysUntil = (d: string) => Math.round((new Date(d).getTime() - now.getTime()) / 86400000);

  return (
    <>
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <h2 className="font-semibold text-(--text-primary)">All Compliance Tasks</h2>
          <button type="button" onClick={openAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-400 text-white text-xs font-semibold hover:bg-gold-500 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add Task
          </button>
        </div>
        {tasks.length === 0 ? (
          <p className="p-8 text-center text-(--text-muted)">No compliance tasks yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-200/10 text-left">
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Task</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary) hidden md:table-cell">Category</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary) hidden md:table-cell">Assigned To</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Due Date</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Priority</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Status</th>
                <th className="px-4 py-3 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/30">
              {tasks.map(task => {
                const days = daysUntil(task.dueDate);
                const assigned = extractAssignedRole(task.notes);
                return (
                  <tr key={task.id} className="hover:bg-stone-200/5">
                    <td className="px-4 py-3">
                      <span className="text-(--text-primary) font-medium">{task.title}</span>
                      {task.description && (
                        <p className="text-xs text-(--text-muted) mt-0.5 line-clamp-1">{task.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-(--text-secondary) capitalize text-xs hidden md:table-cell">{task.category.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-3 text-xs hidden md:table-cell">
                      {assigned ? (
                        <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-medium">{assigned}</span>
                      ) : (
                        <span className="text-(--text-muted)">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs ${days < 0 ? 'text-red-600 font-bold' : days <= 7 ? 'text-gold-400 font-medium' : 'text-(--text-secondary)'}`}>
                        {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded capitalize ${priorityColors[task.priority] || ''}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded capitalize ${
                        task.status === 'completed' ? 'bg-green-100 text-green-700' :
                        task.status === 'in_progress' ? 'bg-sky-100 text-sky-700' :
                        task.status === 'overdue' ? 'bg-red-100 text-red-700' :
                        'bg-stone-200/20 text-stone-600'
                      }`}>
                        {task.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button type="button" onClick={() => openEdit(task)}
                        className="p-1.5 rounded-md text-(--text-muted) hover:text-gold-400 hover:bg-gold-50 transition-colors"
                        aria-label={`Edit ${task.title}`}>
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 overflow-y-auto py-8">
          <div className="bg-white rounded-xl border border-stone-200 shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
              <h3 className="font-semibold text-(--text-primary)">
                {editingTask ? 'Edit Compliance Task' : 'Add Compliance Task'}
              </h3>
              <button type="button" onClick={close} className="p-1 rounded-md hover:bg-stone-100 text-(--text-muted)">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-(--text-primary) mb-1">Title *</label>
                <input value={title} onChange={e => setTitle(e.target.value)} required
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-100 text-(--text-primary) text-sm focus:outline-none focus:border-gold-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-(--text-primary) mb-1">Title (Spanish)</label>
                <input value={titleEs} onChange={e => setTitleEs(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-100 text-(--text-primary) text-sm focus:outline-none focus:border-gold-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-(--text-primary) mb-1">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-100 text-(--text-primary) text-sm focus:outline-none focus:border-gold-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-(--text-primary) mb-1">Category *</label>
                  <select value={category} onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-100 text-(--text-primary) text-sm focus:outline-none focus:border-gold-400">
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-(--text-primary) mb-1">Priority</label>
                  <select value={priority} onChange={e => setPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-100 text-(--text-primary) text-sm focus:outline-none focus:border-gold-400">
                    {PRIORITIES.map(p => <option key={p} value={p} className="capitalize">{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-(--text-primary) mb-1">Due Date *</label>
                  <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-100 text-(--text-primary) text-sm focus:outline-none focus:border-gold-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-(--text-primary) mb-1">Recurrence</label>
                  <select value={recurrence} onChange={e => setRecurrence(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-100 text-(--text-primary) text-sm focus:outline-none focus:border-gold-400">
                    {RECURRENCES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-(--text-primary) mb-1">Assigned To (Position)</label>
                  <select value={assignedRole} onChange={e => setAssignedRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-100 text-(--text-primary) text-sm focus:outline-none focus:border-gold-400">
                    {OFFICER_ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
                {editingTask && (
                  <div>
                    <label className="block text-sm font-medium text-(--text-primary) mb-1">Status</label>
                    <select value={status} onChange={e => setStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-100 text-(--text-primary) text-sm focus:outline-none focus:border-gold-400">
                      {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>)}
                    </select>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-(--text-primary) mb-1">Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-100 text-(--text-primary) text-sm focus:outline-none focus:border-gold-400" />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={close}
                  className="px-4 py-2 rounded-lg border border-stone-200 text-sm font-medium text-(--text-secondary) hover:bg-stone-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="px-4 py-2 rounded-lg bg-gold-400 text-white text-sm font-semibold hover:bg-gold-500 transition-colors disabled:opacity-50">
                  {saving ? 'Saving...' : editingTask ? 'Save Changes' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
