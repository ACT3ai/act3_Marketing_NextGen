// ─────────────────────────────────────────────────────────────────────────────
// Generator for the homepage at / (site/pages/index.tsx) — the "/v/4" design, which became the homepage on 2026-10-08.
//
//   Run by hand from the repo root:   node scripts/build-v4-rows.js [--log <file>]
//
// /v/4 is assembled top to bottom from the ONE approved variation of every row in
//   ~/BGit/all/film/marketing/ACT3_marketing_Home/act3/summary_sections.csv
// (columns: row,title,directory,variation_approved). Each approved row lives in
//   ~/BGit/all/film/marketing/ACT3_marketing_Home/act3/rows/{directory}/v/{variation}/
// (variations sit under the row's v/ directory since 2026-10-05; row-level assets such as
// videos/, demos/ and in/ stay directly in the row directory, two levels up from a variation)
// as a hand-built standalone row.html (or real.html) + row.css + row.js.
//
// This script:
//   * parses the CSV (quoted commas, blank lines), keeps rows with an approval,
//   * inventories each approved variation (markup, css, scripts, assets, fonts,
//     window globals, ids, prefix),
//   * WIPES and rebuilds site/static/v4/ and copies ONLY the referenced assets:
//       files inside VARIATION_DIR       -> /v4/row_{N}/v/...
//       files elsewhere inside ROW_DIR   -> /v4/row_{N}/<same path relative to ROW_DIR>
//       files outside ROW_DIR (row 21)   -> /v4/row_{N}/ext/<path relative to ACT3_marketing_Home>
//   * rewrites every relative reference in markup (src, href, poster, srcset,
//     style url()), CSS url() and JS string literals to those absolute URLs, and
//     FAILS if any relative asset reference is left,
//   * scopes every CSS rule under the page wrapper `.v4` and moves the theme
//     selectors ([data-theme="light"|"dark"]) onto the wrapper attribute
//     data-v4-theme, so Docusaurus' <html data-theme="light"> can never flip a
//     row (the page pins dark; rows 3, 11, 12, 13, 18, 19, 21, 22 are light-first
//     in their own CSS and show their dark variants — see THEME in index.tsx),
//   * fixes prefix / id / keyframe / window-global collisions between rows,
//   * strips Google Font <link>s and CSS @imports (collected, merged, deduped
//     against the site-wide font link in docusaurus.config.ts),
//   * drops standalone-only chrome (configured per variation in CHROME below),
//   * wires the unambiguous placeholder links (Get Started, Login, Plans ...),
//   * adds loading="lazy" to images of every row below the hero,
//   * wraps every row script in a small lifecycle harness (window.__v4ctx) so the
//     page can stop its rAF loops, timers, observers and document/window
//     listeners when the SPA navigates away (row engines have no teardown),
//   * FAILS before touching site/static/v4/ if any referenced asset is missing. The
//     upstream repo git-ignores *.mp4, so a machine without the clips used to ship
//     the posters and silently drop every video (the hero 404s of 2026-10-08),
//   * re-encodes every video that is not already web-ready (H.264 <= 720p, no audio,
//     faststart) with ffmpeg, the settings measured in SPEED_ADVICE,
//   * writes the rewritten scripts to site/static/v4/row_{N}/...,
//   * writes site/pages/_rows.generated.ts.
//
// It is NOT part of `pnpm build`: CI has no access to the marketing directory,
// so the generated output is committed and the build only reads it.
// Idempotent: the only date it writes is the CSV's modification date, so two
// runs in a row produce byte-identical output.
// ─────────────────────────────────────────────────────────────────────────────
const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");

const REPO_DIR = path.join(__dirname, "..");
const MARKETING_HOME_DIR = path.join(os.homedir(), "BGit/all/film/marketing/ACT3_marketing_Home");
const ACT3_DIR = path.join(MARKETING_HOME_DIR, "act3");
const ROWS_DIR = path.join(ACT3_DIR, "rows");
const INPUT_ROWS_FILE = path.join(ACT3_DIR, "summary_sections.csv");
const V4_STATIC_DIR = path.join(REPO_DIR, "site/static/v4");
const V4_STATIC_URL = "/v4";
const V4_ROWS_DATA_FILE = path.join(REPO_DIR, "site/pages/_rows.generated.ts");
const DOCUSAURUS_CONFIG = path.join(REPO_DIR, "docusaurus.config.ts");
const VIDEO_BUDGET_MB = 40;
// Re-encodes are cached by (source bytes, ffmpeg version, settings) so re-runs are fast and byte-identical.
const VIDEO_CACHE_DIR = path.join(REPO_DIR, "node_modules/.cache/build-v4-rows/videos");
const SPEED_ADVICE = "~/BGit/all/film/marketing/ACT3_marketing_Home/video/streaming/speed_advise.mdx";

// Same link targets as site/pages/v/3/index.tsx and site/pages/index.tsx.
const SIGNUP = "https://app.act3ai.com/signup/";
const SIGNIN = "https://app.act3ai.com/signin/";
const PLANS = "https://app.act3ai.com/settings/plans/";
const YOUTUBE = "https://www.youtube.com/@ACT3AI";

// Placeholder links (href="#") whose visible label (or aria-label) is
// unambiguous get a real destination. Visible copy is never changed.
const LINK_MAP = {
  "get started": SIGNUP,
  "login": SIGNIN,
  "log in": SIGNIN,
  "sign in": SIGNIN,
  "plans": PLANS,
  "pricing": PLANS,
  "see the plans": PLANS,
  "about us": "/about",
  "about": "/about",
  "contact": "/contact",
  "articles": "/articles",
  "youtube": YOUTUBE,
  "act 3 ai on x": "https://x.com/act3ai",
  "act 3 ai on linkedin": "https://www.linkedin.com/company/act3ai/",
  // Brand logos go to this page, like v/3's wordmark goes to /v/3.
  "act 3": "/",
  "act 3 ai": "/",
  // Action CTAs that start making something = sign up (v/3: "Start Creating Your Film" -> SIGNUP).
  "start with page one": SIGNUP,
  "start your pilot": SIGNUP,
  "make your pitch spot": SIGNUP,
  "make your first episode": SIGNUP,
  "build marketing videos": SIGNUP,
  "start directing": SIGNUP,
  "start your first scene": SIGNUP,
  "cast your voices": SIGNUP,
};
// Placeholders deliberately NOT wired (destination is a product decision, left
// as authored and listed in the inventory): hero nav categories, "See how it
// works", row 3's four category cards, "How series work", "See how sets work",
// "See how ACT 3 keeps it consistent", and the footer's Documentation, Privacy
// Policy and Terms of Service (no such pages exist on the site yet).

