import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { Sidebar } from '@/components/admin/sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();

  if (!user) {
    redirect('/admin/login');
  }

  return (
    <html lang={user.language} className="h-full">
      <body className="h-full bg-stone-50 font-(--font-body) text-(--text-primary)">
        <div className="flex h-full">
          <Sidebar user={user} />
          <main className="flex-1 overflow-y-auto lg:ml-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
