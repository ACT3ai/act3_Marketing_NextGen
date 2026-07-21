import React, { useEffect } from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import PageHero from "../components/PageHero";

/*
 * The /cli/ page.
 *
 * The platform detection and clipboard behaviour come from ONE shared script that
 * this page and the /mcp/ page both load from the same URL: /js/download_platform.js
 * (master copy: ~/BGit/all/film/marketing/ACT3_marketing_Home/download_platform.js).
 * It is loaded as an external script on purpose — never inlined and never imported —
 * so the site ships exactly one copy of that code and the browser caches it once.
 *
 * data-act3-download-page="cli" on the download button is what tells the shared
 * script which repo and binary it is serving.
 */

const CLONE_COMMAND = "git clone https://github.com/ACT3ai/cli.git";
const JS_URL = "/js/download_platform.js";

const PAGE_CSS = `
.cli-page {
  --bg: #faf8f3;
  --bg-2: #f3efe5;
  --ink: #1a1714;
  --ink-2: #4a4540;
  --ink-3: #837c72;
  --line: #e2dccb;
  --accent: #c4612b;
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
.cli-page *, .cli-page *::before, .cli-page *::after { box-sizing: border-box; }
.cli-page h2, .cli-page h3 { margin: 0; }
.cli-page p { margin: 0; }

.cli-section { padding: clamp(56px, 7vw, 96px) var(--pad-x); }
.cli-section--paper { background: var(--paper); }
.cli-section--alt { background: var(--bg-2); }
.cli-inner { max-width: var(--maxw); margin: 0 auto; }

/* ===== Get-it block: clone first, download second ===== */
.cli-get {
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
}
.cli-get__lead {
  font-size: 17px;
  color: var(--ink-2);
  line-height: 1.65;
  margin-bottom: 28px;
}
.cli-get__lead strong { color: var(--ink); font-weight: 600; }

/* Clone command — the preferred path, so it carries the visual weight. */
.cli-clone {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--ink);
  border-radius: var(--radius-lg);
  padding: 18px 18px 18px 22px;
  text-align: left;
  box-shadow: 0 18px 40px -24px rgba(26, 23, 20, 0.7);
}
.cli-clone__prompt {
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--accent);
  user-select: none;
}
/* Docusaurus/Infima styles bare <code> with a light background + border, which
   would put this near-white text on a near-white box. Neutralise that here. */
.cli-page code.cli-clone__cmd {
  font-family: var(--font-mono);
  font-size: 14px;
  color: #faf8f3;
  background: transparent;
  border: 0;
  border-radius: 0;
  padding: 0;
  vertical-align: middle;
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  white-space: nowrap;
  letter-spacing: -0.01em;
}
.cli-clone__copy {
  position: relative;
  flex: none;
  width: 36px;
  height: 36px;
  border-radius: var(--radius);
  border: 1px solid rgba(250, 248, 243, 0.18);
  background: transparent;
  color: rgba(250, 248, 243, 0.72);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: color .15s ease, border-color .15s ease, background .15s ease;
}
.cli-clone__copy:hover {
  color: #faf8f3;
  border-color: var(--accent);
  background: rgba(196, 97, 43, 0.18);
}
.cli-clone__copy[data-copied="true"] { color: var(--accent); border-color: var(--accent); }
.cli-clone__tip {
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  white-space: nowrap;
  font-family: var(--font-body);
  font-size: 11.5px;
  font-weight: 500;
  padding: 5px 9px;
  border-radius: 6px;
  background: var(--ink);
  color: #faf8f3;
  border: 1px solid rgba(250, 248, 243, 0.18);
  opacity: 0;
  pointer-events: none;
  transition: opacity .15s ease;
}
.cli-clone__copy:hover .cli-clone__tip,
.cli-clone__copy:focus-visible .cli-clone__tip,
.cli-clone__copy[data-copied="true"] .cli-clone__tip { opacity: 1; }

/* Download — the less-preferred path. Below the clone block, quieter. */
.cli-download { margin-top: 26px; }
.cli-download__btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--accent);
  color: #fff;
  font-weight: 500;
  font-size: 15px;
  padding: 13px 26px;
  border-radius: 999px;
  text-decoration: none;
  box-shadow: 0 8px 24px -12px var(--accent);
  transition: filter .15s ease, transform .15s ease;
}
.cli-download__btn:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
  color: #fff;
  text-decoration: none;
}
.cli-download__note {
  font-size: 13px;
  color: var(--ink-3);
  margin-top: 12px;
}

/* ===== Panels ===== */
.cli-panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
@media (max-width: 820px) { .cli-panels { grid-template-columns: 1fr; } }
.cli-panel {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 34px 30px;
}
.cli-panel--accent {
  background: var(--accent-soft);
  border-color: color-mix(in oklab, var(--accent) 30%, transparent);
}
.cli-panel__label {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 14px;
}
.cli-panel h3 {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 400;
  letter-spacing: -0.015em;
  color: var(--ink);
  margin-bottom: 12px;
}
.cli-panel h3 em { font-style: italic; color: var(--accent); }
.cli-panel p {
  font-size: 15.5px;
  color: var(--ink-2);
  line-height: 1.7;
}
.cli-panel__link {
  display: inline-block;
  margin-top: 16px;
  font-size: 14.5px;
  font-weight: 500;
  color: var(--accent);
  text-decoration: none;
}
.cli-panel__link:hover { color: var(--accent); text-decoration: underline; }

/* ===== Section head ===== */
.cli-sec-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 14px;
  margin-bottom: 44px;
}
.cli-sec-label {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent);
}
.cli-sec-head h2 {
  font-family: var(--font-display);
  font-size: clamp(30px, 3.8vw, 46px);
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.1;
  color: var(--ink);
}
.cli-sec-head h2 em { font-style: italic; color: var(--accent); }
.cli-sec-head p {
  font-size: 16px;
  color: var(--ink-2);
  line-height: 1.65;
  max-width: 56ch;
}

/* ===== Per-OS download list ===== */
.cli-os {
  max-width: 640px;
  margin: 0 auto;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 12px 8px;
}
.cli-os ul { list-style: none; padding: 0; margin: 0; }
.cli-os li + li { border-top: 1px solid var(--line); }
.cli-os a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 15px 18px;
  font-size: 15px;
  font-weight: 500;
  color: var(--ink-2);
  text-decoration: none;
  border-radius: var(--radius);
  transition: color .15s ease, background .15s ease;
}
.cli-os a::after {
  content: "↓";
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--ink-3);
  transition: color .15s ease, transform .15s ease;
}
.cli-os a:hover { color: var(--accent); background: var(--bg-2); text-decoration: none; }
.cli-os a:hover::after { color: var(--accent); transform: translateY(2px); }
`;

