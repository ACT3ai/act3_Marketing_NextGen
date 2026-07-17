/**
 * Movie Profits vs. Expenses — ported from the internal mock app
 * (all/app/code/film/ui/mock/profit_vs_expenses/ProfitVsExpensesMockup.tsx) to plain JSX + a CSS
 * module for the docs site. The dev-only id-inspector wiring was dropped; everything the reader
 * sees is identical to the mock at /film/ui/mock/profit_vs_expenses.
 *
 * THE ONE TRANSFORMATION vs. Movie Costs: every line of data is split into its PROFIT and EXPENSE
 * halves. The cost tables (and their credits copies) render the halves as stacked row pairs — six
 * data rows per table. The Non-Videos Invoice section renders WHOLE single-half invoices: four in
 * all — Expenses 90 · Expenses 120 · Profit 90 · Profit 120 — each with one grand-total bar.
 * Every profit/expense pair sums to the single Movie Costs value (reconciliation rule); the split
 * is computed in ./profit-expense.js off the Movie Costs cost-model, so the two can never drift.
 *
 * Dollars are primary; credits = dollars × 500. Dollars are rounded UP to whole dollars PER HALF on
 * its own row (round-then-show); the credits tables stay exact.
 */
import React from 'react';
import styles from './fullMovie.module.css';
import {
  buildInvoiceRowSplits,
  buildKeyLine,
  creditsToDollarsExact,
  formatCreditsNumber,
  formatDollars,
  GROK_HIGHEST_FOOTNOTE,
  GROK_QUALITY_SETTINGS,
  GROK_TABLE_FOOTNOTE,
  grokCellBackground,
  halfCredits,
  invoiceRowHalfTotal,
  invoiceTotals,
  RENDER_TIERS,
  RUNTIME_VERSIONS,
  SEEDANCE_BLENDED_FOOTNOTE,
  VIDEO_MODELS,
  videoModelCellSplit,
  grokSettingCellSplit,
} from './profit-expense';
import {
  fileBasename,
  grokSettingPricingIndex,
  PricingCrossReference,
  pricingTitle,
  RefMark,
  tierWording,
} from './shared';

const SUBTITLE = 'See the profit next to the expense for every line of making a movie.';

/** Em dash for a value not pinned down yet (all invoice rows are priced today; kept for future rows). */
const PENDING_CELL = '—';

/** Cost-table halves as a stacked pair — profit row first, then expense. */
const HALVES = ['profit', 'expense'];

/** Invoice order: the two EXPENSE invoices first, then the two PROFIT invoices. */
const HALVES_INVOICE_ORDER = ['expense', 'profit'];

/* ── Cost tables ─────────────────────────────────────────────────────────────────────────────── */

/**
 * One render-tier's PAIR of rows (profit then expense) for a cost table in `mode`
 * ("dollars" | "credits"). Dollars round UP per half on its own row; credits stay exact.
 */
