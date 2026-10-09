/**
 * Swizzled wrapper of @theme/Layout — picks the site template for the route.
 *
 * Two templates live side by side (see CLAUDE.md "Site templates"):
 *   * v4 template (DEFAULT, every route): <html class="v4t v4t-skin">, rendered
 *     with V4Header / V4Footer (src/theme/Navbar, src/theme/Footer) and styled by
 *     site/css/v4-template.css. "v4t" scopes the template chrome; "v4t-skin" the
 *     dark Infima skin, which a page with its own design overlay opts out of
 *     with <V4OwnDesign> (site/components/v4/templateContext.tsx).
 *   * OLD template (/backup/* only): <html class="old-template">, rendered
 *     with SiteNavbar / SiteFooter, the cream design, untouched. /backup itself
 *     (the old homepage) renders SiteNavbar / SiteFooter directly, without
 *     <Layout>, so it never passes through here and has no html class.
 *
 * The class goes on <html> through HtmlClassNameProvider, so it is in the
 * server-rendered HTML (no flash) and nests with the classes pages add.
 * The route test is isOldTemplatePath() in site/data/siteNav.ts.
 */
import React from "react";
import Layout from "@theme-original/Layout";
import type LayoutType from "@theme/Layout";
import type { WrapperProps } from "@docusaurus/types";
import Head from "@docusaurus/Head";
import { HtmlClassNameProvider } from "@docusaurus/theme-common";
import { useLocation } from "@docusaurus/router";
import { isOldTemplatePath } from "@site/site/data/siteNav";
import { useV4Skin } from "@site/site/components/v4/templateContext";

type Props = WrapperProps<typeof LayoutType>;

export default function LayoutWrapper(props: Props): React.ReactNode {
  const { pathname } = useLocation();
  const skin = useV4Skin();
  const old = isOldTemplatePath(pathname);
  const className = old ? "old-template" : skin ? "v4t v4t-skin" : "v4t";
  return (
    <HtmlClassNameProvider className={className}>
      {/* The old template keeps its orange browser tint; the site-wide default
          (themeConfig.metadata) is the v4 ground. Helmet keeps one tag. */}
      {old ? (
        <Head>
          <meta name="theme-color" content="#C0531F" />
        </Head>
      ) : null}
      <Layout {...props} />
    </HtmlClassNameProvider>
  );
}
