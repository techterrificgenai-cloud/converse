'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { sessions as initialSessions, speakers } from '@/lib/data';
import type { Session, SessionTrack } from '@/lib/types';
import { AlertCircle, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];
const rooms = ['Main Hall', 'Room A', 'Room B', 'Workshop Zone'];

const trackColors: Record<SessionTrack, string> = {
  'AI & ML': 'bg-blue-200 border-blue-400 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200',
  'Cloud Native': 'bg-purple-200 border-purple-400 text-purple-800 dark:bg-purple-900 dark:border-purple-700 dark:text-purple-200',
  'Frontend': 'bg-green-200 border-green-400 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200',
  'DevOps': 'bg-orange-200 border-orange-400 text-orange-800 dark:bg-orange-900 dark:border-orange-700 dark:text-orange-200',
  'Security': 'bg-red-200 border-red-400 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200',
};

export function AgendaTab() {
  const [sessions, setSessions] = useState<Session[]>(
    initialSessions.filter((s) => s.status === 'Accepted')
  );

  const getSessionAt = (time: string, room: string) => {
    return sessions.find(
      (s) => s.scheduledAt?.includes(`T${time}`) && s.scheduledRoom === room
    );
  };
  
  const checkImbalance = (time: string, track: SessionTrack) => {
    const sessionsAtTime = sessions.filter(s => s.scheduledAt?.includes(`T${time}`));
    return sessionsAtTime.filter(s => s.track === track).length > 1;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" /> Agenda Builder
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Drag and drop sessions to build the agenda. (Note: Drag and drop is simulated in this prototype). Imbalances are highlighted.
        </p>
        <TooltipProvider>
          <div className="overflow-x-auto">
            <div className="grid gap-px bg-border" style={{ gridTemplateColumns: `6rem repeat(${rooms.length}, minmax(12rem, 1fr))` }}>
              <div className="p-2 font-semibold bg-muted">Time</div>
              {rooms.map((room) => (
                <div key={room} className="p-2 font-semibold bg-muted text-center">{room}</div>
              ))}

              {timeSlots.map((time) => (
                <React.Fragment key={time}>
                  <div className="p-2 font-semibold bg-muted/50 flex items-center justify-center">{time}</div>
                  {rooms.map((room) => {
                    const session = getSessionAt(time, room);
                    return (
                      <div
                        key={`${time}-${room}`}
                        className="p-2 bg-background min-h-[6rem] border-dashed border-border/50 border"
                      >
                        {session && (
                          <div
                            className={`p-2 rounded-lg text-xs shadow-sm relative ${trackColors[session.track]}`}
                          >
                            <p className="font-bold text-sm mb-1">{session.title}</p>
                            <p className="text-muted-foreground">{speakers.find(s => s.id === session.speakerId)?.name}</p>
                            <Badge variant="secondary" className="mt-2">{session.track}</Badge>
                            {checkImbalance(time, session.track) && (
                               <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="absolute top-1 right-1">
                                    <AlertCircle className="w-4 h-4 text-destructive" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Track imbalance: Multiple '{session.track}' sessions at the same time.</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
