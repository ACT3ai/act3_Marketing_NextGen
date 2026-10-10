import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import { isExternal, MORE_NAV, PRIMARY_NAV, SIGNIN } from "./site/data/siteNav";

// The one canonical public spelling of the company. Docusaurus appends this to
// every page title ("<page> | ACT 3 AI"), so it is also 11 characters of every
// search result: the old "ACT3 AI Marketing" spent 20 of the ~60 usable
// characters on a phrase nobody searches for, and was a fourth spelling of the
// name competing with "ACT 3", "ACT3" and "ACT 3 AI" for entity recognition.
const BRAND = "ACT 3 AI";
const SITE_URL = "https://act3ai.com";
const TAGLINE = "AI Filmmaking: From Script to Cinematic Video";
// The social card (themeConfig.image) is the v4 homepage hero: the ACT 3 mark
// and "AI Filmmaking at the speed of storytelling." over the hero still. It
// replaced img/Act3_Preview.jpg (a screenshot of the retired cream homepage) on
// 2026-10-09; made from the hero at 1200x630 with the nav, bullets and CTA hidden.
const SOCIAL_CARD_ALT = "ACT 3 AI | AI Filmmaking at the Speed of Storytelling";

// Google Fonts, requested exactly once for the whole site. Three components
// (SiteNavbar, PageHero, level2.css) each used to request an overlapping
// stylesheet, so most pages made two round trips for the same faces.
//   Fraunces / Inter / JetBrains Mono — the OLD template (cream pages, level2.css,
//     articles.css) and the homepage's "Get Started" pill (Inter).
//   Barlow / Barlow Condensed / Figtree — the v4 template (site/css/v4-template.css):
//     the hero top bar's faces and row 16's footer face, same weights the homepage
//     rows request, so scripts/build-v4-rows.js dedupes them out of the rows' link
//     (it reads this literal; keep it ONE string) and V4RowsPage drops them too.
const GOOGLE_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@500;600;700;800&family=Figtree:wght@300;400;500;600;700;800;900&family=Fraunces:opsz,ital,wght@9..144,0,300;9..144,0,400;9..144,0,500;9..144,1,300;9..144,1,400;9..144,1,500&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap";

// Site-wide structured data. This is the machine-readable statement of who we
// are: the sameAs list is what ties four separate social profiles into one
// recognised entity for both Google's knowledge graph and the LLM retrievers
// that increasingly answer "which tool does X" without sending a click.
const ORGANIZATION_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: BRAND,
  alternateName: "ACT3 AI",
  url: `${SITE_URL}/`,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/img/act3-logo.png`,
  },
  description:
    "ACT 3 AI is an AI filmmaking platform that turns a script into a finished film — scenes, shots, consistent characters, cinematography, voice, and a full-length cut.",
  sameAs: [
    "https://x.com/act3ai",
    "https://www.youtube.com/@ACT3AI",
    "https://www.linkedin.com/company/act3ai/",
    "https://github.com/ACT3ai",
  ],
};

const WEBSITE_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: BRAND,
  description: TAGLINE,
  inLanguage: "en",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

const SOFTWARE_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}/#software`,
  name: BRAND,
  applicationCategory: "MultimediaApplication",
  applicationSubCategory: "AI filmmaking and video production",
  operatingSystem: "Web",
  url: `${SITE_URL}/`,
  description:
    "Import a script and produce a full-length film: beats, scenes, and shots; characters with per-character identity models, wardrobe, and voice; cinematography, lipsync, motion capture, and a unified timeline you can watch end to end.",
  publisher: { "@id": `${SITE_URL}/#organization` },
  // A single Offer with an explicit price: Google's SoftwareApplication rich
  // result requires offers.price, which an AggregateOffer (lowPrice) lacks.
  // The free tier is the entry price; paid plans are described below.
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    url: "https://app.act3ai.com/settings/plans/",
    description:
      "Free tier plus monthly subscription plans with metered generation credits.",
  },
};

