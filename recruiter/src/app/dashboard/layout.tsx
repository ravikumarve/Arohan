import { ReactNode } from 'react';
import RecruiterSidebar from '@/components/recruiter/RecruiterSidebar';
import RecruiterHeader from '@/components/recruiter/RecruiterHeader';

export default function RecruiterLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-recruiter-background-primary flex">
      <RecruiterSidebar />
      <div className="flex-1 flex flex-col">
        <RecruiterHeader />
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
