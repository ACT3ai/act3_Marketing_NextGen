import React from "react";
import Head from "@docusaurus/Head";

/**
 * Route: /v/3
 *
 * A standalone design variation of the ACT 3 homepage — "The Marque".
 * Source design: ~/BGit/all/film/design/brand/jenny/claude_design/v/3/html/index.html
 * Design brief:  ~/BGit/all/film/design/brand/jenny/claude_design/v/3/claude_design.prompt
 * Notes:         ~/BGit/all/film/design/brand/jenny/claude_design/v/3/variation_notes.md
 *
 * Comparable anchor: BUGATTI (bugatti.com) — total black ground, a proprietary
 * monospace display at 12px, an almost-absent interface, photography naked on the
 * black with no card or border, and thousands of pixels of empty black between
 * chapters. Supporting mechanics from Feadship (near-black, not #000) and Rick
 * Owens (11px wide-tracked chrome against enormous imagery).
 *
 * Deliberately NOT the /v/2 "Slate" design: no left metadata gutter, no 00/01/02
 * slate spine, no hairline rules as dividers, no call sheet, no corner brackets.
 * Emptiness is the only divider here.
 *
 * Like /v/2, this page deliberately does NOT use the Docusaurus theme Layout,
 * SiteNavbar or SiteFooter: the design carries its own header and footer, and
 * keeping it self-contained guarantees it cannot affect any other page on the
 * site. Every CSS rule below is either scoped under `.v3` or lives in a <style>
 * tag that is only mounted while this route is rendered.
 */