// Code-block colours. Prism writes them as inline styles, so CSS cannot restyle
// them per template; instead every colour is a CSS variable whose fallback is
// the GitHub light palette (the old template, and the cream pages that keep
// their own design: level2, the articles). html.v4t-skin redefines the
// --v4t-pr-* variables in site/css/v4-template.css with a warm dark palette.
const prismVar = (name: string, light: string): string => `var(--v4t-pr-${name}, ${light})`;
const V4_PRISM_THEME = {
  plain: { color: prismVar("plain", "#393A34"), backgroundColor: prismVar("bg", "#f6f8fa") },
  styles: [
    { types: ["comment", "prolog", "doctype", "cdata"], style: { color: prismVar("comment", "#999988"), fontStyle: "italic" as const } },
    { types: ["namespace"], style: { opacity: 0.7 } },
    { types: ["string", "attr-value"], style: { color: prismVar("string", "#e3116c") } },
    { types: ["punctuation", "operator"], style: { color: prismVar("punct", "#393A34") } },
    {
      types: ["entity", "url", "symbol", "number", "boolean", "variable", "constant", "property", "regex", "inserted"],
      style: { color: prismVar("number", "#36acaa") },
    },
    { types: ["atrule", "keyword", "attr-name", "selector"], style: { color: prismVar("attr", "#00a4db") } },
    { types: ["function", "deleted", "tag"], style: { color: prismVar("function", "#d73a49") } },
    { types: ["function-variable"], style: { color: prismVar("fnvar", "#6f42c1") } },
    { types: ["tag", "selector", "keyword"], style: { color: prismVar("keyword", "#00009f") } },
  ],
};

// themeConfig.navbar.items is never drawn as a desktop navbar (src/theme/Navbar
// renders V4Header), but the stock phone/tablet drawer that V4Header opens on
// docs and blog routes (V4DocsDrawer) lists these as its main menu. Built from
// site/data/siteNav.ts so that drawer matches the top bar.
const NAVBAR_ITEMS = [...PRIMARY_NAV, ...MORE_NAV, { label: "Sign in", href: SIGNIN }].map((item) =>
  isExternal(item.href)
    ? { href: item.href, label: item.label, position: "left" as const, target: "newTab" in item && item.newTab ? "_blank" : "_self" }
    : { to: item.href, label: item.label, position: "left" as const, ...(item.href === "/" ? { activeBaseRegex: "^/$" } : {}) },
);

type SitemapRoute = {
  path: string;
  metadata?: { sourceFilePath?: string };
  routes?: SitemapRoute[];
};

