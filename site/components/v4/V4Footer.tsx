/**
 * V4Footer — the footer of the v4 site template (the default for every page).
 *
 * A copy of the homepage's footer (row 16, .r16v38-foot): the yellow clapper
 * mark + "ACT 3 AI", the tagline, the yellow rounded "Get Started →" button, four
 * link columns with small uppercase headings, a rule, the copyright line and the
 * social icons. Figtree throughout, on the hero ground colour.
 *
 * Rendered by src/theme/Footer on every Docusaurus <Layout> page except
 * /backup/*, and by V4RowsPage when none of its rows brings its own footer.
 * Links come from site/data/siteNav.ts (FOOTER_COLUMNS, SOCIAL); styles are in
 * site/css/v4-template.css (every class here starts with "v4t-").
 *
 * Internal links are @docusaurus/Link (same tab, prefetched); every external
 * link opens in a new tab with rel="noopener noreferrer". The Resources column
 * keeps Articles: this footer is server-rendered on every page and is the
 * inbound link most published articles depend on (CLAUDE.md SEO invariant).
 */
import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import V4Link from "./V4Link";
import { FOOTER_COLUMNS, FOOTER_TAGLINE, SIGNUP, SOCIAL } from "../../data/siteNav";

/** Row 16's logo mark: a film clapperboard, drawn in the accent yellow. */
export function V4ClapperMark({ size = 28 }: { size?: number }): React.JSX.Element {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
      <rect x="3" y="12" width="26" height="17" rx="3" fill="currentColor" />
      <path d="M3.6 10.2 27.4 4.4l.9 3.7L4.5 13.9z" fill="currentColor" />
    </svg>
  );
}

export default function V4Footer(): React.JSX.Element {
  // The build year (customFields.buildYear in docusaurus.config.ts), NOT
  // new Date(): server HTML and browser must render the same text, or React
  // throws away the page's HTML and re-renders it (hydration error #418).
  const { siteConfig } = useDocusaurusContext();
  const year = Number(siteConfig.customFields?.buildYear) || 2026;
  return (
    <footer className="v4t-foot">
      <div className="v4t-foot-in">
        <div className="v4t-foot-top">
          <div className="v4t-foot-brand">
            <V4Link className="v4t-foot-logo" href="/" aria-label="ACT 3 AI home">
              <V4ClapperMark />
              <span>ACT 3 AI</span>
            </V4Link>
            <p>{FOOTER_TAGLINE}</p>
            <a className="v4t-foot-cta" href={SIGNUP}>
              Get Started <span aria-hidden="true">→</span>
            </a>
          </div>
          <nav className="v4t-fnav" aria-label="Footer">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <h3>{col.title}</h3>
                {col.links.map((l) => (
                  <V4Link key={l.label} href={l.href} pending={l.pending} newTab>
                    {l.label}
                  </V4Link>
                ))}
              </div>
            ))}
          </nav>
        </div>
        <div className="v4t-foot-base">
          <p>© {year} ACT 3 AI. All rights reserved.</p>
          <div className="v4t-social">
            {SOCIAL.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`ACT 3 AI on ${s.label}`}>
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path fill="currentColor" d={s.icon} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
