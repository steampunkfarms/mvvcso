import type { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
}

export function KpiCard({ label, value, icon: Icon, trend }: KpiCardProps) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5 flex items-start gap-4">
      <div className="p-2.5 rounded-lg bg-gold-400/10 text-gold-400 shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-(--text-muted) mb-1">{label}</p>
        <p className="text-2xl font-bold text-(--text-primary)">{value}</p>
        {trend && (
          <p className="text-xs text-(--text-muted) mt-1">{trend}</p>
        )}
      </div>
    </div>
  );
}
