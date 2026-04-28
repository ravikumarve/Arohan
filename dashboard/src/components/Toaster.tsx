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
      toastOptions={{
        style: {
          background: '#1e293b',
          border: '1px solid #334155',
          color: '#f1f5f9',
        },
        success: {
          style: {
            background: '#064e3b',
            border: '1px solid #059669',
            color: '#ecfdf5',
          },
        },
        error: {
          style: {
            background: '#7f1d1d',
            border: '1px solid #dc2626',
            color: '#fef2f2',
          },
        },
        warning: {
          style: {
            background: '#78350f',
            border: '1px solid #d97706',
            color: '#fffbeb',
          },
        },
        info: {
          style: {
            background: '#1e3a8a',
            border: '1px solid #3b82f6',
            color: '#eff6ff',
          },
        },
      }}
      className="toaster group"
      toastOptions={{
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
