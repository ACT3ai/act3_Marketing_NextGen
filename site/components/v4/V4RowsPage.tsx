/**
 * V4RowsPage — a page made of generated homepage rows (the homepage itself, and
 * the planned /movies, /tv, /minidramas, /videos pages built from row subsets).
 *
 *   import { V4_ROWS } from "@site/site/pages/_rows.generated";
 *   import V4RowsPage from "@site/site/components/v4/V4RowsPage";
 *   import { applySiteNav, pickRows } from "@site/site/components/v4/rowTransforms";
 *
 *   const ROWS = pickRows([1, 4, 9, 16]).map(applySiteNav);   // module constant: keep it stable
 *   export default function Movies() {
 *     return (<><Head>...title + meta...</Head><V4RowsPage rows={ROWS} /></>);
 *   }
 *
 * It renders, top to bottom: one <style> (the page CSS below + every row's CSS),
 * a skip link, V4Header if no row brings the hero top bar, the rows, a navy
 * "Get Started" band after every `ctaEvery`-th row (never after the last), and
 * V4Footer if no row brings the footer. Every row after a leading top-bar row
 * sits in <main id="v4-main"> (the page's main landmark, the skip link's target). Like the homepage it does NOT use the Docusaurus
 * <Layout>: the hero row carries the top bar and the MCP row carries the footer.
 * Row engines run through rowHarness (started on mount, fully stopped on unmount),
 * which also plays the rows' own muted autoplay videos while they are on screen.
 * Every row goes through applyRowFixes (rowTransforms) here, so pages never call it.
 *
 * Links rewritten by applySiteNav carry data-v4-spa: this component turns their
 * clicks into SPA navigation, prefetches them on hover, marks the current route
 * (aria-current="page", or "true" on a parent section), and drives the hero's
 * "More" dropdown with the same disclosure model as V4Header (hover, focus
 * inside the panel, click toggle; aria-expanded always matches the screen;
 * Escape returns focus to the button).
 */
import React, { useEffect, useMemo, useRef } from "react";
import Head from "@docusaurus/Head";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useHistory, useLocation } from "@docusaurus/router";
import { V4_FONT_HREF, type V4Row } from "../../pages/_rows.generated";
import { MORE_NAV, SIGNUP, currentAttr } from "../../data/siteNav";
import { useRowEngines } from "./rowHarness";
import { applyRowFixes } from "./rowTransforms";
import V4Header from "./V4Header";
import V4Footer from "./V4Footer";

/** The hero's ground colour, so overscroll and the area under a short page match it. */
export const V4_PAGE_GROUND = "#060b18";

interface FontFamily {
  name: string;
  axes: string;
  tuples: string[];
}

/** The family= entries of a Google Fonts css2 URL (mirrors parseFamilies in scripts/build-v4-rows.js). */
function parseFamilies(url: string): (FontFamily & { raw: string })[] {
  const out: (FontFamily & { raw: string })[] = [];
  for (const raw of (url.split("?")[1] || "").split("&")) {
    if (!raw.startsWith("family=")) continue;
    const [name, axes = ""] = decodeURIComponent(raw.slice(7).replace(/\+/g, " ")).split(":");
    const [tags = "", vals = ""] = axes.split("@");
    out.push({ raw, name, axes: tags, tuples: vals ? vals.split(";") : [] });
  }
  return out;
}

/**
 * The rows' font link minus every family docusaurus.config.ts already loads
 * site-wide (customFields.googleFontsHref) with ALL the weights the rows ask
 * for. A family the rows want in a weight the site link lacks stays, so a
 * regenerated row never silently loses a face. The generator applies the same
 * rule; this keeps the page right between a config change and the next run.
 */
function rowsFontHref(href: string, siteHref: string): string {
  if (!href) return "";
  const site = new Map(parseFamilies(siteHref).map((f) => [`${f.name}|${f.axes}`, new Set(f.tuples)]));
  const [base, query = ""] = href.split("?");
  const fams = parseFamilies(href);
  const dropped = new Set(
    fams
      .filter((f) => {
        const have = site.get(`${f.name}|${f.axes}`);
        return have !== undefined && f.tuples.every((t) => have.has(t));
      })
      .map((f) => f.raw),
  );
  const params = query.split("&").filter((kv) => !dropped.has(kv));
  return params.some((kv) => kv.startsWith("family=")) ? `${base}?${params.join("&")}` : "";
}

const PAGE_CSS = `
/* Route-scoped: this <style> unmounts when the SPA navigates away. */
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
`;

export interface V4RowsPageProps {
  /** The rows, top to bottom. Pass a module constant (or useMemo): a new array restarts the row engines. */
  rows: V4Row[];
  /** A "Get Started" band after every Nth row, never after the last (default 3; 0 = none). */
  ctaEvery?: number;
  /** Render the template top bar. Default: only when no row brings the hero top bar ({prefix}-top). */
  header?: boolean;
}

