
'use server';
/**
 * @fileOverview A Genkit flow for generating a category icon.
 *
 * - generateCategoryImage - A function that generates a 3D icon for a category.
 * - GenerateCategoryImageInput - The input type for the generateCategoryImage function.
 * - GenerateCategoryImageOutput - The return type for the generateCategoryImage function.
 */

import { ai } from '@/lib/genkit';
import { z } from 'genkit';

const defaultIconPrompt = `A minimal, soft 3D clay-style icon representing [CATEGORY NAME]. 
Smooth rounded edges, soft textures, and playful proportions. 
High-quality cartoonish rendering, similar to a toy figurine. 
No text or labels. 
Single object focus in the center. 
Use a random best-fit single light pastel background color based on color theory to complement the icon’s palette. 
Icon colors can vary naturally while staying harmonious. 
Soft shadows, gentle gradients, modern UI/UX style.`;

// Input Schema
const GenerateCategoryImageInputSchema = z.object({
  categoryName: z.string().describe('The name of the category to generate an icon for.'),
  prompt: z.string().optional().describe("An optional custom prompt to override the default icon style.")
});
export type GenerateCategoryImageInput = z.infer<typeof GenerateCategoryImageInputSchema>;

// Output Schema
const GenerateCategoryImageOutputSchema = z.object({
    imageDataUri: z.string().describe("The data URI of the generated category icon."),
});
export type GenerateCategoryImageOutput = z.infer<typeof GenerateCategoryImageOutputSchema>;


// Main exported function that the client will call
export async function generateCategoryImage(input: GenerateCategoryImageInput): Promise<GenerateCategoryImageOutput> {
  return generateCategoryImageFlow(input);
}

const generateCategoryImageFlow = ai.defineFlow(
  {
    name: 'generateCategoryImageFlow',
    inputSchema: GenerateCategoryImageInputSchema,
    outputSchema: GenerateCategoryImageOutputSchema,
  },
  async ({ categoryName, prompt }) => {
    
    const finalPrompt = (prompt || defaultIconPrompt).replace(/\[CATEGORY NAME\]/g, categoryName);

    const imageResponse = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: finalPrompt,
        config: { responseModalities: ['TEXT', 'IMAGE'] },
    });

    const imageDataUri = imageResponse.media?.url;
    if (!imageDataUri) {
        throw new Error('Failed to generate category image.');
    }

    return {
      imageDataUri,
    };
  }
);