const PAGE_CSS = `
/* The ground colour has to reach the html element so overscroll and the area
   below a short viewport stay off-black. Route-scoped: this <style> unmounts
   when the SPA navigates away. */
html, body { background: #050505; }

.v3 {
  --ground: #050505;
  --well: #000000;
  --plate: #0C0C0C;
  --ink: #E8E8E4;
  --ink-2: #A8A8A4;
  --ink-3: #8E8E8A;
  --muted: #6B6B67;
  --dim: #3A3A38;
  --edge: #1C1C1C;
  --ghost: #2E2E2C;

  position: relative;
  background: var(--ground);
  color: var(--ink);
  font-family: Archivo, "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 400;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
}

.v3 *, .v3 *::before, .v3 *::after { box-sizing: border-box; }
.v3 p { margin: 0; }
.v3 img, .v3 video { display: block; max-width: 100%; }
.v3 a { color: var(--ink); text-decoration: none; transition: color 140ms linear, border-color 140ms linear; }
.v3 a:hover { color: #FFFFFF; }

/* Metallic / concrete texture. Grain and material — never a gradient, never a glow. */
.v3-grain {
  position: absolute; inset: 0; pointer-events: none; z-index: 3;
  opacity: 0.05; mix-blend-mode: screen;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/></filter><rect width='180' height='180' filter='url(%23n)' opacity='0.55'/></svg>");
}
.v3-inner { position: relative; z-index: 4; }

.v3-mono { font-family: "Roboto Mono", ui-monospace, SFMono-Regular, Menlo, monospace; }

/* The chrome is deliberately tiny and wide-tracked. You only make your own name
   this small when you are certain the reader will find it. */
.v3-chrome {
  font-family: "Roboto Mono", ui-monospace, Menlo, monospace;
  font-size: 11px; font-weight: 400; letter-spacing: 0.20em;
  text-transform: uppercase; color: var(--muted);
}
.v3-tag {
  font-family: "Roboto Mono", ui-monospace, Menlo, monospace;
  font-size: 10px; font-weight: 400; letter-spacing: 0.30em;
  text-transform: uppercase; color: var(--dim);
}
.v3-chapter {
  font-family: "Roboto Mono", ui-monospace, Menlo, monospace;
  font-size: 11px; font-weight: 700; letter-spacing: 0.42em;
  text-transform: uppercase; color: var(--muted);
}

.v3 h1, .v3 h2, .v3 h3 {
  font-family: "Roboto Mono", ui-monospace, Menlo, monospace;
  font-weight: 700; margin: 0; letter-spacing: -0.02em; color: var(--ink);
}
.v3-lede { font-size: 17px; line-height: 1.7; color: var(--ink-3); max-width: 46ch; }

/* Square outline. Bugatti's is a pill; the brand law forbids pills, so the law wins. */
.v3-btn {
  display: inline-block; padding: 15px 30px; border: 1px solid var(--dim);
  font-family: "Roboto Mono", ui-monospace, Menlo, monospace; font-size: 11px;
  font-weight: 500; letter-spacing: 0.24em; text-transform: uppercase;
  color: var(--ink); background: transparent; border-radius: 0; white-space: nowrap;
}
.v3-btn:hover { border-color: var(--ink); color: #FFFFFF; }
.v3-btn--quiet { border-color: #141414; color: var(--muted); }

/* Film sits naked on the black. No card, no border, no radius, no shadow. */
.v3-plate { position: relative; width: 100%; background: var(--plate); overflow: hidden; }
/* The <picture> wrapper around the style stills is a direct child, so the sizing
   rule has to reach through it as well as apply to a bare <img> / <video>. */
.v3-plate > img, .v3-plate > video, .v3-plate > picture { display: block; width: 100%; height: 100%; }
.v3-plate img, .v3-plate video {
  width: 100%; height: 100%; object-fit: cover;
  filter: saturate(0.94) contrast(1.03);
}
.v3-plate--wide { aspect-ratio: 21 / 9; }
.v3-plate--16 { aspect-ratio: 16 / 9; }

.v3-bullets { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
.v3-bullets li { font-size: 14px; line-height: 1.6; color: var(--muted); }

.v3-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 34px 64px;
}
.v3-head__group { display: flex; gap: 32px; align-items: center; }
.v3-wordmark {
  font-family: "Roboto Mono", ui-monospace, Menlo, monospace;
  font-size: 13px; font-weight: 700; letter-spacing: 0.52em;
  color: var(--ink); padding-left: 0.52em; white-space: nowrap;
}
.v3-mobilemenu { display: none; }

.v3-pad { padding-left: 64px; padding-right: 64px; }
.v3-wrap { max-width: 1180px; margin: 0 auto; }
.v3-centre { display: flex; flex-direction: column; align-items: center; text-align: center; }

.v3-hero { padding: 150px 64px 210px; }
.v3-hero h1 { font-size: clamp(34px, 4.6vw, 66px); line-height: 1.06; max-width: 17ch; }
.v3-ctarow { display: flex; gap: 16px; }

.v3-proof {
  display: flex; justify-content: space-between; align-items: baseline;
  padding: 22px 64px 0;
}

.v3-section { padding: 190px 64px; }
.v3-section--well { background: var(--well); }

/* One object per screen: the screenplay, alone, in a field of black. */
.v3-script { font-size: 15px; line-height: 2.1; color: var(--ink-2); }
.v3-script__slug { letter-spacing: 0.06em; }
.v3-script__cue { padding-left: 34%; letter-spacing: 0.14em; }
.v3-script__line { padding-left: 18%; max-width: 42ch; }

.v3-grid2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 80px; }
.v3-grid3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 70px; }
.v3-grid6 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 34px; }
.v3-crew  { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 40px; }
.v3-foot__grid { display: grid; grid-template-columns: minmax(0, 1.8fr) repeat(3, minmax(0, 1fr)); gap: 60px 40px; }

.v3-step__n { font-size: 60px; font-weight: 700; color: #1F1F1D; line-height: 1; }
.v3-stat__n { font-size: 42px; font-weight: 700; letter-spacing: -0.03em; }
.v3-stat__p { font-size: 14px; line-height: 1.7; color: var(--muted); max-width: 26ch; }

/* The eleven that get a line each, instead of a fifteenth identical box. */
.v3-index { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 90px; }
.v3-index__item { display: flex; flex-direction: column; gap: 7px; padding: 22px 0; }
.v3-index__item p { font-size: 14px; line-height: 1.6; color: var(--muted); }

.v3-matrix-scroll { overflow-x: auto; }
.v3-matrix {
  display: grid;
  grid-template-columns: minmax(0, 2.4fr) repeat(3, minmax(0, 1fr));
  gap: 0 30px;
}
.v3-matrix__row { font-size: 14px; color: var(--ink-2); padding: 19px 0; }
.v3-matrix__yes { padding: 19px 0; color: var(--ink); }
.v3-matrix__no  { padding: 19px 0; color: var(--ghost); }

.v3-tier { display: flex; flex-direction: column; gap: 26px; }
.v3-tier__price { font-size: 46px; font-weight: 700; letter-spacing: -0.03em; }
.v3-tier .v3-btn { align-self: flex-start; margin-top: auto; }

.v3-crew__letter { font-size: 76px; font-weight: 700; line-height: 0.9; color: #202020; }
.v3-crew__desc { font-size: 13px; line-height: 1.7; color: var(--muted); }

.v3-close h2 { font-size: clamp(30px, 3.8vw, 54px); line-height: 1.1; max-width: 15ch; }

.v3-foot { padding: 130px 64px 70px; }
.v3-foot__col { display: flex; flex-direction: column; gap: 16px; }
.v3-foot__base {
  display: flex; justify-content: space-between; align-items: baseline; margin-top: 100px;
}

@media (max-width: 900px) {
  .v3-pad, .v3-head, .v3-hero, .v3-section, .v3-foot, .v3-proof {
    padding-left: 24px !important; padding-right: 24px !important;
  }
  .v3-hero { padding-top: 96px !important; padding-bottom: 120px !important; }
  .v3-section { padding-top: 110px !important; padding-bottom: 110px !important; }
  .v3-grid2, .v3-grid3, .v3-index { grid-template-columns: 1fr !important; gap: 48px !important; }
  .v3-index { gap: 0 !important; }
  .v3-grid6, .v3-crew, .v3-foot__grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
  .v3-crew { gap: 54px 30px !important; }
  .v3-head__group--more { display: none !important; }
  .v3-mobilemenu { display: block !important; }
  .v3-ctarow { flex-direction: column !important; width: 100%; gap: 12px !important; }
  .v3-ctarow .v3-btn { display: block; width: 100%; text-align: center; padding: 18px 22px; }
  .v3-proof { flex-direction: column !important; align-items: flex-start !important; gap: 14px; }
  .v3-matrix { min-width: 660px; }
  .v3-foot__base { flex-direction: column; gap: 22px; margin-top: 64px; }
  .v3-tier .v3-btn { margin-top: 8px; width: 100%; text-align: center; }
}

@media (prefers-reduced-motion: reduce) {
  .v3 * { animation: none !important; transition: none !important; }
}
`;

