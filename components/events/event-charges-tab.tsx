import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Receipt } from 'lucide-react';
import type { Event } from '@/types/database';

interface EventChargesTabProps {
  event: Event;
}

export function EventChargesTab({ event }: EventChargesTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Charges</CardTitle>
      </CardHeader>
      <CardContent>
        <EmptyState
          icon={<Receipt className="h-12 w-12" />}
          title="Charges non configurées"
          description="La gestion des charges sera disponible prochainement"
        />
      </CardContent>
    </Card>
  );
}

