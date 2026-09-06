/**
 * Global MDX components.
 *
 * Registering ArticleCTA here is what lets any markdown file write
 * <ArticleCTA /> with no import line. scripts/sync-articles.js inserts exactly
 * one of those into each published article, so the alternative would be 133
 * generated import statements.
 */
import MDXComponentsOriginal from "@theme-original/MDXComponents";
import ArticleCTA from "@site/site/components/ArticleCTA";

export default {
  ...MDXComponentsOriginal,
  ArticleCTA,
};
