import { z } from "zod";

export const CategoryIconInputSchema = z.object({
  categoryName: z.string().describe("Category name used to design the icon."),
});
export type CategoryIconInput = z.infer<typeof CategoryIconInputSchema>;

export const CategoryIconOutputSchema = z.object({
  imageUrl: z.string().describe("Data URL of the generated icon image."),
});
export type CategoryIconOutput = z.infer<typeof CategoryIconOutputSchema>;

export function buildIconPrompt(categoryName: string) {
  return `A minimal, soft 3D clay-style icon representing "${categoryName}". 
Smooth rounded edges, soft textures, and playful proportions. 
High-quality cartoonish rendering, similar to a toy figurine. 
No text or labels. 
Single object focus in the center. 
Use a random best-fit single light pastel background color based on color theory to complement the icon’s palette. 
Icon colors can vary naturally while staying harmonious. 
Soft shadows, gentle gradients, modern UI/UX style.`;
}