/** Last commit date (YYYY-MM-DD) for one repo file, or undefined if unknown. */
const gitDateCache = new Map<string, string | undefined>();
function gitLastCommitDate(file: string | undefined): string | undefined {
  if (!file) return undefined;
  if (gitDateCache.has(file)) return gitDateCache.get(file);
  let out: string | undefined;
  try {
    const stdout = execFileSync(
      "git",
      ["log", "-1", "--format=%cs", "--", file],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim();
    out = /^\d{4}-\d{2}-\d{2}$/.test(stdout) ? stdout : undefined;
  } catch {
    out = undefined;
  }
  gitDateCache.set(file, out);
  return out;
}

/**
 * Date (YYYY-MM-DD) of the newest blog post, from each post's `date:` front
 * matter or, failing that, its YYYY-MM-DD- filename prefix. Gives the /blog
 * index a <lastmod> that moves exactly when a post is published.
 */
function newestBlogPostDate(dir = "site/blog"): string | undefined {
  let newest: string | undefined;
  let entries: string[] = [];
  try {
    entries = readdirSync(dir);
  } catch {
    return undefined;
  }
  for (const name of entries) {
    const full = join(dir, name);
    let file: string | undefined;
    try {
      if (statSync(full).isDirectory()) {
        file = ["index.md", "index.mdx"].map((f) => join(full, f)).find((f) => {
          try {
            return statSync(f).isFile();
          } catch {
            return false;
          }
        });
      } else if (/\.mdx?$/.test(name)) {
        file = full;
      }
    } catch {
      continue;
    }
    if (!file) continue;
    let date = name.match(/^(\d{4}-\d{2}-\d{2})/)?.[1];
    try {
      const fm = readFileSync(file, "utf8").match(/^---\n([\s\S]*?)\n---/)?.[1];
      const fmDate = fm?.match(/^date:\s*["']?(\d{4}-\d{2}-\d{2})/m)?.[1];
      if (fmDate) date = fmDate;
    } catch {
      // keep the filename date
    }
    if (date && (!newest || date > newest)) newest = date;
  }
  return newest;
}

const config: Config = {
  title: BRAND,
  tagline: TAGLINE,
  favicon: "img/favicon/favicon.ico",

  headTags: [
    // ---- Fonts: one preconnect pair and one stylesheet for the whole site ----
    {
      tagName: "link",
      attributes: { rel: "preconnect", href: "https://fonts.googleapis.com" },
    },
    {
      tagName: "link",
      attributes: {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossorigin: "anonymous",
      },
    },
    {
      tagName: "link",
      attributes: { rel: "stylesheet", href: GOOGLE_FONTS_HREF },
    },
    // ---- Structured data ----
    {
      tagName: "script",
      attributes: { type: "application/ld+json" },
      innerHTML: JSON.stringify([ORGANIZATION_LD, WEBSITE_LD, SOFTWARE_LD]),
    },
    {
      tagName: "link",
      attributes: {
        rel: "icon",
        type: "image/svg+xml",
        href: "/img/favicon/favicon.svg",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "icon",
        type: "image/png",
        sizes: "96x96",
        href: "/img/favicon/favicon-96x96.png",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/img/favicon/apple-touch-icon.png",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "manifest",
        href: "/img/favicon/site.webmanifest",
      },
    },
    // Explicit social-card image hints. themeConfig.image emits og:image /
    // twitter:image, but crawlers (Facebook, LinkedIn) need width/height/type
    // to render the card reliably on first scrape.
    {
      tagName: "meta",
      attributes: {
        property: "og:image:type",
        content: "image/jpeg",
      },
    },
    {
      tagName: "meta",
      attributes: {
        property: "og:image:width",
        content: "1200",
      },
    },
    {
      tagName: "meta",
      attributes: {
        property: "og:image:height",
        content: "630",
      },
    },
    {
      tagName: "meta",
      attributes: {
        property: "og:image:alt",
        content: SOCIAL_CARD_ALT,
      },
    },
    {
      tagName: "meta",
      attributes: {
        name: "twitter:image:alt",
        content: SOCIAL_CARD_ALT,
      },
    },
  ],

  future: {
    v4: true,
  },

  customFields: {
    // The year in the template footer's copyright line (V4Footer). Fixed at
    // build time: computing it while rendering made the server HTML (build
    // year) and the browser (visitor's year) disagree every New Year, and React
    // then re-rendered the whole page (hydration error #418).
    buildYear: new Date().getFullYear(),
    // V4RowsPage drops a row font family from its own link only when this
    // site-wide link already loads every weight it asks for.
    googleFontsHref: GOOGLE_FONTS_HREF,
  },

  url: SITE_URL,
  baseUrl: "/",

  organizationName: "ACT3ai",
  projectName: "act3_Marketing_NextGen",
  trailingSlash: false,

  onBrokenLinks: "throw",
  onBrokenAnchors: "ignore",
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  staticDirectories: ["site/static"],

  presets: [
    [
      "classic",
      {
        docs: {
          path: "site/docs",
          sidebarPath: "./sidebars.ts",
          editUrl: undefined,
          routeBasePath: "docs",
        },
        blog: {
          path: "site/blog",
          showReadingTime: true,
          editUrl: undefined,
          blogTitle: "Blog",
          blogDescription:
            "Product news, launches and release notes from ACT 3 AI, the AI filmmaking platform that takes you from script to finished film.",
          postsPerPage: 10,
          onInlineAuthors: "ignore",
        },
        pages: {
          path: "site/pages",
          // Surfaces `last_update` from front matter as route metadata, which is
          // what lets the sitemap emit a real <lastmod> per article without
          // depending on git history (GitHub Actions checks out shallow).
          // The swizzled @theme/MDXPage deliberately does not render an
          // "EditMetaRow" from it, so no page grows a stray date line.
          showLastUpdateTime: true,
        },
        theme: {
          // custom.css = site-wide theme; v4-template.css = the v4 site template
          // (default for every page; scoped to html.v4t / html.v4t-skin / .v4t-*
          // classes — it must stay BEFORE the overlays below so a page's own
          // design overlay wins); level2.css = design overlay for the four
          // Level 2 pages (scoped to `.level2-page`, opted in per page via the
          // `wrapperClassName: level2-page` front matter).
          customCss: [
            "./site/css/custom.css",
            "./site/css/v4-template.css",
            "./site/css/level2.css",
            "./site/css/articles.css",
          ],
        },
        sitemap: {
          changefreq: "weekly",
          priority: 0.5,
          filename: "sitemap.xml",
          // <lastmod> is the recrawl signal, and as of 2024 it is the field
          // Google actually reads out of a sitemap. Articles carry an explicit
          // `last_update` date; everything else falls back to git.
          lastmod: "date",
          // /v/* are standalone design variations of the homepage, /backup is a
          // parked copy of the old homepage, and /backup/* are the old-template
          // copies of the pages that moved to the new template. All are noindex
          // and reachable by direct link only; none may compete with the live pages.
          // /docs/** is a stale local copy of the documentation: the live docs are
          // https://documentation.act3ai.com/ (LINKS.docs), nothing on the site
          // links here, and these pages contradict the live docs. They stay
          // reachable but are noindex (src/theme/Layout) and out of the sitemap.
          // The blog's tag and archive pages are thin index machinery (a list of
          // links, no description of their own); /blog itself covers them.
          ignorePatterns: [
            "/v/**",
            "/backup",
            "/backup/**",
            "/docs/**",
            "/blog/tags",
            "/blog/tags/**",
            "/blog/archive",
          ],
          // One priority for every URL says nothing about what matters. This
          // ranks the homepage and the article hub above the articles, and the
          // blog's index machinery below all of it.
          createSitemapItems: async ({
            defaultCreateSitemapItems,
            ...params
          }) => {
            const items = await defaultCreateSitemapItems(params);
            // Docusaurus only derives <lastmod> by itself for markdown routes
            // (from `last_update` front matter). The .tsx pages, the docs and
            // the blog come back with none, so read the last commit date for
            // each route's own source file. Requires full history, which is why
            // the deploy workflow checks out with fetch-depth: 0.
            const sourceByRoute = new Map<string, string>();
            const walk = (routes: SitemapRoute[]): void => {
              for (const route of routes) {
                const source = route.metadata?.sourceFilePath;
                if (source) sourceByRoute.set(route.path, source);
                if (route.routes) walk(route.routes);
              }
            };
            walk(params.routes as SitemapRoute[]);
            // The blog index has no source file of its own; it changes when a
            // post is published, so its <lastmod> is the newest post's date.
            const blogIndexDate = newestBlogPostDate();

            return items.map((item) => {
              const path = item.url.replace(SITE_URL, "") || "/";
              const lastmod =
                item.lastmod ??
                (path === "/blog" ? blogIndexDate : undefined) ??
                gitLastCommitDate(sourceByRoute.get(path));
              const route = path;
              const rule =
                route === "/"
                  ? { priority: 1.0, changefreq: "weekly" as const }
                  : route === "/articles"
                    ? { priority: 0.9, changefreq: "weekly" as const }
                    : route.startsWith("/articles/")
                      ? { priority: 0.7, changefreq: "monthly" as const }
                      : /^\/(features|level2|about|contact|mcp|cli|movies|tv|minidramas|videos)$/.test(route)
                        ? { priority: 0.8, changefreq: "monthly" as const }
                        : route.startsWith("/blog")
                          ? { priority: 0.3, changefreq: "monthly" as const }
                          : { priority: 0.5, changefreq: "monthly" as const };
              return { ...item, ...rule, ...(lastmod ? { lastmod } : {}) };
            });
          },
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/act3-social-card.jpg",
    colorMode: {
      defaultMode: "light",
      respectPrefersColorScheme: false,
      disableSwitch: true,
    },
    navbar: {
      // This site renders its own navbar (src/theme/Navbar swizzles to
      // site/components/v4/V4Header, or SiteNavbar on /backup/*). Only `items`
      // is drawn, in the docs/blog phone drawer (see NAVBAR_ITEMS) -- but the
      // theme still READS the rest of this config. `hideOnScroll: true` is load-bearing:
      // with it false, Docusaurus's table-of-contents highlighter measures
      // `document.querySelector(".navbar").clientHeight`, finds no element with
      // that class on this site, and throws during hydration -- which crashed
      // every page that renders a TOC. Setting it true makes the hook skip the
      // lookup. It changes nothing visually, because the stock navbar it would
      // otherwise affect is never rendered.
      hideOnScroll: true,
      title: BRAND,
      logo: {
        alt: "ACT 3 AI logo",
        src: "img/logo.svg",
        srcDark: "img/logo-dark.svg",
      },
      items: NAVBAR_ITEMS,
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Product",
          items: [
            { label: "Features", to: "/features" },
            { label: "Roadmap", to: "/docs/roadmap" },
          ],
        },
        {
          title: "Resources",
          items: [
            { label: "Articles", to: "/articles" },
            { label: "Documentation", to: "/docs/intro" },
          ],
        },
        {
          title: "Company",
          items: [
            { label: "About", to: "/about" },
            { label: "Contact", to: "/contact" },
            { label: "GitHub", href: "https://github.com/ACT3ai" },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} ACT 3 AI, Inc. All rights reserved.`,
    },
    prism: {
      // Light GitHub colours by default, warm dark ones on the v4 skin: see
      // V4_PRISM_THEME above (the colour mode itself stays forced to light).
      theme: V4_PRISM_THEME,
      darkTheme: prismThemes.dracula,
    },
    metadata: [
      {
        name: "keywords",
        content:
          "AI filmmaking, AI video generation, script to video, cinematography AI, Veo 3, Runway, FLUX, ComfyUI, video production, AI showrunner",
      },
      { name: "twitter:card", content: "summary_large_image" },
      // Declared here rather than in headTags so a page can override it --
      // react-helmet de-duplicates by property and the last declaration wins,
      // which is how article routes become og:type=article.
      { property: "og:type", content: "website" },
      // The browser UI tint (mobile address bar, Safari's tab bar): the v4
      // template's ground, so it continues the dark top bar. Here, not in
      // headTags, so a page can override it (the homepage's navy, the
      // /backup copies' old orange) without a second tag.
      { name: "theme-color", content: "#0f0e0c" },
    ],
  } satisfies Preset.ThemeConfig,
};

export default config;
