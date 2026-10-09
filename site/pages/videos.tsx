import React from "react";
import Head from "@docusaurus/Head";
import type { V4Row } from "./_rows.generated";
import V4RowsPage, { V4_PAGE_GROUND } from "../components/v4/V4RowsPage";
import { applySiteNav, pickRows, replaceCopy } from "../components/v4/rowTransforms";
import { LINKS, SIGNUP } from "../data/siteNav";

/**
 * Route: /videos   (https://act3ai.com/videos)
 *
 * ACT 3 for short-form video: ads, social media and marketing videos. The
 * "Videos" nav item used to point at the YouTube channel; this page replaces
 * that, and links to the channel once (the closing band).
 *
 * A homepage subset built with V4RowsPage (see site/pages/index.tsx for how
 * rows are generated). Rows are picked by number and their copy is retargeted
 * with replaceCopy (exact strings; a regeneration that changes one only logs a
 * console warning and the row keeps its homepage copy). Rows 1-15 carry no
 * footer, so V4RowsPage renders V4Footer after the last row.
 *
 *   1  hero        retitled for ads, social and marketing
 *   3  who it's for  the Filmmaking panel dropped (CSS below makes the wall 3-up)
 *   2  chat        "change the background, same actor" (as on the homepage)
 *   5  consistency character, set and outfit
 *   10 storyboards only the Ad / Social video / Marketing video tabs
 *   13 save money  as on the homepage
 *   15 voice       as on the homepage
 *   14 teams       "one movie" → "one project"
 *   +  closing band (page-local row below): Get Started + Watch ACT 3 on YouTube
 */

const HERO = "r1v42";

/**
 * The closing band, as a page-local row. V4RowsPage takes no children (and its
 * footer follows the rows), so a band after the rows but before the footer has
 * to be a row. It reuses the template blocks' classes (v4t-section, v4t-h2,
 * v4t-cta, v4t-ghost from site/css/v4-template.css), so it looks like every
 * other v4 page. Its css also carries this page's one layout fix for row 3.
 */
const CLOSING: V4Row = {
  row: 900,
  title: "Videos page: closing band",
  variation: "page",
  prefix: "vid",
  source: "site/pages/videos.tsx",
  html:
    `<section class="v4t-section v4t-section--center vid-close" aria-labelledby="vid-close-title"><div class="v4t-wrap">` +
    `<div class="v4t-section-head">` +
    `<h2 class="v4t-h2" id="vid-close-title">Your next ad, <span class="v4t-hl">one chat away.</span></h2>` +
    `<p class="v4t-intro">See what ACT 3 makes, then make your own.</p>` +
    `</div>` +
    `<div class="v4t-ctas">` +
    `<a class="v4t-cta" href="${SIGNUP}">Get Started <span aria-hidden="true">›</span></a>` +
    `<a class="v4t-ghost" href="${LINKS.youtube}" target="_blank" rel="noopener noreferrer">Watch ACT 3 on YouTube</a>` +
    `</div>` +
    `</div></section>`,
  css: `
/* The closing band sits on the page's navy ground, like the "Get Started" bands. */
.v4 .vid-close { background: ${V4_PAGE_GROUND}; border-top: 1px solid rgba(255, 255, 255, 0.08); }
/* Row 3 without its Filmmaking panel: three panels, so three columns down to
   the row's own one-column phone layout (it would leave a hole at 4 or 2 columns).
   Suffix selector, so a regeneration that renumbers the prefix still matches. */
@media (min-width: 561px) {
  .v4 [data-row="3"] ol[class$="-wall"] { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
`,
  scripts: [],
  fonts: [],
  windowGlobals: [],
  hasFooter: false,
};

type Pairs = ReadonlyArray<readonly [string, string]>;

/** Homepage row N with the site nav applied and its copy retargeted; null (and a console warning from pickRows) if the row is gone. */
function row(n: number, pairs: Pairs = []): V4Row | null {
  const [r] = pickRows([n]).map(applySiteNav);
  return r ? (pairs.length ? replaceCopy(r, pairs) : r) : null;
}

// A module constant: V4RowsPage restarts the row engines if this array changes identity.
const ROWS: V4Row[] = [
  row(1, [
    [`aria-label="ACT 3: AI filmmaking at the speed of storytelling"`, `aria-label="ACT 3: AI video for ads, social and marketing"`],
    [`<span class="${HERO}-h1a">AI Filmmaking</span>`, `<span class="${HERO}-h1a">AI Video</span>`],
    [`<span class="${HERO}-h1b">at the speed of storytelling.</span>`, `<span class="${HERO}-h1b">for ads, social and marketing.</span>`],
    [`<li>Your input, and AI Filmmaker does all of the work</li>`, `<li>Same characters, every shot</li>`],
  ]),
  row(3, [
    [`For filmmaking, advertising, social media, marketing`, `For advertising, social media, marketing`],
    [
      `Describe a character, a set or a look once and it carries through every shot. The time you get back is yours, whichever of these you make.`,
      `Describe a character, a set or a look once. It carries through every shot.`,
    ],
    [
      `<li class="r3v34-panel">\n      <img class="r3v34-img" src="/v4/row_3/v/air_film.jpg" alt="A dark movie theater, Jack and Sally on the big screen" width="1000" height="1000" loading="lazy">\n      <div class="r3v34-third"><h3 class="r3v34-name">Filmmaking</h3><p class="r3v34-line">Your hours go to the story, not the setup.</p></div>\n    </li>`,
      ``,
    ],
  ]),
  row(2),
  row(5, [[`into every scene of a two-hour movie:`, `into every scene:`]]),
  row(10, [
    [`<span class="r10v48-word">movie or video</span>`, `<span class="r10v48-word">ad</span>`],
    [`Whatever you are making, every shot gets its panel.`, `Every shot gets its panel.`],
    [`<li class="r10v48-tab" data-r10v48-word="movie">Movie</li>`, ``],
    [`<li class="r10v48-tab" data-r10v48-word="TV episode">TV episode</li>`, ``],
    [`<li class="r10v48-tab" data-r10v48-word="minidrama">Minidrama</li>`, ``],
  ]),
  row(13),
  row(15),
  row(14, [
    [`One movie that keeps moving.`, `One project that keeps moving.`],
    [`Movies and series get done far faster`, `Campaigns get done far faster`],
  ]),
  CLOSING,
].filter((r): r is V4Row => r !== null);

const TITLE = "AI Video for Ads, Social & Marketing | ACT 3 AI";
const DESCRIPTION =
  "Make ads, social media and marketing videos with ACT 3 AI. Chat with your AI filmmaker, keep characters, sets and outfits consistent, and approve each shot before you pay for video.";
const URL = "https://act3ai.com/videos";

export default function Videos(): React.JSX.Element {
  return (
    <>
      <Head>
        <html lang="en" />
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        {/* Outside <Layout>: Docusaurus emits the canonical link and og:url for
            every route, but not og:/twitter: titles. */}
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:url" content={URL} />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="theme-color" content={V4_PAGE_GROUND} />
      </Head>
      <V4RowsPage rows={ROWS} ctaEvery={3} />
    </>
  );
}
