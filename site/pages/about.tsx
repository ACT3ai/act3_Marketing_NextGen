import React from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import PageHero from "../components/PageHero";

const PAGE_CSS = `
/* ===== Design Tokens ===== */
.about-page {
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
  --maxw: 1100px;
  --pad-x: clamp(20px, 4vw, 56px);
  --radius: 8px;
  --radius-lg: 14px;
  --font-display: "Fraunces", "Times New Roman", serif;
  --font-body: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;
  font-family: var(--font-body);
  color: var(--ink);
  background: var(--bg);
}

.about-page *, .about-page *::before, .about-page *::after { box-sizing: border-box; }
.about-page h2, .about-page h3, .about-page h4 { margin: 0; }
.about-page p { margin: 0; }

/* ===== Shared section layout ===== */
.about-section {
  padding: clamp(56px, 7vw, 96px) var(--pad-x);
}
.about-section--alt { background: var(--bg-2); }
.about-section--paper { background: var(--paper); }
.about-section--dark {
  background: var(--ink);
  color: var(--bg);
}
.about-inner {
  max-width: var(--maxw);
  margin: 0 auto;
}

/* ===== Section header ===== */
.about-sec-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 14px;
  margin-bottom: 52px;
}
.about-sec-label {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent);
}
.about-sec-head h2 {
  font-family: var(--font-display);
  font-size: clamp(32px, 4vw, 50px);
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.1;
  color: var(--ink);
}
.about-sec-head h2 em {
  font-style: italic;
  color: var(--accent);
}
.about-sec-head p {
  font-size: 17px;
  color: var(--ink-2);
  line-height: 1.65;
  max-width: 58ch;
}
.about-sec-head--dark h2 { color: var(--bg); }
.about-sec-head--dark p { color: color-mix(in oklab, var(--bg) 75%, transparent); }
.about-sec-head--dark .about-sec-label { color: color-mix(in oklab, var(--accent) 85%, var(--bg)); }

/* ===== Mission strip ===== */
.about-mission {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(32px, 5vw, 72px);
  align-items: center;
}
@media (max-width: 760px) {
  .about-mission { grid-template-columns: 1fr; }
}
.about-mission__copy h2 {
  font-family: var(--font-display);
  font-size: clamp(30px, 3.8vw, 46px);
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.1;
  color: var(--ink);
  margin-bottom: 20px;
}
.about-mission__copy h2 em {
  font-style: italic;
  color: var(--accent);
}
.about-mission__copy p {
  font-size: 16.5px;
  color: var(--ink-2);
  line-height: 1.7;
}
.about-mission__stat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.about-stat-card {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 24px 20px;
}
.about-stat-card__num {
  font-family: var(--font-display);
  font-size: 40px;
  font-weight: 400;
  letter-spacing: -0.03em;
  color: var(--accent);
  line-height: 1;
  margin-bottom: 6px;
}
.about-stat-card__label {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-3);
}

/* ===== Feature cards ===== */
.about-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
@media (max-width: 820px) {
  .about-cards { grid-template-columns: 1fr; }
}
.about-card {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 32px 28px;
}
.about-card__icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius);
  background: var(--accent-soft);
  color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
  font-size: 20px;
}
.about-card h3 {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 400;
  letter-spacing: -0.015em;
  color: var(--ink);
  margin-bottom: 10px;
}
.about-card p {
  font-size: 15px;
  color: var(--ink-2);
  line-height: 1.65;
}

/* ===== Values ===== */
.about-values {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
@media (max-width: 820px) {
  .about-values { grid-template-columns: 1fr; }
}
.about-value {
  border-top: 2px solid var(--line);
  padding-top: 24px;
}
.about-value__num {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 14px;
}
.about-value h3 {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 400;
  letter-spacing: -0.015em;
  color: var(--ink);
  margin-bottom: 10px;
}
.about-value p {
  font-size: 15px;
  color: var(--ink-2);
  line-height: 1.65;
}

/* ===== Team cards ===== */
.about-team {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 820px;
  margin: 0 auto;
}
@media (max-width: 700px) {
  .about-team { grid-template-columns: 1fr; }
}
.about-team-card {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 28px 24px;
  text-align: center;
}
.about-team-card__icon {
  width: 64px;
  height: 64px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin: 0 auto 16px;
}
.about-team-card h4 {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 400;
  letter-spacing: -0.01em;
  color: var(--ink);
  margin-bottom: 8px;
}
.about-team-card p {
  font-size: 14px;
  color: var(--ink-2);
  line-height: 1.55;
}

/* ===== CTA ===== */
.about-cta {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: var(--ink);
  padding: clamp(40px, 6vw, 80px) clamp(28px, 5vw, 64px);
  text-align: center;
  max-width: 820px;
  margin: 0 auto;
}
.about-cta::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(700px 400px at 50% 120%, color-mix(in oklab, #c4612b 28%, transparent), transparent 60%);
  pointer-events: none;
}
.about-cta__inner { position: relative; z-index: 1; }
.about-cta__label {
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: color-mix(in oklab, var(--bg) 55%, transparent);
  margin-bottom: 16px;
}
.about-cta h3 {
  font-family: var(--font-display);
  font-size: clamp(28px, 3.8vw, 44px);
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.1;
  color: var(--bg);
  margin-bottom: 16px;
}
.about-cta h3 em {
  font-style: italic;
  color: var(--accent);
}
.about-cta p {
  font-size: 16px;
  color: color-mix(in oklab, var(--bg) 70%, transparent);
  line-height: 1.65;
  max-width: 48ch;
  margin: 0 auto 32px;
}
.about-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--accent);
  color: white;
  font-weight: 500;
  font-size: 15px;
  padding: 14px 28px;
  border-radius: 999px;
  text-decoration: none;
  transition: filter 0.15s, transform 0.15s;
  box-shadow: 0 8px 24px -12px var(--accent);
}
.about-cta-btn:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
  color: white;
  text-decoration: none;
}
.about-cta-btn .arrow {
  display: inline-block;
  transition: transform 0.2s;
}
.about-cta-btn:hover .arrow {
  transform: translateX(3px);
}
`;

