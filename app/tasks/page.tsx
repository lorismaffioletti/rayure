import { Suspense } from 'react';
import { CheckSquare } from 'lucide-react';
import { getTasks } from '@/lib/supabase/queries/tasks';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';

export default async function TasksPage() {
  return (
    <div className="page max-w-5xl">
      <PageHeader
        title="Tâches"
        description="Gestion des tâches et to-do"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Tâches' }]}
      />

      <Suspense fallback={<LoadingSkeleton type="list" />}>
        <TasksList />
      </Suspense>
    </div>
  );
}

async function TasksList() {
  const tasks = await getTasks();

  const activeTasks = tasks.filter((t) => !t.is_done);
  const completedTasks = tasks.filter((t) => t.is_done);

  return (
    <div className="space-y-6">
      {activeTasks.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold">En cours ({activeTasks.length})</h2>
          <div className="space-y-2">
            {activeTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-sm transition">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{task.title}</div>
                      {task.due_date && (
                        <div className="text-sm text-neutral-600">
                          📅 {new Date(task.due_date).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          task.priority === 1
                            ? 'destructive'
                            : task.priority === 2
                              ? 'default'
                              : 'secondary'
                        }
                      >
                        Priorité {task.priority}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {completedTasks.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-neutral-600">
            Terminées ({completedTasks.length})
          </h2>
          <div className="space-y-2">
            {completedTasks.map((task) => (
              <Card key={task.id} className="opacity-60">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium line-through">{task.title}</div>
                      {task.done_at && (
                        <div className="text-sm text-neutral-500">
                          Terminé le {new Date(task.done_at).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tasks.length === 0 && (
        <EmptyState
          icon={<CheckSquare className="h-12 w-12" />}
          title="Aucune tâche enregistrée"
          description="Commencez par créer votre première tâche"
        />
      )}
    </div>
  );
}

