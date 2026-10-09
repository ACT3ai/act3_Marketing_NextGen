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
 *   4  editor proof       — the real editor, Final Draft import → 2-hour movie (engine-drawn; unchanged)
 *   5  consistency        — character / set / outfit across a two-hour movie (unchanged)
 *   8  script             — beats, scenes and shots run the timeline (unchanged)
 *   10 storyboarding      — headline fixed on "movie" (the Movie tab stays open)
 *   13 save money         — one closing clause aimed at a whole movie
 *   14 teams              — already about "one movie" (unchanged)
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

const [HERO, FOR_MOVIES, EDITOR, CONSISTENCY, SCRIPT, STORYBOARDS, SAVE_MONEY, TEAMS] = pickRows([
  1, 6, 4, 5, 8, 10, 13, 14,
]).map(applySiteNav);

// A module constant: V4RowsPage restarts the row engines if this array changes identity.
const ROWS = [
  replaceCopy(HERO, [
    ['aria-label="ACT 3: AI filmmaking at the speed of storytelling"', 'aria-label="ACT 3: feature films at the speed of storytelling"'],
    ['<span class="r1v42-h1a">AI Filmmaking</span>', '<span class="r1v42-h1a">Feature Films</span>'],
    // Order matters: replaceCopy runs the pairs in turn, so the old first point is
    // replaced before the second pair writes "Chat to AI Filmmaker" into slot two.
    ["<li>Chat to AI Filmmaker</li>", "<li>Bring your whole screenplay</li>"],
    ["<li>Your input, and AI Filmmaker does all of the work</li>", "<li>Chat to AI Filmmaker</li>"],
    ["<li>AI Storyboarding</li>", "<li>AI storyboards, every shot</li>"],
    ["<li>Sets &amp; locations created by AI</li>", "<li>Same actors, sets &amp; outfits all movie</li>"],
  ]),
  FOR_MOVIES,
  EDITOR,
  CONSISTENCY,
  SCRIPT,
  // Fix the headline on "movie": without the .r10v48-word span the row engine
  // stops before it starts cycling, and the row's no-JS rule keeps the first
  // folder tab (Movie) open. The inline style repeats .r10v48-word's look.
  replaceCopy(STORYBOARDS, [
    [
      '<span class="r10v48-word">movie or video</span>',
      '<span class="r10v48-word-fixed" style="display:inline-block;padding:0 .28em;border-radius:.16em;background:#eebc3c;color:#17140a;line-height:1.25">movie</span>',
    ],
    ["Whatever you are making, every shot gets its panel.", "Every shot in your movie gets its panel."],
  ]),
  replaceCopy(SAVE_MONEY, [["That saves you money and time.", "Over a whole movie, that saves you money and time."]]),
  TEAMS,
];

const TITLE = "AI Movies — Direct Your Whole Feature Film | ACT 3 AI";
const DESCRIPTION =
  "Make a 2- or 3-hour movie with ACT 3 AI: import your script, chat with your AI filmmaker, and keep every actor, set and outfit consistent from the first scene to the last.";
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
