'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, X } from 'lucide-react';
import { isMasterAdmin } from '@/lib/master-admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  language: string;
  isActive: boolean;
  lastLoginAt: string | null;
}

const ROLES = [
  { value: 'president', label: 'President' },
  { value: 'vice_president', label: 'Vice President' },
  { value: 'secretary', label: 'Secretary' },
  { value: 'treasurer', label: 'Treasurer' },
  { value: 'board_member', label: 'Board Member' },
  { value: 'volunteer_coordinator', label: 'Volunteer Coordinator' },
  { value: 'content_manager', label: 'Content Manager' },
  { value: 'voting_member', label: 'Voting Member' },
  { value: 'resident', label: 'Resident' },
];

function getRoleLabel(role: string): string {
  return ROLES.find(r => r.value === role)?.label ?? role;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function UserManagement({ initialUsers }: { initialUsers: User[] }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('board_member');
  const [language, setLanguage] = useState('en');
  const [isActive, setIsActive] = useState(true);

  function openAdd() {
    setEditingUser(null);
    setName('');
    setEmail('');
    setRole('board_member');
    setLanguage('en');
    setIsActive(true);
    setError('');
    setShowModal(true);
  }

  function openEdit(user: User) {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setLanguage(user.language);
    setIsActive(user.isActive);
    setError('');
    setShowModal(true);
  }

  function close() {
    setShowModal(false);
    setEditingUser(null);
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (editingUser) {
        const res = await fetch('/api/admin/users', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingUser.id,
            name,
            role,
            language,
            isActive,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Failed to update user');
          setSaving(false);
          return;
        }
      } else {
        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, role, language }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Failed to add user');
          setSaving(false);
          return;
        }
      }

      close();
      router.refresh();
    } catch {
      setError('Unable to connect. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
        <h2 className="font-semibold text-(--text-primary)">User Management</h2>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-400 text-white text-xs font-semibold hover:bg-gold-500 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add User
        </button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-stone-100 text-left">
            <th className="px-4 py-3 font-semibold text-(--text-primary)">Name</th>
            <th className="px-4 py-3 font-semibold text-(--text-primary) hidden md:table-cell">Email</th>
            <th className="px-4 py-3 font-semibold text-(--text-primary)">Role</th>
            <th className="px-4 py-3 font-semibold text-(--text-primary)">Status</th>
            <th className="px-4 py-3 font-semibold text-(--text-primary) hidden md:table-cell">Last Login</th>
            <th className="px-4 py-3 font-semibold text-(--text-primary) w-16"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-200/50">
          {initialUsers.map(u => (
            <tr key={u.id} className="hover:bg-stone-50">
              <td className="px-4 py-3 text-(--text-primary) font-medium">{u.name}</td>
              <td className="px-4 py-3 text-(--text-secondary) hidden md:table-cell">{u.email}</td>
              <td className="px-4 py-3">
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-terra-50 text-stone-700">
                  {isMasterAdmin(u.email) ? 'Tech Advisor' : getRoleLabel(u.role)}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${u.isActive ? 'bg-sage-50 text-sage-600' : 'bg-stone-100 text-(--text-muted)'}`}>
                  {u.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-4 py-3 text-(--text-muted) text-xs hidden md:table-cell">
                {formatDate(u.lastLoginAt)}
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => openEdit(u)}
                  className="p-1.5 rounded-md text-(--text-muted) hover:text-gold-400 hover:bg-gold-50 transition-colors"
                  aria-label={`Edit ${u.name}`}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="bg-white rounded-xl border border-stone-200 shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
              <h3 className="font-semibold text-(--text-primary)">
                {editingUser ? 'Edit User' : 'Add User'}
              </h3>
              <button type="button" onClick={close} className="p-1 rounded-md hover:bg-stone-100 text-(--text-muted)">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label htmlFor="user-name" className="block text-sm font-medium text-(--text-primary) mb-1">Name</label>
                <input
                  id="user-name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-100 text-(--text-primary) text-sm focus:outline-none focus:border-gold-400"
                />
              </div>
              <div>
                <label htmlFor="user-email" className="block text-sm font-medium text-(--text-primary) mb-1">Email</label>
                <input
                  id="user-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  disabled={!!editingUser}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-100 text-(--text-primary) text-sm focus:outline-none focus:border-gold-400 disabled:opacity-60 disabled:cursor-not-allowed"
                />
                {editingUser && (
                  <p className="text-xs text-(--text-muted) mt-1">Email cannot be changed after creation.</p>
                )}
              </div>
              <div>
                <label htmlFor="user-role" className="block text-sm font-medium text-(--text-primary) mb-1">Role</label>
                <select
                  id="user-role"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-100 text-(--text-primary) text-sm focus:outline-none focus:border-gold-400"
                >
                  {ROLES.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="user-lang" className="block text-sm font-medium text-(--text-primary) mb-1">Language</label>
                <select
                  id="user-lang"
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-100 text-(--text-primary) text-sm focus:outline-none focus:border-gold-400"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                </select>
              </div>
              {editingUser && (
                <div className="flex items-center gap-2">
                  <input
                    id="user-active"
                    type="checkbox"
                    checked={isActive}
                    onChange={e => setIsActive(e.target.checked)}
                    className="rounded border-stone-300"
                  />
                  <label htmlFor="user-active" className="text-sm text-(--text-primary)">Active</label>
                </div>
              )}
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={close}
                  className="px-4 py-2 rounded-lg border border-stone-200 text-sm font-medium text-(--text-secondary) hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-gold-400 text-white text-sm font-semibold hover:bg-gold-500 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingUser ? 'Save Changes' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
