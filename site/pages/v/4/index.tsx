import React, { useEffect, useRef } from "react";
import Head from "@docusaurus/Head";
import { V4_FONT_HREF, V4_ROWS } from "./_rows.generated";

/**
 * Route: /v/4   (also /v/4/ via scripts/emit-trailing-slash-pages.js)
 *
 * The new ACT 3 marketing homepage design, assembled top to bottom from the ONE
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
 * Like /v/2 and /v/3 this page deliberately does NOT use the Docusaurus Layout,
 * SiteNavbar or SiteFooter: row 1 (the hero) carries the top bar and the last
 * row (MCP) carries the footer, so the page renders its own fallback footer
 * only if no approved row includes one. All CSS lives in one <style> in the
 * component tree (server-rendered, no FOUC, unmounts on SPA navigation).
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
 *    reset block below rolls the remaining Infima element styles back to the
 *    browser defaults the rows were designed against.
 *  * SCRIPTS. Plain <script> inside dangerouslySetInnerHTML never runs, so the
 *    row engines are static files loaded in a useEffect, sequentially in the
 *    recorded order (row 2's four demos/N/timing.js before its row.js), as fresh
 *    <script> elements on every mount. Each script element carries a lifecycle
 *    context (__v4ctx) that the generator's wrapper hands to the engine as its
 *    window/document/rAF/timers/observers, so on unmount the page stops every
 *    loop, timer, observer and document/window listener. The engines have no
 *    teardown of their own; without this, SPA navigation would leave them
 *    running on detached DOM and stack a second copy on return.
 */

const SIGNUP = "https://app.act3ai.com/signup/";
const SIGNIN = "https://app.act3ai.com/signin/";
const PLANS = "https://app.act3ai.com/settings/plans/";
const YOUTUBE = "https://www.youtube.com/@ACT3AI";

// A [Get Started] band goes after every CTA_EVERY-th row, never after the last row
// (Bryan, 2026-10-07: "Have [Get Started] call to action buttons between every 3rd row").
const CTA_EVERY = 3;

// The hero's ground colour, so overscroll and the area under a short page match it.
const GROUND = "#060b18";

const PAGE_CSS = `
/* Route-scoped: this <style> unmounts when the SPA navigates away. */
html, body { background: ${GROUND}; }

.v4 {
  position: relative;
  background: ${GROUND};
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

/* [Get Started] call-to-action band between every CTA_EVERY rows (not after the last row).
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

/* Fallback footer, only rendered when no approved row includes the footer. */
.v4-foot { padding: 72px 24px 48px; color: #93a1bf; font: 14px/1.6 Inter, system-ui, sans-serif; }
.v4-foot__in { max-width: 1180px; margin: 0 auto; display: flex; flex-wrap: wrap; gap: 20px 32px; align-items: baseline; justify-content: space-between; }
.v4-foot__links { display: flex; flex-wrap: wrap; gap: 12px 24px; }
.v4 .v4-foot a { color: #f2f6ff; text-decoration: none; }
.v4 .v4-foot a:hover { color: #ffffff; text-decoration: underline; }
.v4[data-v4-theme="light"] .v4-foot { color: #4a5368; }
.v4[data-v4-theme="light"] .v4-foot a { color: #0d1220; }
`;

const ROW_CSS = V4_ROWS.map((r) => `/* ── row ${r.row} · ${r.title.replace(/\*\//g, "")} · v${r.variation} · ${r.prefix}- ── */\n${r.css}`).join("\n\n");
const STYLE_HTML = { __html: PAGE_CSS + "\n" + ROW_CSS };
const ROW_HTML = V4_ROWS.map((r) => ({ __html: r.html }));
const HAS_FOOTER = V4_ROWS.some((r) => r.hasFooter);

// ── lifecycle harness for the row engines ────────────────────────────────────
// Each loaded script reads document.currentScript.__v4ctx and uses it in place of
// the real globals. stop() cancels everything the engine started; once stopped,
// a late-arriving script finds no DOM and allocates nothing.

type AnyFn = (...args: any[]) => any;
type Listener = [EventTarget, string, EventListenerOrEventListenerObject, boolean | AddEventListenerOptions | undefined];
type ScriptWithCtx = HTMLScriptElement & { __v4ctx?: Record<string, unknown> };

