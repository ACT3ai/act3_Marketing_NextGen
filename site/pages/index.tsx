import React from "react";
import Head from "@docusaurus/Head";
import { V4_ROWS } from "./_rows.generated";
import V4RowsPage, { V4_PAGE_GROUND } from "../components/v4/V4RowsPage";
import { applySiteNav } from "../components/v4/rowTransforms";

/**
 * Route: /   (the homepage, https://act3ai.com/)
 *
 * This is the "/v/4" design. On 2026-10-08 it moved here from site/pages/v/4/
 * and became the homepage; /v/4 now only redirects to /. The homepage it
 * replaced is frozen at /backup (site/pages/backup/index.tsx). Internal names (.v4
 * classes, site/static/v4/, scripts/build-v4-rows.js) keep the v4 label.
 *
 * The ACT 3 marketing homepage design, assembled top to bottom from the ONE
 * approved variation of every row. Nothing here redesigns a row or rewrites its
 * copy: each row's markup, CSS, engine and assets come from its approved
 * variation directory, made to run together on one Docusaurus route.
 *
 *   Row list + approvals: ~/BGit/all/film/marketing/ACT3_marketing_Home/act3/summary_sections.csv
 *                         (columns row,title,directory,variation_approved)
 *   Row sources:          ~/BGit/all/film/marketing/ACT3_marketing_Home/act3/rows/{directory}/v/{variation}/
 *   Generator:            scripts/build-v4-rows.js  (run by hand: node scripts/build-v4-rows.js)
 *   Generated data:       ./_rows.generated.ts      (markup, scoped CSS, script URLs, fonts)
 *   Generated assets:     site/static/v4/row_{N}/   (served at /v4/row_{N}/...)
 *   Build prompt:         ~/BGit/all/film/marketing/ACT3_marketing_Home/prompts/p_to_docusaurus.md
 *
 * To change a row: edit the row in its variation directory (or change the
 * approval in the CSV) and re-run the generator. NEVER hand-edit
 * _rows.generated.ts or site/static/v4/ — the next run wipes and rebuilds them.
 *
 * Like /v/2 and /v/3 this page deliberately does NOT use the Docusaurus Layout:
 * row 1 (the hero) carries the top bar and the last row (MCP) carries the
 * footer. The rendering (one <style>, the rows, the "Get Started" bands, the
 * fallback V4Footer, the row engines) lives in site/components/v4/V4RowsPage.tsx
 * and site/components/v4/rowHarness.ts, shared with every page built from rows.
 * applySiteNav (site/components/v4/rowTransforms.ts) rewrites the hero's nav,
 * its mobile menu and the footer's link columns to site/data/siteNav.ts, so the
 * links work and the dropdown reads "More" (the generated hero says "Move").
 *
 * Engineering decisions (see the generator header for the full list):
 *  * THEME. The site forces <html data-theme="light"> (colorMode defaultMode
 *    light, switch disabled), and every row's theme selectors are written as
 *    ancestor selectors ([data-theme="light"] .rNvM-row), so pinning a wrapper
 *    alone cannot stop <html> from flipping rows. The generator therefore
 *    rewrites every [data-theme=...] in row CSS to [data-v4-theme=...] on this
 *    page's wrapper, which is pinned to "dark". Dark is the default the hero,
 *    the editor demo and most rows were designed in; rows 3, 11, 12, 13, 18,
 *    19, 21 and 22 are light-first in their own CSS and show their dark
 *    variants here (showing those light would be a product decision). The
 *    whole page is one theme and no stored Docusaurus preference can reach it.
 *    The hero has no theme toggle, so none is added. For review only,
 *    ?theme=light switches every row together.
 *  * SCOPE. Every row rule is prefixed with `.v4 ` (one extra class for every
 *    rule, so each row's internal cascade is unchanged) which also makes row
 *    rules beat Infima's element rules (a:hover, p, ul, h1-h6 ...). The small
 *    reset block in V4RowsPage rolls the remaining Infima element styles back to the
 *    browser defaults the rows were designed against.
 *  * SCRIPTS. Plain <script> inside dangerouslySetInnerHTML never runs, so the
 *    row engines are static files loaded in a useEffect (rowHarness.ts),
 *    sequentially in the recorded order, each with a lifecycle context so the
 *    page stops every loop, timer, observer and listener on unmount.
 */

// Every row, with the hero nav / mobile menu / footer columns taken from site/data/siteNav.ts.
// A module constant: V4RowsPage restarts the row engines if this array changes identity.
const ROWS = V4_ROWS.map(applySiteNav);

export default function Home(): React.JSX.Element {
  return (
    <>
      <Head>
        <html lang="en" />
        <title>ACT 3 AI | AI Video Filmmaking — Give a note. See the change.</title>
        <meta
          name="description"
          content="ACT 3 AI is AI video filmmaking: your storytelling, into video. Chat with your AI filmmaker, give a note, and see the change, from script to finished film."
        />
        {/* This page renders outside <Layout>, so Docusaurus never emits og:/twitter:
            titles for it; without these the shared-link preview shows the site title. */}
        <meta property="og:title" content="ACT 3 AI | AI Video Filmmaking — Give a note. See the change." />
        <meta property="og:description" content="ACT 3 AI is AI video filmmaking: your storytelling, into video. Chat with your AI filmmaker, give a note, and see the change, from script to finished film." />
        <meta property="og:url" content="https://act3ai.com/" />
        <meta name="twitter:title" content="ACT 3 AI | AI Video Filmmaking — Give a note. See the change." />
        <meta name="theme-color" content={V4_PAGE_GROUND} />
      </Head>

      {/* A [Get Started] band after every 3rd row, never after the last row
          (Bryan, 2026-10-07: "Have [Get Started] call to action buttons between every 3rd row"). */}
      <V4RowsPage rows={ROWS} ctaEvery={3} />
    </>
  );
}
