/**
 * Ejected @theme/BlogListPage (Docusaurus 3.10.0) — ONE change: a visible H1.
 *
 * The stock list page (/blog, /blog/page/N) has no H1 at all: the post titles
 * are H2 links, so the page opened straight on "ACT 3 AI Is Live". It now opens
 * on the blog title (blogTitle in docusaurus.config.ts, "Blog"), styled by the
 * template's page-title rule (.v4t-skin .main-wrapper h1 in
 * site/css/v4-template.css) like every other page title on the skin.
 *
 * Why an eject and not a wrapper: the H1 has to sit INSIDE BlogLayout's <main>
 * column, above the posts, and a @theme-original wrapper can only add things
 * around the whole page. Everything else below is the stock file, unchanged
 * (metadata, structured data, html classes, paginator).
 */
import React, { type ReactNode } from "react";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { PageMetadata, HtmlClassNameProvider, ThemeClassNames } from "@docusaurus/theme-common";
import BlogLayout from "@theme/BlogLayout";
import BlogListPaginator from "@theme/BlogListPaginator";
import SearchMetadata from "@theme/SearchMetadata";
import type { Props } from "@theme/BlogListPage";
import BlogPostItems from "@theme/BlogPostItems";
import BlogListPageStructuredData from "@theme/BlogListPage/StructuredData";
import Heading from "@theme/Heading";

function BlogListPageMetadata(props: Props): ReactNode {
  const { metadata } = props;
  const {
    siteConfig: { title: siteTitle },
  } = useDocusaurusContext();
  const { blogDescription, blogTitle, permalink } = metadata;
  const isBlogOnlyMode = permalink === "/";
  const title = isBlogOnlyMode ? siteTitle : blogTitle;
  return (
    <>
      <PageMetadata title={title} description={blogDescription} />
      <SearchMetadata tag="blog_posts_list" />
    </>
  );
}

function BlogListPageContent(props: Props): ReactNode {
  const { metadata, items, sidebar } = props;
  return (
    <BlogLayout sidebar={sidebar}>
      {/* The one addition to the stock page. */}
      <Heading as="h1" className="margin-bottom--lg">
        {metadata.blogTitle}
      </Heading>
      <BlogPostItems items={items} />
      <BlogListPaginator metadata={metadata} />
    </BlogLayout>
  );
}

export default function BlogListPage(props: Props): ReactNode {
  return (
    <HtmlClassNameProvider className={clsx(ThemeClassNames.wrapper.blogPages, ThemeClassNames.page.blogListPage)}>
      <BlogListPageMetadata {...props} />
      <BlogListPageStructuredData {...props} />
      <BlogListPageContent {...props} />
    </HtmlClassNameProvider>
  );
}
