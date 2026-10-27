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
 * It renders, top to bottom: one <style> (in production only what the page adds to
 * its rows; the page CSS and the rows' own CSS are the shared stylesheet of
 * rowsSheet.ts; the dev server inlines everything),
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
import { ROWS_SHEET_HREF, rowsInlineCss } from "./rowsSheet";

// V4_PAGE_GROUND and the page CSS moved to rowsSheet.ts (pure strings, so
// docusaurus.config.ts can write them into the shared rows stylesheet).
export { V4_PAGE_GROUND } from "./rowsSheet";

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

/** Production builds link the shared rows stylesheet; `docusaurus start` inlines it. */
const LINK_SHEET = process.env.NODE_ENV === "production";

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
  // In a production build the page CSS and every generated row's own CSS come from
  // ONE cached stylesheet (ROWS_SHEET_HREF, written by docusaurus.config.ts), so
  // the HTML no longer carries ~220 KB of inline CSS; only what this page adds to
  // its rows (and any row not in V4_ROWS) stays inline. The dev server inlines it all.
  const style = useMemo(() => ({ __html: rowsInlineCss(rows, LINK_SHEET) }), [rows]);
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
        {LINK_SHEET ? <link rel="stylesheet" href={ROWS_SHEET_HREF} /> : null}
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
