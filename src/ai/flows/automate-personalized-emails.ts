'use server';

/**
 * @fileOverview Generates personalized emails for session acceptance or rejection.
 *
 * - generatePersonalizedEmail - A function that generates personalized emails.
 * - GeneratePersonalizedEmailInput - The input type for the generatePersonalizedEmail function.
 * - GeneratePersonalizedEmailOutput - The return type for the generatePersonalizedEmail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedEmailInputSchema = z.object({
  speakerName: z.string().describe('The name of the speaker.'),
  sessionTitle: z.string().describe('The title of the session.'),
  feedback: z.string().describe('Personalized feedback for the speaker.'),
  acceptanceStatus: z
    .enum(['accepted', 'rejected'])
    .describe('The acceptance status of the session.'),
});
export type GeneratePersonalizedEmailInput = z.infer<
  typeof GeneratePersonalizedEmailInputSchema
>;

const GeneratePersonalizedEmailOutputSchema = z.object({
  emailContent: z.string().describe('The generated email content.'),
});
export type GeneratePersonalizedEmailOutput = z.infer<
  typeof GeneratePersonalizedEmailOutputSchema
>;

export async function generatePersonalizedEmail(
  input: GeneratePersonalizedEmailInput
): Promise<GeneratePersonalizedEmailOutput> {
  return generatePersonalizedEmailFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedEmailPrompt',
  input: {schema: GeneratePersonalizedEmailInputSchema},
  output: {schema: GeneratePersonalizedEmailOutputSchema},
  prompt: `You are an AI assistant tasked with generating personalized emails for speakers regarding their session proposals.

  Based on the acceptance status, speaker name, session title, and feedback, create an email that informs the speaker of the decision and provides constructive feedback.

  Speaker Name: {{{speakerName}}}
  Session Title: {{{sessionTitle}}}
  Feedback: {{{feedback}}}
  Acceptance Status: {{{acceptanceStatus}}}

  Here's how you should format the email:

  If the session is accepted:
  Subject: Your Session "{{{sessionTitle}}}" has been Accepted!
  Body:
  Dear {{{speakerName}}},

  We are pleased to inform you that your session proposal, "{{{sessionTitle}}}", has been accepted for our event! We were particularly impressed with [mention specific strengths based on feedback]. We believe this session will offer great value to our attendees.

  [Add any logistical information or next steps for the speaker]

  Thank you for contributing to our event. We look forward to seeing you there!

  Sincerely,
  [Your Name/Event Organizing Team]

  If the session is rejected:
  Subject: Update on Your Session Proposal "{{{sessionTitle}}}"
  Body:
  Dear {{{speakerName}}},

  Thank you for your interest in speaking at our event. After careful consideration, we regret to inform you that your session proposal, "{{{sessionTitle}}}", was not selected this time. While your topic is valuable, [provide constructive feedback based on the feedback provided].

  We encourage you to submit proposals for future events. Thank you for your understanding.

  Sincerely,
  [Your Name/Event Organizing Team]

  Please generate the complete email content, including the subject and body.
  `,
});

const generatePersonalizedEmailFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedEmailFlow',
    inputSchema: GeneratePersonalizedEmailInputSchema,
    outputSchema: GeneratePersonalizedEmailOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
