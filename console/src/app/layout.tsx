import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "@arohan/shared/styles/console.css";
import ParticleMesh from "@/components/canvas/ParticleMesh";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

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
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans`}>
        <ParticleMesh />
        <div className="grid-overlay" />
        {children}
      </body>
    </html>
  );
}
