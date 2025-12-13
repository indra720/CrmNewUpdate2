'use server';

/**
 * @fileOverview This file defines a Genkit flow for automated lead scoring.
 *
 * - automatedLeadScoring - A function that handles the lead scoring process.
 * - AutomatedLeadScoringInput - The input type for the automatedLeadScoring function.
 * - AutomatedLeadScoringOutput - The return type for the automatedLeadScoring function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomatedLeadScoringInputSchema = z.object({
  engagementScore: z
    .number()
    .describe("The lead's engagement score, based on their interaction with our content."),
  demographics: z
    .string()
    .describe("The lead's demographic information, such as age, location, and industry."),
  otherFactors: z
    .string()
    .describe('Other factors to consider when scoring the lead.'),
});
export type AutomatedLeadScoringInput = z.infer<typeof AutomatedLeadScoringInputSchema>;

const AutomatedLeadScoringOutputSchema = z.object({
  leadScore: z.number().describe('The calculated lead score.'),
  priority: z.string().describe('The recommended priority for the lead.'),
  reason: z.string().describe('The reason for the given lead score and priority.'),
});
export type AutomatedLeadScoringOutput = z.infer<typeof AutomatedLeadScoringOutputSchema>;

export async function automatedLeadScoring(input: AutomatedLeadScoringInput): Promise<AutomatedLeadScoringOutput> {
  return automatedLeadScoringFlow(input);
}

const prompt = ai.definePrompt({
  name: 'automatedLeadScoringPrompt',
  input: {schema: AutomatedLeadScoringInputSchema},
  output: {schema: AutomatedLeadScoringOutputSchema},
  prompt: `You are an AI assistant that scores leads for a sales team.

  Based on the engagement score, demographics, and other factors, you will provide a lead score, a priority, and a reason for the score and priority.

  Engagement Score: {{{engagementScore}}}
  Demographics: {{{demographics}}}
  Other Factors: {{{otherFactors}}}

  Output a lead score, priority, and reason.
  `,
});

const automatedLeadScoringFlow = ai.defineFlow(
  {
    name: 'automatedLeadScoringFlow',
    inputSchema: AutomatedLeadScoringInputSchema,
    outputSchema: AutomatedLeadScoringOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
