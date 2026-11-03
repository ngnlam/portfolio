// Case studies live in src/content/cases/*.mdx (files starting with _ are ignored).
// The frontmatter schema below is the contract CaseLayout renders from.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { ROLES, STAGES, TOOLS } from './data/tools';

const toolName = z.string().refine((t) => t in TOOLS, {
  message: 'Unknown tool name. Use a name from src/data/tools.ts (labels-and-headings.md §2c).',
});

const cases = defineCollection({
  loader: glob({ pattern: '**/[^_]*.mdx', base: './src/content/cases' }),
  schema: ({ image }) =>
    z.object({
      /** H1 on the case page and the card title on Work. */
      title: z.string(),
      /** <title> tag and og:title (content.md §9). */
      seoTitle: z.string(),
      /** Meta description (content.md §9). */
      description: z.string(),
      /** Position on the Work page and in the next-case loop (1 = first). */
      order: z.number().int(),
      company: z.enum(['VinFast', 'VinDynamics', 'Xanh SM']),
      year: z.string(),
      role: z.enum(ROLES),
      team: z.string(),
      timeline: z.string(),
      status: z.string().optional(),
      /** Stages Leo led; the others render as outlined pills. */
      stages: z.array(z.enum(STAGES)).min(1),
      tools: z.array(toolName).max(4).default([]),
      tiles: z.array(z.object({ value: z.string(), label: z.string(), note: z.string().optional() })).length(3),
      glance: z.object({ problem: z.string(), did: z.string(), role: z.string() }),
      roles: z.object({ mine: z.string(), team: z.string() }),
      /** Slug (file name) of the next case. */
      next: z.string(),
      /** Card on Work and Home. */
      card: z
        .object({
          teaser: z.string(),
          result: z.string(),
          image: image().optional(),
          imageAlt: z.string().optional(),
        })
        .optional(),
      /** Path under /public, e.g. /og/zalo-showroom.png. Falls back to the default OG image. */
      ogImage: z.string().optional(),
      published: z.coerce.date().optional(),
    }),
});

export const collections = { cases };
