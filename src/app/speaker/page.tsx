'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { sessions as initialSessions, speakers } from '@/lib/data';
import type { Session, SessionStatus } from '@/lib/types';
import { FilePlus, Upload, CalendarCheck, Award, QrCode } from 'lucide-react';
import { MockQRCode } from '@/components/mock-qr-code';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// For prototype, we'll just use the first speaker as the logged-in user.
const currentUser = speakers[0];

export default function SpeakerDashboard() {
  const [sessions, setSessions] = useState<Session[]>(initialSessions.filter(s => s.speakerId === currentUser.id));
  const [availabilityConfirmed, setAvailabilityConfirmed] = useState(currentUser.availabilityConfirmed);
  const [presentationUploaded, setPresentationUploaded] = useState(currentUser.presentationUploaded);

  const getProgressValue = () => {
    let value = 25; // Profile complete
    if (sessions.length > 0) value += 25;
    if (availabilityConfirmed) value += 25;
    if (presentationUploaded) value += 25;
    return value;
  };
  
  const getBadgeVariant = (status: SessionStatus) => {
    switch (status) {
      case 'Accepted': return 'default';
      case 'Rejected': return 'destructive';
      case 'Pending': return 'secondary';
    }
  };

  const hasAcceptedSession = sessions.some(s => s.status === 'Accepted');

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Welcome, {currentUser.name}!</h1>

      <Card>
        <CardHeader>
          <CardTitle>Your Onboarding Progress</CardTitle>
          <CardDescription>Complete these steps to be ready for the event.</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={getProgressValue()} className="w-full" />
          <div className="mt-2 text-sm text-muted-foreground">{getProgressValue()}% complete</div>
        </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader>
                <CardTitle>My Sessions</CardTitle>
                <CardDescription>Status of your submitted proposals.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {sessions.length > 0 ? sessions.map(session => (
                    <div key={session.id} className="flex justify-between items-center p-2 rounded-md border">
                        <span className="font-medium">{session.title}</span>
                        <Badge variant={getBadgeVariant(session.status)}>{session.status}</Badge>
                    </div>
                )) : (
                    <p className="text-muted-foreground">You haven't submitted any proposals yet.</p>
                )}
            </CardContent>
            <CardFooter>
                 <Button asChild className="w-full">
                    <Link href="/speaker/submit"><FilePlus className="mr-2 h-4 w-4" /> Submit a New Proposal</Link>
                </Button>
            </CardFooter>
        </Card>
        
        <Card className={!hasAcceptedSession ? 'bg-muted/50' : ''}>
            <CardHeader>
                <CardTitle>Pre-Event Tasks</CardTitle>
                <CardDescription>Tasks to complete for your accepted sessions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <Button onClick={() => setAvailabilityConfirmed(true)} disabled={!hasAcceptedSession || availabilityConfirmed} className="w-full justify-start gap-2">
                    <CalendarCheck className="h-4 w-4" /> {availabilityConfirmed ? 'Availability Confirmed' : 'Confirm Availability'}
                </Button>
                <Button onClick={() => setPresentationUploaded(true)} disabled={!hasAcceptedSession || presentationUploaded} variant="outline" className="w-full justify-start gap-2">
                    <Upload className="h-4 w-4" /> {presentationUploaded ? 'Presentation Uploaded' : 'Upload Presentation'}
                </Button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Event Tools</CardTitle>
                <CardDescription>Your resources for the event day.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="w-full justify-start gap-2">
                            <QrCode className="h-4 w-4" /> Show My Check-in QR
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-xs">
                        <DialogHeader>
                            <DialogTitle>Your Check-in Code</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col items-center justify-center p-4 gap-2">
                            <MockQRCode value={currentUser.id} size={200} />
                            <p className="text-sm text-muted-foreground">Present this at registration.</p>
                        </div>
                    </DialogContent>
                </Dialog>
                <Button asChild variant="outline" className="w-full justify-start gap-2">
                    <Link href="/speaker/certificate">
                        <Award className="h-4 w-4" /> Download Certificate
                    </Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
