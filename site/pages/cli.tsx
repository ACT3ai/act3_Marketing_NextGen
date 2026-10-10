// /cli — on the v4 template (V4Blocks inside Docusaurus <Layout>).
// The old cream version is frozen at site/pages/backup/cli.tsx (/backup/cli).
import React, { useEffect } from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import { V4Hero, V4Section, V4CardGrid, V4Card } from "../components/v4/V4Blocks";

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
 *
 * TWIN PAGE: site/pages/mcp.tsx. The clone/download block (PAGE_CSS from .cli-get
 * through the .cli-os list, plus the 760px and reduced-motion rules) must stay
 * IDENTICAL to /mcp's .mcp-* block, prefix aside. Change one, change both.
 */

const CLONE_COMMAND = "git clone https://github.com/ACT3ai/cli.git";
// <wbr> break points (after "github.com/" and "ACT3ai/") for phones. textContent,
// which the shared script copies, stays exactly CLONE_COMMAND.
const CLONE_PARTS = CLONE_COMMAND.replace(/\/(?=ACT3ai\/|cli\.git)/g, "/\n").split("\n");
const JS_URL = "/js/download_platform.js";

/*
 * The per-OS links, in the server-rendered HTML so crawlers and no-JS readers get
 * real binary links. MIRRORS PLATFORMS + PAGES.cli in download_platform.js, and is
 * the exact markup its buildOsList() writes (<li><a href download>label</a></li>);
 * change both together.
 *
 * Why dangerouslySetInnerHTML and not JSX <li> children: buildOsList() does
 * list.innerHTML = "" and rebuilds the six links on load. It never appends to an
 * existing list, so there are no duplicates either way, but with JSX children React
 * would still own <li> nodes the script has thrown away. As an innerHTML string,
 * React owns only the <ul>; the script's identical rebuild touches nothing React
 * tracks, and React never rewrites it (the string is a constant).
 */
const REPO = "ACT3ai/cli";
const BINARY = "act3";
const OS_PLATFORMS: { id: string; label: string; windows?: boolean }[] = [
  { id: "Mac-Apple_Silicon", label: "Mac (Apple Silicon)" },
  { id: "Mac-Intel_CPU", label: "Mac (Intel)" },
  { id: "windows-amd64", label: "Windows (x64)", windows: true },
  { id: "windows-arm64", label: "Windows (ARM64)", windows: true },
  { id: "linux-amd64", label: "Linux (x64)" },
  { id: "linux-arm64", label: "Linux (ARM64)" },
];
const OS_LIST_HTML = OS_PLATFORMS.map(
  (p) =>
    `<li><a href="https://raw.githubusercontent.com/${REPO}/main/bin/${p.id}/${BINARY}${p.windows ? ".exe" : ""}" download="">${p.label}</a></li>`,
).join("");

/* Page-scoped: the clone box, the copy button and the per-OS list. The rest is V4Blocks.
 * IDENTICAL to /mcp's PAGE_CSS clone/download/OS-list rules (prefix aside); keep them in step.
 * Lives in <Head> (never <style> in the body). */
const PAGE_CSS = `
.cli-get { width: 100%; max-width: 720px; margin: 36px auto 0; }
/* Same lead, clone box and ghost download as /mcp (identical CSS), so the two pages match. */
.cli-get__lead { margin: 0 0 16px; font-size: 17px; line-height: 1.5; color: var(--v4t-muted); text-wrap: balance; }
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
.cli-clone__prompt { font-family: var(--v4t-mono); font-size: 15px; line-height: 1.5; padding: 2px 0; color: var(--v4t-yellow); user-select: none; }
html code.cli-clone__cmd {
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
  transition: color .15s ease, border-color .15s ease, background .15s ease;
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
  transition: opacity .15s ease;
}
.cli-clone__copy:hover .cli-clone__tip,
.cli-clone__copy:focus-visible .cli-clone__tip,
.cli-clone__copy[data-copied="true"] .cli-clone__tip { opacity: 1; }
/* Download: the less-preferred path, so a ghost button below the clone box. */
.cli-dl { margin-top: 24px; }
.cli-dl .v4t-ghost { white-space: normal; text-align: center; }
.cli-dl__note { margin: 12px 0 0; font-size: 14px; color: var(--v4t-quiet); }

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
  /* The command wraps here, so pin the "$" to its first line, not the middle. */
  .cli-clone { align-items: flex-start; padding: 10px 10px 10px 14px; gap: 10px; }
  .cli-clone__copy { align-self: center; }
  .cli-clone__prompt, html code.cli-clone__cmd { font-size: 13px; }
  /* Break only at the <wbr> points (after the slashes), never mid-word. */
  html code.cli-clone__cmd { white-space: normal; overflow-wrap: break-word; }
  /* Open the tooltip to the left, over the command, not over the lead line above. */
  .cli-clone__tip { bottom: auto; top: 50%; right: calc(100% + 8px); transform: translateY(-50%); }
  .cli-dl .v4t-ghost { font-size: 18px; padding: 12px 20px; }
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
            <p className="cli-get__lead">
              <strong>We recommend git clone.</strong> Download works too.
            </p>
            <div className="cli-clone">
              <span className="cli-clone__prompt" aria-hidden="true">$</span>
              <code className="cli-clone__cmd" id="act3-clone-cmd">
                {CLONE_PARTS.map((part, i) => (
                  <React.Fragment key={part}>
                    {i > 0 && <wbr />}
                    {part}
                  </React.Fragment>
                ))}
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
              <a className="v4t-ghost" id="act3-download-btn" data-act3-download-page="cli" href="#act3-os-list">
                <span id="act3-download-label">Download</span>
              </a>
              <p className="cli-dl__note" id="act3-download-note">Just the binary, from the same public repo.</p>
            </div>
          </div>
        </V4Hero>

        <V4Section tone="raised" eyebrow="Two ways in" heading="Pick your" highlight="interface.">
          <V4CardGrid columns={2}>
            <V4Card
              eyebrow="Scripting"
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
          intro={<span id="act3-os-note">The button above picks this computer's build. For another machine, pick it here.</span>}
        >
          {/* Server-rendered; the shared script rebuilds the same six links on load. */}
          <div className="cli-os">
            <ul id="act3-os-list" dangerouslySetInnerHTML={{ __html: OS_LIST_HTML }} />
          </div>
        </V4Section>
      </main>
    </Layout>
  );
}
