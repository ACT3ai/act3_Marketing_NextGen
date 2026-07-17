/**
 * Movie Profits vs. Expenses — the profit/expense split model.
 *
 * Ported from the internal mock app (all/app/code/film/ui/mock/profit_vs_expenses/profit-expense.ts)
 * with the TypeScript types stripped. Mirrors the Movie Costs model one-for-one and adds exactly ONE
 * transformation: every line of data is split into its PROFIT and EXPENSE halves.
 *
 * THE SINGLE SOURCE OF TRUTH is the Movie Costs cost-model (./cost-model). We do NOT re-derive the
 * customer-facing (with-profit) numbers here — we import them, then split each one:
 *
 *   EXPENSE = what production costs ACT3 (math.mdx Addendum P2/P3).
 *     - Per-video / per-image lines → the YAML `price_without_profit` × 500.
 *     - Master credit-priced lines whose rate already bakes in the ×1.30 markup → value ÷ 1.30,
 *       ROUNDED to the nearest 0.1 credit.
 *   PROFIT = the with-profit value − the expense — always the exact remainder, taken AFTER the
 *   expense rounding, so the pair still sums to the credit.
 *
 * RECONCILIATION RULE (must always hold): for every line,
 *   profit + expense = the single line Movie Costs shows.
 */
import {
  buildInvoiceRows,
  CREDITS_PER_DOLLAR,
  creditsPerRender,
  creditsPerShot,
  GROK_QUALITY_SETTINGS,
  grokSettingCellCredits,
  invoiceRowTotal,
  VIDEO_MODELS,
  videoModelCellCredits,
  videosInMovie,
} from './cost-model';

/**
 * The markup multiplier that ACT3's master credit rates already bake in
 * (Credits = provider per-second price × duration × 1.30 × 500). For the credit-priced invoice
 * lines, EXPENSE = value ÷ 1.30 strips that markup back out.
 */
export const MARKUP_MULTIPLIER = 1.3;

/**
 * Per-video dollar prices WITHOUT profit, from seedance_prices.yaml `price_without_profit` (the
 * definitive, highest-authority source). These ARE the expense (what a render costs ACT3) before
 * the ×1.30 markup. Grok 480p/1080p have no Grok-specific line yet, so they borrow the Seedance
 * per-resolution dollar.
 */
export const PRICE_WITHOUT_PROFIT = {
  '480p': 1.06,
  '720p': 1.134,
  '1080p': 5.655,
  '4k': 11.664,
  grok720p: 1.05, // grok_prices: 720p, 15-second, $1.05 without profit
};

/**
 * First-frame / character-reference-sheet image EXPENSE, DOLLARS-PRIMARY: Nano Banana 2
 * (Gemini 3.1 Flash Image) @ 2K = $0.101 → 50.5 credits/shot.
 */
export const FIRST_FRAME_EXPENSE_DOLLARS_PER_SHOT = 0.101;
export const FIRST_FRAME_EXPENSE_CREDITS_PER_SHOT =
  FIRST_FRAME_EXPENSE_DOLLARS_PER_SHOT * CREDITS_PER_DOLLAR; // 50.5

/** Build a Split from a with-profit value and its independently-sourced expense. */
export function makeSplit(withProfit, expense) {
  return { withProfit, expense, profit: withProfit - expense };
}

/**
 * Round to the nearest 0.1 credit (= $0.0002). The ÷1.30 expense of a markup-priced line is a
 * repeating fraction; the page shows it — and totals it — at a clean tenth of a credit.
 */
export function roundToTenthCredit(credits) {
  return Math.round(credits * 10) / 10;
}

/**
 * Split a master credit-priced value (markup baked in): expense = value ÷ 1.30 rounded to the
 * nearest 0.1 credit, profit = the exact rest.
 */
export function splitByMarkup(withProfitCredits) {
  const expense = roundToTenthCredit(withProfitCredits / MARKUP_MULTIPLIER);
  return makeSplit(withProfitCredits, expense);
}

/** The value of a Split's requested half ("profit" | "expense"), in credits. */
export function halfCredits(split, half) {
  return half === 'profit' ? split.profit : split.expense;
}

