
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { proposals as initialProposals, speakers, agendaSlots } from '@/lib/data';
import type { Proposal, ProposalStatus } from '@/lib/types';
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
const currentUser = speakers.find(s => s.name === 'Alice')!;

export default function SpeakerDashboard() {
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals.filter(p => p.speakerId === currentUser.id));
  const [availabilityConfirmed, setAvailabilityConfirmed] = useState(currentUser.availabilityConfirmed);
  const [presentationUploaded, setPresentationUploaded] = useState(currentUser.presentationUploaded);

  const getProgressValue = () => {
    let value = 25; // Profile complete
    if (proposals.length > 0) value += 25;
    if (availabilityConfirmed) value += 25;
    if (presentationUploaded) value += 25;
    return value;
  };
  
  const getBadgeVariant = (status: ProposalStatus) => {
    switch (status) {
      case 'Accepted': return 'default';
      case 'Rejected': return 'destructive';
      case 'Pending': return 'secondary';
    }
  };

  const hasAcceptedSession = proposals.some(s => s.status === 'Accepted');

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
                <CardTitle>My Proposals</CardTitle>
                <CardDescription>Status of your submitted proposals.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {proposals.length > 0 ? proposals.map(proposal => {
                    const slot = agendaSlots.find(s => s.id === proposal.slotId);
                    return (
                    <div key={proposal.id} className="p-3 rounded-md border bg-background">
                        <div className="flex justify-between items-start">
                            <p className="font-semibold">{proposal.title}</p>
                            <Badge variant={getBadgeVariant(proposal.status)}>{proposal.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">For slot: "{slot?.title}"</p>
                        {proposal.status === 'Rejected' && proposal.aiFeedback && (
                            <p className="text-xs text-destructive mt-2 border-l-2 border-destructive/50 pl-2">
                                <span className='font-semibold'>Feedback:</span> {proposal.aiFeedback}
                            </p>
                        )}
                    </div>
                )}) : (
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
