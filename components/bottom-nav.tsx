'use client';

import Link from 'next/link';
import { useUser } from '@/lib/auth/get-user-client';

export function BottomNav() {
  const { user } = useUser();

  return (
    <nav className="fixed inset-x-0 bottom-0 border-t bg-white">
      <ul className="mx-auto flex max-w-md items-center justify-between px-6 py-3 text-sm">
        <li>
          <Link href="/" className="hover:text-neutral-600">
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/crm/companies" className="hover:text-neutral-600">
            CRM
          </Link>
        </li>
        <li>
          <Link href="/events" className="hover:text-neutral-600">
            Événements
          </Link>
        </li>
        <li>
          <Link href="/tasks" className="hover:text-neutral-600">
            Tâches
          </Link>
        </li>
        {user && (
          <li>
            <Link
              href="/auth/sign-out"
              className="text-red-600 hover:text-red-700"
            >
              Déconnexion
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

