# act3_Marketing_NextGen

ACT3 AI marketing site — Docusaurus static site deployed to GitHub Pages.

## Project Info

PROJECT_DIR dir is ~/BGit/act3/act3_Marketing_NextGen

* Tech: Docusaurus 3.10.0, React 19, TypeScript, pnpm
* Live URL: https://act3ai.com/
* GitHub repo: https://github.com/ACT3ai/act3_Marketing_NextGen
* Org: ACT3ai

## Local Dev

* Start dev server: `pnpm start` → http://localhost:3000
* Build: `pnpm build` → output in `build/`
* Typecheck: `pnpm typecheck`
* Package manager: pnpm (NOT npm, NOT yarn)

## GitHub Deployment

Deploys automatically via GitHub Actions on every push to `main`.

Workflow file: `.github/workflows/deploy.yml`
* Build step: `pnpm build`
* Deploy step: `actions/deploy-pages@v4`
* Deploys the `build/` directory to GitHub Pages

CNAME file: `static/CNAME` contains `marketing.act3ai.com`
* This file must stay in `static/CNAME` — Docusaurus copies it into every build
* Without it, GitHub Pages loses the custom domain mapping after each deploy

## DNS — AWS Route53

Hosted zone: `act3ai.com` (Zone ID: Z068582936KKC1AS0PYW1)

DNS record for this site:
* `marketing.act3ai.com.  CNAME  act3ai.github.io`

CAA records (controls which CAs may issue TLS certs for act3ai.com):
* `0 issue "amazon.com"`          — AWS Certificate Manager (for main app)
* `0 issuewild "amazon.com"`
* `0 issue "letsencrypt.org"`     — Let's Encrypt (required for GitHub Pages)
* `0 issuewild "letsencrypt.org"` — Let's Encrypt wildcard
* `0 iodef "mailto:support@act3ai.com"`

IMPORTANT: Both amazon.com AND letsencrypt.org must remain in the CAA records.
* amazon.com covers the main app load balancer and CloudFront certs
* letsencrypt.org is required for GitHub Pages HTTPS cert provisioning
* Removing letsencrypt.org will break HTTPS on marketing.act3ai.com

## SSL Certificate

GitHub Pages provisions a Let's Encrypt cert automatically for the custom domain.
Cert is managed entirely by GitHub — no manual renewal needed.

To check cert status via GitHub API:
  gh api repos/ACT3ai/act3_Marketing_NextGen/pages

Key fields:
* `https_certificate.state` — should be "issued" when working
* `https_enforced` — should be true when HTTPS is enforced
* `cname` — should be "marketing.act3ai.com"

To enable HTTPS enforcement after cert is issued:
  gh api --method PUT repos/ACT3ai/act3_Marketing_NextGen/pages --input - <<'EOF'
  {"https_enforced": true}
  EOF

If cert provisioning fails or is stuck:
1. Check CAA records allow letsencrypt.org (see above)
2. Cycle the custom domain (remove + re-add) to re-trigger provisioning:
     gh api --method PUT ... --input - <<< '{"cname":null}'
     sleep 3
     gh api --method PUT ... --input - <<< '{"cname":"marketing.act3ai.com"}'
3. Cert takes ~15 min to provision after CAA records propagate

## Site Structure

```
static/CNAME          — custom domain (must stay)
static/img/           — images, logo, favicon
src/pages/            — custom React pages (home, features, pricing, about, contact)
src/css/custom.css    — global CSS overrides
docs/                 — markdown documentation pages
blog/                 — blog posts
docusaurus.config.ts  — main site config (URL, nav, footer)
sidebars.ts           — docs sidebar structure
```

## AWS Account

Google Cloud Project ID: bryan-testing-464010 (not used for this site — this site is GitHub Pages only)
AWS account manages DNS via Route53 for act3ai.com.

## Level 2 pages — content vs. design (how it works)

