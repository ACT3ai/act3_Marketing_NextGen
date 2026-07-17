/**
 * Movie Costs — cost model (the data behind the Full Movie screens).
 *
 * Ported from the internal mock app (all/app/code/film/ui/mock/movie_costs/cost-model.ts) with the
 * TypeScript types stripped. The numbers and formulas are IDENTICAL to the source of record —
 * app/pm/film/ui/mock/movie_costs/math.mdx. Do not edit values here without syncing the mock app.
 *
 * THE TWO RULES (math.mdx §"The two rules that orient everything"):
 *   1. DOLLARS ARE PRIMARY. The per-video price is a dollar amount read from seedance_prices.yaml
 *      (`price_with_profit`, by resolution) — profit is already baked in, so there is NO extra ×1.30
 *      markup step here. Credits are derived after the fact: Credits = Dollars × 500.
 *   2. THE VIDEO COUNT IS movie_seconds ÷ clip_seconds. Both Grok and Seedance make 15-second
 *      videos, so a movie needs the SAME number of videos from either model (90 min → 360,
 *      120 min → 480).
 */

/** Full path of the master, live, production pricing code we point at (never modified — learn from). */
export const MASTER_PRICING_FILE =
  '/Users/bryan/BGit/act3/WebApp/act3ai-appclient/src/@core/ui/pricing/index.tsx';

/** The backend credit-math spec (the master formula). */
export const MASTER_CREDIT_MATH_DOC =
  '/Users/bryan/BGit/act3/WebApp/act3ai-appsrv/docs/how-credits-are-calculated.md';

/** The definitive per-video dollar prices (with profit), by resolution — outranks every other source. */
export const SEEDANCE_PRICES_YAML =
  '/Users/bryan/BGit/all/app/pm/film/ui/mock/movie_costs/seedance_prices.yaml';

/**
 * Credit ↔ dollar conversion, from the master model:
 *   how-credits-are-calculated.md line 24 — 500 credits = $1, so 1 credit = $0.002.
 * Dollars are primary on this screen; credits = dollars × 500.
 */
export const CREDITS_PER_DOLLAR = 500;
export const DOLLARS_PER_CREDIT = 1 / CREDITS_PER_DOLLAR;

/**
 * Per-video dollar prices WITH PROFIT, from seedance_prices.yaml (the definitive source). Profit is
 * already baked in — these ARE the customer-facing dollar price of one generated video (one render /
 * one take) at that resolution.
 */
export const PRICE_WITH_PROFIT = {
  '480p': 1.38,
  '720p': 1.4742,
  '1080p': 7.3515,
  '4k': 15.1632,
  grok720p: 1.366, // grok_prices: 720p, 15-second, $1.366 with profit
};

/** Clip length in seconds. Both Grok and Seedance generate 15-second videos. */
export const CLIP_SECONDS = 15;

/**
 * Videos needed to fill a movie (math.mdx §2): movie_seconds ÷ clip_seconds. This is also the number
 * of shots (one clip per shot) and the "Create first frames" invoice quantity. With 15-second clips:
 * 90 min → 360, 120 min → 480.
 */
export function videosInMovie(runtimeMinutes, clipSeconds = CLIP_SECONDS) {
  return Math.ceil((runtimeMinutes * 60) / clipSeconds);
}

/** Column 1 rows, in dictated order (cheapest → most expensive). Shared by every table. */
export const RENDER_TIERS = [
  { rendersPerShot: 1 },
  { rendersPerShot: 3 },
  { rendersPerShot: 5 },
];

/**
 * The model columns for cost tables 1 & 2, left → right: Grok · Seedance 2.0 Mini · Seedance 2.0* ·
 * Seedance 2.0 4k*. Prices are read straight from seedance_prices.yaml (price_with_profit). Both
 * Seedance 2.0 and Seedance 2.0 4k are blended (asterisk) — only the last render is premium, the
 * rest are Mini.
 */
