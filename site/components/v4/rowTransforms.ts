/**
 * rowTransforms — small, regeneration-proof edits to generated homepage rows.
 *
 * The rows in site/pages/_rows.generated.ts are generated (scripts/build-v4-rows.js)
 * and must never be hand-edited. A page that needs a row to say or link something
 * different transforms the row at import time instead:
 *
 *   import { V4_ROWS } from "@site/site/pages/_rows.generated";
 *   import { applySiteNav, pickRows, replaceCopy } from "@site/site/components/v4/rowTransforms";
 *
 *   const ROWS = pickRows([1, 5, 9]).map(applySiteNav);              // a subset, in this order
 *   const HERO = replaceCopy(ROWS[0], [["AI Filmmaking", "AI Movies"]]);  // exact-string copy override
 *
 * Every transform finds its target by the row's class PREFIX + a class SUFFIX
 * ("{prefix}-nav", "{prefix}-menu-pop", "{prefix}-fnav", "{prefix}-social"), never by a hard-coded
 * prefix, so it survives a regeneration that renumbers the variation. When a
 * pattern is missing it console.warns with the row number and returns the row
 * unchanged — the page still renders, just with the generated markup.
 */
import { V4_ROWS, type V4Row } from "../../pages/_rows.generated";
import { FOOTER_COLUMNS, MORE_NAV, PRIMARY_NAV, SIGNIN, SOCIAL, isExternal, type NavItem } from "../../data/siteNav";

const esc = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const reEsc = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * One link as raw HTML. Internal links carry data-v4-spa (V4RowsPage turns
 * their clicks into SPA navigation and prefetches them on hover); `nav` marks
 * links that get aria-current on the matching route.
 */
function linkHtml(item: NavItem, opts: { cls?: string; nav?: boolean; newTab?: boolean } = {}): string {
  const cls = opts.cls ? ` class="${opts.cls}"` : "";
  if (isExternal(item.href)) {
    const tab = opts.newTab || item.newTab ? ` target="_blank" rel="noopener noreferrer"` : "";
    return `<a${cls} href="${esc(item.href)}"${tab}>${esc(item.label)}</a>`;
  }
  return `<a${cls} href="${esc(item.href)}" data-v4-spa${opts.nav ? " data-v4-nav" : ""}>${esc(item.label)}</a>`;
}

/** The element whose class list starts with `{prefix}-{suffix}`, from its open tag to its matching close tag. */
function findBlock(html: string, tag: string, cls: string): { start: number; end: number; open: string } | null {
  const openRe = new RegExp(`<${tag}\\b[^>]*\\bclass="${reEsc(cls)}(?:\\s[^"]*)?"[^>]*>`);
  const m = openRe.exec(html);
  if (!m) return null;
  // Walk to the matching close tag (nesting-aware for the same tag name).
  const tokenRe = new RegExp(`<${tag}\\b[^>]*>|</${tag}>`, "g");
  tokenRe.lastIndex = m.index + m[0].length;
  let depth = 1;
  let t: RegExpExecArray | null;
  while ((t = tokenRe.exec(html))) {
    depth += t[0].startsWith("</") ? -1 : 1;
    if (depth === 0) return { start: m.index, end: t.index + t[0].length, open: m[0] };
  }
  return null;
}

/**
 * Rewrites a row's site navigation to site/data/siteNav.ts:
 *  * the hero top bar's <nav class="{prefix}-nav"> → PRIMARY_NAV + a real "More ⌄"
 *    dropdown of MORE_NAV (always in the DOM, revealed by CSS on hover/focus and
 *    by a click toggle in V4RowsPage; styled by V4RowsPage's page CSS),
 *  * the hero's mobile <div class="{prefix}-menu-pop"> → every PRIMARY + MORE link + Sign in,
 *  * the footer's <nav class="{prefix}-fnav"> → FOOTER_COLUMNS (MCP/CLI internal),
 *  * the footer's <div class="{prefix}-social"> → SOCIAL (the same icons as V4Footer).
 * Rows with neither a top bar ({prefix}-top) nor a footer (hasFooter) come back as is.
 */
