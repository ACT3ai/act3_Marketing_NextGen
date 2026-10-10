/**
 * site/data/siteNav.ts — the ONE source of truth for site navigation.
 *
 * Everything that draws a navigation link reads it from here:
 *   * site/components/v4/V4Header.tsx   the template top bar (desktop nav, "More" dropdown, mobile menu)
 *   * site/components/v4/V4Footer.tsx   the template footer columns + social icons
 *   * site/components/v4/rowTransforms.ts  applySiteNav(): rewrites the homepage hero's nav/menu
 *                                         and row 16's footer columns to these same lists
 *   * site/components/SiteNavbar.tsx / SiteFooter.tsx  (old template) use oldTemplateHref() so
 *                                         that /backup/* stays browsable as a set
 *
 * To add, rename or reorder a link, edit it here and nowhere else.
 *
 * Rules the lists below must keep (see CLAUDE.md "SEO invariants"):
 *   * Articles is the LAST entry of MORE_NAV.
 *   * The footer "Resources" column keeps Articles (server-rendered on every
 *     page; the load-bearing inbound link for most of the published articles).
 *   * Internal routes are written without a trailing slash (trailingSlash: false).
 */

/** Every external URL the site links to. All verified 200. */
export const LINKS = {
  signup: "https://app.act3ai.com/signup/",
  signin: "https://app.act3ai.com/signin/",
  plans: "https://app.act3ai.com/settings/plans/",
  youtube: "https://www.youtube.com/@ACT3AI",
  docs: "https://documentation.act3ai.com/",
  privacy: "https://legal.act3ai.com/docs/privacy-policy/",
  terms: "https://legal.act3ai.com/docs/terms-of-service/",
  x: "https://x.com/act3ai",
  linkedin: "https://www.linkedin.com/company/act3ai/",
  github: "https://github.com/ACT3ai",
  email: "mailto:ContactUs@ACT3ai.com",
} as const;

export const SIGNUP = LINKS.signup;
export const SIGNIN = LINKS.signin;

/** The footer brand line (row 16). */
export const FOOTER_TAGLINE = "Create movies at the speed of storytelling.";

export interface NavItem {
  label: string;
  /** Internal route ("/about", no trailing slash) or an absolute external URL. */
  href: string;
  /**
   * The route is planned but its page does not exist yet. Internal links to it
   * skip Docusaurus's broken-link check (onBrokenLinks is "throw", so the build
   * would otherwise fail). Delete the flag in the same change that adds the page.
   */
  pending?: boolean;
  /**
   * Header only: open in a new tab. Links into the ACT 3 app (sign in, plans,
   * sign up) stay in the same tab, exactly as the homepage hero does; the footer
   * opens every external link in a new tab.
   */
  newTab?: boolean;
}

export interface FooterColumn {
  title: string;
  links: NavItem[];
}

export interface SocialLink {
  label: string;
  href: string;
  /** SVG path data for a 24x24 viewBox, drawn with fill="currentColor". */
  icon: string;
}

/** The top bar, left to right (the homepage hero's order). */
export const PRIMARY_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Movies", href: "/movies" },
  { label: "TV", href: "/tv" },
  { label: "Minidramas", href: "/minidramas" },
  { label: "Plans", href: LINKS.plans },
  { label: "Videos", href: "/videos" },
];

/** The "More" dropdown. Articles MUST stay the last entry (SEO invariant). */
export const MORE_NAV: NavItem[] = [
  { label: "Features", href: "/features" },
  { label: "Assistant Director Team", href: "/level2" },
  { label: "MCP", href: "/mcp" },
  { label: "CLI", href: "/cli" },
  { label: "Documentation", href: LINKS.docs, newTab: true },
  { label: "Articles", href: "/articles" },
];

