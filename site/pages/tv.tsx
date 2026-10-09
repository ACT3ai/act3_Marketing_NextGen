import React from "react";
import Head from "@docusaurus/Head";
import V4RowsPage, { V4_PAGE_GROUND } from "../components/v4/V4RowsPage";
import { applySiteNav, pickRows, replaceCopy } from "../components/v4/rowTransforms";

/**
 * Route: /tv   (https://act3ai.com/tv)
 *
 * ACT 3 for TV series and episodes. A subset of the generated homepage rows
 * (site/pages/_rows.generated.ts), rendered by V4RowsPage exactly like the
 * homepage, with a few exact-string copy overrides (replaceCopy) that turn
 * movie wording into episode / season wording. The rows themselves are never
 * edited here: regenerate them with scripts/build-v4-rows.js.
 *
 * Rows, top to bottom:
 *   1  hero (top bar; its chat engine already speaks in episodes)
 *   7  for TV: an hour-long episode in three days (the core of this page)
 *  12  sets you keep: standing sets for the whole season
 *   9  characters: series regulars, pilot to finale
 *  10  storyboards (its rotating tab starts on "TV episode")
 *  15  voice: cast voices and voice actors
 *  14  teams across time zones
 *  13  save money: the shot is right before the video is paid for
 * Row 16 (MCP + footer) is left out, so V4RowsPage renders the V4Footer.
 *
 * replaceCopy warns in the console when a `from` string is gone after a
 * regeneration; the page still renders the generated copy.
 */

const PICKED = pickRows([1, 7, 12, 9, 10, 15, 14, 13]).map(applySiteNav);

const EDITS: Record<number, ReadonlyArray<readonly [string, string]>> = {
  1: [
    ['aria-label="ACT 3: AI filmmaking at the speed of storytelling"', 'aria-label="ACT 3: AI TV series at the speed of storytelling"'],
    ['<span class="r1v42-h1a">AI Filmmaking</span>', '<span class="r1v42-h1a">AI TV Series</span>'],
    ["<li>Your input, and AI Filmmaker does all of the work</li>", "<li>An hour-long episode in three days</li>"],
    ["<li>Sets &amp; locations created by AI</li>", "<li>Series regulars and standing sets, all season</li>"],
  ],
  12: [["come back to it whenever the story does", "come back to it every episode"]],
  9: [
    ["from the first scene to the last", "from the pilot to the finale"],
    ["Supporting players get the same care as the leads.", "Guest roles get the same care as your series regulars."],
    ["An outfit per scene, when the story asks", "An outfit per episode, when the story asks"],
  ],
  10: [
    // The engine opens on the first tab and puts its word in the headline: TV episode goes first.
    [
      '<li class="r10v48-tab" data-r10v48-word="movie">Movie</li>\n        <li class="r10v48-tab" data-r10v48-word="TV episode">TV episode</li>',
      '<li class="r10v48-tab" data-r10v48-word="TV episode">TV episode</li>\n        <li class="r10v48-tab" data-r10v48-word="movie">Movie</li>',
    ],
    ['<span class="r10v48-word">movie or video</span>', '<span class="r10v48-word">TV episode</span>'],
  ],
  15: [
    ["from the first scene to the last", "from the pilot to the finale"],
    ["It is hers in every scene", "It is hers in every episode"],
  ],
  14: [
    ["One movie that keeps moving", "One show that keeps moving"],
    ["different days in the movie", "different days in the episode"],
  ],
};

// A module constant: V4RowsPage restarts the row engines if this array changes identity.
const ROWS = PICKED.map((r) => (EDITS[r.row] ? replaceCopy(r, EDITS[r.row]) : r));

const TITLE = "AI for TV Series — An Hour-Long Episode in Three Days | ACT 3 AI";
const DESCRIPTION =
  "ACT 3 AI makes TV episodes: hand it the script Monday, watch the finished hour Wednesday. Series regulars, wardrobe and standing sets carry over all season.";
const URL = "https://act3ai.com/tv";

export default function Tv(): React.JSX.Element {
  return (
    <>
      <Head>
        <html lang="en" />
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
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
