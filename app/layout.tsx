import '../styles/globals.css';
import type { Metadata } from 'next';
import { BottomNav } from '@/components/bottom-nav';

export const metadata: Metadata = {
  title: 'Rayure',
  description: 'CRM & ops interne (mobile-first)',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-dvh bg-white text-neutral-900 antialiased">
        <main className="pb-16">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}

