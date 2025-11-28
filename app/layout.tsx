import '../styles/globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Rayure',
  description: 'CRM & ops interne (mobile-first)',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-dvh bg-white text-neutral-900 antialiased">
        <main className="pb-16">{children}</main>
        {/* Bottom nav mobile simple (placeholder) */}
        <nav className="fixed inset-x-0 bottom-0 border-t bg-white">
          <ul className="mx-auto flex max-w-md items-center justify-between px-6 py-3 text-sm">
            <li><Link href="/">Dashboard</Link></li>
            <li><Link href="/crm/companies">CRM</Link></li>
            <li><Link href="/events">Événements</Link></li>
            <li><Link href="/tasks">Tâches</Link></li>
          </ul>
        </nav>
      </body>
    </html>
  );
}

