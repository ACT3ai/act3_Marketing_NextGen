import React, { useEffect } from "react";
import Head from "@docusaurus/Head";
import SiteNavbar from "../components/SiteNavbar";
import SiteFooter from "../components/SiteFooter";

// ── Extracted CSS from the standalone marketing page ──────────────────────────
const PAGE_CSS = `
/* ===== Design Tokens ===== */
:root {
  --bg: #faf8f3;
  --bg-2: #f3efe5;
  --bg-3: #ebe5d6;
  --ink: #1a1714;
  --ink-2: #4a4540;
  --ink-3: #837c72;
  --line: #e2dccb;
  --line-2: #d4ccb6;
  --accent: #c4612b;
  --accent-ink: #ffffff;
  --accent-soft: #f3e2d2;
  --paper: #ffffff;
  --maxw: 1200px;
  --pad-x: clamp(20px, 4vw, 56px);
  --section-y: clamp(80px, 9vw, 140px);
  --radius: 8px;
  --radius-lg: 14px;
  --font-display: "Fraunces", "Times New Roman", serif;
  --font-body: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;
}

/* ===== Reset ===== */
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
h1, h2, h3, h4 { margin: 0; }
p { margin: 0; }
ul { margin: 0; padding: 0; }
figure { margin: 0; }

body {
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

::selection { background: var(--accent); color: var(--accent-ink); }

/* ===== Typography helpers ===== */
.serif { font-family: var(--font-display); font-feature-settings: "ss01","ss02"; letter-spacing: -0.015em; }
.mono  { font-family: var(--font-mono); }
.label {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-3);
  white-space: nowrap;
}
.label--accent { color: var(--accent); }

/* ===== Layout ===== */
.wrap { max-width: var(--maxw); margin: 0 auto; padding-left: var(--pad-x); padding-right: var(--pad-x); }
.section { padding-top: var(--section-y); padding-bottom: var(--section-y); position: relative; }
.section--alt { background: var(--bg-2); }
.section--paper { background: var(--paper); }

/* ===== Buttons ===== */
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 22px;
  border-radius: 999px;
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 14.5px;
  letter-spacing: -0.005em;
  cursor: pointer;
  border: 1px solid transparent;
  text-decoration: none;
  transition: transform .15s ease, background .15s ease, border-color .15s ease, color .15s ease, box-shadow .2s ease;
  white-space: nowrap;
}
.btn--primary { background: var(--ink); color: var(--bg); box-shadow: 0 1px 0 rgba(0,0,0,.04), 0 8px 24px -12px rgba(0,0,0,.4); }
.btn--primary:hover { background: var(--accent); color: var(--accent-ink); transform: translateY(-1px); }
.btn--accent { background: var(--accent); color: var(--accent-ink); box-shadow: 0 8px 24px -12px var(--accent); }
.btn--accent:hover { transform: translateY(-1px); filter: brightness(1.05); }
.btn--ghost { background: transparent; color: var(--ink); border-color: var(--line-2); }
.btn--ghost:hover { border-color: var(--ink); background: var(--bg-2); }
.btn--sm { padding: 9px 16px; font-size: 13.5px; }
.btn--lg { padding: 16px 28px; font-size: 15.5px; }
.btn .arrow { display: inline-block; transition: transform .2s ease; }
.btn:hover .arrow { transform: translateX(3px); }

/* ===== Section headers ===== */
.sec-head { display: flex; flex-direction: column; align-items: flex-start; gap: 16px; max-width: 720px; margin-bottom: 56px; }
.sec-head--center { align-items: center; text-align: center; margin-left: auto; margin-right: auto; }
.sec-head h2 { font-size: clamp(36px, 4.6vw, 60px); font-weight: 400; letter-spacing: -0.02em; line-height: 1.05; }
.sec-head p { color: var(--ink-2); font-size: 18px; max-width: 56ch; }

/* ===== Stripe placeholder ===== */
.stripes {
  position: relative; width: 100%; border-radius: var(--radius-lg);
  background: var(--bg-3); color: var(--ink-3); overflow: hidden;
  border: 1px solid var(--line-2);
}
.stripes__bg { position: absolute; inset: 0; width: 100%; height: 100%; opacity: .8; }
.stripes__img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
.stripes__frame { position: absolute; inset: 16px; border: 1px dashed var(--line-2); border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.stripes__corners { position: absolute; inset: -1px; pointer-events: none; }
.stripes__corners span { position: absolute; width: 14px; height: 14px; border: 1.5px solid var(--ink); }
.stripes__corners span:nth-child(1) { top: -1px; left: -1px; border-right: none; border-bottom: none; }
.stripes__corners span:nth-child(2) { top: -1px; right: -1px; border-left: none; border-bottom: none; }
.stripes__corners span:nth-child(3) { bottom: -1px; left: -1px; border-right: none; border-top: none; }
.stripes__corners span:nth-child(4) { bottom: -1px; right: -1px; border-left: none; border-top: none; }
.stripes__play {
  width: 64px; height: 64px; border-radius: 999px; background: var(--paper);
  border: 1px solid var(--line-2); color: var(--accent); display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer; box-shadow: 0 12px 30px -14px rgba(0,0,0,.25);
  transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
}
.stripes__play svg { transform: translateX(2px); }
.stripes:hover .stripes__play { transform: scale(1.06); background: var(--accent); color: var(--paper); }
.stripes__meta { position: absolute; left: 14px; bottom: 12px; right: 14px; display: flex; gap: 10px; align-items: center; justify-content: space-between; font-size: 11px; color: var(--ink-2); }
.stripes__tag { font-family: var(--font-mono); background: var(--paper); border: 1px solid var(--line); padding: 3px 7px; border-radius: 4px; }
.stripes__caption { font-family: var(--font-mono); letter-spacing: .04em; }

/* ===== Auto-playing muted loop ===== */
.shot-video {
  position: relative; width: 100%; aspect-ratio: 16 / 9;
  border-radius: var(--radius-lg); overflow: hidden;
  border: 1px solid var(--line); background: #000;
  box-shadow: 0 24px 60px -30px rgba(0,0,0,.25);
}
.shot-video video {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; display: block;
}
.shot-video__meta {
  position: absolute; left: 14px; bottom: 12px; right: 14px;
  display: flex; gap: 10px; align-items: center; justify-content: space-between;
  font-size: 11px; color: var(--ink-2); pointer-events: none; z-index: 2;
}
.shot-video__tag {
  font-family: var(--font-mono); background: var(--paper);
  border: 1px solid var(--line); padding: 3px 7px; border-radius: 4px;
}
.shot-video__caption {
  font-family: var(--font-mono); letter-spacing: .04em;
  background: var(--paper); border: 1px solid var(--line);
  padding: 3px 7px; border-radius: 4px;
}

/* ===== Proof bullets ===== */
.proof-list { list-style: none; padding: 0; margin: 28px 0 0; }
.proof { display: flex; gap: 12px; align-items: flex-start; padding: 10px 0; border-top: 1px solid var(--line); color: var(--ink-2); font-size: 15.5px; line-height: 1.5; }
.proof:last-child { border-bottom: 1px solid var(--line); }
.proof__dot { color: var(--accent); margin-top: 7px; flex-shrink: 0; }

/* ===== HERO ===== */
.hero {
  position: relative; min-height: 100vh; max-height: 1600px; display: flex; align-items: center;
  overflow: hidden;
}
.hero__bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
.hero__grain {
  position: absolute; inset: 0;
  background-image:
    radial-gradient(1200px 600px at 80% -10%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 60%),
    radial-gradient(900px 500px at 0% 100%, color-mix(in oklab, var(--accent) 9%, transparent), transparent 60%);
}
.hero__glow { position: absolute; border-radius: 999px; filter: blur(80px); }
.hero__glow--a { width: 380px; height: 380px; background: var(--accent); top: -120px; right: -100px; opacity: .12; }
.hero__glow--b { width: 500px; height: 500px; background: var(--accent); bottom: -200px; left: -180px; opacity: .08; }
.hero__inner {
  position: relative; z-index: 1;
  display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1.1fr);
  align-items: center; width: 100%;
}
.hero__copy-area {
  display: flex; align-items: center;
  padding-top: clamp(72px, 8vh, 96px);
  padding-bottom: clamp(40px, 4vh, 56px);
  /* Nudge text a touch further left than centered-in-maxw: 60% of the gutter + base pad */
  padding-left: calc(max(0px, (100vw - var(--maxw)) / 2) * 0.6 + var(--pad-x));
  padding-right: clamp(20px, 3vw, 48px);
}
.hero__copy { max-width: 620px; }
.hero__h { font-family: var(--font-display); font-size: clamp(48px, 6.4vw, 92px); font-weight: 400; letter-spacing: -0.02em; line-height: 1.05; margin-top: 18px; }
.hero__em { font-style: italic; color: var(--accent); }
.hero__sub { margin-top: 22px; font-size: 18.5px; line-height: 1.55; color: var(--ink-2); max-width: 56ch; }
.hero__ctas { margin-top: 32px; display: flex; gap: 12px; flex-wrap: wrap; }
.hero__playdot {
  width: 22px; height: 22px; border-radius: 999px; background: var(--accent);
  color: white; display: inline-flex; align-items: center; justify-content: center;
}
.hero__playdot svg { transform: translateX(1px); }
.hero__proof { margin-top: 28px; font-size: 13.5px; color: var(--ink-3); letter-spacing: .01em; }

.flipcube { position: relative; display: inline-block; vertical-align: baseline; font-style: italic; line-height: 1; }
.flipcube__sizer { display: inline-grid; visibility: hidden; }
.flipcube__sizer-w { grid-area: 1 / 1; padding: 0.06em 0.18em; }
.flipcube__stage { position: absolute; inset: 0; perspective: 1400px; }
.flipcube__cube { position: absolute; inset: 0; transform-style: preserve-3d; transform-origin: 50% 100% 0; animation: flipcube-roll 6s cubic-bezier(.7,.04,.22,1) infinite; will-change: transform; }
.flipcube__face { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; padding: 0.06em 0.18em; color: var(--ink); background: linear-gradient(165deg, #ffffff 0%, #f4f2ed 55%, #d9d6cd 100%); border-radius: 0.05em; box-shadow: inset 0 1px 0 rgba(255,255,255,.95), inset 0 -2px 0 rgba(0,0,0,.07), 0 18px 36px -22px rgba(0,0,0,.45), 0 4px 10px -6px rgba(0,0,0,.25); backface-visibility: hidden; -webkit-backface-visibility: hidden; font-style: italic; }
.flipcube__face--top { transform: translateY(-50%) rotateX(90deg); transform-origin: 50% 100%; }
.flipcube__face--front { transform: rotateY(0deg); }
@keyframes flipcube-roll { 0%, 83% { transform: rotateX(0deg); } 100% { transform: rotateX(-90deg); } }

.hero__strip { position: relative; overflow: visible; }
.hero__reel {
  width: 100%; height: auto; display: block;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line);
  box-shadow: 0 40px 80px -32px rgba(0,0,0,.45), 0 12px 28px -20px rgba(0,0,0,.2);
  transform: rotate(-1.5deg);
  background: #000;
}

/* ===== Hero overlays - production-note style ===== */
.hero__overlays {
  position: absolute; inset: 0;
  pointer-events: none;
  transform: rotate(-1.5deg);
}
.hero__shot-marker {
  position: absolute; top: 18px; left: 22px;
  font-family: var(--font-mono);
  font-size: 11px; letter-spacing: .12em;
  color: rgba(245, 240, 232, .95);
  background: rgba(0, 0, 0, .55);
  padding: 6px 10px; border-radius: 3px;
  text-transform: uppercase;
}
.hero__card {
  position: absolute;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 10px 12px 12px;
  max-width: 220px;
  box-shadow: 0 18px 30px -16px rgba(0,0,0,.55), 0 6px 12px -6px rgba(0,0,0,.25);
}
.hero__card--alex {
  top: 22%; right: -4%;
  transform: rotate(2deg);
}
.hero__card--sally {
  bottom: 18%; right: 8%;
  transform: rotate(-1.5deg);
}
.hero__char {
  display: inline-block;
  background: var(--accent);
  color: var(--paper);
  font-family: var(--font-mono);
  font-weight: 600;
  font-size: 11px; letter-spacing: .1em;
  padding: 4px 9px; border-radius: 3px;
  margin-bottom: 6px;
}
.hero__line {
  margin: 0;
  font-family: var(--font-display);
  font-style: italic;
  font-size: 14px; line-height: 1.35;
  color: var(--ink);
}
.hero__type-tag {
  position: absolute; bottom: 14px; right: 14px;
  background: var(--accent);
  color: var(--paper);
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 12px; letter-spacing: .08em;
  padding: 5px 12px; border-radius: 3px;
  text-transform: uppercase;
  box-shadow: 0 6px 16px -8px rgba(0,0,0,.4);
}

@media (max-width: 920px) {
  .hero__overlays { display: none; }
}
.strip__row { display: grid; grid-template-columns: 1.1fr 1fr; grid-template-rows: 1fr 1fr; gap: 12px; transform: rotate(-2deg); }
.strip__cell:nth-child(1) { transform: translateY(-14px); }
.strip__cell:nth-child(4) { transform: translateY(14px); }
.strip__caption {
  margin-top: 28px; display: flex; gap: 10px; align-items: center; justify-content: center;
  flex-wrap: wrap; font-size: 11.5px; color: var(--ink-3); font-family: var(--font-mono);
  padding: 10px 14px; background: var(--paper); border: 1px solid var(--line);
  border-radius: 999px; width: fit-content; margin-left: auto; margin-right: auto;
}
.strip__sep { color: var(--accent); }

.hero__scroll {
  position: absolute; left: 50%; transform: translateX(-50%); bottom: 28px;
  display: inline-flex; align-items: center; gap: 8px; color: var(--ink-3);
  font-size: 11px; letter-spacing: .14em; text-transform: uppercase;
  text-decoration: none; font-family: var(--font-mono);
}
.hero__chev { display: inline-flex; animation: bounce 2.2s ease-in-out infinite; }
@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(5px); } }

@media (max-width: 920px) {
  .hero__inner { grid-template-columns: 1fr; }
  .hero__strip { display: none; }
  .hero__copy-area { padding-left: var(--pad-x); padding-right: var(--pad-x); }
}

/* ===== STATS ===== */
.stats { padding: clamp(60px,7vw,110px) 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.stats__grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0; }
.stat { padding: 12px 36px; border-left: 1px solid var(--line-2); }
.stat:first-child { border-left: 0; padding-left: 0; }
.stat__num {
  font-family: var(--font-display); font-size: clamp(46px,5.4vw,76px); font-weight: 400;
  letter-spacing: -0.03em; opacity: 0; transform: translateY(8px);
  transition: opacity .9s ease, transform .9s ease; line-height: 1;
}
.stat__num.is-in { opacity: 1; transform: none; }
.stat__dim { color: var(--ink-3); font-style: italic; padding: 0 4px; }
.stat__unit { font-size: 0.4em; font-style: italic; color: var(--ink-2); margin-left: 6px; letter-spacing: -0.01em; }
.stat__label { margin-top: 14px; color: var(--ink-2); font-size: 15px; max-width: 28ch; }

@media (max-width: 820px) {
  .stats__grid { grid-template-columns: 1fr; gap: 32px; }
  .stat { border-left: 0; padding-left: 0; border-top: 1px solid var(--line-2); padding-top: 24px; }
  .stat:first-child { border-top: 0; padding-top: 0; }
}

/* ===== HOW IT WORKS ===== */
.how__grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0; }
.how__step { padding: 36px 32px 36px 0; position: relative; }
.how__step + .how__step { padding-left: 40px; border-left: 1px solid var(--line); }
.how__num { font-family: var(--font-display); font-size: 90px; color: var(--accent); opacity: .25; line-height: 1; font-style: italic; font-weight: 300; }
.how__t { font-family: var(--font-display); font-size: 28px; font-weight: 400; margin-top: 18px; letter-spacing: -0.02em; }
.how__d { margin-top: 14px; color: var(--ink-2); font-size: 16px; max-width: 38ch; }

@media (max-width: 820px) {
  .how__grid { grid-template-columns: 1fr; }
  .how__step + .how__step { padding-left: 0; border-left: 0; border-top: 1px solid var(--line); padding-top: 28px; }
}

/* ===== VALUE ROWS ===== */
.vrow { padding: clamp(60px,7vw,100px) 0; overflow-x: clip; }
.vrow__grid { display: grid; grid-template-columns: 1.8fr 1fr; gap: clamp(20px,3vw,52px); align-items: center; }
.vrow--flip .vrow__grid { grid-template-columns: 1fr 1.8fr; }
.vrow--flip .vrow__media { order: 2; }
.vrow--flip .vrow__copy { order: 1; }
.vrow__media-wrap { position: relative; }
.vrow__media-tag {
  position: absolute; top: -14px; left: 14px; background: var(--paper);
  border: 1px solid var(--line); padding: 4px 10px; border-radius: 999px;
  font-size: 11px; color: var(--ink-3); font-family: var(--font-mono); white-space: nowrap;
}
.vrow__h { font-family: var(--font-display); font-size: clamp(28px,3.6vw,46px); font-weight: 400; letter-spacing: -0.02em; margin-top: 18px; line-height: 1.05; }
.vrow__p { margin-top: 18px; color: var(--ink-2); font-size: 16.5px; max-width: 52ch; }

@media (min-width: 1024px) {
  .vrow__media-wrap { margin-top: -40px; margin-bottom: -40px; }
  .vrow:not(.vrow--flip) .vrow__media-wrap { margin-left: -32px; }
  .vrow--flip .vrow__media-wrap { margin-right: -32px; }
}
@media (min-width: 1400px) {
  .vrow__media-wrap { margin-top: -64px; margin-bottom: -64px; }
  .vrow:not(.vrow--flip) .vrow__media-wrap { margin-left: -52px; }
  .vrow--flip .vrow__media-wrap { margin-right: -52px; }
}
@media (max-width: 900px) {
  .vrow__grid, .vrow--flip .vrow__grid { grid-template-columns: 1fr; }
  .vrow--flip .vrow__media, .vrow--flip .vrow__copy { order: initial; }
  .vrow__media-wrap { margin: 0 !important; }
}

/* ===== VISUAL STYLES ===== */
.styles__grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 28px; }
.style__media {
  position: relative; width: 100%; aspect-ratio: 4 / 3;
  border-radius: var(--radius-lg); overflow: hidden;
  border: 1px solid var(--line); background: var(--bg-3);
  box-shadow: 0 18px 40px -22px rgba(0,0,0,.25);
}
.style__img { width: 100%; height: 100%; object-fit: cover; display: block; }
.style__meta {
  position: absolute; left: 12px; right: 12px; bottom: 10px;
  display: flex; gap: 8px; align-items: center; justify-content: space-between;
  font-size: 10px; color: var(--ink-2); pointer-events: none;
}
.style__tag {
  font-family: var(--font-mono); background: var(--paper);
  border: 1px solid var(--line); padding: 3px 7px; border-radius: 4px;
}
.style__cap {
  font-family: var(--font-mono); letter-spacing: .04em;
  background: var(--paper); border: 1px solid var(--line);
  padding: 3px 7px; border-radius: 4px;
}
.style__row { display: flex; align-items: baseline; justify-content: space-between; margin-top: 14px; gap: 12px; }
.style__name { font-family: var(--font-display); font-size: 22px; font-weight: 400; }
.style__note { font-family: var(--font-mono); font-size: 11px; color: var(--ink-3); letter-spacing: .06em; text-transform: uppercase; }

@media (max-width: 900px) { .styles__grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 600px) { .styles__grid { grid-template-columns: 1fr; } }

/* ===== CREW ===== */
.crew__row { display: grid; grid-template-columns: repeat(5,1fr); gap: 18px; }
.crew__card {
  background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius-lg);
  padding: 28px 22px; transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
}
.crew__card:hover { transform: translateY(-3px); box-shadow: 0 20px 40px -28px rgba(0,0,0,.18); border-color: var(--line-2); }
.crew__badge {
  width: 56px; height: 56px; border-radius: 999px; background: var(--bg-2); color: var(--accent);
  display: inline-flex; align-items: center; justify-content: center; position: relative;
  font-family: var(--font-display); font-size: 22px; font-style: italic;
}
.crew__ring {
  position: absolute; inset: -6px; width: calc(100% + 12px); height: calc(100% + 12px);
  color: var(--accent); opacity: .6; animation: spin 18s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.crew__role { font-family: var(--font-display); font-size: 21px; font-weight: 400; margin-top: 22px; letter-spacing: -0.02em; }
.crew__desc { color: var(--ink-2); margin-top: 10px; font-size: 14.5px; line-height: 1.5; }

@media (max-width: 1100px) { .crew__row { grid-template-columns: repeat(3,1fr); } }
@media (max-width: 700px)  { .crew__row { grid-template-columns: 1fr 1fr; } }

/* ===== THE MATH ===== */
.math__row {
  display: grid; grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr;
  gap: 0; align-items: stretch; background: var(--paper);
  border: 1px solid var(--line); border-radius: var(--radius-lg); padding: 8px;
}
.math__block { padding: 28px 24px; text-align: center; border-radius: 10px; }
.math__block.is-accent { background: var(--accent); color: var(--accent-ink); }
.math__block.is-accent .math__d { color: color-mix(in oklab, var(--accent-ink) 80%, transparent); }
.math__num { font-family: var(--font-display); font-size: clamp(40px,4.4vw,64px); line-height: 1; letter-spacing: -0.03em; font-weight: 400; }
.math__u { font-size: 0.36em; font-style: italic; color: var(--ink-3); margin-left: 4px; }
.math__block.is-accent .math__u { color: color-mix(in oklab, var(--accent-ink) 80%, transparent); }
.math__d { color: var(--ink-2); margin-top: 12px; font-size: 14px; }
.math__arrow { display: flex; align-items: center; justify-content: center; color: var(--ink-3); }
.math__concl { margin: 36px auto 0; max-width: 60ch; text-align: center; font-style: italic; font-size: 22px; color: var(--ink); font-family: var(--font-display); font-weight: 400; }

@media (max-width: 980px) {
  .math__row { grid-template-columns: 1fr 1fr; gap: 6px; }
  .math__arrow { display: none; }
}

/* ===== COMPARE ===== */
.cmp { background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius-lg); overflow: hidden; }
.cmp__head, .cmp__row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; align-items: center; }
.cmp__head { padding: 22px; border-bottom: 1px solid var(--line); background: var(--bg-2); }
.cmp__col { text-align: center; padding: 4px 8px; }
.cmp__col--us { background: var(--accent); color: var(--accent-ink); padding: 14px 8px; border-radius: 10px; }
.cmp__col-name { font-family: var(--font-display); font-size: 18px; font-weight: 400; }
.cmp__col--us .cmp__col-name { color: var(--accent-ink); }
.cmp__col-tag { font-family: var(--font-mono); font-size: 10.5px; color: var(--ink-3); margin-top: 4px; letter-spacing: .08em; text-transform: uppercase; }
.cmp__col--us .cmp__col-tag { color: color-mix(in oklab, var(--accent-ink) 80%, transparent); }
.cmp__row { padding: 0 22px; border-top: 1px solid var(--line); }
.cmp__feat { padding: 18px 0; color: var(--ink); font-size: 15px; }
.cmp__cell { padding: 18px 0; display: flex; justify-content: center; }
.cmp__cell--us { background: color-mix(in oklab, var(--accent) 8%, transparent); margin: 0 4px; border-radius: 6px; }
.cmp__c { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 999px; }
.cmp__c--yes { background: var(--accent); color: var(--accent-ink); }
.cmp__c--partial { background: var(--bg-3); color: var(--ink-2); }
.cmp__c--no { background: transparent; color: var(--ink-3); }

@media (max-width: 760px) {
  .cmp__head, .cmp__row { grid-template-columns: 1.4fr 1fr 1fr 1fr; padding: 0 12px; }
  .cmp__feat { font-size: 13.5px; }
}

/* ===== PRICING ===== */
.pricing__grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; align-items: stretch; max-width: 980px; margin-left: auto; margin-right: auto; }
.tier {
  position: relative; background: var(--paper); border: 1px solid var(--line);
  border-radius: var(--radius-lg); padding: 28px 26px; display: flex; flex-direction: column;
}
.tier--featured { border-color: var(--accent); box-shadow: 0 30px 60px -28px color-mix(in oklab, var(--accent) 40%, transparent); transform: translateY(-6px); }
.tier__badge {
  position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
  background: var(--accent); color: var(--accent-ink); font-family: var(--font-mono);
  font-size: 11px; padding: 5px 12px; border-radius: 999px; letter-spacing: .12em;
  text-transform: uppercase; white-space: nowrap;
}
.tier__name { font-family: var(--font-display); font-size: 22px; font-weight: 400; }
.tier__price { font-family: var(--font-display); font-size: 42px; margin-top: 14px; line-height: 1; letter-spacing: -0.03em; font-weight: 400; }
.tier__per { font-style: italic; font-size: 14px; color: var(--ink-3); margin-left: 2px; }
.tier__desc { color: var(--ink-2); margin-top: 12px; font-size: 14px; min-height: 42px; }
.tier__cta { width: 100%; justify-content: center; margin-top: 22px; }
.tier__feats {
  list-style: none; padding: 22px 0 0; margin: 22px 0 0;
  display: flex; flex-direction: column; gap: 12px;
  border-top: 1px solid var(--line);
}
.tier__feats li { display: flex; gap: 10px; align-items: flex-start; font-size: 14px; color: var(--ink-2); }
.tier__feats li svg { flex-shrink: 0; margin-top: 1px; }

@media (max-width: 900px) { .pricing__grid { grid-template-columns: 1fr; max-width: 420px; } .tier--featured { transform: none; } }

/* ===== TESTIMONIALS ===== */
.quotes { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; }
.quote { margin: 0; background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius-lg); padding: 28px; position: relative; }
.quote__mark { position: absolute; top: 8px; right: 18px; font-family: var(--font-display); font-size: 70px; line-height: 1; color: var(--accent); opacity: .3; font-style: italic; }
.quote__q { font-family: var(--font-display); font-size: 19px; line-height: 1.45; letter-spacing: -0.005em; color: var(--ink); font-weight: 400; margin: 0 0 22px; }
.quote__cap { display: flex; gap: 14px; align-items: center; padding-top: 18px; border-top: 1px solid var(--line); }
.quote__avatar { width: 40px; height: 40px; border-radius: 999px; background: var(--bg-3); color: var(--accent); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 14px; font-style: italic; flex-shrink: 0; }
.quote__name { font-weight: 500; font-size: 14.5px; }
.quote__role { color: var(--ink-3); font-size: 13px; margin-top: 2px; }
.logos { margin-top: 72px; text-align: center; }
.logos__label { font-family: var(--font-mono); color: var(--ink-3); font-size: 11px; letter-spacing: .14em; }
.logos__row { display: flex; justify-content: center; align-items: center; gap: clamp(20px,3vw,48px); flex-wrap: wrap; margin-top: 16px; }
.logos__item { font-family: var(--font-display); font-size: 17px; color: var(--ink-2); letter-spacing: .04em; opacity: .8; transition: opacity .2s ease; }
.logos__item:hover { opacity: 1; }

@media (max-width: 980px) { .quotes { grid-template-columns: 1fr; } }

/* ===== FINAL CTA ===== */
.finalcta {
  background: linear-gradient(135deg, color-mix(in oklab, var(--accent) 88%, black 12%) 0%, var(--accent) 60%, color-mix(in oklab, var(--accent) 75%, #d97a3a 25%) 100%);
  color: white; position: relative; overflow: hidden;
  padding: clamp(100px,12vw,160px) 0;
}
.finalcta__pattern { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
.finalcta__inner { position: relative; z-index: 1; text-align: center; }
.finalcta__h { font-family: var(--font-display); font-size: clamp(48px,7vw,96px); font-weight: 400; margin-top: 20px; letter-spacing: -0.02em; line-height: 1.05; }
.finalcta__h em { font-style: italic; color: color-mix(in oklab, white 92%, var(--accent)); }
.finalcta__sub { margin-top: 20px; font-size: 19px; opacity: .9; }
.finalcta__ctas { margin-top: 36px; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
.finalcta__btn { background: white; color: var(--accent); padding: 16px 30px; font-size: 15.5px; }
.finalcta__btn:hover { background: var(--bg-2); transform: translateY(-1px); }
.finalcta__ghost { background: transparent; color: white; border: 1px solid color-mix(in oklab, white 50%, transparent); padding: 16px 30px; font-size: 15.5px; }
.finalcta__ghost:hover { background: color-mix(in oklab, white 10%, transparent); border-color: white; }

`;