function makeRowContext(): { ctx: Record<string, unknown>; stop: () => void } {
  let alive = true;
  const rafs = new Set<number>();
  const timeouts = new Set<number>();
  const intervals = new Set<number>();
  const observers: { disconnect(): void }[] = [];
  const listeners: Listener[] = [];

  const requestAnimationFrame = (cb: FrameRequestCallback): number => {
    if (!alive) return 0;
    const id = window.requestAnimationFrame((t) => {
      rafs.delete(id);
      if (alive) cb(t);
    });
    rafs.add(id);
    return id;
  };
  const cancelAnimationFrame = (id: number): void => {
    rafs.delete(id);
    window.cancelAnimationFrame(id);
  };
  const setTimeout = (cb: TimerHandler, ms?: number, ...args: unknown[]): number => {
    if (!alive || typeof cb !== "function") return 0;
    const id = window.setTimeout(() => {
      timeouts.delete(id);
      if (alive) (cb as AnyFn)(...args);
    }, ms);
    timeouts.add(id);
    return id;
  };
  const clearTimeout = (id?: number): void => {
    if (id === undefined) return;
    timeouts.delete(id);
    window.clearTimeout(id);
  };
  const setInterval = (cb: TimerHandler, ms?: number, ...args: unknown[]): number => {
    if (!alive || typeof cb !== "function") return 0;
    const id = window.setInterval(() => {
      if (alive) (cb as AnyFn)(...args);
    }, ms);
    intervals.add(id);
    return id;
  };
  const clearInterval = (id?: number): void => {
    if (id === undefined) return;
    intervals.delete(id);
    window.clearInterval(id);
  };

  type ObserverCtor = new (cb: AnyFn, options?: unknown) => { observe(...a: unknown[]): void; disconnect(): void };
  const track = (Base: unknown): unknown => {
    if (typeof Base !== "function") return Base;
    const B = Base as ObserverCtor;
    return class extends B {
      constructor(cb: AnyFn, options?: unknown) {
        super((...a: unknown[]) => {
          if (alive) cb(...a);
        }, options);
        observers.push(this);
      }
      observe(...a: unknown[]): void {
        if (alive) super.observe(...a);
      }
    };
  };

  const addFor = (target: EventTarget) => (type: string, fn: EventListenerOrEventListenerObject, opts?: boolean | AddEventListenerOptions): void => {
    if (!alive || !fn) return;
    listeners.push([target, type, fn, opts]);
    target.addEventListener(type, fn, opts);
  };
  const removeFor = (target: EventTarget) => (type: string, fn: EventListenerOrEventListenerObject, opts?: boolean | EventListenerOptions): void => {
    target.removeEventListener(type, fn, opts);
  };

  // Forwarding proxy: overrides win, functions are bound to the real object
  // (lower-case names only, so constructors keep their statics), writes go through.
  const forward = <T extends object>(target: T, extra: Record<string | symbol, unknown>, lookups: boolean): T =>
    new Proxy(target, {
      get(t, p) {
        if (p in extra) return extra[p];
        if (lookups && !alive && typeof p === "string" && /^(querySelector|getElementBy|getElementsBy)/.test(p)) {
          return () => (/All$|^getElements/.test(p) ? [] : null);
        }
        const v = (t as Record<string | symbol, unknown>)[p];
        if (typeof v === "function" && typeof p === "string" && /^[a-z]/.test(p)) return (v as AnyFn).bind(t);
        return v;
      },
      set(t, p, v) {
        (t as Record<string | symbol, unknown>)[p] = v;
        return true;
      },
      has(t, p) {
        return p in extra || p in t;
      },
      deleteProperty(t, p) {
        return delete (t as Record<string | symbol, unknown>)[p];
      },
    });

  const doc = forward(document, { addEventListener: addFor(document), removeEventListener: removeFor(document) }, true);
  const winExtra: Record<string, unknown> = {
    document: doc,
    requestAnimationFrame,
    cancelAnimationFrame,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    IntersectionObserver: track(window.IntersectionObserver),
    ResizeObserver: track(window.ResizeObserver),
    MutationObserver: track(window.MutationObserver),
    addEventListener: addFor(window),
    removeEventListener: removeFor(window),
  };
  const win = forward(window, winExtra, false);
  winExtra.window = win;
  winExtra.self = win;

  const ctx: Record<string, unknown> = { ...winExtra, window: win };
  const stop = (): void => {
    alive = false;
    rafs.forEach((id) => window.cancelAnimationFrame(id));
    timeouts.forEach((id) => window.clearTimeout(id));
    intervals.forEach((id) => window.clearInterval(id));
    observers.forEach((o) => o.disconnect());
    listeners.forEach(([t, type, fn, opts]) => t.removeEventListener(type, fn, opts));
    rafs.clear();
    timeouts.clear();
    intervals.clear();
    observers.length = 0;
    listeners.length = 0;
  };
  return { ctx, stop };
}

