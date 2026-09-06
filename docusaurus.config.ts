import { execFileSync } from "node:child_process";
import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// The one canonical public spelling of the company. Docusaurus appends this to
// every page title ("<page> | ACT 3 AI"), so it is also 11 characters of every
// search result: the old "ACT3 AI Marketing" spent 20 of the ~60 usable
// characters on a phrase nobody searches for, and was a fourth spelling of the
// name competing with "ACT 3", "ACT3" and "ACT 3 AI" for entity recognition.
const BRAND = "ACT 3 AI";
const SITE_URL = "https://act3ai.com";
const TAGLINE = "AI Filmmaking: From Script to Cinematic Video";
const SOCIAL_CARD_ALT = "ACT 3 AI | Create Movies at the Speed of Storytelling";

// Google Fonts, requested exactly once for the whole site. Three components
// (SiteNavbar, PageHero, level2.css) each used to request an overlapping
// stylesheet, so most pages made two round trips for the same faces.
const GOOGLE_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Fraunces:opsz,ital,wght@9..144,0,300;9..144,0,400;9..144,0,500;9..144,1,300;9..144,1,400;9..144,1,500&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap";

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
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: "0",
    url: "https://app.act3ai.com/settings/plans/",
    description:
      "Free tier plus monthly subscription plans with metered generation credits.",
  },
};

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
    {
      tagName: "meta",
      attributes: {
        name: "theme-color",
        content: "#C0531F",
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
          blogTitle: "ACT 3 AI Blog",
          blogDescription: "Product news and release notes from ACT 3 AI",
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
          // custom.css = site-wide theme; level2.css = design overlay for the
          // four Level 2 pages (scoped to `.level2-page`, opted in per page via
          // the `wrapperClassName: level2-page` front matter).
          customCss: [
            "./site/css/custom.css",
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
          // /v/* are standalone design variations of the homepage, and /backup
          // is a parked copy of it. All are noindex and reachable by direct
          // link only; none of them may compete with the real homepage.
          ignorePatterns: ["/v/**", "/backup"],
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

            return items.map((item) => {
              const path = item.url.replace(SITE_URL, "") || "/";
              const lastmod =
                item.lastmod ?? gitLastCommitDate(sourceByRoute.get(path));
              const route = path;
              const rule =
                route === "/"
                  ? { priority: 1.0, changefreq: "weekly" as const }
                  : route === "/articles"
                    ? { priority: 0.9, changefreq: "weekly" as const }
                    : route.startsWith("/articles/")
                      ? { priority: 0.7, changefreq: "monthly" as const }
                      : /^\/(features|level2|about|contact|mcp|cli)$/.test(route)
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
    image: "img/Act3_Preview.jpg",
    colorMode: {
      defaultMode: "light",
      respectPrefersColorScheme: false,
      disableSwitch: true,
    },
    navbar: {
      // This site renders its own navbar (src/theme/Navbar swizzles to
      // site/components/SiteNavbar), so nothing below is drawn -- but the
      // theme still READS this config. `hideOnScroll: true` is load-bearing:
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
      items: [
        {
          to: "/",
          label: "Main",
          position: "left",
          activeBaseRegex: "^/$",
        },
        {
          to: "/about",
          label: "About Us",
          position: "left",
        },
        {
          to: "/contact",
          label: "Contact Us",
          position: "left",
        },
        {
          href: "https://app.act3ai.com/settings/plans/",
          label: "Plans",
          position: "left",
        },
        {
          href: "https://www.youtube.com/@ACT3AI",
          label: "Videos",
          position: "left",
          target: "_blank",
        },
        {
          href: "https://act3ai.com/login",
          label: "Log In",
          position: "right",
        },
        {
          href: "https://act3ai.com",
          label: "Start Free",
          position: "right",
          className: "button button--primary navbar__button",
        },
      ],
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
      theme: prismThemes.github,
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
    ],
  } satisfies Preset.ThemeConfig,
};

export default config;
