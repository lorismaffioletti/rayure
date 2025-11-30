import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Package } from 'lucide-react';
import type { Event } from '@/types/database';

interface EventInventoryTabProps {
  event: Event;
}

export function EventInventoryTab({ event }: EventInventoryTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventaire</CardTitle>
      </CardHeader>
      <CardContent>
        <EmptyState
          icon={<Package className="h-12 w-12" />}
          title="Inventaire non configuré"
          description="La gestion de l'inventaire sera disponible prochainement"
        />
      </CardContent>
    </Card>
  );
}

