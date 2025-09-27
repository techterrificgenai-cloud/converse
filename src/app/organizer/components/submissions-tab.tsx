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
import { ScrollArea } from '@/components/ui/scroll-area';
import { sessions as initialSessions, speakers } from '@/lib/data';
import type { Session, SessionStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Sparkles, Check, X, Loader2 } from 'lucide-react';
import { aiSuggestProposalFeedback } from '@/ai/flows/ai-suggest-proposal-feedback';
import { useToast } from '@/hooks/use-toast';

export function SubmissionsTab() {
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{ scores: any; feedback: string } | null>(null);
  const { toast } = useToast();

  const handleReview = (session: Session) => {
    setSelectedSession(session);
    setAiFeedback(session.aiScores ? { scores: session.aiScores, feedback: session.aiFeedback || '' } : null);
    setIsReviewing(true);
  };

  const handleStatusChange = (sessionId: string, status: SessionStatus) => {
    setSessions((prevSessions) =>
      prevSessions.map((s) => (s.id === sessionId ? { ...s, status } : s))
    );
    setIsReviewing(false);
    setSelectedSession(null);
    toast({
      title: `Session ${status}`,
      description: `The session has been marked as ${status.toLowerCase()}.`,
    });
  };

  const getAiFeedback = async () => {
    if (!selectedSession) return;
    setIsAiLoading(true);
    try {
      const result = await aiSuggestProposalFeedback({
        title: selectedSession.title,
        abstract: selectedSession.abstract,
        category: selectedSession.category,
        track: selectedSession.track,
      });
      setAiFeedback({
        scores: {
          relevance: result.relevanceScore,
          clarity: result.clarityScore,
          technicalDepth: result.technicalDepthScore,
        },
        feedback: result.feedback,
      });
    } catch (error) {
      console.error('AI feedback error:', error);
      toast({
        variant: 'destructive',
        title: 'AI Error',
        description: 'Failed to get AI feedback. Please try again.',
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const getBadgeVariant = (status: SessionStatus) => {
    switch (status) {
      case 'Accepted':
        return 'default';
      case 'Rejected':
        return 'destructive';
      case 'Pending':
        return 'secondary';
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Session Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Speaker</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Track</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => {
                const speaker = speakers.find((s) => s.id === session.speakerId);
                return (
                  <TableRow key={session.id}>
                    <TableCell>{speaker?.name || 'N/A'}</TableCell>
                    <TableCell className="font-medium">{session.title}</TableCell>
                    <TableCell>{session.track}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(session.status)}>
                        {session.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleReview(session)}>
                        Review
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
        <Dialog open={isReviewing} onOpenChange={setIsReviewing}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Review Proposal</DialogTitle>
              <DialogDescription>{selectedSession.title}</DialogDescription>
            </DialogHeader>
            <div className="grid md:grid-cols-2 gap-6 py-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Proposal Details</h3>
                <div className="space-y-4 text-sm">
                  <p><strong>Speaker:</strong> {speakers.find(s => s.id === selectedSession.speakerId)?.name}</p>
                  <p><strong>Category:</strong> {selectedSession.category}</p>
                  <p><strong>Track:</strong> {selectedSession.track}</p>
                  <div>
                    <h4 className="font-semibold">Abstract</h4>
                    <ScrollArea className="h-48 mt-1 rounded-md border p-3 bg-muted/50">
                      <p className="text-muted-foreground">{selectedSession.abstract}</p>
                    </ScrollArea>
                  </div>
                </div>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Sparkles className="text-primary w-5 h-5" />
                      AI-Assisted Review
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {aiFeedback ? (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Scores</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between"><span>Relevance:</span> <span>{aiFeedback.scores.relevance}/10</span></div>
                            <div className="flex justify-between"><span>Clarity:</span> <span>{aiFeedback.scores.clarity}/10</span></div>
                            <div className="flex justify-between"><span>Technical Depth:</span> <span>{aiFeedback.scores.technicalDepth}/10</span></div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Feedback</h4>
                          <p className="text-sm text-muted-foreground">{aiFeedback.feedback}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        <p>Get AI-powered feedback and scores for this proposal.</p>
                        <Button className="mt-4" onClick={getAiFeedback} disabled={isAiLoading}>
                          {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                          Get AI Feedback
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={() => handleStatusChange(selectedSession.id, 'Rejected')}
              >
                <X className="mr-2 h-4 w-4" /> Reject
              </Button>
              <Button
                variant="default"
                onClick={() => handleStatusChange(selectedSession.id, 'Accepted')}
              >
                <Check className="mr-2 h-4 w-4" /> Accept
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
