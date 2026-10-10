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
//      snippet for us on 133 commercial-intent pages. It ends on a sentence or
//      clause boundary, not mid-sentence with "..." (see buildDescription).
//   3. Stamps `last_update.date` so the sitemap can carry a real <lastmod>
//      without needing git history in CI. The date only moves when the
//      published page actually changes: an unchanged page keeps the date it
//      already carries, a new or edited page gets the date of this run. (The
//      source file's mtime was used before, but a fresh checkout sets every
//      mtime to "now", which re-dated every live article on each run.)
//   4. Drops one inline CTA after the opening section (readers convert from
//      buttons, not from closing prose most of them never reach).
//   5. Extracts the "## FAQ" block into structured data for FAQPage JSON-LD.
//   6. Rewrites the internal name of the done-for-you service ("Level 2 team",
//      "Level-2 Team", "Level 2 package", ...) to its public name, "Assistant
//      Director Team", in the title, headings, body, tables, FAQ and index.
//      Only references to the TEAM / service are touched (see publicTeamName);
//      "Level 2 is image conditioning" and other uses of "level" stay, and links
//      to /level2 keep their target.
//
// Only the slugs listed in scripts/published-articles.txt are published. The
// corpus holds far more articles than are ready to go live, and this script
// deletes and regenerates site/pages/articles/ on every run, so an explicit
// list is the only thing standing between "publish 80 this week" and
// "publish everything in the folder". A cross-link to an article that exists
// upstream but is not on the list is flattened to plain text rather than left
// as a link the build would reject.
//
// Run:  node scripts/sync-articles.js        (also runs as part of `pnpm build`)
// Corpus path:      found automatically -- ACT3_SEO_PAGES if set, else the corpus
//                   checked out beside this repo (../all or ../../all).
// Source override:  ACT3_SEO_PAGES=/some/dir node scripts/sync-articles.js
// ---------------------------------------------------------------------------
const fs = require("fs");
const os = require("os");
const path = require("path");

const REPO = path.join(__dirname, "..");

// The article corpus lives in a SEPARATE, private repository, so where it sits
// depends on how the two repos were checked out. This used to be one hardcoded
// absolute path under a particular home directory, which meant the sync silently
// published nothing on every machine laid out differently.
//
// Resolve it instead, in order: an explicit override, then the corpus's position
// RELATIVE to this repo, which is what actually stays true across checkouts:
//   <parent>/all/...      the two repos checked out side by side
//   <parent>/../all/...   BGit, where this repo sits one level deeper in act3/
// The last entry is kept only so the warning below names a sensible path when
// nothing is found at all.
const SEO_PAGES = "film/marketing/seo/pages";
const SRC_CANDIDATES = [
  process.env.ACT3_SEO_PAGES,
  path.join(REPO, "..", "all", SEO_PAGES),
  path.join(REPO, "..", "..", "all", SEO_PAGES),
  path.join(os.homedir(), "BGit/all", SEO_PAGES),
].filter(Boolean);
const SRC =
  SRC_CANDIDATES.find((dir) => fs.existsSync(dir)) ||
  SRC_CANDIDATES[SRC_CANDIDATES.length - 1];
const OUT_DIR = path.join(REPO, "site/pages/articles");
const PUBLISH_LIST = path.join(__dirname, "published-articles.txt");
const DATA_FILE = path.join(REPO, "site/data/articles.json");

const SOCIAL_IMAGE = "https://act3ai.com/img/act3-social-card.jpg";
// Descriptions end on a sentence boundary: whole sentences up to MAX_DESC
// (about what Google renders), a single long lead sentence up to HARD_MAX_DESC
// for the index and llms.txt only (the meta tag stays within MAX_DESC), and
// only past that a cut at a clause break (see buildDescription).
const MAX_DESC = 158;
const MIN_DESC = 110;
const HARD_MAX_DESC = 240;

// -- Link rewrites -----------------------------------------------------------
// Every one of these was a 404 in the corpus as written. The right-hand side is
// the page that actually exists and answers the same intent.
const LINK_REWRITES = new Map([
  ["/signup", "https://app.act3ai.com/signup/"],
  ["/sign-up", "https://app.act3ai.com/signup/"],
  ["/compare", "/features"],
  ["/level-2", "/level2"],
  ["/enterprise", "/contact"],
  ["/pages/ai_builds_whole", "/articles/ai_builds_whole"],
]);