export default function Cli(): React.ReactNode {
  useEffect(() => {
    const start = (): void => {
      const api = (window as any).ACT3DownloadPlatform;
      if (api && typeof api.init === "function") api.init();
    };
    // The <script> is declared in <Head> below. It may or may not have finished
    // loading by the time this effect runs, so handle both orders.
    if ((window as any).ACT3DownloadPlatform) {
      start();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${JS_URL}"]`
    );
    if (existing) {
      existing.addEventListener("load", start);
      return () => existing.removeEventListener("load", start);
    }
    // Last resort: the Head tag never landed. Still exactly one URL, one file.
    const s = document.createElement("script");
    s.src = JS_URL;
    s.onload = start;
    document.body.appendChild(s);
  }, []);

  return (
    <Layout
      title="ACT 3 Filmmaking CLI — ACT3 AI"
      description="The ACT 3 CLI is a command line interface for very advanced users — script your filmmaking, chain commands, and automate whole passes."
    >
      <Head>
        <style>{PAGE_CSS}</style>
        {/* The ONE shared script. The /mcp/ page loads this same URL. */}
        <script src={JS_URL} defer></script>
      </Head>

      <PageHero
        label="— Command Line Interface"
        title={<>ACT 3 Filmmaking <em>CLI.</em></>}
        description="The CLI is a command line user interface for very advanced users."
      />

      <div className="cli-page" id="act3-cli-page">

        {/* Get it — clone first, download second */}
        <section className="cli-section cli-section--paper">
          <div className="cli-inner">
            <div className="cli-get">
              <p className="cli-get__lead">
                <strong>We recommend you git clone it</strong>, but you can download it
                if you want to.
              </p>

              <div className="cli-clone">
                <span className="cli-clone__prompt" aria-hidden="true">$</span>
                <code className="cli-clone__cmd" id="act3-clone-cmd">
                  {CLONE_COMMAND}
                </code>
                <button
                  type="button"
                  className="cli-clone__copy"
                  id="act3-copy-btn"
                  aria-label="Copy to clipboard"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.7" />
                    <path
                      d="M5 15V5a2 2 0 0 1 2-2h10"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="cli-clone__tip" id="act3-copy-tip" role="status">
                    Copy to clipboard
                  </span>
                </button>
              </div>

              <div className="cli-download">
                {/* The shared script rewrites the label and href on load. */}
                <a
                  className="cli-download__btn"
                  id="act3-download-btn"
                  data-act3-download-page="cli"
                  href="#act3-os-list"
                >
                  <span id="act3-download-label">Download</span>
                </a>
                <p className="cli-download__note">
                  Prebuilt binary, straight from the public repo. No build step.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Panels */}
        <section className="cli-section cli-section--alt">
          <div className="cli-inner">
            <div className="cli-panels">
              <div className="cli-panel">
                <div className="cli-panel__label">— Automation</div>
                <h3>Built for <em>Automation</em></h3>
                <p>
                  The CLI is good for automation. You can create scripts that'll do a
                  number of commands — chaining shots, scenes, and renders into one
                  repeatable pass instead of clicking through them by hand.
                </p>
              </div>
              <div className="cli-panel cli-panel--accent">
                <div className="cli-panel__label">— Recommended</div>
                <h3>Most people want the <em>MCP</em></h3>
                <p>
                  We also have an MCP, and it's what we recommend if you're working in
                  Claude Code — you direct ACT 3 in plain language instead of memorising
                  commands. The CLI is here for the very advanced technical users who
                  want the terminal.
                </p>
                <a className="cli-panel__link" href="/mcp">
                  See the MCP →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Per-OS downloads */}
        <section className="cli-section cli-section--paper">
          <div className="cli-inner">
            <div className="cli-sec-head">
              <div className="cli-sec-label">— All Platforms</div>
              <h2>Download based on your <em>operating system</em></h2>
              <p>
                The button above picks the build for the computer you're on right now.
                Grab any of these instead if you're downloading for a different machine.
              </p>
            </div>
            {/* The shared script fills this list in on load. */}
            <div className="cli-os">
              <ul id="act3-os-list" />
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}