/* ── Cost-table cells (mirrors cost-model videoModelCellCredits) ─────────────────────────────── */

/**
 * Expense copies of the four cost-table model columns — same keys, blend structure and clip length,
 * but `priceWithProfit` swapped for the YAML `price_without_profit`.
 */
const EXPENSE_VIDEO_MODELS = VIDEO_MODELS.map((m) => ({
  ...m,
  priceWithProfit: expenseDollarsForModelKey(m.key),
}));

/** The without-profit dollar price backing each cost-table model column. */
function expenseDollarsForModelKey(key) {
  switch (key) {
    case 'grok':
      return PRICE_WITHOUT_PROFIT.grok720p;
    case 'seedance_2_mini':
      return PRICE_WITHOUT_PROFIT['720p'];
    case 'seedance_2':
      return PRICE_WITHOUT_PROFIT['1080p'];
    case 'seedance_2_4k':
      return PRICE_WITHOUT_PROFIT['4k'];
    default:
      return PRICE_WITHOUT_PROFIT['720p'];
  }
}

/** The EXPENSE credits folded into a cost cell for a runtime (priced invoice rows, expense side). */
function foldedExpenseInvoiceCredits(runtimeMinutes, clipSeconds) {
  return buildExpenseInvoiceRows(runtimeMinutes, clipSeconds)
    .map(invoiceRowTotal)
    .filter((t) => t != null)
    .reduce((sum, t) => sum + t, 0);
}

/** The EXPENSE credits of one cost-table cell — same composition as videoModelCellCredits. */
function videoModelCellExpenseCredits(model, rendersPerShot, runtimeMinutes) {
  const expenseModel = EXPENSE_VIDEO_MODELS.find((m) => m.key === model.key);
  const full = creditsPerRender(expenseModel);
  const rest = expenseModel.blendedRestKey
    ? creditsPerRender(EXPENSE_VIDEO_MODELS.find((m) => m.key === expenseModel.blendedRestKey))
    : full;
  const videos = videosInMovie(runtimeMinutes, expenseModel.clipSeconds);
  return (
    videos * creditsPerShot(rendersPerShot, full, rest) +
    foldedExpenseInvoiceCredits(runtimeMinutes, expenseModel.clipSeconds)
  );
}

/**
 * A cost-table cell as a profit/expense Split. The with-profit half is the exact Movie Costs cell;
 * the expense half is computed from the YAML without-profit prices + the expense invoice; profit =
 * the difference, so profit + expense equals the Movie Costs cell to the credit.
 */
export function videoModelCellSplit(model, rendersPerShot, runtimeMinutes) {
  return makeSplit(
    videoModelCellCredits(model, rendersPerShot, runtimeMinutes),
    videoModelCellExpenseCredits(model, rendersPerShot, runtimeMinutes),
  );
}

/* ── Grok-versions table (mirrors cost-model grokSettingCellCredits) ─────────────────────────── */

/** Expense copies of the Grok quality settings — without-profit dollar per setting, same blend. */
const EXPENSE_GROK_SETTINGS = GROK_QUALITY_SETTINGS.map((s) => ({
  ...s,
  priceWithProfit: expenseDollarsForGrokKey(s.key),
}));

function expenseDollarsForGrokKey(key) {
  switch (key) {
    case 'grok_low':
      return PRICE_WITHOUT_PROFIT['480p']; // borrowed (no Grok 480p line yet)
    case 'grok_med':
      return PRICE_WITHOUT_PROFIT.grok720p;
    case 'grok_high':
      return PRICE_WITHOUT_PROFIT['1080p']; // borrowed (no Grok 1080p line yet)
    default:
      return PRICE_WITHOUT_PROFIT.grok720p;
  }
}

/** The EXPENSE credits of one Grok-versions cell — same composition as grokSettingCellCredits. */
function grokSettingCellExpenseCredits(setting, rendersPerShot, runtimeMinutes) {
  const expenseSetting = EXPENSE_GROK_SETTINGS.find((s) => s.key === setting.key);
  const full = creditsPerRender(expenseSetting);
  const rest = expenseSetting.blendedRestKey
    ? creditsPerRender(EXPENSE_GROK_SETTINGS.find((s) => s.key === expenseSetting.blendedRestKey))
    : full;
  const videos = videosInMovie(runtimeMinutes, expenseSetting.clipSeconds);
  return (
    videos * creditsPerShot(rendersPerShot, full, rest) +
    foldedExpenseInvoiceCredits(runtimeMinutes, expenseSetting.clipSeconds)
  );
}