export function applySiteNav(row: V4Row): V4Row {
  const p = row.prefix;
  const hasTop = new RegExp(`class="${reEsc(p)}-top(?:\\s[^"]*)?"`).test(row.html);
  if (!hasTop && !row.hasFooter) return row;

  let html = row.html;
  const miss = (what: string): V4Row => {
    console.warn(`[v4] row ${row.row} (${p}): applySiteNav could not find ${what}; row left unchanged`);
    return row;
  };
  const swap = (b: { start: number; end: number }, markup: string): void => {
    html = html.slice(0, b.start) + markup + html.slice(b.end);
  };

  if (hasTop) {
    const nav = findBlock(html, "nav", `${p}-nav`);
    if (!nav) return miss(`<nav class="${p}-nav">`);
    const more =
      `<div class="v4-more">` +
      `<button type="button" class="v4-more-btn" aria-expanded="false" aria-controls="v4-more-pop-${p}">More <span class="${p}-chev" aria-hidden="true">⌄</span></button>` +
      `<div class="v4-more-pop" id="v4-more-pop-${p}">${MORE_NAV.map((i) => linkHtml(i, { nav: true })).join("")}</div>` +
      `</div>`;
    swap(nav, `${nav.open}\n        ${PRIMARY_NAV.map((i) => linkHtml(i, { nav: true })).join("\n        ")}\n        ${more}\n      </nav>`);

    const pop = findBlock(html, "div", `${p}-menu-pop`);
    if (!pop) return miss(`<div class="${p}-menu-pop">`);
    const items = [...PRIMARY_NAV, ...MORE_NAV].map((i) => linkHtml(i, { nav: true }));
    items.push(linkHtml({ label: "Sign in", href: SIGNIN }, { cls: `${p}-menu-sign` }));
    swap(pop, `${pop.open}${items.join("")}</div>`);
  }

  if (row.hasFooter) {
    const fnav = findBlock(html, "nav", `${p}-fnav`);
    if (!fnav) return miss(`<nav class="${p}-fnav">`);
    const cols = FOOTER_COLUMNS.map(
      (c) => `<div><h3>${esc(c.title)}</h3>${c.links.map((l) => linkHtml(l, { newTab: true })).join("")}</div>`,
    );
    swap(fnav, `${fnav.open}\n          ${cols.join("\n          ")}\n        </nav>`);

    const social = findBlock(html, "div", `${p}-social`);
    if (!social) return miss(`<div class="${p}-social">`);
    const icons = SOCIAL.map(
      (s) =>
        `<a href="${esc(s.href)}" aria-label="ACT 3 AI on ${esc(s.label)}" target="_blank" rel="noopener noreferrer">` +
        `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="${esc(s.icon)}"/></svg></a>`,
    );
    swap(social, `${social.open}\n          ${icons.join("\n          ")}\n        </div>`);
  }

  return { ...row, html };
}

/** Exact-string copy overrides on a row's markup (every occurrence). Warns on any `from` it cannot find. */
export function replaceCopy(row: V4Row, pairs: ReadonlyArray<readonly [from: string, to: string]>): V4Row {
  let html = row.html;
  for (const [from, to] of pairs) {
    if (!from || !html.includes(from)) {
      console.warn(`[v4] row ${row.row} (${row.prefix}): replaceCopy found no "${from}"`);
      continue;
    }
    html = html.split(from).join(to);
  }
  return html === row.html ? row : { ...row, html };
}

/** Rows from V4_ROWS by row number, in the order given. Warns on (and skips) unknown numbers. */
export function pickRows(rowNumbers: readonly number[]): V4Row[] {
  const out: V4Row[] = [];
  for (const n of rowNumbers) {
    const r = V4_ROWS.find((x) => x.row === n);
    if (r) out.push(r);
    else console.warn(`[v4] pickRows: no row ${n} in V4_ROWS (have ${V4_ROWS.map((x) => x.row).join(", ")})`);
  }
  return out;
}
