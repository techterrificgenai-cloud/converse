'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SubmissionsTab } from './components/submissions-tab';
import { AgendaTab } from './components/agenda-tab';
import { CommunicationsTab } from './components/communications-tab';
import { AnalyticsTab } from './components/analytics-tab';
import { EventToolsTab } from './components/event-tools-tab';
import {
  FileText,
  Calendar,
  Send,
  BarChart2,
  Users
} from 'lucide-react';

export default function OrganizerDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Organizer Dashboard</h1>
      <Tabs defaultValue="submissions" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 h-auto">
          <TabsTrigger value="submissions" className="flex gap-2 items-center">
            <FileText className="h-4 w-4" /> Submissions
          </TabsTrigger>
          <TabsTrigger value="agenda" className="flex gap-2 items-center">
            <Calendar className="h-4 w-4" /> Agenda
          </TabsTrigger>
          <TabsTrigger value="communications" className="flex gap-2 items-center">
            <Send className="h-4 w-4" /> Communications
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex gap-2 items-center">
            <BarChart2 className="h-4 w-4" /> Analytics
          </TabsTrigger>
          <TabsTrigger value="event-tools" className="flex gap-2 items-center">
            <Users className="h-4 w-4" /> Event Tools
          </TabsTrigger>
        </TabsList>
        <TabsContent value="submissions">
          <SubmissionsTab />
        </TabsContent>
        <TabsContent value="agenda">
          <AgendaTab />
        </TabsContent>
        <TabsContent value="communications">
          <CommunicationsTab />
        </TabsContent>
        <TabsContent value="analytics">
          <AnalyticsTab />
        </TabsContent>
        <TabsContent value="event-tools">
          <EventToolsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