export const VIDEO_MODELS = [
  {
    key: 'grok',
    label: 'Grok',
    keyLabel: 'grok',
    resolution: '720p',
    clipSeconds: CLIP_SECONDS,
    priceWithProfit: PRICE_WITH_PROFIT.grok720p, // $1.366 — grok_prices (15-second, with profit)
    pricingIndex: {
      file: SEEDANCE_PRICES_YAML,
      location:
        'grok_prices → 720p price_with_profit ($1.366; 15-second video, profit included)',
    },
  },
  {
    key: 'seedance_2_mini',
    label: 'Seedance 2.0 Mini',
    keyLabel: 'SD mini',
    resolution: '720p',
    clipSeconds: CLIP_SECONDS,
    priceWithProfit: PRICE_WITH_PROFIT['720p'], // $1.4742 — the cheapest Seedance, used for all blended "rest" renders
    pricingIndex: {
      file: SEEDANCE_PRICES_YAML,
      location: 'Seedance_prices → 720p price_with_profit ($1.4742)',
    },
  },
  {
    key: 'seedance_2',
    label: 'Seedance 2.0',
    keyLabel: 'SD 2.0',
    resolution: '1080p',
    clipSeconds: CLIP_SECONDS,
    priceWithProfit: PRICE_WITH_PROFIT['1080p'], // $7.3515 — premium only on the last render (blended)
    blendedLastRender: true,
    blendedRestKey: 'seedance_2_mini',
    pricingIndex: {
      file: SEEDANCE_PRICES_YAML,
      location:
        'Seedance_prices → 1080p price_with_profit ($7.3515); rest of renders at 720p ($1.4742)',
    },
  },
  {
    key: 'seedance_2_4k',
    label: 'Seedance 2.0 4k',
    keyLabel: 'SD',
    resolution: '4K',
    clipSeconds: CLIP_SECONDS,
    priceWithProfit: PRICE_WITH_PROFIT['4k'], // $15.1632 — premium only on the last render (blended)
    blendedLastRender: true,
    blendedRestKey: 'seedance_2_mini',
    pricingIndex: {
      file: SEEDANCE_PRICES_YAML,
      location:
        'Seedance_prices → 4k price_with_profit ($15.1632); rest of renders at 720p ($1.4742)',
    },
  },
];

/**
 * Credits for one generated video / one take (math.mdx §1), dollars-primary:
 *   Credits_Per_Render = Price_With_Profit_Dollars × 500
 */
export function creditsPerRender(m) {
  return Math.round(m.priceWithProfit * CREDITS_PER_DOLLAR);
}

/**
 * Credits for one shot at `rendersPerShot` takes (math.mdx §3). Normally `rendersPerShot × fullRender`.
 * For a blended asterisk column, the last render costs `fullRender` and the other (rendersPerShot − 1)
 * cost `restRender`.
 */
export function creditsPerShot(rendersPerShot, fullRender, restRender = fullRender) {
  return (rendersPerShot - 1) * restRender + fullRender;
}

/**
 * Credits of the "Create first frames" work (math.mdx §5): one first-frame still per shot.
 */
export function firstFramesCredits(runtimeMinutes, clipSeconds = CLIP_SECONDS) {
  return videosInMovie(runtimeMinutes, clipSeconds) * FIRST_FRAME_CREDITS_PER_SHOT;
}

/**
 * The credits FOLDED INTO each cost cell (math.mdx §6) — the sum of ALL five priced Non-Videos
 * invoice rows for the runtime (each table title says "(includes non-Video Invoice below)").
 */
export function foldedInvoiceCredits(runtimeMinutes, clipSeconds = CLIP_SECONDS) {
  return invoiceGrandTotal(buildInvoiceRows(runtimeMinutes, clipSeconds)).credits ?? 0;
}

/**
 * A cost-table cell (whole-movie credits) for a video model at a renders-per-shot tier and runtime
 * (math.mdx §4 & §6): `videosInMovie(runtime) × Credits_Per_Shot + foldedInvoiceCredits(runtime)`.
 */
export function videoModelCellCredits(model, rendersPerShot, runtimeMinutes) {
  const full = creditsPerRender(model);
  const rest = model.blendedRestKey
    ? creditsPerRender(VIDEO_MODELS.find((m) => m.key === model.blendedRestKey))
    : full;
  const videos = videosInMovie(runtimeMinutes, model.clipSeconds);
  return (
    videos * creditsPerShot(rendersPerShot, full, rest) +
    foldedInvoiceCredits(runtimeMinutes, model.clipSeconds)
  );
}

/** The two dictated runtime versions: a 90-minute movie and a 120-minute movie. */
export const RUNTIME_VERSIONS = [
  { minutes: 90, label: '90-minute movie' },
  { minutes: 120, label: '120-minute movie' },
];

