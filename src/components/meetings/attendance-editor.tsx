'use client';

import { useState, useEffect } from 'react';

interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  memberRole: string;
  status: string;
}

interface AttendanceEditorProps {
  meetingId: string;
  attendance: AttendanceRecord[];
  editable: boolean;
}

const statusOptions = [
  { value: 'present', label: 'Present', color: 'bg-green-100 text-green-700' },
  { value: 'remote', label: 'Remote', color: 'bg-sky-100 text-sky-700' },
  { value: 'excused', label: 'Excused', color: 'bg-sandy-gold/20 text-chaparral' },
  { value: 'absent', label: 'Absent', color: 'bg-red-100 text-red-700' },
];

export function AttendanceEditor({ meetingId, attendance, editable }: AttendanceEditorProps) {
  if (attendance.length === 0) {
    return (
      <p className="text-sm text-(--text-muted)">
        {editable
          ? 'No board members assigned. Save meeting to auto-load members.'
          : 'No attendance recorded.'}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {attendance.map(record => {
        const statusStyle = statusOptions.find(s => s.value === record.status);
        return (
          <div key={record.id} className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-(--text-primary)">{record.memberName}</div>
              <div className="text-xs text-(--text-muted) capitalize">{record.memberRole.replace('_', ' ')}</div>
            </div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded ${statusStyle?.color || 'bg-gray-100 text-gray-600'}`}>
              {record.status}
            </span>
          </div>
        );
      })}
    </div>
  );
}
