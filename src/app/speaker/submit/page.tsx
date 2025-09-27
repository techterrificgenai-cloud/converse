
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Loader2, Send } from 'lucide-react';
import { suggestSessionTitles } from '@/ai/flows/ai-suggest-session-titles';
import { useRouter } from 'next/navigation';
import { agendaSlots as initialAgendaSlots } from '@/lib/data';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { AgendaSlot } from '@/lib/types';


const proposalSchema = z.object({
  slotId: z.string().nonempty('Please select an agenda slot.'),
  title: z.string().min(10, 'Title must be at least 10 characters long.'),
  abstract: z.string().min(50, 'Abstract must be at least 50 characters long.'),
});

export default function SubmitProposalPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [agendaSlots] = useLocalStorage<AgendaSlot[]>('agendaSlots', initialAgendaSlots);
  const form = useForm<z.infer<typeof proposalSchema>>({
    resolver: zodResolver(proposalSchema),
    defaultValues: { slotId: '', title: '', abstract: '' },
  });

  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
  
  const onSubmit = (values: z.infer<typeof proposalSchema>) => {
    console.log(values);
    toast({
      title: 'Proposal Submitted!',
      description: 'Your proposal has been received. You can track its status on your dashboard.',
    });
    router.push('/speaker');
  };

  const handleGetSuggestions = async () => {
    const title = form.getValues('title');
    const abstract = form.getValues('abstract');
    if (!title || !abstract) {
        toast({
            variant: 'destructive',
            title: 'Missing Information',
            description: 'Please provide a title and abstract to get suggestions.'
        });
        return;
    }
    
    setIsAiLoading(true);
    setTitleSuggestions([]);
    setIsSuggestionsOpen(true);
    try {
        const result = await suggestSessionTitles({ title, abstract });
        setTitleSuggestions(result.suggestions);
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'AI Error',
            description: 'Could not generate title suggestions.'
        });
        setIsSuggestionsOpen(false);
    } finally {
        setIsAiLoading(false);
    }
  };

  const useSuggestion = (suggestion: string) => {
    form.setValue('title', suggestion);
    setIsSuggestionsOpen(false);
  };
  
  const availableSlots = agendaSlots.filter(slot => slot.status === 'Open');

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle>Submit a New Proposal</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="slotId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agenda Slot</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an available agenda slot to apply for" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableSlots.map(slot => <SelectItem key={slot.id} value={slot.id}>[{slot.track}] {slot.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormDescription>This is the conference slot you are applying to speak in.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Proposal Title</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="e.g., The Future of Web Development" {...field} />
                    </FormControl>
                    <Button type="button" variant="outline" onClick={handleGetSuggestions}>
                        <Sparkles className="mr-2 h-4 w-4" /> Suggest
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="abstract"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Abstract</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a detailed description of your session..."
                      className="min-h-[150px]"
                      {...field}
                    />

                  </FormControl>
                  <FormDescription>
                    This will be shown to the review committee. Be clear and engaging.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit">
                <Send className="mr-2 h-4 w-4" /> Submit Proposal
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>

    <Dialog open={isSuggestionsOpen} onOpenChange={setIsSuggestionsOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <Sparkles className="text-primary" /> AI Title Suggestions
                </DialogTitle>
                <DialogDescription>
                    Here are some alternative titles based on your abstract. Click one to use it.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4">
                {isAiLoading ? (
                    <div className="flex items-center justify-center h-24">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="space-y-2">
                        {titleSuggestions.map((suggestion, index) => (
                            <Button key={index} variant="outline" className="w-full justify-start h-auto" onClick={() => useSuggestion(suggestion)}>
                                {suggestion}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
            <DialogFooter>
                <Button variant="ghost" onClick={() => setIsSuggestionsOpen(false)}>Close</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}