/**
 * Third table columns — Grok by quality setting. lowest = 480p, medium = 720p, highest = 1080p.
 * Grok has no native 4K (4K only via an upscaler such as Topaz). Only the medium (720p) price is a
 * Grok-specific number; lowest and highest borrow the Seedance per-resolution dollar.
 */
export const GROK_QUALITY_SETTINGS = [
  {
    key: 'grok_low',
    label: 'Grok (lowest)',
    resolution: '~480p',
    clipSeconds: CLIP_SECONDS,
    priceWithProfit: PRICE_WITH_PROFIT['480p'], // $1.38 — borrowed (no Grok 480p in the YAML yet)
    borrowedFromSeedance: true,
  },
  {
    key: 'grok_med',
    label: 'Grok (medium)',
    resolution: '~720p',
    clipSeconds: CLIP_SECONDS,
    priceWithProfit: PRICE_WITH_PROFIT.grok720p, // $1.366 — grok_prices (Grok's own 720p price)
  },
  {
    key: 'grok_high',
    label: 'Grok (highest)',
    resolution: '~1080p',
    clipSeconds: CLIP_SECONDS,
    priceWithProfit: PRICE_WITH_PROFIT['1080p'], // $7.3515 — borrowed (no Grok 1080p in the YAML yet)
    borrowedFromSeedance: true,
    blendedLastRender: true,
    blendedRestKey: 'grok_low',
  },
];

/**
 * A third-table cell (whole-movie credits) for a Grok quality setting — same composition as
 * `videoModelCellCredits`, honoring the blended highest column.
 */
export function grokSettingCellCredits(setting, rendersPerShot, runtimeMinutes) {
  const full = creditsPerRender(setting);
  const rest = setting.blendedRestKey
    ? creditsPerRender(GROK_QUALITY_SETTINGS.find((s) => s.key === setting.blendedRestKey))
    : full;
  const videos = videosInMovie(runtimeMinutes, setting.clipSeconds);
  return (
    videos * creditsPerShot(rendersPerShot, full, rest) +
    foldedInvoiceCredits(runtimeMinutes, setting.clipSeconds)
  );
}

/**
 * GROK-COLUMN CELL HIGHLIGHT — the Grok column's cells get a green background that deepens for the
 * cheapest tier: medium-light at 1 render per shot, very light at 3 & 5.
 */
export const GROK_CELL_GREEN_MEDIUM_LIGHT = '#BBF7D0';
export const GROK_CELL_GREEN_VERY_LIGHT = '#F0FDF4';

/** True for any Grok-family column key — `grok` in tables 1 & 2, `grok_*` in the Grok-versions table. */
export function isGrokColumnKey(key) {
  return key === 'grok' || key.startsWith('grok_');
}

/** The cell background for a column at a render tier (undefined for non-Grok columns). */
export function grokCellBackground(columnKey, rendersPerShot) {
  if (!isGrokColumnKey(columnKey)) return undefined;
  return rendersPerShot === 1 ? GROK_CELL_GREEN_MEDIUM_LIGHT : GROK_CELL_GREEN_VERY_LIGHT;
}

/** Asterisk footnote under cost tables 1 & 2 — both the Seedance 2.0 and Seedance 2.0 4k columns. */
export const SEEDANCE_BLENDED_FOOTNOTE =
  '* 4k & Seedance 2.0 is only used in the last render. The rest of the renders are with the cheapest Seedance (mini).';

/** Asterisk footnote under the third table (the Grok highest column). */
export const GROK_HIGHEST_FOOTNOTE =
  '* highest setting is only used on the last render. The rest of the renders are with the cheapest Grok.';

/** Standing footnote under the third table. */
export const GROK_TABLE_FOOTNOTE =
  'Grok: no native 4K — 4K only via an upscaler (e.g. Topaz). Only the medium (720p) price comes from grok_prices; the lowest (480p) and highest (1080p) prices borrow the Seedance per-resolution price until a Grok-specific sheet is dictated.';

/** The one-line key/legend rendered under each cost table. Built from VIDEO_MODELS so it never drifts. */
export function buildKeyLine() {
  const [grok, sdMini, sd20, sd4k] = VIDEO_MODELS;
  return [
    `${grok.keyLabel}: ${grok.resolution}, ${grok.clipSeconds}-second videos`,
    `${sdMini.keyLabel}: ${sdMini.resolution}`,
    `${sd20.keyLabel}: ${sd20.resolution}`,
    `${sd4k.keyLabel}: Seedance, ${sd4k.resolution}, ${sd4k.clipSeconds}-second videos`,
  ].join('   ');
}

