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
  linkedin: { label: 'linkedin.com/in/leolamngn', href: 'https://www.linkedin.com/in/leolamngn' },
  portfolio: { label: 'leolamnguyen.netlify.app', href: 'https://leolamnguyen.netlify.app' },

  /** PDF summary, implied first person. */
  summary:
    "Product and growth specialist with three years of experience, most recently in AI agents, e-commerce, robotics and ride-hailing across the Vingroup ecosystem. Launched an AI sales agent on VinFast's Messenger sales page in six days, with price answers grounded in approved product files; after a manager review found gaps in its installment answers, fixed them within two days, taking complete answers from 0% on launch day to between 84% and 93% a day. Before that, led requirements for two use cases of an AI security robot at VinDynamics and built behavior-based rider journeys at Xanh SM.",

  /** About page intro, first person. Same facts as the summary. */
  intro: {
    lead: "Hi, I'm Leo, a product and growth specialist in Hanoi.",
    body:
      "I've spent three years in product and growth, most recently in AI agents, e-commerce, robotics and ride-hailing across the Vingroup ecosystem. At VinFast I launched an AI sales agent in six days, with price answers grounded in approved product files; after a manager review found gaps in its installment answers, I fixed them within two days, taking complete answers from 0% on launch day to between 84% and 93% a day. Before that I led requirements for two use cases of an AI security robot at VinDynamics and built behavior-based rider journeys at Xanh SM.",
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
        title: 'Product and Growth Specialist',
        dates: 'Sep 2026 to present',
        scope: "Vingroup's electric vehicle maker. Joined through the succession pool, on the O2O growth team.",
        topics: [
          { key: 'agent', label: 'AI sales agent', case: 'ai-sales-agent' },
          { key: 'pages', label: 'Car product pages', case: 'car-product-pages' },
          { key: 'zalo', label: 'Zalo showroom', case: 'zalo-showroom' },
          { key: 'data', label: 'Lead measurement', case: 'o2o-measurement' },
        ],
        lines: [
          {
            scope: true,
            text: 'Work on the product and data side of five online sales channels for cars and scooters: page requirements, tracking and analysis, and the AI sales agent, working with the team that runs the ad accounts.',
          },
          {
            topic: 'agent',
            text: "Launched an AI sales agent (Meta Business Agent) on VinFast's Messenger sales page in **six days**; price answers come only from approved product files, and uncertain cases go to sales.",
          },
          {
            topic: 'agent',
            text: 'Fixed installment answers within two days of launch, after a manager review found the gap: complete answers went from 0% on launch day to between **84% and 93%** a day (5 to 9 Nov).',
          },
          {
            topic: 'agent',
            text: 'Ran an error analysis of the first week on **2,000** real conversations and a 23-question regression test, turning failures such as battery-fee questions sent to the hotline into a fix list.',
          },
          {
            topic: 'pages',
            text: 'Diagnosed why car-page leads fell after a site redesign and specified new entry points; in the first month, **81%** of car-page leads started at them (a share, not a lift).',
          },
          {
            topic: 'pages',
            text: 'Won director approval for **17 fixes** to two online purchase pages, ranked into three rounds after arguing they should come before more ad spend, and for a car cost tool I prototyped.',
          },
          {
            topic: 'pages',
            web: true,
            text: 'Kept the deposit button in the car-page hero: in its first week, people who tapped it reached the payment step **4x** as often as mid-page tappers (5.1% against 1.3%), mostly returning visitors.',
          },
          {
            topic: 'zalo',
            text: 'Acted as business owner of a **29-model** showroom inside Zalo through legal review and acceptance testing, and separately chose a rule-based bot over AI for the Zalo Official Account, avoiding a new data-processing agreement.',
          },
          {
            topic: 'data',
            web: true,
            text: 'Wrote one event plan for every car and scooter product page and built a self-checking lead dashboard whose page-level totals add up to the web total (**99.97%** in a test run).',
          },
          {
            topic: 'data',
            web: true,
            text: 'Ran a deposit audit with AI agents, which found that about half (**46% to 49%**) of GA4 car deposits started on the homepage, against 10% on a product page.',
          },
        ],
      },
      {
        company: 'VinDynamics',
        logo: 'vindynamics',
        title: 'Product and Growth Specialist',
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
            text: 'Worked on product requirements for an AI security robot and on AI tools for the sales team, alongside B2B growth for robot training data across SEO, LinkedIn and Google Ads, and lead tracking.',
          },
          {
            topic: 'dyno',
            text: "Led requirements for two of Dyno's five priority use cases (parking violations, trash and flammable items): site research, BRDs and user stories, cutting **18 parking stories to the 6** that would change the build.",
          },
          {
            topic: 'tools',
            text: 'Built an AI research agent (n8n, Claude) that researched **52 prospects** in a two-week run; BD preferred writing their own messages, and the June review kept it for research context.',
          },
          {
            topic: 'tools',
            text: 'Built three more AI tools for the sales and brand teams, including a document fact-checker I rebuilt to use one model call instead of about 60.',
          },
          {
            topic: 'web',
            text: 'Specified a buyer-intent lead path for the website and independently set up a four-layer BigQuery warehouse that joined web, ad and lead data daily.',
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
                text: 'Analyzed rider funnels for product and UX proposals and managed rider lifecycle CRM in CleverTap by segment, province and service (bike, car, express, food), training colleagues on the tool.',
              },
              {
                text: "Proposed a user-based Journey Funnel Index, from install to completed trip, for the Growth CX team's KPIs, plus six app UX changes for the product team.",
              },
              {
                text: 'Traced where food orders stalled across **211,272** add-to-cart events and planned four fixes, starting with a free-delivery prompt.',
              },
              {
                text: "Turned down the idea of booking new riders' first trips on their behalf, since it would shift demand rather than create it, and wrote the messaging rules all journeys followed.",
              },
              {
                text: 'Designed 30+ behavior-triggered rider journeys by April 2026, tracked weekly by trips rather than clicks; riders took **1.7M trips** while in the 14 journeys for new and lapsed riders by September 2025 (CleverTap count, no holdout).',
              },
              {
                web: true,
                text: 'Set up three journeys for the Xanh SM team in the Philippines.',
              },
            ],
          },
          {
            title: 'Young Talent, Driver Supply and Brand',
            dates: 'Jul 2024 to Jul 2025',
            lines: [
              {
                scope: true,
                text: 'Ran driver recruitment marketing across seeding, landing pages, KOLs, referral and offline events, judged by cost per lead and lead-to-interview rate.',
              },
              {
                text: "Led seeding content in the shift to online recruitment for motorbike drivers; online marketing's share of new Bike drivers rose from 24% (April and May) to **53%** (June 2025), and cost per new driver fell 34%.",
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
          text: 'Surveyed **15** pen retailers in Hanoi and analyzed the results in SPSS to shape the 2024 pen line, working with the OEM team.',
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
      text: 'a personal knowledge base I built with Claude Code from 2,002 AI chats. Nightly agents keep it current, and it holds 75 skills I created or curated.',
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
