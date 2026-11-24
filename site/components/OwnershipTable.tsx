import React, { useEffect, useRef } from "react";
import tableHtml from "../docs/ownership_of_output/table_ownership.html?raw";

/**
 * The ownership table on /docs/ownership_of_output, above "Most common".
 *
 * The table is generated as a standalone page
 * (site/docs/ownership_of_output/table_ownership.html, from
 * p_table_ownership_calc.md). It is embedded as-is in an iframe so its own CSS
 * (`:root` tokens, `body` styles) and hover-tooltip script stay isolated from
 * the site, and regenerating that one file is all it takes to update the page.
 *
 * srcDoc is set after mount, not server-rendered: the HTML minifier rewrites
 * markup, and a rewritten attribute would fail React's hydration check.
 */
function siteIsDark(): boolean {
  const html = document.documentElement;
  return html.classList.contains("v4t-skin") || html.dataset.theme === "dark";
}

export default function OwnershipTable(): React.ReactElement {
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const frame = ref.current;
    if (!frame) return undefined;
    let resize: ResizeObserver | undefined;
    let themeWatch: MutationObserver | undefined;

    const applyTheme = () => {
      const doc = frame.contentDocument;
      if (doc) doc.documentElement.dataset.theme = siteIsDark() ? "dark" : "light";
    };
    const fit = () => {
      const doc = frame.contentDocument;
      if (!doc?.body) return;
      const table = doc.querySelector("table");
      const h = Math.ceil((table ?? doc.body).getBoundingClientRect().height);
      if (h > 0) frame.style.height = `${h}px`;
    };
    const onLoad = () => {
      applyTheme();
      fit();
      const doc = frame.contentDocument;
      if (doc?.body && typeof ResizeObserver !== "undefined") {
        resize = new ResizeObserver(fit);
        resize.observe(doc.body);
      }
    };

    frame.addEventListener("load", onLoad);
    frame.srcdoc = tableHtml;
    themeWatch = new MutationObserver(applyTheme);
    themeWatch.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    return () => {
      frame.removeEventListener("load", onLoad);
      resize?.disconnect();
      themeWatch?.disconnect();
    };
  }, []);

  return (
    <iframe
      ref={ref}
      title="Ownership of output: AI systems compared"
      style={{
        display: "block",
        width: "100%",
        height: "1100px",
        border: 0,
        margin: "8px 0 24px",
        background: "transparent",
      }}
    />
  );
}
