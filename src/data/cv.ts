// The CV in one place. The About page and the printable /cv page (which becomes the PDF) both read
// from here, so a fact changed here changes in both.
//
// Writing rules for this file:
// - Lines use implied first person ("Launched ...") and stay within two printed lines (about 15 to 37 words).
// - Text between **double asterisks** is set in bold. At most one bold number per line.
// - `web: true` lines show on the About page only, never in the PDF.
// - Each job or role opens with one `scope: true` line: what Leo runs day to day (channels, products, scale).
//   Most real PM CVs open a role this way (24 of 44 roles measured, 2026-11-21); the rest are project lines.
//   The PDF prints it as the first bullet; the About page shows it as a lead sentence.
// - `topic` groups lines under a small heading with a case link on the About page. The PDF ignores topics
//   and keeps the order of the array, so put web-only lines next to the lines they belong with.
// - After changing anything here, re-render the PDF: see "Commands" in CLAUDE.md.
import type { LogoKey } from './logos';

export const CV_PDF = '/leo-lam-nguyen-cv.pdf';

export interface CvLine {
  text: string;
  web?: true;
  scope?: true;
  topic?: string;
}

export interface CvTopic {
  key: string;
  label: string;
  /** Case slug under /work. */
  case: string;
}

export interface CvRole {
  title: string;
  dates: string;
  lines: CvLine[];
}

export interface CvJob {
  company: string;
  logo?: LogoKey;
  title?: string;
  dates: string;
  scope?: string;
  lines?: CvLine[];
  roles?: CvRole[];
  topics?: CvTopic[];
  /** Case links for jobs without topics. */
  cases?: { slug: string; label: string }[];
}

