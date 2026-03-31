'use client';

import { useState } from 'react';
import { FileText, Download, AlertCircle, Clock, Users } from 'lucide-react';
import type { MeetingMinute } from '@/lib/transparency-docs';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function StatusBadge({ status }: { status: MeetingMinute['status'] }) {
  switch (status) {
    case 'no_meeting':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
          <AlertCircle className="w-3 h-3" /> No Meeting
        </span>
      );
    case 'no_quorum':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-500 bg-amber-50 px-2 py-0.5 rounded">
          <Users className="w-3 h-3" /> No Quorum
        </span>
      );
    case 'no_minutes':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
          <Clock className="w-3 h-3" /> No Minutes
        </span>
      );
    case 'postponed':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-500 bg-amber-50 px-2 py-0.5 rounded">
          <Clock className="w-3 h-3" /> Postponed
        </span>
      );
    default:
      return null;
  }
}

function TypeBadge({ type }: { type: MeetingMinute['type'] }) {
  if (type === 'regular') return null;
  const labels: Record<string, { text: string; className: string }> = {
    special: { text: 'Special', className: 'text-dusk-600 bg-dusk-50' },
    closed: { text: 'Closed', className: 'text-red-600 bg-red-50' },
    public: { text: 'Public', className: 'text-sage-600 bg-sage-50' },
  };
  const l = labels[type];
  if (!l) return null;
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded ${l.className}`}>
      {l.text}
    </span>
  );
}

export function MinutesBrowser({
  years,
  minutesByYear,
}: {
  years: number[];
  minutesByYear: Record<number, MeetingMinute[]>;
}) {
  const [activeYear, setActiveYear] = useState(years[years.length - 1]);
  const minutes = minutesByYear[activeYear] || [];

  return (
    <div>
      {/* Year tab bar */}
      <div className="border-b border-stone-200 mb-6 overflow-x-auto">
        <div className="flex gap-0 min-w-max">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setActiveYear(year)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                year === activeYear
                  ? 'border-gold-400 text-gold-500'
                  : 'border-transparent text-(--text-muted) hover:text-(--text-secondary) hover:border-stone-300'
              }`}
            >
              {year}
              <span className="ml-1.5 text-xs font-normal">
                ({(minutesByYear[year] || []).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Minutes list */}
      <div className="space-y-2">
        {minutes.map((minute) => {
          const hasFile = !!minute.fileUrl;
          const isActionable = minute.status === 'minutes';

          return (
            <div
              key={minute.fileName}
              className={`flex items-center gap-4 rounded-xl p-4 border transition-shadow ${
                isActionable
                  ? 'bg-white border-stone-200 hover:shadow-md'
                  : 'bg-stone-50 border-stone-100'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                isActionable ? 'bg-red-50 text-red-500' : 'bg-stone-100 text-stone-400'
              }`}>
                <FileText className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-sm font-medium ${isActionable ? 'text-(--text-primary)' : 'text-(--text-muted)'}`}>
                    {MONTH_NAMES[minute.month - 1]} {minute.date.split('-')[2]}, {minute.year}
                  </span>
                  <TypeBadge type={minute.type} />
                  <StatusBadge status={minute.status} />
                </div>
              </div>
              {isActionable && (
                hasFile ? (
                  <a
                    href={minute.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-dusk-600 hover:text-gold-500 transition-colors shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF
                  </a>
                ) : (
                  <span className="text-xs text-(--text-muted) italic shrink-0">Upload pending</span>
                )
              )}
            </div>
          );
        })}
      </div>

      {/* Year summary */}
      <div className="mt-6 p-4 bg-stone-100 rounded-xl">
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-(--text-muted)">
          <span>Total: {minutes.length} entries</span>
          <span>Meetings held: {minutes.filter((m) => m.status === 'minutes').length}</span>
          <span>No meeting: {minutes.filter((m) => m.status === 'no_meeting').length}</span>
          <span>No quorum: {minutes.filter((m) => m.status === 'no_quorum').length}</span>
        </div>
      </div>
    </div>
  );
}
