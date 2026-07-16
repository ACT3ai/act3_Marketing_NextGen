import React, { useState, useEffect, useRef } from "react";
import Head from "@docusaurus/Head";

const NAV_CSS = `
.snav-root {
  --bg:          #faf8f3;
  --bg-2:        #f3efe5;
  --ink:         #1a1714;
  --ink-2:       #4a4540;
  --accent:      #c4612b;
  --accent-ink:  #ffffff;
  --line:        #e2dccb;
  --maxw:        1200px;
  --pad-x:       clamp(20px, 4vw, 56px);
  --font-display:"Fraunces", "Times New Roman", serif;
  --font-body:   "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
}

.snav {
  font-family: var(--font-body);
  backdrop-filter: blur(0px);
  transition: background .25s ease, border-color .25s ease, backdrop-filter .25s ease;
  background: transparent;
  border-bottom: 1px solid transparent;
}

.snav--solid {
  background: color-mix(in oklab, var(--bg) 88%, transparent);
  border-bottom: 1px solid var(--line);
  backdrop-filter: blur(14px);
}

.snav__inner {
  max-width: var(--maxw);
  margin: 0 auto;
  padding: 18px var(--pad-x);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 24px;
}

/* Logo */
.snav__logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--ink);
}
.snav__logo:hover { text-decoration: none; }
.snav__logo-img {
  height: 32px;
  width: auto;
  display: block;
}

/* Centre links */
.snav__links { display: flex; gap: 8px; justify-self: center; }

.snav__link {
  background: transparent;
  border: 0;
  padding: 8px 14px;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  color: var(--ink-2);
  cursor: pointer;
  text-decoration: none;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  transition: color .15s ease, background .15s ease;
}
.snav__link:hover {
  color: var(--ink);
  background: var(--bg-2);
  text-decoration: none;
}

/* "More" dropdown */
.snav__more { position: relative; }
.snav__more-btn { gap: 5px; }
.snav__caret {
  width: 9px;
  height: 9px;
  transition: transform .15s ease;
}
.snav__more-btn[aria-expanded="true"] .snav__caret { transform: rotate(180deg); }
.snav__more-btn[aria-expanded="true"] { color: var(--ink); background: var(--bg-2); }
.snav__menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  min-width: 190px;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 6px;
  box-shadow: 0 18px 40px -20px rgba(26, 23, 20, 0.35);
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.snav__menu-item {
  display: block;
  padding: 9px 12px;
  border-radius: 6px;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  color: var(--ink-2);
  text-decoration: none;
  transition: color .15s ease, background .15s ease;
}
.snav__menu-item:hover { color: var(--ink); background: var(--bg-2); text-decoration: none; }
.snav__menu-item small {
  display: block;
  font-size: 11.5px;
  font-weight: 400;
  color: var(--ink-2);
  opacity: .7;
  margin-top: 2px;
}

/* Right actions */
.snav__actions { display: flex; gap: 12px; align-items: center; justify-self: end; }

.snav__signin {
  background: transparent;
  border: 0;
  padding: 8px 14px;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  color: var(--ink-2);
  cursor: pointer;
  text-decoration: none;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  transition: color .15s ease, background .15s ease;
}
.snav__signin:hover {
  color: var(--ink);
  background: var(--bg-2);
  text-decoration: none;
}

.snav__cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  border-radius: 999px;
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 13.5px;
  letter-spacing: -0.005em;
  cursor: pointer;
  border: 1px solid transparent;
  text-decoration: none;
  background: var(--accent);
  color: var(--accent-ink);
  box-shadow: 0 8px 24px -12px var(--accent);
  transition: transform .15s ease, filter .15s ease;
  white-space: nowrap;
}
.snav__cta:hover {
  transform: translateY(-1px);
  filter: brightness(1.05);
  text-decoration: none;
  color: var(--accent-ink);
}

@media (max-width: 820px) {
  .snav__links { display: none; }
  .snav__inner { grid-template-columns: 1fr auto; }
}
`;

export default function SiteNavbar(): React.ReactNode {
  const [solid, setSolid] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (): void => setSolid(window.scrollY > 24);
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Escape closes the More menu; so does clicking anywhere outside it.
  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setMoreOpen(false);
    };
    const onClick = (e: MouseEvent): void => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [moreOpen]);

  return (
    <div className="snav-root">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,ital,wght@9..144,0,400;9..144,0,500;9..144,1,400&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <style>{NAV_CSS}</style>
      <header className={`snav${solid ? " snav--solid" : ""}`} id="site-nav">
        <div className="snav__inner">
          <a href="/" className="snav__logo" aria-label="ACT 3 home">
            <img
              src="/img/act3-logo.png"
              alt="ACT 3"
              className="snav__logo-img"
            />
          </a>

          <nav className="snav__links" aria-label="Primary">
            <a className="snav__link" href="/">Main</a>
            <a className="snav__link" href="/about">About Us</a>
            <a className="snav__link" href="/contact">Contact Us</a>
            <a className="snav__link" href="https://app.act3ai.com/settings/plans/">Plans</a>
            <a
              className="snav__link"
              href="https://www.youtube.com/@ACT3AI"
              target="_blank"
              rel="noopener noreferrer"
            >
              Videos
            </a>

            <div className="snav__more" ref={moreRef}>
              <button
                type="button"
                className="snav__link snav__more-btn"
                aria-expanded={moreOpen}
                aria-haspopup="true"
                onClick={() => setMoreOpen((v) => !v)}
              >
                More
                <svg className="snav__caret" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path
                    d="M2 4l3 3 3-3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {moreOpen && (
                <div className="snav__menu" role="menu">
                  <a
                    className="snav__menu-item"
                    role="menuitem"
                    href="/mcp"
                    onClick={() => setMoreOpen(false)}
                  >
                    MCP
                    <small>Drive ACT 3 from Claude Code</small>
                  </a>
                  <a
                    className="snav__menu-item"
                    role="menuitem"
                    href="/cli"
                    onClick={() => setMoreOpen(false)}
                  >
                    CLI
                    <small>Command line interface</small>
                  </a>
                </div>
              )}
            </div>
          </nav>

          <div className="snav__actions">
            <a className="snav__signin" href="https://app.act3ai.com/signin/">Log In</a>
            <a className="snav__cta" href="https://app.act3ai.com/signup/">Get Started</a>
          </div>
        </div>
      </header>
    </div>
  );
}
