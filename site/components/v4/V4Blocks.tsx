/**
 * V4Blocks — building blocks for pages on the v4 site template.
 *
 * Use these for every new page (or V4RowsPage for pages made of homepage rows).
 * They are wrapped by the normal Docusaurus <Layout>, which already renders the
 * template header (V4Header) and footer (V4Footer). Layout has no <main>, so
 * the page wraps its blocks in ONE <main> (the landmark the skip link targets):
 *
 *   import Layout from "@theme/Layout";
 *   import { V4Hero, V4Section, V4CardGrid, V4Card, V4CtaBand } from "@site/site/components/v4/V4Blocks";
 *
 *   <Layout title="About us" description="...">
 *     <main>
 *       <V4Hero eyebrow="About ACT 3" title="Made by" highlight="filmmakers" sub="One short line." />
 *       <V4Section eyebrow="Why" heading="Direct the movie," highlight="not the software." tone="raised">
 *         <V4CardGrid>
 *           <V4Card title="Script first" text="One short sentence." href="/features" />
 *         </V4CardGrid>
 *       </V4Section>
 *       <V4CtaBand />
 *     </main>
 *   </Layout>
 *
 * Keep the copy short: one line under a title, one or two under a heading.
 * Every class starts with "v4t-"; all styling is in site/css/v4-template.css.
 * Sections alternate tone="ground" / tone="raised"; a V4CtaBand between every
 * two or three sections matches the homepage's "Get Started" bands.
 */
import React from "react";
import V4Link from "./V4Link";
import { SIGNUP } from "../../data/siteNav";

const cx = (...c: (string | false | null | undefined)[]): string => c.filter(Boolean).join(" ");

/** A title with an optional yellow phrase after it: "Direct <yellow>your whole movie</yellow>". */
function Titled({ text, highlight }: { text: React.ReactNode; highlight?: React.ReactNode }): React.JSX.Element {
  return (
    <>
      {text}
      {highlight ? (
        <>
          {" "}
          <span className="v4t-hl">{highlight}</span>
        </>
      ) : null}
    </>
  );
}

// ── V4Hero ───────────────────────────────────────────────────────────────────

export interface V4HeroProps {
  /** Small yellow label above the title, e.g. "About ACT 3". */
  eyebrow?: React.ReactNode;
  /** The page H1 (Barlow Condensed 800, uppercase). */
  title: React.ReactNode;
  /** Optional phrase drawn in yellow, after `title`. */
  highlight?: React.ReactNode;
  /** ONE short line under the title. */
  sub?: React.ReactNode;
  /** Primary CTA. Defaults to "Get Started" → sign-up; pass `false` to hide it. */
  cta?: { label: string; href: string } | false;
  /** Optional ghost link next to the CTA, e.g. { label: "See plans", href: LINKS.plans }. */
  secondary?: { label: string; href: string };
  /** Extra content under the CTAs (an image, a video, a short list). */
  children?: React.ReactNode;
}

/**
 * The page's opening band: the hero ground with its 48px rule lines, H1, one line, CTA.
 * A <section> labelled by its H1 (not a <header>, which would be a second banner
 * landmark next to V4Header). Put it first inside the page's <main>.
 */