/**
 * Per-shot first-frame image price, DOLLARS-PRIMARY (math.mdx §5; seedance_prices.yaml
 * first_frame_image_prices): Nano Banana 2 (Gemini 3.1 Flash Image) @ 2K.
 */
export const FIRST_FRAME_DOLLARS_PER_SHOT = 0.1;
export const FIRST_FRAME_CREDITS_PER_SHOT = FIRST_FRAME_DOLLARS_PER_SHOT * CREDITS_PER_DOLLAR;

/**
 * Per-shot AI prompt price (math.mdx §5 "Per-shot AI prompt"): the per-shot AI that writes the video
 * model's generation prompt (the Seedance/Grok "mega-prompt"). Product rate $1.60 per shot = 800
 * credits — the 30% profit margin (×1.30) is already included in this price.
 */
export const PER_SHOT_PROMPT_CREDITS = 800;

/**
 * Character reference sheet price (math.mdx §5): one reference-sheet image per digital actor, priced
 * as the cheapest 2K image generator — same basis as the first frame.
 */
export const CHAR_REF_SHEET_CREDITS = FIRST_FRAME_CREDITS_PER_SHOT;

/** Assumed number of digital actors whose character reference sheets we generate (runtime-independent). */
export const DIGITAL_ACTORS = 20;

/**
 * Combine all shots → final video & download (math.mdx §5): the one-time job that combines every
 * per-shot clip into the finished movie and produces the download. A flat product rate.
 */
export const MERGE_CREDITS_PER_SEC = 77;
export const COMBINE_DOWNLOAD_CREDITS = 1500; // flat $3.00 — same on every runtime

/** Credits for the one-time combine→final-video&download job: a flat 1,500 credits ($3), any runtime. */
export function combineDownloadCredits(_runtimeMinutes) {
  return COMBINE_DOWNLOAD_CREDITS;
}

/**
 * Script import price (math.mdx §5 "Script import"): the one-time story-structure generation the
 * import triggers, scaled to the movie's shot count (storyTotal 7,177 credits × shots/50).
 */
export const STORY_TOTAL_CREDITS = 7177;
export const STORY_TOTAL_EXAMPLE_SHOTS = 50;

/** Credits for the one-time script import at a runtime: storyTotal × shots/50 (rounded to whole credits). */
export function scriptImportCredits(runtimeMinutes, clipSeconds = CLIP_SECONDS) {
  const shots = videosInMovie(runtimeMinutes, clipSeconds);
  return Math.round((STORY_TOTAL_CREDITS * shots) / STORY_TOTAL_EXAMPLE_SHOTS);
}

/**
 * Build the Non-Videos Invoice rows for a runtime. FIVE rows, in production order: Script import →
 * the per-shot work → the one-time combine/download at the end. Every row carries its pricingIndex
 * (the cross-reference rule).
 */
