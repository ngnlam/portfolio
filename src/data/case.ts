// Case page structure (labels-and-headings.md §4).
// Kickers are fixed; each case writes its own headline per section.
export const KICKERS = {
  problem: 'Problem',
  found: 'What I found',
  decisions: 'Decisions',
  shipped: 'What I shipped',
  results: 'Results',
  learned: 'What I learned',
} as const;

export type SectionId = keyof typeof KICKERS;

/** Side-nav order. "glance" and "role" are rendered by CaseLayout from frontmatter. */
export const CASE_TOC: { id: string; label: string }[] = [
  { id: 'glance', label: 'At a glance' },
  { id: 'problem', label: KICKERS.problem },
  { id: 'found', label: KICKERS.found },
  { id: 'decisions', label: KICKERS.decisions },
  { id: 'shipped', label: KICKERS.shipped },
  { id: 'results', label: KICKERS.results },
  { id: 'learned', label: KICKERS.learned },
  { id: 'role', label: 'Who did what' },
];

export const COMPANY_LOGO = {
  'VinFast': 'vinfast',
  'VinDynamics': 'vindynamics',
  'Xanh SM': 'xanhsm',
} as const;
