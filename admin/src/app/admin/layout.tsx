import { ReactNode } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-base, #090a0f)' }}>
      <div className="bg-grid" />
      <AdminSidebar />
      <main className="flex-1 min-h-screen overflow-auto flex flex-col" style={{ position: 'relative', zIndex: 10 }}>
        {children}
      </main>
    </div>
  );
}
