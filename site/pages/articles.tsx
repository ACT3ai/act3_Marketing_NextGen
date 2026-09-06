import React from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import PageHero from "../components/PageHero";
import articleIndex from "../data/articles.json";

/*
 * The /articles hub.
 *
 * This page is the only reason the 133 published articles are not orphans. Every
 * one of them is linked from here, in plain server-rendered <a> markup, grouped
 * by who the article is written for. It is reached from the last entry of the
 * navbar's More menu and from the Resources column of the footer.
 *
 * The list is two columns of bullets per group, on purpose: it is a directory,
 * not a feed. These are evergreen reference pages, so nothing here is ordered by
 * date and nothing is buried by newer material.
 */

type ArticleRecord = {
  slug: string;
  title: string;
  description: string;
  targetQuery: string;
  persona: string;
  funnelStage: string;
  searchIntent: string;
  contentType: string;
  keyValue: string;
  updated: string;
  words: number;
  faq: { q: string; a: string }[];
};

const ARTICLES = articleIndex as ArticleRecord[];

/** Group order and copy. A persona missing from here still renders, at the end. */
const GROUPS: { persona: string; heading: string; blurb: string }[] = [
  {
    persona: "Indie Filmmaker",
    heading: "For indie filmmakers",
    blurb:
      "Getting a screenplay to a watchable full-length film without a crew, a budget, or a green light.",
  },
  {
    persona: "Content Creator",
    heading: "For content creators",
    blurb:
      "Holding characters, style, and pace together across episodes instead of one-off clips.",
  },
  {
    persona: "Studio Production",
    heading: "For studios and production companies",
    blurb:
      "Series, seasons, teams, review cycles, ownership, and the things that break at scale.",
  },
  {
    persona: "Marketing Team",
    heading: "For in-house marketing teams",
    blurb:
      "Volume, cadence, brand consistency, and the ROI maths behind AI video for a marketing calendar.",
  },
  {
    persona: "Agency Commercials",
    heading: "For agencies and commercial work",
    blurb:
      "Many clients, parallel projects, brand rules, approvals, and clean separation between accounts.",
  },
  {
    persona: "Enterprise",
    heading: "For enterprise buyers",
    blurb:
      "Security review, SSO, data residency, procurement, and what an enterprise rollout actually requires.",
  },
  {
    persona: "Small Business",
    heading: "For small businesses",
    blurb:
      "The cheapest honest path to video that does not look cheap, and what it really costs per month.",
  },
  {
    persona: "Animator",
    heading: "For animators",
    blurb:
      "2D and 3D pipelines, motion capture, lipsync, and where AI fits beside the tools you already use.",
  },
];

const PAGE_CSS = `
.a3hub {
  --bg: #faf8f3;
  --bg-2: #f3efe5;
  --ink: #1a1714;
  --ink-2: #4a4540;
  --ink-3: #837c72;
  --line: #e2dccb;
  --accent: #c4612b;
  --font-display: "Fraunces", "Times New Roman", serif;
  --font-body: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-body);
}
.a3hub__inner { max-width: 1140px; margin: 0 auto; padding: 0 clamp(20px, 4vw, 56px); }

.a3hub__jump {
  display: flex; flex-wrap: wrap; gap: 8px;
  padding: 28px 0 4px;
  border-bottom: 1px solid var(--line);
  margin-bottom: 8px;
}
.a3hub__jump a {
  font-size: 13px; font-weight: 500; color: var(--ink-2);
  text-decoration: none; padding: 7px 13px; border-radius: 999px;
  border: 1px solid var(--line); background: #fff;
  transition: color .15s ease, border-color .15s ease;
  margin-bottom: 10px;
}
.a3hub__jump a:hover { color: var(--accent); border-color: var(--accent); text-decoration: none; }

.a3hub__group { padding: 42px 0 8px; border-bottom: 1px solid var(--line); }
.a3hub__group:last-of-type { border-bottom: 0; }
.a3hub__group-head { display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; }
.a3hub__group h2 {
  font-family: var(--font-display);
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 500; line-height: 1.15; margin: 0;
  scroll-margin-top: 90px;
}
.a3hub__count {
  font-family: var(--font-mono); font-size: 11.5px; letter-spacing: .08em;
  text-transform: uppercase; color: var(--accent);
}
.a3hub__blurb { color: var(--ink-2); font-size: 15px; line-height: 1.6; margin: 10px 0 24px; max-width: 68ch; }

.a3hub__list {
  list-style: none; padding: 0; margin: 0;
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px clamp(28px, 4vw, 64px);
}
.a3hub__list li { position: relative; padding-left: 18px; }
.a3hub__list li::before {
  content: ""; position: absolute; left: 0; top: .58em;
  width: 6px; height: 6px; border-radius: 999px; background: var(--accent);
}
.a3hub__list a {
  display: block; font-size: 15.5px; font-weight: 500; line-height: 1.4;
  color: var(--ink); text-decoration: none;
}
.a3hub__list a:hover { color: var(--accent); text-decoration: underline; }
.a3hub__list small {
  display: block; color: var(--ink-3); font-size: 13px; line-height: 1.5;
  margin-top: 3px; font-weight: 400;
}

.a3hub__foot {
  margin: 56px 0 0; padding: 32px; border: 1px solid var(--line);
  border-radius: 14px; background: var(--bg-2);
  display: flex; flex-wrap: wrap; gap: 18px; align-items: center; justify-content: space-between;
}
.a3hub__foot p { margin: 0; max-width: 58ch; color: var(--ink-2); font-size: 15px; line-height: 1.6; }
.a3hub__foot strong { color: var(--ink); }
.a3hub__btn {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--accent); color: #fff; font-weight: 600; font-size: 15px;
  padding: 12px 22px; border-radius: 999px; text-decoration: none;
  transition: filter .15s ease, transform .15s ease; white-space: nowrap;
}
.a3hub__btn:hover { color: #fff; text-decoration: none; filter: brightness(1.06); transform: translateY(-1px); }
.a3hub__bottom { padding-bottom: 72px; }

@media (max-width: 820px) {
  .a3hub__list { grid-template-columns: minmax(0, 1fr); }
}
`;

