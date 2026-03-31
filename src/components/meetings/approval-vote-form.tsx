'use client';

import { useState } from 'react';
import { Check, X, Minus } from 'lucide-react';

interface ApprovalVoteFormProps {
  meetingId: string;
  currentVote?: string;
}

export function ApprovalVoteForm({ meetingId, currentVote }: ApprovalVoteFormProps) {
  const [vote, setVote] = useState(currentVote || '');
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  async function handleSubmit(selectedVote: string) {
    setVote(selectedVote);
    setStatus('loading');

    try {
      const res = await fetch(`/api/admin/meetings/${meetingId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote: selectedVote, comment: comment || undefined }),
      });

      if (res.ok) {
        setStatus('success');
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch {
      setStatus('idle');
    }
  }

  if (status === 'success') {
    return (
      <p className="text-sm text-green-600 font-medium">Vote recorded. Thank you.</p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => handleSubmit('approve')}
          disabled={status === 'loading'}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-semibold transition-colors ${
            vote === 'approve' ? 'bg-green-600 text-white border-green-600' : 'border-green-300 text-green-700 hover:bg-green-50'
          }`}
        >
          <Check className="w-4 h-4" />
          Approve
        </button>
        <button
          type="button"
          onClick={() => handleSubmit('reject')}
          disabled={status === 'loading'}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-semibold transition-colors ${
            vote === 'reject' ? 'bg-red-600 text-white border-red-600' : 'border-red-300 text-red-700 hover:bg-red-50'
          }`}
        >
          <X className="w-4 h-4" />
          Reject
        </button>
        <button
          type="button"
          onClick={() => handleSubmit('abstain')}
          disabled={status === 'loading'}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-semibold transition-colors ${
            vote === 'abstain' ? 'bg-dusk-500 text-white border-stone-300' : 'border-stone-300/40 text-dusk-500 hover:bg-stone-200/10'
          }`}
        >
          <Minus className="w-4 h-4" />
          Abstain
        </button>
      </div>

      <div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={2}
          placeholder="Optional comment..."
          className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-100 text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:border-gold-400"
        />
      </div>
    </div>
  );
}
