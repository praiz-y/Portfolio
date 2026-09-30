import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Case studies, not project cards. The schema is the enforcement mechanism —
 * it's what stops a project from regressing into "screenshot + link".
 *
 * Body section order is fixed by convention: Problem → Constraints → Decisions
 * → The Struggle → Limitations. It isn't schema-enforced (Astro can't validate
 * heading order), so it's checked by eye in review.
 *
 * Note: there's no separate `slug` field. With the glob loader the entry `id`
 * is the filename, and duplicating it as frontmatter only invites the two
 * drifting apart.
 *
 * `category` is a plain string, not the enum the decisions log originally
 * locked. That enum existed to drive the category pills, which are out of v1 —
 * so the constraint now buys nothing. Re-tighten it if pills come back.
 */
const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    category: z.string(),
    year: z.number(),
    role: z.string(),

    /** Path under /public. Optional — falls back to a CSS monogram tile. */
    coverImage: z.string().optional(),

    stack: z.array(z.string()).default([]),
    liveUrl: z.string().url().optional(),
    repoUrl: z.string().url().optional(),
    results: z
      .array(z.object({ label: z.string(), value: z.string() }))
      .default([]),

    featured: z.boolean().default(false),

    /** Flags unfinished entries so they're visible while drafting. */
    placeholder: z.boolean().default(false),

    order: z.number().default(99),
  }),
});

export const collections = { work };
