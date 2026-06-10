import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "ACT3 AI Marketing",
  tagline: "AI Filmmaking — From Script to Cinematic Video",
  favicon: "img/favicon/favicon.ico",

  headTags: [
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
  ],

  future: {
    v4: true,
  },

  url: "https://act3ai.com",
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
    image: "img/Act3_Preview.jpg",
    colorMode: {
      defaultMode: "light",
      respectPrefersColorScheme: false,
      disableSwitch: true,
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
            { label: "Pricing", to: "/pricing" },
            { label: "Roadmap", to: "/docs/roadmap" },
          ],
        },
        {
          title: "Resources",
          items: [
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
