'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { sessions, speakers } from '@/lib/data';
import type { Session, SessionStatus, Speaker } from '@/lib/types';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generatePersonalizedEmail } from '@/ai/flows/automate-personalized-emails';
import { Textarea } from '@/components/ui/textarea';

export function CommunicationsTab() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [emailContent, setEmailContent] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const { toast } = useToast();

  const handleOpenDialog = (session: Session) => {
    const speaker = speakers.find((s) => s.id === session.speakerId);
    if (!speaker) return;

    setSelectedSession(session);
    setSelectedSpeaker(speaker);
    setFeedback(session.aiFeedback || (session.status === 'Accepted' ? 'Great proposal!' : 'Topic did not align with our current focus.'));
    setEmailContent('');
    setIsDialogOpen(true);
  };
  
  const handleGenerateEmail = async () => {
    if (!selectedSession || !selectedSpeaker) return;
    setIsAiLoading(true);
    try {
      const result = await generatePersonalizedEmail({
        speakerName: selectedSpeaker.name,
        sessionTitle: selectedSession.title,
        acceptanceStatus: selectedSession.status.toLowerCase() as 'accepted' | 'rejected',
        feedback: feedback,
      });
      setEmailContent(result.emailContent);
    } catch (error) {
      console.error('Email generation error:', error);
      toast({
        variant: 'destructive',
        title: 'AI Error',
        description: 'Failed to generate email. Please try again.',
      });
    } finally {
      setIsAiLoading(false);
    }
  };
  
  const handleSendEmail = () => {
    toast({
        title: 'Email Sent!',
        description: `An email has been sent to ${selectedSpeaker?.name}.`,
    });
    setIsDialogOpen(false);
  }

  const getBadgeVariant = (status: SessionStatus) => {
    switch (status) {
      case 'Accepted': return 'default';
      case 'Rejected': return 'destructive';
      case 'Pending': return 'secondary';
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" /> Speaker Communications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Speaker</TableHead>
                <TableHead>Session Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.filter(s => s.status !== 'Pending').map((session) => {
                const speaker = speakers.find((s) => s.id === session.speakerId);
                return (
                  <TableRow key={session.id}>
                    <TableCell>{speaker?.name}</TableCell>
                    <TableCell>{session.title}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(session.status)}>{session.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleOpenDialog(session)}>
                        <Send className="mr-2 h-4 w-4" /> Send Update
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedSession && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Send Email to {selectedSpeaker?.name}</DialogTitle>
              <DialogDescription>
                Review and send the {selectedSession.status.toLowerCase()} notification.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div>
                <label htmlFor="feedback" className="text-sm font-medium">Personalized Feedback</label>
                <Textarea id="feedback" value={feedback} onChange={(e) => setFeedback(e.target.value)} className="mt-1" />
              </div>
              <Button onClick={handleGenerateEmail} disabled={isAiLoading} className="w-full">
                {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate Email Preview
              </Button>
              {emailContent && (
                <div className="border rounded-md p-4 bg-muted/50 space-y-2">
                    <h4 className="font-semibold">Email Preview</h4>
                    <pre className="text-sm whitespace-pre-wrap font-sans">{emailContent}</pre>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSendEmail} disabled={!emailContent}>
                <Send className="mr-2 h-4 w-4" /> Send Email
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
