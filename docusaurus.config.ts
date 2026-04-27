import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "ACT3 AI Marketing",
  tagline: "AI Filmmaking — From Script to Cinematic Video",
  favicon: "img/favicon.ico",

  future: {
    v4: true,
  },

  url: "https://marketing.act3ai.com",
  baseUrl: "/",

  organizationName: "ACT3ai",
  projectName: "act3_Marketing_NextGen",
  trailingSlash: false,

  onBrokenLinks: "throw",
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
          blogTitle: "ACT3 AI Blog",
          blogDescription: "News and updates from ACT3 AI",
          postsPerPage: 10,
          onInlineAuthors: "ignore",
        },
        pages: {
          path: "site/pages",
        },
        theme: {
          customCss: "./site/css/custom.css",
        },
        sitemap: {
          changefreq: "weekly",
          priority: 0.5,
          filename: "sitemap.xml",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/act3ai-social-card.jpg",
    colorMode: {
      defaultMode: "dark",
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "ACT3 AI",
      logo: {
        alt: "ACT3 AI Logo",
        src: "img/logo.svg",
        srcDark: "img/logo-dark.svg",
      },
      items: [
        {
          to: "/",
          label: "Home",
          position: "left",
          activeBaseRegex: "^/$",
        },
        {
          to: "/features",
          label: "Features",
          position: "left",
        },
        {
          to: "/pricing",
          label: "Pricing",
          position: "left",
        },
        {
          type: "docSidebar",
          sidebarId: "mainSidebar",
          position: "left",
          label: "Docs",
        },
        {
          to: "/blog",
          label: "Blog",
          position: "left",
        },
        {
          href: "https://act3ai.com",
          label: "Launch App",
          position: "right",
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
            { label: "Pricing", to: "/pricing" },
            { label: "Roadmap", to: "/docs/roadmap" },
            { label: "Changelog", to: "/docs/changelog" },
          ],
        },
        {
          title: "Resources",
          items: [
            { label: "Documentation", to: "/docs/intro" },
            { label: "Blog", to: "/blog" },
            { label: "Tutorials", to: "/docs/tutorials/first-video" },
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
      copyright: `Copyright © ${new Date().getFullYear()} ACT3 AI, Inc. All rights reserved.`,
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
    ],
  } satisfies Preset.ThemeConfig,
};

export default config;
