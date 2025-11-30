import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { FileText } from 'lucide-react';
import type { Event } from '@/types/database';

interface EventBilanTabProps {
  event: Event;
}

export function EventBilanTab({ event }: EventBilanTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bilan</CardTitle>
      </CardHeader>
      <CardContent>
        <EmptyState
          icon={<FileText className="h-12 w-12" />}
          title="Bilan non configuré"
          description="Le bilan de l'événement sera disponible prochainement"
        />
      </CardContent>
    </Card>
  );
}

