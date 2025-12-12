
'use server';
/**
 * @fileOverview A Genkit flow for generating hero banner content and images.
 */

import { ai } from '@/lib/genkit';
import { z } from 'zod';

// Input Schema
const GenerateHeroBannerInputSchema = z.object({
  description: z.string().describe('A short description of the product or offer for the banner.'),
});
export type GenerateHeroBannerInput = z.infer<typeof GenerateHeroBannerInputSchema>;

// Output Schema
const GenerateHeroBannerOutputSchema = z.object({
    title: z.string().describe("A catchy, short title for the banner."),
    subtitle: z.string().describe("An engaging one-sentence subtitle for the banner."),
    imageUrl: z.string().describe("The data URI of the generated banner image."),
});
export type GenerateHeroBannerOutput = z.infer<typeof GenerateHeroBannerOutputSchema>;

// Define the prompt for generating marketing copy
const contentGenerationPrompt = ai.definePrompt({
  name: 'heroBannerContentPrompt',
  input: { schema: GenerateHeroBannerInputSchema },
  output: { schema: GenerateHeroBannerOutputSchema.omit({ imageUrl: true }) },
  prompt: `You are an expert copywriter. Based on the provided product description, generate a catchy title and an engaging one-sentence subtitle for a promotional hero banner.

Product Description: {{{description}}}

Provide a JSON response with the exact structure defined in the output schema.
The title should be short and attention-grabbing.
The subtitle should be a concise and compelling call to action or summary.`,
});


// Main exported function that the client will call
export async function generateHeroBanner(input: GenerateHeroBannerInput): Promise<GenerateHeroBannerOutput> {
  return generateHeroBannerFlow(input);
}

const generateHeroBannerFlow = ai.defineFlow(
  {
    name: 'generateHeroBannerFlow',
    inputSchema: GenerateHeroBannerInputSchema,
    outputSchema: GenerateHeroBannerOutputSchema,
  },
  async ({ description }) => {
    
    const [contentResult, imageResult] = await Promise.all([
        contentGenerationPrompt({ description }),
        ai.generate({
            model: 'googleai/gemini-2.0-flash-preview-image-generation',
            prompt: `Create a luxury digital product promotional banner in 1200×600 size, designed with a modern, high-end aesthetic.

Layout: Divide the banner into two sections.

Left Side (70%) → elegant gradient background with smooth transitions (e.g., deep navy → dark slate blue, charcoal grey → soft black, dark teal → muted cyan, burgundy → deep wine red, royal purple → midnight violet, emerald green → dark forest green). Each gradient should stay smooth, elegant, and premium — not flat, not neon. Add soft depth, light flares, and glossy reflections for a futuristic premium effect. Keep it minimal, clean, and elegant. Do not include any text, titles, or icons.

Right Side (30%) → realistic 3D product mockup placed with natural shadows and lighting. The product mockup should represent '${description}'. The device type should vary randomly: sometimes a laptop (angled slightly for depth, showing glowing screen with UI), sometimes a tablet (sleek design, metallic finish), sometimes a smartphone (bezel-less, modern style), or a combination (max 2 devices). The screen should show a stylized digital product interface/UI preview (like a dashboard, SaaS, or website) but in a blurred / abstracted style so it looks premium without revealing exact text.

Style & Quality:

Ultra-realistic 3D rendering.

Cinematic lighting with smooth reflections.

High contrast, professional look.

Futuristic tech-inspired details (subtle glow, gradients, reflections).

Luxurious, minimal, polished finish.

Do not include any text, titles, or labels inside the banner.`,
            config: { responseModalities: ['TEXT', 'IMAGE'] },
        })
    ]);
    
    const content = contentResult.output;
    const imageUrl = imageResult.media?.url;

    if (!content || !imageUrl) {
        throw new Error('Failed to generate banner content or image.');
    }

    return {
      ...content,
      imageUrl,
    };
  }
);
