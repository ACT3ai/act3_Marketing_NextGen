// ─────────────────────────────────────────────────────────────────────────────
// Post-build: make trailing-slash URLs work on GitHub Pages.
//
// The site is built with `trailingSlash: false`, so Docusaurus emits a flat
// `build/v/2.html` for the route /v/2. GitHub Pages serves that file at
// `https://act3ai.com/v/2` but returns a hard 404 for `https://act3ai.com/v/2/`
// — it only falls back to a directory index (`v/2/index.html`), which does not
// exist. Anyone who types or pastes a URL with a trailing slash gets a 404.
//
// This script walks the finished build and, for every `X.html`, also writes
// `X/index.html` with the same bytes. GitHub Pages then serves:
//   /v/2   → v/2.html         (exact file match wins)
//   /v/2/  → v/2/index.html   (directory index)
// Both render the same page. Canonical URLs are untouched: the pages keep the
// no-slash `<link rel="canonical">` Docusaurus generated, so search engines
// still see one URL per page.
//
// Skipped: files already named index.html (nothing to alias) and 404.html
// (GitHub Pages needs it at the root, and `/404/` is not a real route).
// ─────────────────────────────────────────────────────────────────────────────
const fs = require("fs");
const path = require("path");

const BUILD_DIR = path.join(__dirname, "..", "build");

function htmlFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...htmlFiles(full));
    else if (entry.isFile() && entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

if (!fs.existsSync(BUILD_DIR)) {
  console.error(`[trailing-slash] no build directory at ${BUILD_DIR}`);
  process.exit(1);
}

let written = 0;
for (const file of htmlFiles(BUILD_DIR)) {
  const name = path.basename(file);
  if (name === "index.html") continue;
  if (name === "404.html" && path.dirname(file) === BUILD_DIR) continue;

  const aliasDir = file.slice(0, -".html".length);
  const alias = path.join(aliasDir, "index.html");
  if (fs.existsSync(alias)) continue;

  fs.mkdirSync(aliasDir, { recursive: true });
  fs.copyFileSync(file, alias);
  written++;
}

console.log(`[trailing-slash] wrote ${written} directory-index aliases`);
