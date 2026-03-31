'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard, Users, Calendar, FileText, PenSquare,
  Mail, DollarSign, BookOpen, Settings, LogOut, Menu, X,
  Gavel, Landmark, ShieldCheck, Vote, Megaphone, Shield,
  ShoppingBag, Store, Target, Gamepad2, TreePine,
} from 'lucide-react';
import type { SessionUser } from '@/lib/auth';
import { getRoleLabel } from '@/lib/permissions';
import { hasPermission } from '@/lib/permissions';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, permission: 'view_dashboard' as const },
  { href: '/admin/secretary', label: "Secretary's Desk", icon: Gavel, permission: 'manage_meetings' as const },
  { href: '/admin/treasurer', label: 'Treasurer', icon: Landmark, permission: 'manage_financials' as const },
  { href: '/admin/compliance', label: 'Compliance', icon: ShieldCheck, permission: 'manage_compliance' as const },
  { href: '/admin/volunteers', label: 'Volunteers', icon: Users, permission: 'manage_volunteers' as const },
  { href: '/admin/events', label: 'Events', icon: Calendar, permission: 'manage_events' as const },
  { href: '/admin/documents', label: 'Documents', icon: FileText, permission: 'view_documents' as const },
  { href: '/admin/blog', label: 'Blog', icon: PenSquare, permission: 'manage_blog' as const },
  { href: '/admin/newsletter', label: 'Newsletter', icon: Mail, permission: 'manage_newsletter' as const },
  { href: '/admin/donations', label: 'Donations', icon: DollarSign, permission: 'manage_donations' as const },
  { href: '/admin/social', label: 'Social Media', icon: Megaphone, permission: 'manage_social' as const },
  { href: '/admin/ballots', label: 'Ballots', icon: Vote, permission: 'manage_ballots' as const },
  { href: '/admin/moderation', label: 'Moderation', icon: Shield, permission: 'manage_moderation' as const },
  { href: '/admin/shop', label: 'Merch Shop', icon: ShoppingBag, permission: 'manage_donations' as const },
  { href: '/admin/mercantile', label: 'Mercantile', icon: Store, permission: 'manage_donations' as const },
  { href: '/admin/fundraising', label: 'Fundraising', icon: Target, permission: 'manage_donations' as const },
  { href: '/admin/kids', label: 'Kids Portal', icon: Gamepad2, permission: 'manage_moderation' as const },
  { href: '/admin/legacy', label: 'Genealogy', icon: TreePine, permission: 'manage_moderation' as const },
  { href: '/admin/bylaws', label: 'Bylaws', icon: BookOpen, permission: 'view_dashboard' as const },
  { href: '/admin/settings', label: 'Settings', icon: Settings, permission: 'manage_users' as const },
];

export function Sidebar({ user }: { user: SessionUser }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const visibleItems = NAV_ITEMS.filter(item => hasPermission(user.role, item.permission));

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  const navContent = (
    <>
      {/* Brand */}
      <div className="p-4 border-b border-stone-200/30">
        <div className="flex items-center gap-3">
          <Image
            src="/images/ranchita/yeti-closeup.jpg"
            alt="MVVCSO"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="min-w-0">
            <div className="text-sm font-bold text-(--text-primary) truncate">MVVCSO Admin</div>
            <div className="text-xs text-(--text-muted) truncate">{user.name}</div>
          </div>
        </div>
        <div className="mt-2 px-2 py-1 rounded-md bg-gold-400/10 text-gold-400 text-xs font-medium text-center">
          {getRoleLabel(user.role)}
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto py-2">
        {visibleItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gold-400 text-white'
                  : 'text-(--text-secondary) hover:bg-stone-200/20'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-stone-200/30">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-(--text-muted) hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        type="button"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border border-stone-200 shadow-sm"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-40 h-full w-64 bg-stone-100 border-r border-stone-200
        flex flex-col transition-transform duration-200
        lg:translate-x-0 lg:static lg:z-auto
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {navContent}
      </aside>
    </>
  );
}
