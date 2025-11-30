import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Wallet } from 'lucide-react';
import type { Event } from '@/types/database';

interface EventCaisseTabProps {
  event: Event;
}

export function EventCaisseTab({ event }: EventCaisseTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Caisse</CardTitle>
      </CardHeader>
      <CardContent>
        <EmptyState
          icon={<Wallet className="h-12 w-12" />}
          title="Caisse non configurée"
          description="La gestion de la caisse sera disponible prochainement"
        />
      </CardContent>
    </Card>
  );
}

