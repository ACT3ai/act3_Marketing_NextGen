/**
 * V4DocsDrawer — the docs / blog sidebar on phones and tablets (<=996px).
 *
 * Below 996px Docusaurus hides the docs sidebar (and the blog's "Recent posts")
 * and normally shows it in the stock navbar's slide-in drawer. The v4 top bar
 * replaces that navbar, so V4Header renders these two pieces instead, on docs
 * and blog routes only:
 *
 *   <V4DocsMenuItem onOpen={closeMenu} />   a first entry in the MENU panel ("Docs menu")
 *   <V4DocsDrawer />                        the stock drawer (@theme/Navbar/MobileSidebar)
 *
 * Both use Docusaurus's navbar context, which exists only inside <Layout>, so
 * V4Header renders them only when it is the Layout's navbar (src/theme/Navbar
 * passes inLayout). The drawer's primary panel lists themeConfig.navbar.items,
 * which docusaurus.config.ts builds from site/data/siteNav.ts. Styled dark in
 * site/css/v4-template.css (.v4t-drawer).
 */
import React from "react";
import { useNavbarMobileSidebar } from "@docusaurus/theme-common/internal";
import NavbarMobileSidebar from "@theme/Navbar/MobileSidebar";

/** True on routes whose sidebar lives in the drawer below 996px. */
export function hasDrawerSidebar(pathname: string): boolean {
  return /^\/(docs|blog)(\/|$)/.test(pathname);
}

/** The MENU panel's first entry on docs/blog routes, shown only while the drawer can render (<=996px). */
export function V4DocsMenuItem({ pathname, onOpen }: { pathname: string; onOpen: () => void }): React.JSX.Element | null {
  const mobileSidebar = useNavbarMobileSidebar();
  if (!mobileSidebar.shouldRender) return null;
  return (
    <button
      type="button"
      className="v4t-menu-item v4t-menu-docs"
      onClick={() => {
        onOpen();
        mobileSidebar.toggle();
      }}
    >
      {pathname.startsWith("/blog") ? "Recent posts" : "Docs menu"} <span aria-hidden="true">›</span>
    </button>
  );
}

/** The slide-in drawer + backdrop. Infima shows it when an ancestor has navbar-sidebar--show. */
export function V4DocsDrawer(): React.JSX.Element {
  const mobileSidebar = useNavbarMobileSidebar();
  return (
    <div className={mobileSidebar.shown ? "v4t-drawer navbar-sidebar--show" : "v4t-drawer"}>
      <div className="navbar-sidebar__backdrop" role="presentation" onClick={mobileSidebar.toggle} />
      <NavbarMobileSidebar />
    </div>
  );
}