// Standalone-only chrome to leave out, per approved variation ("directory/variation").
// Only row 1 (the hero) keeps a top bar on /v/4.
const CHROME = {
  "row_11_script/4": {
    drop: [{ tag: "div", cls: "r1v4-barwrap", why: "full hero top bar (logo, nav, Login, Get Started, mobile Menu); this variation was designed as a row-1 hero and is used as row 11" }],
    demoteH1: "second <h1> on the page (only the hero keeps the page <h1>); .r1v4-title styles are class-based so the look is unchanged",
    relabel: { from: "ACT 3 hero", to: "Script: you already wrote the movie", why: "the section was labelled as a hero; on /v/4 it is the Script row and the real hero (row 1) owns the hero landmark" },
  },
};
// Rows that legitimately contain a <nav> or <footer> as part of their design.
const CHROME_KEEP = {
  "row_1_hero/27": "the hero's top bar IS the page top bar",
  "row_23_mcp_ai/6": "the last row's approved design includes the site footer (and its footer <nav>)",
  "row_5_consistency/73": "<nav> is the row's own demonstration tabs",
  "row_6_for_movies/55": "<nav> is the row's own demonstration points",
  "row_7_for_tv/35": "<nav> is the row's own demonstration tabs",
  "row_8_script/37": "<nav> is the row's own tabs",
  "row_16_mcp_ai/38": "the last row's approved design includes the site footer (and its footer <nav>)",
};

// ── args / log ───────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const LOG_FILE = argv.includes("--log") ? argv[argv.indexOf("--log") + 1] : null;
const warnings = [];
function log(line) {
  console.log(line);
  if (LOG_FILE) fs.appendFileSync(LOG_FILE, `[build-v4-rows] ${line}\n`);
}
function warn(row, msg) {
  const line = `WARNING row ${row}: ${msg}`;
  warnings.push(line);
  log(line);
}
function fail(msg) {
  const line = `ERROR: ${msg}`;
  if (LOG_FILE) fs.appendFileSync(LOG_FILE, `[build-v4-rows] ${line}\n`);
  console.error(line);
  process.exit(1);
}

// ── CSV ──────────────────────────────────────────────────────────────────────
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') q = false;
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); rows.push(row); row = []; field = "";
    } else field += c;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((f) => f.trim() !== ""));
}

// ── small helpers ────────────────────────────────────────────────────────────
const sha = (s) => crypto.createHash("sha1").update(s).digest("hex");
const isInside = (p, dir) => p === dir || p.startsWith(dir + path.sep);
const ASSET_EXT = /\.(jpe?g|png|webp|gif|svg|avif|mp4|webm|mov|m4v|mp3|wav|ogg|vtt|json|js|css|woff2?|ttf|otf)$/i;
const VIDEO_EXT = /\.(mp4|webm|mov|m4v)$/i;
// "%23" is an encoded "#": url(%23n) inside an SVG data URI points at an element id, never a file.
const isExternal = (u) => /^(?:[a-z][a-z0-9+.-]*:|\/\/|#|%23|\/)/i.test(u) || u === "";

// ── HTML helpers ─────────────────────────────────────────────────────────────
function attr(tag, name) {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return m ? (m[2] ?? m[3] ?? m[4]) : null;
}
// Remove the first element <tag class="... cls ..."> ... </tag> (balanced).
function removeElement(html, tag, cls) {
  const open = new RegExp(`<${tag}\\b[^>]*class="[^"]*\\b${cls}\\b[^"]*"[^>]*>`, "i");
  const m = open.exec(html);
  if (!m) return null;
  const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, "gi");
  re.lastIndex = m.index + m[0].length;
  let depth = 1;
  let t;
  while ((t = re.exec(html))) {
    depth += t[1] ? -1 : 1;
    if (depth === 0) {
      let start = m.index;
      // swallow the indentation / newline the element sat on
      while (start > 0 && /[ \t]/.test(html[start - 1])) start--;
      let end = re.lastIndex;
      if (html[end] === "\n") end++;
      return html.slice(0, start) + html.slice(end);
    }
  }
  return null;
}

// ── JS tokenizer: string literals + comments (enough for these engines) ──────
function scanJs(code) {
  const strings = [];
  const comments = [];
  let i = 0;
  let lastSig = "";
  const regexPrev = /[(,=:[!&|?{};+\-*%<>~^]$|^$|\b(return|typeof|case|do|else|in|of|new|delete|void|throw)$/;
  while (i < code.length) {
    const c = code[i];
    const n = code[i + 1];
    if (c === "/" && n === "/") {
      const e = code.indexOf("\n", i);
      const end = e === -1 ? code.length : e;
      comments.push([i, end]); i = end; continue;
    }
    if (c === "/" && n === "*") {
      const e = code.indexOf("*/", i + 2);
      const end = e === -1 ? code.length : e + 2;
      comments.push([i, end]); i = end; continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      let j = i + 1;
      let simple = true;
      while (j < code.length && code[j] !== c) {
        if (code[j] === "\\") j++;
        else if (c === "`" && code[j] === "$" && code[j + 1] === "{") {
          // template expression: skip to the matching brace (no nested templates here)
          simple = false;
          let d = 0;
          for (; j < code.length; j++) {
            if (code[j] === "{") d++;
            else if (code[j] === "}") { d--; if (d === 0) break; }
          }
        }
        j++;
      }
      strings.push({ start: i, end: j + 1, quote: c, value: code.slice(i + 1, j), simple });
      i = j + 1; lastSig = "x"; continue;
    }
    if (c === "/" && regexPrev.test(lastSig)) {
      // regex literal
      let j = i + 1;
      let cls = false;
      while (j < code.length) {
        if (code[j] === "\\") { j += 2; continue; }
        if (code[j] === "[") cls = true;
        else if (code[j] === "]") cls = false;
        else if (code[j] === "/" && !cls) break;
        else if (code[j] === "\n") break;
        j++;
      }
      i = j + 1;
      while (/[a-z]/i.test(code[i] || "")) i++;
      lastSig = "x"; continue;
    }
    if (!/\s/.test(c)) {
      if (/[\w$]/.test(c)) {
        let j = i;
        while (j < code.length && /[\w$]/.test(code[j])) j++;
        lastSig = code.slice(i, j); i = j; continue;
      }
      lastSig = c;
    }
    i++;
  }
  return { strings, comments };
}

// ── CSS parser (blocks, at-rules) ────────────────────────────────────────────
function stripCssComments(css) {
  let out = "";
  let i = 0;
  while (i < css.length) {
    const c = css[i];
    if (c === "/" && css[i + 1] === "*") {
      const e = css.indexOf("*/", i + 2);
      i = e === -1 ? css.length : e + 2; continue;
    }
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < css.length && css[j] !== c) { if (css[j] === "\\") j++; j++; }
      out += css.slice(i, j + 1); i = j + 1; continue;
    }
    out += c; i++;
  }
  return out;
}
function matchBrace(css, open) {
  let d = 0;
  for (let i = open; i < css.length; i++) {
    const c = css[i];
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < css.length && css[j] !== c) { if (css[j] === "\\") j++; j++; }
      i = j; continue;
    }
    if (c === "{") d++;
    else if (c === "}") { d--; if (d === 0) return i; }
  }
  return -1;
}
function parseCss(css) {
  const nodes = [];
  let i = 0;
  while (i < css.length) {
    while (i < css.length && /\s/.test(css[i])) i++;
    if (i >= css.length) break;
    let j = i;
    // find next ; or { at depth 0 (outside strings / parens)
    let paren = 0;
    while (j < css.length) {
      const c = css[j];
      if (c === '"' || c === "'") {
        let k = j + 1;
        while (k < css.length && css[k] !== c) { if (css[k] === "\\") k++; k++; }
        j = k + 1; continue;
      }
      if (c === "(") paren++;
      else if (c === ")") paren--;
      else if (paren === 0 && (c === "{" || c === ";")) break;
      j++;
    }
    const prelude = css.slice(i, j).trim();
    if (css[j] === ";" || j >= css.length) {
      nodes.push({ type: "statement", prelude });
      i = j + 1; continue;
    }
    const close = matchBrace(css, j);
    if (close === -1) throw new Error(`unbalanced CSS near: ${prelude.slice(0, 60)}`);
    const body = css.slice(j + 1, close);
    if (prelude.startsWith("@")) {
      const name = prelude.slice(1).split(/[\s(]/)[0].toLowerCase();
      if (["media", "supports", "container", "layer", "document"].includes(name)) {
        nodes.push({ type: "group", prelude, children: parseCss(body) });
      } else {
        nodes.push({ type: "atblock", name, prelude, body });
      }
    } else {
      nodes.push({ type: "rule", selector: prelude, body });
    }
    i = close + 1;
  }
  return nodes;
}
function splitTopLevel(s, sep) {
  const out = [];
  let d = 0;
  let cur = "";
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === "(" || c === "[") d++;
    else if (c === ")" || c === "]") d--;
    if (c === sep && d === 0) { out.push(cur); cur = ""; continue; }
    cur += c;
  }
  out.push(cur);
  return out;
}
function cleanBody(body) {
  return body.split("\n").map((l) => l.trim()).filter(Boolean).join(" ").trim();
}

