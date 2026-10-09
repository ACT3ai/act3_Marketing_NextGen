import React, { useEffect } from "react";
import Head from "@docusaurus/Head";

/**
 * Route: /v/4 — REDIRECT ONLY.
 *
 * The /v/4 design became the homepage on 2026-10-08 and now lives at
 * site/pages/index.tsx (served at /). This stub keeps old /v/4 links working:
 * the meta refresh covers the static HTML (GitHub Pages has no server-side
 * redirects), the effect covers SPA navigation, and the link covers no-JS.
 */
export default function V4Redirect(): React.JSX.Element {
  useEffect(() => {
    window.location.replace("/" + window.location.search + window.location.hash);
  }, []);
  return (
    <>
      <Head>
        <title>ACT 3 AI</title>
        <meta name="robots" content="noindex, follow" />
        <meta httpEquiv="refresh" content="0; url=/" />
      </Head>
      <p style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
        This page moved to <a href="/">act3ai.com</a>.
      </p>
    </>
  );
}
