/**
 * V4Link — the one link primitive of the v4 template (header, footer, blocks).
 *
 *   <V4Link href="/about">About</V4Link>                       internal: @docusaurus/Link (SPA + prefetch)
 *   <V4Link href="https://app.act3ai.com/signup/">Go</V4Link>  external: plain <a>, same tab
 *   <V4Link href={LINKS.docs} newTab>Docs</V4Link>             external, new tab (noopener noreferrer)
 *   <V4Link href="/movies" pending>Movies</V4Link>             planned route: skips the broken-link check
 *
 * Internal routes go through @docusaurus/Link so they prefetch on hover/view and
 * navigate without a reload. A `pending` route (see NavItem.pending in
 * site/data/siteNav.ts) is a page that does not exist yet; onBrokenLinks is
 * "throw", so without the opt-out the production build would fail on it.
 */
import React from "react";
import Link from "@docusaurus/Link";
import { isExternal } from "../../data/siteNav";

export interface V4LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  /** External links only: open in a new tab. */
  newTab?: boolean;
  /** Internal links only: the route does not exist yet; skip the broken-link check. */
  pending?: boolean;
}

export default function V4Link({ href, newTab, pending, children, ...rest }: V4LinkProps): React.JSX.Element {
  if (isExternal(href)) {
    const tab = newTab ? { target: "_blank", rel: "noopener noreferrer" } : {};
    return (
      <a href={href} {...tab} {...rest}>
        {children}
      </a>
    );
  }
  const check = pending ? { "data-noBrokenLinkCheck": true } : {};
  return (
    <Link to={href} {...check} {...rest}>
      {children}
    </Link>
  );
}
