/**
 * rowsSheet — the CSS of the generated-row pages (/, /movies, /tv, /minidramas,
 * /videos) as ONE shared, cacheable stylesheet instead of ~220 KB inline in every
 * page's HTML (SEO problem home_html_over_200kb, 2026-10-26).
 *
 * Pure strings, no React: docusaurus.config.ts imports this module and its
 * postBuild plugin writes ROWS_SHEET_CSS to build{ROWS_SHEET_HREF}; V4RowsPage
 * links that file and inlines only rowsInlineCss() (what a page adds to a row).
 * The file name carries a hash of its contents, so a regenerated row busts the
 * cache. Every rule of a generated row is scoped to its own class prefix
 * (checked 2026-10-26: no unprefixed selector, no shared @keyframes), so loading
 * all rows' CSS on a page that shows only some of them changes nothing.
 * The order inside the sheet is the order the inline <style> had: page CSS, then
 * each row in V4_ROWS order.
 */
import { V4_ROWS, type V4Row } from "../../pages/_rows.generated";
import { FOOTER_COLUMNS } from "../../data/siteNav";

/** The hero's ground colour, so overscroll and the area under a short page match it. */
export const V4_PAGE_GROUND = "#060b18";

export const V4_ROWS_PAGE_CSS = `
/* Route-scoped: this stylesheet (or, in dev, the <style>) leaves with the page on SPA navigation. */
html, body { background: ${V4_PAGE_GROUND}; }

.v4 {
  position: relative;
  background: ${V4_PAGE_GROUND};
  /* The rows were designed in a bare document, not under Infima's html font. */
  line-height: normal;
  overflow-wrap: normal;
  text-rendering: auto;
  -webkit-font-smoothing: auto;
  -moz-osx-font-smoothing: auto;
  overflow-x: clip;
}
.v4-row { display: block; }

/* Roll Infima's element rules back to the browser defaults the rows were built
   against. Specificity is at most one element (+ one pseudo-class), so it beats
   Infima by source order and loses to every row rule (all of which start with .v4). */
:where(.v4) * { box-sizing: revert; }
:where(.v4) :is(h1, h2, h3, h4, h5, h6) {
  color: revert; font-family: revert; font-weight: revert; font-size: revert;
  line-height: revert; margin: revert;
}
:where(.v4) p { margin: revert; }
:where(.v4) :is(ul, ol) { margin: revert; padding-left: revert; }
:where(.v4) a { color: revert; text-decoration: revert; transition: revert; }
:where(.v4) a:hover { color: revert; text-decoration: revert; }
:where(.v4) img { max-width: revert; }
:where(.v4) strong { font-weight: revert; }
:where(.v4) :is(code, pre, kbd, blockquote, hr) { all: revert; }

/* [Get Started] call-to-action band between every ctaEvery rows (not after the last row).
   Solid CTA yellow with dark text, the primary-button look from design_input.md. */
.v4-cta { display: flex; justify-content: center; padding: 56px 16px; }
.v4 .v4-cta__btn {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 16px 40px; border-radius: 999px;
  background: #eebc3c; color: #14100a;
  font: 700 18px/1 Inter, system-ui, sans-serif; letter-spacing: 0.01em;
  text-decoration: none;
  box-shadow: 0 10px 30px rgba(238, 188, 60, 0.22);
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}
.v4 .v4-cta__btn:hover { background: #f2c756; color: #14100a; text-decoration: none; transform: translateY(-1px); box-shadow: 0 14px 36px rgba(238, 188, 60, 0.32); }
.v4 .v4-cta__btn:focus-visible { outline: 3px solid #f2c756; outline-offset: 4px; }
.v4 .v4-cta__arrow { font-size: 20px; line-height: 1; }
@media (prefers-reduced-motion: reduce) { .v4 .v4-cta__btn { transition: none; } .v4 .v4-cta__btn:hover { transform: none; } }

/* Skip link: hidden until it gets keyboard focus. */
.v4-skip {
  position: absolute; left: 16px; top: 16px; z-index: 1000;
  padding: 10px 16px; background: #eebc3c; color: #14100a;
  font: 700 16px/1.2 Inter, system-ui, sans-serif; text-decoration: none;
  transform: translateY(-200%);
}
.v4-skip:focus { transform: none; }
.v4-main { display: block; }

/* The hero's MENU panel (rewritten by applySiteNav to 15 entries) lives inside the
   hero stage (z-index 1), under the hero's card desk (z-index 12). While the MENU
   is open, lift the stage above the desk, and let a short viewport scroll the panel.
   Prefix-free (suffix selectors) so it survives a regeneration. */
.v4 [class$="-stage"]:has(> [class$="-top"] details[open]) { z-index: 60; }
.v4 [class$="-top"] details[open] > [class$="-menu-pop"] { max-height: calc(100vh - 96px); overflow-y: auto; }

/* The hero's scene ticks, <a href="#"> in the generated markup, are rendered as
   <button data-v4-tick> by applyRowFixes. Strip the button chrome so they look and
   size exactly as the links did: specificity (0,1,1) loses to the row's own
   .v4 .{prefix}-tick rules (0,2,0), which keep their size, colour and cursor. */
:where(.v4) button[data-v4-tick] {
  -webkit-appearance: none; appearance: none;
  margin: 0; padding: 0; border: 0; border-radius: 0;
  background: transparent; color: inherit; font: inherit; line-height: inherit;
  min-width: 0; text-align: inherit;
}

/* The hero top bar on narrow phones: the same steps as V4Header (v4-template.css),
   so MENU stays on screen at 320-400px. */
@media (max-width: 400px) {
  .v4 [class$="-top"] > [class$="-actions"] { gap: 8px; }
  .v4 [class$="-top"] [class$="-cta-sm"] { padding: 9px 10px; font-size: 15px; letter-spacing: 0.04em; }
}
@media (max-width: 359px) {
  .v4 [class$="-top"] [class$="-cta-sm"] { display: none; }
}

/* Touch targets (all prefix-free, so they survive a regeneration). ─────────── */
/* The hero top bar once it collapses to GET STARTED + MENU: both at least 40px tall
   (the generated rules make them 36px), text still centred. GET STARTED is already
   inline-flex, and must not get a display here: that would undo the max-width:
   359px rule above that hides it. */
@media (max-width: 1080px) {
  .v4 [class$="-top"] [class$="-cta-sm"] { box-sizing: border-box; min-height: 40px; align-items: center; }
  .v4 [class$="-top"] details > summary { box-sizing: border-box; min-height: 40px; display: inline-flex; align-items: center; }
  /* "Sign in" (shown at 761-1080px): an 18px-tall text link; padding gives it a 40px
     box with the same look. :where() keeps the specificity at (0,1,0), so the row's
     own "display: none" on phones (.v4 .{prefix}-signin, (0,2,0)) still wins. */
  :where(.v4 [class$="-top"]) [class$="-signin"] { display: inline-flex; align-items: center; padding: 11px 6px; }
}
/* The hero's scene ticks are 6px bars: a transparent ::before stretches the hit area
   to about 40px tall without changing the bar (1px short of each side, so the 3px
   gaps between ticks stay gaps). */
.v4 button[data-v4-tick] { position: relative; }
.v4 button[data-v4-tick]::before { content: ""; position: absolute; inset: -17px -1px; }
/* Row tabs on touch screens (r5v73, r7v35 and r11v37 today: 27-35px tall). Matched
   by shape, not row number (rows get renumbered): an <a> or <button> whose class
   ends in "-tab", or has "-tab " before a state class the engine adds ("-tab -on").
   Other "-tab" classes in the rows are <li>/<p> labels, which this leaves alone. */
@media (pointer: coarse) {
  .v4 :is(a, button):is([class$="-tab"], [class*="-tab "]) {
    box-sizing: border-box; min-height: 40px; display: inline-flex; align-items: center;
  }
}
/* Row 6 (r6v55) floor grid: perspective(420px) rotateX(74deg) on a plane 150% of
   the stage tall (1410px on a phone, 810px on desktop). Everything more than
   ~437px down that plane is behind the virtual camera (w <= 0), so its projection
   is unbounded. Found while chasing the iPhone crash (whose real cause was every
   row-6 panel being laid out at once; see presetPanelJs in rowTransforms.ts), and
   capped because an unbounded 3D plane is a liability on its own. Capped at 380px
   every point stays in front of the camera; the part cut off was drawn below the
   row's clip anyway, so nothing visible changes.
   Keep any 3D plane here under its perspective distance / sin(angle). */
.v4 [data-row] .r6v55-stage::before { height: min(150%, 380px); }
/* The footer a row brings (the homepage MCP row, r16v38): the same targets as
   V4Footer (v4-template.css): 18px social icons in a 34px hit area (padding
   cancelled by margin, so the spacing is unchanged), and 40px links once the
   columns stack. */
.v4 footer [class$="-social"] a { padding: 8px; margin: -8px; }
@media (max-width: 860px) {
  .v4 footer [class$="-fnav"] a { padding: 9px 0; }
}

/* Row 7's script page (r7v35: a 640px-wide page in a full-width clipping
   "-lens"). Below the row's 960px breakpoint the page is flat (no tilt) and sat
   flush left: centre it in the lens. On phones it was cut mid-word ("THE LONG
   WAT"): make it the lens's width so the lines wrap instead (the font size still
   follows the row's own page width). The row engine never positions the page. */
@media (max-width: 959.98px) {
  .v4 [class$="-lens"] > [class$="-page"] { right: 0; margin: 0 auto; }
}
@media (max-width: 760px) {
  .v4 [class$="-lens"] > [class$="-page"] { width: 100%; }
}

/* The hero top bar's "More" dropdown (inserted by applySiteNav). It sits inside the
   hero's nav, so it inherits that nav's font; the button is made to read exactly
   like the nav's links, and the panel copies the hero's MENU pop (.{prefix}-menu-pop).
   ALWAYS in the served HTML, hidden with CSS (SEO invariant: crawlers see every link).
   Revealed on hover, while focus is inside the panel, and by the click toggle
   (data-open). Hidden with opacity (not visibility) so its links stay focusable. */
.v4 .v4-more { position: relative; display: inline-flex; }
.v4 .v4-more-btn {
  all: unset; box-sizing: border-box; cursor: pointer;
  display: inline-flex; align-items: center; gap: 4px;
  font: inherit; color: rgba(255, 255, 255, 0.95); text-shadow: 0 1px 8px rgba(0, 0, 0, 0.5);
}
.v4 .v4-more-btn:hover, .v4 .v4-more[data-open="true"] .v4-more-btn { color: #fcd648; }
.v4 .v4-more-btn:focus-visible { outline: 2px solid #fcd648; outline-offset: 4px; }
.v4 .v4-more-pop {
  position: absolute; right: 0; top: calc(100% + 18px); z-index: 40;
  min-width: 230px; display: grid; padding: 6px 0;
  background: #151419; border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.55);
  opacity: 0; pointer-events: none; transform: translateY(-4px);
  transition: opacity .15s ease, transform .15s ease;
}
.v4 .v4-more-pop::before { content: ""; position: absolute; left: 0; right: 0; top: -19px; height: 19px; }
.v4 .v4-more:is(:hover, [data-open="true"]):not([data-open="false"]) .v4-more-pop,
.v4 .v4-more:not([data-open="false"]) .v4-more-pop:focus-within {
  opacity: 1; pointer-events: auto; transform: none;
}
.v4 .v4-more .v4-more-pop a {
  padding: 10px 16px; font-weight: 500; font-size: 16px; color: #f5f5f3; text-shadow: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06); text-decoration: none;
}
.v4 .v4-more .v4-more-pop a:last-child { border-bottom: 0; }
.v4 .v4-more .v4-more-pop a:hover { background: rgba(255, 255, 255, 0.07); color: #f5f5f3; }
/* The current route ("page") or its section ("true"): yellow, with a yellow underline in the bar. */
.v4 [data-v4-nav][aria-current], .v4 .v4-more-btn[data-active] { color: #fcd648; }
.v4 nav > [data-v4-nav][aria-current] { text-decoration: underline 2px; text-underline-offset: 8px; }
.v4 .v4-more .v4-more-pop a[aria-current] { color: #fcd648; box-shadow: inset 3px 0 0 #eebc3c; }
@media (prefers-reduced-motion: reduce) { .v4 .v4-more-pop { transition: none; } }

/* The hero H1's first line is a fixed 62px and runs off both edges below ~360px
   ("AI FILMMAKING" is ~338px wide). Scale it with the viewport on small phones.
   Matched by class SUFFIX so it survives a regeneration; .v4-row raises the
   specificity above the row's own .v4 .{prefix}-h1a rules. */
@media (max-width: 400px) { .v4 .v4-row [class$="-h1a"] { font-size: min(62px, 16vw); } }

/* Row 16's footer was generated with 4 link columns; applySiteNav fills it from
   FOOTER_COLUMNS (site/data/siteNav.ts), which has 5 since Customer Service.
   Desktop only: the row's own phone rule (2 columns, max-width 860px) still applies there. */
@media (min-width: 861px) { .v4 .v4-row [class$="-fnav"] { grid-template-columns: repeat(${FOOTER_COLUMNS.length}, minmax(0, 1fr)); } }
`;

