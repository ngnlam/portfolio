// Controlled vocabulary for tool chips (docs: labels-and-headings.md §2c).
// Only these names may appear in a Tools row. Anything else fails the build,
// so the list stays consistent across pages.
import type { IconName } from './icons';

const RAW = import.meta.glob('../assets/tools/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function logo(file: string): string {
  const svg = RAW[`../assets/tools/${file}.svg`];
  if (!svg) throw new Error(`Missing tool logo: ${file}.svg`);
  return svg
    .replace(/<title>.*?<\/title>/s, '')
    .replace('<svg ', '<svg aria-hidden="true" focusable="false" width="16" height="16" ');
}

type Tool = { logo?: string; icon?: IconName };

export const TOOLS: Record<string, Tool> = {
  'Figma': { logo: logo('figma') },
  'GA4': { logo: logo('googleanalytics') },
  'Google Tag Manager': { logo: logo('googletagmanager') },
  'Google Ads': { logo: logo('googleads') },
  'Meta Ads': { logo: logo('meta') },
  'Search Console': { logo: logo('googlesearchconsole') },
  'BigQuery': { logo: logo('googlebigquery') },
  'Dataform': { icon: 'dataform' },
  'Looker Studio': { icon: 'measure' },
  'CleverTap': { icon: 'bell' },
  'n8n': { logo: logo('n8n') },
  'Power Automate': { icon: 'flow' },
  'Microsoft Teams': { icon: 'chat' },
  'Claude': { logo: logo('claude') },
  'Hunter': { icon: 'mail' },
  'Excel': { icon: 'table' },
  'Salesforce': { icon: 'cloud' },
  'Zalo': { logo: logo('zalo') },
  'Messenger': { logo: logo('messenger') },
  'Windsor.ai': { icon: 'plug' },
};

export type ToolName = keyof typeof TOOLS;

export function getTool(name: string): Tool {
  const tool = TOOLS[name];
  if (!tool) {
    throw new Error(
      `Unknown tool "${name}". Use one of: ${Object.keys(TOOLS).join(', ')} (labels-and-headings.md §2c).`,
    );
  }
  return tool;
}

/** Role chips: exactly one per project, from these four words (§2a). */
export const ROLES = ['Product owner', 'Requirements lead', 'Builder', 'Analyst'] as const;
export type Role = (typeof ROLES)[number];

/** The five stages shown on every case page. */
export const STAGES = ['Discover', 'Define', 'Decide', 'Ship', 'Measure'] as const;
export type Stage = (typeof STAGES)[number];
