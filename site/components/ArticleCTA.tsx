import React from "react";

/*
 * The in-article call to action.
 *
 * Every article in the corpus used to end in a sentence like "start a free
 * project" with nothing clickable behind it, and the few links that existed
 * pointed at /signup, which is a 404 on this host. This component is the one
 * place that knows where a reader actually goes next, so fixing a destination
 * is a one-file change rather than 133.
 *
 * Two variants:
 *   "inline"  - dropped once inside the body by scripts/sync-articles.js, after
 *               the opening section, because most readers never reach the end of
 *               a 1,500-word page.
 *   "footer"  - rendered automatically at the end of every article by the
 *               swizzled @theme/MDXPage.
 *
 * It is registered as a global MDX component (src/theme/MDXComponents.tsx), so
 * an article writes <ArticleCTA /> with no import.
 */

export const SIGNUP_URL = "https://app.act3ai.com/signup/";
export const PLANS_URL = "https://app.act3ai.com/settings/plans/";

const CTA_CSS = `
.a3cta {
  --a3cta-bg: #f6f1e6;
  --a3cta-line: #e2dccb;
  --a3cta-ink: #1a1714;
  --a3cta-ink-2: #4a4540;
  --a3cta-accent: #c4612b;
  border: 1px solid var(--a3cta-line);
  background: var(--a3cta-bg);
  border-radius: 14px;
  padding: 26px 28px;
  margin: 40px 0;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
.a3cta__eyebrow {
  font-family: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;
  font-size: 11px;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--a3cta-accent);
  margin: 0 0 10px;
}
.a3cta__title {
  font-family: "Fraunces", "Times New Roman", serif;
  font-size: clamp(20px, 2.6vw, 27px);
  line-height: 1.2;
  font-weight: 500;
  color: var(--a3cta-ink);
  margin: 0 0 10px;
}
.a3cta__body {
  color: var(--a3cta-ink-2);
  font-size: 15px;
  line-height: 1.6;
  margin: 0 0 20px;
  max-width: 62ch;
}
.a3cta__row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
.a3cta__btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--a3cta-accent);
  color: #fff;
  font-weight: 600;
  font-size: 15px;
  padding: 12px 22px;
  border-radius: 999px;
  text-decoration: none;
  transition: filter .15s ease, transform .15s ease;
}
.a3cta__btn:hover { color: #fff; text-decoration: none; filter: brightness(1.06); transform: translateY(-1px); }
.a3cta__alt {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--a3cta-ink-2);
  font-weight: 500;
  font-size: 15px;
  padding: 12px 18px;
  border-radius: 999px;
  border: 1px solid var(--a3cta-line);
  text-decoration: none;
  background: #fff;
  transition: border-color .15s ease, color .15s ease;
}
.a3cta__alt:hover { color: var(--a3cta-accent); border-color: var(--a3cta-accent); text-decoration: none; }

.a3cta--footer { margin: 52px 0 8px; padding: 34px 32px; }
`;

export type ArticleCTAProps = {
  variant?: "inline" | "footer";
  title?: string;
  body?: string;
};

export default function ArticleCTA({
  variant = "inline",
  title,
  body,
}: ArticleCTAProps): React.ReactNode {
  const isFooter = variant === "footer";
  return (
    <aside className={`a3cta${isFooter ? " a3cta--footer" : ""}`}>
      <style>{CTA_CSS}</style>
      <p className="a3cta__eyebrow">
        {isFooter ? "Try it on your own script" : "See it on your own work"}
      </p>
      <p className="a3cta__title">
        {title ??
          (isFooter
            ? "Turn your script into a film you can watch end to end."
            : "Stop reading about it. Build one scene.")}
      </p>
      <p className="a3cta__body">
        {body ??
          (isFooter
            ? "ACT 3 AI takes a script and builds the whole production: scenes, shots, characters, cinematography, and a full-length cut you can play back on a timeline. Start a free project and put your own pages through it."
            : "Start a free project, import a page of your script, and let ACT 3 AI build the shots, characters, and first frames for you.")}
      </p>
      <div className="a3cta__row">
        <a className="a3cta__btn" href={SIGNUP_URL}>
          Start a free project <span aria-hidden="true">&rarr;</span>
        </a>
        <a className="a3cta__alt" href={isFooter ? PLANS_URL : "/features"}>
          {isFooter ? "See pricing" : "See what it does"}
        </a>
      </div>
    </aside>
  );
}
