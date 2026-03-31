import { requireAuth } from '@/lib/auth';
import { MeetingForm } from '@/components/meetings/meeting-form';

export default async function NewMeetingPage() {
  await requireAuth(['president', 'secretary']);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-(--text-primary)">Create New Meeting</h1>
      <MeetingForm />
    </div>
  );
}
