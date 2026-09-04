import React from "react";
import Head from "@docusaurus/Head";

/**
 * Route: /v/2
 *
 * A standalone design variation of the ACT 3 homepage — "The Slate".
 * Source design: ~/BGit/all/film/design/brand/jenny/claude_design/v/1/html/index.html
 *
 * This page deliberately does NOT use the Docusaurus theme Layout, SiteNavbar or
 * SiteFooter: the design carries its own header and footer, and keeping it
 * self-contained guarantees it cannot affect any other page on the site. Every
 * CSS rule below is either scoped under `.v2` or lives in a <style> tag that is
 * only mounted while this route is rendered.
 */

const PAGE_CSS = `
/* The ground colour has to reach the html element so overscroll and the area
   below a short viewport stay off-black. Route-scoped: this <style> unmounts
   when the SPA navigates away. */
html, body { background: #0B0B0A; }

.v2 {
  --ground: #0B0B0A;
  --panel: #0E0E0D;
  --ink: #EAE8E3;
  --ink-2: #A5A49E;
  --ink-3: #8C8B86;
  --ink-4: #56554F;
  --ink-5: #3F3F3B;
  --line: rgba(234, 232, 227, 0.10);
  --line-2: rgba(234, 232, 227, 0.12);
  --line-3: rgba(234, 232, 227, 0.28);
  --fade: linear-gradient(90deg, rgba(234,232,227,0.26), rgba(234,232,227,0.05));

  --mono: 'Roboto Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  --body: 'Archivo', 'Helvetica Neue', Arial, sans-serif;

  --pad-x: clamp(20px, 5.5vw, 96px);
  --gutter: 232px;
  --gap: clamp(30px, 6vw, 96px);
  --sec-y: clamp(84px, 12vw, 168px);

  position: relative;
  background: var(--ground);
  color: var(--ink);
  font-family: var(--body);
  font-size: 16px;
  line-height: 1.6;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.v2 *, .v2 *::before, .v2 *::after { box-sizing: border-box; }
.v2 h1, .v2 h2, .v2 h3, .v2 p { margin: 0; }
.v2 a { color: var(--ink); text-decoration: none; transition: color 120ms linear, background-color 120ms linear, border-color 120ms linear; }
.v2 ::selection { background: #EAE8E3; color: #0B0B0A; }
.v2 img { display: block; max-width: 100%; }

/* Concrete grain. Fixed, so it reads as a grain plate over the picture rather
   than a texture that scrolls with the page. */
.v2-grain {
  position: fixed;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E");
}
.v2-inner { position: relative; z-index: 1; max-width: 1440px; margin: 0 auto; }

/* ---------- type helpers ---------- */
.v2-mono { font-family: var(--mono); }
.v2-rule { height: 1px; background: var(--line); }
.v2-rule--bright { height: 1px; background: var(--fade); }

/* Slate metadata label: "00 / THE INPUT" */
.v2-tag {
  font-family: var(--mono);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.26em;
  color: var(--ink-4);
}
.v2-note {
  font-family: var(--mono);
  font-size: 9.5px;
  letter-spacing: 0.2em;
  color: var(--ink-5);
}

/* ---------- buttons ---------- */
.v2-btn {
  display: inline-block;
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  padding: 18px 34px;
  white-space: nowrap;
}
/* Written as ".v2 a.x" so these beat the ".v2 a" colour rule above; a bare
   ".v2-btn--solid" loses on specificity and the label goes invisible. */
.v2 a.v2-btn--solid { color: var(--ground); background: var(--ink); border: 1px solid var(--ink); }
.v2 a.v2-btn--solid:hover { color: var(--ground); background: #FFFFFF; border-color: #FFFFFF; }
.v2 a.v2-btn--ghost { color: var(--ink); border: 1px solid var(--line-3); }
.v2 a.v2-btn--ghost:hover { color: var(--ink); border-color: var(--ink); }
.v2 a.v2-btn--under {
  color: var(--ink-3);
  border-bottom: 1px solid rgba(234, 232, 227, 0.24);
  padding: 0 0 5px 0;
}
.v2 a.v2-btn--under:hover { color: var(--ink); border-bottom-color: var(--ink); }

/* ---------- header ---------- */
.v2-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  padding: 34px var(--pad-x);
  border-bottom: 1px solid var(--line);
}
.v2-wordmark { font-family: var(--mono); font-size: 17px; font-weight: 700; letter-spacing: 0.34em; color: var(--ink); }
.v2-nav { display: flex; align-items: center; gap: clamp(16px, 2.4vw, 38px); flex-wrap: wrap; }
.v2-nav a {
  font-family: var(--mono);
  font-size: 10.5px;
  font-weight: 500;
  letter-spacing: 0.2em;
  color: var(--ink-3);
}
.v2-nav a:hover { color: var(--ink); }
.v2-nav__div { width: 1px; height: 14px; background: rgba(234, 232, 227, 0.16); }
.v2-nav__cta {
  font-weight: 700 !important;
  color: var(--ground) !important;
  background: var(--ink);
  padding: 11px 20px;
}
.v2-nav__cta:hover { background: #FFFFFF; }

/* ---------- shared row: 232px slate gutter + content ---------- */
.v2-row { display: flex; gap: var(--gap); align-items: flex-start; }
.v2-row--bottom { align-items: flex-end; }
.v2-slate { width: var(--gutter); flex-shrink: 0; }
.v2-flex { flex-grow: 1; min-width: 0; }
.v2-sec { padding: var(--sec-y) var(--pad-x) 0 var(--pad-x); }

/* ---------- hero ---------- */
.v2-hero { display: flex; gap: var(--gap); padding: clamp(64px, 9vw, 128px) var(--pad-x) 0 var(--pad-x); }
.v2-hero__main { flex-grow: 1; max-width: 940px; min-width: 0; }
.v2-eyebrow { display: flex; align-items: center; gap: 20px; margin-bottom: clamp(40px, 5.5vw, 76px); }
.v2-eyebrow__label {
  font-family: var(--mono);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.26em;
  color: var(--ink-3);
}
.v2-eyebrow__line { flex-grow: 1; height: 1px; background: linear-gradient(90deg, rgba(234,232,227,0.28), rgba(234,232,227,0.04)); }
.v2-h1 {
  font-family: var(--mono);
  font-size: clamp(31px, 6.4vw, 90px);
  font-weight: 700;
  line-height: 1.0;
  letter-spacing: -0.035em;
  text-wrap: pretty;
}
.v2-lede { margin-top: clamp(30px, 3.8vw, 52px) !important; max-width: 620px; font-size: 17px; line-height: 1.65; color: var(--ink-2); }
.v2-actions { display: flex; align-items: center; gap: 28px; flex-wrap: wrap; margin-top: clamp(34px, 4vw, 56px); }

.v2-slatecard { width: var(--gutter); flex-shrink: 0; padding-top: 6px; }
.v2-slatecard__top { height: 1px; background: rgba(234, 232, 227, 0.16); }
.v2-slatecard__list { display: flex; flex-direction: column; gap: 26px; padding-top: 26px; }
.v2-slatecard__k { font-family: var(--mono); font-size: 9.5px; font-weight: 500; letter-spacing: 0.24em; color: var(--ink-4); margin-bottom: 9px; }
.v2-slatecard__v { font-family: var(--mono); font-size: 13px; font-weight: 700; letter-spacing: 0.02em; color: var(--ink); }

.v2-trust { padding: clamp(70px, 9vw, 132px) var(--pad-x) 0 var(--pad-x); }
.v2-trust__label { padding-top: 22px; font-family: var(--mono); font-size: 10px; font-weight: 500; letter-spacing: 0.3em; color: var(--ink-4); }

/* ---------- 00 / the input: screenplay ---------- */
.v2-script {
  position: relative;
  background: var(--panel);
  border: 1px solid var(--line-2);
  padding: clamp(36px, 6vw, 74px) clamp(24px, 6.6vw, 96px);
  overflow-x: auto;
}
.v2-script__body { font-family: var(--mono); font-size: clamp(13px, 1.15vw, 16px); line-height: 2.0; color: var(--ink); min-width: 320px; }
.v2-script__slug { font-weight: 700; letter-spacing: 0.04em; }
.v2-script__char { padding-left: clamp(60px, 16vw, 232px); font-weight: 700; letter-spacing: 0.14em; }
.v2-script__line { padding-left: clamp(30px, 8vw, 116px); max-width: 460px; color: var(--ink-2); }
.v2-script__gap { height: 30px; }
.v2-script__gap--sm { height: 22px; }

/* corner brackets — machined, not decorative */
.v2-bracket { position: absolute; background: rgba(234, 232, 227, 0.3); }
.v2-bracket--tl-h { top: 18px; left: 22px; width: 22px; height: 1px; }
.v2-bracket--tl-v { top: 18px; left: 22px; width: 1px; height: 22px; }
.v2-bracket--br-h { bottom: 18px; right: 22px; width: 22px; height: 1px; }
.v2-bracket--br-v { bottom: 18px; right: 22px; width: 1px; height: 22px; }

/* ---------- three-up divided grids (stats, position) ---------- */
.v2-grid3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0; }
.v2-grid3 > * { border-right: 1px solid var(--line); padding: clamp(40px, 4.8vw, 68px) clamp(24px, 3.9vw, 56px); }
.v2-grid3 > *:first-child { padding-left: 0; }
.v2-grid3 > *:last-child { padding-right: 0; border-right: 0; }
.v2-stat__n { font-family: var(--mono); font-size: clamp(38px, 4.6vw, 58px); font-weight: 700; letter-spacing: -0.03em; line-height: 1; }
.v2-stat__p { margin-top: 22px !important; font-size: 14px; line-height: 1.65; color: var(--ink-3); max-width: 280px; }

.v2-h2 {
  font-family: var(--mono);
  font-size: clamp(27px, 3.6vw, 46px);
  font-weight: 700;
  line-height: 1.12;
  letter-spacing: -0.03em;
  max-width: 760px;
}
.v2-sub { margin-top: 28px !important; font-size: 16px; line-height: 1.7; color: var(--ink-3); max-width: 520px; }
.v2-head-row { margin-bottom: clamp(48px, 6.5vw, 96px); }

/* ---------- 01 / method: numbered steps ---------- */
.v2-step { display: flex; gap: var(--gap); padding: clamp(32px, 4.4vw, 56px) 0; align-items: baseline; }
.v2-step__n { width: var(--gutter); flex-shrink: 0; font-family: var(--mono); font-size: 13px; font-weight: 700; letter-spacing: 0.2em; color: var(--ink-4); }
.v2-step__t { width: 340px; flex-shrink: 0; font-family: var(--mono); font-size: clamp(17px, 1.6vw, 20px); font-weight: 700; letter-spacing: -0.01em; }
.v2-step__p { font-size: 16px; line-height: 1.7; color: var(--ink-3); max-width: 520px; }

/* ---------- 02 / look: style frames ---------- */
.v2-styles { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 28px; }
.v2-frame {
  position: relative;
  aspect-ratio: 16 / 9;
  background: var(--panel);
  border: 1px solid var(--line-2);
  overflow: hidden;
}
.v2-frame img { width: 100%; height: 100%; object-fit: cover; filter: saturate(0.92) contrast(1.03); }
.v2-frame__brackets { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
.v2-frame__brackets span { position: absolute; background: rgba(234, 232, 227, 0.28); }
.v2-frame__brackets span:nth-child(1) { top: 14px; left: 14px; width: 16px; height: 1px; }
.v2-frame__brackets span:nth-child(2) { top: 14px; left: 14px; width: 1px; height: 16px; }
.v2-frame__brackets span:nth-child(3) { bottom: 14px; right: 14px; width: 16px; height: 1px; }
.v2-frame__brackets span:nth-child(4) { bottom: 14px; right: 14px; width: 1px; height: 16px; }
.v2-style__row { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin-top: 14px; }
.v2-style__name { font-family: var(--mono); font-size: 12px; font-weight: 700; letter-spacing: 0.16em; color: var(--ink); text-transform: uppercase; }

/* ---------- 03 / crew: call sheet ---------- */
.v2-crew__row { display: flex; align-items: baseline; gap: clamp(16px, 2.8vw, 40px); padding: 26px 0; }
.v2-crew__id { width: 40px; flex-shrink: 0; font-family: var(--mono); font-size: 10.5px; letter-spacing: 0.16em; color: var(--ink-5); }
.v2-crew__role { width: 300px; flex-shrink: 0; font-family: var(--mono); font-size: clamp(15px, 1.7vw, 22px); font-weight: 700; letter-spacing: 0.02em; text-transform: uppercase; }
.v2-crew__desc { font-size: 15px; line-height: 1.7; color: var(--ink-3); max-width: 460px; }

/* ---------- 04 / position ---------- */
.v2-pos__k { font-family: var(--mono); font-size: 9.5px; font-weight: 700; letter-spacing: 0.26em; }
.v2-pos__k--us { color: var(--ink); }
.v2-pos__k--them { color: var(--ink-4); }
.v2-pos__sub { margin-top: 12px; font-family: var(--mono); font-size: 9.5px; letter-spacing: 0.2em; color: var(--ink-5); }
.v2-pos__p { margin-top: 30px !important; font-size: 15px; line-height: 1.7; }
.v2-pos__p--us { color: var(--ink-2); }
.v2-pos__p--them { color: var(--ink-4); }

/* ---------- 05 / terms: pricing ---------- */
.v2-tiers { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 28px; }
.v2-tier { display: flex; flex-direction: column; border: 1px solid var(--line-2); padding: 44px 40px 40px 40px; }
.v2-tier__name { font-family: var(--mono); font-size: 10.5px; font-weight: 700; letter-spacing: 0.26em; color: var(--ink-3); }
.v2-tier__price { margin-top: 40px; font-family: var(--mono); font-size: 40px; font-weight: 700; letter-spacing: -0.03em; line-height: 1; }
.v2-tier__per { margin-top: 12px; font-family: var(--mono); font-size: 9.5px; letter-spacing: 0.2em; color: var(--ink-5); text-transform: uppercase; }
.v2-tier__rule { height: 1px; background: var(--line); margin: 40px 0; }
.v2-tier__feats { list-style: none; margin: 0; padding: 0; font-size: 14px; line-height: 1.9; color: var(--ink-4); flex-grow: 1; }
.v2-tier__cta { margin-top: 44px; text-align: center; padding-left: 0; padding-right: 0; }

/* ---------- close ---------- */
.v2-close { padding: clamp(120px, 16vw, 220px) var(--pad-x); }
.v2-close__h {
  font-family: var(--mono);
  font-size: clamp(26px, 5.4vw, 76px);
  font-weight: 700;
  line-height: 1.04;
  letter-spacing: -0.035em;
  max-width: 900px;
}
.v2-close__p { margin-top: clamp(28px, 3.2vw, 44px) !important; font-size: 17px; line-height: 1.65; color: var(--ink-2); }

/* ---------- footer ---------- */
.v2-foot { border-top: 1px solid var(--line); padding: 76px var(--pad-x) 44px var(--pad-x); }
.v2-foot__brand { width: 340px; flex-shrink: 0; }
.v2-foot__mark { font-family: var(--mono); font-size: 15px; font-weight: 700; letter-spacing: 0.34em; }
.v2-foot__tag { margin-top: 22px !important; font-size: 14px; line-height: 1.7; color: var(--ink-4); max-width: 260px; }
.v2-foot__cols { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 40px; flex-grow: 1; }
.v2-foot__k { font-family: var(--mono); font-size: 9.5px; font-weight: 700; letter-spacing: 0.24em; color: var(--ink-5); margin-bottom: 22px; }
.v2-foot__list { display: flex; flex-direction: column; gap: 13px; }
.v2-foot__list a { font-size: 14px; color: var(--ink-3); }
.v2-foot__list a:hover { color: var(--ink); }
.v2-foot__bar { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
.v2-foot__social { display: flex; gap: 30px; }
.v2-foot__social a { font-family: var(--mono); font-size: 9.5px; letter-spacing: 0.2em; color: var(--ink-4); }
.v2-foot__social a:hover { color: var(--ink); }

/* ---------- responsive ---------- */
@media (max-width: 1180px) {
  .v2-crew__role { width: 220px; }
}
@media (max-width: 1000px) {
  .v2-hero { flex-direction: column; }
  .v2-slatecard { width: 100%; }
  .v2-slatecard__list { flex-direction: row; flex-wrap: wrap; gap: 34px; }
  .v2-row { flex-direction: column; }
  .v2-slate { width: 100%; }
  .v2-head-row { margin-bottom: clamp(36px, 6vw, 64px); }
  .v2-step { flex-wrap: wrap; gap: 18px 32px; }
  .v2-step__n { width: auto; }
  .v2-step__t { width: auto; flex-grow: 1; }
  .v2-step__p { max-width: none; flex-basis: 100%; }
  .v2-styles { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .v2-crew__row { flex-wrap: wrap; gap: 10px 24px; }
  .v2-crew__role { width: auto; }
  .v2-crew__desc { flex-basis: 100%; padding-left: 64px; max-width: none; }
}
@media (max-width: 860px) {
  .v2-grid3 { grid-template-columns: 1fr; }
  .v2-grid3 > * { border-right: 0; border-bottom: 1px solid var(--line); padding-left: 0; padding-right: 0; }
  .v2-grid3 > *:last-child { border-bottom: 0; }
  .v2-tiers { grid-template-columns: 1fr; }
  .v2-foot__cols { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 34px; }
}
@media (max-width: 760px) {
  .v2-head { padding-top: 22px; padding-bottom: 22px; }
  .v2-nav { gap: 14px 18px; }
  .v2-nav__div { display: none; }
  .v2-foot .v2-row { gap: 48px; }
  .v2-foot__brand { width: 100%; }
}
@media (max-width: 560px) {
  .v2-styles { grid-template-columns: 1fr; }
  .v2-btn { padding: 16px 24px; }
  .v2-crew__desc { padding-left: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .v2 a { transition: none; }
}
`;

