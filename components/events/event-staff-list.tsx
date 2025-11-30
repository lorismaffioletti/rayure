import { Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { EventStaff, Barman } from '@/types/database';

interface EventStaffListProps {
  staff: Array<EventStaff & { barman?: Barman | null }>;
}

export function EventStaffList({ staff }: EventStaffListProps) {
  if (staff.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucun staff assigné</p>;
  }

  return (
    <div className="space-y-3">
      {staff.map((member) => {
        const startTime = new Date(member.start_time);
        const endTime = new Date(member.end_time);

        return (
          <div
            key={member.id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div className="flex-1">
              <div className="font-medium">
                {member.barman
                  ? `${member.barman.first_name} ${member.barman.last_name}`
                  : 'Barman inconnu'}
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>
                    {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}
                  </span>
                </div>
                <span>{member.hours_worked.toFixed(2)}h</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

