import { Suspense } from 'react';
import Link from 'next/link';
import { TrendingUp, Building2, Calendar, CheckSquare, Euro, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getTasks } from '@/lib/supabase/queries/tasks';
import { getQuickLinks } from '@/lib/supabase/queries/quick-links';

export default function DashboardPage() {
  return (
    <div className="page">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Vue d'ensemble de votre activité
        </p>
      </div>

      <div className="section">
        {/* Stats principales */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Suspense fallback={<LoadingSkeleton type="card" />}>
            <StatsCards />
          </Suspense>
        </div>

        {/* Tâches urgentes */}
        <Card>
          <CardHeader>
            <CardTitle>Tâches urgentes</CardTitle>
            <CardDescription>Les tâches nécessitant votre attention</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<LoadingSkeleton type="list" />}>
              <UrgentTasks />
            </Suspense>
          </CardContent>
        </Card>

        {/* Liens rapides */}
        <Card>
          <CardHeader>
            <CardTitle>Liens rapides</CardTitle>
            <CardDescription>Accès rapide aux ressources fréquentes</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<LoadingSkeleton type="grid" />}>
              <QuickLinks />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

async function StatsCards() {
  // TODO: Récupérer les vraies stats depuis Supabase
  return (
    <>
      <StatCard
        title="CA du mois"
        value="12 450 €"
        icon={<Euro className="h-4 w-4" />}
        description="Hors événements perdus"
        trend={{ value: 12, isPositive: true }}
      />
      <StatCard
        title="Événements"
        value="8"
        icon={<Calendar className="h-4 w-4" />}
        description="Ce mois"
        trend={{ value: 5, isPositive: true }}
      />
      <StatCard
        title="Entreprises"
        value="24"
        icon={<Building2 className="h-4 w-4" />}
        description="Clients actifs"
      />
      <StatCard
        title="Tâches"
        value="5"
        icon={<CheckSquare className="h-4 w-4" />}
        description="En attente"
      />
    </>
  );
}

async function UrgentTasks() {
  const tasks = await getTasks();
  const urgentTasks = tasks.filter((t) => !t.is_done && t.priority === 1).slice(0, 5);

  if (urgentTasks.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucune tâche urgente</p>;
  }

  return (
    <div className="space-y-2">
      {urgentTasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50"
        >
          <div className="flex-1">
            <div className="font-medium">{task.title}</div>
            {task.due_date && (
              <div className="text-sm text-muted-foreground">
                Échéance: {new Date(task.due_date).toLocaleDateString('fr-FR')}
              </div>
            )}
          </div>
          <Badge variant="destructive">Urgent</Badge>
        </div>
      ))}
    </div>
  );
}

async function QuickLinks() {
  const links = await getQuickLinks();

  if (links.length === 0) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/crm/companies" className="block">
          <Card className="hover:shadow-md transition">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">CRM — Entreprises</div>
                  <div className="text-sm text-muted-foreground">Gérer les entreprises</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/crm/contacts" className="block">
          <Card className="hover:shadow-md transition">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">CRM — Contacts</div>
                  <div className="text-sm text-muted-foreground">Gérer les contacts</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/events" className="block">
          <Card className="hover:shadow-md transition">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Événements</div>
                  <div className="text-sm text-muted-foreground">Pipeline d'opportunités</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Card className="hover:shadow-md transition">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {link.favicon_url ? (
                  <img src={link.favicon_url} alt="" className="h-5 w-5" />
                ) : (
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                )}
                <div className="flex-1">
                  <div className="font-medium">{link.name}</div>
                  <div className="text-sm text-muted-foreground truncate">{link.url}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </a>
      ))}
    </div>
  );
}