// ── content ───────────────────────────────────────────────────────────────────
// Words come from the live homepage; the packaging comes from the design.

const SIGNUP = "https://app.act3ai.com/signup/";
const SIGNIN = "https://app.act3ai.com/signin/";
const PLANS = "https://app.act3ai.com/settings/plans/";
const YOUTUBE = "https://www.youtube.com/@ACT3AI";

const SLATE = [
  { k: "Runtime", v: "5 MIN — 3 HR" },
  { k: "Delivery", v: "PRORES / 4K" },
  { k: "Pre-production", v: "~2 HOURS" },
];

const STATS = [
  { n: "80–200", p: "hours of pre-production collapsed to roughly two." },
  { n: "1", p: "platform in place of ten or more traditional production tools." },
  { n: "FULL", p: "films. Not eight-to-forty-second clips." },
];

const STEPS = [
  {
    n: "01",
    t: "Write Your Story",
    p: "Type dialogue, scene descriptions, and camera notes in plain language. ACT 3 understands intent, not just prompts.",
  },
  {
    n: "02",
    t: "AI Produces Your Film",
    p: "Casting, set building, cinematography, lighting, and rendering happen automatically. Every shot informed by your script.",
  },
  {
    n: "03",
    t: "Edit, Refine, Export",
    p: "The integrated editor lets you adjust any shot. When you are done, export to any format: YouTube, TikTok, ProRes, 4K.",
  },
];

