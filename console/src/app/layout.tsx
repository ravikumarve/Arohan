import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@arohan/shared/styles/console.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AROHAN Console - Internal Operations Center",
  description: "Internal operations console for AI agent testing, integration management, system monitoring, and configuration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
