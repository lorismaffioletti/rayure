import { Suspense } from 'react';
import { Plus } from 'lucide-react';
import { getBarmans } from '@/lib/supabase/queries/barmans';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { BarmansList } from '@/components/barmans/barmans-list';
import { CreateBarmanModal } from '@/components/barmans/create-barman-modal';

async function BarmansListWrapper() {
  const barmans = await getBarmans();
  return <BarmansList barmans={barmans} />;
}

export default async function BarmansPage() {
  return (
    <div className="page">
      <PageHeader
        title="Barmans"
        description="Gérez votre équipe de barmans"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Barmans' }]}
        actions={
          <CreateBarmanModal>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau barman
            </Button>
          </CreateBarmanModal>
        }
      />

      <Suspense fallback={<LoadingSkeleton type="table" />}>
        <BarmansListWrapper />
      </Suspense>
    </div>
  );
}

