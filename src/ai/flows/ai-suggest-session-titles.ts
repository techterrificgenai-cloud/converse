'use server';
/**
 * @fileOverview Provides AI-suggested alternative titles for a session proposal.
 *
 * - suggestSessionTitles - A function that generates alternative session titles.
 * - SuggestSessionTitlesInput - The input type for the suggestSessionTitles function.
 * - SuggestSessionTitlesOutput - The return type for the suggestSessionTitles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSessionTitlesInputSchema = z.object({
  title: z.string().describe('The original title of the session proposal.'),
  abstract: z.string().describe('The abstract or description of the session proposal.'),
});
export type SuggestSessionTitlesInput = z.infer<typeof SuggestSessionTitlesInputSchema>;

const SuggestSessionTitlesOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of suggested alternative titles for the session.'),
});
export type SuggestSessionTitlesOutput = z.infer<typeof SuggestSessionTitlesOutputSchema>;

export async function suggestSessionTitles(input: SuggestSessionTitlesInput): Promise<SuggestSessionTitlesOutput> {
  return suggestSessionTitlesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSessionTitlesPrompt',
  input: {schema: SuggestSessionTitlesInputSchema},
  output: {schema: SuggestSessionTitlesOutputSchema},
  prompt: `You are an expert at crafting engaging and relevant session titles for conferences. Given the original title and abstract of a session proposal, generate three alternative titles that are likely to increase audience engagement.

Original Title: {{{title}}}
Abstract: {{{abstract}}}

Suggestions:`,
});

const suggestSessionTitlesFlow = ai.defineFlow(
  {
    name: 'suggestSessionTitlesFlow',
    inputSchema: SuggestSessionTitlesInputSchema,
    outputSchema: SuggestSessionTitlesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      suggestions: output?.suggestions || [],
    };
  }
);