const hasTopBar = (r: V4Row): boolean => new RegExp(`class="${r.prefix}-top[\\s"]`).test(r.html);

/** Marks the links of the current route (aria-current) and the More button when one of its items is current. */
function markCurrent(html: string, pathname: string): string {
  let out = html.replace(/<a([^>]*?) href="([^"]+)" data-v4-spa data-v4-nav>/g, (m, pre: string, href: string) => {
    const cur = currentAttr(href, pathname);
    return cur ? `<a${pre} href="${href}" data-v4-spa data-v4-nav aria-current="${cur}">` : m;
  });
  if (MORE_NAV.some((i) => currentAttr(i.href, pathname))) {
    out = out.replace(/class="v4-more-btn"/g, 'class="v4-more-btn" data-active');
  }
  return out;
}

type Prefetchable = Window & { docusaurus?: { prefetch?: (path: string) => unknown } };

export default function V4RowsPage({ rows, ctaEvery = 3, header }: V4RowsPageProps): React.JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const history = useHistory();
  const { siteConfig } = useDocusaurusContext();
  const fontHref = useMemo(() => rowsFontHref(V4_FONT_HREF, String(siteConfig.customFields?.googleFontsHref ?? "")), [siteConfig]);

  // Each row's {__html} object must keep its identity across re-renders: React
  // resets innerHTML whenever that object changes, which would wipe the live DOM
  // the row engines are driving (a hash change or a same-route click re-renders
  // this page). It changes only when the rows or the pathname do.
  const rendered = useMemo(
    () =>
      rows.map((r) => {
        // applyRowFixes here (not in the pages): every row on every rows page gets it.
        const html = markCurrent(applyRowFixes(r).html, pathname);
        return { ...r, html, inner: { __html: html } };
      }),
    [rows, pathname],
  );
  const style = useMemo(
    () => ({
      __html:
        PAGE_CSS +
        "\n" +
        rows.map((r) => `/* ── row ${r.row} · ${r.title.replace(/\*\//g, "")} · v${r.variation} · ${r.prefix}- ── */\n${r.css}`).join("\n\n"),
    }),
    [rows],
  );
  const showHeader = header ?? !rows.some(hasTopBar);
  // A first row that carries the hero top bar is the page's banner: it stays
  // outside <main>; every other row goes inside it.
  const lead = rendered.length && hasTopBar(rendered[0]) ? rendered[0] : null;
  const rowEl = (r: (typeof rendered)[number], i: number): React.JSX.Element => (
    <React.Fragment key={r.row}>
      <div className="v4-row" data-row={r.row} data-prefix={r.prefix} dangerouslySetInnerHTML={r.inner} />
      {ctaEvery > 0 && (i + 1) % ctaEvery === 0 && i < rendered.length - 1 ? (
        <div className="v4-cta">
          <a className="v4-cta__btn" href={SIGNUP}>
            Get Started <span className="v4-cta__arrow" aria-hidden="true">›</span>
          </a>
        </div>
      ) : null}
    </React.Fragment>
  );
  const showFooter = !rows.some((r) => r.hasFooter);

  useRowEngines(rootRef, rendered);

  // Links and the More dropdown inside the row markup (raw HTML, so delegated).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const prefetched = new Set<string>();
    const popOf = (wrap: Element): Element | null => wrap.querySelector(".v4-more-pop");
    const btnOf = (wrap: Element): HTMLElement | null => wrap.querySelector<HTMLElement>(".v4-more-btn");
    /** On screen: opened by click, or (unless closed by click) hovered or holding focus. */
    const isShown = (wrap: Element): boolean => {
      const state = wrap.getAttribute("data-open");
      if (state === "true") return true;
      if (state === "false") return false;
      return wrap.matches(":hover") || !!popOf(wrap)?.matches(":focus-within");
    };
    /** aria-expanded always reports what is on screen. */
    const sync = (wrap: Element): void => {
      btnOf(wrap)?.setAttribute("aria-expanded", String(isShown(wrap)));
    };
    const setMore = (wrap: Element, state: "true" | "false" | null): void => {
      if (state) wrap.setAttribute("data-open", state);
      else wrap.removeAttribute("data-open");
      sync(wrap);
    };

    const onClick = (e: MouseEvent): void => {
      const t = e.target as Element;
      const btn = t.closest?.(".v4-more-btn");
      if (btn) {
        const wrap = btn.closest(".v4-more");
        if (!wrap) return;
        // Keyboard (detail 0): toggle what is on screen. Mouse or touch: toggle the
        // click "pin" only, so a click on a hover-opened panel keeps it open (and a
        // touch tap's emulated hover cannot close it); a second click closes it.
        const shown = e.detail === 0 ? isShown(wrap) : wrap.getAttribute("data-open") === "true";
        setMore(wrap, shown ? "false" : "true");
        return;
      }
      const a = t.closest?.("a[data-v4-spa]") as HTMLAnchorElement | null;
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target && a.target !== "_self") return;
      e.preventDefault();
      a.closest("details")?.removeAttribute("open");
      // The current page: replace, like @docusaurus/Link, so Back is not a no-op.
      const to = a.getAttribute("href") || "/";
      const here = history.location.pathname + history.location.search;
      if (to === here) history.replace(to);
      else history.push(to);
    };
    const onOver = (e: MouseEvent): void => {
      const t = e.target as Element;
      const wrap = t.closest?.(".v4-more");
      if (wrap) sync(wrap);
      const a = t.closest?.("a[data-v4-spa]");
      const href = a?.getAttribute("href");
      if (!href || prefetched.has(href)) return;
      prefetched.add(href);
      (window as Prefetchable).docusaurus?.prefetch?.(href);
    };
    const onOut = (e: MouseEvent): void => {
      const wrap = (e.target as Element).closest?.(".v4-more");
      if (!wrap || wrap.contains(e.relatedTarget as Node | null)) return;
      // The pointer left the dropdown (:hover updates after this event).
      if (wrap.getAttribute("data-open") === "false") wrap.removeAttribute("data-open");
      requestAnimationFrame(() => sync(wrap));
    };
    const onFocusIn = (e: FocusEvent): void => {
      const wrap = (e.target as Element).closest?.(".v4-more");
      if (!wrap) return;
      // Tabbing (back) into the panel after a close shows it again.
      if (popOf(wrap)?.contains(e.target as Node) && wrap.getAttribute("data-open") === "false") wrap.removeAttribute("data-open");
      sync(wrap);
    };
    const onFocusOut = (e: FocusEvent): void => {
      // Focus left an open <details> menu (the hero's MENU): close it, so the
      // panel never covers the control that now has focus.
      const det = (e.target as Element).closest?.("details");
      // A null relatedTarget with the pointer over the panel is a Safari click inside it.
      const to = e.relatedTarget as Node | null;
      if (det?.hasAttribute("open") && (to ? !det.contains(to) : !det.matches(":hover"))) det.removeAttribute("open");
      const wrap = (e.target as Element).closest?.(".v4-more");
      if (!wrap) return;
      if (!wrap.contains(e.relatedTarget as Node | null)) {
        const state = wrap.getAttribute("data-open");
        if (state === "true" || (state === "false" && !wrap.matches(":hover"))) wrap.removeAttribute("data-open");
      }
      // :focus-within updates after this event.
      requestAnimationFrame(() => sync(wrap));
    };
    const onKey = (e: KeyboardEvent): void => {
      if (e.key !== "Escape") return;
      const active = document.activeElement;
      root.querySelectorAll(".v4-more").forEach((w) => {
        const hadFocus = w.contains(active);
        if (w.getAttribute("data-open") === "true" || hadFocus || w.matches(":hover")) setMore(w, "false");
        if (hadFocus) btnOf(w)?.focus();
      });
      root.querySelectorAll("details[open]").forEach((d) => {
        const hadFocus = d.contains(active);
        d.removeAttribute("open");
        if (hadFocus) d.querySelector<HTMLElement>("summary")?.focus();
      });
    };
    const onDown = (e: MouseEvent): void => {
      const t = e.target as Node;
      root.querySelectorAll('.v4-more[data-open="true"]').forEach((w) => !w.contains(t) && setMore(w, null));
      root.querySelectorAll("details[open]").forEach((d) => !d.contains(t) && d.removeAttribute("open"));
    };

    root.addEventListener("click", onClick);
    root.addEventListener("mouseover", onOver);
    root.addEventListener("mouseout", onOut);
    root.addEventListener("focusin", onFocusIn);
    root.addEventListener("focusout", onFocusOut);
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      root.removeEventListener("click", onClick);
      root.removeEventListener("mouseover", onOver);
      root.removeEventListener("mouseout", onOut);
      root.removeEventListener("focusin", onFocusIn);
      root.removeEventListener("focusout", onFocusOut);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [history]);

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {fontHref ? <link rel="stylesheet" href={fontHref} /> : null}
      </Head>

      {/* In the component tree, not <Head>: server-rendered at first paint, and it
          unmounts with the page so nothing leaks to other routes. */}
      <style dangerouslySetInnerHTML={style} />

      <a className="v4-skip" href="#v4-main">Skip to main content</a>

      {showHeader ? <V4Header /> : null}

      <div className="v4" data-v4-theme="dark" ref={rootRef}>
        {lead ? rowEl(lead, 0) : null}
        <main id="v4-main" className="v4-main" tabIndex={-1}>
          {rendered.map((r, i) => (i === 0 && lead ? null : rowEl(r, i)))}
        </main>
      </div>

      {showFooter ? <V4Footer /> : null}
    </>
  );
}
