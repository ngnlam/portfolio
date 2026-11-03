// Work page data (docs: work-review.md, content.md §3, labels-and-headings.md).
// The four case studies come from src/content/cases; this file holds the twelve smaller
// projects and the side projects. Edit copy here; roles and tools are checked at build time.
import type { ImageMetadata } from 'astro';
import type { Role } from './tools';
import bankPages from '../assets/images/work/bank-pages.jpg';
import firstTrips from '../assets/images/work/first-trips-journey.png';
import dataform from '../assets/images/work/dataform-graph.jpg';
import o2o from '../assets/images/work/o2o-dashboard.png';

export interface WorkImage { img: ImageMetadata; alt: string; caption: string; maxWidth: string }
export interface WorkRow {
  /** Anchor on /work, e.g. /work#cost-tool opens that row. */
  id: string;
  title: string;
  role: Role;
  company: 'VinFast' | 'VinDynamics' | 'Xanh SM';
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

export const WORK_GROUPS: WorkGroup[] = [
  {
    "id": "new-products",
    "name": "New products and tools",
    "rows": [
      {
        "id": "bank-offer-pages",
        "title": "Staff offer pages for two partner banks, from idea to launch",
        "role": "Product owner",
        "company": "VinFast",
        "year": "2026",
        "problem": "VinFast had car offers for the staff of two partner banks, and those leads would have mixed in with every other web lead.",
        "decided": "I owned the pages end to end. I designed both in Figma for desktop and mobile and gave each bank its own UTM rules and CRM topic, so sales could see these leads on their own. My first design came back as not premium enough, so I studied offer pages from premium car brands and reworked it. I tested every form and tag, then deployed.",
        "outcome": "Both pages went live at the end of October, and leads arrived labeled by bank from the first day.",
        "tools": [
          "Figma",
          "GA4",
          "Google Tag Manager"
        ],
        "images": [
          {
            "img": bankPages,
            "alt": "The VinFast staff offer pages for LPBank and Sacombank side by side, with offer rates blurred.",
            "caption": "Both pages side by side. Offer rates are blurred.",
            "maxWidth": "820px"
          }
        ],
        "visual": null,
        "links": [
          {
            "href": "https://vinfastauto.com/vn_vi/chuyen-doi-xanh/lpbank",
            "label": "See the LPBank page live"
          },
          {
            "href": "https://vinfastauto.com/vn_vi/chuyen-doi-xanh/sacombank",
            "label": "See the Sacombank page live"
          }
        ]
      },
      {
        "id": "lead-engine",
        "title": "An outbound lead engine for a small BD team",
        "role": "Builder",
        "company": "VinDynamics",
        "year": "2026",
        "problem": "The BD team researched every prospect by hand, from finding a reason to reach out to writing the message.",
        "decided": "I built it around buying signals, such as a product launch or a regulatory approval, instead of a static list of companies. Claude scores each company, Hunter finds the contacts, and every lead arrives with a drafted email and LinkedIn message. A person sends every one. I picked Hunter over Apollo because Apollo had little on small companies, and left LinkedIn automation out to protect the team's accounts.",
        "outcome": "Over four days in May 2026 it delivered 52 researched companies across 5 sectors and 9 countries, each with a score, the signal behind it, two contacts and two drafts. BD reached out to all 52.",
        "tools": [
          "n8n",
          "Claude",
          "Hunter",
          "Microsoft Teams"
        ],
        "images": [],
        "visual": "lead-engine",
        "links": []
      },
      {
        "id": "ai-agent",
        "title": "An AI agent for a sales page's messages",
        "role": "Builder",
        "company": "VinFast",
        "year": "2026",
        "problem": "Nobody was assigned to answer messages on the brand's sales page, so customers waited.",
        "decided": "I set up an AI agent on the page's messenger, loaded it with product information and scoped it to two jobs: answer questions, then send people to book a consultation or place a deposit online.",
        "outcome": "It handles the common questions on its own and hands people to the right next step. It passed end-to-end testing and goes live after sign-off.",
        "tools": [
          "Messenger"
        ],
        "images": [],
        "visual": null,
        "links": []
      },
      {
        "id": "daily-lead-report",
        "title": "A daily lead report that checks itself",
        "role": "Builder",
        "company": "VinFast",
        "year": "2026",
        "problem": "My manager rebuilt the lead and deposit report by hand every day.",
        "decided": "I worked out the metric rules from my manager's own files, then automated the cleanup, matching and counts in Power Query, with four built-in checks.",
        "outcome": "Lead counts match the manual report within 1%. Building it also showed that one channel's conversion rate always read 100%, because of the way its records were created.",
        "tools": [
          "Excel"
        ],
        "images": [],
        "visual": null,
        "links": []
      }
    ]
  },
  {
    "id": "live-products",
    "name": "Fixes to live products",
    "rows": [
      {
        "id": "cost-tool",
        "title": "A cost tool and a mid-page form for car product pages",
        "role": "Analyst",
        "company": "VinFast",
        "year": "2026",
        "problem": "Shoppers had to leave the page to work out on-road cost or monthly payments.",
        "decided": "I mapped every section and button across the car and scooter pages. Then I prototyped a three-tab cost tool (on-road cost, installments and fuel savings) and a form halfway down the page, for desktop and mobile.",
        "outcome": "A proposal, revised after the systems team's review and now with the team that plans the website. The open question is how to build it: an embedded frame is quick to add, but it loads slowly and scrolls badly on phones.",
        "tools": [],
        "images": [],
        "visual": null,
        "links": []
      },
      {
        "id": "loyalty-app-flow",
        "title": "A buying flow inside a loyalty app",
        "role": "Analyst",
        "company": "VinFast",
        "year": "2026",
        "problem": "A group loyalty app sent plenty of car leads, but few of them became deposits.",
        "decided": "I prototyped a clickable buying flow for cars and scooters, with a shorter form and views for each membership tier.",
        "outcome": "The prototype made the real issue easy to see: most people dropped off to compare prices with dealers, and a new screen won't fix that. I flagged it alongside the prototype, so the app's team can put effort where it pays.",
        "tools": [],
        "images": [],
        "visual": null,
        "links": []
      },
      {
        "id": "food-cart",
        "title": "Why food orders stalled at the cart",
        "role": "Analyst",
        "company": "Xanh SM",
        "year": "2025",
        "problem": "Fewer than 1 in 100 people who added food to their cart finished the order.",
        "decided": "I mapped the ordering funnel from the home screen to a completed order, and looked at when people ordered. Three steps lost the most people: choosing a restaurant, moving from cart to checkout, and confirming the order.",
        "outcome": "The drop-offs came from missing reasons to keep going, like no free-delivery prompt and unfamiliar restaurants, rather than bugs. We rolled out four fixes, including a free-delivery pop-up after add to cart and cart reminders timed for the lunch and dinner peaks.",
        "tools": [
          "CleverTap"
        ],
        "images": [],
        "visual": null,
        "links": []
      },
      {
        "id": "first-14-days",
        "title": "The first 14 days: getting new riders to take a first trip",
        "role": "Builder",
        "company": "Xanh SM",
        "year": "2025",
        "problem": "Every rider got the same push messages on the same day, whether they had signed up yesterday or stopped riding months ago.",
        "decided": "Riders who take a trip within 14 days of signing up stay the longest, so I gave every new rider one goal: a first trip inside 14 days. I moved messaging from a calendar to behavior, built 30+ automated journeys for four rider groups, and judged every weekly A/B test on trips, not clicks.",
        "outcome": "First trips rose 28% and churn fell 12%, month over month.",
        "tools": [
          "CleverTap"
        ],
        "images": [
          {
            "img": firstTrips,
            "alt": "The new-rider flow, recreated: sign-up, a how-to push on day 0, a welcome offer on days 2 to 5, an A/B test on day 7 and a last reminder on days 12 to 14.",
            "caption": "Recreated for this site. Steps, timing and copy are simplified.",
            "maxWidth": "820px"
          }
        ],
        "visual": null,
        "links": []
      },
      {
        "id": "domain-move",
        "title": "Checking a product page move to a new domain",
        "role": "Analyst",
        "company": "VinFast",
        "year": "2026",
        "problem": "About 30 product pages moved to a new domain, with no proof that search engines and analytics had followed.",
        "decided": "I checked every moved page at the server, search and analytics level. Then I audited the technical SEO and wrote a fix list for the web team.",
        "outcome": "Every page passed the move itself. The audit also caught canonical tags on most car pages pointing to broken URLs, the kind of problem that drains search traffic slowly and quietly.",
        "tools": [
          "Search Console",
          "GA4"
        ],
        "images": [],
        "visual": null,
        "links": []
      }
    ]
  },
  {
    "id": "data",
    "name": "Data and measurement",
    "rows": [
      {
        "id": "lead-tracking",
        "title": "Lead and deposit tracking that ad platforms can use",
        "role": "Requirements lead",
        "company": "VinFast",
        "year": "2026",
        "problem": "The site had more tags than anyone owned, and ad platforms saw only part of the leads and none of the car deposits.",
        "decided": "I audited the tag setup, wrote one event plan shared by every product page, and configured the lead and deposit tags. The web team shipped the code changes.",
        "outcome": "Lead tags went from covering 29% of car product pages to all of them, and car deposits now report back to the ad account. Leads recorded per ad click more than doubled that quarter, alongside new campaigns that launched at the same time.",
        "tools": [
          "GA4",
          "Google Tag Manager",
          "Google Ads"
        ],
        "images": [],
        "visual": null,
        "links": []
      },
      {
        "id": "data-warehouse",
        "title": "A marketing data warehouse, built solo",
        "role": "Builder",
        "company": "VinDynamics",
        "year": "2026",
        "problem": "Leads lived in a spreadsheet with no source, and ad data sat in three separate tools.",
        "decided": "As the only data person on the team, I built a four-layer warehouse in BigQuery that joins GA4, Google Ads, LinkedIn Ads and the CRM. Each metric is defined once and reused in every report.",
        "outcome": "It refreshes every morning at 7 and feeds the dashboards leadership reads each week. The work was rated 5 out of 5 in my performance review.",
        "tools": [
          "BigQuery",
          "Dataform",
          "Looker Studio"
        ],
        "images": [
          {
            "img": dataform,
            "alt": "The warehouse's Dataform graph in BigQuery: staging tables flowing into fact tables and report views.",
            "caption": "",
            "maxWidth": "820px"
          }
        ],
        "visual": null,
        "links": []
      },
      {
        "id": "o2o-dashboard",
        "title": "A marketing dashboard for VinFast's O2O team",
        "role": "Builder",
        "company": "VinFast",
        "year": "2026",
        "problem": "Ad spend, leads and web deposits sat in three separate platforms.",
        "decided": "I built a dashboard with Claude that pulls Meta Ads, Google Ads and GA4 through Windsor.ai. It tracks the quarter's plan, cost per lead and cost per web deposit by car model, and turns Google Ads data into a weekly to-do list: which campaigns to raise or hold, and which search terms to block.",
        "outcome": "One page covers plan progress, spend, leads and deposits by car model, with a short guide on how far to trust each number.",
        "tools": [
          "Meta Ads",
          "Google Ads",
          "GA4",
          "Windsor.ai"
        ],
        "images": [
          {
            "img": o2o,
            "alt": "The dashboard's overview page: date, model and channel filters, metric cards and a quarterly plan table, with every figure blurred.",
            "caption": "The overview page. Every figure is blurred.",
            "maxWidth": "100%"
          }
        ],
        "visual": null,
        "links": []
      }
    ]
  }
];

export const SIDE_PROJECTS: { title: string; role: Role; line: string; href: string | null }[] = [
  {
    "title": "Energy audit",
    "role": "Builder",
    "line": "A small tool to see which parts of your week give you energy.",
    "href": "/lab/energy-audit"
  },
  {
    "title": "This website",
    "role": "Builder",
    "line": "Designed and built with Claude.",
    "href": null
  }
];