export function buildInvoiceRows(runtimeMinutes, clipSeconds = CLIP_SECONDS) {
  const shots = videosInMovie(runtimeMinutes, clipSeconds);
  return [
    {
      key: 'script_import',
      description: 'Script import',
      quantity: 1,
      eachCredits: scriptImportCredits(runtimeMinutes, clipSeconds),
      note: 'Importing the screenplay into structured story data (plot → characters → acts → beats → scenes → shots) — a one-time, per-project action; its size scales with how many shots the movie breaks into.',
      pricingIndex: {
        file: MASTER_PRICING_FILE,
        location:
          "storyTotal = sumSteps(PROJECT_STORY_STEPS) = 7,177 credits for the 50-shot example (index.tsx lines 1113–1124, summed line 1143), scaled × shots/50 for the movie's shot count; catalog cross-ref: category 'ai-writing', item 'ai-script-import' (lines 959–965), resolved via usePricingCatalog() (line 89)",
      },
    },
    {
      key: 'first_frames',
      description: 'Create first frames (first time)',
      quantity: shots,
      eachCredits: FIRST_FRAME_CREDITS_PER_SHOT,
      note: 'First-frame still image for each shot on the first pass (the still that seeds each shot before any video). Quantity is the runtime-driven video count (one per shot).',
      pricingIndex: {
        file: SEEDANCE_PRICES_YAML,
        location:
          'first_frame_image_prices → Nano Banana 2 (Gemini 3.1 Flash Image) @ 2K, price_with_profit $0.131 ($0.101 × 1.30) = 65.5 credits/shot — cheapest 2K; supersedes master PROJECT_PRODUCTION_STEPS[0] perUnit 26 (index.tsx:1127); fixed at 2K so the 4K ×2 surcharge (index.tsx:1630) does not apply',
      },
    },
    {
      key: 'per_shot_ai_prompt',
      description: 'Per-shot AI prompt',
      quantity: shots,
      eachCredits: PER_SHOT_PROMPT_CREDITS,
      note: "Our per-shot AI that runs once per shot to write the video model's generation prompt (the Seedance/Grok mega-prompt). Charges credits each run; quantity is the shot/video count.",
      pricingIndex: {
        file: MASTER_PRICING_FILE,
        location:
          'Product rate $1.60 (800 credits) per shot for our per-shot AI — the 30% profit margin (×1.30) already included. Maps to the per-shot AI story steps (Shot overview 60 + Shot Depth 34 + Shot Script 1 + Generate Mega Prompt YAML 9, index.tsx lines 1120–1123); the bare Mega-Prompt YAML step alone is 9 credits (line 1123).',
      },
    },
    {
      key: 'character_reference_sheets',
      description: 'Character reference sheets',
      quantity: DIGITAL_ACTORS,
      eachCredits: CHAR_REF_SHEET_CREDITS,
      note: 'One character reference sheet image per digital actor (the canonical look that keeps an actor consistent across shots). Assumes 20 digital actors; runtime-independent.',
      pricingIndex: {
        file: SEEDANCE_PRICES_YAML,
        location:
          'first_frame_image_prices → Nano Banana 2 @ 2K, price_with_profit $0.131 (cheapest of Nano Banana 2 $0.101 vs GPT Image 2 ~$0.30, × 1.30 profit) = 65.5 credits; fixed at 2K (no 4K ×2 surcharge). Confirm actor count and whether a sheet is one 2K image or several.',
      },
    },
    {
      key: 'combine_download',
      description: 'Combine all shots → final video & download',
      quantity: 1,
      eachCredits: combineDownloadCredits(runtimeMinutes),
      note: 'The one-time step that combines every per-shot clip into the single finished movie and produces the downloadable file. Quantity is 1; a flat $3.00 regardless of runtime.',
      pricingIndex: {
        file: MASTER_PRICING_FILE,
        location:
          "Flat product rate $3.00 (1,500 credits) for the single combine-and-download action. Relates to PROJECT_MERGE_CREDITS_PER_SEC = 77 (index.tsx line 1111; 'Final merge / render' step, lines 1131–1136) but billed as a small flat charge, not 77 × movie_seconds.",
      },
    },
  ];
}

/** Quantity × Each for an invoice row, or null when either input is still pending. */
export function invoiceRowTotal(row) {
  if (row.quantity == null || row.eachCredits == null) return null;
  return row.quantity * row.eachCredits;
}

/**
 * The grand total — the sum of every row's Total. `hasPending` is true when at least one row could
 * not be included; `credits` is null only when no row has a known total at all.
 */
export function invoiceGrandTotal(rows) {
  const totals = rows.map(invoiceRowTotal);
  const known = totals.filter((t) => t != null);
  return {
    credits: known.length === 0 ? null : known.reduce((sum, t) => sum + t, 0),
    hasPending: totals.some((t) => t == null),
  };
}

/** Bare credit integer with thousands separators (e.g. "982,800"). */
export function formatCreditsNumber(credits) {
  return credits.toLocaleString('en-US');
}

/** Dollar amount for a credit count, ROUNDED UP to a whole dollar (no cents), e.g. "$1,027". */
export function formatDollars(credits) {
  return creditsToDollars(credits);
}

/** Format a credit count for display (credits — not dollars). */
export function formatCredits(credits) {
  return `${credits.toLocaleString('en-US')} credits`;
}

/** Dollar equivalent of a credit count, ROUNDED UP to whole dollars, at 1 credit = $0.002. */
export function creditsToDollars(credits) {
  const dollars = Math.ceil(credits * DOLLARS_PER_CREDIT);
  return dollars.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/**
 * EXACT dollar value of a credit count — NOT rounded — for the invoice "Each (dollars)" column.
 * At 1 credit = $0.002 the finest granularity is a fifth of a cent, so up to 3 decimals is exact.
 */
export function creditsToDollarsExact(credits) {
  return (credits * DOLLARS_PER_CREDIT).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 3,
  });
}