// ── inventory ────────────────────────────────────────────────────────────────
log(`build-v4-rows: reading ${INPUT_ROWS_FILE}`);
if (!fs.existsSync(INPUT_ROWS_FILE)) fail(`CSV not found: ${INPUT_ROWS_FILE}`);
const csvRows = parseCsv(fs.readFileSync(INPUT_ROWS_FILE, "utf8"));
const header = csvRows.shift().map((h) => h.trim());
if (header.join(",") !== "row,title,directory,variation_approved") fail(`unexpected CSV header: ${header.join(",")}`);
const csvDate = fs.statSync(INPUT_ROWS_FILE).mtime.toISOString().slice(0, 10);

const entries = csvRows
  .map((r) => ({ row: parseInt(r[0], 10), title: (r[1] || "").trim(), directory: (r[2] || "").trim(), variation: (r[3] || "").trim() }))
  .filter((r) => !Number.isNaN(r.row))
  .sort((a, b) => a.row - b.row);

const notApproved = [];
const errored = [];
const approved = [];
for (const e of entries) {
  if (!e.variation || ["none", "skip"].includes(e.variation.toLowerCase())) {
    notApproved.push(e); log(`row ${e.row} (${e.title}): not approved yet, left off`); continue;
  }
  e.rowDir = path.join(ROWS_DIR, e.directory);
  e.varDir = path.join(e.rowDir, "v", e.variation);
  if (!fs.existsSync(e.varDir) || !fs.statSync(e.varDir).isDirectory()) {
    errored.push(e); warn(e.row, `VARIATION_DIR does not exist: ${e.varDir} — row left off`); continue;
  }
  approved.push(e);
}
if (approved.length === 0) {
  console.log(`
=====================================================
  No row in summary_sections.csv has variation_approved filled in.
  Fill in the 4th column for at least row 1, then re-run.
=====================================================
`);
  process.exit(1);
}

// URL mapping for a source file / directory of a row.
function urlFor(e, abs) {
  if (isInside(abs, e.varDir)) return `${V4_STATIC_URL}/row_${e.row}/v/${path.relative(e.varDir, abs).split(path.sep).join("/")}`;
  if (isInside(abs, e.rowDir)) return `${V4_STATIC_URL}/row_${e.row}/${path.relative(e.rowDir, abs).split(path.sep).join("/")}`;
  if (isInside(abs, MARKETING_HOME_DIR)) return `${V4_STATIC_URL}/row_${e.row}/ext/${path.relative(MARKETING_HOME_DIR, abs).split(path.sep).join("/")}`;
  fail(`row ${e.row}: reference resolves outside ${MARKETING_HOME_DIR}: ${abs}`);
}

for (const e of approved) {
  const key = `${e.directory}/${e.variation}`;
  e.key = key;
  e.assets = new Map(); // abs -> url
  e.missing = [];
  e.fontUrls = [];
  e.notes = [];
  e.linksWired = [];
  e.placeholderLinks = [];
  e.globalCss = [];

  // markup source
  const rowHtml = path.join(e.varDir, "row.html");
  const realHtml = path.join(e.varDir, "real.html");
  let src = fs.existsSync(rowHtml) ? rowHtml : fs.existsSync(realHtml) ? realHtml : null;
  if (!src) { errored.push(e); warn(e.row, `no row.html or real.html in ${e.varDir}`); continue; }
  const srcReal = fs.realpathSync(src);
  e.markupSource = src + (srcReal !== src ? ` -> ${path.basename(srcReal)}` : "");
  let html = fs.readFileSync(src, "utf8");
  const htmlDir = path.dirname(srcReal);
  const fullDoc = /<body[\s>]/i.test(html);
  let headPart = "";
  if (fullDoc) {
    headPart = (html.match(/<head[\s\S]*?<\/head>/i) || [""])[0];
    html = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)[1];
    e.notes.push("full HTML document: kept only <body> content (dropped doctype, <html>, <head>, <title>, head comments, body wrapper)");
  }
  html = html.replace(/<!--[\s\S]*?-->/g, "");

  // links (fonts / stylesheets) from head and markup
  const cssFiles = [];
  const linkRe = /<link\b[^>]*>/gi;
  for (const tag of [...(headPart.match(linkRe) || []), ...(html.match(linkRe) || [])]) {
    const rel = (attr(tag, "rel") || "").toLowerCase();
    const href = attr(tag, "href") || "";
    if (/fonts\.googleapis\.com\/css/.test(href)) e.fontUrls.push(href.replace(/&amp;/g, "&"));
    else if (rel === "preconnect" || rel === "dns-prefetch") { /* page adds its own preconnects */ }
    else if (rel === "stylesheet" && !isExternal(href)) cssFiles.push(path.resolve(htmlDir, href));
    else warn(e.row, `unhandled <link> dropped: ${tag}`);
  }
  html = html.replace(linkRe, "");

  // scripts
  const scripts = [];
  const externalScripts = [];
  const scriptRe = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  for (const sm of [...headPart.matchAll(scriptRe), ...html.matchAll(scriptRe)]) {
    const s = attr(`<x ${sm[1]}>`, "src");
    if (s) {
      // A version-pinned library from cdnjs (e.g. three.js r128) is loaded as-is, before the row's own scripts.
      if (/^https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/[^/]+\/[^/]*\d[^/]*\//.test(s)) { externalScripts.push(s); e.notes.push(`external library loaded first: ${s}`); }
      else if (isExternal(s)) warn(e.row, `external script ignored: ${s}`);
      else scripts.push(path.resolve(htmlDir, s));
    } else if (sm[2].trim()) fail(`row ${e.row}: inline <script> without src is not supported (${e.markupSource})`);
  }
  html = html.replace(scriptRe, "");
  if (scripts.length === 0 && fs.existsSync(path.join(e.varDir, "row.js"))) {
    scripts.push(path.join(e.varDir, "row.js"));
    e.notes.push("row.js loaded by convention (markup has no <script> tag)");
  }
  if (cssFiles.length === 0 && fs.existsSync(path.join(e.varDir, "row.css"))) cssFiles.push(path.join(e.varDir, "row.css"));
  for (const f of [...cssFiles, ...scripts]) if (!fs.existsSync(f)) fail(`row ${e.row}: referenced file missing: ${f}`);
  e.cssFiles = cssFiles;
  e.scriptFiles = scripts;
  e.externalScripts = externalScripts;
  e.html = html.replace(/\n\s*\n+/g, "\n").trim();

  const pm = e.html.match(/class="[^"]*\b(r\d+v\d+)-row\b/);
  if (!pm) fail(`row ${e.row}: cannot find the <section class="r{N}v{V}-row"> prefix in ${e.markupSource}`);
  e.prefix = pm[1];
  e.originalPrefix = pm[1];
}
const rows = approved.filter((e) => !errored.includes(e));

