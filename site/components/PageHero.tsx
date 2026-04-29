import React from "react";
import Head from "@docusaurus/Head";

const HERO_CSS = `
.page-hero {
  --bg: #faf8f3;
  --ink: #1a1714;
  --ink-2: #4a4540;
  --ink-3: #837c72;
  --line: #e2dccb;
  --accent: #c4612b;
  --pad-x: clamp(20px, 4vw, 56px);
  --font-display: "Fraunces", "Times New Roman", serif;
  --font-body: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;
  background: var(--bg);
  padding: clamp(64px, 8vw, 100px) var(--pad-x) clamp(56px, 7vw, 88px);
  text-align: center;
  border-bottom: 1px solid var(--line);
  position: relative;
  overflow: hidden;
}
.page-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(900px 400px at 80% -10%, color-mix(in oklab, #c4612b 10%, transparent), transparent 60%),
    radial-gradient(700px 350px at 0% 100%, color-mix(in oklab, #c4612b 6%, transparent), transparent 60%);
  pointer-events: none;
}
.page-hero__inner {
  position: relative;
  z-index: 1;
}
.page-hero__label {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 20px;
}
.page-hero h1 {
  font-family: var(--font-display);
  font-size: clamp(44px, 6vw, 80px);
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.05;
  color: var(--ink);
  margin: 0 0 20px;
}
.page-hero h1 em {
  font-style: italic;
  color: var(--accent);
}
.page-hero__desc {
  font-family: var(--font-body);
  font-size: clamp(16px, 1.8vw, 19px);
  color: var(--ink-2);
  line-height: 1.6;
  max-width: 56ch;
  margin: 0 auto;
}
`;

type PageHeroProps = {
  label?: string;
  title: React.ReactNode;
  description?: string;
};

export default function PageHero({ label, title, description }: PageHeroProps): React.ReactNode {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,ital,wght@9..144,0,300;9..144,0,400;9..144,0,500;9..144,1,300;9..144,1,400;9..144,1,500&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <style>{HERO_CSS}</style>
      </Head>
      <section className="page-hero">
        <div className="page-hero__inner">
          {label && <div className="page-hero__label">{label}</div>}
          <h1>{title}</h1>
          {description && <p className="page-hero__desc">{description}</p>}
        </div>
      </section>
    </>
  );
}
