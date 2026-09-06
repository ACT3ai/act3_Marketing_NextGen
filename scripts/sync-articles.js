// ---------------------------------------------------------------------------
// Publish the SEO article corpus into the site.
//
// The articles are authored OUTSIDE this repo, one directory per article:
//   {SEO_PAGES}/<slug>/<slug>.md
// This script is the missing publishing step: it copies each one into
//   site/pages/articles/<slug>.md
// so the Docusaurus pages plugin serves it at /articles/<slug>, and writes a
// single index at
//   site/data/articles.json
// that the /articles hub, the related-article rails, and the per-article
// JSON-LD all read from.
//
// What it does to each article on the way in:
//   1. Rewrites every dead call-to-action link (/signup, /demo, /compare,
//      /level-2, /enterprise) to a destination that actually resolves, and
//      turns the ../slug/slug.md cross-links into /articles/<slug> routes.
//      onBrokenLinks is "throw", so anything missed fails the build loudly.
//   2. Derives a meta `description` from the article's own lead paragraph --
//      Docusaurus emits no description without one, and Google then writes the
//      snippet for us on 133 commercial-intent pages.
//   3. Stamps `last_update.date` from the source file so the sitemap can carry
//      a real <lastmod> without needing git history in CI.
//   4. Drops one inline CTA after the opening section (readers convert from
//      buttons, not from closing prose most of them never reach).
//   5. Extracts the "## FAQ" block into structured data for FAQPage JSON-LD.
//
// Run:  node scripts/sync-articles.js        (also runs as part of `pnpm build`)
// Source override:  ACT3_SEO_PAGES=/some/dir node scripts/sync-articles.js
// ---------------------------------------------------------------------------
const fs = require("fs");
const os = require("os");
const path = require("path");

const REPO = path.join(__dirname, "..");
const SRC =
  process.env.ACT3_SEO_PAGES ||
  path.join(os.homedir(), "BGit/all/film/marketing/seo/pages");
const OUT_DIR = path.join(REPO, "site/pages/articles");
const DATA_FILE = path.join(REPO, "site/data/articles.json");

const SOCIAL_IMAGE = "https://act3ai.com/img/Act3_Preview.jpg";
const MAX_DESC = 158;
const MIN_DESC = 110;

// -- Link rewrites -----------------------------------------------------------
// Every one of these was a 404 in the corpus as written. The right-hand side is
// the page that actually exists and answers the same intent.
const LINK_REWRITES = new Map([
  ["/signup", "https://app.act3ai.com/signup/"],
  ["/sign-up", "https://app.act3ai.com/signup/"],
  ["/demo", "/level2"],
  ["/compare", "/features"],
  ["/level-2", "/level2"],
  ["/enterprise", "/contact"],
  ["/pages/ai_builds_whole", "/articles/ai_builds_whole"],
  ["https://act3ai.com", "/"],
  ["https://act3ai.com/", "/"],
]);

// -- Small helpers -----------------------------------------------------------

/** Split "---\n...\n---\nbody" into [frontMatterText, body]. */
function splitFrontMatter(raw) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!m) return [null, raw];
  return [m[1], raw.slice(m[0].length)];
}

/** Parse the flat `key: value` front matter these articles use. */
function parseFrontMatter(text) {
  const out = {};
  if (!text) return out;
  for (const line of text.split(/\r?\n/)) {
    const m = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(line);
    if (!m) continue;
    let v = m[2].trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    out[m[1]] = v;
  }
  return out;
}

/** Strip markdown emphasis/links/code so a sentence reads as plain prose. */
function stripMarkdown(s) {
  return s
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/(^|\s)_([^_]+)_(?=\s|$)/g, "$1$2")
    // Nested emphasis ("**a *b* c**") defeats the paired patterns above; on a
    // single paragraph of prose a bare asterisk is always a leftover marker.
    .replace(/\*+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Cut to `max` characters on a word boundary, marking the cut. */
function clamp(s, max) {
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 3);
  const at = cut.lastIndexOf(" ");
  const kept = at > 40 ? cut.slice(0, at) : cut;
  return kept.replace(/[\s,;:\u2014\u2013-]+$/, "") + "...";
}

