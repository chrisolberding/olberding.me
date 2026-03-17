import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogSchema = ({ image }: { image: Function }) => z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  author: z.string().optional(),
  date: z.coerce.date(),
  description: z.string().optional(),
  draft: z.boolean().optional(),
  cardImage: image().optional(),
  cardImageHeight: z.number().optional(),
  cardImagePosition: z.string().optional(),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: blogSchema,
});

const personal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/personal' }),
  schema: blogSchema,
});

export const collections = { blog, personal };
