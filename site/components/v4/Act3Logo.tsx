/**
 * The ONE ACT3 logo: "ACT" + gold "3", the app's top-left wordmark
 * (act3ai-appclient src/@core/ui/brand/Act3Logo.tsx, public/images/act3_logo_{dark,light}.png)
 * set as live text: Montserrat 650 at 33px, the size of the app's 26px-tall image. Styles: .act3-logo in
 * site/css/v4-template.css. The parent link carries the accessible name.
 */
import React from "react";

/** The same mark as raw HTML, for the generated rows (rowTransforms.applyRowFixes). */
export const ACT3_LOGO_HTML = '<span class="act3-logo" aria-hidden="true">ACT<span class="act3-logo-3">3</span></span>';

export default function Act3Logo({ theme }: { theme?: "dark" | "light" }): React.JSX.Element {
  return (
    <span className="act3-logo" data-theme={theme} aria-hidden="true">
      ACT<span className="act3-logo-3">3</span>
    </span>
  );
}
