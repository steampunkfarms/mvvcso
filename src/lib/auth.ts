import { randomBytes, createHmac, timingSafeEqual } from 'crypto';
import { eq, and, gt, isNull } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { db, schema } from './db';
import { env } from './env';

const SESSION_COOKIE = 'mvvcso_session';
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const MAGIC_LINK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export type UserRole =
  | 'president'
  | 'vice_president'
  | 'secretary'
  | 'treasurer'
  | 'board_member'
  | 'volunteer_coordinator'
  | 'content_manager';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  language: string;
}

function generateToken(): string {
  return randomBytes(32).toString('hex');
}

function signToken(token: string): string {
  const secret = env.authSecret;
  if (!secret) throw new Error('AUTH_SECRET not configured');
  return createHmac('sha256', secret).update(token).digest('hex');
}

// ── Magic Links ──────────────────────────────────────────────────

export async function createMagicLink(email: string): Promise<{ token: string; user: { name: string } } | null> {
  const normalizedEmail = email.toLowerCase().trim();

  // Check allowlist
  const [user] = await db
    .select()
    .from(schema.authUsers)
    .where(and(eq(schema.authUsers.email, normalizedEmail), eq(schema.authUsers.isActive, true)));

  if (!user) return null;

  const token = generateToken();
  const expiresAt = new Date(Date.now() + MAGIC_LINK_DURATION_MS);

  await db.insert(schema.magicLinks).values({
    email: normalizedEmail,
    token: signToken(token),
    expiresAt,
  });

  return { token, user: { name: user.name } };
}

export async function verifyMagicLink(token: string): Promise<SessionUser | null> {
  const hashedToken = signToken(token);

  const [link] = await db
    .select()
    .from(schema.magicLinks)
    .where(
      and(
        eq(schema.magicLinks.token, hashedToken),
        gt(schema.magicLinks.expiresAt, new Date()),
        isNull(schema.magicLinks.usedAt),
      ),
    );

  if (!link) return null;

  // Mark as used
  await db
    .update(schema.magicLinks)
    .set({ usedAt: new Date() })
    .where(eq(schema.magicLinks.id, link.id));

  // Find user
  const [user] = await db
    .select()
    .from(schema.authUsers)
    .where(and(eq(schema.authUsers.email, link.email), eq(schema.authUsers.isActive, true)));

  if (!user) return null;

  // Update last login
  await db
    .update(schema.authUsers)
    .set({ lastLoginAt: new Date() })
    .where(eq(schema.authUsers.id, user.id));

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as UserRole,
    language: user.language,
  };
}

// ── Sessions ─────────────────────────────────────────────────────

export async function createSession(user: SessionUser): Promise<string> {
  const token = generateToken();
  const hashedToken = signToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await db.insert(schema.authSessions).values({
    userId: user.id,
    token: hashedToken,
    expiresAt,
  });

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });

  return token;
}

export async function getSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const hashedToken = signToken(token);

  const [session] = await db
    .select()
    .from(schema.authSessions)
    .where(
      and(
        eq(schema.authSessions.token, hashedToken),
        gt(schema.authSessions.expiresAt, new Date()),
      ),
    );

  if (!session) return null;

  const [user] = await db
    .select()
    .from(schema.authUsers)
    .where(and(eq(schema.authUsers.id, session.userId), eq(schema.authUsers.isActive, true)));

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as UserRole,
    language: user.language,
  };
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return;

  const hashedToken = signToken(token);
  await db.delete(schema.authSessions).where(eq(schema.authSessions.token, hashedToken));
  jar.delete(SESSION_COOKIE);
}

export async function requireAuth(allowedRoles?: UserRole[]): Promise<SessionUser> {
  const user = await getSession();
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw new Error('FORBIDDEN');
  }
  return user;
}
