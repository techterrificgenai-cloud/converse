'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing AI-assisted feedback on session proposals.
 *
 * It includes the following:
 * - `aiSuggestProposalFeedback`: An async function that takes a session proposal as input and returns AI-generated scores and feedback.
 * - `AISuggestProposalFeedbackInput`: The input type for the `aiSuggestProposalFeedback` function.
 * - `AISuggestProposalFeedbackOutput`: The output type for the `aiSuggestProposalFeedback` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AISuggestProposalFeedbackInputSchema = z.object({
  title: z.string().describe('The title of the session proposal.'),
  abstract: z.string().describe('A detailed abstract of the session proposal.'),
  category: z.string().describe('The category of the session (e.g., technology, marketing, design).'),
  track: z.string().describe('The specific track or theme of the session (e.g., AI, cloud, mobile).'),
});

export type AISuggestProposalFeedbackInput = z.infer<
  typeof AISuggestProposalFeedbackInputSchema
>;

const AISuggestProposalFeedbackOutputSchema = z.object({
  relevanceScore: z
    .number()
    .min(0)
    .max(10)
    .describe('A score (0-10) indicating the relevance of the proposal to the event.'),
  clarityScore: z
    .number()
    .min(0)
    .max(10)
    .describe('A score (0-10) indicating the clarity and understandability of the proposal.'),
  technicalDepthScore: z
    .number()
    .min(0)
    .max(10)
    .describe('A score (0-10) indicating the technical depth and expertise demonstrated in the proposal.'),
  feedback: z
    .string()
    .describe('Constructive feedback and suggestions for improving the session proposal.'),
});

export type AISuggestProposalFeedbackOutput = z.infer<
  typeof AISuggestProposalFeedbackOutputSchema
>;

export async function aiSuggestProposalFeedback(
  input: AISuggestProposalFeedbackInput
): Promise<AISuggestProposalFeedbackOutput> {
  return aiSuggestProposalFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSuggestProposalFeedbackPrompt',
  input: {schema: AISuggestProposalFeedbackInputSchema},
  output: {schema: AISuggestProposalFeedbackOutputSchema},
  prompt: `You are an AI assistant that provides scores and constructive feedback on session proposals for a tech conference.

  Evaluate the proposal based on the following criteria:
  - Relevance: How well the proposal aligns with the conference themes and target audience.
  - Clarity: How clear, concise, and understandable the proposal is.
  - Technical Depth: The level of technical expertise and innovation demonstrated in the proposal.

  Provide scores (0-10) for each criterion and offer specific, actionable feedback for improvement.

  Session Title: {{{title}}}
  Session Abstract: {{{abstract}}}
  Category: {{{category}}}
  Track: {{{track}}}

  Scores:
  - Relevance Score: {{relevanceScore}}
  - Clarity Score: {{clarityScore}}
  - Technical Depth Score: {{technicalDepthScore}}

  Feedback: {{feedback}}`,
});

const aiSuggestProposalFeedbackFlow = ai.defineFlow(
  {
    name: 'aiSuggestProposalFeedbackFlow',
    inputSchema: AISuggestProposalFeedbackInputSchema,
    outputSchema: AISuggestProposalFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
