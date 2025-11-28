'use client';

import { type ReactNode } from 'react';

interface FABProps {
  onClick: () => void;
  icon: ReactNode;
  label?: string;
  className?: string;
}

export function FAB({ onClick, icon, label, className = '' }: FABProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-20 right-6 z-40 flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-3 text-white shadow-lg transition hover:bg-neutral-800 ${className}`}
      aria-label={label}
    >
      {icon}
      {label && <span className="text-sm font-medium">{label}</span>}
    </button>
  );
}

