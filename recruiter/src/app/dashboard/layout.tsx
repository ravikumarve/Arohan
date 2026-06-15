import { ReactNode } from 'react';
import RecruiterSidebar from '@/components/recruiter/RecruiterSidebar';
import RecruiterHeader from '@/components/recruiter/RecruiterHeader';

export default function RecruiterLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-void, #030407)' }}>
      {/* Aurora background system */}
      <div className="bg-system">
        <div className="bg-grid-recruiter" />
        <div className="bg-aurora" />
      </div>

      <RecruiterSidebar />
      <div className="flex-1 flex flex-col" style={{ position: 'relative', zIndex: 10 }}>
        <RecruiterHeader />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