export const CV = {
  name: 'Leo Lam Nguyen',
  headline: 'Product and growth across AI agents and e-commerce | Vingroup: VinFast, VinDynamics, Xanh SM',
  location: 'Hanoi, Vietnam',
  email: 'lamnguyen.ptpl@gmail.com',
  linkedin: { label: 'linkedin.com/in/ngnlam', href: 'https://www.linkedin.com/in/ngnlam' },
  portfolio: { label: 'leolamnguyen.netlify.app', href: 'https://leolamnguyen.netlify.app' },

  /** PDF summary, implied first person. */
  summary:
    "Growth and product specialist with three years of experience, most recently in e-commerce, ride-hailing and robotics across the Vingroup ecosystem. Launched an AI sales agent on VinFast's Messenger sales page in six days, then fixed its weakest answers within two days, raising the share of complete installment answers from 0% to 84%+. Before that, wrote the requirements for an AI security robot at VinDynamics and built behavior-based rider journeys at Xanh SM.",

  /** About page intro, first person. Same facts as the summary. */
  intro: {
    lead: "Hi, I'm Leo, a growth and product specialist in Hanoi.",
    body:
      "I've spent three years in growth and product, most recently in e-commerce, ride-hailing and robotics across the Vingroup ecosystem. At VinFast I launched an AI sales agent in six days and fixed its weakest answers within two days, raising the share of complete installment answers from 0% to 84%+. Before that I wrote the requirements for an AI security robot at VinDynamics and built behavior-based rider journeys at Xanh SM.",
  },

  group: {
    label: 'Vingroup ecosystem',
    members: 'VinFast, VinDynamics, Xanh SM',
    place: 'Hanoi',
    dates: 'Jul 2024 to present',
    jobs: [
      {
        company: 'VinFast',
        logo: 'vinfast',
        title: 'Growth and Product Specialist',
        dates: 'Sep 2026 to present',
        scope: "Vingroup's electric vehicle maker. On the O2O growth team.",
        topics: [
          { key: 'agent', label: 'AI sales agent', case: 'ai-sales-agent' },
          { key: 'pages', label: 'Car product pages', case: 'car-product-pages' },
          { key: 'zalo', label: 'Zalo showroom', case: 'zalo-showroom' },
          { key: 'data', label: 'Lead measurement', case: 'o2o-measurement' },
        ],
        lines: [
          {
            scope: true,
            text: 'Own e-commerce and performance marketing for cars and scooters across five online sales channels: the website, two Vingroup apps, Shopee and an affiliate program.',
          },
          {
            topic: 'agent',
            text: "Launched an AI sales agent on VinFast's Messenger sales page in **six days**, grounding its price answers in approved product files and handing uncertain cases to the sales team.",
          },
          {
            topic: 'agent',
            text: "Fixed the agent's installment answers within two days of launch, lifting the daily share of complete answers from **0% to 84%+**, then set up an error analysis of the first week and a regression test.",
          },
          {
            topic: 'pages',
            text: 'Specified new entry points for the car product pages after a site redesign cut leads; in the first month, **81%** of car-page leads came through the mid-page form and sticky bar.',
          },
          {
            topic: 'pages',
            text: 'Won director approval to fix two online purchase pages before buying more traffic, with **17 changes** ranked into three rounds, and for a car cost tool I prototyped.',
          },
          {
            topic: 'pages',
            web: true,
            text: 'Kept a single deposit button in the car-page hero; people who tapped it reached payment **4x** as often as those who tapped the mid-page button (5.1% against 1.3%).',
          },
          {
            topic: 'zalo',
            text: 'As the business owner, took a **29-model** showroom inside Zalo through legal review and acceptance testing, and chose a rule-based Zalo bot over AI to avoid a new data-processing agreement.',
          },
          {
            topic: 'data',
            web: true,
            text: 'Wrote one event plan for every car and scooter product page and built a self-checking lead dashboard that matches the web total at **99.97%**.',
          },
          {
            topic: 'data',
            web: true,
            text: 'Ran a deposit audit with AI agents, which found that **49%** of car-deposit sessions start on the homepage and only 10% on a product page.',
          },
        ],
      },
      {
        company: 'VinDynamics',
        logo: 'vindynamics',
        title: 'Growth and Product Specialist',
        dates: 'Apr 2026 to Sep 2026',
        scope: "Vingroup's humanoid robotics company, which also sells robot training data to AI labs.",
        topics: [
          { key: 'dyno', label: 'Robot requirements', case: 'dyno-requirements' },
          { key: 'tools', label: 'AI tools for sales', case: 'bd-research-agent' },
          { key: 'web', label: 'Website leads and data', case: 'b2b-website-leads' },
        ],
        lines: [
          {
            scope: true,
            text: 'Ran B2B growth for robot training data and robotics across SEO, LinkedIn and Google Ads, email automation and CRM, then moved into product requirements.',
          },
          {
            topic: 'dyno',
            text: 'Wrote the requirements for Dyno, an AI security robot, for its parking-lot use case, based on field research at the client site, cutting **18 user stories to the 6** that would change the build.',
          },
          {
            topic: 'tools',
            text: 'Built an AI research agent (n8n, Claude) that ranked prospects using data from 20+ live sources and drafted outreach for the sales team to send; it researched **52 prospects** in a two-week run.',
          },
          {
            topic: 'tools',
            text: 'Built three more AI tools for the sales and brand teams, including a document fact-checker I rebuilt to use one model call instead of about 60.',
          },
          {
            topic: 'web',
            text: 'Specified a buyer-intent lead path for the website and independently set up a four-layer BigQuery warehouse that joined web, ad and lead data daily.',
          },
          {
            topic: 'web',
            web: true,
            text: 'My manager rated the warehouse, tracking and lead automation **5/5** at the mid-year review.',
          },
        ],
      },
      {
        company: 'Xanh SM',
        logo: 'xanhsm',
        dates: 'Jul 2024 to Apr 2026',
        scope:
          "Vietnam's electric ride-hailing app, founded by Vingroup's chairman. Joined through the Young Talent program and was named Advanced Employee of the Year 2025.",
        cases: [{ slug: 'xanh-sm-rider-journeys', label: 'Rider journeys and driver recruitment' }],
        roles: [
          {
            title: 'Growth Specialist (Retention)',
            dates: 'Jul 2025 to Apr 2026',
            lines: [
              {
                scope: true,
                text: 'Managed rider lifecycle CRM in CleverTap by segment, province and service (bike, car, express, food), and trained colleagues on the tool.',
              },
              {
                text: 'Designed 30+ behavior-triggered rider journeys in CleverTap, measured weekly by trips rather than clicks; riders in the 14 journeys for new and lapsed riders took **1.7M trips** by September 2025.',
              },
              {
                text: "Turned down the idea of booking new riders' first trips on their behalf, since it would shift demand rather than create it, and wrote the messaging rules all journeys followed.",
              },
              {
                text: "Proposed a user-based Journey Funnel Index, from install to completed trip, for the Growth CX team's KPIs, plus six app UX changes for the product team.",
              },
              {
                text: 'Traced where food orders stalled across **211,272** add-to-cart events and planned four fixes, starting with a free-delivery prompt.',
              },
              {
                web: true,
                text: 'Set up three journeys for the Xanh SM team in the Philippines.',
              },
            ],
          },
          {
            title: 'Young Talent program: rider marketing, then driver supply',
            dates: 'Jul 2024 to Jul 2025',
            lines: [
              {
                scope: true,
                text: 'Planned and ran multichannel driver recruitment campaigns across seeding, landing pages, KOLs and offline events.',
              },
              {
                text: 'Led the organic side of the move to online recruitment for motorbike drivers; in June 2025 the share of new drivers recruited online rose from **24% to 53%** and cost per new driver fell 35%.',
              },
              { text: 'Ran the Nữ Tài Xanh campaign for women drivers, from planning through the content brief.' },
            ],
          },
        ],
      },
    ] as CvJob[],
  },

  jobs: [
    {
      company: 'Hong Ha Stationery',
      logo: 'hongha',
      title: 'Market Research Specialist (New Product Development)',
      dates: 'Oct 2023 to Feb 2024',
      lines: [
        {
          text: 'Surveyed **15** pen retailers in Hanoi with store checks and customer interviews, then analyzed the results in SPSS to shape the 2024 pen line.',
        },
        {
          text: 'Developed the concept, name and go-to-market plan for a mid-range gel pen, including support for dealers with slow-moving stock.',
        },
      ],
    },
  ] as CvJob[],

  earlier: [
    { company: 'VinFast', logo: 'vinfast', text: 'Marketing Intern, digital campaigns for electric scooters', dates: 'May to Sep 2023' },
    { company: 'Upwork', logo: 'upwork', text: 'freelance copywriting and strategic planning', dates: 'part-time, 2021 to 2024' },
    { company: 'FPT Securities', logo: 'fpts', text: 'Intern', dates: '2021 to 2022' },
  ] as { company: string; logo: LogoKey; text: string; dates: string }[],

  products: [
    {
      name: 'Chiêm Nghiệm',
      logo: 'chiemnghiem' as LogoKey,
      text: "an astrology web app I took from discovery to launch in seven days. Readings run on 1,700+ written rules instead of AI, so each visit is free and birth data stays on the user's phone.",
      web: 'Before launch, the chart engine matched the original on all 20,000 test birth dates.',
      case: 'chiem-nghiem',
    },
    {
      name: 'AI work system',
      text: 'a personal knowledge base I built with Claude Code from 2,002 AI chats. Nightly agents keep it current, and it holds 75 reusable skills.',
      case: 'ai-work-system',
    },
  ],

  /** Written as they read in the PDF; the About page capitalizes the first letter (except n8n). */
  skills: [
    {
      group: 'Product',
      items: ['field research and interviews', 'BRDs and PRDs', 'user stories and acceptance criteria', 'prioritization and phasing', 'UAT'],
    },
    {
      group: 'AI products',
      items: ['LLM agents with grounding and human handoff', 'error analysis and regression tests', 'n8n', 'Claude Code'],
    },
    {
      group: 'Growth',
      items: ['funnels and entry points', 'lifecycle journeys (CleverTap)', 'A/B testing', 'marketplace supply'],
    },
    {
      group: 'Data',
      items: ['SQL', 'BigQuery', 'GA4', 'Google Tag Manager', 'Looker Studio', 'tracking plans'],
    },
  ],
  languages: 'Vietnamese (native), English (professional working proficiency)',

  education: [
    {
      mark: 'LJMU',
      logo: '/logos/edu/ljmu.png',
      what: 'MSc Data Science (in progress)',
      where: 'Liverpool John Moores University with IIIT Bangalore, online via upGrad',
      dates: '2026 to 2028',
      web: 'Executive Diploma in Data Science and AI from IIIT Bangalore (12 months), then the MSc from LJMU (6 months).',
    },
    {
      mark: 'UWE',
      logo: '/logos/edu/uwe.svg',
      what: 'BA (Hons) International Business Management, 2:1',
      where: 'University of the West of England, Bristol, delivered with National Economics University, Hanoi',
      dates: '2023',
    },
  ] as { mark: string; logo: string; what: string; where: string; dates: string; web?: string }[],

  programs: [
    { mark: 'DUKE', logo: '/logos/edu/duke.svg', what: 'AI Product Management Specialization', where: 'Duke University', dates: '2026' },
    {
      mark: 'UVA',
      logo: '/logos/edu/uva-darden.svg',
      what: 'Digital Product Management Specialization',
      where: 'University of Virginia, Darden School of Business',
      dates: '2026',
    },
    {
      mark: 'SU',
      logo: '/logos/edu/stanford.svg',
      what: 'From Product Strategy to Product Leadership Specialization',
      where: 'Stanford Online',
      dates: '2026',
    },
    { mark: 'TM', logo: '/logos/edu/tomorrow-marketers.png', what: 'Professional Data Analyst Program', where: 'Tomorrow Marketers', dates: '2026' },
  ],

  /** About page only. */
  awards: [
    { what: 'Advanced Employee of the Year', where: 'Xanh SM', year: '2025' },
    { what: 'Top 3 Best Teams', where: 'Z Marketer Competition', year: '2023' },
    { what: 'Finalist', where: 'Circular Economy Startup Competition, FTU', year: '2022' },
    { what: 'Top 5 Teams', where: 'BUV Social Innovators Hackathon Challenge', year: '2021' },
  ],
};

/** Splits "a **b** c" into parts so a template can bold the starred ones. */
export function boldParts(text: string): { t: string; b: boolean }[] {
  return text
    .split('**')
    .map((t, i) => ({ t, b: i % 2 === 1 }))
    .filter((p) => p.t.length > 0);
}

/** Capitalizes a skill for a chip, leaving names such as n8n alone. */
export const chipCase = (s: string) => (s === 'n8n' ? s : s.charAt(0).toUpperCase() + s.slice(1));

/** Lines that belong in the PDF. */
export const pdfLines = (lines: CvLine[] = []) => lines.filter((l) => !l.web);
