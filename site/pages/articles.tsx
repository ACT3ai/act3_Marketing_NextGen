import React from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { V4Hero, V4Section, V4CtaBand } from "../components/v4/V4Blocks";
import articleIndex from "../data/articles.json";

/*
 * The /articles hub, on the v4 template.
 *
 * This page is the only reason the published articles are not orphans. Every
 * one of them is linked from here, in plain server-rendered <a> markup, grouped
 * by who the article is written for (SEO invariant: keep every article linked).
 * It is reached from the last entry of the navbar's More menu and from the
 * Resources column of the footer.
 *
 * A directory, not a feed: no dates, nothing ordered by recency. Each group is
 * a dense grid of title + one line (CSS-clamped to three lines as a fallback for
 * the few long ones). The link text is the title alone; the line
 * is a sibling paragraph and a stretched ::after keeps the whole cell clickable.
 *
 * The page CSS is rendered in the tree (dangerouslySetInnerHTML), NOT in <Head>:
 * the static build writes only title/meta/link/script helmet tags, so a <style>
 * in <Head> would arrive only after hydration (unstyled first paint).
 */

type ArticleRecord = {
  slug: string;
  title: string;
  description: string;
  persona: string;
};

/** "Level 2" is internal; the public name is the Assistant Director Team. The
 *  upstream corpus still uses it in one title, so the hub renders the public name. */
const publicName = (s: string): string => s.replace(/\bLevel[- ]?2 Team\b/gi, "Assistant Director Team");

/** Longest line the hub shows before trying a clause cut (about two lines). */
const LINE_MAX = 120;

/**
 * The hub's one line for an article, cut from its description (the article's
 * lead paragraph) without rewording it: the first sentence, and, when that is
 * still long, the main clause before a " — " or ": " (never a negated clause,
 * which would read as the opposite, and never inside a "— aside —" pair). An
 * answer-first opening ("Yes, ...") loses the "Yes", since the hub shows no
 * question. Anything still long is clamped by CSS.
 */