// These targets are placeholders the writer used for "the CTA", whatever it
// was: /demo is a 404, and the bare homepage drops the action the words
// promise. So the destination is chosen from the link's LABEL, matched both as
// written and after publicTeamName ("Level 2 team" / "Assistant Director
// Team"). First rule that matches wins; the value is the fallback when none do.
//   * "... Assistant Director Team" / "... Level 2 team"  -> /level2
//   * "Book a walkthrough", "... demo"                    -> /contact
//   * "See how ACT 3 AI compares ..."                     -> /features
// /level2 is the package page -- no booking, no comparison -- so a walkthrough
// or a comparison link must never land there. Every destination is an existing
// route: onBrokenLinks is "throw".
const LABEL_AWARE_REWRITES = new Map([
  ["/demo", "/contact"],
  ["https://act3ai.com", "/"],
  ["https://act3ai.com/", "/"],
]);
const LABEL_RULES = [
  [/assistant director team|level[ -]?2 team/i, "/level2"],
  [/walkthrough|book a|demo/i, "/contact"],
  [/compar/i, "/features"],
];
function labelAwareTarget(label, target) {
  const forms = [label, publicTeamName(label)].map(stripMarkdown);
  for (const [re, dest] of LABEL_RULES) {
    if (forms.some((f) => re.test(f))) return dest;
  }
  return LABEL_AWARE_REWRITES.get(target);
}

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

/** Split a paragraph into sentences, leaving decimals like "2.5" intact. A
 *  sentence may end inside a closing quote or bracket ('... price." It is'). */
