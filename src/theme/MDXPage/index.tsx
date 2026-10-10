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
 *    They are on the v4 template's dark skin: a ~72ch reading column with a
 *    sticky "On this page" TOC (a collapsible one on phones), the navy
 *    ArticleCTA band, then a raised "Related articles" card grid (V4Card).
 *    All of their styling is in site/css/articles.css.
 *
 * Doing the structured data here rather than in the markdown means every
 * article is covered by one file, and an article stays pure prose.
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
import TOCCollapsible from "@theme/TOCCollapsible";
import ContentVisibility from "@theme/ContentVisibility";
import type { Props } from "@theme/MDXPage";

import ArticleCTA from "@site/site/components/ArticleCTA";
import { V4CardGrid, V4Card } from "@site/site/components/v4/V4Blocks";
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
const BRAND = "ACT 3 AI";

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

/* All article styling lives in site/css/articles.css (scoped to html.article-page,
   on top of the v4 template's dark skin). No <style> element in this file: CSS
   rendered in the body is what broke hydration (#418). */

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
    `${siteUrl}/img/act3-social-card.jpg`;

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
  // Docusaurus appends " | ACT 3 AI" to every title. These headlines put the
  // specific promise at the END ("...Building 2-Hour Movies in One Project"),
  // so a suffix that pushes the tag past what a search result renders costs the
  // promise, not the brand: keep the suffix only when the whole title still
  // fits. A title that already names the brand ("ACT 3 AI vs InVideo: ...")
  // never gets it, or the brand renders twice.
  const ownTitle =
    title.includes(BRAND) ||
    title.length + BRAND_SUFFIX.length > SERP_TITLE_BUDGET;
  const hasToc = MDXPageContent.toc.length > 0;

  return (
    <Layout>
      <PageMetadata
        title={title}
        description={description}
        keywords={(frontMatter as Record<string, string[]>).keywords}
        image={imageUrl}
      />
      <Head>
        {ownTitle && <title>{title}</title>}
        {ownTitle && <meta property="og:title" content={title} />}
        <meta property="og:type" content="article" />
        {updated && (
          <meta property="article:modified_time" content={updated} />
        )}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Head>
      <main className="a3art">
        <div className="a3art__wrap a3art__grid">
          <div className="a3art__body">
            <nav className="a3art__crumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span aria-hidden="true">/</span>
              <Link to="/articles">Articles</Link>
              {/* The trail stops at "Articles": the H1 right below names the
                  page. Position 3 stays in the BreadcrumbList JSON-LD. */}
            </nav>
            <ContentVisibility metadata={metadata} />
            {record && (
              <p className="a3art__meta">
                Updated {formatDate(record.updated)} <span aria-hidden="true">&middot;</span>{" "}
                {readingMinutes(record.words)} min read
              </p>
            )}
            {hasToc && (
              <TOCCollapsible
                className="a3art__toc-mobile"
                toc={MDXPageContent.toc}
                minHeadingLevel={frontMatter.toc_min_heading_level}
                maxHeadingLevel={frontMatter.toc_max_heading_level}
              />
            )}
            {/* `markdown` is what Infima, the v4 skin and site/css/articles.css
                all hang their content styles on. The stock MDXPage does not add
                it, so an MDX page rendered with no typographic styling at all. */}
            <article className="markdown">
              <MDXContent>
                <MDXPageContent />
              </MDXContent>
            </article>
          </div>

          {hasToc && (
            <aside className="a3art__toc" aria-label="On this page">
              <p className="a3art__toc-label">On this page</p>
              <TOC
                toc={MDXPageContent.toc}
                minHeadingLevel={frontMatter.toc_min_heading_level}
                maxHeadingLevel={frontMatter.toc_max_heading_level}
              />
            </aside>
          )}
        </div>

        <ArticleCTA variant="footer" />

        {related.length > 0 && (
          <section className="a3art__related" aria-labelledby="a3art-related">
            <div className="a3art__wrap">
              <h2 className="a3art__related-title" id="a3art-related">
                Related articles
              </h2>
              <V4CardGrid columns={3}>
                {related.map((a) => (
                  <V4Card
                    key={a.slug}
                    href={`/articles/${a.slug}`}
                    title={a.title}
                  />
                ))}
              </V4CardGrid>
              <p className="a3art__all">
                <Link to="/articles">
                  Browse all {ARTICLES.length} articles <span aria-hidden="true">&rarr;</span>
                </Link>
              </p>
            </div>
          </section>
        )}
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
  const page = isArticle ? <ArticlePage {...props} /> : <PlainPage {...props} />;

  return (
    <HtmlClassNameProvider
      className={clsx(
        wrapperClassName ?? ThemeClassNames.wrapper.mdxPages,
        ThemeClassNames.page.mdxPage,
      )}
    >
      {/* Every markdown page is on the v4 template, dark skin included
          (Bryan, 2026-10-09: "switch all other pages to the new template ...
          articles, and all those"). A wrapperClassName still scopes the page's
          own overlay (level2.css, articles.css), which is written for the dark
          skin. */}
      {page}
    </HtmlClassNameProvider>
  );
}
