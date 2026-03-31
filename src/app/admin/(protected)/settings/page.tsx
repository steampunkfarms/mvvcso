import { requireAuth } from '@/lib/auth';
import { isMasterAdmin } from '@/lib/master-admin';
import { db, schema } from '@/lib/db';
import { desc } from 'drizzle-orm';
import { format } from 'date-fns';
import { getRoleLabel } from '@/lib/permissions';

export default async function AdminSettingsPage() {
  const user = await requireAuth();

  const isAdmin = user.role === 'president';
  const users = isAdmin
    ? await db.select().from(schema.authUsers).orderBy(desc(schema.authUsers.createdAt))
    : [];

  const displayRole = isMasterAdmin(user.email) ? 'Tech Advisor' : getRoleLabel(user.role);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-(--text-primary)">Settings</h1>

      {/* My Profile */}
      <div className="bg-white rounded-xl p-6 border border-stone-200 max-w-xl">
        <h2 className="text-lg font-semibold text-(--text-primary) mb-4">My Profile</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-(--text-muted)">Name</span>
            <span className="text-(--text-primary) font-medium">{user.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-(--text-muted)">Email</span>
            <span className="text-(--text-primary)">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-(--text-muted)">Role</span>
            <span className="text-gold-400 font-medium">{displayRole}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-(--text-muted)">Language</span>
            <span className="text-(--text-primary) uppercase">{user.language}</span>
          </div>
        </div>
      </div>

      {/* User Management (President only) */}
      {isAdmin && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-200">
            <h2 className="font-semibold text-(--text-primary)">User Management</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-100 text-left">
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Name</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Email</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Role</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Status</th>
                <th className="px-4 py-3 font-semibold text-(--text-primary)">Last Login</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/50">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 text-(--text-primary) font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-(--text-secondary)">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-terra-50 text-stone-700">
                      {isMasterAdmin(u.email) ? 'Tech Advisor' : getRoleLabel(u.role as Parameters<typeof getRoleLabel>[0])}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${u.isActive ? 'bg-sage-50 text-sage-600' : 'bg-stone-100 text-(--text-muted)'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-(--text-muted) text-xs">
                    {u.lastLoginAt ? format(u.lastLoginAt, 'MMM d, yyyy') : 'Never'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