// ── Static body HTML (hero, stats, how-it-works, containers, cta, footer) ──
const BODY_HTML = `
<!-- HERO -->
<section class="hero" id="top">
  <div class="hero__bg" aria-hidden="true">
    <div class="hero__grain"></div>
    <div class="hero__glow hero__glow--a"></div>
    <div class="hero__glow hero__glow--b"></div>
  </div>
  <div class="hero__inner">
    <div class="hero__copy-area">
      <div class="hero__copy">
        <div class="label label--accent">AI Filmmaking Platform</div>
        <h1 class="hero__h">
          Create <span class="flipcube" id="hero-flipcube" aria-label="Movies"><span class="flipcube__sizer" aria-hidden="true"><span class="flipcube__sizer-w">Movies</span><span class="flipcube__sizer-w">Videos</span></span><span class="flipcube__stage" aria-hidden="true"><span class="flipcube__cube"><span class="flipcube__face flipcube__face--top">Movies</span><span class="flipcube__face flipcube__face--front">Videos</span></span></span></span> at the<br>
          <em class="hero__em">Speed of Storytelling.</em>
        </h1>
        <p class="hero__sub">
          Create 5-minute to 3-hour videos with the lowest labor in the industry. No prompt engineering. No tool switching. Write your story. ACT 3 handles everything else.
        </p>
        <div class="hero__ctas">
          <a class="btn btn--accent btn--lg" href="https://app.act3ai.com/signup/">Get Started <span class="arrow">→</span></a>
          <a class="btn btn--ghost btn--lg" href="https://www.youtube.com/@ACT3AI" target="_blank" rel="noopener noreferrer">
            <span class="hero__playdot" aria-hidden="true">
              <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 1l7 4-7 4z" fill="currentColor"/></svg>
            </span>
            See ACT 3 in Action
          </a>
        </div>
        <p class="hero__proof">Trusted by screenwriters, indie filmmakers, and studios.</p>
      </div>
    </div>

    <div class="hero__strip" aria-hidden="true">
      <video class="hero__reel"
        src="/images/hero-reel.mp4"
        poster="/images/hero-reel-poster.jpg"
        muted playsinline loop autoplay preload="metadata"></video>
      <div class="hero__overlays" aria-hidden="true">
        <div class="hero__shot-marker">SHOT 1. INT. WAREHOUSE - NIGHT</div>
        <div class="hero__card hero__card--alex">
          <span class="hero__char">KAI</span>
          <p class="hero__line">Two on the catwalk. I see muzzle flash.</p>
        </div>
        <div class="hero__card hero__card--sally">
          <span class="hero__char">LEE</span>
          <p class="hero__line">Hold position. Backup is sixty seconds out.</p>
        </div>
        <div class="hero__type-tag">Movie</div>
      </div>
    </div>
  </div>
  <a href="#stats" class="hero__scroll" aria-label="Scroll to next section">
    <span class="mono">scroll</span>
    <span class="hero__chev">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </span>
  </a>
</section>

<!-- STATS -->
<section class="stats section--alt" id="stats">
  <div class="wrap stats__grid">
    <div class="stat">
      <div class="stat__num serif" data-stat>80<span class="stat__dim">–</span>200<span class="stat__unit"> hrs</span></div>
      <div class="stat__label">of pre-production collapsed to ~2 hours</div>
    </div>
    <div class="stat">
      <div class="stat__num serif" data-stat>1<span class="stat__unit"> Platform</span></div>
      <div class="stat__label">replaces 10+ traditional production tools</div>
    </div>
    <div class="stat">
      <div class="stat__num serif" data-stat>Full<span class="stat__unit"> Films</span></div>
      <div class="stat__label">not 8–40 second clips</div>
    </div>
  </div>
</section>

<!-- HOW IT WORKS -->
<section class="section how" id="how">
  <div class="wrap">
    <div class="sec-head sec-head--center">
      <div class="label">How It Works</div>
      <h2 class="serif">From Script to Finished <span class="flipcube" id="how-flipcube" aria-label="Film"><span class="flipcube__sizer" aria-hidden="true"><span class="flipcube__sizer-w">Film</span><span class="flipcube__sizer-w">Video</span></span><span class="flipcube__stage" aria-hidden="true"><span class="flipcube__cube"><span class="flipcube__face flipcube__face--top">Film</span><span class="flipcube__face flipcube__face--front">Video</span></span></span></span> <em style="color:var(--accent)">in Three Steps.</em></h2>
    </div>
    <div class="how__grid">
      <div class="how__step">
        <div class="how__num">01</div>
        <div class="how__t">Write Your Story</div>
        <p class="how__d">Type dialogue, scene descriptions, and camera notes in plain language. ACT 3 understands intent, not just prompts.</p>
      </div>
      <div class="how__step">
        <div class="how__num">02</div>
        <div class="how__t">AI Produces Your Film</div>
        <p class="how__d">Casting, set building, cinematography, lighting, and rendering happen automatically. Every shot informed by your script.</p>
      </div>
      <div class="how__step">
        <div class="how__num">03</div>
        <div class="how__t">Edit, Refine, Export</div>
        <p class="how__d">The integrated editor lets you adjust any shot. When you're done, export to any format: YouTube, TikTok, ProRes, 4K.</p>
      </div>
    </div>
  </div>
</section>

<!-- VALUE ROWS (14) - populated by JS -->
<div id="value-rows"></div>

<!-- VISUAL STYLES -->
<section class="section styles">
  <div class="wrap">
    <div class="sec-head sec-head--center">
      <div class="label">Visual Styles</div>
      <h2 class="serif">Pick the Visual Style That <em style="color:var(--accent)">Fits Your Story.</em></h2>
      <p>From photorealistic to anime to 3D animation. Every style, one platform.</p>
    </div>
    <div class="styles__grid" id="styles-grid"></div>
  </div>
</section>

<!-- AI CREW -->
<section class="section crew section--alt">
  <div class="wrap">
    <div class="sec-head sec-head--center">
      <div class="label">AI Production Crew</div>
      <h2 class="serif">A Full Production Team, <em style="color:var(--accent)">Working for You.</em></h2>
    </div>
    <div class="crew__row" id="crew-row"></div>
  </div>
</section>

<!-- COMPARE -->
<section class="section compare">
  <div class="wrap">
    <div class="sec-head sec-head--center">
      <div class="label">How We Compare</div>
      <h2 class="serif">Built for Film. Built for Quality. <em style="color:var(--accent)">Power to build any kind of video.</em></h2>
    </div>
    <div class="cmp">
      <div class="cmp__head">
        <div></div>
        <div class="cmp__col cmp__col--us">
          <div class="cmp__col-name serif">ACT 3</div>
          <div class="cmp__col-tag">filmmaking platform</div>
        </div>
        <div class="cmp__col">
          <div class="cmp__col-name">Clip Generators</div>
          <div class="cmp__col-tag">runway · pika · sora</div>
        </div>
        <div class="cmp__col">
          <div class="cmp__col-name">Business Video</div>
          <div class="cmp__col-tag">heygen · synthesia</div>
        </div>
      </div>
      <div id="cmp-body"></div>
    </div>
  </div>
</section>

<!-- PRICING -->
<section class="section pricing section--alt" id="pricing">
  <div class="wrap">
    <div class="sec-head sec-head--center">
      <div class="label">Simple Pricing</div>
      <h2 class="serif">Pricing <em style="color:var(--accent)">Plans.</em></h2>
    </div>
    <div class="pricing__grid" id="pricing-grid"></div>
  </div>
</section>

<!-- FINAL CTA -->
<section class="finalcta">
  <svg class="finalcta__pattern" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <defs><pattern id="finalstripes" patternUnits="userSpaceOnUse" width="3" height="3" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="3" stroke="white" stroke-width="0.4" opacity="0.18"/></pattern></defs>
    <rect width="100" height="100" fill="url(#finalstripes)"/>
  </svg>
  <div class="wrap finalcta__inner">
    <div class="label" style="color:color-mix(in oklab, white 80%, transparent)">Begin</div>
    <h2 class="finalcta__h serif">
      Your Story Deserves<br>
      <em>to Be Seen.</em>
    </h2>
    <p class="finalcta__sub">Start creating your film today. Free to begin.</p>
    <div class="finalcta__ctas">
      <a class="btn finalcta__btn" href="https://app.act3ai.com/signup/">Start Creating Your Film <span class="arrow">→</span></a>
      <a class="btn finalcta__ghost" href="https://www.youtube.com/@ACT3AI">Watch the demo</a>
    </div>
  </div>
</section>

`;

