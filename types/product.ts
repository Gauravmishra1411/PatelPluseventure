// types/product.ts
// Create this new file to hold the types and schemas

import { z } from 'zod';

export const ProductContentInputSchema = z.object({
  title: z.string().describe('The title of the product.'),
  description: z.string().describe('A short description of the product.'),
});

export type ProductContentInput = z.infer<typeof ProductContentInputSchema>;

export const ProductContentOutputSchema = z.object({
    longDesc: z.string().describe("A detailed, engaging, and comprehensive description for the product page. Should be several paragraphs long."),
    features: z.array(z.string()).describe("A list of key features of the product."),
    techSpecs: z.array(z.string()).describe("A list of technical specifications (e.g., 'File Format: PNG', 'Compatibility: Figma')."),
    whatsIncluded: z.array(z.string()).describe("A list of items included in the product download."),
    howToUse: z.string().describe("A brief guide on how to use or install the product."),
    license: z.string().describe("A standard commercial license text for digital products."),
    tags: z.array(z.string()).describe("A list of 5-10 relevant keywords or tags for search purposes."),
    imageUrl: z.string().describe("The data URI of the main product image."),
    galleryImages: z.array(z.string()).describe("Array of data URIs for gallery images (4 images)."),
});

export type ProductContentOutput = z.infer<typeof ProductContentOutputSchema>;