function CostTierRows({ rendersPerShot, cellKeys, splits, mode, cellBackgrounds }) {
  const isCredits = mode === 'credits';
  return (
    <>
      {HALVES.map((half) => (
        <tr key={half}>
          <th scope="row" className={styles.rowHead}>
            {tierWording(rendersPerShot)}{' '}
            <span className={styles.halfTag}>({half})</span>
          </th>
          {splits.map((split, i) => {
            const value = halfCredits(split, half);
            return (
              <td
                key={cellKeys[i]}
                className={styles.cellNum}
                style={
                  cellBackgrounds?.[i]
                    ? { backgroundColor: cellBackgrounds[i] }
                    : undefined
                }
              >
                {isCredits ? formatCreditsNumber(value) : formatDollars(value)}
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
}

/**
 * One runtime version of the cost table (cols: Video Renders Per Shot × the four video models) in
 * `mode`. Each tier renders TWO rows (profit + expense), so the table has six data rows.
 */
function CostTable({ version, mode }) {
  return (
    <section className={styles.costSection}>
      <h4 className={styles.costHeading}>
        {version.minutes}-Minute Movie{' '}
        {mode === 'credits' ? (
          <span className={styles.costHeadingNormal}>— Credits</span>
        ) : (
          <span className={styles.costHeadingNormal}>
            (includes non-Video Invoice below)
          </span>
        )}
      </h4>

      <div className={styles.tableScroll}>
        <table className={styles.costTable}>
          <thead>
            <tr>
              <th>Video Renders Per Shot</th>
              {VIDEO_MODELS.map((model) => (
                <th key={model.key} className="num">
                  {model.label}
                  {model.blendedLastRender && '*'}
                  <RefMark index={model.pricingIndex} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RENDER_TIERS.map((tier) => {
              const splits = VIDEO_MODELS.map((model) =>
                videoModelCellSplit(model, tier.rendersPerShot, version.minutes),
              );
              return (
                <CostTierRows
                  key={tier.rendersPerShot}
                  rendersPerShot={tier.rendersPerShot}
                  cellKeys={VIDEO_MODELS.map((m) => m.key)}
                  splits={splits}
                  mode={mode}
                  cellBackgrounds={VIDEO_MODELS.map((m) =>
                    grokCellBackground(m.key, tier.rendersPerShot),
                  )}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      <p className={styles.keyLine}>
        <strong>Key:</strong> {buildKeyLine()}
      </p>
      <p className={styles.footnote}>{SEEDANCE_BLENDED_FOOTNOTE}</p>
    </section>
  );
}

/** Third table — Grok by quality setting (lowest / medium / highest*), profit + expense per tier. */
function GrokVersionsTable({ mode }) {
  return (
    <section className={styles.costSection}>
      <h4 className={styles.costHeading}>
        Grok — 90-Minute Movie{' '}
        {mode === 'credits' ? (
          <span className={styles.costHeadingNormal}>— Credits</span>
        ) : (
          <span className={styles.costHeadingNormal}>
            (includes non-Video Invoice below)
          </span>
        )}
      </h4>

      <div className={styles.tableScroll}>
        <table className={styles.costTable}>
          <thead>
            <tr>
              <th>Video Renders Per Shot</th>
              {GROK_QUALITY_SETTINGS.map((setting) => (
                <th key={setting.key} className="num">
                  <div>
                    {setting.label}
                    {setting.blendedLastRender && '*'}
                    <RefMark index={grokSettingPricingIndex(setting)} />
                  </div>
                  <div className={styles.colSub}>{setting.resolution}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RENDER_TIERS.map((tier) => {
              // The third table runs at the 90-minute runtime (its dictated default version).
              const splits = GROK_QUALITY_SETTINGS.map((setting) =>
                grokSettingCellSplit(setting, tier.rendersPerShot, 90),
              );
              return (
                <CostTierRows
                  key={tier.rendersPerShot}
                  rendersPerShot={tier.rendersPerShot}
                  cellKeys={GROK_QUALITY_SETTINGS.map((s) => s.key)}
                  splits={splits}
                  mode={mode}
                  cellBackgrounds={GROK_QUALITY_SETTINGS.map((s) =>
                    grokCellBackground(s.key, tier.rendersPerShot),
                  )}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      <p className={styles.footnote}>{GROK_HIGHEST_FOOTNOTE}</p>
      <p className={styles.footnote}>{GROK_TABLE_FOOTNOTE}</p>
    </section>
  );
}

/* ── Non-Videos Invoice ──────────────────────────────────────────────────────────────────────── */

/** One line item as a SINGLE row of `half` — the invoice's title carries which half it is. */
function InvoiceHalfRow({ row, half }) {
  const total = invoiceRowHalfTotal(row, half);
  const each = row.eachSplit == null ? null : halfCredits(row.eachSplit, half);
  return (
    <tr className={styles.invoiceRow}>
      <td>
        <div>{row.description}</div>
        <div className={styles.invoiceNote}>{row.note}</div>
        <div className={styles.invoiceSource} title={pricingTitle(row.pricingIndex)}>
          <strong>source:</strong> {fileBasename(row.pricingIndex.file)}
        </div>
      </td>
      <td className="num">
        {row.quantity == null ? PENDING_CELL : formatCreditsNumber(row.quantity)}
      </td>
      <td className="num">{each == null ? PENDING_CELL : formatCreditsNumber(each)}</td>
      <td className="num">
        {/* Each (dollars) carries its TRUE cents — not rounded up. */}
        {each == null ? PENDING_CELL : creditsToDollarsExact(each)}
      </td>
      <td className={`num ${styles.totalStrong}`}>
        {total == null ? (
          PENDING_CELL
        ) : (
          <>
            <div>{formatCreditsNumber(total)}</div>
            <div className={styles.totalDollarsSub}>{formatDollars(total)}</div>
          </>
        )}
      </td>
    </tr>
  );
}

/** The invoice-title / bar-label wording for a half. */
const HALF_TITLES = {
  expense: { title: 'Expenses', bar: 'Invoice expense total' },
  profit: { title: 'Profit', bar: 'Invoice profit total' },
};

/** One full-width invoice grand-total bar — label + credits on the left, dollars far right. */
function InvoiceTotalBar({ label, credits, emphasisClass }) {
  return (
    <tr>
      <td colSpan={5} className={styles.totalBarCell} style={{ borderTop: '1px solid #9CA3AF' }}>
        <div className={styles.totalBarRow}>
          <span className={styles.totalBarLabel}>
            {label}{' '}
            <span className={styles.totalBarCredits}>
              {formatCreditsNumber(credits)} credits
            </span>
          </span>
          <span className={`${styles.totalBarDollars} ${emphasisClass}`}>
            {formatDollars(credits)}
          </span>
        </div>
      </td>
    </tr>
  );
}

/**
 * One SINGLE-HALF Non-Videos Invoice — the same framed near-white card as the mockup, entirely
 * about one half: every line item is one row of that half, with ONE grand-total bar. The expense
 * and profit invoices of a runtime sum, row-for-row and bar-for-bar, to the Movie Costs invoice.
 */
function NonVideosInvoice({ version, half }) {
  const rows = buildInvoiceRowSplits(version.minutes);
  const totals = invoiceTotals(rows);

  return (
    <section className={styles.invoiceSection}>
      <h4 className={styles.invoiceTitle}>
        Non-Videos Invoice — {HALF_TITLES[half].title}: {version.minutes} Minute Movie
      </h4>

      <div className={styles.invoiceCard}>
        <table className={styles.invoiceTable}>
          <thead>
            <tr>
              <th>Description</th>
              <th className="num">Quantity</th>
              <th className="num">
                <div>Each</div>
                <div className={styles.unitHint}>(credits)</div>
              </th>
              <th className="num">
                <div>Each</div>
                <div className={styles.unitHint}>(dollars)</div>
              </th>
              <th className="num">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <InvoiceHalfRow key={row.key} row={row} half={half} />
            ))}
          </tbody>
          <tfoot>
            <InvoiceTotalBar
              label={HALF_TITLES[half].bar}
              credits={half === 'profit' ? totals.profit : totals.expense}
              emphasisClass={
                half === 'profit'
                  ? styles.totalBarDollarsProfit
                  : styles.totalBarDollarsExpense
              }
            />
          </tfoot>
        </table>
      </div>
    </section>
  );
}

/* ── Screen root ─────────────────────────────────────────────────────────────────────────────── */

export default function ProfitVsExpenses() {
  return (
    <div className={styles.screen}>
      <h3 className={styles.pageTitle}>Movie Profits vs. Expenses</h3>
      <p className={styles.subtitle}>{SUBTITLE}</p>

      {/* How the two halves are derived — split from the Movie Costs numbers, never invented. */}
      <div className={styles.computeNote}>
        <strong>How these numbers are computed.</strong> This is the sibling{' '}
        <em>Movie Costs</em> screen with <strong>every line of data split in two</strong> — a{' '}
        <strong>profit</strong> half and an <strong>expense</strong> half (stacked rows in the cost
        tables; whole single-half invoices below). The <em>expense</em> is what production costs
        ACT3: the per-video/per-image lines use <em>seedance_prices.yaml</em>&apos;s{' '}
        <em>price_without_profit</em> (480p $1.06, 720p $1.134, 1080p $5.655, 4k $11.664, Grok 720p
        $1.05, first-frame image $0.101), and the master credit-priced lines (script import,
        per-shot AI prompt, combine/final-merge) strip the baked-in ×1.30 markup (expense = value ÷
        1.30, rounded to the nearest 0.1 credit). The <em>profit</em> is the Movie Costs value
        minus that expense — so <strong>profit + expense equals the exact Movie Costs number</strong>{' '}
        on every line. Credits = dollars × 500.{' '}
        <strong>Dollars are rounded up to whole dollars per half</strong> (no cents); the credits
        tables stay exact.
      </div>

      {/* The two runtime versions of the cost table (90- and 120-minute), in DOLLARS. */}
      {RUNTIME_VERSIONS.map((version) => (
        <CostTable key={version.minutes} version={version} mode="dollars" />
      ))}

      {/* Third table — Grok by quality setting, in DOLLARS. */}
      <GrokVersionsTable mode="dollars" />

      {/* Bottom: FOUR single-half Non-Videos Invoices — the two EXPENSE invoices first (90 then
          120 minutes), then the two PROFIT invoices (90 then 120). */}
      <div className={styles.blockSection}>
        <h3 className={styles.blockTitle}>Non-Videos Invoice</h3>
        <p className={styles.blockIntro}>
          One-time and non-video costs of making a movie, as four invoices — the two{' '}
          <strong>expense</strong> invoices first (90- then 120-minute), then the two{' '}
          <strong>profit</strong> invoices. Each invoice is entirely about one half; per runtime,
          the expense and profit invoices sum — row for row and bar for bar — to the single Movie
          Costs invoice.
        </p>
        {HALVES_INVOICE_ORDER.map((half) =>
          RUNTIME_VERSIONS.map((version) => (
            <NonVideosInvoice
              key={`${half}-${version.minutes}`}
              version={version}
              half={half}
            />
          )),
        )}
      </div>

      {/* Very bottom: the three top tables again, in CREDITS only. */}
      <div className={styles.blockSection}>
        <h3 className={styles.blockTitle}>Credits tables</h3>
        <p className={styles.blockIntro}>
          The same three tables above, shown in credits instead of dollars — same doubled profit /
          expense rows. (The dollar tables are just these credit values × $0.002.)
        </p>
        {RUNTIME_VERSIONS.map((version) => (
          <CostTable key={version.minutes} version={version} mode="credits" />
        ))}
        <GrokVersionsTable mode="credits" />
      </div>

      
      {/* Hide the pricing-code cross-reference for now — it is a dev-only info.
      <PricingCrossReference
        extra={
          <>
            The profit/expense split changes only how each number is <em>shown</em>, never where it
            comes from: the expense halves read the same <em>seedance_prices.yaml</em>&apos;s{' '}
            <em>price_without_profit</em> column, and the credit-priced lines strip the master
            ×1.30 markup (math.mdx Addendum P2/P3).
          </>
        }
      /> */}

      {/* What is still to be confirmed — the screen documents its own gaps. */}
      <div className={styles.confirm}>
        <p className={styles.confirmTitle}>Still to confirm (resolve live from the catalog)</p>
        <ul className={styles.confirmList}>
          <li>
            The profit split for the credit-priced lines (script import, per-shot AI prompt,
            combine/final-merge) — specified as expense = value ÷ 1.30 rounded to 0.1 credit
            (math.mdx Addendum P3); YAML-priced lines use <em>price_without_profit</em> directly.
          </li>
          <li>Rounding of each half up to whole dollars (round-then-show); credits stay exact.</li>
          <li>
            The Script-import price basis (storyTotal 7,177 credits × shots/50) — confirm against
            the &apos;ai-script-import&apos; catalog literal if it differs.
          </li>
          <li>
            Everything Movie Costs still has open carries over (column-two Grok vs. Veo, the
            Seedance variant spellings, the researched resolutions/clip lengths, the medium-Grok
            term).
          </li>
        </ul>
      </div>
    </div>
  );
}
