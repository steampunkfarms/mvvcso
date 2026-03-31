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
  | 'view_meetings'
  | 'community_access'
  | 'marketplace_access'
  | 'vote_ballots'
  | 'manage_ballots'
  | 'manage_social'
  | 'manage_moderation';

const PERMISSIONS: Record<UserRole, Permission[]> = {
  president: [
    'view_dashboard', 'manage_volunteers', 'manage_events', 'manage_documents',
    'manage_blog', 'manage_newsletter', 'manage_donations', 'manage_users',
    'view_financials', 'view_documents', 'manage_meetings', 'approve_minutes',
    'manage_financials', 'manage_grants', 'manage_compliance', 'view_meetings',
    'community_access', 'marketplace_access', 'vote_ballots', 'manage_ballots',
    'manage_social', 'manage_moderation',
  ],
  vice_president: [
    'view_dashboard', 'manage_volunteers', 'manage_events', 'manage_documents',
    'manage_blog', 'manage_newsletter', 'manage_donations',
    'view_financials', 'view_documents', 'approve_minutes', 'view_meetings',
    'community_access', 'marketplace_access', 'vote_ballots', 'manage_moderation',
  ],
  secretary: [
    'view_dashboard', 'manage_volunteers', 'manage_events', 'manage_documents',
    'manage_blog', 'manage_newsletter', 'view_financials', 'view_documents',
    'manage_meetings', 'approve_minutes', 'manage_compliance', 'view_meetings',
    'community_access', 'marketplace_access', 'vote_ballots', 'manage_ballots',
    'manage_social', 'manage_moderation',
  ],
  treasurer: [
    'view_dashboard', 'manage_documents', 'manage_donations',
    'view_financials', 'view_documents', 'approve_minutes',
    'manage_financials', 'manage_grants', 'manage_compliance', 'view_meetings',
    'community_access', 'marketplace_access', 'vote_ballots',
  ],
  board_member: [
    'view_dashboard', 'manage_events', 'view_financials', 'view_documents',
    'approve_minutes', 'view_meetings',
    'community_access', 'marketplace_access', 'vote_ballots', 'manage_moderation',
  ],
  volunteer_coordinator: [
    'view_dashboard', 'manage_volunteers', 'manage_events', 'view_documents',
    'community_access', 'marketplace_access',
  ],
  content_manager: [
    'view_dashboard', 'manage_events', 'manage_documents',
    'manage_blog', 'manage_newsletter', 'view_documents',
    'community_access', 'marketplace_access', 'manage_social',
  ],
  voting_member: [
    'community_access', 'marketplace_access', 'vote_ballots',
  ],
  resident: [
    'community_access', 'marketplace_access',
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
    voting_member: 'Voting Member',
    resident: 'Resident',
  };
  return labels[role] ?? role;
}
