import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    author: z.string().optional(),
    date: z.coerce.date(),
    description: z.string().optional(),
    draft: z.boolean().optional(),
    cardImage: image().optional(),
  }),
});

export const collections = { blog };