export default function Home(): React.JSX.Element {
  useEffect(() => {
    // ── Stripe placeholder helper ──────────────────────────────────────────────
    let _spIdx = 10;
    function stripeHTML(aspect: string, tag: string, caption: string): string {
      const id = "sp" + _spIdx++;
      return `<div class="stripes" style="aspect-ratio:${aspect}">
    <svg class="stripes__bg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <defs><pattern id="${id}" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(35)">
        <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" stroke-width="0.7" opacity="0.5"/>
      </pattern></defs>
      <rect width="100" height="100" fill="url(#${id})"/>
    </svg>
    <div class="stripes__frame">
      <div class="stripes__corners"><span></span><span></span><span></span><span></span></div>
      <button class="stripes__play" aria-label="Play preview">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>
      </button>
      <div class="stripes__meta">
        <span class="stripes__tag">${tag}</span>
        <span class="stripes__caption">${caption}</span>
      </div>
    </div>
  </div>`;
    }

    function videoHTML(slug: string, tag: string, caption: string): string {
      return `<div class="shot-video">
    <video
      src="/images/screenshots/${slug}/loop.mp4"
      poster="/images/screenshots/${slug}/poster.jpg"
      muted playsinline loop preload="metadata"
      aria-label="${caption}"></video>
    <div class="shot-video__meta">
      <span class="shot-video__tag">${tag}</span>
      <span class="shot-video__caption">${caption}</span>
    </div>
  </div>`;
    }

    function proofBullet(text: string): string {
      return `<li class="proof">
    <span class="proof__dot" aria-hidden="true">
      <svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="3.2" fill="currentColor"/></svg>
    </span>
    <span>${text}</span>
  </li>`;
    }

    // ── Value Rows ─────────────────────────────────────────────────────────────
    const VALUE_ROWS = [
      { id: "script-speed", side: "L", label: "Script-Speed Creation",
        h: "Type Your Story. Watch It Come to Life.",
        body: "Write dialogue the way you think it: \"He said this. She said that.\" ACT 3 reads your script and automates every production decision: casting, camera angles, lighting, sets. No prompt engineering. No shot-by-shot setup. Just storytelling.",
        bullets: ["Write natural-language dialogue and scene descriptions", "AI infers cinematography, staging, and set needs", "650-shot film set up in ~2 hours vs. 5,200 hours manually"],
        tag: "02.01", cap: "SCRIPT → SHOT LIST",
        mediaHtml: videoHTML("script-speed", "02.01", "SCRIPT → SHOT LIST") },
      { id: "sets", side: "R", label: "Sets &amp; Backgrounds",
        h: "Define Your World Once. Every Shot Follows.",
        body: "Build your set once, whether it is an office, a city street, or a spaceship. ACT 3 applies it consistently across every scene and shot. No redescribing the environment per prompt. No inconsistent backgrounds.",
        bullets: ["2D and 3D environments", "Procedural city and building generation", "Set persists across all shots in a scene or episode"],
        tag: "02.02", cap: "SET BUILDER · INT. APARTMENT",
        mediaHtml: videoHTML("sets", "02.02", "SET BUILDER · INT. APARTMENT") },
      { id: "screenwriters", side: "L", label: "For Screenwriters",
        h: "Write It. See It. Ship It.",
        body: "ACT 3 is the screenwriter's dream realized. Import your script, watch it visualized shot by shot, iterate in real time. You wrote the story. Now see it as a film before a single dollar of production budget is spent.",
        bullets: ["Import PDF, TXT, or Final Draft files", "AI expands a concept into full beats, scenes, and shots", "Human and AI script versions side by side"],
        tag: "02.03", cap: "SCRIPT EDITOR · DRAFT 4",
        mediaHtml: videoHTML("screenwriters", "02.03", "SCRIPT EDITOR · DRAFT 4") },
      { id: "social", side: "R", label: "Social Media Video",
        h: "Create Cinematic Content at Social Media Speed.",
        body: "From concept to polished short-form video in a fraction of the time. Format for any platform in one workflow: vertical for TikTok and Reels, horizontal for YouTube, square for Instagram.",
        bullets: ["Auto-format exports for TikTok, Reels, YouTube Shorts", "Cinematic quality, not clip-generator quality", "Batch-produce a week of content in hours"],
        tag: "02.04", cap: "MULTI-FORMAT EXPORT",
        mediaHtml: videoHTML("social", "02.04", "MULTI-FORMAT EXPORT") },
      { id: "marketing", side: "L", label: "Marketing Video",
        h: "More Video Output. Higher Quality. Lower Budgets.",
        body: "Replace expensive video production cycles with an AI pipeline that delivers broadcast-quality marketing video on demand. Define your brand style once and every video stays on brand.",
        bullets: ["Define brand visual style; apply across all outputs", "Product demos, testimonials, brand films", "Export-ready for digital, broadcast, and social"],
        tag: "02.05", cap: "BRAND KIT · APPLIED",
        mediaHtml: videoHTML("marketing", "02.05", "BRAND KIT · APPLIED") },
      { id: "explainer", side: "R", label: "Explainer Video",
        h: "Explain Anything. Visually. In Minutes.",
        body: "Turn a product description or concept into a polished animated or live-action explainer. AI handles voiceover, visuals, transitions, and pacing.",
        bullets: ["Start from a script or a single paragraph", "AI voiceover with natural prosody", "Multiple visual styles available"],
        tag: "02.06", cap: "EXPLAINER · RENDER",
        mediaHtml: videoHTML("explainer", "02.06", "EXPLAINER · RENDER") },
      { id: "corporate", side: "L", label: "Corporate Video",
        h: "Professional Corporate Video Without the Production Budget.",
        body: "Town halls, training videos, executive announcements, internal communications. ACT 3 produces them quickly, consistently, and at a fraction of traditional production cost.",
        bullets: ["Consistent on-brand presenter appearance", "Multilingual voiceover and dubbing", "Roles and approval workflows for enterprise teams"],
        tag: "02.07", cap: "PRESENTER · TAKE 03",
        mediaHtml: videoHTML("corporate", "02.07", "PRESENTER · TAKE 03") },
      { id: "movies", side: "R", label: "Movies &amp; Series",
        h: "Full-Length Films. Not 8-Second Clips.",
        body: "ACT 3 is purpose-built for long-form. Script a feature film, a short, a TV episode, or a web series. The Story Arc engine plans across episodes. Consistency holds across hundreds of shots.",
        bullets: ["Story Arc engine for multi-episode planning", "Visual and character consistency across 600+ shots", "AI Showrunner orchestrates the full production"],
        tag: "02.08", cap: "EP 01 · SCENE 14 OF 32",
        mediaHtml: videoHTML("movies", "02.08", "EP 01 · SCENE 14 OF 32") },
      { id: "voice", side: "L", label: "Voice &amp; Dialogue",
        h: "AI Voices for Drafts. Human Voices When You're Ready.",
        body: "Every character has a voice from the first draft. High-quality AI TTS with natural cadence and emotional range. When you're ready to elevate, bring in human voice actors through the same interface.",
        bullets: ["Multilingual TTS and dubbing", "Lipsync for any character", "Human voice actor integration in the same pipeline"],
        tag: "02.09", cap: "DIALOGUE · KIRA L.",
        mediaHtml: videoHTML("voice", "02.09", "DIALOGUE · KIRA L.") },
      { id: "actors", side: "R", label: "Actor &amp; Costume Consistency",
        h: "Cast Your Characters. Keep Them Consistent.",
        body: "Define your cast from a central character directory. ACT 3 maintains physical consistency, wardrobe, and performance style across every scene. LoRA-based character consistency. No recreating characters per shot.",
        bullets: ["Character library with age, appearance, and wardrobe management", "Marker-less motion capture from iPhone or webcam", "AI casting agent suggests characters from brief descriptions"],
        tag: "02.10", cap: "CASTING · 5 ACTORS",
        mediaHtml: videoHTML("actors", "02.10", "CASTING · 5 ACTORS") },
      { id: "editor", side: "L", label: "Unified Editor",
        h: "One Editor. Full Control. Move Fast.",
        body: "The integrated editor handles everything from shot-level adjustments to full-scene assembly. Timeline, keyframes, transitions, and render controls, all without opening another application.",
        bullets: ["Three-column layout with script, visual, and timeline panels", "Persona-aware views for Writers, Directors, and Actors", "One-click AI regeneration per shot"],
        tag: "02.11", cap: "EDITOR · TIMELINE VIEW",
        mediaHtml: videoHTML("editor", "02.11", "EDITOR · TIMELINE VIEW") },
      { id: "models", side: "R", label: "Powered by Best AI",
        h: "Built on Top of the Best Video AI Models.",
        body: "ACT 3 routes each shot to the right model automatically: Veo 3, Runway, FLUX, Hunyuan, Wan 2.1, and more. You get the best output for each task without managing models yourself.",
        bullets: ["Multi-model routing engine selects the best model per shot type", "New models integrated as they become available", "No prompt engineering required"],
        tag: "02.12", cap: "MODEL ROUTER",
        mediaHtml: videoHTML("models", "02.12", "MODEL ROUTER") },
      { id: "advertising", side: "L", label: "Advertising Video",
        h: "Ads That Stop the Scroll. Every Time.",
        body: "Produce broadcast-quality ads in a fraction of the time and cost. ACT 3 gives you cinematic production values without a production crew. Run more creative, test more concepts, ship more campaigns without blowing the budget.",
        bullets: ["TV, digital, and social ad formats from one workflow", "Brand-consistent visuals across every campaign", "Go from brief to finished ad in hours, not weeks"],
        tag: "02.13", cap: "AD · FINAL CUT",
        mediaHtml: videoHTML("advertising", "02.13", "AD · FINAL CUT") },
      { id: "screens", side: "L", label: "Screens, Monitors &amp; Phone Content",
        h: "Screens Within Scenes. Fully Controlled.",
        body: "Place live video or graphics on any in-scene display: a laptop screen, a billboard, a smartphone. Control exactly what appears. Perfect for product demos, tech stories, and brand placement.",
        bullets: ["Place content on any in-scene display surface", "Fully controlled per shot", "Ideal for product placement and tech narratives"],
        tag: "02.13", cap: "IN-SCENE DISPLAY",
        mediaHtml: videoHTML("screens", "02.13", "IN-SCENE DISPLAY") },
      { id: "teams", side: "R", label: "Teams &amp; Collaboration",
        h: "Your Team. One Platform. Full Access Controls.",
        body: "Writers, directors, editors, and producers work on the same project simultaneously. Role-based permissions, scene locking, version history, and approval workflows keep production organized.",
        bullets: ["Role-based permissions (Writer, Director, Producer, Admin)", "Version history and visual diffing", "Multi-org support for agencies managing multiple clients"],
        tag: "02.14", cap: "TEAM · 6 EDITING",
        mediaHtml: videoHTML("teams", "02.14", "TEAM · 6 EDITING") },
    ];

    const vrContainer = document.getElementById("value-rows");
    if (vrContainer) {
      vrContainer.innerHTML = "";
      VALUE_ROWS.forEach((row, idx) => {
        const flipped = row.side === "R";
        const altBg = idx % 2 === 1 ? "section--alt" : "";
        vrContainer.innerHTML += `
  <section class="vrow ${flipped ? "vrow--flip" : ""} ${altBg}" id="${row.id}">
    <div class="wrap vrow__grid">
      <div class="vrow__media">
        <div class="vrow__media-wrap">
          ${(row as any).mediaHtml || stripeHTML("16/10", row.tag, row.cap)}
        </div>
      </div>
      <div class="vrow__copy">
        <div class="label label--accent">${row.label}</div>
        <h2 class="vrow__h">${row.h}</h2>
        <p class="vrow__p">${row.body}</p>
        <ul class="proof-list">${row.bullets.map(proofBullet).join("")}</ul>
      </div>
    </div>
  </section>`;
      });
    }

    // ── Visual Styles ──────────────────────────────────────────────────────────
    const STYLES = [
      { name: "Realistic",              note: "photoreal · 35mm",          slug: "realistic"   },
      { name: "Cinematic",              note: "anamorphic · color grade",  slug: "cinematic"   },
      { name: "Anime",                  note: "2D · cel-shaded",           slug: "anime"       },
      { name: "3D Animation",           note: "stylized · cartoon",        slug: "3d"          },
      { name: "Cartoon",                note: "flat · bold linework",      slug: "cartoon"     },
      { name: "Stylized / Illustrated", note: "painterly · editorial",     slug: "illustrated" },
    ];
    function styleMediaHTML(slug: string, tag: string, caption: string): string {
      return `<div class="style__media">
    <img src="/images/styles/${slug}.webp" alt="${caption}" class="style__img" loading="lazy" decoding="async" />
    <div class="style__meta">
      <span class="style__tag">${tag}</span>
      <span class="style__cap">${caption}</span>
    </div>
  </div>`;
    }
    const stylesGrid = document.getElementById("styles-grid");
    if (stylesGrid) {
      stylesGrid.innerHTML = "";
      STYLES.forEach((s, i) => {
        const tag = "S." + String(i + 1).padStart(2, "0");
        stylesGrid.innerHTML += `<div class="style">
    ${styleMediaHTML(s.slug, tag, s.note)}
    <div class="style__row">
      <span class="style__name">${s.name}</span>
      <span class="style__note mono">${s.note}</span>
    </div>
  </div>`;
      });
    }

    // ── AI Crew ────────────────────────────────────────────────────────────────
    const CREW = [
      { role: "AI Writer",                 desc: "Develops scripts, dialogue, and narrative structure from your inputs.", g: "W" },
      { role: "AI Director",               desc: "Orchestrates overall vision, scene pacing, and story flow.", g: "D" },
      { role: "AI Cinematographer",        desc: "Camera placement, movement, shot composition, and visual storytelling.", g: "C" },
      { role: "AI Set Designer",           desc: "Creates virtual environments, location designs, and spatial planning.", g: "S" },
      { role: "AI Casting &amp; Wardrobe", desc: "Selects characters, designs costumes, maintains visual consistency.", g: "K" },
    ];
    const crewRow = document.getElementById("crew-row");
    if (crewRow) {
      crewRow.innerHTML = "";
      CREW.forEach((c) => {
        crewRow.innerHTML += `<div class="crew__card">
    <div class="crew__badge">
      ${c.g}
      <svg viewBox="0 0 100 100" class="crew__ring" aria-hidden="true">
        <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="2 4"/>
      </svg>
    </div>
    <div class="crew__role serif">${c.role}</div>
    <div class="crew__desc">${c.desc}</div>
  </div>`;
      });
    }

    // ── Compare table ──────────────────────────────────────────────────────────
    const CMP_FEATURES = [
      "Full-length films and series (not just clips)",
      "Script-to-film pipeline (write once, produce everything)",
      "Define-once character and set consistency",
      "3D pipeline and Blender integration",
      "Motion capture (iPhone/webcam)",
      "Virtual camera system with full cinematography controls",
      "AI Showrunner for long-form story arcs",
      "Multi-format export (YouTube, TikTok, ProRes, 4K)",
      "Multi-user collaboration with role permissions",
    ];
    const CMP_MATRIX = [
      [2, 0, 1], [2, 0, 0], [2, 1, 1], [2, 0, 0], [2, 0, 0],
      [2, 1, 0], [2, 0, 0], [2, 1, 1], [2, 0, 1],
    ];
    function cellIcon(v: number): string {
      if (v === 2) return `<span class="cmp__c cmp__c--yes" aria-label="Yes"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4.5 12.5l4.5 4.5L19.5 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;
      if (v === 1) return `<span class="cmp__c cmp__c--partial" aria-label="Partial"><svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="3" fill="currentColor"/></svg></span>`;
      return `<span class="cmp__c cmp__c--no" aria-label="No"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></span>`;
    }
    const cmpBody = document.getElementById("cmp-body");
    if (cmpBody) {
      cmpBody.innerHTML = "";
      CMP_FEATURES.forEach((feat, i) => {
        cmpBody.innerHTML += `<div class="cmp__row">
    <div class="cmp__feat">${feat}</div>
    <div class="cmp__cell cmp__cell--us">${cellIcon(CMP_MATRIX[i][0])}</div>
    <div class="cmp__cell">${cellIcon(CMP_MATRIX[i][1])}</div>
    <div class="cmp__cell">${cellIcon(CMP_MATRIX[i][2])}</div>
  </div>`;
      });
    }

    // ── Pricing ────────────────────────────────────────────────────────────────
    // Carry the chosen plan so the selection survives the login redirect and the
    // user lands straight on checkout instead of the plan list.
    // The Starter tier is still called "Creator" in the app's plan records, so the
    // link keeps that name even though the card says Starter.
    const planHref = (name: string) => `https://app.act3ai.com/settings/plans/?plan=${encodeURIComponent(name)}`;
    const TIERS = [
      { name: "Starter", price: "$49",  per: "per month", desc: "For creators producing content regularly.",       cta: "Choose Starter", href: planHref("Creator"), featured: true,  feats: ["24,500 credits / month", "61,250 credit rollover bank", "Cloud Storage 50 GB"] },
      { name: "Pro",     price: "$175", per: "per month", desc: "For serious filmmakers producing at scale.",      cta: "Choose Pro",     href: planHref("Pro"), featured: false, feats: ["87,500 credits / month", "218,750 credit rollover bank", "Cloud Storage 740 GB", "All AI Video Models", "Priority Rendering"] },
      { name: "Enterprise", price: "Custom", per: "", desc: "For agencies, studios, and teams producing professional content.", cta: "Contact Us", href: "mailto:ContactUs@ACT3ai.com", featured: false, feats: ["High Credits / month", "High rollover bank", "High Cloud Storage"] },
    ];
    const checkSVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="color:var(--accent);flex-shrink:0"><path d="M4.5 12.5l4.5 4.5L19.5 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const pricingGrid = document.getElementById("pricing-grid");
    if (pricingGrid) {
      pricingGrid.innerHTML = "";
      TIERS.forEach((t) => {
        pricingGrid.innerHTML += `<div class="tier${t.featured ? " tier--featured" : ""}">
    ${t.featured ? '<div class="tier__badge">Most Popular</div>' : ""}
    <div class="tier__name serif">${t.name}</div>
    <div class="tier__price serif">${t.price}<span class="tier__per"> ${t.per}</span></div>
    <div class="tier__desc">${t.desc}</div>
    <a class="btn ${t.featured ? "btn--accent" : "btn--ghost"} tier__cta" href="${(t as any).href}">${t.cta} <span class="arrow">→</span></a>
    <ul class="tier__feats">${t.feats.map((f) => `<li>${checkSVG}<span>${f}</span></li>`).join("")}</ul>
  </div>`;
      });
    }

    // ── FlipCube word rotation ─────────────────────────────────────────────
    const HERO_WORDS = ["Movies", "Videos"];
    const HOW_WORDS  = ["Film",   "Video"];
    let flipIdx = 0;
    const heroStage = document.querySelector<HTMLElement>("#hero-flipcube .flipcube__stage");
    const heroLabel = document.getElementById("hero-flipcube");
    const howStage  = document.querySelector<HTMLElement>("#how-flipcube .flipcube__stage");
    const howLabel  = document.getElementById("how-flipcube");
    function buildFlipCube(cur: string, nxt: string): string {
      return `<span class="flipcube__cube"><span class="flipcube__face flipcube__face--top">${cur}</span><span class="flipcube__face flipcube__face--front">${nxt}</span></span>`;
    }
    const flipTimer = setInterval(() => {
      flipIdx = (flipIdx + 1) % HERO_WORDS.length;
      const heroCur = HERO_WORDS[flipIdx];
      const heroNxt = HERO_WORDS[(flipIdx + 1) % HERO_WORDS.length];
      if (heroLabel) heroLabel.setAttribute("aria-label", heroCur);
      if (heroStage) heroStage.innerHTML = buildFlipCube(heroCur, heroNxt);
      const howCur = HOW_WORDS[flipIdx];
      const howNxt = HOW_WORDS[(flipIdx + 1) % HOW_WORDS.length];
      if (howLabel) howLabel.setAttribute("aria-label", howCur);
      if (howStage) howStage.innerHTML = buildFlipCube(howCur, howNxt);
    }, 6000);

    // ── Stats intersection observer ────────────────────────────────────────────
    const statNums = document.querySelectorAll("[data-stat]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    statNums.forEach((el) => io.observe(el));

    // ── Video play/pause based on viewport ─────────────────────────────────────
    const vidIo = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: 0.25 }
    );
    document.querySelectorAll(".shot-video video, .hero__reel").forEach((el) => vidIo.observe(el));

    // ── Cleanup ────────────────────────────────────────────────────────────────
    return () => {
      clearInterval(flipTimer);
      io.disconnect();
      vidIo.disconnect();
    };
  }, []);

  return (
    <>
      <Head>
        <title>ACT 3 | Create Movies at the Speed of Storytelling</title>
        <meta
          name="description"
          content="ACT 3 is the AI filmmaking platform for creating movies, TV, and marketing videos. Write your story. ACT 3 handles everything else."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,ital,wght@9..144,0,300;9..144,0,400;9..144,0,500;9..144,1,300;9..144,1,400;9..144,1,500&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      {/* Render the page CSS in the component tree (NOT inside <Head>) so it is
          server-rendered into the static HTML and present at first paint. When
          placed inside <Head>, react-helmet-async only injects it client-side
          after hydration, which caused a flash of unstyled content (FOUC). */}
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />
      <SiteNavbar />
      <div dangerouslySetInnerHTML={{ __html: BODY_HTML }} />
      <SiteFooter />
    </>
  );
}