function anchorFor(persona: string): string {
  return persona.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function grouped(): { heading: string; blurb: string; anchor: string; items: ArticleRecord[] }[] {
  const seen = new Set<string>();
  const out = GROUPS.map((g) => {
    const items = ARTICLES.filter((a) => a.persona === g.persona).sort((a, b) =>
      a.title.localeCompare(b.title),
    );
    items.forEach((a) => seen.add(a.slug));
    return { heading: g.heading, blurb: g.blurb, anchor: anchorFor(g.persona), items };
  }).filter((g) => g.items.length > 0);

  const rest = ARTICLES.filter((a) => !seen.has(a.slug)).sort((a, b) =>
    a.title.localeCompare(b.title),
  );
  if (rest.length) {
    out.push({
      heading: "More on AI filmmaking",
      blurb: "Everything else in the library.",
      anchor: "more",
      items: rest,
    });
  }
  return out;
}

export default function Articles(): React.ReactNode {
  const { siteConfig } = useDocusaurusContext();
  const groups = grouped();
  const total = ARTICLES.length;

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
      {
        "@type": "ListItem",
        position: 2,
        name: "Articles",
        item: `${siteConfig.url}/articles`,
      },
    ],
  };

  return (
    <Layout
      title="Articles"
      description={`${total} practical guides on AI filmmaking — making full-length films from a script, keeping characters consistent, comparing tools, and what it all costs.`}
    >
      <Head>
        <style>{PAGE_CSS}</style>
        <script type="application/ld+json">
          {JSON.stringify([collectionLd, breadcrumbLd])}
        </script>
      </Head>

      <PageHero
        label="Articles"
        title={
          <>
            Guides to <em>AI Filmmaking.</em>
          </>
        }
        description={`${total} plain-spoken articles on making real films with AI — full-length structure, character consistency, cinematography, cost, and honest comparisons against every other tool in the category.`}
      />

      <div className="a3hub">
        <div className="a3hub__inner">
          <nav className="a3hub__jump" aria-label="Article categories">
            {groups.map((g) => (
              <a key={g.anchor} href={`#${g.anchor}`}>
                {g.heading.replace(/^For /, "")} ({g.items.length})
              </a>
            ))}
          </nav>

          {groups.map((g) => (
            <section className="a3hub__group" key={g.anchor}>
              <div className="a3hub__group-head">
                <h2 id={g.anchor}>{g.heading}</h2>
                <span className="a3hub__count">{g.items.length} articles</span>
              </div>
              <p className="a3hub__blurb">{g.blurb}</p>
              <ul className="a3hub__list">
                {g.items.map((a) => (
                  <li key={a.slug}>
                    <Link to={`/articles/${a.slug}`}>
                      {a.title}
                      <small>{a.description}</small>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <div className="a3hub__bottom">
            <div className="a3hub__foot">
              <p>
                <strong>Every article here is written against one real question.</strong>{" "}
                When you are done reading, the only test that settles it is your own
                script, your own characters, and a scene long enough for problems to show.
              </p>
              <a className="a3hub__btn" href="https://app.act3ai.com/signup/">
                Start a free project <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
