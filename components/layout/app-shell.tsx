'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DarkModeToggle } from '@/components/ui/dark-mode-toggle';
import { Sidebar } from '@/components/layout/sidebar';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Toaster } from 'sonner';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Sidebar />
      <div className="md:pl-64">
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center gap-4 px-4 md:px-6">
            <div className="flex flex-1 items-center gap-4">
              <div className="flex-1 max-w-sm">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Rechercher..."
                    className="pl-9"
                    aria-label="Recherche globale"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DarkModeToggle />
            </div>
          </div>
        </header>
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <BottomNav />
      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
}