// ── prefix collisions ────────────────────────────────────────────────────────
const collisions = [];
const byPrefix = new Map();
for (const e of rows) byPrefix.set(e.prefix, [...(byPrefix.get(e.prefix) || []), e]);
for (const [prefix, group] of byPrefix) {
  if (group.length < 2) continue;
  const keep = group.find((e) => prefix === `r${e.row}v${e.variation}`) || group[0];
  for (const e of group) {
    if (e === keep) continue;
    let np = `r${e.row}v${e.variation}`;
    while (rows.some((o) => o.prefix === np)) np += "x";
    e.prefix = np;
    const msg = `prefix collision: rows ${group.map((g) => g.row).join(" & ")} both use ${prefix}-; row ${e.row} renamed ${prefix}- -> ${np}- (classes, ids, aria refs, custom properties, keyframes, JS)`;
    collisions.push(msg);
    log(msg);
  }
}
function renamePrefix(text, from, to) {
  if (from === to) return text;
  return text.replace(new RegExp(`(?<![A-Za-z0-9_])${from}-`, "g"), `${to}-`);
}
// Every element id in every row's markup (after prefix renames), so a same-page
// "#frag" link whose target exists in no row can be treated as a placeholder.
const ALL_IDS = new Set(rows.flatMap((e) => [...renamePrefix(e.html, e.originalPrefix, e.prefix).matchAll(/\sid\s*=\s*["']([^"']+)["']/g)].map((m) => m[1])));

