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
 * a dense grid of title + description, the description clamped to two lines on
 * screen (the full text stays in the HTML).
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

const ARTICLES = (articleIndex as ArticleRecord[]).map((a) => ({
  ...a,
  title: publicName(a.title),
  description: publicName(a.description),
}));

/** Group order and copy. A persona missing from here still renders, at the end. */
const GROUPS: { persona: string; who: string; blurb: string }[] = [
  { persona: "Indie Filmmaker", who: "indie filmmakers", blurb: "A full-length film from a screenplay, without a crew, a budget, or a green light." },
  { persona: "Content Creator", who: "content creators", blurb: "Characters, style, and pace that hold across episodes, not one-off clips." },
  { persona: "Studio Production", who: "studios", blurb: "Series, seasons, teams, review cycles, and what breaks at scale." },
  { persona: "Marketing Team", who: "marketing teams", blurb: "Volume, cadence, brand consistency, and the ROI of AI video." },
  { persona: "Agency Commercials", who: "agencies", blurb: "Many clients, parallel projects, brand rules, and approvals." },
  { persona: "Enterprise", who: "enterprise", blurb: "Security review, SSO, data residency, and procurement." },
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
.a3hub-list li { margin: 0; border-top: 1px solid var(--v4t-line); }
.a3hub-item {
  display: flex; flex-direction: column; gap: 6px;
  padding: 18px 0 20px; color: var(--v4t-body); text-decoration: none;
}
.a3hub-item:hover { text-decoration: none; color: var(--v4t-body); }
.a3hub-item:focus-visible { outline: 3px solid var(--v4t-yellow-hi); outline-offset: 4px; }
.a3hub-title {
  font-family: var(--v4t-sans); font-weight: 700; font-size: 17px; line-height: 1.3;
  letter-spacing: -0.005em; color: var(--v4t-ink);
  transition: color .15s ease;
}
.a3hub-item:hover .a3hub-title { color: var(--v4t-yellow-hi); }
.a3hub-desc {
  font-size: 15px; line-height: 1.5; color: var(--v4t-quiet);
  display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; line-clamp: 2;
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
      description={`${total} guides to AI filmmaking: full-length films from a script, consistent characters, cost, and honest tool comparisons.`}
    >
      <Head>
        <style>{PAGE_CSS}</style>
        <script type="application/ld+json">{JSON.stringify([collectionLd, breadcrumbLd])}</script>
      </Head>
      <main>
        <V4Hero
          eyebrow="Articles"
          title="Guides to"
          highlight="AI filmmaking"
          sub={`${total} guides: full-length films, consistent characters, cost, and honest tool comparisons.`}
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
              eyebrow={`${g.items.length} articles`}
              heading="For"
              highlight={g.who}
              intro={g.blurb}
            >
              <ul className="a3hub-list">
                {g.items.map((a) => (
                  <li key={a.slug}>
                    <Link className="a3hub-item" to={`/articles/${a.slug}`}>
                      <span className="a3hub-title">{a.title}</span>
                      <span className="a3hub-desc">{a.description}</span>
                    </Link>
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
