import React, { useEffect } from "react";
import Head from "@docusaurus/Head";

/**
 * Route: /info/launch — REDIRECT ONLY.
 *
 * The launch page repeated the blog's welcome post, so on 2026-10-26 its content
 * was merged into /blog/welcome (site/blog/2026-04-26-welcome.md). This stub keeps
 * old links working, the same way site/pages/v/4 does: the meta refresh covers the
 * static HTML (GitHub Pages has no server-side redirects), the effect covers SPA
 * navigation, and the link covers no-JS. noindex + a canonical to the post; the
 * route is also out of the sitemap (docusaurus.config.ts ignorePatterns).
 */
const TARGET = "/blog/welcome";

export default function LaunchRedirect(): React.JSX.Element {
  useEffect(() => {
    window.location.replace(TARGET + window.location.hash);
  }, []);
  return (
    <>
      <Head>
        <title>ACT 3 AI</title>
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={`https://act3ai.com${TARGET}`} />
        <meta httpEquiv="refresh" content={`0; url=${TARGET}`} />
      </Head>
      <p style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
        This page moved to <a href={TARGET}>the ACT 3 AI launch post</a>.
      </p>
    </>
  );
}
