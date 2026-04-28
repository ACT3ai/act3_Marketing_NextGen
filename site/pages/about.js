"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = About;
var react_1 = require("react");
var Layout_1 = require("@theme/Layout");
var Link_1 = require("@docusaurus/Link");
var SECTION_CSS = "\n.about-page { font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif; color: #131625; }\n.about-hero { background: #fff8f8; padding: 80px 24px; text-align: center; border-bottom: 1px solid #e8e8e8; }\n.about-hero h1 { font-size: clamp(2.2rem, 4vw, 3.2rem); font-weight: 700; margin: 0 0 24px; line-height: 1.2; }\n.about-hero p { font-size: 1.05rem; color: #384155; line-height: 1.7; max-width: 820px; margin: 0 auto; }\n.about-section { padding: 72px 24px; }\n.about-section--alt { background: #f4f6fa; }\n.about-section--white { background: #fff; }\n.about-inner { max-width: 1100px; margin: 0 auto; }\n.about-section-head { text-align: center; margin-bottom: 52px; }\n.about-section-icon { width: 64px; height: 64px; background: #c4612b; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; margin: 0 auto 20px; }\n.about-section-head h2 { font-size: 2rem; font-weight: 700; margin: 0 0 16px; line-height: 1.2; }\n.about-section-head p { font-size: 1rem; color: #384155; line-height: 1.7; max-width: 720px; margin: 0 auto; }\n.about-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }\n@media (max-width: 820px) { .about-cards { grid-template-columns: 1fr; } }\n.about-card { background: white; border-radius: 14px; padding: 36px 28px; box-shadow: 0 6px 18px rgba(0,0,0,0.07); }\n.about-card--value { text-align: center; background: transparent; box-shadow: none; padding: 24px 16px; }\n.about-card h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 14px; line-height: 1.2; }\n.about-card p { font-size: 1rem; color: #384155; line-height: 1.65; margin: 0; }\n.about-value-icon { width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; margin: 0 auto 16px; }\n.about-team-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; max-width: 760px; margin: 0 auto; }\n@media (max-width: 700px) { .about-team-cards { grid-template-columns: 1fr; } }\n.about-team-card { text-align: center; }\n.about-team-icon { width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 36px; margin: 0 auto 16px; }\n.about-team-card h4 { font-size: 1rem; font-weight: 700; margin: 0 0 8px; }\n.about-team-card p { font-size: 0.88rem; color: #384155; margin: 0; line-height: 1.5; }\n.about-cta-box { background: white; border-radius: 14px; box-shadow: 0 6px 18px rgba(0,0,0,0.07); padding: 64px 48px; max-width: 820px; margin: 0 auto; text-align: center; }\n.about-cta-box h3 { font-size: 2rem; font-weight: 700; margin: 0 0 20px; }\n.about-cta-box p { font-size: 1rem; color: #384155; line-height: 1.7; max-width: 560px; margin: 0 auto 32px; }\n.about-btn { display: inline-flex; align-items: center; gap: 8px; background: #c4612b; color: white; font-weight: 600; font-size: 1rem; padding: 14px 32px; border-radius: 8px; text-decoration: none; transition: background 0.15s; }\n.about-btn:hover { background: #a85024; color: white; text-decoration: none; }\n";
function About() {
    return (<Layout_1.default title="About Us — ACT3 AI" description="Meet the team behind ACT3 AI — filmmakers, writers, and technologists dedicated to empowering creators everywhere.">
      <style>{SECTION_CSS}</style>
      <div className="about-page">

        {/* Hero */}
        <section className="about-hero">
          <h1>About Us</h1>
          <p>
            Welcome to ACT 3 AI — where storytelling meets cutting-edge artificial intelligence.
            We're a passionate team of filmmakers, writers, and technologists dedicated to empowering
            creators of all backgrounds to bring their visions to life faster and more collaboratively
            than ever before.
          </p>
        </section>

        {/* Mission */}
        <section className="about-section about-section--white">
          <div className="about-inner">
            <div className="about-section-head">
              <div className="about-section-icon">🎯</div>
              <h2>Our Mission</h2>
              <p>
                To simplify and enrich the video-making process by providing an integrated AI-driven
                platform that combines scriptwriting, storyboarding, character creation, and video
                generation in a single, intuitive workspace.
              </p>
            </div>
          </div>
        </section>

        {/* What We Do */}
        <section className="about-section about-section--alt">
          <div className="about-inner">
            <div className="about-section-head">
              <div className="about-section-icon">⚡</div>
              <h2>What We Do</h2>
            </div>
            <div className="about-cards">
              <div className="about-card">
                <h3>Streamlined Workflow</h3>
                <p>
                  From importing your screenplay to exporting a polished video, ACT 3 AI keeps
                  every step under one roof — no tool switching, no lost context.
                </p>
              </div>
              <div className="about-card">
                <h3>AI-Enhanced Creativity</h3>
                <p>
                  Leverage powerful AI engines — Google Veo 3, WAN AI, Runway — to generate voice,
                  motion, visuals, and effects with simple, natural-language direction.
                </p>
              </div>
              <div className="about-card">
                <h3>Collaboration &amp; Control</h3>
                <p>
                  Real-time co-editing, version history, and granular lock-down ensure your team
                  stays in sync and your creative vision stays intact.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="about-section about-section--white">
          <div className="about-inner">
            <div className="about-section-head">
              <div className="about-section-icon">👥</div>
              <h2>Our Values</h2>
            </div>
            <div className="about-cards">
              <div className="about-card about-card--value">
                <div className="about-value-icon" style={{ background: "#c4612b" }}>❤️</div>
                <h3>Creativity First</h3>
                <p>We believe technology should unlock, not replace, human imagination.</p>
              </div>
              <div className="about-card about-card--value">
                <div className="about-value-icon" style={{ background: "#00c2b2" }}>🌐</div>
                <h3>Accessibility</h3>
                <p>Whether you're a solo creator or a large studio, our platform scales to your needs.</p>
              </div>
              <div className="about-card about-card--value">
                <div className="about-value-icon" style={{ background: "#1e2534" }}>👁️</div>
                <h3>Transparency</h3>
                <p>Clear credit estimates, in-app guidance, and open pricing so you can focus on storytelling.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="about-section about-section--alt">
          <div className="about-inner">
            <div className="about-section-head">
              <h2>Our Team</h2>
              <p>
                We're a diverse group of filmmakers, writers, and technologists who share a common
                passion for storytelling and innovation. Our team combines decades of experience in
                entertainment, technology, and creative arts to build tools that truly serve creators.
              </p>
            </div>
            <div className="about-team-cards">
              <div className="about-team-card">
                <div className="about-team-icon" style={{ background: "#c4612b" }}>🎬</div>
                <h4>Filmmakers</h4>
                <p>Industry veterans who understand the creative process</p>
              </div>
              <div className="about-team-card">
                <div className="about-team-icon" style={{ background: "#00c2b2" }}>⚡</div>
                <h4>Technologists</h4>
                <p>AI and software experts pushing the boundaries of what's possible</p>
              </div>
              <div className="about-team-card">
                <div className="about-team-icon" style={{ background: "#1e2534" }}>✍️</div>
                <h4>Creators</h4>
                <p>Artists and writers who live and breathe storytelling</p>
              </div>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="about-section about-section--white">
          <div className="about-inner">
            <div className="about-cta-box">
              <h3>Let's Create Together</h3>
              <p>
                Thank you for choosing ACT 3 AI. Let's create the next chapter of storytelling — together.
              </p>
              <Link_1.default className="about-btn" to="https://act3ai.com">
                Start Your Journey →
              </Link_1.default>
            </div>
          </div>
        </section>

      </div>
    </Layout_1.default>);
}
