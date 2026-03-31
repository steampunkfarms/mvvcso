import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string | null;
  createdAt: Date;
}

const TYPE_ICONS: Record<string, string> = {
  subscriber_new: '📧',
  donation_received: '💰',
  contact_new: '💬',
  volunteer_signup: '🤝',
  event_created: '📅',
  document_uploaded: '📄',
  blog_published: '📝',
  rsvp_new: '✅',
};

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-(--text-muted) text-sm">
        No recent activity yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map(item => (
        <div key={item.id} className="flex items-start gap-3 py-2">
          <span className="text-lg shrink-0">{TYPE_ICONS[item.type] ?? '📌'}</span>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-(--text-primary) font-medium">{item.title}</p>
            {item.description && (
              <p className="text-xs text-(--text-muted) truncate">{item.description}</p>
            )}
          </div>
          <span className="text-xs text-(--text-muted) whitespace-nowrap shrink-0">
            {formatDistanceToNow(item.createdAt, { addSuffix: true })}
          </span>
        </div>
      ))}
    </div>
  );
}