const rowBlock = (r: V4Row, css: string): string =>
  `/* ── row ${r.row} · ${r.title.replace(/\*\//g, "")} · v${r.variation} · ${r.prefix}- ── */\n${css}`;

/** The shared stylesheet: page CSS + every generated row's own CSS. */
export const ROWS_SHEET_CSS = V4_ROWS_PAGE_CSS + "\n" + V4_ROWS.map((r) => rowBlock(r, r.css)).join("\n\n") + "\n";

/** 32-bit FNV-1a, hex. */
function fnv1a(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

/** Served path of the shared stylesheet (content-hashed). */
export const ROWS_SHEET_HREF = `/v4/rows.${fnv1a(ROWS_SHEET_CSS)}.css`;

const BASE = new Map(V4_ROWS.map((r) => [`${r.row}|${r.prefix}`, r.css]));

/**
 * The CSS a page must still inline. With the sheet linked: for a generated row,
 * only what the page appended to its css (pages add their tweaks that way); a
 * row the sheet does not know (or whose css a page replaced) goes in whole.
 * Without the sheet (dev server): everything, exactly as before.
 */
export function rowsInlineCss(rows: V4Row[], sheetLinked: boolean): string {
  if (!sheetLinked) return V4_ROWS_PAGE_CSS + "\n" + rows.map((r) => rowBlock(r, r.css)).join("\n\n");
  return rows
    .map((r) => {
      const base = BASE.get(`${r.row}|${r.prefix}`);
      if (base !== undefined && r.css.startsWith(base)) {
        const extra = r.css.slice(base.length);
        return extra.trim() ? rowBlock(r, extra) : "";
      }
      return rowBlock(r, r.css);
    })
    .filter(Boolean)
    .join("\n\n");
}