const STYLES = [
  { name: "Realistic", note: "photoreal · 35mm", slug: "realistic" },
  { name: "Cinematic", note: "anamorphic · color grade", slug: "cinematic" },
  { name: "Anime", note: "2D · cel-shaded", slug: "anime" },
  { name: "3D Animation", note: "stylized · cartoon", slug: "3d" },
  { name: "Cartoon", note: "flat · bold linework", slug: "cartoon" },
  { name: "Stylized / Illustrated", note: "painterly · editorial", slug: "illustrated" },
];

const CREW = [
  { role: "Writer", desc: "Develops scripts, dialogue, and narrative structure from your inputs." },
  { role: "Director", desc: "Orchestrates overall vision, scene pacing, and story flow." },
  { role: "Cinematographer", desc: "Camera placement, movement, shot composition, and visual storytelling." },
  { role: "Set Designer", desc: "Creates virtual environments, location designs, and spatial planning." },
  { role: "Casting & Wardrobe", desc: "Selects characters, designs costumes, maintains visual consistency." },
];

// Jenny's note: keep the substance, drop the scoreboard. No competitor is named.
const POSITION = [
  {
    k: "ACT 3",
    sub: "Filmmaking platform",
    p: "Full films, five minutes to three hours, script through final cut.",
    us: true,
  },
  {
    k: "Clip Generators",
    sub: "A different job",
    p: "Eight to forty seconds at a time. No script. No continuity across a picture.",
    us: false,
  },
  {
    k: "Business Video",
    sub: "A different audience",
    p: "Presenters and training decks. Not cinema.",
    us: false,
  },
];