/** A Grok-versions cell as a Split (the Grok table runs at the 90-minute runtime). */
export function grokSettingCellSplit(setting, rendersPerShot, runtimeMinutes) {
  return makeSplit(
    grokSettingCellCredits(setting, rendersPerShot, runtimeMinutes),
    grokSettingCellExpenseCredits(setting, rendersPerShot, runtimeMinutes),
  );
}

/* ── Non-Videos Invoice (mirrors cost-model buildInvoiceRows, each row split) ────────────────── */

/** The per-unit EXPENSE credits for a Movie Costs invoice row (its `eachCredits` is with-profit). */
function invoiceRowEachExpense(row) {
  if (row.eachCredits == null) return null;
  switch (row.key) {
    // Image lines priced from the YAML without-profit ($0.101 = 50.5 credits/image).
    case 'first_frames':
    case 'character_reference_sheets':
      return FIRST_FRAME_EXPENSE_CREDITS_PER_SHOT;
    default:
      // Every credit-priced row has the ×1.30 markup baked in → ÷1.30, rounded to 0.1 credit.
      return splitByMarkup(row.eachCredits).expense;
  }
}

/** Build the profit/expense-split Non-Videos Invoice rows for a runtime. */
export function buildInvoiceRowSplits(runtimeMinutes, clipSeconds) {
  return buildInvoiceRows(runtimeMinutes, clipSeconds).map((row) => {
    const expenseEach = invoiceRowEachExpense(row);
    return {
      key: row.key,
      description: row.description,
      note: row.note,
      quantity: row.quantity,
      eachSplit:
        row.eachCredits == null || expenseEach == null
          ? null
          : makeSplit(row.eachCredits, expenseEach),
      pricingIndex: row.pricingIndex,
    };
  });
}

/** The expense-side invoice rows (for the cost-cell fold) — same rows, each Each swapped for expense. */
function buildExpenseInvoiceRows(runtimeMinutes, clipSeconds) {
  return buildInvoiceRows(runtimeMinutes, clipSeconds).map((row) => ({
    ...row,
    eachCredits: invoiceRowEachExpense(row),
  }));
}

/** Quantity × Each for one half of an invoice row, or null when the row is pending. */
export function invoiceRowHalfTotal(row, half) {
  if (row.quantity == null || row.eachSplit == null) return null;
  return row.quantity * halfCredits(row.eachSplit, half);
}

/** The two grand-total bars — the summed profit and expense of the priced rows. */
export function invoiceTotals(rows) {
  let profit = 0;
  let expense = 0;
  let hasPending = false;
  for (const row of rows) {
    const p = invoiceRowHalfTotal(row, 'profit');
    const e = invoiceRowHalfTotal(row, 'expense');
    if (p == null || e == null) {
      hasPending = true;
      continue;
    }
    profit += p;
    expense += e;
  }
  return { profit, expense, hasPending };
}

// Re-export the shared, unchanged model surface so the view imports everything from one place.
export {
  buildInvoiceRows,
  buildKeyLine,
  combineDownloadCredits,
  creditsToDollarsExact,
  DIGITAL_ACTORS,
  foldedInvoiceCredits,
  formatCreditsNumber,
  formatDollars,
  GROK_HIGHEST_FOOTNOTE,
  GROK_QUALITY_SETTINGS,
  GROK_TABLE_FOOTNOTE,
  grokCellBackground,
  grokSettingCellCredits,
  MASTER_CREDIT_MATH_DOC,
  MASTER_PRICING_FILE,
  RENDER_TIERS,
  RUNTIME_VERSIONS,
  SEEDANCE_BLENDED_FOOTNOTE,
  SEEDANCE_PRICES_YAML,
  VIDEO_MODELS,
  videoModelCellCredits,
} from './cost-model';
