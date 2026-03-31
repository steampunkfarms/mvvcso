import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { env } from '@/lib/env';
import { getMeeting, getMeetingMinutes, getMeetingAttendance, parseAgenda } from '@/lib/meetings';
import { format } from 'date-fns';

const MINUTES_SYSTEM_PROMPT = `You are the MVVCSO Board Meeting Minutes formatter. You take raw meeting notes or audio transcriptions and format them into professional board meeting minutes compliant with California Corporations Code §5215 (nonprofit mutual benefit) and MVVCSO bylaws.

Format requirements:
1. Header: Organization name, meeting type, date, time, location
2. Call to Order: Who called, what time
3. Roll Call: Present, Absent, Excused, Remote (note quorum status)
4. Approval of Previous Minutes: Motion, second, vote result
5. Reports: Officer reports, committee reports
6. Old Business: Each item with discussion summary and any motions
7. New Business: Each item with discussion summary and any motions
8. Motions & Resolutions: For each motion — who moved, who seconded, discussion summary, vote tally (For/Against/Abstain), result (Passed/Failed)
9. Public Comment: Summary if applicable
10. Next Meeting: Date, time, location
11. Adjournment: Motion, time

Style:
- Third person, past tense
- Factual, not editorial
- Record what was decided, not every word said
- Include specific vote counts for all motions
- Note any conflicts of interest declared
- Bilingual header (English primary, Spanish subtitle)

Output as clean Markdown.`;

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth(['president', 'secretary']);
  const { id } = await params;

  if (!env.hasAnthropic) {
    return NextResponse.json(
      { error: 'Anthropic API key not configured' },
      { status: 503 }
    );
  }

  const meeting = await getMeeting(id);
  if (!meeting) {
    return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
  }

  const minutes = await getMeetingMinutes(id);
  if (!minutes?.rawNotes) {
    return NextResponse.json({ error: 'No raw notes to process' }, { status: 400 });
  }

  const attendance = await getMeetingAttendance(id);
  const agenda = parseAgenda(meeting.agendaJson);

  // Build context for Claude
  const context = [
    `Meeting Date: ${format(meeting.meetingDate, 'MMMM d, yyyy, h:mm a')}`,
    `Meeting Type: ${meeting.meetingType}`,
    `Location: ${meeting.location || 'MVVCSO Community Center'}`,
    meeting.calledBy ? `Called By: ${meeting.calledBy}` : '',
    '',
    'Attendance:',
    ...attendance.map(a => `- ${a.memberName} (${a.memberRole}): ${a.status}`),
    '',
    agenda.length > 0 ? 'Agenda:' : '',
    ...agenda.map((item, i) => `${i + 1}. ${item.title}${item.presenter ? ` (${item.presenter})` : ''}`),
    '',
    'Raw Notes:',
    minutes.rawNotes,
  ].filter(Boolean).join('\n');

  try {
    // Mark as processing
    await db
      .update(schema.boardMeetings)
      .set({ status: 'ai_processing', updatedAt: new Date() })
      .where(eq(schema.boardMeetings.id, id));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.anthropicApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 4000,
        system: MINUTES_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: context }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const aiDraft = data.content?.[0]?.text || '';

    // Save draft and advance status
    await db
      .update(schema.meetingMinutes)
      .set({
        aiDraft,
        aiDraftGeneratedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(schema.meetingMinutes.meetingId, id));

    await db
      .update(schema.boardMeetings)
      .set({ status: 'review', updatedAt: new Date() })
      .where(eq(schema.boardMeetings.id, id));

    await db.insert(schema.activityLog).values({
      type: 'minutes_drafted',
      title: 'AI draft generated for meeting minutes',
      entityId: id,
      entityType: 'meeting',
      userId: user.id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // Revert to draft on failure
    await db
      .update(schema.boardMeetings)
      .set({ status: 'draft', updatedAt: new Date() })
      .where(eq(schema.boardMeetings.id, id));

    console.error('Generate draft error:', error);
    return NextResponse.json({ error: 'Failed to generate draft' }, { status: 500 });
  }
}