const TIERS = [
  {
    name: "Creator",
    price: "$49",
    per: "per month",
    feats: ["24,500 credits / month", "61,250 credit rollover bank", "Cloud storage 50 GB"],
    href: PLANS + "?plan=Creator",
    solid: true,
  },
  {
    name: "Pro",
    price: "$175",
    per: "per month",
    feats: [
      "87,500 credits / month",
      "218,750 credit rollover bank",
      "Cloud storage 740 GB",
      "All AI video models",
      "Priority rendering",
    ],
    href: PLANS + "?plan=Pro",
    solid: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    per: "Agencies, studios, teams",
    feats: ["High credits / month", "High rollover bank", "High cloud storage"],
    href: "mailto:ContactUs@ACT3ai.com",
    solid: false,
  },
];

function Brackets(): React.JSX.Element {
  return (
    <div className="v2-frame__brackets" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}

export default function SlateVariation(): React.JSX.Element {
  return (
    <>
      <Head>
        <html lang="en" />
        <title>ACT 3 | Create Movies at the Speed of Storytelling</title>
        <meta
          name="description"
          content="ACT 3 is the AI filmmaking platform for full films — five minutes to three hours, script through final cut."
        />
        {/* Design variation, not a page we want ranking against the real homepage. */}
        <meta name="robots" content="noindex, nofollow" />
        <meta name="theme-color" content="#0B0B0A" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&family=Archivo:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Rendered in the component tree, not <Head>, so the styles are in the
          server-rendered HTML at first paint and there is no FOUC. */}
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />

      <div className="v2">
        <div className="v2-grain" aria-hidden="true" />

        <div className="v2-inner">
          {/* ============ HEADER ============ */}
          <header className="v2-head">
            <a className="v2-wordmark" href="/v/2" aria-label="ACT 3 home">
              ACT&nbsp;3
            </a>
            <nav className="v2-nav">
              <a href="/">Main</a>
              <a href={YOUTUBE} target="_blank" rel="noreferrer">
                Videos
              </a>
              <a href={PLANS}>Plans</a>
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
              <span className="v2-nav__div" aria-hidden="true" />
              <a href={SIGNIN}>Log In</a>
              <a className="v2-nav__cta" href={SIGNUP}>
                Get Started
              </a>
            </nav>
          </header>

          {/* ============ HERO ============ */}
          <section className="v2-hero">
            <div className="v2-hero__main">
              <div className="v2-eyebrow">
                <span className="v2-eyebrow__label">AI FILMMAKING PLATFORM</span>
                <span className="v2-eyebrow__line" aria-hidden="true" />
              </div>
              {/* One word, committed to. The live site cycles "Movies / Videos";
                  this variation does not compete for attention. */}
              <h1 className="v2-h1">
                Create Movies
                <br />
                at the Speed
                <br />
                of Storytelling.
              </h1>
              <p className="v2-lede">
                Five-minute shorts to three-hour features, at the lowest labor in the industry. No
                prompt engineering. No tool switching. You write the story; ACT&nbsp;3 handles
                everything else.
              </p>
              <div className="v2-actions">
                <a className="v2-btn v2-btn--solid" href={SIGNUP}>
                  GET STARTED
                </a>
                <a className="v2-btn v2-btn--ghost" href={YOUTUBE} target="_blank" rel="noreferrer">
                  SEE ACT 3 IN ACTION
                </a>
              </div>
            </div>

            <aside className="v2-slatecard">
              <div className="v2-slatecard__top" aria-hidden="true" />
              <dl className="v2-slatecard__list">
                {SLATE.map((s) => (
                  <div key={s.k}>
                    <dt className="v2-slatecard__k">{s.k.toUpperCase()}</dt>
                    <dd className="v2-slatecard__v" style={{ margin: 0 }}>
                      {s.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </aside>
          </section>

          <div className="v2-trust">
            <div className="v2-rule" />
            <div className="v2-trust__label">
              TRUSTED BY SCREENWRITERS, INDIE FILMMAKERS, AND STUDIOS
            </div>
          </div>

          {/* ============ 00 / THE INPUT ============ */}
          <section className="v2-sec">
            <div className="v2-row">
              <div className="v2-slate">
                <div className="v2-tag">00 / THE INPUT</div>
                <p style={{ marginTop: 24, fontSize: 14, lineHeight: 1.7, color: "#8C8B86" }}>
                  Plain screenplay. Nothing else. No prompt to engineer.
                </p>
              </div>
              <div className="v2-flex v2-script">
                <span className="v2-bracket v2-bracket--tl-h" aria-hidden="true" />
                <span className="v2-bracket v2-bracket--tl-v" aria-hidden="true" />
                <span className="v2-bracket v2-bracket--br-h" aria-hidden="true" />
                <span className="v2-bracket v2-bracket--br-v" aria-hidden="true" />
                <div className="v2-script__body">
                  <div className="v2-script__slug">SHOT 1. INT. WAREHOUSE - NIGHT</div>
                  <div className="v2-script__gap" />
                  <div className="v2-script__char">KAI</div>
                  <div className="v2-script__line">Two on the catwalk. I see muzzle flash.</div>
                  <div className="v2-script__gap--sm" />
                  <div className="v2-script__char">LEE</div>
                  <div className="v2-script__line">Hold position. Backup is sixty seconds out.</div>
                </div>
              </div>
            </div>
          </section>

          {/* ============ STATS ============ */}
          <section className="v2-sec">
            <div className="v2-rule--bright" />
            <div className="v2-grid3">
              {STATS.map((s) => (
                <div key={s.n}>
                  <div className="v2-stat__n">{s.n}</div>
                  <p className="v2-stat__p">{s.p}</p>
                </div>
              ))}
            </div>
            <div className="v2-rule" />
          </section>

          {/* ============ 01 / METHOD ============ */}
          <section className="v2-sec">
            <div className="v2-row v2-head-row">
              <div className="v2-slate">
                <div className="v2-tag">01 / METHOD</div>
              </div>
              <h2 className="v2-h2">From Script to Finished Film in Three Steps.</h2>
            </div>

            <div className="v2-rule" />
            {STEPS.map((s) => (
              <React.Fragment key={s.n}>
                <div className="v2-step">
                  <div className="v2-step__n">{s.n}</div>
                  <div className="v2-step__t">{s.t}</div>
                  <p className="v2-step__p">{s.p}</p>
                </div>
                <div className="v2-rule" />
              </React.Fragment>
            ))}
          </section>

          {/* ============ 02 / LOOK ============ */}
          <section className="v2-sec">
            <div className="v2-row v2-row--bottom v2-head-row">
              <div className="v2-slate">
                <div className="v2-tag">02 / LOOK</div>
              </div>
              <div className="v2-flex">
                <h2 className="v2-h2" style={{ maxWidth: 700 }}>
                  Pick the Visual Style That Fits Your Story.
                </h2>
                <p className="v2-sub">
                  From photorealistic to anime to 3D animation. Every style, one platform.
                </p>
              </div>
            </div>

            <div className="v2-styles">
              {STYLES.map((s, i) => (
                <figure key={s.slug} style={{ margin: 0 }}>
                  <div className="v2-frame">
                    <Brackets />
                    <img
                      src={`/images/styles/${s.slug}.webp`}
                      alt={`${s.name} — ${s.note}`}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <figcaption className="v2-style__row">
                    <span className="v2-style__name">{s.name}</span>
                    <span className="v2-note">
                      S.{String(i + 1).padStart(2, "0")} · {s.note}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          {/* ============ 03 / CREW ============ */}
          <section className="v2-sec">
            <div className="v2-row">
              <div className="v2-slate">
                <div className="v2-tag">03 / CREW</div>
                <p style={{ marginTop: 24, fontSize: 14, lineHeight: 1.7, color: "#8C8B86" }}>
                  Every department, running off one script.
                </p>
              </div>
              <div className="v2-flex">
                <h2 className="v2-h2" style={{ maxWidth: 700, marginBottom: "clamp(44px, 6vw, 72px)" }}>
                  A Full Production Team, Working for You.
                </h2>

                <div className="v2-rule" />
                {CREW.map((c, i) => (
                  <React.Fragment key={c.role}>
                    <div className="v2-crew__row">
                      <div className="v2-crew__id">A{i + 1}</div>
                      <div className="v2-crew__role">{c.role}</div>
                      <div className="v2-crew__desc">{c.desc}</div>
                    </div>
                    <div className="v2-rule" />
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>

          {/* ============ 04 / POSITION ============ */}
          <section className="v2-sec">
            <div className="v2-row v2-head-row">
              <div className="v2-slate">
                <div className="v2-tag">04 / POSITION</div>
              </div>
              <div className="v2-flex">
                <h2 className="v2-h2" style={{ maxWidth: 700 }}>
                  Built for Film. Built for Quality.
                </h2>
                <p className="v2-sub">Power to build any kind of video.</p>
              </div>
            </div>

            <div className="v2-rule--bright" />
            <div className="v2-grid3">
              {POSITION.map((p) => (
                <div key={p.k}>
                  <div className={`v2-pos__k ${p.us ? "v2-pos__k--us" : "v2-pos__k--them"}`}>
                    {p.k.toUpperCase()}
                  </div>
                  <div className="v2-pos__sub">{p.sub.toUpperCase()}</div>
                  <p className={`v2-pos__p ${p.us ? "v2-pos__p--us" : "v2-pos__p--them"}`}>{p.p}</p>
                </div>
              ))}
            </div>
            <div className="v2-rule" />
          </section>

          {/* ============ 05 / TERMS ============ */}
          <section className="v2-sec">
            <div className="v2-row v2-head-row">
              <div className="v2-slate">
                <div className="v2-tag">05 / TERMS</div>
              </div>
              <h2 className="v2-h2">Pricing Plans.</h2>
            </div>

            <div className="v2-tiers">
              {TIERS.map((t) => (
                <div className="v2-tier" key={t.name}>
                  <div className="v2-tier__name">{t.name.toUpperCase()}</div>
                  <div className="v2-tier__price">{t.price}</div>
                  <div className="v2-tier__per">{t.per}</div>
                  <div className="v2-tier__rule" aria-hidden="true" />
                  <ul className="v2-tier__feats">
                    {t.feats.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <a
                    className={`v2-btn ${t.solid ? "v2-btn--solid" : "v2-btn--ghost"} v2-tier__cta`}
                    href={t.href}
                  >
                    BEGIN
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* ============ CLOSE ============ */}
          <section className="v2-close">
            <div className="v2-rule" style={{ marginBottom: "clamp(56px, 7vw, 96px)" }} />
            <h2 className="v2-close__h">
              Your Story
              <br />
              Deserves to Be Seen.
            </h2>
            <p className="v2-close__p">Start creating your film today. Free to begin.</p>
            <div className="v2-actions">
              <a className="v2-btn v2-btn--solid" href={SIGNUP}>
                START CREATING YOUR FILM
              </a>
              <a className="v2-btn v2-btn--under" href={YOUTUBE} target="_blank" rel="noreferrer">
                WATCH THE DEMO
              </a>
            </div>
          </section>

          {/* ============ FOOTER ============ */}
          <footer className="v2-foot">
            <div className="v2-row">
              <div className="v2-foot__brand">
                <div className="v2-foot__mark">ACT&nbsp;3</div>
                <p className="v2-foot__tag">Create movies at the speed of storytelling.</p>
              </div>
              <div className="v2-foot__cols">
                <div>
                  <div className="v2-foot__k">PRODUCT</div>
                  <div className="v2-foot__list">
                    <a href={PLANS}>Pricing</a>
                  </div>
                </div>
                <div>
                  <div className="v2-foot__k">COMPANY</div>
                  <div className="v2-foot__list">
                    <a href="/about">About</a>
                    <a href="/contact">Contact</a>
                  </div>
                </div>
                <div>
                  <div className="v2-foot__k">RESOURCES</div>
                  <div className="v2-foot__list">
                    <a href="https://documentation.act3ai.com/">Documentation</a>
                    <a href="/mcp">MCP</a>
                    <a href="/cli">CLI</a>
                  </div>
                </div>
                <div>
                  <div className="v2-foot__k">LEGAL</div>
                  <div className="v2-foot__list">
                    <a href="https://legal.act3ai.com/docs/privacy-policy#welcome">Privacy Policy</a>
                    <a href="https://legal.act3ai.com/docs/terms-of-service/">Terms of Service</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="v2-rule" style={{ margin: "64px 0 26px 0" }} />
            <div className="v2-foot__bar">
              <div className="v2-note">
                © {new Date().getFullYear()} ACT 3 AI. ALL RIGHTS RESERVED.
              </div>
              <div className="v2-foot__social">
                <a href="https://x.com/act3ai" target="_blank" rel="noreferrer">
                  X
                </a>
                <a href={YOUTUBE} target="_blank" rel="noreferrer">
                  YOUTUBE
                </a>
                <a href="https://www.linkedin.com/company/act3ai/" target="_blank" rel="noreferrer">
                  LINKEDIN
                </a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
