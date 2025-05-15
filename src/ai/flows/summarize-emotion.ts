// SummarizePredominantEmotion.ts
'use server';
/**
 * @fileOverview Summarizes the predominant emotion detected in an image.
 *
 * - summarizeEmotion - A function that summarizes the predominant emotion.
 * - SummarizeEmotionInput - The input type for the summarizeEmotion function.
 * - SummarizeEmotionOutput - The return type for the summarizeEmotion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeEmotionInputSchema = z.object({
  emotions: z.record(z.number()).describe('A record of emotions and their corresponding scores.'),
});
export type SummarizeEmotionInput = z.infer<typeof SummarizeEmotionInputSchema>;

const SummarizeEmotionOutputSchema = z.object({
  summary: z.string().describe('A short sentence describing the predominant emotion detected in the image.'),
});
export type SummarizeEmotionOutput = z.infer<typeof SummarizeEmotionOutputSchema>;

export async function summarizeEmotion(input: SummarizeEmotionInput): Promise<SummarizeEmotionOutput> {
  return summarizeEmotionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeEmotionPrompt',
  input: {schema: SummarizeEmotionInputSchema},
  output: {schema: SummarizeEmotionOutputSchema},
  prompt: `You are an AI that analyzes emotions and summarizes the predominant emotion detected in an image.

  Emotions and Scores: {{{emotions}}}

  Generate a concise sentence that describes the predominant emotion detected in the image.
  Example: "The image shows a high level of happiness and a hint of surprise."`,
});

const summarizeEmotionFlow = ai.defineFlow(
  {
    name: 'summarizeEmotionFlow',
    inputSchema: SummarizeEmotionInputSchema,
    outputSchema: SummarizeEmotionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
