'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Users,
  Calendar,
  Package,
  Receipt,
  CheckSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/crm/companies', label: 'CRM', icon: Building2 },
  { href: '/crm/contacts', label: 'Contacts', icon: Users },
  { href: '/events', label: 'Événements', icon: Calendar },
  { href: '/products', label: 'Produits', icon: Package },
  { href: '/expenses', label: 'Notes de frais', icon: Receipt },
  { href: '/tasks', label: 'Tâches', icon: CheckSquare },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:left-0 md:border-r md:bg-background">
      <div className="flex flex-col h-full">
        <div className="flex h-16 items-center border-b px-6">
          <h2 className="text-lg font-semibold">Rayure</h2>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