/** Split a paragraph into sentences, leaving decimals like "2.5" intact. */
function sentences(p) {
  return p
    .split(/(?<=[.!?])\s+(?=["'(A-Z])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * The meta description. Built from the article's own opening paragraph, which
 * in this corpus is consistently the sharpest statement of what the page
 * answers -- the "Short answer:" lead where the writer used one.
 */
function buildDescription(body) {
  const paras = body
    .split(/\r?\n\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .filter((p) => !p.startsWith("#") && !p.startsWith("{/*"));

  const lead = paras[0] || "";
  let text = stripMarkdown(lead).replace(/^Short answer:\s*/i, "");
  // A lead that ends in a colon is introducing a list; make it a statement.
  text = text.replace(/:$/, ".");

  // Grow by whole sentences until the snippet is long enough to be worth a
  // click, then cut to what Google will actually render.
  const parts = sentences(text);
  let desc = parts[0] || text;
  for (let i = 1; i < parts.length && desc.length < MIN_DESC; i++) {
    desc = desc + " " + parts[i];
  }
  desc = clamp(desc, MAX_DESC);
  // Leads that open mid-sentence ("**Short answer:** most tools...") lose their
  // capital when the label is stripped.
  desc = desc.charAt(0).toUpperCase() + desc.slice(1);
  if (!/[.!?]$/.test(desc)) desc += ".";
  return desc;
}

/** Parse the "## FAQ" block: bold question line, answer paragraph beneath. */
function extractFaq(body) {
  const start = body.search(/^## FAQ\s*$/m);
  if (start === -1) return [];
  const after = body.slice(start);
  const nextH2 = after.slice(6).search(/^## /m);
  const block = nextH2 === -1 ? after : after.slice(0, nextH2 + 6);

  const faq = [];
  let q = null;
  let a = [];
  const flush = () => {
    if (q && a.length) faq.push({ q, a: stripMarkdown(a.join(" ")) });
    q = null;
    a = [];
  };
  for (const line of block.split(/\r?\n/)) {
    const qm = /^\*\*(.+?)\*\*\s*$/.exec(line.trim());
    if (qm) {
      flush();
      q = stripMarkdown(qm[1]);
      continue;
    }
    if (!q) continue;
    if (!line.trim()) {
      if (a.length) flush();
      continue;
    }
    if (line.startsWith("#") || line.startsWith("---")) {
      flush();
      continue;
    }
    a.push(line.trim());
  }
  flush();
  return faq;
}

/**
 * Split each FAQ entry into two paragraphs.
 *
 * The corpus writes a question and its answer on consecutive lines, which
 * markdown joins into one paragraph -- so the question loses its own line and
 * the block reads as a wall of prose. A blank line between them makes the
 * question a paragraph of its own, which the article stylesheet can then set
 * apart. Only the "## FAQ" block is touched.
 */
function splitFaqParagraphs(body) {
  const start = body.search(/^## FAQ\s*$/m);
  if (start === -1) return body;
  const head = body.slice(0, start);
  const tail = body.slice(start);
  const lines = tail.split(/\r?\n/);
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    out.push(lines[i]);
    const isQuestion = /^\*\*[^*].*\*\*$/.test(lines[i].trim());
    const nextIsProse = lines[i + 1] !== undefined && lines[i + 1].trim() !== "";
    if (isQuestion && nextIsProse) out.push("");
  }
  return head + out.join("\n");
}

/** Rewrite every dead or filesystem-relative link target. */
function rewriteLinks(body, knownSlugs, slug, report) {
  return body.replace(
    /\]\(([^)\s]+)(\s+"[^"]*")?\)/g,
    (whole, target, title) => {
      const t = target.trim();
      let next = null;

      const rel = /^\.\.\/([A-Za-z0-9_-]+)\/\1\.md$/.exec(t);
      if (rel) {
        if (knownSlugs.has(rel[1])) next = "/articles/" + rel[1];
        else report.unknownCrossLinks.push(slug + " -> " + t);
      } else if (LINK_REWRITES.has(t)) {
        next = LINK_REWRITES.get(t);
      }

      if (next && next !== t) report.rewritten++;
      return "](" + (next || t) + (title || "") + ")";
    },
  );
}

/**
 * Put one CTA inside the article, after the opening section. Most readers never
 * reach the bottom of a 1,500-word page, and the closing prose CTA has nothing
 * clickable behind it.
 */
function insertInlineCta(body) {
  const heads = [];
  const re = /^## .*$/gm;
  let m;
  while ((m = re.exec(body))) heads.push(m.index);
  if (heads.length < 4) return body;

  // Prefer the second H2; if the opening section is very short, use the third.
  let at = heads[1];
  if (at < 900 && heads.length >= 5) at = heads[2];
  if (at < 600) return body;

  return body.slice(0, at) + "<ArticleCTA />\n\n" + body.slice(at);
}

/**
 * One spelling of the company name.
 *
 * The corpus was written with "ACT3 AI" and "ACT 3 AI" interchangeably, and the
 * live site carried "ACT 3", "ACT3", "ACT 3 AI" and "ACT3 AI" on a single page.
 * Entity recognition -- in Google's knowledge graph and in the answer engines
 * that now field "which tool does X" -- matches an entity, not a string, so four
 * spellings dilute every mention and every branded search.
 *
 * The spaceless forms are normalised away here, on the published copy only; the
 * upstream article is left alone. "ACT 3" survives as the short form after first
 * mention, which is how the rest of the site already writes it. URLs and handles
 * ("act3ai.com", "@ACT3AI", "github.com/ACT3ai") are untouched, because no word
 * boundary falls between the digit and the letters that follow it.
 */
function normalizeBrand(text) {
  return text.replace(/\bACT3 AI\b/g, "ACT 3 AI").replace(/\bACT3\b/g, "ACT 3");
}

function yamlStr(s) {
  return JSON.stringify(String(s));
}

// -- Main --------------------------------------------------------------------

if (!fs.existsSync(SRC)) {
  console.warn("[articles] source corpus not found at " + SRC);
  console.warn(
    "[articles] keeping the committed site/pages/articles/*.md as-is",
  );
  process.exit(0);
}

const slugs = fs
  .readdirSync(SRC, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .filter((name) => fs.existsSync(path.join(SRC, name, name + ".md")))
  .sort();

const knownSlugs = new Set(slugs);
const report = { rewritten: 0, unknownCrossLinks: [], noDescription: [] };

fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });

const index = [];

for (const slug of slugs) {
  const srcFile = path.join(SRC, slug, slug + ".md");
  const raw = fs.readFileSync(srcFile, "utf8");
  const [fmText, bodyRaw] = splitFrontMatter(raw);
  const fm = parseFrontMatter(fmText);

  const title = normalizeBrand(fm.title || slug.replace(/_/g, " "));
  const targetQuery = fm.target_query || "";

  let body = normalizeBrand(rewriteLinks(bodyRaw, knownSlugs, slug, report));
  const faq = extractFaq(body);
  body = splitFaqParagraphs(body);
  const description = buildDescription(body);
  if (!description || description.length < 60) report.noDescription.push(slug);
  body = insertInlineCta(body);

  const updated = fs.statSync(srcFile).mtime.toISOString().slice(0, 10);
  const words = stripMarkdown(bodyRaw.replace(/^#.*$/gm, "")).split(
    /\s+/,
  ).length;

  const keywords = [targetQuery, "AI filmmaking", "AI video generation"].filter(
    Boolean,
  );

  const frontMatter = [
    "---",
    "title: " + yamlStr(title),
    "description: " + yamlStr(description),
    "keywords: [" + keywords.map(yamlStr).join(", ") + "]",
    "image: " + yamlStr(SOCIAL_IMAGE),
    "wrapperClassName: article-page",
    "last_update:",
    "  date: " + updated,
    "# Provenance -- authored upstream, published by scripts/sync-articles.js.",
    "article_slug: " + yamlStr(slug),
    "article_target_query: " + yamlStr(targetQuery),
    "article_persona: " + yamlStr(fm.persona || ""),
    "article_funnel_stage: " + yamlStr(fm.funnel_stage || ""),
    "article_search_intent: " + yamlStr(fm.search_intent || ""),
    "article_content_type: " + yamlStr(fm.content_type || ""),
    "article_key_value: " + yamlStr(fm.key_value || ""),
    "---",
    "",
    "{/* GENERATED FILE -- do not edit here.",
    "    Source: <seo corpus>/" + slug + "/" + slug + ".md",
    "    Regenerate with: node scripts/sync-articles.js */}",
    "",
  ].join("\n");

  fs.writeFileSync(
    path.join(OUT_DIR, slug + ".md"),
    frontMatter + body.trimStart() + "\n",
    "utf8",
  );

  index.push({
    slug,
    title,
    description,
    targetQuery,
    persona: fm.persona || "",
    funnelStage: fm.funnel_stage || "",
    searchIntent: fm.search_intent || "",
    contentType: fm.content_type || "",
    keyValue: fm.key_value || "",
    updated,
    words,
    faq,
  });
}

fs.writeFileSync(DATA_FILE, JSON.stringify(index, null, 2) + "\n", "utf8");

// -- llms.txt ----------------------------------------------------------------
// A curated, machine-readable index of the site for AI answer engines. It is a
// cheap supplemental access layer, not a ranking lever -- the large-scale
// studies find no correlation with AI citations -- so it is generated from the
// same index the site renders from and never hand-maintained.
const GROUP_ORDER = [
  ["Indie Filmmaker", "For indie filmmakers"],
  ["Content Creator", "For content creators"],
  ["Studio Production", "For studios and production companies"],
  ["Marketing Team", "For in-house marketing teams"],
  ["Agency Commercials", "For agencies and commercial work"],
  ["Enterprise", "For enterprise buyers"],
  ["Small Business", "For small businesses"],
  ["Animator", "For animators"],
];

const llms = [];
llms.push("# ACT 3 AI");
llms.push("");
llms.push(
  "> ACT 3 AI is an AI filmmaking platform that turns a script into a finished " +
    "film. It parses a script into beats, scenes, and shots; holds characters " +
    "consistent with per-character identity models, wardrobe, and voice; " +
    "generates cinematography, first frames, prompts, lipsync, and motion " +
    "capture; and assembles the whole runtime onto one timeline you can watch " +
    "end to end. It is built for full-length work -- features, TV episodes, and " +
    "marketing video at volume -- rather than for single short clips.",
);
llms.push("");
llms.push(
  "Everything below is a public page on https://act3ai.com. The articles are " +
    "evergreen reference pages, not dated posts.",
);
llms.push("");
llms.push("## Product");
llms.push("");
llms.push("- [Home](https://act3ai.com/): what the platform is and who it is for.");
llms.push("- [Features](https://act3ai.com/features): the capability list.");
llms.push(
  "- [Assistant Director Team](https://act3ai.com/level2): a dedicated team that produces your films inside ACT 3 AI.",
);
llms.push("- [MCP server](https://act3ai.com/mcp): drive ACT 3 AI from Claude Code.");
llms.push("- [CLI](https://act3ai.com/cli): the command line interface.");
llms.push("- [Pricing](https://app.act3ai.com/settings/plans/): plans and credits.");
llms.push("- [About](https://act3ai.com/about) / [Contact](https://act3ai.com/contact)");
llms.push("");
llms.push("## Articles");
llms.push("");
llms.push(
  "- [All " + index.length + " articles](https://act3ai.com/articles): the full index, grouped by reader.",
);
llms.push("");

const seen = new Set();
for (const [persona, heading] of GROUP_ORDER) {
  const items = index
    .filter((a) => a.persona === persona)
    .sort((a, b) => a.title.localeCompare(b.title));
  if (!items.length) continue;
  llms.push("### " + heading);
  llms.push("");
  for (const a of items) {
    seen.add(a.slug);
    llms.push(
      "- [" + a.title + "](https://act3ai.com/articles/" + a.slug + "): " + a.description,
    );
  }
  llms.push("");
}
const rest = index.filter((a) => !seen.has(a.slug));
if (rest.length) {
  llms.push("### More");
  llms.push("");
  for (const a of rest) {
    llms.push(
      "- [" + a.title + "](https://act3ai.com/articles/" + a.slug + "): " + a.description,
    );
  }
  llms.push("");
}

fs.writeFileSync(
  path.join(REPO, "site/static/llms.txt"),
  llms.join("\n"),
  "utf8",
);
console.log("[articles] wrote site/static/llms.txt");

console.log(
  "[articles] published " + index.length + " articles to site/pages/articles/",
);
console.log("[articles] rewrote " + report.rewritten + " link targets");
console.log(
  "[articles] FAQ blocks parsed: " +
    index.filter((a) => a.faq.length).length +
    "/" +
    index.length,
);
if (report.unknownCrossLinks.length) {
  console.warn(
    "[articles] " +
      report.unknownCrossLinks.length +
      " cross-links point at unknown slugs:",
  );
  for (const l of report.unknownCrossLinks) console.warn("  " + l);
}
if (report.noDescription.length) {
  console.warn(
    "[articles] weak description on: " + report.noDescription.join(", "),
  );
}
