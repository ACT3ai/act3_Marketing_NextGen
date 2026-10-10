import React from "react";
import Head from "@docusaurus/Head";
import V4RowsPage, { V4_PAGE_GROUND } from "../components/v4/V4RowsPage";
import { applySiteNav, pickRows, replaceCopy } from "../components/v4/rowTransforms";

/**
 * Route: /movies   (https://act3ai.com/movies)
 *
 * ACT 3 for feature films and long-form movies: a subset of the homepage rows
 * (site/pages/index.tsx), rendered by V4RowsPage, with the copy aimed at
 * filmmakers making a 2- or 3-hour movie. Only the copy changes, through
 * replaceCopy (exact strings from the generated row markup, entities included);
 * the rows' design, engines and assets are the homepage's own.
 *
 * Rows, top to bottom:
 *   1  hero               — H1 + four points rewritten for movies
 *   6  for movies         — the core: direct your whole movie (unchanged)
 *   5  consistency        — character / set / outfit across a two-hour movie (copy unchanged;
 *                           a dark lead-in so row 6 does not run into its tab strip)
 *   4  editor proof       — the real editor, Final Draft import → 2-hour movie (engine-drawn; unchanged)
 *   8  script             — beats, scenes and shots run the timeline (unchanged)
 *   10 storyboarding      — headline fixed on "movie" (the Movie tab stays open)
 *   13 save money         — body trimmed to its last two sentences, aimed at a whole movie;
 *                           the visible "Illustration of..." caption dropped
 *   14 teams              — already about "one movie" (unchanged)
 *
 * Order: row 5 has no top padding, so it must never follow a Get Started band
 * (ctaEvery=3 puts the bands after rows 5 and 10, i.e. before rows 4 and 13).
 *
 * Hero points: the third is the long one on purpose, so between 820 and 1240 px
 * (where the list is capped at 820 px) they wrap 2+2 like the homepage's, not 3+1.
 *
 * Left out: 2 (chat; the hero and row 4 already show it), 3 (who it's for),
 * 7 (TV), 9 (characters; row 5 covers the face, wardrobe and look), 12 (sets;
 * rows 5, 6 and 8 cover reusable sets), 15 (voice), 16 (MCP + homepage footer;
 * V4RowsPage renders the template footer instead).
 *
 * Copy NOT changeable here: the hero's chat log ("Ep. 1 cold open is cut...") is
 * typed by the row 1 engine (site/static/v4/row_1/v/row.js), and row 4's chat and
 * captions by its engine; both stay as on the homepage.
 */

const [HERO, FOR_MOVIES, CONSISTENCY, EDITOR, SCRIPT, STORYBOARDS, SAVE_MONEY, TEAMS] = pickRows([
  1, 6, 5, 4, 8, 10, 13, 14,
]).map(applySiteNav);

/*
 * Row 5's clapper tab strip has no top padding. On the homepage it sits under
 * row 4's #0f0e0c ground; here it follows row 6, whose "2.5 hours" pill and
 * clock-dial lines would run straight into the strip. Give it the same dark
 * lead-in as /minidramas and /videos, in its own css (never a second <style>).
 */
const ROW5_LEAD_IN = `
.v4 .v4-row[data-row="5"] { background: #0f0e0c; padding-top: 48px; }
@media (max-width: 640px) { .v4 .v4-row[data-row="5"] { padding-top: 28px; } }
.v4[data-v4-theme="light"] .v4-row[data-row="5"] { background: #ecebe8; }
`;

// A module constant: V4RowsPage restarts the row engines if this array changes identity.
const ROWS = [
  replaceCopy(HERO, [
    ['aria-label="ACT 3: AI filmmaking at the speed of storytelling"', 'aria-label="ACT 3: feature films at the speed of storytelling"'],
    ['<span class="r1v42-h1a">AI Filmmaking</span>', '<span class="r1v42-h1a">Feature Films</span>'],
    // Order matters: replaceCopy runs the pairs in turn, so the old first point is
    // replaced before the second pair writes "Chat to AI Filmmaker" into slot two.
    ["<li>Chat to AI Filmmaker</li>", "<li>Import your Final Draft script</li>"],
    ["<li>Your input, and AI Filmmaker does all of the work</li>", "<li>Chat to AI Filmmaker</li>"],
    ["<li>AI Storyboarding</li>", "<li>Same actor, set &amp; outfit every scene</li>"],
    ["<li>Sets &amp; locations created by AI</li>", "<li>AI storyboards, every shot</li>"],
  ]),
  FOR_MOVIES,
  { ...CONSISTENCY, css: CONSISTENCY.css + ROW5_LEAD_IN },
  EDITOR,
  SCRIPT,
  // Fix the headline on "movie": without the .r10v48-word span the row engine
  // stops before it starts cycling, and the row's no-JS rule keeps the first
  // folder tab (Movie) open. The inline style repeats .r10v48-word's look.
  replaceCopy(STORYBOARDS, [
    [
      '<span class="r10v48-word">movie or video</span>',
      '<span class="r10v48-word-fixed" style="display:inline-block;padding:0 .28em;border-radius:.16em;background:#eebc3c;color:#17140a;line-height:1.25">movie</span>',
    ],
    ["Whatever you are making, every shot gets its panel.", "Every shot gets its panel."],
  ]),
  replaceCopy(SAVE_MONEY, [
    [
      "The video is the expensive step, so ACT&nbsp;3 has you settle the shot where a change costs little: as a storyboard, then as a first frame. When you do generate video, it is already the shot you wanted. That saves you money and time.",
      "When you do generate video, it is already the shot you wanted. Over a whole movie, that saves you money and time.",
    ],
    ['<p class="r13v35-note">Illustration of one shot at its three stages.</p>', ""],
  ]),
  TEAMS,
];

const TITLE = "AI Movies — Direct Your Whole Feature Film | ACT 3 AI";
const DESCRIPTION =
  "Make a 2- or 3-hour movie with ACT 3 AI: import your script, chat with your AI filmmaker, and keep every actor, set and outfit consistent.";
const URL = "https://act3ai.com/movies";

export default function Movies(): React.JSX.Element {
  return (
    <>
      <Head>
        <html lang="en" />
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        {/* Outside <Layout>: Docusaurus emits no canonical or og:/twitter: tags for this page. */}
        <link rel="canonical" href={URL} />
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
