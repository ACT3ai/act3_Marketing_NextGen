import React from "react";
import Head from "@docusaurus/Head";
import type { V4Row } from "./_rows.generated";
import V4RowsPage, { V4_PAGE_GROUND } from "../components/v4/V4RowsPage";
import { applySiteNav, pickRows, replaceCopy } from "../components/v4/rowTransforms";

/**
 * Route: /minidramas   (https://act3ai.com/minidramas)
 *
 * ACT 3 for minidramas (micro-dramas): short serialized episodes, hooks and
 * cliffhangers. A subset of the homepage rows (site/pages/index.tsx), with
 * small copy overrides that turn "movie" into "episode" / "series" where the
 * row speaks about the whole production. The rows themselves are generated
 * (site/pages/_rows.generated.ts) and never hand-edited: every override below
 * is an exact-string replaceCopy, which console.warns and leaves the row as is
 * if a regeneration changes the source text.
 *
 * Rows, top to bottom:
 *   1  Hero — its chat already reads like an episode note ("Ep. 1 cold open is cut ... Hook harder")
 *   2  Chat — fix a scene in one sentence
 *   5  Consistency — the same lead in every episode
 *   10 Storyboards — opens on the "Minidrama" tab
 *   12 Sets — a set you keep for the whole series
 *   15 Voice — one voice per character, every episode
 *   13 Save money — settle the shot before paying for video
 *   14 Teams — one series, many hands
 * No MCP row (16), so V4RowsPage renders the template footer (V4Footer).
 */

const p = (r: V4Row): string => r.prefix;

/** The hero: the headline, the four points and the section label, for minidramas. */
function hero(r: V4Row): V4Row {
  return replaceCopy(r, [
    ['aria-label="ACT 3: AI filmmaking at the speed of storytelling"', 'aria-label="ACT 3: AI minidramas, hook to cliffhanger"'],
    [`<span class="${p(r)}-h1a">AI Filmmaking</span>`, `<span class="${p(r)}-h1a">AI Minidramas</span>`],
    [`<span class="${p(r)}-h1b">at the speed of storytelling.</span>`, `<span class="${p(r)}-h1b">Hook. Cliffhanger. Next episode.</span>`],
    ["<li>Your input, and AI Filmmaker does all of the work</li>", "<li>The same lead in every episode</li>"],
    ["<li>AI Storyboarding</li>", "<li>AI storyboards for every episode</li>"],
    ["<li>Sets &amp; locations created by AI</li>", "<li>Sets you keep all series</li>"],
  ]);
}

/** Storyboards: open on the "Minidrama" tab (the row's engine starts on the first tab). */
function storyboards(r: V4Row): V4Row {
  const tab = (word: string, label: string): string => `<li class="${p(r)}-tab" data-${p(r)}-word="${word}">${label}</li>`;
  const sep = "\n        ";
  return replaceCopy(r, [
    [
      [tab("movie", "Movie"), tab("TV episode", "TV episode"), tab("minidrama", "Minidrama")].join(sep),
      [tab("minidrama", "Minidrama"), tab("movie", "Movie"), tab("TV episode", "TV episode")].join(sep),
    ],
    [`<span class="${p(r)}-word">movie or video</span>`, `<span class="${p(r)}-word">minidrama</span>`],
  ]);
}

const EDITS: Record<number, (r: V4Row) => V4Row> = {
  1: hero,
  5: (r) => replaceCopy(r, [["every scene of a two-hour movie", "every episode of your minidrama"]]),
  10: storyboards,
  12: (r) => replaceCopy(r, [["come back to it whenever the story does.", "come back to it every episode."]]),
  13: (r) => replaceCopy(r, [["That saves you money and time.", "That saves you money and time on every episode."]]),
  14: (r) =>
    replaceCopy(r, [
      ["One movie that keeps moving.", "One series that keeps moving."],
      ["in the same movie", "in the same series"],
      ["different days in the movie", "different episodes"],
    ]),
  15: (r) => replaceCopy(r, [["from the first scene to the last", "from the first episode to the last"]]),
};

// A module constant: V4RowsPage restarts the row engines if this array changes identity.
const ROWS = pickRows([1, 2, 5, 10, 12, 15, 13, 14])
  .map(applySiteNav)
  .map((r) => (EDITS[r.row] ? EDITS[r.row](r) : r));

const URL = "https://act3ai.com/minidramas";
const TITLE = "AI Minidramas | ACT 3 AI";
const DESCRIPTION =
  "Make minidramas with ACT 3 AI: micro-drama episodes with the same lead, sets and voices every episode. Give a note in one sentence and the scene is re-shot.";

export default function Minidramas(): React.JSX.Element {
  return (
    <>
      <Head>
        <html lang="en" />
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        {/* Rendered outside <Layout>, so Docusaurus emits no og:/twitter: titles or canonical for it. */}
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:url" content={URL} />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <link rel="canonical" href={URL} />
        <meta name="theme-color" content={V4_PAGE_GROUND} />
      </Head>

      <V4RowsPage rows={ROWS} ctaEvery={3} />
    </>
  );
}