// ── content ───────────────────────────────────────────────────────────────────
// Words come from the live homepage; the packaging comes from the design.

const SIGNUP = "https://app.act3ai.com/signup/";
const SIGNIN = "https://app.act3ai.com/signin/";
const PLANS = "https://app.act3ai.com/settings/plans/";
const YOUTUBE = "https://www.youtube.com/@ACT3AI";

const SCRIPT_LINES = [
  { cue: "KAI", line: "Two on the catwalk. I see muzzle flash." },
  { cue: "LEE", line: "Hold position. Backup is sixty seconds out." },
];

const STEPS = [
  {
    n: "01",
    t: "Write Your Story",
    p: "Type dialogue, scene descriptions, and camera notes in plain language. ACT 3 understands intent, not just prompts.",
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

const STATS = [
  { n: "80–200 hrs", p: "of pre-production collapsed to roughly two hours." },
  { n: "1 Platform", p: "replaces ten or more traditional production tools." },
  { n: "Full Films", p: "not eight to forty second clips." },
];

// Four capabilities are promoted to full cinematic chapters. The other eleven
// collapse into one scannable index below — nobody scrolls past a fifteenth
// identical box.
const CHAPTERS = [
  {
    slug: "script-speed",
    tag: "Script-speed creation",
    title: "Type Your Story. Watch It Come to Life.",
    body: "Write dialogue the way you think it. ACT 3 reads your script and automates every production decision: casting, camera angles, lighting, sets. No prompt engineering. No shot-by-shot setup.",
    bullets: [
      "Natural-language dialogue and scene descriptions",
      "Cinematography, staging and set needs inferred from the page",
      "A 650-shot film set up in about two hours, against 5,200 hours by hand",
    ],
  },
  {
    slug: "movies",
    tag: "Movies & series",
    title: "Full-Length Films. Not 8-Second Clips.",
    body: "Purpose-built for long-form. Script a feature, a short, a television episode or a web series. The Story Arc engine plans across episodes and consistency holds across hundreds of shots.",
    bullets: [
      "Story Arc engine for multi-episode planning",
      "Visual and character consistency across 600+ shots",
      "AI Showrunner orchestrates the full production",
    ],
  },
  {
    slug: "actors",
    tag: "Actor & costume consistency",
    title: "Cast Your Characters. Keep Them Consistent.",
    body: "Define your cast from a central character directory. ACT 3 holds physical consistency, wardrobe and performance style across every scene. LoRA-based, so nothing is recreated per shot.",
    bullets: [
      "Character library with age, appearance and wardrobe management",
      "Marker-less motion capture from an iPhone or a webcam",
      "Casting agent proposes characters from a brief description",
    ],
  },
  {
    slug: "editor",
    tag: "Unified editor",
    title: "One Editor. Full Control. Move Fast.",
    body: "Shot-level adjustment through full-scene assembly in one place. Timeline, keyframes, transitions and render controls, without opening another application.",
    bullets: [
      "Script, visual and timeline panels in one three-column view",
      "Persona-aware views for writers, directors and actors",
      "One-click regeneration per shot",
    ],
  },
];

const INDEX = [
  { t: "Sets & Backgrounds", p: "Build the world once. 2D and 3D environments, procedural cities, persistent across every shot." },
  { t: "For Screenwriters", p: "Import PDF, TXT or Final Draft. Watch it visualised shot by shot. Human and AI drafts side by side." },
  { t: "Voice & Dialogue", p: "Every character has a voice from the first draft. Multilingual TTS, lipsync, human actors in the same pipeline." },
  { t: "Model Router", p: "Veo 3, Runway, FLUX, Hunyuan, Wan 2.1. Each shot routed to the right model without you managing any of them." },
  { t: "Screens Within Scenes", p: "Control exactly what appears on any in-scene display: a laptop, a billboard, a phone." },
  { t: "Teams & Collaboration", p: "Role-based permissions, scene locking, version history and visual diffing. Multi-org for agencies." },
  { t: "Social Media Video", p: "Vertical, horizontal and square from one workflow. A week of content in hours." },
  { t: "Marketing Video", p: "Define the brand style once; every output holds it. Product demos, testimonials, brand films." },
  { t: "Explainer Video", p: "A paragraph in, a finished explainer out. Voiceover, visuals, transitions and pacing handled." },
  { t: "Corporate Video", p: "Town halls, training, executive announcements. Multilingual dubbing and approval workflows." },
  { t: "Advertising Video", p: "TV, digital and social formats from one workflow. Brief to finished ad in hours." },
];

const STYLES = [
  { name: "Realistic", note: "photoreal · 35mm", slug: "realistic" },
  { name: "Cinematic", note: "anamorphic · colour grade", slug: "cinematic" },
  { name: "Anime", note: "2D · cel-shaded", slug: "anime" },
  { name: "3D Animation", note: "stylized · cartoon", slug: "3d" },
  { name: "Cartoon", note: "flat · bold linework", slug: "cartoon" },
  { name: "Stylized / Illustrated", note: "painterly · editorial", slug: "illustrated" },
];

const CREW = [
  { letter: "W", role: "Writer", desc: "Develops scripts, dialogue and narrative structure from your inputs." },
  { letter: "D", role: "Director", desc: "Orchestrates overall vision, scene pacing and story flow." },
  { letter: "C", role: "Cinematographer", desc: "Camera placement, movement, shot composition and visual storytelling." },
  { letter: "S", role: "Set Designer", desc: "Creates virtual environments, location designs and spatial planning." },
  { letter: "K", role: "Casting & Wardrobe", desc: "Selects characters, designs costumes, maintains visual consistency." },
];

const MATRIX = [
  "Full-length films and series, not just clips",
  "Script-to-film pipeline: write once, produce everything",
  "Define-once character and set consistency",
  "3D pipeline and Blender integration",
  "Motion capture from an iPhone or a webcam",
  "Virtual camera system with full cinematography controls",
  "AI Showrunner for long-form story arcs",
  "Multi-format export: YouTube, TikTok, ProRes, 4K",
  "Multi-user collaboration with role permissions",
];

const TIERS = [
  {
    flag: "Most popular",
    name: "Creator",
    price: "$49",
    per: "per month",
    blurb: "For creators producing content regularly.",
    feats: ["24,500 credits per month", "61,250 credit rollover bank", "50 GB cloud storage"],
    cta: "Choose Creator",
    href: PLANS + "?plan=Creator",
  },
  {
    flag: "",
    name: "Pro",
    price: "$175",
    per: "per month",
    blurb: "For serious filmmakers producing at scale.",
    feats: [
      "87,500 credits per month",
      "218,750 credit rollover bank",
      "740 GB cloud storage",
      "All AI video models",
      "Priority rendering",
    ],
    cta: "Choose Pro",
    href: PLANS + "?plan=Pro",
  },
  {
    flag: "",
    name: "Enterprise",
    price: "Custom",
    per: "on application",
    blurb: "For agencies, studios and teams producing professional content.",
    feats: ["High credits per month", "High rollover bank", "High cloud storage"],
    cta: "Contact Us",
    href: "mailto:ContactUs@ACT3ai.com",
  },
];

export default function MarqueVariation(): React.JSX.Element {
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
        <meta name="theme-color" content="#050505" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&family=Archivo:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Rendered in the component tree, not <Head>, so the styles are in the
          server-rendered HTML at first paint and there is no FOUC. */}
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />

      <div className="v3">
        <div className="v3-grain" aria-hidden="true" />

        <div className="v3-inner">
          {/* ============ CHROME. deliberately tiny and wide-tracked. ============ */}
          <header className="v3-head">
            <div className="v3-head__group v3-head__group--more">
              <a className="v3-chrome" href="/">Main</a>
              <a className="v3-chrome" href={YOUTUBE} target="_blank" rel="noreferrer">Videos</a>
              <a className="v3-chrome" href={PLANS}>Plans</a>
            </div>
            <a className="v3-chrome v3-mobilemenu" href="#work">Work</a>
            <a className="v3-wordmark v3-mono" href="/v/3" aria-label="ACT 3 home">ACT&nbsp;3</a>
            <div className="v3-head__group">
              <a className="v3-chrome v3-head__group--more" href={SIGNIN}>Log In</a>
              <a className="v3-chrome" style={{ color: "#E8E8E4" }} href={SIGNUP}>Get Started</a>
            </div>
          </header>

          {/* ============ THE OPENING ============ */}
          <section className="v3-hero">
            <div className="v3-wrap v3-centre" style={{ gap: 40 }}>
              <div className="v3-tag">AI Filmmaking Platform</div>
              <h1>Create Movies at the Speed of Storytelling.</h1>
              <p className="v3-lede" style={{ maxWidth: "54ch", textAlign: "center" }}>
                Five minutes to three hours, in one platform. No prompt engineering. No tool
                switching. You write the picture. ACT 3 builds it, shot by shot, to your direction.
              </p>
              <div className="v3-ctarow" style={{ marginTop: 14 }}>
                <a className="v3-btn" href={SIGNUP}>Get Started</a>
                <a className="v3-btn v3-btn--quiet" href={YOUTUBE} target="_blank" rel="noreferrer">
                  See ACT 3 in Action
                </a>
              </div>
            </div>
          </section>

          {/* Colour arrives only through the work. */}
          <section style={{ paddingBottom: 200 }}>
            <div className="v3-plate v3-plate--wide">
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/images/hero-reel-poster.jpg"
                aria-label="ACT 3 reel"
              >
                <source src="/images/hero-reel.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="v3-proof">
              <div className="v3-tag">Trusted by screenwriters, indie filmmakers, and studios</div>
              {/* The Microdrama King's quiet path — findable without shouting at the God of Film. */}
              <a className="v3-tag" style={{ color: "#6B6B67" }} href="#terms">
                Producing at volume? Cost, timeline and scale →
              </a>
            </div>
          </section>

          {/* ============ ONE OBJECT PER SCREEN: THE PAGE ============ */}
          <section className="v3-section v3-section--well">
            <div style={{ maxWidth: 820, margin: "0 auto" }}>
              <div className="v3-chapter" style={{ textAlign: "center", marginBottom: 96 }}>
                This is the input
              </div>
              <div className="v3-script v3-mono">
                <div className="v3-script__slug">SHOT 1. INT. WAREHOUSE - NIGHT</div>
                {SCRIPT_LINES.map((l) => (
                  <React.Fragment key={l.cue}>
                    <div style={{ height: 30 }} />
                    <div className="v3-script__cue">{l.cue}</div>
                    <div className="v3-script__line">{l.line}</div>
                  </React.Fragment>
                ))}
              </div>
              <div style={{ height: 96 }} />
              <p
                className="v3-lede"
                style={{ margin: "0 auto", textAlign: "center", maxWidth: "40ch", color: "#6B6B67" }}
              >
                Everything below is produced from four lines like these.
              </p>
            </div>
          </section>

          {/* ============ THREE STEPS ============ */}
          <section className="v3-section" style={{ paddingBottom: 90 }}>
            <div className="v3-chapter" style={{ textAlign: "center" }}>
              From script to finished film
            </div>
          </section>
          <section className="v3-pad" style={{ paddingBottom: 200 }}>
            <div className="v3-wrap v3-grid3">
              {STEPS.map((s) => (
                <div key={s.n} style={{ display: "flex", flexDirection: "column", gap: 26 }}>
                  <div className="v3-step__n v3-mono">{s.n}</div>
                  <h2 style={{ fontSize: 26, lineHeight: 1.2 }}>{s.t}</h2>
                  <p className="v3-lede" style={{ fontSize: 15 }}>{s.p}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ============ THE NUMBERS ============ */}
          <section className="v3-section v3-section--well">
            <div className="v3-wrap v3-grid3">
              {STATS.map((s) => (
                <div key={s.n} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div className="v3-stat__n v3-mono">{s.n}</div>
                  <p className="v3-stat__p">{s.p}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ============ FOUR CHAPTERS GET EVERYTHING ============ */}
          <section id="work" className="v3-section" style={{ paddingBottom: 110 }}>
            <div className="v3-chapter" style={{ textAlign: "center" }}>
              What the platform actually does
            </div>
          </section>

          <div style={{ paddingBottom: 190, display: "flex", flexDirection: "column", gap: 170 }}>
            {CHAPTERS.map((c) => (
              <section key={c.slug}>
                <div className="v3-plate v3-plate--wide">
                  <img
                    src={`/images/screenshots/${c.slug}/poster.jpg`}
                    alt={`${c.tag} — ACT 3`}
                    loading="lazy"
                  />
                </div>
                <div className="v3-pad" style={{ paddingTop: 54 }}>
                  <div className="v3-wrap v3-grid2">
                    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                      <div className="v3-tag">{c.tag}</div>
                      <h2 style={{ fontSize: 30, lineHeight: 1.2 }}>{c.title}</h2>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
                      <p className="v3-lede">{c.body}</p>
                      <ul className="v3-bullets">
                        {c.bullets.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>

          {/* ============ THE ELEVEN GET A LINE EACH ============ */}
          <section className="v3-section" style={{ paddingTop: 40 }}>
            <div className="v3-wrap">
              <div className="v3-chapter" style={{ marginBottom: 70 }}>
                Also in the platform
              </div>
              <div className="v3-index">
                {INDEX.map((i) => (
                  <div className="v3-index__item" key={i.t}>
                    <div className="v3-chrome" style={{ color: "#E8E8E4" }}>{i.t}</div>
                    <p>{i.p}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ============ COLOUR ARRIVES. this is the event. ============ */}
          <section className="v3-section v3-section--well">
            <div className="v3-wrap">
              <div className="v3-chapter" style={{ textAlign: "center", marginBottom: 26 }}>
                The look
              </div>
              <h2 style={{ fontSize: 30, lineHeight: 1.25, textAlign: "center", marginBottom: 90 }}>
                Pick the visual style that fits your story.
              </h2>
              <div className="v3-grid6">
                {STYLES.map((s) => (
                  <div key={s.slug} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div className="v3-plate v3-plate--16">
                      <picture>
                        <source srcSet={`/images/styles/${s.slug}.webp`} type="image/webp" />
                        <img src={`/images/styles/${s.slug}.jpg`} alt={s.name} loading="lazy" />
                      </picture>
                    </div>
                    <div className="v3-chrome" style={{ color: "#E8E8E4" }}>{s.name}</div>
                    <div className="v3-tag">{s.note}</div>
                  </div>
                ))}
              </div>
              <p
                className="v3-lede"
                style={{ margin: "70px auto 0", textAlign: "center", maxWidth: "44ch", color: "#6B6B67" }}
              >
                Every style, one platform.
              </p>
            </div>
          </section>

          {/* ============ THE CREW ============ */}
          <section className="v3-section">
            <div className="v3-wrap">
              <div className="v3-chapter" style={{ textAlign: "center", marginBottom: 26 }}>
                The crew
              </div>
              <h2 style={{ fontSize: 30, lineHeight: 1.25, textAlign: "center", marginBottom: 110 }}>
                A full production team, working for you.
              </h2>
              <div className="v3-crew">
                {CREW.map((c) => (
                  <div key={c.letter} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                    <div className="v3-crew__letter v3-mono" aria-hidden="true">{c.letter}</div>
                    <div className="v3-chrome" style={{ color: "#E8E8E4" }}>{c.role}</div>
                    <p className="v3-crew__desc">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ============ POSITION ============ */}
          <section className="v3-section v3-section--well">
            <div className="v3-wrap">
              <div className="v3-chapter" style={{ textAlign: "center", marginBottom: 26 }}>
                Position
              </div>
              <h2 style={{ fontSize: 30, lineHeight: 1.25, textAlign: "center", marginBottom: 100 }}>
                Built for film. Built for quality.
              </h2>

              <div className="v3-matrix-scroll">
                <div className="v3-matrix">
                  <div />
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingBottom: 34 }}>
                    <div className="v3-chrome" style={{ color: "#E8E8E4" }}>ACT 3</div>
                    <div className="v3-tag">Filmmaking platform</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingBottom: 34 }}>
                    <div className="v3-chrome">Clip Generators</div>
                    <div className="v3-tag">Runway · Pika · Sora</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingBottom: 34 }}>
                    <div className="v3-chrome">Business Video</div>
                    <div className="v3-tag">HeyGen · Synthesia</div>
                  </div>

                  {MATRIX.map((row) => (
                    <React.Fragment key={row}>
                      <div className="v3-matrix__row">{row}</div>
                      <div className="v3-matrix__yes v3-mono" aria-label="yes">■</div>
                      <div className="v3-matrix__no v3-mono" aria-label="no">—</div>
                      <div className="v3-matrix__no v3-mono" aria-label="no">—</div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ============ TERMS ============ */}
          <section id="terms" className="v3-section">
            <div className="v3-wrap">
              <div className="v3-chapter" style={{ textAlign: "center", marginBottom: 26 }}>
                Terms
              </div>
              <h2 style={{ fontSize: 30, lineHeight: 1.25, textAlign: "center", marginBottom: 110 }}>
                Free to begin.
              </h2>
              <div className="v3-grid3" style={{ gap: 80 }}>
                {TIERS.map((t) => (
                  <div className="v3-tier" key={t.name}>
                    <div className="v3-tag" style={{ color: t.flag ? "#6B6B67" : "#141414" }}>
                      {t.flag || "·"}
                    </div>
                    <div className="v3-chrome" style={{ color: "#E8E8E4" }}>{t.name}</div>
                    <div className="v3-tier__price v3-mono">{t.price}</div>
                    <div className="v3-tag">{t.per}</div>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: "#6B6B67" }}>{t.blurb}</p>
                    <ul className="v3-bullets" style={{ gap: 10 }}>
                      {t.feats.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                    <a className="v3-btn" href={t.href}>{t.cta}</a>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ============ THE CLOSE ============ */}
          <section className="v3-section v3-section--well v3-close" style={{ paddingTop: 240, paddingBottom: 240 }}>
            <div className="v3-wrap v3-centre" style={{ gap: 44 }}>
              <div className="v3-chapter">Begin</div>
              <h2>Your Story Deserves to Be Seen.</h2>
              <p className="v3-lede" style={{ textAlign: "center", maxWidth: "34ch", color: "#6B6B67" }}>
                Start creating your film today. Free to begin.
              </p>
              <div className="v3-ctarow" style={{ marginTop: 10 }}>
                <a className="v3-btn" href={SIGNUP}>Start Creating Your Film</a>
                <a className="v3-btn v3-btn--quiet" href={YOUTUBE} target="_blank" rel="noreferrer">
                  Watch the Demo
                </a>
              </div>
            </div>
          </section>

          {/* ============ FOOTER ============ */}
          <footer className="v3-foot">
            <div className="v3-wrap">
              <div className="v3-foot__grid">
                <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                  <div className="v3-wordmark v3-mono">ACT&nbsp;3</div>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: "#6B6B67", maxWidth: "30ch" }}>
                    Create movies at the speed of storytelling.
                  </p>
                  <a className="v3-chrome" style={{ color: "#E8E8E4" }} href={SIGNUP}>
                    Get Started →
                  </a>
                </div>
                <div className="v3-foot__col">
                  <div className="v3-tag">Product</div>
                  <a className="v3-chrome" href={PLANS}>Pricing</a>
                </div>
                <div className="v3-foot__col">
                  <div className="v3-tag">Company</div>
                  <a className="v3-chrome" href="/about">About</a>
                  <a className="v3-chrome" href="/contact">Contact</a>
                </div>
                <div className="v3-foot__col">
                  <div className="v3-tag">Resources</div>
                  <a className="v3-chrome" href="/cli">CLI</a>
                  <a className="v3-chrome" href="/mcp">MCP</a>
                </div>
              </div>
              <div className="v3-foot__base">
                <div className="v3-tag">© 2026 ACT 3 AI. All rights reserved.</div>
                <div style={{ display: "flex", gap: 30 }}>
                  <a className="v3-chrome" href="https://x.com/act3ai" target="_blank" rel="noreferrer">X</a>
                  <a className="v3-chrome" href={YOUTUBE} target="_blank" rel="noreferrer">YouTube</a>
                  <a className="v3-chrome" href="https://www.linkedin.com/company/act3ai/" target="_blank" rel="noreferrer">LinkedIn</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
