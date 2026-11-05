import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { validateCategorySegment, validateTagName } from './lib/taxonomy-core';

const categoryName = z.string().superRefine((name, ctx) => {
  try { validateCategorySegment(name); } catch (error) { ctx.addIssue({ code: 'custom', message: String(error) }); }
});
const tagName = z.string().superRefine((name, ctx) => {
  try { validateTagName(name); } catch (error) { ctx.addIssue({ code: 'custom', message: String(error) }); }
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(), description: z.string(), date: z.coerce.date(),
    // A single ordered path works like Hexo: [CTF, Crypto] means CTF -> Crypto.
    // Multiple paths are possible with [[CTF, Crypto], [Notes, Security]].
    category: categoryName.optional(), // legacy posts
    categories: z.union([
      z.array(categoryName).min(1),
      z.array(z.array(categoryName).min(1)).min(1),
    ]).optional(),
    tags: z.array(tagName),
    minutes: z.number().positive(), demo: z.boolean().default(false), draft: z.boolean().default(false),
  }),
});
export const collections = { posts };
