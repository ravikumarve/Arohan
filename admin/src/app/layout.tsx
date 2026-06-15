import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '@arohan/shared/styles/admin.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AROHAN Platform Admin',
  description: 'Platform management and administration dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
