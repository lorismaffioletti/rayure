import { Suspense } from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { getEventInventory } from '@/lib/supabase/queries/event-inventory';
import { getProducts } from '@/lib/supabase/queries/products';
import { EventInventoryList } from '@/components/events/event-inventory-list';
import { AddProductToInventoryModal } from '@/components/events/add-product-to-inventory-modal';
import type { Event } from '@/types/database';

interface EventInventoryTabProps {
  event: Event;
}

async function EventInventoryListWrapper({ eventId }: { eventId: string }) {
  const inventory = await getEventInventory(eventId);
  return <EventInventoryList inventory={inventory} eventId={eventId} />;
}

export async function EventInventoryTab({ event }: EventInventoryTabProps) {
  const products = await getProducts();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Inventaire</CardTitle>
          <AddProductToInventoryModal eventId={event.id} products={products}>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un produit
            </Button>
          </AddProductToInventoryModal>
        </div>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<LoadingSkeleton type="list" />}>
          <EventInventoryListWrapper eventId={event.id} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
