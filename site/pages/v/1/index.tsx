// ─────────────────────────────────────────────────────────────────────────────
// Route: /v/1 — alias of /v/2.
//
// The design this page renders was authored as variation 1 upstream
// (~/BGit/all/film/design/brand/jenny/claude_design/v/1/), so links to /v/1 are
// in circulation, while the route on this site was published as /v/2. Rather
// than break either address, /v/1 renders the exact same component.
//
// There is nothing to maintain here: edit the design in site/pages/v/2/index.tsx
// and this route follows. The page already sends `robots: noindex, nofollow`
// and /v/** is excluded from the sitemap, so the duplicate route cannot compete
// with the real homepage in search.
// ─────────────────────────────────────────────────────────────────────────────
export { default } from "../2";
