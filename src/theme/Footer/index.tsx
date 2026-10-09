/**
 * Swizzled @theme/Footer — the site footer, chosen by route.
 *
 *   * every route: V4Footer (site/components/v4/V4Footer.tsx), the v4 template
 *   * /backup and /backup/*: SiteFooter (site/components/SiteFooter.tsx), the
 *     OLD cream template, kept untouched for the frozen copies
 */
import React from "react";
import { useLocation } from "@docusaurus/router";
import SiteFooter from "../../../site/components/SiteFooter";
import V4Footer from "../../../site/components/v4/V4Footer";
import { isOldTemplatePath } from "../../../site/data/siteNav";

export default function Footer(): React.ReactNode {
  const { pathname } = useLocation();
  return isOldTemplatePath(pathname) ? <SiteFooter /> : <V4Footer />;
}
