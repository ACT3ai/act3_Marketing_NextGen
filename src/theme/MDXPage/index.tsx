/**
 * Swizzled override of @theme/MDXPage.
 *
 * Two jobs, and only the second one is new behaviour:
 *
 * 1. Ordinary markdown pages (/level2, /marketing_*) render exactly as the
 *    stock component rendered them. The one deliberate difference is that the
 *    "Last updated on ..." EditMetaRow is never shown: the pages plugin now runs
 *    with showLastUpdateTime so the sitemap can emit a real <lastmod>, and that
 *    flag would otherwise stamp a date across the marketing pages.
 *
 * 2. Article pages (front matter `wrapperClassName: article-page`, written by
 *    scripts/sync-articles.js) get the full article treatment: a breadcrumb, a
 *    freshness + reading-time line, a closing CTA, a related-articles rail, and
 *    Article / BreadcrumbList / FAQPage JSON-LD built from site/data/articles.json.
 *
 * Doing the structured data here rather than in the markdown means all 133
 * articles are covered by one file, and an article stays pure prose.
 */
import React from "react";
import clsx from "clsx";
import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from "@docusaurus/theme-common";
import Layout from "@theme/Layout";
import MDXContent from "@theme/MDXContent";
import TOC from "@theme/TOC";
import ContentVisibility from "@theme/ContentVisibility";
import type { Props } from "@theme/MDXPage";

import ArticleCTA from "@site/site/components/ArticleCTA";
import articleIndex from "@site/site/data/articles.json";

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
const BY_SLUG = new Map(ARTICLES.map((a) => [a.slug, a]));

const ORGANIZATION_ID = "https://act3ai.com/#organization";

/** What Google renders of a <title> before it truncates, in characters. */
const SERP_TITLE_BUDGET = 60;
const BRAND_SUFFIX = " | ACT 3 AI";

/** Related reading. A published article with no inbound link is an orphan. */
function relatedArticles(current: ArticleRecord, limit = 6): ArticleRecord[] {
  const others = ARTICLES.filter((a) => a.slug !== current.slug);
  const score = (a: ArticleRecord): number =>
    (a.persona === current.persona ? 4 : 0) +
    (a.keyValue === current.keyValue ? 3 : 0) +
    (a.contentType === current.contentType ? 1 : 0) +
    // Compare-stage readers are worth pointing at Buy-stage pages: that is the
    // funnel movement the cluster is supposed to encode.
    (current.funnelStage === "Compare" && a.funnelStage === "Buy" ? 3 : 0) +
    (a.funnelStage === current.funnelStage ? 1 : 0);
  return [...others]
    .sort((x, y) => score(y) - score(x) || x.title.localeCompare(y.title))
    .slice(0, limit);
}