export function V4Hero({ eyebrow, title, highlight, sub, cta, secondary, children }: V4HeroProps): React.JSX.Element {
  const primary = cta === false ? null : (cta ?? { label: "Get Started", href: SIGNUP });
  const id = React.useId();
  return (
    <section className="v4t-hero" aria-labelledby={id}>
      <div className="v4t-hero-in">
        {eyebrow ? <p className="v4t-eyebrow">{eyebrow}</p> : null}
        <h1 className="v4t-h1" id={id}>
          <Titled text={title} highlight={highlight} />
        </h1>
        {sub ? <p className="v4t-hero-sub">{sub}</p> : null}
        {primary || secondary ? (
          <div className="v4t-ctas">
            {primary ? (
              <V4Link className="v4t-cta" href={primary.href}>
                {primary.label} <span aria-hidden="true">›</span>
              </V4Link>
            ) : null}
            {secondary ? (
              <V4Link className="v4t-ghost" href={secondary.href}>
                {secondary.label}
              </V4Link>
            ) : null}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}

// ── V4Section ────────────────────────────────────────────────────────────────

export interface V4SectionProps {
  eyebrow?: React.ReactNode;
  /** Section H2 (Figtree 800, sentence case). */
  heading?: React.ReactNode;
  /** Optional phrase drawn in yellow, after `heading`. */
  highlight?: React.ReactNode;
  /** One or two short sentences under the heading. */
  intro?: React.ReactNode;
  /** Background: the hero ground (default) or the raised charcoal. Alternate them. */
  tone?: "ground" | "raised";
  /** Centre the heading block (default: left). */
  center?: boolean;
  id?: string;
  className?: string;
  children?: React.ReactNode;
}

export function V4Section({ eyebrow, heading, highlight, intro, tone = "ground", center, id, className, children }: V4SectionProps): React.JSX.Element {
  return (
    <section id={id} className={cx("v4t-section", tone === "raised" && "v4t-section--raised", center && "v4t-section--center", className)}>
      <div className="v4t-wrap">
        {eyebrow || heading || intro ? (
          <div className="v4t-section-head">
            {eyebrow ? <p className="v4t-eyebrow">{eyebrow}</p> : null}
            {heading ? (
              <h2 className="v4t-h2">
                <Titled text={heading} highlight={highlight} />
              </h2>
            ) : null}
            {intro ? <p className="v4t-intro">{intro}</p> : null}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}

// ── V4CtaBand ────────────────────────────────────────────────────────────────

export interface V4CtaBandProps {
  label?: string;
  href?: string;
}

/** The homepage's "Get Started" band: navy, one yellow pill button. */
export function V4CtaBand({ label = "Get Started", href = SIGNUP }: V4CtaBandProps): React.JSX.Element {
  return (
    <div className="v4t-cta-band">
      <V4Link className="v4t-pill" href={href}>
        {label} <span className="v4t-pill-arrow" aria-hidden="true">›</span>
      </V4Link>
    </div>
  );
}

// ── V4CardGrid + V4Card ──────────────────────────────────────────────────────

export interface V4CardGridProps {
  /** Minimum card width before the grid wraps (default 260px). The cards always fill the row. */
  min?: number;
  /** A fixed number of columns instead (one column on phones), e.g. 3 for a 3x2 grid. */
  columns?: number;
  children: React.ReactNode;
}

export function V4CardGrid({ min = 260, columns, children }: V4CardGridProps): React.JSX.Element {
  const style = (columns ? { "--v4t-cols": columns } : { "--v4t-card-min": `${min}px` }) as unknown as React.CSSProperties;
  return (
    <div className="v4t-cards" data-cols={columns || undefined} style={style}>
      {children}
    </div>
  );
}

export interface V4CardProps {
  title: React.ReactNode;
  text?: React.ReactNode;
  /** Makes the whole card a link. */
  href?: string;
  /** Small yellow label above the title. */
  eyebrow?: React.ReactNode;
  /** An icon or small image, drawn in yellow above the title. */
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * A linked card's title with its → arrow glued to the last word, so a long
 * title never leaves the arrow alone on a line of its own. Pure string work (no
 * window / layout reads), so the server and client render the same markup.
 * A non-string title (JSX) keeps the arrow after it as before.
 */
function TitleWithArrow({ title }: { title: React.ReactNode }): React.JSX.Element {
  const arrow = (
    <span className="v4t-card-arrow" aria-hidden="true">
      →
    </span>
  );
  if (typeof title !== "string") {
    return (
      <>
        {title}
        {arrow}
      </>
    );
  }
  const trimmed = title.trimEnd();
  const cut = trimmed.lastIndexOf(" ");
  const head = cut >= 0 ? trimmed.slice(0, cut + 1) : "";
  const last = cut >= 0 ? trimmed.slice(cut + 1) : trimmed;
  return (
    <>
      {head}
      <span className="v4t-card-tail">
        {last}
        {arrow}
      </span>
    </>
  );
}

export function V4Card({ title, text, href, eyebrow, icon, children }: V4CardProps): React.JSX.Element {
  const body = (
    <>
      {icon ? <span className="v4t-card-icon" aria-hidden="true">{icon}</span> : null}
      {eyebrow ? <span className="v4t-card-eyebrow">{eyebrow}</span> : null}
      <h3 className="v4t-card-title">{href ? <TitleWithArrow title={title} /> : title}</h3>
      {text ? <p className="v4t-card-text">{text}</p> : null}
      {children}
    </>
  );
  return href ? (
    <V4Link className="v4t-card v4t-card--link" href={href}>
      {body}
    </V4Link>
  ) : (
    <div className="v4t-card">{body}</div>
  );
}

// ── V4Prose ──────────────────────────────────────────────────────────────────

/** Long-form text (policies, explanations): ~72ch measure, 18px body, styled h2/h3/lists/links. */
export function V4Prose({ children, className }: { children: React.ReactNode; className?: string }): React.JSX.Element {
  return <div className={cx("v4t-prose", className)}>{children}</div>;
}

// ── V4Split ──────────────────────────────────────────────────────────────────

export interface V4SplitProps {
  /** The copy column (headings, a short paragraph, a CTA). */
  children: React.ReactNode;
  /** The media column (an <img>, a <video>, a card). */
  media: React.ReactNode;
  /** Put the media on the left (default: right). */
  reverse?: boolean;
}

/** Copy + media, two columns; stacks (copy first) at <=900px. */
export function V4Split({ children, media, reverse }: V4SplitProps): React.JSX.Element {
  return (
    <div className={cx("v4t-split", reverse && "v4t-split--reverse")}>
      <div className="v4t-split-copy">{children}</div>
      <div className="v4t-split-media">{media}</div>
    </div>
  );
}
