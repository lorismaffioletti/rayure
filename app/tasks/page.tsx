import { Suspense } from 'react';
import { getTasks } from '@/lib/supabase/queries/tasks';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default async function TasksPage() {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tâches</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Gestion des tâches et to-do
        </p>
      </div>

      <Suspense fallback={<div className="py-8 text-center text-neutral-500">Chargement...</div>}>
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
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          task.priority === 1
                            ? 'bg-red-100 text-red-800'
                            : task.priority === 2
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        Priorité {task.priority}
                      </span>
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
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-neutral-500">Aucune tâche enregistrée</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