function loadScript(src: string, ctx: Record<string, unknown>, added: HTMLScriptElement[]): Promise<boolean> {
  return new Promise((resolve) => {
    const s = document.createElement("script") as ScriptWithCtx;
    s.src = src;
    s.async = false;
    s.__v4ctx = ctx;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    added.push(s);
    document.body.appendChild(s);
  });
}

export default function V4Homepage(): React.JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const w = window as unknown as Record<string, unknown>;

    // Review aid only: ?theme=light | ?theme=dark switches every row together.
    const theme = new URLSearchParams(window.location.search).get("theme");
    if (theme === "light" || theme === "dark") root.setAttribute("data-v4-theme", theme);

    let cancelled = false;
    const added: HTMLScriptElement[] = [];
    const stops: (() => void)[] = [];
    const jobs = V4_ROWS.map((r) => {
      const el = root.querySelector<HTMLElement>(`[data-row="${r.row}"]`);
      // An effect that runs again on the same DOM (React StrictMode in dev)
      // starts from fresh markup, so engines that append nodes cannot double.
      if (el && el.dataset.v4Ran) el.innerHTML = r.html;
      for (const g of r.windowGlobals) delete w[g];
      const { ctx, stop } = makeRowContext();
      stops.push(stop);
      return { r, el, ctx };
    });

    (async () => {
      for (const { r, el, ctx } of jobs) {
        if (!el || r.scripts.length === 0) continue;
        el.dataset.v4Ran = "1";
        for (const src of r.scripts) {
          if (cancelled) return;
          const ok = await loadScript(src, ctx, added);
          if (!ok) {
            console.warn(`[v4] row ${r.row}: failed to load ${src}; skipping the rest of this row's scripts`);
            break;
          }
        }
      }
    })();

    return () => {
      cancelled = true;
      stops.forEach((stop) => stop());
      added.forEach((s) => s.remove());
      root.querySelectorAll("video").forEach((v) => v.pause());
      for (const r of V4_ROWS) for (const g of r.windowGlobals) delete w[g];
    };
  }, []);

  return (
    <>
      <Head>
        <html lang="en" />
        <title>ACT 3 | AI Video Filmmaking — Give a note. See the change.</title>
        <meta
          name="description"
          content="ACT 3 is AI video filmmaking: your storytelling, into video. Chat with your AI filmmaker, give a note, and see the change, from script to finished film."
        />
        {/* Design version, not the canonical homepage. */}
        <meta name="robots" content="noindex, nofollow" />
        <meta name="theme-color" content={GROUND} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {V4_FONT_HREF ? <link rel="stylesheet" href={V4_FONT_HREF} /> : null}
      </Head>

      {/* In the component tree, not <Head>: server-rendered at first paint, and it
          unmounts with the page so nothing leaks to other routes. */}
      <style dangerouslySetInnerHTML={STYLE_HTML} />

      <div className="v4" data-v4-theme="dark" ref={rootRef}>
        {V4_ROWS.map((r, i) => (
          <React.Fragment key={r.row}>
            <div className="v4-row" data-row={r.row} data-prefix={r.prefix} dangerouslySetInnerHTML={ROW_HTML[i]} />
            {(i + 1) % CTA_EVERY === 0 && i < V4_ROWS.length - 1 ? (
              <div className="v4-cta">
                <a className="v4-cta__btn" href={SIGNUP}>
                  Get Started <span className="v4-cta__arrow" aria-hidden="true">›</span>
                </a>
              </div>
            ) : null}
          </React.Fragment>
        ))}

        {HAS_FOOTER ? null : (
          <footer className="v4-foot">
            <div className="v4-foot__in">
              <div className="v4-foot__links">
                <a href={PLANS}>Plans</a>
                <a href={SIGNIN}>Login</a>
                <a href={SIGNUP}>Get Started</a>
                <a href={YOUTUBE} target="_blank" rel="noreferrer">YouTube</a>
                <a href="mailto:ContactUs@ACT3ai.com">Contact</a>
              </div>
              <div>© 2026 ACT 3 AI. All rights reserved.</div>
            </div>
          </footer>
        )}
      </div>
    </>
  );
}
