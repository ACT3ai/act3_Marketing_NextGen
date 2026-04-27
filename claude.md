# act3_Marketing_NextGen

ACT3 AI marketing site — Docusaurus static site deployed to GitHub Pages.

## Project Info

PROJECT_DIR dir is ~/BGit/act3/act3_Marketing_NextGen

* Tech: Docusaurus 3.10.0, React 19, TypeScript, pnpm
* Live URL: https://marketing.act3ai.com/
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
