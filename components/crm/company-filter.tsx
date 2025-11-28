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
      className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
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

