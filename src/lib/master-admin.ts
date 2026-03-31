/** Master admin account — cannot be deleted or deactivated by other admins. */
export const MASTER_ADMIN_EMAIL = 'frederick.olaf@gmail.com';

export function isMasterAdmin(email: string): boolean {
  return email.toLowerCase().trim() === MASTER_ADMIN_EMAIL;
}
