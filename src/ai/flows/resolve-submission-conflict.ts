
'use server';
/**
 * @fileOverview Provides AI-generated feedback for a rejected proposal in a conflict scenario.
 *
 * - resolveSubmissionConflict - A function that generates rejection feedback.
 * - ResolveSubmissionConflictInput - The input type for the function.
 * - ResolveSubmissionConflictOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WinningProposalSchema = z.object({
  title: z.string().describe('The title of the winning session proposal.'),
  abstract: z.string().describe('The abstract of the winning session proposal.'),
});

const LosingProposalSchema = z.object({
    title: z.string().describe('The title of the rejected session proposal.'),
    abstract: z.string().describe('The abstract of the rejected session proposal.'),
});

const ResolveSubmissionConflictInputSchema = z.object({
  slotTitle: z.string().describe('The title of the agenda slot the proposals were submitted for.'),
  winningProposal: WinningProposalSchema,
  losingProposal: LosingProposalSchema,
});
export type ResolveSubmissionConflictInput = z.infer<typeof ResolveSubmissionConflictInputSchema>;

const ResolveSubmissionConflictOutputSchema = z.object({
  rejectionFeedback: z
    .string()
    .describe('Constructive and encouraging feedback for the author of the rejected proposal.'),
});
export type ResolveSubmissionConflictOutput = z.infer<typeof ResolveSubmissionConflictOutputSchema>;

export async function resolveSubmissionConflict(input: ResolveSubmissionConflictInput): Promise<ResolveSubmissionConflictOutput> {
  return resolveSubmissionConflictFlow(input);
}

const prompt = ai.definePrompt({
  name: 'resolveSubmissionConflictPrompt',
  input: {schema: ResolveSubmissionConflictInputSchema},
  output: {schema: ResolveSubmissionConflictOutputSchema},
  prompt: `You are an expert conference organizer, skilled at providing diplomatic and constructive feedback.

Two excellent proposals were submitted for the same agenda slot: "{{slotTitle}}".
You had to make a tough choice and select one. Now, you need to generate feedback for the author of the rejected proposal.

The goal is to be encouraging and explain the choice without being discouraging. Mention that it was a very competitive slot.

Winning Proposal Title: {{{winningProposal.title}}}
Winning Proposal Abstract: {{{winningProposal.abstract}}}

Rejected Proposal Title: {{{losingProposal.title}}}
Rejected Proposal Abstract: {{{losingProposal.abstract}}}

Generate a brief, constructive feedback message for the author of the rejected proposal. Explain that while their proposal was strong, the other was chosen for its slightly closer alignment with the specific focus of the session slot. Encourage them to submit again in the future.
`,
});

const resolveSubmissionConflictFlow = ai.defineFlow(
  {
    name: 'resolveSubmissionConflictFlow',
    inputSchema: ResolveSubmissionConflictInputSchema,
    outputSchema: ResolveSubmissionConflictOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
