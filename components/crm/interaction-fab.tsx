'use client';

import { useState } from 'react';
import { FAB } from '@/components/ui/fab';
import { CreateInteractionModal } from '@/components/crm/create-interaction-modal';

interface InteractionFABProps {
  contactId: string;
  contactName: string;
}

export function InteractionFAB({ contactId, contactName }: InteractionFABProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <FAB
        onClick={() => setIsModalOpen(true)}
        icon={<span className="text-xl">+</span>}
        label="Ajouter interaction"
      />
      <CreateInteractionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          window.location.reload();
        }}
        contactId={contactId}
        contactName={contactName}
      />
    </>
  );
}

