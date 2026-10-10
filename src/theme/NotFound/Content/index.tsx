/**
 * Ejected @theme/NotFound/Content (Docusaurus 3.10.0) — the 404 on the v4 template.
 *
 * A V4Hero ("Page not found" + one line), the square yellow button home, and two
 * ways on: /articles and the documentation site (LINKS.docs, site/data/siteNav.ts).
 *
 * Only the CONTENT is swizzled. The stock @theme/NotFound still renders it inside
 * <Layout> and still sets the page title ("Page Not Found | ACT 3 AI"). The robots
 * noindex below keeps the 404 out of search indexes even where it is served with a
 * 200 (a client-side miss, the dev server); GitHub Pages serves build/404.html
 * with a real 404 status as well.
 *
 * The <style> lives in <Head>, never in the body (see CLAUDE.md "Site templates").
 */
import React, { type ReactNode } from "react";
import Head from "@docusaurus/Head";
import type { Props } from "@theme/NotFound/Content";
import { V4Hero } from "@site/site/components/v4/V4Blocks";
import V4Link from "@site/site/components/v4/V4Link";
import { LINKS } from "@site/site/data/siteNav";

// Scoped to .nf-links; colours and fonts are the --v4t-* tokens V4Hero declares.
const PAGE_CSS = `
.v4t-hero .nf-links { margin: 28px 0 0; padding: 0; list-style: none; display: flex; flex-wrap: wrap; justify-content: center; gap: 12px 32px; }
.v4t-hero .nf-links a {
  font-family: var(--v4t-display);
  font-weight: 700;
  font-size: 19px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--v4t-yellow);
  text-decoration: underline;
  text-decoration-color: rgba(238, 188, 60, 0.45);
  text-underline-offset: 5px;
}
.v4t-hero .nf-links a:hover { color: var(--v4t-yellow-hi); text-decoration-color: currentColor; }
.v4t-hero .nf-links a:focus-visible { outline: 3px solid var(--v4t-yellow-hi); outline-offset: 4px; }
`;

export default function NotFoundContent({ className }: Props): ReactNode {
  return (
    <main className={className}>
      <Head>
        <meta name="robots" content="noindex, follow" />
        <style>{PAGE_CSS}</style>
      </Head>
      <V4Hero eyebrow="404" title="Page not found" sub="There is nothing at this address." cta={{ label: "Home", href: "/" }}>
        <ul className="nf-links" aria-label="Elsewhere on the site">
          <li>
            <V4Link href="/articles">Articles</V4Link>
          </li>
          <li>
            <V4Link href={LINKS.docs} newTab>
              Documentation
            </V4Link>
          </li>
        </ul>
      </V4Hero>
    </main>
  );
}
