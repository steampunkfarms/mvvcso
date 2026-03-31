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
  | 'view_documents'
  | 'manage_meetings'
  | 'approve_minutes'
  | 'manage_financials'
  | 'manage_grants'
  | 'manage_compliance'
  | 'view_meetings';

const PERMISSIONS: Record<UserRole, Permission[]> = {
  president: [
    'view_dashboard', 'manage_volunteers', 'manage_events', 'manage_documents',
    'manage_blog', 'manage_newsletter', 'manage_donations', 'manage_users',
    'view_financials', 'view_documents', 'manage_meetings', 'approve_minutes',
    'manage_financials', 'manage_grants', 'manage_compliance', 'view_meetings',
  ],
  vice_president: [
    'view_dashboard', 'manage_volunteers', 'manage_events', 'manage_documents',
    'manage_blog', 'manage_newsletter', 'manage_donations',
    'view_financials', 'view_documents', 'approve_minutes', 'view_meetings',
  ],
  secretary: [
    'view_dashboard', 'manage_volunteers', 'manage_events', 'manage_documents',
    'manage_blog', 'manage_newsletter', 'view_financials', 'view_documents',
    'manage_meetings', 'approve_minutes', 'manage_compliance', 'view_meetings',
  ],
  treasurer: [
    'view_dashboard', 'manage_documents', 'manage_donations',
    'view_financials', 'view_documents', 'approve_minutes',
    'manage_financials', 'manage_grants', 'manage_compliance', 'view_meetings',
  ],
  board_member: [
    'view_dashboard', 'manage_events', 'view_financials', 'view_documents',
    'approve_minutes', 'view_meetings',
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
    vice_president: 'Vice President',
    secretary: 'Secretary',
    treasurer: 'Treasurer',
    board_member: 'Board Member',
    volunteer_coordinator: 'Volunteer Coordinator',
    content_manager: 'Content Manager',
  };
  return labels[role] ?? role;
}
