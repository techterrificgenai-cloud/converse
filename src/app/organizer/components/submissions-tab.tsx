
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { agendaSlots as initialAgendaSlots, proposals as initialProposals, speakers } from '@/lib/data';
import type { AgendaSlot, Proposal, Speaker, SessionTrack } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Sparkles, Check, X, Loader2, Users, FileText, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { resolveSubmissionConflict } from '@/ai/flows/resolve-submission-conflict';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type SlotStatus = 'Open' | 'Conflict' | 'Filled';

const statusColors: Record<SlotStatus, string> = {
  Open: 'bg-green-100 border-green-300 dark:bg-green-900/50 dark:border-green-700',
  Conflict: 'bg-orange-100 border-orange-300 dark:bg-orange-900/50 dark:border-orange-700',
  Filled: 'bg-blue-100 border-blue-300 dark:bg-blue-900/50 dark:border-blue-700',
};

const statusText: Record<SlotStatus, string> = {
    Open: 'This slot is open for submissions.',
    Conflict: 'Multiple proposals received. Resolution required.',
    Filled: 'This slot has been filled.',
}

const addSlotSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters long.'),
    track: z.enum(['AI & ML', 'Cloud Native', 'Frontend', 'DevOps', 'Security']),
    room: z.string().nonempty('Room is required.'),
    time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format.'),
});

