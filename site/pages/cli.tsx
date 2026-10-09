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
 *   #act3-os-list (server-rendered, rebuilt on load), and #act3-cli-page (fallback page detection).
 */

const CLONE_COMMAND = "git clone https://github.com/ACT3ai/cli.git";
const CLONE_SPLIT = CLONE_COMMAND.lastIndexOf("/", CLONE_COMMAND.lastIndexOf("/") - 1) + 1;
const CLONE_HEAD = CLONE_COMMAND.slice(0, CLONE_SPLIT); // "git clone https://github.com/"
const CLONE_TAIL = CLONE_COMMAND.slice(CLONE_SPLIT); // "ACT3ai/cli.git"
const JS_URL = "/js/download_platform.js";

/*
 * The per-OS links, rendered in the HTML so crawlers and no-JS visitors get real
 * binary links. buildOsList() in download_platform.js wipes #act3-os-list and
 * rebuilds these same six on load. MIRRORS PLATFORMS + PAGES.cli in
 * site/static/js/download_platform.js: change both together.
 */
const BIN_BASE = "https://raw.githubusercontent.com/ACT3ai/cli/main/bin/";
const OS_LINKS: { label: string; href: string }[] = [
  { label: "Mac (Apple Silicon)", href: `${BIN_BASE}Mac-Apple_Silicon/act3` },
  { label: "Mac (Intel)", href: `${BIN_BASE}Mac-Intel_CPU/act3` },
  { label: "Windows (x64)", href: `${BIN_BASE}windows-amd64/act3.exe` },
  { label: "Windows (ARM64)", href: `${BIN_BASE}windows-arm64/act3.exe` },
  { label: "Linux (x64)", href: `${BIN_BASE}linux-amd64/act3` },
  { label: "Linux (ARM64)", href: `${BIN_BASE}linux-arm64/act3` },
];

