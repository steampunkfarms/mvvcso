'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard, Users, Calendar, FileText, PenSquare,
  Mail, DollarSign, BookOpen, Settings, LogOut, Menu, X,
} from 'lucide-react';
import type { SessionUser } from '@/lib/auth';
import { getRoleLabel } from '@/lib/permissions';
import { hasPermission } from '@/lib/permissions';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, permission: 'view_dashboard' as const },
  { href: '/admin/volunteers', label: 'Volunteers', icon: Users, permission: 'manage_volunteers' as const },
  { href: '/admin/events', label: 'Events', icon: Calendar, permission: 'manage_events' as const },
  { href: '/admin/documents', label: 'Documents', icon: FileText, permission: 'view_documents' as const },
  { href: '/admin/blog', label: 'Blog', icon: PenSquare, permission: 'manage_blog' as const },
  { href: '/admin/newsletter', label: 'Newsletter', icon: Mail, permission: 'manage_newsletter' as const },
  { href: '/admin/donations', label: 'Donations', icon: DollarSign, permission: 'manage_donations' as const },
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
      <div className="p-4 border-b border-sandy-gold/30">
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
        <div className="mt-2 px-2 py-1 rounded-md bg-terra-cotta/10 text-terra-cotta text-xs font-medium text-center">
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
                  ? 'bg-terra-cotta text-white'
                  : 'text-(--text-secondary) hover:bg-sandy-gold/20'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-sandy-gold/30">
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border border-sandy-gold shadow-sm"
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
        fixed top-0 left-0 z-40 h-full w-64 bg-cream-light border-r border-sandy-gold
        flex flex-col transition-transform duration-200
        lg:translate-x-0 lg:static lg:z-auto
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {navContent}
      </aside>
    </>
  );
}
