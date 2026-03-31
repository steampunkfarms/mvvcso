'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface Volunteer {
  id: string;
  status: string;
}

export function VolunteerActions({ volunteer }: { volunteer: Volunteer }) {
  const router = useRouter();

  async function updateStatus(status: string) {
    await fetch('/api/admin/volunteers', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: volunteer.id, status }),
    });
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      {volunteer.status === 'pending' && (
        <button
          type="button"
          onClick={() => updateStatus('active')}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-100 text-green-700 text-xs font-medium hover:bg-green-200 transition-colors"
        >
          <CheckCircle className="w-3.5 h-3.5" /> Approve
        </button>
      )}
      {volunteer.status === 'active' && (
        <button
          type="button"
          onClick={() => updateStatus('on_leave')}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-100 text-blue-600 text-xs font-medium hover:bg-blue-200 transition-colors"
        >
          <Clock className="w-3.5 h-3.5" /> On Leave
        </button>
      )}
      {(volunteer.status === 'active' || volunteer.status === 'on_leave') && (
        <button
          type="button"
          onClick={() => updateStatus('inactive')}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-500 text-xs font-medium hover:bg-gray-200 transition-colors"
        >
          <XCircle className="w-3.5 h-3.5" /> Deactivate
        </button>
      )}
    </div>
  );
}
