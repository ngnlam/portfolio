# CLAUDE.md

Leo Lam Nguyen's portfolio. Astro 7 static site, deployed by Netlify from `main` (`leolamnguyen.netlify.app`). Leo edits copy himself on GitHub, so keep content in Markdown, MDX and small data files, never buried in components.

## Commands
- `npm run dev`: local server at http://localhost:4321
- `npm run build`: static build into `dist/`. Must finish with no errors before any commit.
- `npm run preview`: serve `dist/` locally.
- `node scripts/og/render-og.cjs`: re-render `public/og/default.png` (needs Playwright, run locally, not on Netlify). `--slug x --title "..." --label "..."` renders `public/og/x.png` for a case. `--icons` renders `public/favicon.ico` (16, 32, 48) and `public/apple-touch-icon.png` from the logo files. OG images carry the logo mark next to the name, so re-render all six after a logo change.
- `python3 scripts/logo/build-logo.py`: rebuilds the `leo_` logo from the site's Bricolage font (needs `pip install fonttools brotli uharfbuzz`). Writes `src/data/logo.ts`, `public/favicon.svg` and `scripts/logo/out/*.svg`. Never edit those paths by hand. Then run `render-og.cjs --icons` and bump `?v=` on the icon links in `BaseLayout` so browsers drop the cached favicon.

## Sources of truth
The copy, numbers and rules live in the claude.ai Project "My Digital Product". Read the relevant doc before changing copy:
- `docs/brand.md`: tokens (§11), components (§6), voice (§9), the writing rules (§9.7), the checklist (§15).
- `docs/labels-and-headings.md`: the three chip vocabularies and the case section headings.
- `docs/content.md` and `docs/case-studies.md`: approved copy and numbers. Titles and descriptions for SEO are in `content.md` §9.
- `docs/pages.md`: page structure and analytics events. `docs/decisions.md`: why things are the way they are.
The design canvas (Steps 1 to 4) is the visual reference. Desktop and mobile artboards were merged into one mobile-first page.

## Hard rules
**Writing (brand.md 9.7).** No em dash, no middle dot to join items, arrows only inside diagrams, no AI words (delve, leverage, seamless, robust, journey in the figurative sense, unlock, empower, transform, passionate and the rest of the list). Sentence case. US English. Percent sign attached (`41%`). Ranges in words ("from 6% to 88%"). No new numbers that are not in `content.md` or `case-studies.md`. Honest verbs: never "I built" for something the dev team built; never understate what Leo did himself.

**Privacy.** No phone number or address. No budgets, targets, target CPL or internal negative numbers. Mask staging URLs, ticket codes, approver names, account IDs and customer data. VinDynamics: the client is "VCS", the robot is Dyno, no colleague or vendor names, no KPIs or internal codes. No job-seeking signals. Public contact: `lamnguyen.ptpl@gmail.com` and LinkedIn only.

**Images.** Use the images in `src/assets` exactly as they are: blurs were applied on the canvas and must stay. Never swap in an unblurred original. Company designs are used as-is. Demo or recreated images get a caption that says so. No stock or AI-generated people. Every image needs a real `alt`; `Figure` throws without one.

