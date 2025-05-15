// src/ai/flows/detect-emotions.ts
'use server';

/**
 * @fileOverview Analyzes an image to detect the emotions present and their likelihood scores.
 *
 * - detectEmotions - A function that takes an image data URI as input and returns an analysis of the emotions present in the image.
 * - DetectEmotionsInput - The input type for the detectEmotions function.
 * - DetectEmotionsOutput - The return type for the detectEmotions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectEmotionsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectEmotionsInput = z.infer<typeof DetectEmotionsInputSchema>;

const DetectEmotionsOutputSchema = z.object({
  emotions: z.object({
    happiness: z.number().describe('Likelihood score for happiness.'),
    sadness: z.number().describe('Likelihood score for sadness.'),
    anger: z.number().describe('Likelihood score for anger.'),
    surprise: z.number().describe('Likelihood score for surprise.'),
    fear: z.number().describe('Likelihood score for fear.'),
    neutral: z.number().describe('Likelihood score for neutral.'),
  }).describe('Likelihood scores for different emotions.'),
  summary: z.string().describe('A short sentence describing the predominant emotion detected in the image.'),
});
export type DetectEmotionsOutput = z.infer<typeof DetectEmotionsOutputSchema>;

export async function detectEmotions(input: DetectEmotionsInput): Promise<DetectEmotionsOutput> {
  return detectEmotionsFlow(input);
}

const detectEmotionsPrompt = ai.definePrompt({
  name: 'detectEmotionsPrompt',
  input: {schema: DetectEmotionsInputSchema},
  output: {schema: DetectEmotionsOutputSchema},
  prompt: `You are an AI emotion detector. Analyze the emotions present in the image of the face provided, and provide a likelihood score (between 0 and 1) for each of the following emotions: happiness, sadness, anger, surprise, fear, and neutral.

  Also, write a short sentence describing the predominant emotion detected in the image.

  Image: {{media url=photoDataUri}}`,
});

const detectEmotionsFlow = ai.defineFlow(
  {
    name: 'detectEmotionsFlow',
    inputSchema: DetectEmotionsInputSchema,
    outputSchema: DetectEmotionsOutputSchema,
  },
  async input => {
    const {output} = await detectEmotionsPrompt(input);
    return output!;
  }
);