function hubLine(description: string): string {
  let s = description.replace(/^Yes(?:,| —)\s+/, "").replace(/^(["“]?)([a-z])/, (_, q: string, c: string) => q + c.toUpperCase());

  const sentenceEnd = /[.?!](["”’)]?)\s+(?=["“A-Z0-9])/g;
  for (let m = sentenceEnd.exec(s); m; m = sentenceEnd.exec(s)) {
    if (m.index >= 40) {
      s = s.slice(0, m.index + 1 + m[1].length);
      break;
    }
  }

  if (s.length > LINE_MAX) {
    const clause = /\s[—–]\s|:\s/g;
    for (let m = clause.exec(s); m; m = clause.exec(s)) {
      const head = s.slice(0, m.index);
      if (head.length < 45) continue;
      const isDash = m[0].trim() !== ":";
      if (
        head.length > LINE_MAX ||
        /\bnot\b|n't\b|\bno\b/i.test(head) ||
        (isDash && /\s[—–]\s/.test(s.slice(m.index + m[0].length))) ||
        (!isDash && /\b(this|these|following)$/i.test(head))
      ) {
        break;
      }
      s = head.replace(/[,;]$/, "") + ".";
      break;
    }
  }
  return s;
}

const ARTICLES = (articleIndex as ArticleRecord[]).map((a) => ({
  ...a,
  title: publicName(a.title),
  description: hubLine(publicName(a.description)),
}));

/** Group order and copy. A persona missing from here still renders, at the end. */
const GROUPS: { persona: string; who: string; blurb: string }[] = [
  { persona: "Indie Filmmaker", who: "indie filmmakers", blurb: "A full-length film from a screenplay, without a crew, a budget, or a green light." },
  { persona: "Content Creator", who: "content creators", blurb: "Characters, style, and pace that hold across episodes, not one-off clips." },
  { persona: "Studio Production", who: "studios", blurb: "Series, seasons, teams, review cycles, IP ownership, and what breaks at scale." },
  { persona: "Marketing Team", who: "marketing teams", blurb: "Volume, cadence, brand consistency, and the ROI of AI video." },
  { persona: "Agency Commercials", who: "agencies", blurb: "Many clients, parallel projects, brand rules, and approvals." },
  { persona: "Enterprise", who: "enterprise", blurb: "SSO, security review, seats, procurement, and owned IP." },
  { persona: "Small Business", who: "small businesses", blurb: "Video that does not look cheap, and what it costs per month." },
  { persona: "Animator", who: "animators", blurb: "2D and 3D pipelines, motion capture, lipsync, and where AI fits." },
];

const PAGE_CSS = `
.a3hub-jump {
  margin: 36px 0 0; padding: 0; list-style: none;
  display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;
  max-width: 900px;
}
.a3hub-jump a {
  display: inline-flex; align-items: baseline; gap: 8px;
  padding: 9px 16px; border: 1px solid var(--v4t-line); border-radius: 999px;
  background: rgba(255, 255, 255, 0.03);
  color: var(--v4t-body); font-family: var(--v4t-ui); font-size: 15px; font-weight: 600;
  text-decoration: none; white-space: nowrap;
  transition: border-color .15s ease, color .15s ease;
}
.a3hub-jump a:hover { border-color: var(--v4t-yellow); color: var(--v4t-yellow-hi); text-decoration: none; }
.a3hub-jump a:focus-visible { outline: 3px solid var(--v4t-yellow-hi); outline-offset: 3px; }
.a3hub-jump b { color: var(--v4t-yellow); font-weight: 700; font-size: 13px; }

.a3hub-list {
  list-style: none; margin: 0; padding: 0;
  display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: clamp(28px, 3vw, 48px);
}
.a3hub-item {
  position: relative; margin: 0; padding: 18px 0 20px;
  border-top: 1px solid var(--v4t-line);
  display: flex; flex-direction: column; gap: 6px;
}
.a3hub-title {
  font-family: var(--v4t-sans); font-weight: 700; font-size: 17px; line-height: 1.3;
  letter-spacing: -0.005em; color: var(--v4t-ink); text-decoration: none;
  transition: color .15s ease;
}
.a3hub-title::after { content: ""; position: absolute; inset: 0; }
.a3hub-title:hover, .a3hub-item:hover .a3hub-title { color: var(--v4t-yellow-hi); text-decoration: none; }
.a3hub-title:focus-visible { outline: none; }
.a3hub-title:focus-visible::after { outline: 3px solid var(--v4t-yellow-hi); outline-offset: 2px; }
.a3hub-desc {
  margin: 0; font-size: 15px; line-height: 1.5; color: var(--v4t-quiet);
  display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; line-clamp: 3;
  overflow: hidden;
}

@media (max-width: 1080px) { .a3hub-list { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 680px) {
  .a3hub-list { grid-template-columns: minmax(0, 1fr); }
  .a3hub-jump { gap: 8px; }
  .a3hub-jump a { padding: 8px 13px; font-size: 14px; }
}
@media (prefers-reduced-motion: reduce) {
  .a3hub-jump a, .a3hub-title { transition: none; }
}
`;

type Group = { who: string; blurb: string; anchor: string; items: ArticleRecord[] };

const byTitle = (a: ArticleRecord, b: ArticleRecord): number => a.title.localeCompare(b.title);
const anchorFor = (persona: string): string => persona.toLowerCase().replace(/[^a-z0-9]+/g, "-");

function grouped(): Group[] {
  const seen = new Set<string>();
  const out: Group[] = GROUPS.map((g) => {
    const items = ARTICLES.filter((a) => a.persona === g.persona).sort(byTitle);
    items.forEach((a) => seen.add(a.slug));
    return { who: g.who, blurb: g.blurb, anchor: anchorFor(g.persona), items };
  }).filter((g) => g.items.length > 0);

  const rest = ARTICLES.filter((a) => !seen.has(a.slug)).sort(byTitle);
  if (rest.length) out.push({ who: "everyone", blurb: "Everything else in the library.", anchor: "more", items: rest });
  return out;
}

const cap = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

export default function Articles(): React.ReactNode {
  const { siteConfig } = useDocusaurusContext();
  const groups = grouped();
  const total = ARTICLES.length;
  const midBand = Math.ceil(groups.length / 2);

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "ACT 3 AI Articles",
    description: `${total} guides and comparisons on AI filmmaking, from script to finished film.`,
    url: `${siteConfig.url}/articles`,
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: total,
      itemListElement: ARTICLES.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${siteConfig.url}/articles/${a.slug}`,
        name: a.title,
      })),
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteConfig.url}/` },
      { "@type": "ListItem", position: 2, name: "Articles", item: `${siteConfig.url}/articles` },
    ],
  };

  return (
    <Layout
      title="Articles"
      description={`${total} guides to AI filmmaking: full-length films, cinematography, consistent characters, cost, and tool comparisons.`}
    >
      <Head>
        <script type="application/ld+json">{JSON.stringify([collectionLd, breadcrumbLd])}</script>
      </Head>
      <main>
        <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />
        <V4Hero
          eyebrow="Articles"
          title="Guides to"
          highlight="AI filmmaking"
          sub={`${total} guides: full-length films, cinematography, consistent characters, cost, and tool comparisons.`}
          cta={false}
        >
          <nav aria-label="Article groups">
            <ul className="a3hub-jump">
              {groups.map((g) => (
                <li key={g.anchor}>
                  <a href={`#${g.anchor}`}>
                    {cap(g.who)} <b>{g.items.length}</b>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </V4Hero>

        {groups.map((g, i) => (
          <React.Fragment key={g.anchor}>
            {i === midBand ? <V4CtaBand /> : null}
            <V4Section
              id={g.anchor}
              tone={i % 2 === 0 ? "raised" : "ground"}
              heading="For"
              highlight={g.who}
              intro={g.blurb}
            >
              <ul className="a3hub-list">
                {g.items.map((a) => (
                  <li key={a.slug} className="a3hub-item">
                    <Link className="a3hub-title" to={`/articles/${a.slug}`}>
                      {a.title}
                    </Link>{" "}
                    <p className="a3hub-desc">{a.description}</p>
                  </li>
                ))}
              </ul>
            </V4Section>
          </React.Fragment>
        ))}

        <V4CtaBand />
      </main>
    </Layout>
  );
}
