/**
 * Swizzled @theme/Navbar — the site's top bar, chosen by route.
 *
 *   * every route: V4Header (site/components/v4/V4Header.tsx), the v4 template
 *   * /backup and /backup/*: SiteNavbar (site/components/SiteNavbar.tsx), the
 *     OLD cream template, kept untouched for the frozen copies
 *
 * Keep themeConfig.navbar.hideOnScroll: true in docusaurus.config.ts (the TOC
 * highlighter otherwise looks for a stock ".navbar" that is never rendered).
 */
import React from "react";
import { useLocation } from "@docusaurus/router";
import SiteNavbar from "../../../site/components/SiteNavbar";
import V4Header from "../../../site/components/v4/V4Header";
import { isOldTemplatePath } from "../../../site/data/siteNav";

export default function Navbar(): React.ReactNode {
  const { pathname } = useLocation();
  return isOldTemplatePath(pathname) ? <SiteNavbar /> : <V4Header inLayout />;
}