function readingMinutes(words: number): number {
  return Math.max(1, Math.round(words / 225));
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

const ARTICLE_CSS = `
.a3art { max-width: 1180px; margin: 0 auto; padding: 0 clamp(20px, 4vw, 56px); }
.a3art__grid { display: grid; grid-template-columns: minmax(0, 1fr) 250px; gap: clamp(28px, 4vw, 64px); align-items: start; }
.a3art__crumbs { font-size: 13px; color: #837c72; margin: 28px 0 10px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.a3art__crumbs a { color: #837c72; text-decoration: none; }
.a3art__crumbs a:hover { color: #c4612b; text-decoration: underline; }
.a3art__crumbs span[aria-hidden] { opacity: .5; }
.a3art__meta { font-family: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace; font-size: 11.5px; letter-spacing: .08em; text-transform: uppercase; color: #837c72; margin: 0 0 8px; }
.a3art__toc { position: sticky; top: 96px; }
.a3art__related { border-top: 1px solid #e2dccb; margin-top: 48px; padding-top: 32px; }
.a3art__related h2 { font-family: "Fraunces", "Times New Roman", serif; font-size: 22px; font-weight: 500; margin: 0 0 18px; }
.a3art__related ul { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px 32px; }
.a3art__related li { position: relative; padding-left: 18px; line-height: 1.45; }
.a3art__related li::before { content: ""; position: absolute; left: 0; top: .62em; width: 6px; height: 6px; border-radius: 999px; background: #c4612b; }
.a3art__related a { font-weight: 500; color: #1a1714; text-decoration: none; }
.a3art__related a:hover { color: #c4612b; text-decoration: underline; }
.a3art__related small { display: block; color: #837c72; font-size: 12.5px; margin-top: 2px; }
.a3art__all { margin-top: 26px; font-size: 14px; }
.a3art__all a { color: #c4612b; font-weight: 500; text-decoration: none; }
.a3art__all a:hover { text-decoration: underline; }
@media (max-width: 996px) {
  .a3art__grid { grid-template-columns: minmax(0, 1fr); }
  .a3art__toc { display: none; }
  .a3art__related ul { grid-template-columns: minmax(0, 1fr); }
}
`;

function ArticlePage(props: Props): React.ReactNode {
  const { content: MDXPageContent } = props;
  const { metadata } = MDXPageContent;
  const { description, permalink, frontMatter } = metadata;
  // A published article always has a front-matter title; fall back to the slug
  // rather than emit an empty headline into the structured data.
  const title = metadata.title ?? permalink.replace(/^\/articles\//, "");
  const { siteConfig } = useDocusaurusContext();
  const siteUrl = siteConfig.url;

  const slug =
    (frontMatter as Record<string, string>).article_slug ??
    permalink.replace(/^\/articles\//, "").replace(/\/$/, "");
  const record = BY_SLUG.get(slug);

  const updated = record?.updated;
  const absoluteUrl = `${siteUrl}${permalink}`;
  const imageUrl =
    (frontMatter as Record<string, string>).image ??
    `${siteUrl}/img/Act3_Preview.jpg`;

  const jsonLd: unknown[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description,
      image: [imageUrl],
      mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl },
      url: absoluteUrl,
      inLanguage: "en",
      author: { "@type": "Organization", name: "ACT 3 AI", url: siteUrl },
      publisher: {
        "@id": ORGANIZATION_ID,
        "@type": "Organization",
        name: "ACT 3 AI",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/img/act3-logo.png`,
        },
      },
      ...(updated ? { datePublished: updated, dateModified: updated } : {}),
      ...(record?.words ? { wordCount: record.words } : {}),
      about: record?.targetQuery || undefined,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
        {
          "@type": "ListItem",
          position: 2,
          name: "Articles",
          item: `${siteUrl}/articles`,
        },
        { "@type": "ListItem", position: 3, name: title, item: absoluteUrl },
      ],
    },
  ];

  if (record?.faq?.length) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: record.faq.map((entry) => ({
        "@type": "Question",
        name: entry.q,
        acceptedAnswer: { "@type": "Answer", text: entry.a },
      })),
    });
  }

  const related = record ? relatedArticles(record) : [];

  return (
    <Layout>
      <PageMetadata
        title={title}
        description={description}
        keywords={(frontMatter as Record<string, string[]>).keywords}
        image={imageUrl}
      />
      <Head>
        {/* Docusaurus appends " | ACT 3 AI" to every title. These headlines put
            the specific promise at the END ("...Building 2-Hour Movies in One
            Project"), so a suffix that pushes the tag past what a search result
            renders costs the promise, not the brand. Keep the brand only when
            the whole title still fits; otherwise the page keeps its own. */}
        {title.length + BRAND_SUFFIX.length > SERP_TITLE_BUDGET && (
          <title>{title}</title>
        )}
        <meta property="og:type" content="article" />
        {updated && (
          <meta property="article:modified_time" content={updated} />
        )}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Head>
      <style>{ARTICLE_CSS}</style>
      <main className="a3art">
        <nav className="a3art__crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/articles">Articles</Link>
          <span aria-hidden="true">/</span>
          <span>{title}</span>
        </nav>

        <div className="a3art__grid">
          <div>
            <ContentVisibility metadata={metadata} />
            {record && (
              <p className="a3art__meta">
                Updated {formatDate(record.updated)} &middot;{" "}
                {readingMinutes(record.words)} min read
              </p>
            )}
            {/* `markdown` is what Infima and site/css/articles.css both hang
                their content styles on. The stock MDXPage does not add it, so
                an MDX page rendered with no typographic styling at all. */}
            <article className="markdown">
              <MDXContent>
                <MDXPageContent />
              </MDXContent>
            </article>

            <ArticleCTA variant="footer" />

            {related.length > 0 && (
              <section className="a3art__related">
                <h2>Keep reading</h2>
                <ul>
                  {related.map((a) => (
                    <li key={a.slug}>
                      <Link to={`/articles/${a.slug}`}>{a.title}</Link>
                      <small>{a.targetQuery || a.persona}</small>
                    </li>
                  ))}
                </ul>
                <p className="a3art__all">
                  <Link to="/articles">Browse all {ARTICLES.length} articles &rarr;</Link>
                </p>
              </section>
            )}
          </div>

          {MDXPageContent.toc.length > 0 && (
            <div className="a3art__toc">
              <TOC
                toc={MDXPageContent.toc}
                minHeadingLevel={frontMatter.toc_min_heading_level}
                maxHeadingLevel={frontMatter.toc_max_heading_level}
              />
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}

function PlainPage(props: Props): React.ReactNode {
  const { content: MDXPageContent } = props;
  const { metadata, assets } = MDXPageContent;
  const { title, description, frontMatter } = metadata;
  const {
    keywords,
    hide_table_of_contents: hideTableOfContents,
  } = frontMatter;
  const image = assets.image ?? frontMatter.image;

  return (
    <Layout>
      <PageMetadata
        title={title}
        description={description}
        keywords={keywords}
        image={image}
      />
      <main className="container container--fluid margin-vert--lg">
        <div className="row" style={{ justifyContent: "center" }}>
          <div className={clsx("col", !hideTableOfContents && "col--8")}>
            <ContentVisibility metadata={metadata} />
            <article className="markdown">
              <MDXContent>
                <MDXPageContent />
              </MDXContent>
            </article>
          </div>
          {!hideTableOfContents && MDXPageContent.toc.length > 0 && (
            <div className="col col--2">
              <TOC
                toc={MDXPageContent.toc}
                minHeadingLevel={frontMatter.toc_min_heading_level}
                maxHeadingLevel={frontMatter.toc_max_heading_level}
              />
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}

export default function MDXPage(props: Props): React.ReactNode {
  const { frontMatter } = props.content.metadata;
  const wrapperClassName = frontMatter.wrapperClassName;
  const isArticle = wrapperClassName === "article-page";

  return (
    <HtmlClassNameProvider
      className={clsx(
        wrapperClassName ?? ThemeClassNames.wrapper.mdxPages,
        ThemeClassNames.page.mdxPage,
      )}
    >
      {isArticle ? <ArticlePage {...props} /> : <PlainPage {...props} />}
    </HtmlClassNameProvider>
  );
}
