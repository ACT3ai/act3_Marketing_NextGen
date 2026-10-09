// /cli — on the v4 template (V4Blocks inside Docusaurus <Layout>).
// The old cream version is frozen at site/pages/backup/cli.tsx (/backup/cli).
import React, { useEffect } from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import { V4Hero, V4Section, V4CtaBand, V4CardGrid, V4Card } from "../components/v4/V4Blocks";

/*
 * The platform detection and clipboard behaviour come from ONE shared script that
 * this page and the /mcp/ page both load from the same URL: /js/download_platform.js
 * (master copy: ~/BGit/all/film/marketing/ACT3_marketing_Home/download_platform.js).
 * It is loaded as an external script on purpose — never inlined and never imported —
 * so the site ships exactly one copy of that code and the browser caches it once.
 *
 * DOM contract with that script (names must match exactly):
 *   data-act3-download-page="cli" on #act3-download-btn (which repo/binary to serve),
 *   #act3-download-label, #act3-clone-cmd, #act3-copy-btn, #act3-copy-tip,
 *   #act3-os-list (filled in on load), and #act3-cli-page (fallback page detection).
 */

const CLONE_COMMAND = "git clone https://github.com/ACT3ai/cli.git";
const JS_URL = "/js/download_platform.js";

// Page-scoped styling for the pieces V4Blocks does not have: the clone command
// box, the download button and the per-OS list. Uses the --v4t-* tokens that
// .v4t-hero / .v4t-section declare. Lives in <Head> (never <style> in the body).
const PAGE_CSS = `
.cli-get { width: 100%; max-width: 720px; margin: 36px auto 0; }
.cli-get__lead { margin: 0 0 16px; font-size: 17px; line-height: 1.5; color: var(--v4t-muted); }
.cli-get__lead strong { color: var(--v4t-ink); font-weight: 700; }

/* The clone command: the preferred path, so it carries the visual weight. */
.cli-clone {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 14px 14px 20px;
  text-align: left;
  background: var(--v4t-raised);
  border: 1px solid var(--v4t-edge);
  border-left: 3px solid var(--v4t-yellow);
  box-shadow: 0 18px 40px -24px rgba(0, 0, 0, 0.8);
}
.cli-clone__prompt { font-family: var(--v4t-mono); font-size: 15px; color: var(--v4t-yellow); user-select: none; }
/* Beats the skin's inline-code chip (border + padding) on this one element. */
.cli-get code.cli-clone__cmd {
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  white-space: nowrap;
  padding: 2px 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  font-family: var(--v4t-mono);
  font-size: 15px;
  line-height: 1.5;
  color: var(--v4t-ink);
  vertical-align: middle;
  user-select: all;
}
.cli-clone__copy {
  position: relative;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--v4t-edge);
  background: transparent;
  color: var(--v4t-muted);
  cursor: pointer;
  transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease;
}
.cli-clone__copy:hover { color: var(--v4t-yellow-hi); border-color: var(--v4t-yellow); background: rgba(238, 188, 60, 0.1); }
.cli-clone__copy:focus-visible { outline: 3px solid var(--v4t-yellow-hi); outline-offset: 3px; }
.cli-clone__copy[data-copied="true"] { color: var(--v4t-yellow-hi); border-color: var(--v4t-yellow); }
.cli-clone__tip {
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  padding: 5px 9px;
  white-space: nowrap;
  font-family: var(--v4t-sans);
  font-size: 12px;
  font-weight: 600;
  background: var(--v4t-panel);
  color: var(--v4t-ink);
  border: 1px solid var(--v4t-edge);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
}
.cli-clone__copy:hover .cli-clone__tip,
.cli-clone__copy:focus-visible .cli-clone__tip,
.cli-clone__copy[data-copied="true"] .cli-clone__tip { opacity: 1; }

/* Download: the less-preferred path, so a ghost button below the clone box. */
.cli-download { margin-top: 24px; }
.cli-download .v4t-ghost { white-space: normal; text-align: center; }
.cli-download__note { margin: 12px 0 0; font-size: 14px; color: var(--v4t-quiet); }

/* Per-OS list (the shared script fills it with <li><a download>). */
.cli-os {
  max-width: 640px;
  margin: 0 auto;
  padding: 6px;
  background: var(--v4t-panel);
  border: 1px solid var(--v4t-line);
  border-radius: 14px;
}
.cli-os ul { list-style: none; margin: 0; padding: 0; }
.cli-os li + li { border-top: 1px solid var(--v4t-line); }
.cli-os a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 15px 18px;
  font-family: var(--v4t-sans);
  font-size: 16px;
  font-weight: 600;
  color: var(--v4t-body);
  text-decoration: none;
  border-radius: 8px;
  transition: color 0.15s ease, background 0.15s ease;
}
.cli-os a::after { content: "↓"; font-family: var(--v4t-mono); color: var(--v4t-quiet); transition: color 0.15s ease, transform 0.15s ease; }
.cli-os a:hover { color: var(--v4t-yellow-hi); background: rgba(255, 255, 255, 0.05); text-decoration: none; }
.cli-os a:hover::after { color: var(--v4t-yellow); transform: translateY(2px); }
.cli-os a:focus-visible { outline: 3px solid var(--v4t-yellow-hi); outline-offset: -3px; }

@media (max-width: 560px) {
  .cli-clone { padding: 10px 10px 10px 14px; gap: 10px; }
  .cli-clone__prompt, .cli-get code.cli-clone__cmd { font-size: 13px; }
  .cli-download .v4t-ghost { font-size: 18px; padding: 12px 20px; }
}
@media (prefers-reduced-motion: reduce) {
  .cli-clone__copy, .cli-clone__tip, .cli-os a, .cli-os a::after { transition: none; }
  .cli-os a:hover::after { transform: none; }
}
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
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${JS_URL}"]`);
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
    // No manual site-name suffix: Docusaurus appends " | ACT 3 AI" itself.
    <Layout
      title="ACT 3 Filmmaking CLI"
      description="The ACT 3 CLI is a command line interface for very advanced users — script your filmmaking, chain commands, and automate whole passes."
    >
      <Head>
        <style>{PAGE_CSS}</style>
        {/* The ONE shared script. The /mcp/ page loads this same URL. */}
        <script src={JS_URL} defer></script>
      </Head>

      <main id="act3-cli-page">
        <V4Hero
          eyebrow="Command Line Interface"
          title="ACT 3 Filmmaking"
          highlight="CLI"
          sub="A command line interface for very advanced users."
          cta={false}
        >
          <div className="cli-get">
            <p className="cli-get__lead">
              <strong>We recommend git clone.</strong> Download works too.
            </p>

            <div className="cli-clone">
              <span className="cli-clone__prompt" aria-hidden="true">$</span>
              <code className="cli-clone__cmd" id="act3-clone-cmd">
                {CLONE_COMMAND}
              </code>
              <button type="button" className="cli-clone__copy" id="act3-copy-btn" aria-label="Copy to clipboard">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.7" />
                  <path d="M5 15V5a2 2 0 0 1 2-2h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
                <span className="cli-clone__tip" id="act3-copy-tip" role="status">
                  Copy to clipboard
                </span>
              </button>
            </div>

            <div className="cli-download">
              {/* The shared script rewrites the label and href on load. */}
              <a className="v4t-ghost" id="act3-download-btn" data-act3-download-page="cli" href="#act3-os-list">
                <span id="act3-download-label">Download</span>
              </a>
              <p className="cli-download__note">Prebuilt binary from the public repo. No build step.</p>
            </div>
          </div>
        </V4Hero>

        <V4Section tone="raised" eyebrow="CLI or MCP" heading="Pick your" highlight="interface.">
          <V4CardGrid columns={2}>
            <V4Card
              eyebrow="Automation"
              title="Built for automation"
              text="Script many commands into one repeatable pass: shots, scenes and renders, no clicking. The same actions as our MCP, from the shell."
            />
            <V4Card
              eyebrow="Recommended"
              title="Most people want the MCP"
              text="Working in Claude Code? Direct ACT 3 in plain language instead of memorising commands. The CLI is for very advanced technical users."
              href="/mcp"
            />
          </V4CardGrid>
        </V4Section>

        <V4Section
          center
          eyebrow="All platforms"
          heading="Download for your"
          highlight="operating system."
          intro="The button above picks this computer's build. For another machine, pick it here."
        >
          {/* The shared script fills this list in on load. */}
          <div className="cli-os">
            <ul id="act3-os-list" />
          </div>
        </V4Section>

        <V4CtaBand />
      </main>
    </Layout>
  );
}
