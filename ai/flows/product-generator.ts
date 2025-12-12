'use server';
/**
 * @fileOverview A Genkit flow for generating product content and images.
 * This flow uses Gemini for text content and image generation.
 */

import { ai } from '@/lib/genkit';
import {
  ProductContentInput,
  ProductContentInputSchema,
  ProductContentOutput,
  ProductContentOutputSchema,
} from '@/types/product';
import { z } from 'zod';

// Define the schema for the image prompt generation output
const ImagePromptsSchema = z.object({
  mainPrompt: z.string().describe('A detailed prompt for the main product showcase image.'),
  galleryPrompts: z.array(z.string()).length(4).describe('An array of 4 detailed prompts for gallery images.'),
});

// Define the prompt for generating marketing copy
const contentGenerationPrompt = ai.definePrompt({
  name: 'productContentPrompt',
  input: { schema: ProductContentInputSchema },
  output: { schema: ProductContentOutputSchema.omit({ imageUrl: true, galleryImages: true }) },
  prompt: `You are an expert copywriter and product manager for a digital marketplace. Based on the provided product title and short description, generate all the necessary content for the product page.

Product Title: {{{title}}}
Short Description: {{{description}}}

Provide a JSON response with the exact structure defined in the output schema.
The "longDesc" should be a detailed, engaging, and comprehensive description for the product page, several paragraphs long.
The "features" should be a list of 5-7 key benefits.
The "techSpecs" should list technical details like file formats and compatibility.
"whatsIncluded" should detail all items in the download package.
"howToUse" should be a brief guide.
"license" should be a standard commercial license text.
"tags" should be 5-10 relevant keywords.`,
});

// Define the prompt for generating image generation prompts
const imagePromptsGenerationPrompt = ai.definePrompt({
  name: 'productImagePromptsPrompt',
  input: { schema: ProductContentInputSchema },
  output: { schema: ImagePromptsSchema },
  prompt: `You are an expert at creating image generation prompts for digital products. Based on the product title and description, create 5 different detailed prompts (1 main + 4 gallery images) that showcase different aspects of the product as a professional UI mockup.

Product Title: {{{title}}}
Product Description: {{{description}}}

Each prompt should be detailed and professional, including style directions like 'professional UI mockup, clean, modern design, 8k, photorealistic, minimalist color scheme, soft shadows, clean typography'.

Generate prompts for:
1. Main showcase image - An overall presentation of the product.
2. Gallery image 1 - Focus on specific features or functionality.
3. Gallery image 2 - A close-up of the UI/design details.
4. Gallery image 3 - The product in a use-case or application scenario.
5. Gallery image 4 - A different angle or view of the product mockup.

Provide a JSON response with the exact structure defined in the output schema.`,
});

// Main exported flow
export async function generateProductContent(
  input: ProductContentInput
): Promise<ProductContentOutput> {
  return generateProductContentFlow(input);
}

// Define the main flow
const generateProductContentFlow = ai.defineFlow(
  {
    name: 'generateProductContentFlow',
    inputSchema: ProductContentInputSchema,
    outputSchema: ProductContentOutputSchema,
  },
  async (input) => {
    console.log('Starting AI content and image generation...');

    // Generate text content and image prompts in parallel
    const [contentResult, imagePromptsResult] = await Promise.all([
      contentGenerationPrompt(input),
      imagePromptsGenerationPrompt(input),
    ]);

    const content = contentResult.output;
    const imagePrompts = imagePromptsResult.output;

    if (!content || !imagePrompts) {
      throw new Error('Failed to generate initial content or image prompts.');
    }

    console.log('Generating main and gallery images...');

    // Generate all images in parallel
    const allPrompts = [imagePrompts.mainPrompt, ...imagePrompts.galleryPrompts];
    const imageGenerationPromises = allPrompts.map((promptText) =>
      ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: promptText,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      })
    );

    const imageResults = await Promise.all(imageGenerationPromises);
    const imageUrls = imageResults.map(result => {
        if (!result.media?.url) {
            throw new Error('Image generation failed for one or more images.');
        }
        return result.media.url;
    });

    if (!content) {
      throw new Error('Content generation failed.');
    }

    return {
      ...content,
      imageUrl: imageUrls[0],
      galleryImages: imageUrls.slice(1),
    };
  }
);