export function SubmissionsTab() {
  const [agendaSlots, setAgendaSlots] = useState<AgendaSlot[]>(initialAgendaSlots);
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals);
  const [selectedSlot, setSelectedSlot] = useState<AgendaSlot | null>(null);
  const [conflictingProposals, setConflictingProposals] = useState<Proposal[]>([]);
  const [isConflictDialogOpen, setIsConflictDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof addSlotSchema>>({
    resolver: zodResolver(addSlotSchema),
    defaultValues: { title: '', room: '', time: '' },
  });


  const handleReviewConflict = (slot: AgendaSlot) => {
    const conflictProps = proposals.filter(p => p.slotId === slot.id && p.status === 'Pending');
    if (conflictProps.length > 1) {
      setSelectedSlot(slot);
      setConflictingProposals(conflictProps);
      setIsConflictDialogOpen(true);
    }
  };

  const handleResolveConflict = async (winningProposal: Proposal) => {
    if (!selectedSlot) return;
    setIsAiLoading(true);

    const losingProposal = conflictingProposals.find(p => p.id !== winningProposal.id);

    try {
      let rejectionFeedback = 'This was a highly competitive slot and another proposal was a slightly better fit.';
      if (losingProposal) {
         const result = await resolveSubmissionConflict({
            slotTitle: selectedSlot.title,
            winningProposal: { title: winningProposal.title, abstract: winningProposal.abstract },
            losingProposal: { title: losingProposal.title, abstract: losingProposal.abstract },
         });
         rejectionFeedback = result.rejectionFeedback;
      }
     
      setProposals(prev =>
        prev.map(p => {
          if (p.id === winningProposal.id) return { ...p, status: 'Accepted' };
          if (p.slotId === selectedSlot.id) return { ...p, status: 'Rejected', aiFeedback: rejectionFeedback };
          return p;
        })
      );

      setAgendaSlots(prev =>
        prev.map(s =>
          s.id === selectedSlot.id ? { ...s, status: 'Filled', acceptedProposalId: winningProposal.id } : s
        )
      );

      toast({
        title: 'Conflict Resolved',
        description: `${speakers.find(s=>s.id === winningProposal.speakerId)?.name} has been selected for "${selectedSlot.title}".`,
      });

    } catch (error) {
        console.error("Conflict resolution error:", error);
        toast({
            variant: 'destructive',
            title: 'AI Error',
            description: 'Could not generate rejection feedback. The conflict has been resolved without it.',
        });
    } finally {
        setIsAiLoading(false);
        setIsConflictDialogOpen(false);
        setSelectedSlot(null);
        setConflictingProposals([]);
    }
  };
  
  const handleAddSlot = (values: z.infer<typeof addSlotSchema>) => {
    const newSlot: AgendaSlot = {
        id: `slot_${Date.now()}`,
        title: values.title,
        description: 'Newly added slot.', // You can add a description field to the form if needed
        track: values.track,
        room: values.room,
        time: values.time,
        status: 'Open',
    };

    setAgendaSlots(prev => [...prev, newSlot]);
    // Also update the shared data source so speakers can see it
    initialAgendaSlots.push(newSlot);
    
    toast({
        title: 'Agenda Slot Added',
        description: `"${newSlot.title}" has been added and is now open for submissions.`,
    });
    
    setIsAddDialogOpen(false);
    form.reset();
  };

  const getSpeaker = (speakerId: string): Speaker | undefined => speakers.find(s => s.id === speakerId);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="flex items-center gap-2"><FileText /> Agenda Slots & Submissions</CardTitle>
                <CardDescription>Review submissions for each agenda slot. Slots with multiple pending proposals are marked as conflicts.</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                    <Button><PlusCircle className="mr-2 h-4 w-4" /> Add New Slot</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Agenda Slot</DialogTitle>
                        <DialogDescription>Create a new slot for speakers to submit proposals to.</DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleAddSlot)} className="space-y-4 py-4">
                            <FormField control={form.control} name="title" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slot Title</FormLabel>
                                    <FormControl><Input placeholder="e.g., The Future of Web Development" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <FormField control={form.control} name="track" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Track</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Select a track" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="AI & ML">AI & ML</SelectItem>
                                            <SelectItem value="Cloud Native">Cloud Native</SelectItem>
                                            <SelectItem value="Frontend">Frontend</SelectItem>
                                            <SelectItem value="DevOps">DevOps</SelectItem>
                                            <SelectItem value="Security">Security</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="room" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Room</FormLabel>
                                    <FormControl><Input placeholder="e.g., Hall D" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="time" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Time</FormLabel>
                                    <FormControl><Input placeholder="HH:MM (e.g., 15:00)" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                                <Button type="submit">Add Slot</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {agendaSlots.map(slot => {
            const slotProposals = proposals.filter(p => p.slotId === slot.id);
            const acceptedProposal = slotProposals.find(p => p.id === slot.acceptedProposalId);
            const acceptedSpeaker = acceptedProposal ? getSpeaker(acceptedProposal.speakerId) : null;

            return (
              <Card key={slot.id} className={cn('flex flex-col', statusColors[slot.status])}>
                <CardHeader>
                  <CardTitle>{slot.title}</CardTitle>
                  <CardDescription>{slot.track} &middot; {slot.room} @ {slot.time}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                   <p className="text-sm text-muted-foreground mb-4">{statusText[slot.status]}</p>
                   {slot.status === 'Filled' && acceptedProposal && acceptedSpeaker && (
                       <div className="p-3 rounded-md bg-background/50">
                           <p className="font-semibold">{acceptedProposal.title}</p>
                           <p className="text-sm text-muted-foreground">by {acceptedSpeaker.name}</p>
                       </div>
                   )}
                   {slot.status === 'Conflict' && (
                       <div className="p-3 rounded-md bg-background/50 space-y-2">
                           <p className="font-semibold text-sm">Conflicting Proposals:</p>
                           {slotProposals.filter(p => p.status === 'Pending').map(p => (
                               <div key={p.id} className="text-xs">
                                   <p className="font-medium">{p.title}</p>
                                   <p className="text-muted-foreground">by {getSpeaker(p.speakerId)?.name}</p>
                               </div>
                           ))}
                       </div>
                   )}
                </CardContent>
                <CardFooter>
                  {slot.status === 'Conflict' && (
                    <Button className="w-full" onClick={() => handleReviewConflict(slot)}>
                      <Users className="mr-2 h-4 w-4" /> Resolve Conflict
                    </Button>
                  )}
                  {slot.status === 'Filled' && (
                      <Button variant="secondary" className="w-full" disabled>
                          <Check className="mr-2 h-4 w-4" /> Slot Filled
                      </Button>
                  )}
                  {slot.status === 'Open' && (
                      <Button variant="outline" className="w-full" disabled>No Submissions Yet</Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </CardContent>
      </Card>
      
      {selectedSlot && isConflictDialogOpen && (
        <Dialog open={isConflictDialogOpen} onOpenChange={setIsConflictDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Resolve Conflict for "{selectedSlot.title}"</DialogTitle>
              <DialogDescription>
                Two or more proposals have been submitted for this slot. Please review them and select one to accept. The other will be automatically rejected with AI-generated feedback.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {conflictingProposals.map(proposal => {
                    const speaker = getSpeaker(proposal.speakerId);
                    return (
                        <Card key={proposal.id} className="flex flex-col">
                            <CardHeader>
                                <CardTitle>{proposal.title}</CardTitle>
                                <CardDescription>by {speaker?.name}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-1 text-sm">Abstract</h4>
                                    <ScrollArea className="h-32 p-2 border rounded-md bg-muted/50">
                                      <p className="text-sm text-muted-foreground">{proposal.abstract}</p>
                                    </ScrollArea>
                                </div>
                                <Card className="bg-background">
                                    <CardHeader className="p-4">
                                        <CardTitle className="flex items-center gap-2 text-md">
                                            <Sparkles className="text-primary w-4 h-4" /> AI Review
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0 text-sm space-y-2">
                                        <div className="space-y-1">
                                            <div className="flex justify-between"><span>Relevance:</span> <span>{proposal.aiScores?.relevance}/10</span></div>
                                            <div className="flex justify-between"><span>Clarity:</span> <span>{proposal.aiScores?.clarity}/10</span></div>
                                            <div className="flex justify-between"><span>Tech Depth:</span> <span>{proposal.aiScores?.technicalDepth}/10</span></div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">Feedback:</h4>
                                            <p className="text-muted-foreground text-xs">{proposal.aiFeedback}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" onClick={() => handleResolveConflict(proposal)} disabled={isAiLoading}>
                                    {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                                     Accept this Proposal
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsConflictDialogOpen(false)}>Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
