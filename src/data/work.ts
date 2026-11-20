// Work page data (docs: work-review.md, content.md §3, labels-and-headings.md).
// The case studies come from src/content/cases; this file holds the smaller
// projects and the side projects. Edit copy here; roles and tools are checked at build time.
import type { ImageMetadata } from 'astro';
import type { Role } from './tools';
import bankPages from '../assets/images/work/bank-pages.jpg';
import emailScooter from '../assets/images/work/email-scooter-lead.jpg';
import dataform from '../assets/images/work/dataform-graph.jpg';
import o2o from '../assets/images/work/o2o-dashboard.png';
import pdpSections from '../assets/images/work/pdp-section-proposal.jpg';
import vf6Cost from '../assets/images/work/vf6-cost-prototype.jpg';
import ga4Audit from '../assets/images/work/ga4-audit-summary.jpg';

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

export const WORK_GROUPS: WorkGroup[] = [
  {
    "id": "ai",
    "name": "AI products and systems",
    "rows": [
      {
        "id": "deposit-audit",
        "title": "Finding where online deposits start, with AI agents running the audit",
        "role": "Analyst",
        "company": "VinFast",
        "year": "2026",
        "problem": "The team wanted to know which buttons lead to online deposits, but the trail breaks between the main site and the shop.",
        "decided": "I split the question into two paths, online deposits measured in GA4 and leads that deposit through sales, and set the brief: audit what exists before proposing anything. AI agents parsed the live tag container, read the deposit flow's code and pulled GA4; a second agent re-pulled the key numbers independently. The re-pull used a different cut of the data, and its totals matched; it also exposed a connector bug that returns wrong numbers with \"contains\" filters.",
        "outcome": "49% of sessions with a car deposit start on the homepage and only 10% on a product page, yet the homepage and both listing pages send no button events at all. I wrote eight proposals, and the team got a two-item order for the site.",
        "tools": [
          "GA4",
          "Google Tag Manager",
          "Claude"
        ],
        "images": [],
        "visual": null,
        "links": []
      }
    ]
  },
  {
    "id": "new-products",
    "name": "New products and tools",
    "rows": [
      {
        "id": "email-series",
        "title": "A four-email series for scooter leads, on the platform that scored 74 of 100",
        "role": "Product owner",
        "company": "VinFast",
        "year": "2026",
        "problem": "Scooter leads who left their details but didn't deposit got no follow-up email, and the team had two email platforms to choose between.",
        "decided": "I scored both platforms on 18 criteria in six weighted groups, from data and automation to measurement; Marketing Cloud scored 74 of 100 against 40. I planned four emails over nine days, each answering one buying question: the offer, a day with the scooter, the running costs and a test ride. I dropped a \"three days left\" countdown because it would be wrong for leads who join late.",
        "outcome": "On 10 November the team fixed Marketing Cloud as the platform until the end of 2026. The first email is approved as the template, and the other three are being finished for launch.",
        "tools": [
          "Salesforce",
          "Claude"
        ],
        "images": [
          {
            "img": emailScooter,
            "alt": "An email design for Evo Grand Limited: the offer price after a 3 million dong discount, a deposit button, key specs such as 262 km per charge with an extra battery, the offer deadline and four common questions.",
            "caption": "The first email, approved as the template, rendered from my design file. Product photos are missing from the export.",
            "maxWidth": "420px"
          }
        ],
        "visual": null,
        "links": []
      },
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
        "id": "daily-lead-report",
        "title": "A daily lead report that checks itself",
        "role": "Builder",
        "company": "VinFast",
        "year": "2026",
        "problem": "My manager rebuilt the lead and deposit report by hand every day.",
        "decided": "I worked out the metric rules from my manager's own files and automated the cleanup, matching and counts. When the first version got too slow in November, I rebuilt it as an automated pipeline with a two-page dashboard, and wrote the logic down in 20 sections with the code, so a person or an AI agent can rebuild it.",
        "outcome": "Lead counts match the manual report within 1%, and every run checks itself: valid orders must equal the sum of their four sources, and overlapping days must match the previous report. Building it also showed that one channel's conversion rate always read 100% because of how its records were created, and that a story about retail orders doubling was mostly 13 bulk orders.",
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
        "id": "listing-pages",
        "title": "Fixing conversion on two new buying pages before buying more traffic",
        "role": "Requirements lead",
        "company": "VinFast",
        "year": "2026",
        "problem": "Two new online buying pages went live at the end of October, and the next step on the plan was to send more ads to them.",
        "decided": "I audited both pages with GA4 and Clarity recordings and argued for fixing conversion before raising spend. On mobile, 42% of views lasted under three seconds; in 34 recordings nobody tapped Get a consultation, and the most tapped element was the cookie banner's Reject all. I mocked up the page again and wrote a 17-row current-versus-proposed spec, ranked into fix now, round one and round two.",
        "outcome": "The ranked fix list is part of my proposal to the division director, with about 2.8 leads per 1,000 sessions as the baseline to beat.",
        "tools": [
          "GA4",
          "Clarity",
          "Excel"
        ],
        "images": [],
        "visual": null,
        "links": []
      },
      {
        "id": "cost-tool",
        "title": "A cost tool and a mid-page form for car product pages",
        "role": "Requirements lead",
        "company": "VinFast",
        "year": "2026",
        "problem": "Shoppers had to leave the page to work out on-road cost or monthly payments.",
        "decided": "I mapped every section and button across the car and scooter pages, then prototyped a three-tab cost tool (on-road cost, installments and fuel savings) and a form halfway down the page, for desktop and mobile. When review showed the shop's data was stale, still listing 63 provinces and interest rates last updated in November 2023, I proposed letting buyers enter their own rate.",
        "outcome": "Approved by the division director on 2 November. The mid-page form and the fuel-savings comparison are live, and the form now brings in more than half of car-page leads. On-road cost and installments wait on an API from the shop team.",
        "tools": [],
        "images": [
          {
            "img": pdpSections,
            "alt": "My proposal board in Vietnamese: the car page's nine sections today on the left, the reordered ten changes on the right, plus the ordering principle, a check against four EV brands, and a staggered rollout to measure it.",
            "caption": "My section proposal, in Vietnamese: reorder the page in the order buyers ask, with no new copy.",
            "maxWidth": "820px"
          },
          {
            "img": vf6Cost,
            "alt": "My VF 6 prototype in Vietnamese: pick a version and city to see the full on-road cost and the monthly saving against a petrol car, then a consultation form that keeps those choices.",
            "caption": "My VF 6 prototype: on-road cost and fuel savings first, then a form that keeps the buyer's choices.",
            "maxWidth": "620px"
          }
        ],
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
        "outcome": "The prototype made the real issue easy to see: most people dropped off to compare prices with dealers, and a new screen won't fix that. I flagged it with the prototype, so the app's team puts effort where it pays.",
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
        "outcome": "Lead tags went from covering 29% of car product pages to all of them, and car deposits now report back to the ad account. Leads recorded per ad click more than doubled that quarter, alongside new campaigns that launched at the same time. Since 30 October every button also reports its position and car model, which is what made the 26-day read of the car pages possible.",
        "tools": [
          "GA4",
          "Google Tag Manager",
          "Google Ads"
        ],
        "images": [
          {
            "img": ga4Audit,
            "alt": "Summary cards from my GA4 audit, in Vietnamese: 9 items working, 8 broken and hurting reporting and attribution, 6 missing and not yet built.",
            "caption": "My GA4 audit in September, which set the fix list: 9 items working, 8 broken, 6 missing.",
            "maxWidth": "820px"
          }
        ],
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
        "decided": "I built a dashboard with Claude that brings Meta Ads, Google Ads and GA4 into one place. It tracks the quarter's plan, cost per lead and cost per web deposit by car model, and turns Google Ads data into a weekly to-do list: which campaigns to raise or hold, and which search terms to block. When a source drops out or a day's GA4 count falls below 30% of normal, it keeps the last good number instead of showing a false drop.",
        "outcome": "One page covers plan progress, spend, leads and deposits by car model, with a short guide on how far to trust each number. It's on its fifth version and refreshes every morning.",
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
