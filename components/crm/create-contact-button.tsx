'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreateContactModal } from '@/components/crm/create-contact-modal';
import type { Company } from '@/types/database';

interface CreateContactButtonProps {
  companyId?: string;
  companies: Company[];
}

export function CreateContactButton({ companyId, companies }: CreateContactButtonProps) {
  return (
    <CreateContactModal defaultCompanyId={companyId} companies={companies}>
      <Button size="sm">
        <Plus className="h-4 w-4 mr-2" />
        Ajouter un contact
      </Button>
    </CreateContactModal>
  );
}

