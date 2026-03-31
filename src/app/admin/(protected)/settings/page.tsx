import { requireAuth } from '@/lib/auth';
import { isMasterAdmin } from '@/lib/master-admin';
import { db, schema } from '@/lib/db';
import { desc } from 'drizzle-orm';
import { getRoleLabel } from '@/lib/permissions';
import { UserManagement } from '@/components/admin/user-management';

export default async function AdminSettingsPage() {
  const user = await requireAuth();

  const isAdmin = user.role === 'president';
  const users = isAdmin
    ? await db.select().from(schema.authUsers).orderBy(desc(schema.authUsers.createdAt))
    : [];

  const displayRole = isMasterAdmin(user.email) ? 'Tech Advisor' : getRoleLabel(user.role);

  // Serialize for client component
  const serializedUsers = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    language: u.language,
    isActive: u.isActive,
    lastLoginAt: u.lastLoginAt ? u.lastLoginAt.toISOString() : null,
  }));

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
      {isAdmin && <UserManagement initialUsers={serializedUsers} />}
    </div>
  );
}