export default function About(): React.ReactNode {
  return (
    <Layout
      title="About Us — ACT3 AI"
      description="Meet the team behind ACT3 AI — filmmakers, writers, and technologists dedicated to empowering creators everywhere."
    >
      <Head>
        <style>{PAGE_CSS}</style>
      </Head>
      <PageHero
        label="— About Us"
        title={<>The Team Behind<br /><em>ACT 3 AI.</em></>}
        description="We're a passionate team of filmmakers, writers, and technologists dedicated to empowering creators of all backgrounds to bring their visions to life faster and more collaboratively than ever before."
      />

      <div className="about-page">

        {/* Mission */}
        <section className="about-section about-section--paper">
          <div className="about-inner">
            <div className="about-mission">
              <div className="about-mission__copy">
                <div className="about-sec-label" style={{ marginBottom: 16 }}>— Our Mission</div>
                <h2>Built to <em>Empower</em><br />Every Creator</h2>
                <p>
                  To simplify and enrich the video-making process by providing an integrated
                  AI-driven platform that combines scriptwriting, storyboarding, character
                  creation, and video generation in a single, intuitive workspace — for
                  everyone from solo creators to major studios.
                </p>
              </div>
              <div className="about-mission__stat-grid">
                <div className="about-stat-card">
                  <div className="about-stat-card__num">3+</div>
                  <div className="about-stat-card__label">AI Engines</div>
                </div>
                <div className="about-stat-card">
                  <div className="about-stat-card__num">1</div>
                  <div className="about-stat-card__label">Unified Workspace</div>
                </div>
                <div className="about-stat-card">
                  <div className="about-stat-card__num">∞</div>
                  <div className="about-stat-card__label">Creative Possibilities</div>
                </div>
                <div className="about-stat-card">
                  <div className="about-stat-card__num">24/7</div>
                  <div className="about-stat-card__label">AI Collaboration</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Do */}
        <section className="about-section about-section--alt">
          <div className="about-inner">
            <div className="about-sec-head">
              <div className="about-sec-label">— What We Do</div>
              <h2>Everything You Need,<br /><em>Under One Roof</em></h2>
              <p>From screenplay import to final export, ACT 3 AI keeps your entire production workflow in one place.</p>
            </div>
            <div className="about-cards">
              <div className="about-card">
                <div className="about-card__icon">🎬</div>
                <h3>Streamlined Workflow</h3>
                <p>
                  From importing your screenplay to exporting a polished video, ACT 3 AI keeps
                  every step under one roof — no tool switching, no lost context.
                </p>
              </div>
              <div className="about-card">
                <div className="about-card__icon">⚡</div>
                <h3>AI-Enhanced Creativity</h3>
                <p>
                  Leverage powerful AI engines — Google Veo 3, WAN AI, Runway — to generate
                  voice, motion, visuals, and effects with simple, natural-language direction.
                </p>
              </div>
              <div className="about-card">
                <div className="about-card__icon">🤝</div>
                <h3>Collaboration &amp; Control</h3>
                <p>
                  Real-time co-editing, version history, and granular lock-down ensure your
                  team stays in sync and your creative vision stays intact.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="about-section about-section--paper">
          <div className="about-inner">
            <div className="about-sec-head">
              <div className="about-sec-label">— Our Values</div>
              <h2>What We <em>Stand For</em></h2>
            </div>
            <div className="about-values">
              <div className="about-value">
                <div className="about-value__num">01 — Creativity First</div>
                <h3>Technology Serves the Story</h3>
                <p>We believe AI should unlock, not replace, human imagination. Every feature we build starts with the creator's vision.</p>
              </div>
              <div className="about-value">
                <div className="about-value__num">02 — Accessibility</div>
                <h3>Tools for Every Scale</h3>
                <p>Whether you're a solo creator or a large studio, our platform scales to your needs without compromise.</p>
              </div>
              <div className="about-value">
                <div className="about-value__num">03 — Transparency</div>
                <h3>No Hidden Surprises</h3>
                <p>Clear credit estimates, in-app guidance, and open pricing so you can focus on storytelling, not overhead.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="about-section about-section--alt">
          <div className="about-inner">
            <div className="about-sec-head">
              <div className="about-sec-label">— Our Team</div>
              <h2>The People Behind<br /><em>the Platform</em></h2>
              <p>
                A diverse group of filmmakers, writers, and technologists who share a common
                passion for storytelling and innovation — combining decades of experience in
                entertainment, technology, and creative arts.
              </p>
            </div>
            <div className="about-team">
              <div className="about-team-card">
                <div className="about-team-card__icon" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>🎬</div>
                <h4>Filmmakers</h4>
                <p>Industry veterans who understand the creative process from first draft to final cut.</p>
              </div>
              <div className="about-team-card">
                <div className="about-team-card__icon" style={{ background: "var(--bg-3)", color: "var(--ink-2)" }}>⚡</div>
                <h4>Technologists</h4>
                <p>AI and software experts pushing the boundaries of what generative media can do.</p>
              </div>
              <div className="about-team-card">
                <div className="about-team-card__icon" style={{ background: "var(--bg-2)", color: "var(--ink-2)" }}>✍️</div>
                <h4>Creators</h4>
                <p>Artists and writers who live and breathe storytelling and keep us honest about what matters.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="about-section about-section--paper">
          <div className="about-inner">
            <div className="about-cta">
              <div className="about-cta__inner">
                <div className="about-cta__label">— Get Started</div>
                <h3>Let's Create<br /><em>Together.</em></h3>
                <p>
                  Thank you for choosing ACT 3 AI. Let's write the next chapter of
                  storytelling — together.
                </p>
                <Link className="about-cta-btn" to="https://app.act3ai.com/signup/">
                  Start Your Journey <span className="arrow">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}
