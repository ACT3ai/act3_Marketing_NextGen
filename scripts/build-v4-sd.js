// ─────────────────────────────────────────────────────────────────────────────
// Phone-sized copies of the homepage rows' heaviest media.
//
//   node scripts/build-v4-sd.js            (run after scripts/build-v4-rows.js; that script runs it too)
//
// Why: on phones the homepage tab was killed for running out of memory, which
// shows as "white page, then it reloads by itself" (iOS Safari reloads a tab
// whose web process died). Desktop was fine. The rows carry 4K hero clips, 4K
// posters and 5504 px screenshots that are kept at full resolution on purpose
// (see WEB_VIDEO.keepResolutionDirs in build-v4-rows.js), and the hero keeps
// every clip it has played loaded. Decoded, one 5504 x 2674 JPEG is ~59 MB and
// one 4K poster ~33 MB, before any 4K video decoder.
//
// The originals are NOT changed and desktop keeps them. This script writes a
// smaller copy of each oversized file to site/static/v4-sd/ (outside
// site/static/v4/, which build-v4-rows.js wipes) and the map
// site/components/v4/sdMedia.generated.ts. Phones then get the copies:
//   * markup <img> without a srcset: rowTransforms.applyRowFixes adds one
//     (phone sizes only, so desktop still picks the original),
//   * media the row engines create (the hero's clips and posters):
//     rowHarness maps their src / poster on phones.
//
// Oversized: a video whose short side is over VIDEO_SHORT px, an image wider
// than IMAGE_MAX_W px. Idempotent: a copy is redone only when its source changed.
// Needs ffmpeg/ffprobe (brew install ffmpeg) and macOS sips.
// ─────────────────────────────────────────────────────────────────────────────
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");

const REPO_DIR = path.join(__dirname, "..");
const STATIC_DIR = path.join(REPO_DIR, "site/static");
const SRC_DIR = path.join(STATIC_DIR, "v4");
const OUT_DIR = path.join(STATIC_DIR, "v4-sd");
const ROWS_FILE = path.join(REPO_DIR, "site/pages/_rows.generated.ts");
const MAP_FILE = path.join(REPO_DIR, "site/components/v4/sdMedia.generated.ts");

const VIDEO_SHORT = 720; // phone copy: short side 720, like every other row video
const IMAGE_MAX_W = 3000; // images wider than this get a copy...
const IMAGE_SD_W = 1600; // ...this wide (a 430 px phone at 3x needs 1290)
const VIDEO_ARGS = ["-map", "0:v:0", "-an", "-sn", "-dn", "-map_metadata", "-1",
  "-c:v", "libx264", "-preset", "slow", "-crf", "26", "-profile:v", "high", "-pix_fmt", "yuv420p",
  "-force_key_frames", "expr:gte(t,n_forced*2)", "-movflags", "+faststart",
  "-fflags", "+bitexact", "-flags:v", "+bitexact"];

const sha1 = (f) => crypto.createHash("sha1").update(fs.readFileSync(f)).digest("hex");

function probeVideo(f) {
  const out = execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0",
    "-show_entries", "stream=width,height", "-of", "csv=p=0", f], { encoding: "utf8" }).trim();
  const [w, h] = out.split(",").map(Number);
  return { w, h };
}
function probeImage(f) {
  const out = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", f], { encoding: "utf8" });
  return { w: Number(/pixelWidth: (\d+)/.exec(out)[1]), h: Number(/pixelHeight: (\d+)/.exec(out)[1]) };
}

/** Every /v4/... media URL the rows reference, in their markup or their scripts. */
function referencedUrls() {
  const texts = [fs.readFileSync(ROWS_FILE, "utf8")];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".js")) texts.push(fs.readFileSync(p, "utf8"));
    }
  })(SRC_DIR);
  const urls = new Set();
  for (const t of texts) for (const m of t.matchAll(/\/v4\/row_\d+\/[A-Za-z0-9_./-]+\.(?:mp4|jpe?g|png|webp)/g)) urls.add(m[0]);
  return [...urls].sort();
}

let old = {};
if (fs.existsSync(MAP_FILE)) {
  const m = /export const SD_MEDIA[^=]*= (\{[\s\S]*?\n\});/.exec(fs.readFileSync(MAP_FILE, "utf8"));
  if (m) old = JSON.parse(m[1]);
}

const map = {};
const keep = new Set();
for (const url of referencedUrls()) {
  const src = path.join(STATIC_DIR, url);
  if (!fs.existsSync(src)) continue;
  const isVideo = url.endsWith(".mp4");
  const dim = isVideo ? probeVideo(src) : probeImage(src);
  const oversized = isVideo ? Math.min(dim.w, dim.h) > VIDEO_SHORT : dim.w > IMAGE_MAX_W;
  if (!oversized) continue;

  const sdUrl = url.replace(/^\/v4\//, "/v4-sd/");
  const dest = path.join(STATIC_DIR, sdUrl);
  const hash = sha1(src);
  keep.add(dest);
  if (!(old[url] && old[url].hash === hash && fs.existsSync(dest))) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    if (isVideo) {
      const scale = dim.w >= dim.h ? `scale=-2:${VIDEO_SHORT}` : `scale=${VIDEO_SHORT}:-2`;
      execFileSync("ffmpeg", ["-y", "-v", "error", "-i", src, ...VIDEO_ARGS, "-vf", scale, dest]);
    } else {
      execFileSync("sips", ["--resampleWidth", String(IMAGE_SD_W), "-s", "formatOptions", "82", src, "--out", dest], { stdio: "ignore" });
    }
    console.log(`[build-v4-sd] ${url} ${dim.w}x${dim.h} -> ${sdUrl}`);
  }
  const sd = isVideo ? probeVideo(dest) : probeImage(dest);
  map[url] = { sd: sdUrl, w: sd.w, fullW: dim.w, hash };
}

// Drop copies whose source is gone or no longer oversized.
if (fs.existsSync(OUT_DIR)) {
  (function prune(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) { prune(p); if (fs.readdirSync(p).length === 0) fs.rmdirSync(p); }
      else if (!keep.has(p)) fs.unlinkSync(p);
    }
  })(OUT_DIR);
}

fs.writeFileSync(MAP_FILE, `/* GENERATED by scripts/build-v4-sd.js — do not hand-edit. */
/** Phone-sized copies of the rows' oversized media: original URL -> copy (w: the copy's width, fullW: the original's). */
export interface SdMedia { sd: string; w: number; fullW: number; hash: string }
export const SD_MEDIA: Record<string, SdMedia> = ${JSON.stringify(map, null, 2)};
`);
console.log(`[build-v4-sd] ${Object.keys(map).length} phone copies, map: ${path.relative(REPO_DIR, MAP_FILE)}`);
