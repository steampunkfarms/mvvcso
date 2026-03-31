import type { UserRole } from './auth';

type Permission =
  | 'view_dashboard'
  | 'manage_volunteers'
  | 'manage_events'
  | 'manage_documents'
  | 'manage_blog'
  | 'manage_newsletter'
  | 'manage_donations'
  | 'manage_users'
  | 'view_financials'
  | 'view_documents';

const PERMISSIONS: Record<UserRole, Permission[]> = {
  president: [
    'view_dashboard', 'manage_volunteers', 'manage_events', 'manage_documents',
    'manage_blog', 'manage_newsletter', 'manage_donations', 'manage_users',
    'view_financials', 'view_documents',
  ],
  secretary: [
    'view_dashboard', 'manage_volunteers', 'manage_events', 'manage_documents',
    'manage_blog', 'manage_newsletter', 'view_financials', 'view_documents',
  ],
  treasurer: [
    'view_dashboard', 'manage_documents', 'manage_donations',
    'view_financials', 'view_documents',
  ],
  board_member: [
    'view_dashboard', 'manage_events', 'view_financials', 'view_documents',
  ],
  volunteer_coordinator: [
    'view_dashboard', 'manage_volunteers', 'manage_events', 'view_documents',
  ],
  content_manager: [
    'view_dashboard', 'manage_events', 'manage_documents',
    'manage_blog', 'manage_newsletter', 'view_documents',
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return PERMISSIONS[role]?.includes(permission) ?? false;
}

export function getPermissions(role: UserRole): Permission[] {
  return PERMISSIONS[role] ?? [];
}

export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    president: 'President',
    secretary: 'Secretary',
    treasurer: 'Treasurer',
    board_member: 'Board Member',
    volunteer_coordinator: 'Volunteer Coordinator',
    content_manager: 'Content Manager',
  };
  return labels[role] ?? role;
}
