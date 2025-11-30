'use client';

import { useRouter } from 'next/navigation';
import type { Company } from '@/types/database';

interface CompanyFilterProps {
  companies: Company[];
  currentCompanyId?: string;
}

export function CompanyFilter({ companies, currentCompanyId }: CompanyFilterProps) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set('companyId', value);
    } else {
      url.searchParams.delete('companyId');
    }
    router.push(url.pathname + url.search);
  };

  return (
    <select
      value={currentCompanyId || ''}
      onChange={handleChange}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <option value="">Toutes les entreprises</option>
      {companies.map((company) => (
        <option key={company.id} value={company.id}>
          {company.name}
        </option>
      ))}
    </select>
  );
}