// Page-scoped styling for the pieces V4Blocks does not have: the clone command
// box, the download button and the per-OS list. Kept identical to /mcp's. Uses the --v4t-* tokens that
// .v4t-hero / .v4t-section declare. Lives in <Head> (never <style> in the body).
const PAGE_CSS = `
.cli-get { width: 100%; max-width: 680px; margin-top: 36px; }
/* Same treatment as /mcp (.mcp-get-label): the twin pages read as one design. */
.cli-get-label {
  margin: 0 0 12px;
  font-family: var(--v4t-display);
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--v4t-muted);
}
.cli-clone {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 14px 14px 20px;
  text-align: left;
  background: var(--v4t-panel);
  border: 1px solid var(--v4t-edge);
}
.cli-clone__prompt { font-family: var(--v4t-mono); font-size: 15px; color: var(--v4t-yellow); user-select: none; }
/* Beats the skin's inline-code chip (border + padding) on this one element. */
html code.cli-clone__cmd {
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  white-space: nowrap;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  font-family: var(--v4t-mono);
  font-size: 15px;
  color: var(--v4t-ink);
  vertical-align: middle;
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
  transition: color .15s ease, border-color .15s ease;
}
.cli-clone__copy:hover { color: var(--v4t-yellow-hi); border-color: var(--v4t-yellow); }
.cli-clone__copy:focus-visible { outline: 2px solid var(--v4t-yellow-hi); outline-offset: 3px; }
.cli-clone__copy[data-copied="true"] { color: var(--v4t-yellow); border-color: var(--v4t-yellow); }
.cli-clone__tip {
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  padding: 5px 9px;
  white-space: nowrap;
  font-family: var(--v4t-sans);
  font-size: 12px;
  font-weight: 600;
  background: var(--v4t-ground);
  color: var(--v4t-ink);
  border: 1px solid var(--v4t-edge);
  opacity: 0;
  pointer-events: none;
  transition: opacity .15s ease;
}
.cli-clone__copy:hover .cli-clone__tip,
.cli-clone__copy:focus-visible .cli-clone__tip,
.cli-clone__copy[data-copied="true"] .cli-clone__tip { opacity: 1; }
.cli-dl { margin-top: 24px; display: flex; flex-direction: column; align-items: center; gap: 12px; }
.cli-dl .v4t-cta { white-space: normal; text-align: center; line-height: 1.15; }
/* .v4t-cta styles its span as the arrow glyph; this span is the label. */
.cli-dl .v4t-cta span { font-size: inherit; line-height: inherit; top: 0; }
.cli-dl__note { margin: 0; font-size: 15px; color: var(--v4t-quiet); }

/* Per-OS list: server-rendered links, rebuilt identically by the shared script. */
.cli-os { max-width: 640px; margin: 0 auto; border: 1px solid var(--v4t-line); background: var(--v4t-tray); }
.cli-os ul { list-style: none; margin: 0; padding: 0; }
.cli-os li { margin: 0; }
.cli-os li + li { border-top: 1px solid var(--v4t-line); }
.cli-os a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  font-size: 17px;
  font-weight: 600;
  color: var(--v4t-ink);
  text-decoration: none;
  transition: color .15s ease, background .15s ease;
}
.cli-os a::after { content: "↓"; font-family: var(--v4t-mono); color: var(--v4t-yellow); transition: transform .15s ease; }
.cli-os a:hover { color: var(--v4t-yellow-hi); background: rgba(255, 255, 255, 0.04); text-decoration: none; }
.cli-os a:hover::after { transform: translateY(2px); }
.cli-os a:focus-visible { outline: 2px solid var(--v4t-yellow-hi); outline-offset: -2px; }

@media (max-width: 760px) {
  .cli-clone { padding: 10px 10px 10px 14px; gap: 10px; }
  .cli-clone__prompt, html code.cli-clone__cmd { font-size: 13px; }
  /* Show the whole command on phones: wrap it instead of hiding the tail. */
  html code.cli-clone__cmd { white-space: normal; overflow-wrap: anywhere; line-height: 1.5; }
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
      description="The ACT 3 CLI for very advanced users. Chain commands and script whole passes of shots, scenes and renders."
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
          sub="For very advanced users."
          cta={false}
        >
          <div className="cli-get">
            <p className="cli-get-label">Git clone it (recommended)</p>

            <div className="cli-clone">
              <span className="cli-clone__prompt" aria-hidden="true">$</span>
              <code className="cli-clone__cmd" id="act3-clone-cmd">
                {/* <wbr> adds a line-break point for phones; textContent (what the
                    copy button copies) stays exactly CLONE_COMMAND. */}
                {CLONE_HEAD}
                <wbr />
                {CLONE_TAIL}
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

            <div className="cli-dl">
              {/* The shared script rewrites the label and href on load. */}
              <a className="v4t-cta" id="act3-download-btn" data-act3-download-page="cli" href="#act3-os-list">
                <span id="act3-download-label">Download</span>
              </a>
              <p className="cli-dl__note">Or download the prebuilt binary. No build step.</p>
            </div>
          </div>
        </V4Hero>

        <V4Section tone="raised" heading="Pick your" highlight="interface.">
          <V4CardGrid columns={2}>
            <V4Card
              title="Built for automation"
              text="Script many commands into one repeatable pass: shots, scenes and renders, no clicking. The same actions as our MCP, from the shell."
            />
            <V4Card
              eyebrow="Recommended"
              title="Use the MCP"
              text="Working in Claude Code, Codex or Claude Desktop? Direct ACT 3 in plain language."
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
          {/* Server-rendered; the shared script rebuilds the same list on load. */}
          <div className="cli-os">
            <ul id="act3-os-list">
              {OS_LINKS.map((o) => (
                <li key={o.label}>
                  <a href={o.href} download>
                    {o.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </V4Section>

        <V4CtaBand />
      </main>
    </Layout>
  );
}