**Brand.** One large sun area per page (the Let's talk band does not count). One rotated sticker per page. Polaroids at ±2°. Yellow is never a text color on a light background.

## Vocabularies (enforced in code)
- Role chip, exactly one per project: `Product owner`, `Requirements lead`, `Builder`, `Analyst` (`ROLES` in `src/data/tools.ts`).
- Stages: `Discover`, `Define`, `Decide`, `Ship`, `Measure` (`STAGES`). Case pages only.
- Tools, max 4 per item, whitelist in `TOOLS` (`src/data/tools.ts`). `getTool()` and the content schema throw on unknown names. Add a tool there first (logo SVG in `src/assets/tools/`, graphite fill, or an icon from `src/data/icons.ts`).
- Case section kickers are fixed (`KICKERS` in `src/data/case.ts`): Problem, What I found, Decisions, What I shipped, Results, What I learned. At a glance and Who did what come from frontmatter.

## Layout and CSS
- Tokens and shared classes: `src/styles/global.css`. Change a value there, not in a component.
- Breakpoints: 640 (two columns, larger gutter), 900 (desktop layout, sticky nav), 1100 (case side nav, wide figures). Mobile first: base styles are mobile, `min-width` queries add desktop.
- Shared classes: `.container`, `.band .band--sand|--white|--sun`, `.d` (display font), `.lbl` and `.lbl--sm` (mono label), `.muted`, `.clay`, `.h-display`, `.h-hero`, `.h-section`, `.ul` (text link), `.btn .btn-p|-w|-s .btn-sm .btn-block`, `.ic` (icon circle), `.chip`, `.role-chip`, `.sticker`, `.polaroid`, `.card` (hover lift), `.dash-top`, `.section`, `.section--tight`, `.only-mobile`, `.only-desktop`, `.sr-only`.
- Do not duplicate DOM for desktop and mobile. Use grid areas and media queries. The one exception is the Home logos (grid in the mobile hero, white band on desktop).
- `<html>` gets the `js` class from an inline script. Anything hidden until JS runs must stay usable without JS.
- Scoped styles: when a parent styles a child component's root or an `<Image>`, use `:global(.class)` inside the parent's selector. Watch specificity: a later `.case-card { flex: ... }` beats an earlier `.case-card--lg { flex: ... }` at equal specificity.
- URLs have no trailing slash (`trailingSlash: 'never'`, `build.format: 'file'`). Link as `/work/zalo-showroom`, never `/work/zalo-showroom/`.

## Components (`src/components`)
| Component | Props | Notes |
|---|---|---|
| `BaseLayout` (layouts) | `title, description?, current?: 'work'\|'lab'\|'about', ogImage?, ogImageAlt?, ogType?, noindex?, jsonLd?` | Head tags, canonical, OG/Twitter, Umami, skip link, Nav, Footer. Slot `head` for extra tags. |
| `CaseLayout` (layouts) | `slug, data (case frontmatter), next: {slug, title}` | Used by `src/pages/work/[slug].astro`. Renders header, stage strip, meta, tools, tiles, side nav, At a glance, MDX body, Who did what, next case. |
| `Nav` | `current?` | `leo_` logo plus "Lam Nguyen" (link named "Leo Lam Nguyen"), desktop links plus "Say hello"; mobile disclosure menu (Escape closes, focus returns). |
| `Logo` | `class?, height=22` | The `leo_` wordmark from `src/data/logo.ts`. Decorative (`aria-hidden`): the parent link carries the name. Letters use `currentColor`; the cursor blinks 3 times on load and on hover or focus, not with reduced motion. |
| `Footer` | none | `#talk` sun band with Email and LinkedIn (`contact_click`), copyright. |
| `Button` | `href, variant='primary'\|'secondary'\|'white', size='md'\|'sm', block?, event?, eventData?` | Renders `<a class="btn">`. `event` becomes `data-umami-event`, `eventData` keys become `data-umami-event-*`. External links get `rel="noopener"`. One primary button per screen. |
| `Icon` | `name: IconName, size=20, strokeWidth=1.5` | Paths in `src/data/icons.ts`. Decorative (`aria-hidden`). |
| `RoleChip` | `role: Role` | Throws on unknown roles. |
| `ToolChips` | `tools: string[], label='Tools'` | Max 4, whitelist only. |
| `StageStrip` | `led: Stage[]` | Yellow = stages Leo led, with legend and an aria-label that names them. |
| `Tiles` | `tiles: {value, label, note?}[], highlight=0` | Three metric tiles. The highlighted tile is sun-soft. Put the comparison period in `note`. |
| `SectionHeading` | `id, kicker, title, level=2` | Mono clay kicker above a display heading. |
| `Figure` | `src?, alt?, caption?, frame='none'\|'white'\|'sand'\|'dark', wide?, widths?, sizes?, loading?, imgClass?` | One image via `src`, or several via the slot. `wide` bleeds 200px right at 1100+. Throws if `src` has no `alt`. |
| `LogoBand` | `variant: 'band'\|'grid'\|'row'` | Worked-at logos with per-context heights from `src/data/logos.ts`. |
| `Polaroid` | `src, alt, caption, rotate=2, aspect='1 / 1', maxWidth='320px'` | Keep `rotate` at 2 or -2. |
| `Portrait` | `sticker?, maxWidth='440px', loading='eager'` | Sun card with arched portrait. The sticker counts as the page's one sticker. |
| `QuoteRotator` | `title, moreHref, moreLabel, interval=8000` | Data from `src/data/quotes.json`. Auto-rotates, pauses on hover, focus, hidden tab or reduced motion; has a pause button. |
| `EnergyMapPreview` | none | Decorative 2×2 map (aria-hidden). |
| `case/Section`, `case/Decisions`, `case/Decision`, `case/FigureRow` | see below | Available inside case MDX without importing. |

## Case studies (`src/content/cases/*.mdx`)
- The file name is the slug and the URL: `zalo-showroom.mdx` becomes `/work/zalo-showroom`. Files starting with `_` are not built; `_example.mdx` is the template.
- Frontmatter schema: `src/content.config.ts` (title, seoTitle, description, order, company, year, role, team, timeline, status?, stages, tools, tiles (exactly 3), glance {problem, did, role}, roles {mine, team}, next, card?, ogImage?, published?). The build fails on a wrong role, stage, tool, company or a `next` slug that does not exist.
- Body: one `<Section id="problem|found|decisions|shipped|results|learned" title="...">` per section, in that order, with the case's own headline from `labels-and-headings.md` §4. Plain Markdown inside, on its own lines (not on the same line as the tag) so it is parsed as Markdown.
- Decisions: `<Decisions><Decision title="...">Why.</Decision></Decisions>` (numbered 01, 02 by CSS).
- Images: import at the top of the MDX (`import shot from '../../assets/images/cases/zalo/home.png'`), then `<Figure src={shot} alt="..." caption="..." />`. Several side by side: `<FigureRow><Figure .../><Figure .../></FigureRow>`.
- `#results` must exist: the "Skip to the results" button points there.

## Analytics (Umami Cloud)
The script loads only when `PUBLIC_UMAMI_WEBSITE_ID` is set (Netlify environment variable; a redeploy is needed after changing it). Cookieless, so no consent banner. Events use `data-umami-event` attributes or `window.umami?.track()`:
`case_card_click {case, from}`, `short_case_expand {item}`, `skip_to_result {case}`, `case_scroll {case, depth: 50|90}`, `next_case_click {from, to}`, `contact_click {channel, page}`, `lab_open`, `lab_start`, `lab_complete`, `lab_save`.

## Before every commit
1. `npm run build` with no errors or warnings.
2. Look at every changed page at 390px and 1440px (Playwright screenshots), and check there is no horizontal scroll from 320px to 1440px.
3. axe-core: zero serious or critical issues.
4. Scan the built HTML for em dashes, middle dots, arrows in text and the AI word list.
5. Add one line to `BUILD_LOG.md`.

## BUILD_LOG.md
One dated line per step: what Claude did, anything Leo or Claude fixed by hand and why, and the checks that ran. Newest at the bottom. It is source material for the "Building this site with AI" case, so be factual and specific.

## Git
Branch `main`. Commit author `ngnlam <89715622+ngnlam@users.noreply.github.com>`. Never commit `.env*`, `dist/` or `.netlify/`.