/** The footer's four link columns (row 16's structure). Resources MUST keep Articles. */
export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Pricing", href: LINKS.plans },
      { label: "Features", href: "/features" },
      { label: "Movies", href: "/movies" },
      { label: "TV", href: "/tv" },
      { label: "Minidramas", href: "/minidramas" },
      { label: "Videos", href: "/videos" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Assistant Director Team", href: "/level2" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Articles", href: "/articles" },
      { label: "Documentation", href: LINKS.docs },
      { label: "MCP (Model Context Protocol)", href: "/mcp" },
      { label: "CLI (command line interface)", href: "/cli" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: LINKS.privacy },
      { label: "Terms of Service", href: LINKS.terms },
    ],
  },
];

/** Footer social icons (X, LinkedIn and GitHub paths are row 16's; YouTube is a filled play mark). */
export const SOCIAL: SocialLink[] = [
  {
    label: "X",
    href: LINKS.x,
    icon: "M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.3L5.3 21H2.2l7.3-8.3L2 3h6.3l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z",
  },
  {
    label: "YouTube",
    href: LINKS.youtube,
    icon: "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15.1V8.9l5.2 3.1z",
  },
  {
    label: "LinkedIn",
    href: LINKS.linkedin,
    icon: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.2c0-1.3 0-2.9-1.8-2.9s-2.1 1.4-2.1 2.8V21h-4z",
  },
  {
    label: "GitHub",
    href: LINKS.github,
    icon: "M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 2.9.8.1-.7.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7c-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2z",
  },
];

// ── helpers ──────────────────────────────────────────────────────────────────

/** True for an absolute URL (http(s):, mailto:, //host). Internal routes start with a single "/". */
export function isExternal(href: string): boolean {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href);
}

/** True when `href` is the current route or a parent of it ("/" only matches "/"). */
export function isActiveHref(href: string, pathname: string): boolean {
  if (isExternal(href)) return false;
  const path = pathname.replace(/\/+$/, "") || "/";
  if (href === "/") return path === "/";
  return path === href || path.startsWith(`${href}/`);
}

/**
 * The aria-current value for a nav link: "page" on the exact route, "true" on a
 * parent section (e.g. "Articles" while reading one article), else undefined.
 * Styles select on [aria-current] so both get the yellow "you are here" mark.
 */
export function currentAttr(href: string, pathname: string): "page" | "true" | undefined {
  if (!isActiveHref(href, pathname)) return undefined;
  const path = pathname.replace(/\/+$/, "") || "/";
  return path === href ? "page" : "true";
}

// ── template routing: which routes keep the OLD template ─────────────────────

/** Routes under this prefix render the OLD (cream) template; everything else the v4 template. */
export const OLD_TEMPLATE_PREFIX = "/backup";

/** True on /backup and /backup/* — the frozen old-template copies. */
export function isOldTemplatePath(pathname: string): boolean {
  return pathname === OLD_TEMPLATE_PREFIX || pathname.startsWith(`${OLD_TEMPLATE_PREFIX}/`);
}

/** Live routes that have a frozen old-template copy under /backup (site/pages/backup/). */
export const BACKUP_COPIES: Record<string, string> = {
  "/": "/backup",
  "/about": "/backup/about",
  "/contact": "/backup/contact",
  "/features": "/backup/features",
  "/mcp": "/backup/mcp",
  "/cli": "/backup/cli",
  "/articles": "/backup/articles",
};

/**
 * For the OLD template's links: on a /backup route, send an internal link that
 * has a backup copy to that copy, so the old template stays browsable as a set.
 * Everywhere else the href comes back unchanged.
 */
export function oldTemplateHref(href: string, pathname: string): string {
  if (!isOldTemplatePath(pathname) || isExternal(href)) return href;
  const [, path, rest] = href.match(/^([^?#]*)(.*)$/s) ?? ["", href, ""];
  const copy = BACKUP_COPIES[path.replace(/\/+$/, "") || "/"];
  return copy ? copy + rest : href;
}
