'use client';

import { useState } from 'react';
import { CreateContactModal } from '@/components/crm/create-contact-modal';
import type { Company } from '@/types/database';

interface CreateContactButtonProps {
  companyId?: string;
  companies: Company[];
}

export function CreateContactButton({ companyId, companies }: CreateContactButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-block rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
      >
        + Ajouter un contact
      </button>
      <CreateContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          window.location.reload();
        }}
        defaultCompanyId={companyId}
        companies={companies}
      />
    </>
  );
}

