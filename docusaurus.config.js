"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prism_react_renderer_1 = require("prism-react-renderer");
var config = {
    title: "ACT3 AI Marketing",
    tagline: "AI Filmmaking — From Script to Cinematic Video",
    favicon: "img/favicon.ico",
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
            },
        ],
    ],
    themeConfig: {
        image: "img/act3ai-social-card.jpg",
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
            copyright: "Copyright \u00A9 ".concat(new Date().getFullYear(), " ACT3 AI, Inc. All rights reserved."),
        },
        prism: {
            theme: prism_react_renderer_1.themes.github,
            darkTheme: prism_react_renderer_1.themes.dracula,
        },
        metadata: [
            {
                name: "keywords",
                content: "AI filmmaking, AI video generation, script to video, cinematography AI, Veo 3, Runway, FLUX, ComfyUI, video production, AI showrunner",
            },
            { name: "twitter:card", content: "summary_large_image" },
        ],
    },
};
exports.default = config;
