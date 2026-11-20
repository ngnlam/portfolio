// Work page data (docs: work-review.md, content.md §3, labels-and-headings.md).
// The case studies come from src/content/cases; this file holds the smaller
// projects and the side projects. Edit copy here; roles and tools are checked at build time.
import type { ImageMetadata } from 'astro';
import type { Role } from './tools';

export interface WorkImage { img: ImageMetadata; alt: string; caption: string; maxWidth: string }
export interface WorkRow {
  /** Anchor on /work, e.g. /work#cost-tool opens that row. */
  id: string;
  title: string;
  role: Role;
  company: 'VinFast' | 'VinDynamics' | 'Xanh SM' | 'Side project';
  year: string;
  problem: string;
  decided: string;
  outcome: string;
  tools: string[];
  images: WorkImage[];
  /** A recreated visual rendered by a component instead of an image. */
  visual: 'lead-engine' | null;
  links: { href: string; label: string }[];
}
export interface WorkGroup { id: string; name: string; rows: WorkRow[] }

export const WORK_GROUPS: WorkGroup[] = [];

export const SIDE_PROJECTS: { title: string; role: Role; line: string; href: string | null }[] = [
  {
    "title": "Chiêm Nghiệm",
    "role": "Product owner",
    "line": "A tử vi web app for working people stuck on a decision, live since 14 November.",
    "href": "/work/chiem-nghiem"
  },
  {
    "title": "Energy audit",
    "role": "Builder",
    "line": "A small tool to see which parts of your week give you energy.",
    "href": "/lab/energy-audit"
  },
  {
    "title": "This website",
    "role": "Builder",
    "line": "My brief, wireframes and copy rules, with Claude Code as the builder.",
    "href": null
  }
];
