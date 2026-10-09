import React from "react";
import V4Link from "./v4/V4Link";
import { LINKS, SIGNUP } from "../data/siteNav";

/*
 * The in-article call to action, on the v4 template (dark skin).
 *
 * Every article in the corpus used to end in a sentence like "start a free
 * project" with nothing clickable behind it, and the few links that existed
 * pointed at /signup, which is a 404 on this host. This component is the one
 * place that knows where a reader actually goes next, so fixing a destination
 * is a one-file change rather than one per article. The URLs come from site/data/siteNav.ts.
 *
 * Two variants:
 *   "inline"  - dropped once inside the body by scripts/sync-articles.js, after
 *               the opening section, because most readers never reach the end of
 *               a 1,500-word page. A dark card with the square yellow CTA.
 *   "footer"  - rendered automatically at the end of every article by the
 *               swizzled @theme/MDXPage, full width. The homepage's navy
 *               "Get Started" band (V4CtaBand) with its yellow pill.
 *
 * It is registered as a global MDX component (src/theme/MDXComponents.tsx), so
 * an article writes <ArticleCTA /> with no import.
 *
 * All styling is in site/css/articles.css (.a3cta*), plus the template's own
 * .v4t-cta / .v4t-pill from v4-template.css. No
 * <style> element here: CSS in the body is what broke hydration (#418).
 */

export const SIGNUP_URL = SIGNUP;
export const PLANS_URL = LINKS.plans;

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
  if (variant === "footer") {
    return (
      <aside className="a3cta a3cta--footer" aria-label="Get started">
        <div className="a3cta__in">
          <p className="a3cta__title">{title ?? "Turn your script into a film"}</p>
          <p className="a3cta__body">
            {body ??
              "ACT 3 AI builds the scenes, shots, characters, cinematography and a full-length cut on one timeline."}
          </p>
          <div className="a3cta__row">
            <V4Link className="v4t-pill" href={SIGNUP_URL}>
              Start a free project <span className="v4t-pill-arrow" aria-hidden="true">›</span>
            </V4Link>
            <V4Link className="a3cta__alt" href={PLANS_URL}>
              See pricing
            </V4Link>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="a3cta a3cta--inline" aria-label="Try ACT 3">
      <p className="a3cta__title">{title ?? "Stop reading. Build one scene."}</p>
      <p className="a3cta__body">
        {body ??
          "Import one page of your script. Get its shot list and first frames."}
      </p>
      <div className="a3cta__row">
        <V4Link className="v4t-cta v4t-cta-sm" href={SIGNUP_URL}>
          Start a free project <span aria-hidden="true">›</span>
        </V4Link>
        <V4Link className="a3cta__alt" href="/features">
          See what it does <span aria-hidden="true">→</span>
        </V4Link>
      </div>
    </aside>
  );
}
