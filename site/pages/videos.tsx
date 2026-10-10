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
 *   1  hero        retitled for ads, social and marketing (bullets as on the homepage)
 *   3  who it's for  eyebrow and the Filmmaking panel dropped (3-up wall + 3 rails
 *                  to the hub on desktop; 2 + 1 full-width panel on tablets)
 *   2  chat        "change the background, same actor" (as on the homepage)
 *   5  consistency character, set and outfit (no "scene 88": not a long production);
 *                  a dark lead-in (CLOSING's css) so it does not sit flush under
 *                  the Get Started band ctaEvery=3 puts right before it
 *   10 storyboards "every ad / social video / marketing video"; only those tabs
 *   13 save money  body trimmed to its last two sentences; "Illustration of..." caption dropped
 *   15 voice       as on the homepage
 *   14 teams       retold for a campaign ("one project", scene 1, the last scene)
 *   +  closing band (page-local row below): Get Started + Watch ACT 3 on YouTube
 */

const HERO = "r1v42";

/**
 * The closing band, as a page-local row. V4RowsPage takes no children (and its
 * footer follows the rows), so a band after the rows but before the footer has
 * to be a row. It reuses the template blocks' classes (v4t-section, v4t-h2,
 * v4t-cta, v4t-ghost from site/css/v4-template.css), so it looks like every
 * other v4 page. Its css also carries this page's layout fixes for rows 3 and 5
 * (page CSS goes in a row's css, never in a second body <style>).
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
    `<h2 class="v4t-h2" id="vid-close-title">Your next video, <span class="v4t-hl">one chat away.</span></h2>` +
    `</div>` +
    `<div class="v4t-ctas">` +
    `<a class="v4t-cta" href="${SIGNUP}">Get Started <span aria-hidden="true">›</span></a>` +
    `<a class="v4t-ghost" href="${LINKS.youtube}" target="_blank" rel="noopener noreferrer">Watch ACT 3 on YouTube</a>` +
    `</div>` +
    `</div></section>`,
  css: `
/* The closing band sits on the page's navy ground, like the "Get Started" bands. */
.v4 .vid-close { background: ${V4_PAGE_GROUND}; border-top: 1px solid rgba(255, 255, 255, 0.08); }
/* Row 3 without its Filmmaking panel: three panels. Suffix selectors, so a
   regeneration that renumbers the prefix still matches.
   Desktop (where the row has its rails): three columns, and every caption box
   two lines tall so the three yellow labels share one baseline.
   Tablet (the row's own two columns): the third panel spans the row, as tall
   as the other two, instead of leaving a hole; the two panels above it get the
   same two-line caption box. Phones keep one column. */
@media (min-width: 1001px) {
  .v4 [data-row="3"] ol[class$="-wall"] { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .v4 [data-row="3"] p[class$="-line"] { min-height: calc(2 * 1.38em + 21px); }
}
@media (min-width: 561px) and (max-width: 1000px) {
  .v4 [data-row="3"] ol[class$="-wall"] > li:last-child { grid-column: 1 / -1; aspect-ratio: 2 / 1.08; }
  .v4 [data-row="3"] ol[class$="-wall"] > li:not(:last-child) p[class$="-line"] { min-height: calc(2 * 1.38em + 21px); }
}
/* Row 5's clapper tab strip has no top padding; here it follows a navy Get
   Started band (ctaEvery=3). Give it the dark lead-in it has on the homepage. */
.v4 .v4-row[data-row="5"] { background: #0f0e0c; padding-top: 48px; }
@media (max-width: 640px) { .v4 .v4-row[data-row="5"] { padding-top: 28px; } }
.v4[data-v4-theme="light"] .v4-row[data-row="5"] { background: #ecebe8; }
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
  ]),
  row(3, [
    // The panels name the audiences, and the hero just did: no eyebrow.
    [`<p class="r3v34-eyebrow">For filmmaking, advertising, social media, marketing</p>`, ``],
    [
      `Describe a character, a set or a look once and it carries through every shot. The time you get back is yours, whichever of these you make.`,
      `Describe a character, a set or a look once. It carries through every shot.`,
    ],
    [
      `<li class="r3v34-panel">\n      <img class="r3v34-img" src="/v4/row_3/v/air_film.jpg" alt="A dark movie theater, Jack and Sally on the big screen" width="1000" height="1000" loading="lazy">\n      <div class="r3v34-third"><h3 class="r3v34-name">Filmmaking</h3><p class="r3v34-line">Your hours go to the story, not the setup.</p></div>\n    </li>`,
      ``,
    ],
    // The rails from the panels to the hub: four curves for four panels → three for three.
    [`<path class="r3v34-rail" d="M125 0 C125 70 500 40 500 110"/>`, `<path class="r3v34-rail" d="M167 0 C167 70 500 40 500 110"/>`],
    [`<path class="r3v34-rail" d="M375 0 C375 60 500 50 500 110"/>`, `<path class="r3v34-rail" d="M500 0 L500 110"/>`],
    [`<path class="r3v34-rail" d="M625 0 C625 60 500 50 500 110"/>`, ``],
    [`<path class="r3v34-rail" d="M875 0 C875 70 500 40 500 110"/>`, `<path class="r3v34-rail" d="M833 0 C833 70 500 40 500 110"/>`],
  ]),
  row(2),
  row(5, [
    [`into every scene of a two-hour movie:`, `into every scene:`],
    [`a jet ski in scene 7, a blizzard in scene 88, a candle-lit library in scene 2`, `a jet ski, a blizzard, a candle-lit library`],
  ]),
  row(10, [
    [`Storyboards for your entire`, `Storyboards for every`],
    [`<span class="r10v48-word">movie or video</span>`, `<span class="r10v48-word">ad</span>`],
    [`Whatever you are making, every shot gets its panel.`, `Every shot gets its panel.`],
    [`<li class="r10v48-tab" data-r10v48-word="movie">Movie</li>`, ``],
    [`<li class="r10v48-tab" data-r10v48-word="TV episode">TV episode</li>`, ``],
    [`<li class="r10v48-tab" data-r10v48-word="minidrama">Minidrama</li>`, ``],
  ]),
  row(13, [
    [
      `The video is the expensive step, so ACT&nbsp;3 has you settle the shot where a change costs little: as a storyboard, then as a first frame. When you do generate video, it is already the shot you wanted. That saves you money and time.`,
      `When you do generate video, it is already the shot you wanted. That saves you money and time.`,
    ],
    [`<p class="r13v35-note">Illustration of one shot at its three stages.</p>`, ``],
  ]),
  row(15),
  row(14, [
    [`One movie that keeps moving.`, `One project that keeps moving.`],
    [`Movies and series get done far faster`, `Campaigns get done far faster`],
    [`in the same movie"`, `in the same project"`],
    [`I'm working on Act 1 and a reusable set.`, `I'm working on scene 1 and a reusable set.`],
    [`I'm working on Act 3.`, `I'm working on the last scene.`],
    [`for different days in the movie.`, `for the campaign.`],
    [`Her screen shows the film's last scene:`, `Her screen shows the last scene:`],
    [`Her screen shows the film's astronaut`, `Her screen shows the astronaut`],
  ]),
  CLOSING,
].filter((r): r is V4Row => r !== null);

const TITLE = "AI Video for Ads, Social & Marketing | ACT 3 AI";
const DESCRIPTION =
  "Ads, social and marketing videos with ACT 3 AI: chat with your AI filmmaker, keep characters consistent, approve each shot before you pay for video.";
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
