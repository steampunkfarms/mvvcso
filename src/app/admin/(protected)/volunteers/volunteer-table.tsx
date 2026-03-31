'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  skills: string | null;
  totalHours: number | null;
  backgroundCheck: string | null;
  joinedAt: Date;
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  inactive: 'bg-gray-100 text-gray-500',
  on_leave: 'bg-blue-100 text-blue-600',
};

const BG_CHECK_COLORS: Record<string, string> = {
  cleared: 'bg-green-100 text-green-700',
  in_progress: 'bg-amber-100 text-amber-700',
  not_started: 'bg-gray-100 text-gray-500',
  expired: 'bg-red-100 text-red-600',
};

export function VolunteerTable({ volunteers }: { volunteers: Volunteer[] }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<'name' | 'totalHours' | 'joinedAt'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filtered = useMemo(() => {
    let result = volunteers;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(v =>
        v.name.toLowerCase().includes(q) || v.email.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(v => v.status === statusFilter);
    }

    result = [...result].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortField === 'name') return a.name.localeCompare(b.name) * dir;
      if (sortField === 'totalHours') return ((a.totalHours ?? 0) - (b.totalHours ?? 0)) * dir;
      return (new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()) * dir;
    });

    return result;
  }, [volunteers, search, statusFilter, sortField, sortDir]);

  function toggleSort(field: typeof sortField) {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  }

  const SortIcon = ({ field }: { field: typeof sortField }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-muted)" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-sandy-gold bg-white text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:border-terra-cotta"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-sandy-gold bg-white text-sm text-(--text-primary) focus:outline-none focus:border-terra-cotta"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="inactive">Inactive</option>
          <option value="on_leave">On Leave</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-sandy-gold overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sandy-gold/50 bg-cream-light">
                <th className="text-left px-4 py-3 font-semibold text-(--text-secondary)">
                  <button type="button" onClick={() => toggleSort('name')} className="inline-flex items-center gap-1">
                    Name <SortIcon field="name" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 font-semibold text-(--text-secondary) hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-(--text-secondary)">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-(--text-secondary) hidden lg:table-cell">Background</th>
                <th className="text-left px-4 py-3 font-semibold text-(--text-secondary)">
                  <button type="button" onClick={() => toggleSort('totalHours')} className="inline-flex items-center gap-1">
                    Hours <SortIcon field="totalHours" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 font-semibold text-(--text-secondary) hidden lg:table-cell">
                  <button type="button" onClick={() => toggleSort('joinedAt')} className="inline-flex items-center gap-1">
                    Joined <SortIcon field="joinedAt" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-(--text-muted)">
                    {search || statusFilter !== 'all' ? 'No volunteers match your filters.' : 'No volunteers yet.'}
                  </td>
                </tr>
              ) : (
                filtered.map(v => (
                  <tr key={v.id} className="border-b border-sandy-gold/20 hover:bg-cream-light/50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/volunteers/${v.id}`} className="font-medium text-(--text-primary) hover:text-terra-cotta transition-colors">
                        {v.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-(--text-secondary) hidden md:table-cell">{v.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[v.status] ?? 'bg-gray-100 text-gray-500'}`}>
                        {v.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${BG_CHECK_COLORS[v.backgroundCheck ?? 'not_started'] ?? 'bg-gray-100 text-gray-500'}`}>
                        {(v.backgroundCheck ?? 'not_started').replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-(--text-secondary)">{v.totalHours ?? 0}</td>
                    <td className="px-4 py-3 text-(--text-muted) text-xs hidden lg:table-cell">
                      {formatDistanceToNow(new Date(v.joinedAt), { addSuffix: true })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
