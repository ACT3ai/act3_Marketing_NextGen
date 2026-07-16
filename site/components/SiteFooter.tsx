import React from "react";

const FOOTER_CSS = `
.sf-root {
  --bg: #faf8f3;
  --bg-2: #f3efe5;
  --ink: #1a1714;
  --ink-2: #4a4540;
  --ink-3: #837c72;
  --line: #e2dccb;
  --accent: #c4612b;
  --accent-ink: #ffffff;
  --font-body: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --maxw: 1200px;
  --pad-x: clamp(20px, 4vw, 56px);
}
.sf-root { background: var(--bg); color: var(--ink); font-family: var(--font-body); }
.sf-wrap { max-width: var(--maxw); margin: 0 auto; padding: 0 var(--pad-x); }
.sf-footer { padding: 80px 0 40px; border-top: 1px solid var(--line); }
.sf-footer__top { display: grid; grid-template-columns: 1.2fr 2.4fr; gap: clamp(32px,5vw,80px); }
.sf-footer__brand .sf-logo { display: inline-flex; align-items: center; gap: 8px; text-decoration: none; color: var(--ink); }
.sf-footer__brand .sf-logo__word { display: block; font-size: 22px; font-weight: 700; letter-spacing: -0.01em; line-height: 30px; color: var(--ink); }
.sf-footer__tag { color: var(--ink-2); margin: 18px 0 22px; max-width: 30ch; font-size: 14px; line-height: 1.55; }
.sf-btn { display: inline-flex; align-items: center; gap: 6px; background: var(--accent); color: var(--accent-ink); font-weight: 600; font-size: 14px; padding: 10px 20px; border-radius: 6px; text-decoration: none; transition: background .15s ease; }
.sf-btn:hover { background: #a85024; color: var(--accent-ink); text-decoration: none; }
.sf-footer__cols { display: grid; grid-template-columns: repeat(4,1fr); gap: 24px; }
.sf-footer__col-head { font-size: 13px; font-weight: 500; color: var(--ink); margin-bottom: 14px; letter-spacing: -0.005em; }
.sf-footer__col ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
.sf-footer__col a { color: var(--ink-2); text-decoration: none; font-size: 14px; transition: color .15s ease; }
.sf-footer__col a:hover { color: var(--accent); }
.sf-footer__bot { display: flex; align-items: center; justify-content: space-between; margin-top: 64px; padding-top: 24px; border-top: 1px solid var(--line); font-size: 13px; color: var(--ink-3); }
.sf-footer__social { display: flex; gap: 6px; }
.sf-footer__social a { width: 36px; height: 36px; border-radius: 999px; border: 1px solid var(--line); display: inline-flex; align-items: center; justify-content: center; color: var(--ink-2); transition: color .15s ease, border-color .15s ease, background .15s ease; }
.sf-footer__social a:hover { color: var(--accent); border-color: var(--accent); background: var(--bg-2); }
@media (max-width: 900px) {
  .sf-footer__top { grid-template-columns: 1fr; }
  .sf-footer__cols { grid-template-columns: 1fr 1fr; }
}
`;

export default function SiteFooter(): React.ReactNode {
  return (
    <div className="sf-root">
      <style>{FOOTER_CSS}</style>
      <footer className="sf-footer">
        <div className="sf-wrap">
          <div className="sf-footer__top">
            <div className="sf-footer__brand">
              <a href="/" className="sf-logo" aria-label="ACT 3 AI home">
                <span className="sf-logo__word">ACT 3 AI</span>
              </a>
              <p className="sf-footer__tag">Create movies at the speed of storytelling.</p>
              <a className="sf-btn" href="https://app.act3ai.com/signup/">Get Started →</a>
            </div>
            <div className="sf-footer__cols">
              <div className="sf-footer__col">
                <div className="sf-footer__col-head">Product</div>
                <ul>
                  <li><a href="https://app.act3ai.com/settings/plans/">Pricing</a></li>
                </ul>
              </div>
              <div className="sf-footer__col">
                <div className="sf-footer__col-head">Company</div>
                <ul>
                  <li><a href="/about">About</a></li>
                  <li><a href="/contact">Contact</a></li>
                </ul>
              </div>
              <div className="sf-footer__col">
                <div className="sf-footer__col-head">Resources</div>
                <ul>
                  <li><a href="https://documentation.act3ai.com/">Documentation</a></li>
                  <li><a href="/mcp">MCP (Model Context Protocol)</a></li>
                </ul>
              </div>
              <div className="sf-footer__col">
                <div className="sf-footer__col-head">Legal</div>
                <ul>
                  <li><a href="https://legal.act3ai.com/docs/privacy-policy#welcome">Privacy Policy</a></li>
                  <li><a href="https://legal.act3ai.com/docs/terms-of-service/">Terms of Service</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="sf-footer__bot">
            <div>© 2026 ACT 3 AI. All rights reserved.</div>
            <div className="sf-footer__social">
              <a href="https://x.com/act3ai" aria-label="X / Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 4l16 16M20 4L4 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </a>
              <a href="https://www.youtube.com/@ACT3AI" aria-label="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M3 7c0-1.5 1-2 2-2h14c1 0 2 .5 2 2v10c0 1.5-1 2-2 2H5c-1 0-2-.5-2-2V7zm7 1.5v7l6-3.5-6-3.5z" fill="currentColor"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/act3ai/" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M7 10v7M7 7v.01M11 10v7M11 13c0-2 1.5-3 3-3s3 1 3 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