function sentences(p) {
  return p
    .split(/(?<=[.!?]["\u201d\u2019)]?)\s+(?=["'(\u201cA-Z])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * End a too-long sentence at a clause break (" — ", "; ", ": ") instead of
 * mid-word: the longest head of at least `min` characters that fits in `max`,
 * preferring one that fits in `prefer`. A head is skipped when its last clause
 * is negated ("... is not the one with the prettiest clip" -- the point is in
 * the half that would be cut; "is not X — it is Y" is fine) or ends on a word
 * that introduces what follows ("the short answer is this"). Returns null when
 * no break qualifies.
 */
const COUNT_INTRO =
  /\b(two|three|four|five|six|seven|eight|nine|ten|\d+)\s+(\w+\s+){0,3}(jobs|places|ways|things|reasons|steps|parts|areas|stages|kinds|types|uses)$/i;
function clauseCut(sentence, max, prefer, min) {
  const BREAK = /\s[\u2014\u2013]\s|;\s|:\s/g;
  const heads = [];
  for (let m = BREAK.exec(sentence); m; m = BREAK.exec(sentence)) {
    const head = sentence.slice(0, m.index).replace(/[\s,;:]+$/, "");
    if (head.length < min || head.length + 1 > max) continue;
    const lastClause = head.split(/\s[\u2014\u2013]\s|;\s|:\s/).pop();
    if (/\bnot\b|n't\b|\bno\b/i.test(lastClause)) continue;
    if (/\b(this|these|following|as follows|in this order)$/i.test(head)) continue;
    // "... for three distinct jobs" -- a count that introduces the list the cut
    // would drop; the head alone is a teaser that names nothing.
    if (COUNT_INTRO.test(lastClause.trim())) continue;
    if (/^\(?\d+\)/.test(lastClause.trim())) continue; // "(1) the scope": one item of a list
    heads.push(head + ".");
  }
  if (!heads.length) return null;
  const fit = heads.filter((h) => h.length <= prefer);
  return fit.length ? fit[fit.length - 1] : heads[heads.length - 1];
}

/**
 * A description, built from the article's own opening paragraph, which in this
 * corpus is consistently the sharpest statement of what the page answers --
 * the "Short answer:" lead where the writer used one.
 *
 * It ends on a sentence boundary, never mid-sentence with "...": whole
 * sentences while they fit in MAX_DESC; a first sentence longer than that is
 * kept whole up to `hardMax`; past that, clauseCut (heads of at least
 * `minHead`); and only when no clause break qualifies, the old word-boundary
 * cut to MAX_DESC with "...".
 *
 * Two callers, two limits:
 *   * hardMax = HARD_MAX_DESC -- the index (articles.json: the /articles hub)
 *     and llms.txt, where a complete statement is worth more than brevity.
 *   * hardMax = MAX_DESC -- the page front matter, which Docusaurus emits as
 *     <meta name="description"> AND og:description. Google cuts a longer one
 *     mid-sentence in the result, so it is held to MAX_DESC.
 */
function buildDescription(body, hardMax = HARD_MAX_DESC, minHead = 45) {
  const paras = body
    .split(/\r?\n\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .filter((p) => !p.startsWith("#") && !p.startsWith("{/*"));

  const lead = paras[0] || "";
  let text = stripMarkdown(lead).replace(/^Short answer:\s*/i, "");
  // A lead that ends in a colon is introducing a list; make it a statement.
  text = text.replace(/:$/, ".");

  const parts = sentences(text);
  const first = parts[0] || text;
  let desc = first;
  if (first.length > hardMax) {
    // One very long lead sentence: end it at a clause break. Nothing is
    // appended after a cut sentence -- the next one would read out of context.
    desc = clauseCut(first, hardMax, MAX_DESC, minHead) || clamp(first, MAX_DESC);
  } else {
    // Grow by whole sentences until the snippet is long enough to be worth a
    // click: within MAX_DESC while it fits, or one last sentence up to
    // hardMax, or the next sentence up to a clause break.
    for (let i = 1; i < parts.length && desc.length < MIN_DESC; i++) {
      const next = desc + " " + parts[i];
      if (next.length <= MAX_DESC) {
        desc = next;
        continue;
      }
      if (next.length <= hardMax) {
        desc = next;
        break;
      }
      const room = hardMax - desc.length - 1;
      const cut = clauseCut(parts[i], room, MAX_DESC - desc.length - 1, 20);
      if (cut) desc = desc + " " + cut;
      // A hook too short to stand alone ("... never one video.") is a teaser
      // that names nothing: carry the next sentence to MAX_DESC instead.
      else if (desc.length < 60) desc = clamp(next, MAX_DESC);
      break;
    }
  }
  // Leads that open mid-sentence ("**Short answer:** most tools...") lose their
  // capital when the label is stripped (also behind an opening quote).
  desc = desc.replace(/^(["\u201c]?)([a-z])/, (_, q, c) => q + c.toUpperCase());
  if (!/[.!?]["\u201d\u2019)]?$/.test(desc)) desc += ".";
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
function rewriteLinks(body, knownSlugs, slug, report, heldBackSlugs) {
  // A link to an article that exists upstream but is not published would be a
  // broken link (and onBrokenLinks is "throw"). Keep the words, drop the link.
  body = body.replace(
    /\[([^\]]+)\]\(\.\.\/([A-Za-z0-9_-]+)\/\2\.md(\s+"[^"]*")?\)/g,
    (whole, text, target) => {
      if (knownSlugs.has(target) || !heldBackSlugs.has(target)) return whole;
      report.flattenedCrossLinks.push(slug + " -> " + target);
      return text;
    },
  );
  // Placeholder CTA targets: the label decides where they go.
  body = body.replace(
    /\[([^\]]+)\]\(([^)\s]+)(\s+"[^"]*")?\)/g,
    (whole, label, target, title) => {
      const t = target.trim();
      if (!LABEL_AWARE_REWRITES.has(t)) return whole;
      report.rewritten++;
      return "[" + label + "](" + labelAwareTarget(label, t) + (title || "") + ")";
    },
  );
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
      } else if (LABEL_AWARE_REWRITES.has(t)) {
        // A label the pass above could not parse (nested brackets): fallback.
        next = LABEL_AWARE_REWRITES.get(t);
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

/**
 * The public name of the done-for-you service.
 *
 * Internally (and throughout the upstream corpus) it is the "Level 2 team";
 * the public name is the "Assistant Director Team", and CLAUDE.md forbids
 * "Level 2" in rendered copy. Like the brand spelling, it is rewritten on the
 * published copy only, so the upstream articles stay as their authors wrote
 * them.
 *
 * Every form in the published corpus refers to the team when followed by
 * "team", "package" or "option": "Level 2 team", "Level-2 Team", "the Level 2
 * package", "a Level 2 option". Each becomes "Assistant Director Team"
 * ("Assistant Director Team package", ...). The quotation marks the corpus
 * puts around the coined label ("Level 2 team") are dropped, since the public
 * name is a capitalised proper name; a preceding "a" becomes "an". Anything
 * else -- "Level 2 is image conditioning", heading levels, the /level2 and
 * /level-2 link targets -- does not match. key_value's Level_2_Team tag is
 * renamed so the published data carries one name too (it is only compared
 * for equality, by the related-article rail).
 */
const PUBLIC_TEAM = "Assistant Director Team";
const TEAM_REF = /\bLevel[- ]2(?:[- ]team\b|(?= (?:package|option)\b))/gi;
function publicTeamName(text, report) {
  const out = text
    .replace(/["\u201c](Level[- ]2[- ]team)["\u201d]/gi, "$1")
    .replace(TEAM_REF, () => {
      if (report) report.teamRenamed++;
      return PUBLIC_TEAM;
    })
    .replace(/\b([Aa]) ((?:\*\*|\*|_)?)(?=Assistant Director Team\b)/g, "$1n $2")
    .replace(/\bLevel_2_Team\b/g, "Assistant_Director_Team");
  return out;
}

function yamlStr(s) {
  return JSON.stringify(String(s));
}

// -- Main --------------------------------------------------------------------

if (!fs.existsSync(SRC)) {
  // Exiting 0 here is deliberate: CI checks out only this repo, so the corpus is
  // legitimately absent there and the committed pages are what ship. Failing
  // would break every deploy. But the same silence is wrong when a person ran
  // this meaning to publish, so list every path tried instead of just one.
  console.warn("[articles] source corpus not found. Looked in:");
  for (const dir of SRC_CANDIDATES) console.warn("[articles]     " + dir);
  console.warn(
    "[articles] keeping the committed site/pages/articles/*.md as-is.",
  );
  console.warn(
    "[articles] if you meant to publish, point ACT3_SEO_PAGES at your corpus.",
  );
  process.exit(0);
}

const corpusSlugs = fs
  .readdirSync(SRC, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .filter((name) => fs.existsSync(path.join(SRC, name, name + ".md")))
  .sort();

// The publish list. A missing list, or a listed slug with no article behind it,
// stops the run: either would silently change what is live.
if (!fs.existsSync(PUBLISH_LIST)) {
  console.error(
    "[articles] missing " + PUBLISH_LIST + " -- refusing to publish the whole corpus",
  );
  process.exit(1);
}
const listed = [
  ...new Set(
    fs
      .readFileSync(PUBLISH_LIST, "utf8")
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("#")),
  ),
];
const corpusSet = new Set(corpusSlugs);
const notInCorpus = listed.filter((s) => !corpusSet.has(s));
if (notInCorpus.length) {
  console.error(
    "[articles] published-articles.txt lists " +
      notInCorpus.length +
      " slug(s) with no article in the corpus: " +
      notInCorpus.join(", "),
  );
  process.exit(1);
}

const listedSet = new Set(listed);
const slugs = corpusSlugs.filter((s) => listedSet.has(s));
const heldBackSlugs = new Set(corpusSlugs.filter((s) => !listedSet.has(s)));

const knownSlugs = new Set(slugs);
const report = {
  rewritten: 0,
  unknownCrossLinks: [],
  flattenedCrossLinks: [],
  noDescription: [],
  longMeta: [],
  metaEllipsis: 0,
  teamRenamed: 0,
};

// Remember what is live before the folder is wiped, so an unchanged page keeps
// its date. Compared with line endings normalised and the date masked out.
const DATE_LINE = /^  date: (\d{4}-\d{2}-\d{2})$/m;
const DATE_MASK = "  date: __DATE__";
// The social image is page chrome, not content: swapping the site-wide card must
// not re-date every article (it did once, 2026-10-09), so it is masked too.
const IMAGE_LINE = /^image: .*$/m;
const IMAGE_MASK = "image: __IMAGE__";
const comparable = (text) => text.replace(DATE_LINE, DATE_MASK).replace(IMAGE_LINE, IMAGE_MASK);
const previous = new Map();
if (fs.existsSync(OUT_DIR)) {
  for (const f of fs.readdirSync(OUT_DIR)) {
    if (!f.endsWith(".md")) continue;
    const text = fs.readFileSync(path.join(OUT_DIR, f), "utf8").replace(/\r\n/g, "\n");
    const m = DATE_LINE.exec(text);
    if (m) previous.set(f.slice(0, -3), { date: m[1], masked: comparable(text) });
  }
}
const TODAY = new Date().toISOString().slice(0, 10);
report.redated = [];

fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });

const index = [];

for (const slug of slugs) {
  const srcFile = path.join(SRC, slug, slug + ".md");
  const raw = fs.readFileSync(srcFile, "utf8");
  const [fmText, bodyRaw] = splitFrontMatter(raw);
  const fm = parseFrontMatter(fmText);

  const title = publicTeamName(normalizeBrand(fm.title || slug.replace(/_/g, " ")), report);
  const targetQuery = fm.target_query || "";

  let body = publicTeamName(
    normalizeBrand(rewriteLinks(bodyRaw, knownSlugs, slug, report, heldBackSlugs)),
    report,
  );
  const keyValue = publicTeamName(fm.key_value || "");
  const faq = extractFaq(body);
  body = splitFaqParagraphs(body);
  // The index/llms.txt statement and the (shorter) meta tag; see buildDescription.
  const description = buildDescription(body);
  const metaDescription = buildDescription(body, MAX_DESC, 90);
  if (!description || description.length < 60) report.noDescription.push(slug);
  if (metaDescription.length < 60 && !report.noDescription.includes(slug)) {
    report.noDescription.push(slug);
  }
  if (metaDescription.length > MAX_DESC) report.longMeta.push(slug);
  if (metaDescription.endsWith("...")) report.metaEllipsis++;
  body = insertInlineCta(body);

  let updated = "__DATE__";
  const words = stripMarkdown(bodyRaw.replace(/^#.*$/gm, "")).split(
    /\s+/,
  ).length;

  const keywords = [targetQuery, "AI filmmaking", "AI video generation"].filter(
    Boolean,
  );

  const frontMatter = [
    "---",
    "title: " + yamlStr(title),
    "description: " + yamlStr(metaDescription),
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
    "article_key_value: " + yamlStr(keyValue),
    "---",
    "",
    "{/* GENERATED FILE -- do not edit here.",
    "    Source: <seo corpus>/" + slug + "/" + slug + ".md",
    "    Regenerate with: node scripts/sync-articles.js */}",
    "",
  ].join("\n");

  const masked = frontMatter + body.trimStart() + "\n";
  const prev = previous.get(slug);
  // The corpus checkout may use CRLF; compare with line endings normalised on
  // both sides, or every page looks "changed" on Windows.
  if (prev && prev.masked === comparable(masked.replace(/\r\n/g, "\n"))) {
    updated = prev.date;
  } else {
    updated = TODAY;
    report.redated.push(slug);
  }
  fs.writeFileSync(
    path.join(OUT_DIR, slug + ".md"),
    masked.replace("  date: __DATE__", "  date: " + updated),
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
    keyValue,
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
llms.push(
  "- [Movies](https://act3ai.com/movies): feature films. Import your script, direct the movie by chat, keep the same actors, sets and outfits in every scene.",
);
llms.push(
  "- [TV](https://act3ai.com/tv): TV series. An hour-long episode in three days; series regulars, wardrobe and standing sets carry over all season.",
);
llms.push(
  "- [Minidramas](https://act3ai.com/minidramas): minidramas (micro-dramas). The same lead, sets and voices in every short episode.",
);
llms.push(
  "- [Videos](https://act3ai.com/videos): ads, social media and marketing videos. Consistent characters; approve each shot before you pay for video.",
);
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
console.log(
  "[articles] held back " +
    heldBackSlugs.size +
    " corpus articles not listed in scripts/published-articles.txt",
);
if (report.flattenedCrossLinks.length) {
  console.log(
    "[articles] " +
      report.flattenedCrossLinks.length +
      " cross-links to held-back articles kept as plain text",
  );
}
console.log("[articles] rewrote " + report.rewritten + " link targets");
console.log(
  "[articles] renamed " + report.teamRenamed + ' "Level 2 team" references to "' + PUBLIC_TEAM + '"',
);
console.log(
  "[articles] descriptions ending in \"...\": " +
    index.filter((a) => a.description.endsWith("...")).length +
    "/" +
    index.length +
    " in the index, " +
    report.metaEllipsis +
    "/" +
    index.length +
    " in the meta tag (held to " +
    MAX_DESC +
    " characters)",
);
console.log(
  "[articles] dated today (new or changed): " +
    report.redated.length +
    (report.redated.length ? " -> " + report.redated.join(", ") : ""),
);
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
if (report.longMeta.length) {
  console.warn(
    "[articles] meta description over " + MAX_DESC + " characters on: " + report.longMeta.join(", "),
  );
}
