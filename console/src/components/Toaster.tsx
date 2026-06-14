// Toaster Component for toast notifications

'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      theme="dark"
      className="toaster group"
      toastOptions={{
        style: {
          background: '#1e293b',
          border: '1px solid #334155',
          color: '#f1f5f9',
        },
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-slate-900 group-[.toaster]:text-slate-50 group-[.toaster]:border-slate-800 group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-slate-400',
          actionButton:
            'group-[.toast]:bg-slate-800 group-[.toast]:text-slate-50 group-[.toast]:hover:bg-slate-700',
          cancelButton:
            'group-[.toast]:bg-slate-800 group-[.toast]:text-slate-50 group-[.toast]:hover:bg-slate-700',
        },
      }}
    />
  );
}