The four "Level 2 Filmmaking Team" pages keep **words and styling completely
separate**: the markdown carries only content; a single CSS file carries the
entire visual design. Update the words without ever touching the look, and
vice-versa.

### The four pages

| Route (live URL)                         | File in this repo                         | Prices? | Listed?  |
|------------------------------------------|-------------------------------------------|---------|----------|
| `/level2`                                | `site/pages/level2.md`                    | No      | Public   |
| `/marketing_981769`                      | `site/pages/marketing_981769.md`          | Plan 1  | unlisted |
| `/marketing_77985269`                    | `site/pages/marketing_77985269.md`        | Plan 2  | unlisted |
| `/marketing_69983965867`                 | `site/pages/marketing_69983965867.md`     | Plan 3  | unlisted |

They live in `site/pages/` (NOT `site/docs/`) so their routes are clean and
root-level (e.g. `act3ai.com/marketing_981769`), with no `/docs/` prefix. The
three priced pages are `unlisted: true` — kept out of the navbar, search, and
sitemap; reachable only by direct link. The filename digit **1–3** identifies
the plan (ignore all other digits).

### Where the WORDS come from (content source)

Content is authored and maintained upstream, then copied in:

* Source dir: `~/BGit/all/film/level_2/marketing/`
  * `marketing_981769.md`, `marketing_77985269.md`, `marketing_69983965867.md`
    — the three priced plan pages (already Docusaurus markdown).
  * `marketing.html` / `marketing.md` — the price-free write-up that `level2.md`
    mirrors. (`marketing.md` itself is a directory README, not page content.)
  * `information.mdx` — the internal "points to cover" that shape the copy.

To refresh content, just copy the source plan files over the ones in
`site/pages/` — nothing else. The markdown holds pure content: headings,
paragraphs, two markdown tables (packages + weekly price), one ordered list
(How it works), and unordered lists (feature bullets). **No colors, classes, or
inline styles ever go in the markdown.**

### Where the DESIGN comes from (styling overlay)

* Design reference (Claude Code export): `c_design/level2/Level 2 Team Marketing.dc.html`
* Implemented as one scoped stylesheet: **`site/css/level2.css`**, registered in
  `docusaurus.config.ts` under `theme.customCss` (an array, alongside
  `custom.css`).

Each page opts into the design with a single front-matter line — the only
site-specific key the markdown carries:

```yaml
wrapperClassName: level2-page
```

Docusaurus puts that class on the `<html>` element, so every rule in
`level2.css` is scoped under `.level2-page` and affects nothing else on the
site. Because the content is flat markdown, the CSS styles sections by their
**semantic shape**, not by hand-placed markers:

* first `<p>` (bold-only) → orange mono eyebrow
* `<header> h1` → large centered Fraunces title (Docusaurus wraps the first
  heading in a `<header>` — selectors account for that)
* the two `<p>` after the header → tagline + lead
* `<h2>` → section heading with an orange accent bar
* `<table>` → package / pricing card table (last column renders as the price
  emphasis)
* `<ol>` → numbered "How it works" step columns (big italic Fraunces numerals)
* `<ul>` → feature card grid
* last `<h2>` + last `<p>` → centered closing call-to-action with pill button

Palette/typography come straight from the design: cream `#faf8f3`, ACT 3 orange
`#c4612b`, Fraunces (headings) + Inter (body) + JetBrains Mono (labels), loaded
via `@import` at the top of `level2.css`. The pages render inside the normal
Docusaurus theme, so they keep the site navbar and footer.

### The pipeline in one line

Edit words in `~/BGit/all/film/level_2/` → copy the `.md` files into
`site/pages/` (the `wrapperClassName: level2-page` front matter is already in the
source, so a plain copy is enough) → `pnpm build`. Styling is never re-touched;
it lives only in `site/css/level2.css`.

To change the LOOK of all four pages, edit only `site/css/level2.css`.
