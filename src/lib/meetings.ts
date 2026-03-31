import { db, schema } from './db';
import { eq, desc, and, sql } from 'drizzle-orm';

const { boardMeetings, meetingMinutes, meetingAttendance, meetingApprovals, meetingResolutions, authUsers } = schema;

export type MeetingStatus = 'draft' | 'ai_processing' | 'review' | 'pending_approval' | 'approved' | 'published';
export type MeetingType = 'regular' | 'special' | 'emergency' | 'annual';
export type AttendanceStatus = 'present' | 'absent' | 'excused' | 'remote';

export interface AgendaItem {
  order: number;
  title: string;
  type: 'call_to_order' | 'roll_call' | 'approval_minutes' | 'report'
       | 'old_business' | 'new_business' | 'public_comment' | 'adjournment';
  presenter?: string;
  timeMinutes?: number;
  description?: string;
}

export async function getMeetings() {
  return db
    .select()
    .from(boardMeetings)
    .orderBy(desc(boardMeetings.meetingDate));
}

export async function getMeeting(id: string) {
  const [meeting] = await db
    .select()
    .from(boardMeetings)
    .where(eq(boardMeetings.id, id));
  return meeting ?? null;
}

export async function getMeetingMinutes(meetingId: string) {
  const [minutes] = await db
    .select()
    .from(meetingMinutes)
    .where(eq(meetingMinutes.meetingId, meetingId));
  return minutes ?? null;
}

export async function getMeetingAttendance(meetingId: string) {
  return db
    .select({
      id: meetingAttendance.id,
      status: meetingAttendance.status,
      memberId: meetingAttendance.memberId,
      memberName: authUsers.name,
      memberEmail: authUsers.email,
      memberRole: authUsers.role,
    })
    .from(meetingAttendance)
    .innerJoin(authUsers, eq(meetingAttendance.memberId, authUsers.id))
    .where(eq(meetingAttendance.meetingId, meetingId));
}

export async function getMeetingApprovals(meetingId: string) {
  return db
    .select({
      id: meetingApprovals.id,
      vote: meetingApprovals.vote,
      comment: meetingApprovals.comment,
      votedAt: meetingApprovals.votedAt,
      memberId: meetingApprovals.memberId,
      memberName: authUsers.name,
    })
    .from(meetingApprovals)
    .innerJoin(authUsers, eq(meetingApprovals.memberId, authUsers.id))
    .where(eq(meetingApprovals.meetingId, meetingId));
}

export async function getMeetingResolutions(meetingId: string) {
  return db
    .select()
    .from(meetingResolutions)
    .where(eq(meetingResolutions.meetingId, meetingId))
    .orderBy(meetingResolutions.createdAt);
}

export async function getAllResolutions() {
  return db
    .select({
      id: meetingResolutions.id,
      resolutionNumber: meetingResolutions.resolutionNumber,
      title: meetingResolutions.title,
      description: meetingResolutions.description,
      motionBy: meetingResolutions.motionBy,
      secondedBy: meetingResolutions.secondedBy,
      votesFor: meetingResolutions.votesFor,
      votesAgainst: meetingResolutions.votesAgainst,
      abstentions: meetingResolutions.abstentions,
      passed: meetingResolutions.passed,
      effectiveDate: meetingResolutions.effectiveDate,
      createdAt: meetingResolutions.createdAt,
      meetingDate: boardMeetings.meetingDate,
    })
    .from(meetingResolutions)
    .innerJoin(boardMeetings, eq(meetingResolutions.meetingId, boardMeetings.id))
    .orderBy(desc(meetingResolutions.createdAt));
}

export async function getBoardMembers() {
  return db
    .select()
    .from(authUsers)
    .where(eq(authUsers.isActive, true));
}

export function parseAgenda(json: string | null): AgendaItem[] {
  if (!json) return [];
  try {
    return JSON.parse(json);
  } catch {
    return [];
  }
}