// ── per row: CSS, markup, JS rewriting ───────────────────────────────────────
function resolveRef(e, ref, baseDir, where) {
  const clean = ref.split(/[?#]/)[0];
  const suffix = ref.slice(clean.length);
  let abs;
  try { abs = path.resolve(baseDir, decodeURI(clean)); } catch { abs = path.resolve(baseDir, clean); }
  if (clean.endsWith("/")) {
    fail(`row ${e.row}: runtime path PREFIX "${ref}" in ${where}: files built from it cannot be inventoried; list them explicitly`);
  }
  if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) {
    e.missing.push(`${ref} (${where}) -> ${abs}`);
    warn(e.row, `referenced asset does not exist: ${ref} (${where}) -> ${abs}`);
  } else {
    e.assets.set(abs, urlFor(e, abs));
  }
  return urlFor(e, abs) + suffix;
}

const keyframeNames = new Map(); // name -> row
for (const e of rows) {
  // CSS
  let cssOut = [];
  for (const f of e.cssFiles) {
    let css = stripCssComments(fs.readFileSync(f, "utf8"));
    css = renamePrefix(css, e.originalPrefix, e.prefix);
    const nodes = parseCss(css);
    const renameKf = new Map();
    const P = e.prefix;
    const scopeSelector = (sel) => {
      const parts = splitTopLevel(sel, ",").map((s) => s.trim()).filter(Boolean);
      const out = [];
      for (let s of parts) {
        const orig = s;
        s = s.replace(/\[data-theme(\s*[~|^$*]?=\s*(["']?)[^\]]*?\2\s*)?\]/g, (m, v) => `[data-v4-theme${v || ""}]`);
        const first = s.match(/^(html|body|:root)(?![\w-])((?:\[[^\]]*\]|:[\w-]+(?:\([^)]*\))?)*)/i);
        if (first) {
          if (/:not\(\[data-v4-theme\]\)/.test(first[2])) {
            e.globalCss.push(`dropped "${orig}" (OS prefers-color-scheme fallback for an un-themed <html>; dead on Docusaurus and on /v/4, which always pins data-v4-theme)`);
            continue;
          }
          const rest = s.slice(first[0].length);
          e.globalCss.push(`global "${orig}" scoped to ".v4${rest}"`);
          out.push(`.v4${rest}`);
          continue;
        }
        if (!s.includes(`.${P}-`) && !s.includes(`[data-${P}`)) e.globalCss.push(`global "${orig}" scoped to ".v4 ${s}"`);
        if (/^\[data-v4-theme/.test(s)) {
          const m = s.match(/^\[data-v4-theme[^\]]*\]/)[0];
          const rest = s.slice(m.length);
          out.push(/^[\s>+~]/.test(rest) ? `.v4${m}${rest}` : `.v4 ${s}`);
        } else out.push(`.v4 ${s}`);
      }
      return out.join(",\n");
    };
    const walk = (list, depth) => {
      const res = [];
      for (const n of list) {
        if (n.type === "statement") {
          const imp = n.prelude.match(/^@import\s+(?:url\()?\s*["']?([^"')\s]+)["']?\s*\)?/i);
          if (imp && /fonts\.googleapis\.com\/css/.test(imp[1])) { e.fontUrls.push(imp[1]); e.notes.push(`Google Fonts @import removed from CSS (moved to <Head>)`); continue; }
          if (/^@charset/i.test(n.prelude)) continue;
          fail(`row ${e.row}: unsupported CSS statement in ${f}: ${n.prelude}`);
        } else if (n.type === "group") {
          const kids = walk(n.children, depth + 1);
          if (kids.length) res.push(`${n.prelude} {\n${kids.join("\n")}\n}`);
        } else if (n.type === "atblock") {
          if (/keyframes$/.test(n.name)) {
            const name = n.prelude.split(/\s+/)[1];
            let nn = name;
            if (!name.startsWith(`${P}-`)) {
              nn = `${P}-${name}`;
              renameKf.set(name, nn);
              e.globalCss.push(`@keyframes ${name} renamed ${nn}`);
            }
            if (keyframeNames.has(nn) && keyframeNames.get(nn) !== e.row) fail(`keyframes ${nn} defined by rows ${keyframeNames.get(nn)} and ${e.row}`);
            keyframeNames.set(nn, e.row);
            res.push(`${n.prelude.replace(name, nn)} {${n.body.replace(/\s+/g, " ")}}`);
          } else if (n.name === "font-face") {
            e.globalCss.push("@font-face kept (global by nature)");
            res.push(`${n.prelude} {${cleanBody(n.body)}}`);
          } else if (n.name === "property") {
            const pn = n.prelude.split(/\s+/)[1];
            if (!pn.startsWith(`--${P}-`)) warn(e.row, `@property ${pn} is not row-prefixed`);
            e.globalCss.push(`@property ${pn} kept (global at-rule, name already row-prefixed)`);
            res.push(`${n.prelude} {${cleanBody(n.body)}}`);
          } else {
            warn(e.row, `unhandled at-rule kept as-is: ${n.prelude}`);
            res.push(`${n.prelude} {${n.body}}`);
          }
        } else {
          const sel = scopeSelector(n.selector);
          if (sel) res.push(`${sel} { ${cleanBody(n.body)} }`);
        }
      }
      return res;
    };
    let out = walk(nodes, 0).join("\n");
    for (const [from, to] of renameKf) {
      out = out.replace(/(animation(?:-name)?\s*:[^;}]*)/g, (m) => m.replace(new RegExp(`(?<![\\w-])${from}(?![\\w-])`, "g"), to));
    }
    // url() in CSS
    out = out.replace(/url\(\s*(["']?)([^"')]+)\1\s*\)/g, (m, q, u) => {
      if (isExternal(u) || u.startsWith("data:")) return m;
      return `url("${resolveRef(e, u, path.dirname(f), path.basename(f))}")`;
    });
    cssOut.push(out);
  }
  e.css = cssOut.join("\n");
  if (/url\(\s*["']?\.\.?\//.test(e.css)) fail(`row ${e.row}: relative url() left in CSS`);

  // markup
  let html = renamePrefix(e.html, e.originalPrefix, e.prefix);
  const htmlDir = path.dirname(fs.realpathSync(e.markupSource.split(" -> ")[0]));
  const chrome = CHROME[e.key];
  if (chrome) {
    for (const d of chrome.drop || []) {
      const r = removeElement(html, d.tag, d.cls);
      if (r === null) warn(e.row, `chrome element <${d.tag} class="${d.cls}"> not found (approval changed?)`);
      else { html = r; e.notes.push(`chrome dropped: <${d.tag} class="${d.cls}"> — ${d.why}`); }
    }
    if (chrome.demoteH1 && /<h1\b/i.test(html)) {
      html = html.replace(/<h1\b/gi, "<h2").replace(/<\/h1>/gi, "</h2>");
      e.notes.push(`<h1> demoted to <h2> — ${chrome.demoteH1}`);
    }
    if (chrome.relabel) {
      const { from, to, why } = chrome.relabel;
      const needle = `aria-label="${from}"`;
      if (!html.includes(needle)) warn(e.row, `aria-label "${from}" not found (approval changed?)`);
      else { html = html.split(needle).join(`aria-label="${to}"`); e.notes.push(`aria-label "${from}" -> "${to}" — ${why}`); }
    }
  }
  if (e !== rows[0] && /<(nav|footer)\b/i.test(html) && !CHROME_KEEP[e.key]) {
    warn(e.row, "markup contains <nav>/<footer>; check whether it is standalone-only chrome (add to CHROME or CHROME_KEEP)");
  }
  if (CHROME_KEEP[e.key]) e.notes.push(`kept <nav>/<footer>: ${CHROME_KEEP[e.key]}`);
  e.hasFooter = /<footer\b/i.test(html);

  // asset attributes
  html = html.replace(/(\s)(src|href|poster|data-src|xlink:href)(\s*=\s*)(["'])([^"']*)\4/gi, (m, sp, name, eq, q, val) => {
    if (isExternal(val)) return m;
    const bare = !/^\.\.?\//.test(val);
    if (bare && !ASSET_EXT.test(val.split(/[?#]/)[0])) { warn(e.row, `relative ${name}="${val}" is not an asset; left as-is`); return m; }
    return `${sp}${name}${eq}${q}${resolveRef(e, val, htmlDir, `markup ${name}`)}${q}`;
  });
  // data-srcset too: row 2 fills srcset from it at runtime (a relative one 404'd as /images/... on 2026-10-08).
  html = html.replace(/(\s)(srcset|data-srcset)(\s*=\s*)(["'])([^"']*)\4/gi, (m, sp, name, eq, q, val) => {
    const rewritten = val.split(",").map((c) => {
      const [u, ...d] = c.trim().split(/\s+/);
      return [isExternal(u) ? u : resolveRef(e, u, htmlDir, `markup ${name}`), ...d].join(" ");
    }).join(", ");
    return `${sp}${name}${eq}${q}${rewritten}${q}`;
  });
  html = html.replace(/url\(\s*(&quot;|["']?)([^"')&]+)\1\s*\)/g, (m, q, u) => (isExternal(u) || u.startsWith("data:") ? m : `url('${resolveRef(e, u, htmlDir, "markup style url()")}')`));

  // placeholder links
  html = html.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (m, attrs, inner) => {
    const href = attr(`<a ${attrs}>`, "href");
    // "#" placeholders, plus same-page "#frag" anchors whose target id exists in
    // no row's markup (row 6 "Start with page one" -> #movies).
    if (href !== "#" && !(href && /^#[\w-]+$/.test(href) && !ALL_IDS.has(href.slice(1)))) return m;
    const text = inner.replace(/<span[^>]*aria-hidden="true"[^>]*>[\s\S]*?<\/span>/gi, "").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/[›→←»]/g, "").replace(/\s+/g, " ").trim();
    const label = (text || attr(`<a ${attrs}>`, "aria-label") || "").toLowerCase();
    const target = LINK_MAP[label];
    if (!target) {
      if (href !== "#") warn(e.row, `link "${text}" points at ${href}, which no row on the page defines; left as authored`);
      e.placeholderLinks.push(text || `[${attr(`<a ${attrs}>`, "aria-label") || "no label"}]`);
      return m;
    }
    e.linksWired.push(`"${text || label}" -> ${target}`);
    const ext = /^https?:/.test(target);
    let a2 = attrs.replace(/\shref\s*=\s*"#[\w-]*"/i, ` href="${target}"`);
    if (ext && !/target=/.test(a2) && !target.startsWith("https://app.act3ai.com")) a2 += ` target="_blank" rel="noreferrer"`;
    return `<a${a2}>${inner}</a>`;
  });

  // lazy images below the hero
  if (e !== rows[0]) {
    let added = 0;
    html = html.replace(/<img\b(?![^>]*\bloading=)([^>]*?)(\/?)>/gi, (m, a, sl) => { added++; return `<img${a} loading="lazy"${sl}>`; });
    if (added) e.notes.push(`loading="lazy" added to ${added} <img> without it`);
  }
  // videos
  for (const v of html.match(/<video\b[^>]*>/gi) || []) {
    for (const need of ["muted", "playsinline", "poster"]) if (!new RegExp(`\\s${need}\\b`, "i").test(v)) warn(e.row, `<video> without ${need}: ${v}`);
  }
  // leftover relative refs in markup
  for (const m of html.matchAll(/\s(?:src|href|poster|data-src|srcset|data-srcset)\s*=\s*["']([^"']*)["']/gi)) {
    for (const u of m[1].split(",").map((c) => c.trim().split(/\s+/)[0])) {
      if (/^\.\.?\//.test(u) || (!isExternal(u) && ASSET_EXT.test(u.split(/[?#]/)[0]))) fail(`row ${e.row}: relative reference left in markup: ${u}`);
    }
  }
  e.html = html.trim();
  e.ids = [...e.html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);

  // scripts
  e.scripts = [];
  e.windowGlobals = [];
  for (const f of e.scriptFiles) {
    let code = fs.readFileSync(f, "utf8");
    code = renamePrefix(code, e.originalPrefix, e.prefix);
    const { strings } = scanJs(code);
    let out = "";
    let last = 0;
    for (const s of strings) {
      const v = s.value;
      const looksPath = s.simple && (/^\.\.?\//.test(v) || (/^[\w\-./]+$/.test(v) && ASSET_EXT.test(v) && !/^[\w-]+\.(js|css|json)$/.test(v) && v.includes(".")));
      if (!looksPath) continue;
      if (!/^\.\.?\//.test(v) && !fs.existsSync(path.resolve(path.dirname(f), v))) continue; // bare token that is not a file
      out += code.slice(last, s.start) + s.quote + resolveRef(e, v, path.dirname(f), `${path.relative(e.rowDir, f)} string`) + s.quote;
      last = s.end;
    }
    code = out + code.slice(last);
    for (const s of scanJs(code).strings) if (/^\.\.?\//.test(s.value)) fail(`row ${e.row}: relative path string left in ${f}: "${s.value}"`);
    for (const m of code.matchAll(/window\.([A-Za-z_$][\w$]*)\s*=(?!=)/g)) if (!e.windowGlobals.includes(m[1])) e.windowGlobals.push(m[1]);
    for (const m of code.matchAll(/window\[\s*["']([^"']+)["']\s*\]\s*=(?!=)/g)) if (!e.windowGlobals.includes(m[1])) e.windowGlobals.push(m[1]);
    for (const m of code.matchAll(/\(window\.([A-Za-z_$][\w$]*)\s*=\s*window\.\1\s*\|\|/g)) if (!e.windowGlobals.includes(m[1])) e.windowGlobals.push(m[1]);
    // Computed keys built from a string-literal variable: var P = 'r1v27-'; window[P + 'hero'] = {...}
    const strVars = new Map([...code.matchAll(/\b(?:var|let|const)\s+([A-Za-z_$][\w$]*)\s*=\s*["']([^"'\\]*)["']\s*[;,\n]/g)].map((m) => [m[1], m[2]]));
    for (const m of code.matchAll(/window\[\s*([A-Za-z_$][\w$]*)\s*\+\s*["']([^"']*)["']\s*\]\s*=(?!=)/g)) {
      if (!strVars.has(m[1])) { warn(e.row, `window[${m[1]} + "${m[2]}"] written with a key that cannot be resolved; it will not be reset on mount`); continue; }
      const g = strVars.get(m[1]) + m[2];
      if (!e.windowGlobals.includes(g)) e.windowGlobals.push(g);
    }
    const url = urlFor(e, f);
    const wrapped =
      `/* GENERATED by scripts/build-v4-rows.js from ${path.relative(MARKETING_HOME_DIR, f)} — do not hand-edit.\n` +
      ` * Wrapped in the /v/4 lifecycle harness: site/pages/index.tsx puts a context on the <script> element\n` +
      ` * (document.currentScript.__v4ctx) that hands the engine tracked timers, rAF, observers and document/window\n` +
      ` * listeners, so the page can stop them on SPA navigation. Without the page it falls back to the real globals. */\n` +
      `;(function (__v4) {\n` +
      `var window = __v4.window, self = __v4.window, document = __v4.document,\n` +
      `  requestAnimationFrame = __v4.requestAnimationFrame, cancelAnimationFrame = __v4.cancelAnimationFrame,\n` +
      `  setTimeout = __v4.setTimeout, clearTimeout = __v4.clearTimeout, setInterval = __v4.setInterval, clearInterval = __v4.clearInterval,\n` +
      `  IntersectionObserver = __v4.IntersectionObserver, ResizeObserver = __v4.ResizeObserver, MutationObserver = __v4.MutationObserver,\n` +
      `  addEventListener = __v4.addEventListener, removeEventListener = __v4.removeEventListener;\n` +
      code.replace(/\s+$/, "") +
      `\n}).call(window, (document.currentScript && document.currentScript.__v4ctx) || { window: window, document: document,\n` +
      `  requestAnimationFrame: window.requestAnimationFrame.bind(window), cancelAnimationFrame: window.cancelAnimationFrame.bind(window),\n` +
      `  setTimeout: window.setTimeout.bind(window), clearTimeout: window.clearTimeout.bind(window),\n` +
      `  setInterval: window.setInterval.bind(window), clearInterval: window.clearInterval.bind(window),\n` +
      `  IntersectionObserver: window.IntersectionObserver, ResizeObserver: window.ResizeObserver, MutationObserver: window.MutationObserver,\n` +
      `  addEventListener: window.addEventListener.bind(window), removeEventListener: window.removeEventListener.bind(window) });\n`;
    e.scripts.push({ src: f, url, code: wrapped });
  }
}

// ── cross-row checks ─────────────────────────────────────────────────────────
const idOwner = new Map();
for (const e of rows) for (const id of e.ids) {
  if (idOwner.has(id) && idOwner.get(id) !== e.row) fail(`duplicate element id "${id}" in rows ${idOwner.get(id)} and ${e.row}`);
  idOwner.set(id, e.row);
}
const globalOwner = new Map();
for (const e of rows) for (const g of e.windowGlobals) {
  if (globalOwner.has(g) && globalOwner.get(g) !== e.row) fail(`window global "${g}" written by rows ${globalOwner.get(g)} and ${e.row}`);
  globalOwner.set(g, e.row);
}
const prefixes = rows.map((e) => e.prefix);
if (new Set(prefixes).size !== prefixes.length) fail("prefix collision remains after renaming");

// ── missing assets: stop before site/static/v4/ is wiped ─────────────────────
const missingAll = rows.flatMap((e) => e.missing.map((m) => `row ${e.row}: ${m}`));
if (missingAll.length) {
  const videos = missingAll.some((m) => VIDEO_EXT.test(m.split(" (")[0]));
  console.log(`
=====================================================
  ${missingAll.length} referenced asset(s) do not exist on this machine:
${missingAll.map((l) => "  " + l).join("\n")}
${videos ? `  ~/BGit/all git-ignores *.mp4, so the clips exist only where they were made.
  Copy them onto this machine (or build where they are) and re-run.
` : ""}  Nothing was changed: the live /v/4 would 404 on every missing file.
=====================================================
`);
  if (LOG_FILE) fs.appendFileSync(LOG_FILE, `[build-v4-rows] ERROR: ${missingAll.length} missing asset(s)\n`);
  process.exit(1);
}

// ── videos: web-ready encodes ────────────────────────────────────────────────
// Every <video> on /v/4 is a muted loop. Generator-native masters (Veo) arrive at 3–19 Mbps with an audio
// track and the moov atom at the END, so Chrome needs three Range requests before the first frame
// (measured: 4.5 s to playing on Fast 4G instead of 0.36 s). A video that is not already web-ready is
// re-encoded on its way into site/static: H.264 High, yuv420p, short side at most 720, CRF 26, no audio,
// keyframe every 2 s, faststart. Measurements and the rejected options (HLS/DASH, AV1): SPEED_ADVICE.
const WEB_VIDEO = {
  maxShortSide: 720,
  maxKbps: 8000,
  args: ["-map", "0:v:0", "-an", "-sn", "-dn", "-map_metadata", "-1", "-map_chapters", "-1",
    "-vf", "scale='if(gt(iw,ih),-2,min(720,iw))':'if(gt(iw,ih),min(720,ih),-2)'",
    "-c:v", "libx264", "-preset", "slow", "-crf", "26", "-profile:v", "high", "-pix_fmt", "yuv420p",
    "-force_key_frames", "expr:gte(t,n_forced*2)", "-movflags", "+faststart",
    "-fflags", "+bitexact", "-flags:v", "+bitexact"],
};
const { execFileSync } = require("child_process");
function tool(name) {
  try { return execFileSync(name, ["-version"], { encoding: "utf8" }).split("\n")[0]; }
  catch { fail(`${name} is needed to check and re-encode the /v/4 videos: brew install ffmpeg`); }
}
// Top-level MP4 boxes in file order: faststart means moov comes before mdat.
function moovFirst(file) {
  const fd = fs.openSync(file, "r");
  const size = fs.fstatSync(fd).size;
  const h = Buffer.alloc(16);
  try {
    for (let pos = 0; pos + 8 <= size;) {
      fs.readSync(fd, h, 0, 16, pos);
      let len = h.readUInt32BE(0);
      const type = h.toString("latin1", 4, 8);
      if (type === "moov") return true;
      if (type === "mdat") return false;
      if (len === 1) len = Number(h.readBigUInt64BE(8));
      else if (len === 0) len = size - pos;
      if (len < 8) return false;
      pos += len;
    }
  } finally { fs.closeSync(fd); }
  return false;
}
// Why a video needs a re-encode, or [] when it can ship as it is.
function webProblems(file) {
  const info = JSON.parse(execFileSync("ffprobe", ["-v", "error", "-print_format", "json", "-show_streams", "-show_format", file], { encoding: "utf8" }));
  const v = info.streams.find((s) => s.codec_type === "video");
  const why = [];
  if (!v) return ["no video stream"];
  if (v.codec_name !== "h264") why.push(`codec ${v.codec_name}`);
  if (!["yuv420p", "yuvj420p"].includes(v.pix_fmt)) why.push(`pixel format ${v.pix_fmt}`);
  if (Math.min(v.width, v.height) > WEB_VIDEO.maxShortSide) why.push(`${v.width}x${v.height}`);
  if (info.streams.some((s) => s.codec_type === "audio")) why.push("audio track");
  const kbps = Math.round(Number(info.format.bit_rate || 0) / 1000);
  if (kbps > WEB_VIDEO.maxKbps) why.push(`${kbps} kbps`);
  if (/\.(mp4|m4v|mov)$/i.test(file) && !moovFirst(file)) why.push("moov at the end (no faststart)");
  return why;
}
const videoSources = [...new Set(rows.flatMap((e) => [...e.assets.keys()].filter((abs) => VIDEO_EXT.test(abs))))];
const webVideo = new Map(); // source abs -> file to publish
if (videoSources.length) {
  tool("ffprobe");
  let ffmpegVersion = null;
  for (const abs of videoSources) {
    const why = webProblems(abs);
    if (!why.length) { webVideo.set(abs, abs); continue; }
    ffmpegVersion = ffmpegVersion || tool("ffmpeg");
    const key = sha(Buffer.concat([fs.readFileSync(abs), Buffer.from(ffmpegVersion + JSON.stringify(WEB_VIDEO))]));
    const out = path.join(VIDEO_CACHE_DIR, `${key}.mp4`);
    if (!fs.existsSync(out)) {
      fs.mkdirSync(VIDEO_CACHE_DIR, { recursive: true });
      const tmp = `${out}.part.mp4`;
      execFileSync("ffmpeg", ["-nostdin", "-v", "error", "-y", "-i", abs, ...WEB_VIDEO.args, tmp], { stdio: "inherit" });
      fs.renameSync(tmp, out);
    }
    webVideo.set(abs, out);
    log(`video re-encoded (${why.join(", ")}): ${(fs.statSync(abs).size / 1048576).toFixed(2)} -> ${(fs.statSync(out).size / 1048576).toFixed(2)} MB  ${path.relative(MARKETING_HOME_DIR, abs)}`);
  }
}
const published = (abs) => webVideo.get(abs) || abs;

// ── video budget ─────────────────────────────────────────────────────────────
let videoBytes = 0;
const videoList = [];
for (const abs of videoSources) { const b = fs.statSync(published(abs)).size; videoBytes += b; videoList.push(`${(b / 1048576).toFixed(1)} MB  ${abs}`); }
if (videoBytes > VIDEO_BUDGET_MB * 1048576) {
  console.log(`
=====================================================
  Videos total ${(videoBytes / 1048576).toFixed(1)} MB after re-encoding, over the ${VIDEO_BUDGET_MB} MB budget.
${videoList.map((l) => "  " + l).join("\n")}
  Shorten or drop clips, or move /v4/**/*.mp4 to a CDN bucket (see ${SPEED_ADVICE}, Hosting).
  Nothing was copied.
=====================================================
`);
  process.exit(2);
}

// ── fonts: merge + dedupe against the site-wide link ─────────────────────────
function parseFamilies(url) {
  const fams = [];
  const q = url.split("?")[1] || "";
  for (const part of q.split("&")) {
    const [k, v] = part.split("=");
    if (k !== "family") continue;
    const spec = decodeURIComponent(v.replace(/\+/g, " "));
    const [name, axes] = spec.split(":");
    if (!axes) { fams.push({ name, axes: "", tuples: [] }); continue; }
    const [tags, vals] = axes.split("@");
    fams.push({ name, axes: tags, tuples: vals.split(";") });
  }
  return fams;
}
const siteFontHref = (fs.readFileSync(DOCUSAURUS_CONFIG, "utf8").match(/GOOGLE_FONTS_HREF\s*=\s*"([^"]+)"/) || [])[1] || "";
const siteFams = new Map(parseFamilies(siteFontHref).map((f) => [`${f.name}|${f.axes}`, new Set(f.tuples)]));
const fontMap = new Map();
for (const e of rows) for (const u of e.fontUrls) for (const f of parseFamilies(u)) {
  const k = `${f.name}|${f.axes}`;
  const others = [...fontMap.keys()].filter((x) => x.startsWith(`${f.name}|`) && x !== k);
  if (others.length) warn(e.row, `font ${f.name} requested with different axes (${f.axes} vs ${others.join(", ")})`);
  const cur = fontMap.get(k) || { name: f.name, axes: f.axes, tuples: new Set(), rows: new Set() };
  f.tuples.forEach((t) => cur.tuples.add(t));
  cur.rows.add(e.row);
  fontMap.set(k, cur);
}
const fontNotes = [];
const fontFamilies = [...fontMap.values()]
  .filter((f) => {
    const site = siteFams.get(`${f.name}|${f.axes}`);
    if (site && [...f.tuples].every((t) => site.has(t))) { fontNotes.push(`${f.name} already loaded site-wide by docusaurus.config.ts (rows ${[...f.rows].join(", ")})`); return false; }
    return true;
  })
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((f) => {
    const tuples = [...f.tuples].sort((a, b) => {
      const x = a.split(",").map(parseFloat); const y = b.split(",").map(parseFloat);
      for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return x[i] - y[i];
      return 0;
    });
    if (f.rows.size > 1 || tuples.length) fontNotes.push(`${f.name}${f.axes ? `:${f.axes}@${tuples.join(";")}` : ""} (rows ${[...f.rows].join(", ")})`);
    return `family=${f.name.replace(/ /g, "+")}${f.axes ? `:${f.axes}@${tuples.join(";")}` : ""}`;
  });
const FONT_HREF = fontFamilies.length ? `https://fonts.googleapis.com/css2?${fontFamilies.join("&")}&display=swap` : "";

// ── write static ─────────────────────────────────────────────────────────────
fs.rmSync(V4_STATIC_DIR, { recursive: true, force: true });
let totalCopied = 0;
for (const e of rows) {
  e.bytes = 0;
  e.copied = [];
  for (const [abs, url] of [...e.assets].sort((a, b) => a[1].localeCompare(b[1]))) {
    if (e.scriptFiles.includes(abs)) continue; // written rewritten below
    const dest = path.join(REPO_DIR, "site/static", url);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(published(abs), dest);
    const b = fs.statSync(dest).size;
    e.bytes += b;
    e.copied.push(`${url} (${b} B)`);
  }
  e.scriptUrls = [...e.externalScripts];
  for (const s of e.scripts) {
    const dest = path.join(REPO_DIR, "site/static", s.url);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, s.code);
    e.bytes += Buffer.byteLength(s.code);
    e.copied.push(`${s.url} (script, rewritten)`);
    e.scriptUrls.push(`${s.url}?v=${sha(s.code).slice(0, 10)}`);
  }
  totalCopied += e.bytes;
}

// ── write _rows.generated.ts ─────────────────────────────────────────────────
const data = rows.map((e) => ({
  row: e.row,
  title: e.title,
  variation: e.variation,
  prefix: e.prefix,
  source: path.join("~", path.relative(os.homedir(), e.varDir)),
  html: e.html,
  css: e.css,
  scripts: e.scriptUrls,
  fonts: e.fontUrls,
  windowGlobals: e.windowGlobals,
  hasFooter: e.hasFooter,
}));
const ts = `/* eslint-disable */
// ─────────────────────────────────────────────────────────────────────────────
// GENERATED FILE — DO NOT HAND-EDIT.
// Generator: scripts/build-v4-rows.js   (run: node scripts/build-v4-rows.js)
// Source:    ~/${path.relative(os.homedir(), INPUT_ROWS_FILE)}
// Date:      ${csvDate} (modification date of the CSV)
// Edit the rows in ~/${path.relative(os.homedir(), ROWS_DIR)}/ and re-run the generator.
// ─────────────────────────────────────────────────────────────────────────────

export interface V4Row {
  /** Row number from the CSV (page order). */
  row: number;
  title: string;
  /** Approved variation directory name. */
  variation: string;
  /** Class prefix (after collision renames), e.g. "r1v27". */
  prefix: string;
  /** Source variation directory. */
  source: string;
  /** Row markup, assets rewritten to /v4/row_N/..., fonts and scripts stripped. */
  html: string;
  /** Row CSS, every rule scoped under .v4, theme selectors on [data-v4-theme]. */
  css: string;
  /** Scripts to load in order (static, wrapped in the lifecycle harness). */
  scripts: string[];
  /** Google Fonts URLs the row asked for (merged into V4_FONT_HREF). */
  fonts: string[];
  /** window globals the row scripts write; reset before every mount. */
  windowGlobals: string[];
  /** True when the row's own design includes the site footer. */
  hasFooter: boolean;
}

export const V4_GENERATED = ${JSON.stringify({ generator: "scripts/build-v4-rows.js", date: csvDate, csv: path.join("~", path.relative(os.homedir(), INPUT_ROWS_FILE)) }, null, 2)};

/** Every font family the rows use, merged and deduped (families already loaded site-wide are left out). */
export const V4_FONT_HREF = ${JSON.stringify(FONT_HREF)};

export const V4_ROWS: V4Row[] = ${JSON.stringify(data, null, 2)};
`;
fs.mkdirSync(path.dirname(V4_ROWS_DATA_FILE), { recursive: true });
fs.writeFileSync(V4_ROWS_DATA_FILE, ts);

// ── inventory report ─────────────────────────────────────────────────────────
log("");
log("================ /v/4 INVENTORY ================");
for (const e of rows) {
  log(`row ${e.row} · ${e.title} · v${e.variation} · prefix ${e.prefix}-${e.prefix !== e.originalPrefix ? ` (was ${e.originalPrefix}-)` : ""}`);
  log(`  markup: ${e.markupSource}`);
  log(`  css:    ${e.cssFiles.map((f) => path.relative(ROWS_DIR, f)).join(", ") || "-"}`);
  log(`  js:     ${e.scriptFiles.map((f) => path.relative(ROWS_DIR, f)).join(" -> ") || "-"}`);
  log(`  assets: ${e.copied.length} files, ${e.bytes} bytes`);
  for (const c of e.copied) log(`          ${c}`);
  if (e.windowGlobals.length) log(`  window globals: ${e.windowGlobals.join(", ")}`);
  if (e.ids.length) log(`  ids:    ${e.ids.join(", ")}`);
  if (e.fontUrls.length) log(`  fonts:  ${e.fontUrls.join(" | ")}`);
  for (const n of e.notes) log(`  note:   ${n}`);
  for (const g of e.globalCss) log(`  css:    ${g}`);
  for (const l of e.linksWired) log(`  link:   ${l}`);
  if (e.placeholderLinks.length) log(`  href="#" left as authored: ${e.placeholderLinks.join(" · ")}`);
  for (const m of e.missing) log(`  MISSING: ${m}`);
}
log("------------------------------------------------");
for (const c of collisions) log(`collision fixed: ${c}`);
for (const n of fontNotes) log(`font: ${n}`);
log(`font href: ${FONT_HREF}`);
log(`rows on page: ${rows.length} (${rows.map((e) => e.row).join(", ")})`);
if (notApproved.length) log(`not approved yet: ${notApproved.map((e) => `${e.row} ${e.title}`).join("; ")}`);
if (errored.length) log(`ERRORED (left off): ${errored.map((e) => `${e.row} ${e.title}`).join("; ")}`);
log(`videos: ${videoList.length} files, ${(videoBytes / 1048576).toFixed(2)} MB (budget ${VIDEO_BUDGET_MB} MB)`);
log(`static: ${path.relative(REPO_DIR, V4_STATIC_DIR)}/ ${totalCopied} bytes`);
log(`wrote:  ${path.relative(REPO_DIR, V4_ROWS_DATA_FILE)}`);
log(warnings.length ? `${warnings.length} WARNING(S)` : "clean: 0 warnings");
