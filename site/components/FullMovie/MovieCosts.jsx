/**
 * Movie Costs — ported from the internal mock app
 * (all/app/code/film/ui/mock/movie_costs/MovieCostsMockup.tsx) to plain JSX + a CSS module for the
 * docs site. The dev-only id-inspector wiring was dropped; everything the reader sees is identical
 * to the mock at /film/ui/mock/movie_costs.
 *
 * Title "Movie Costs"; the "Video Renders Per Shot" cost table (rows 1/3/5) in TWO runtime
 * versions (90- and 120-minute) with model columns Grok · Seedance 2.0 Mini · Seedance 2.0* ·
 * Seedance 2.0 4k* and a key line under each; a THIRD table breaking Grok out by quality setting.
 * The top three tables show DOLLARS only (one row per tier); three CREDITS-only copies sit at the
 * very bottom. Then the framed Non-Videos Invoice (two runtime versions) whose "Each" is split
 * into credits and dollars columns.
 *
 * THE MATH lives in ./cost-model.js, dollars-primary: the per-video dollar price comes straight
 * from seedance_prices.yaml (price_with_profit) × renders-per-shot × the number of 15-second clips
 * that fill the movie, plus the one-time Non-Videos invoice folded in; credits = dollars × 500.
 * Dollars are rounded UP to whole dollars (no cents); credits stay exact.
 */
import React from 'react';
import styles from './fullMovie.module.css';
import {
  buildInvoiceRows,
  buildKeyLine,
  creditsToDollarsExact,
  formatCreditsNumber,
  formatDollars,
  GROK_HIGHEST_FOOTNOTE,
  GROK_QUALITY_SETTINGS,
  GROK_TABLE_FOOTNOTE,
  grokCellBackground,
  grokSettingCellCredits,
  invoiceGrandTotal,
  invoiceRowTotal,
  RENDER_TIERS,
  RUNTIME_VERSIONS,
  SEEDANCE_BLENDED_FOOTNOTE,
  VIDEO_MODELS,
  videoModelCellCredits,
} from './cost-model';
import {
  fileBasename,
  grokSettingPricingIndex,
  PricingCrossReference,
  pricingTitle,
  RefMark,
  tierWording,
} from './shared';

const SUBTITLE = 'See what it costs to make a movie at each quality tier.';

/** Em dash used for any value the dictation has not pinned down yet (all invoice rows are priced). */
const PENDING_CELL = '—';

/**
 * One render-tier row in `mode` ("dollars" | "credits"). The cell math is always credits; a
 * dollars table just formats the same value at $0.002/credit. `cellBackgrounds` tints individual
 * cells (the Grok-column green highlight).
 */
function CostTierRow({ label, cellKeys, credits, mode, cellBackgrounds }) {
  const isCredits = mode === 'credits';
  return (
    <tr>
      <th scope="row" className={styles.rowHead}>
        {label} <span className={styles.halfTag}>({mode})</span>
      </th>
      {credits.map((value, i) => (
        <td
          key={cellKeys[i]}
          className={styles.cellNum}
          style={
            cellBackgrounds?.[i] ? { backgroundColor: cellBackgrounds[i] } : undefined
          }
        >
          {isCredits ? formatCreditsNumber(value) : formatDollars(value)}
        </td>
      ))}
    </tr>
  );
}

/**
 * One runtime version of the cost table (cols: Video Renders Per Shot × the four video models), in
 * `mode`: a dollars table for the top of the page, a credits table for the bottom. One row per tier.
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
              const credits = VIDEO_MODELS.map((model) =>
                videoModelCellCredits(model, tier.rendersPerShot, version.minutes),
              );
              return (
                <CostTierRow
                  key={tier.rendersPerShot}
                  label={tierWording(tier.rendersPerShot)}
                  cellKeys={VIDEO_MODELS.map((m) => m.key)}
                  credits={credits}
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

/** Third table — Grok by quality setting (lowest / medium / highest*), in `mode`. */
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
              const credits = GROK_QUALITY_SETTINGS.map((setting) =>
                grokSettingCellCredits(setting, tier.rendersPerShot, 90),
              );
              return (
                <CostTierRow
                  key={tier.rendersPerShot}
                  label={tierWording(tier.rendersPerShot)}
                  cellKeys={GROK_QUALITY_SETTINGS.map((s) => s.key)}
                  credits={credits}
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

/**
 * One Non-Videos Invoice — a framed, near-white card that lifts off the page, with the title above
 * the card. Columns: Description / Quantity / Each (credits) / Each (dollars) / Total. The grand
 * total is a full-width bar: label + credits pinned LEFT, the dollar amount FAR RIGHT.
 */
function NonVideosInvoice({ version }) {
  const rows = buildInvoiceRows(version.minutes);
  const grandTotal = invoiceGrandTotal(rows);

  return (
    <section className={styles.invoiceSection}>
      <h4 className={styles.invoiceTitle}>
        Non-Videos Invoice: {version.minutes} Minute Movie
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
            {rows.map((row) => {
              const total = invoiceRowTotal(row);
              return (
                <tr key={row.key} className={styles.invoiceRow}>
                  <td>
                    <div>{row.description}</div>
                    <div className={styles.invoiceNote}>{row.note}</div>
                    <div
                      className={styles.invoiceSource}
                      title={pricingTitle(row.pricingIndex)}
                    >
                      <strong>source:</strong> {fileBasename(row.pricingIndex.file)}
                    </div>
                  </td>
                  <td className="num">
                    {row.quantity == null
                      ? PENDING_CELL
                      : formatCreditsNumber(row.quantity)}
                  </td>
                  <td className="num">
                    {row.eachCredits == null
                      ? PENDING_CELL
                      : formatCreditsNumber(row.eachCredits)}
                  </td>
                  <td className="num">
                    {/* Each (dollars) carries its TRUE cents — not rounded up. */}
                    {row.eachCredits == null
                      ? PENDING_CELL
                      : creditsToDollarsExact(row.eachCredits)}
                  </td>
                  <td className={`num ${styles.totalStrong}`}>
                    {total == null ? (
                      PENDING_CELL
                    ) : (
                      <>
                        <div>{formatCreditsNumber(total)}</div>
                        <div className={styles.totalDollarsSub}>
                          {formatDollars(total)}
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan={5}
                className={styles.totalBarCell}
                style={{ borderTop: '1px solid #9CA3AF' }}
              >
                <div className={styles.totalBarRow}>
                  <span className={styles.totalBarLabel}>
                    Invoice total{' '}
                    <span className={styles.totalBarCredits}>
                      {grandTotal.credits == null
                        ? PENDING_CELL
                        : `${formatCreditsNumber(grandTotal.credits)} credits`}
                    </span>
                  </span>
                  <span
                    className={`${styles.totalBarDollars} ${styles.totalBarDollarsExpense}`}
                  >
                    {grandTotal.credits == null
                      ? PENDING_CELL
                      : formatDollars(grandTotal.credits)}
                  </span>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}

export default function MovieCosts() {
  return (
    <div className={styles.screen}>
      <h3 className={styles.pageTitle}>Movie Costs</h3>
      <p className={styles.subtitle}>{SUBTITLE}</p>

      {/* How the numbers are derived — dollars-primary from seedance_prices.yaml, not invented. */}
      <div className={styles.computeNote}>
        <strong>How these numbers are computed.</strong> Each cost cell is the per-video price from{' '}
        <em>seedance_prices.yaml</em> (the price <em>with profit</em> — markup already baked in),
        multiplied by renders-per-shot and the number of 15-second clips that fill the movie
        (movie&nbsp;length ÷ 15&nbsp;s → <em>360</em> clips at 90&nbsp;min,
        <em> 480</em> at 120&nbsp;min — both Grok and Seedance make 15-second videos), plus the
        one-time Non-Videos invoice folded in (first frames, per-shot AI prompt, character
        reference sheets for 20 digital actors, and the combine-&amp;-download final render).
        Credits = dollars × 500. <strong>Dollars are rounded up to whole dollars</strong> (no
        cents); the credits tables stay exact. Both starred columns (Seedance&nbsp;2.0 and 4k) are
        blended — only each shot&apos;s last render is the premium resolution; the rest use the
        cheapest Seedance. Grok&apos;s 480p/1080p prices borrow the Seedance per-resolution dollar.
        All five invoice rows are priced, so each cell folds in the full invoice.
      </div>

      {/* The two runtime versions of the cost table (90- and 120-minute), in DOLLARS. */}
      {RUNTIME_VERSIONS.map((version) => (
        <CostTable key={version.minutes} version={version} mode="dollars" />
      ))}

      {/* Third table — Grok by quality setting, in DOLLARS. */}
      <GrokVersionsTable mode="dollars" />

      {/* Bottom: the Non-Videos Invoice, one framed card per runtime. */}
      <div className={styles.blockSection}>
        <h3 className={styles.blockTitle}>Non-Videos Invoice</h3>
        <p className={styles.blockIntro}>
          One-time and non-video costs of making a movie — the work that runs once per project (or
          once per first pass), not a per-render video charge.
        </p>
        {RUNTIME_VERSIONS.map((version) => (
          <NonVideosInvoice key={version.minutes} version={version} />
        ))}
      </div>

      {/* Very bottom: the three top tables again, in CREDITS only. */}
      <div className={styles.blockSection}>
        <h3 className={styles.blockTitle}>Credits tables</h3>
        <p className={styles.blockIntro}>
          The same three tables above, shown in credits instead of dollars. (The dollar tables are
          just these credit values × $0.002.)
        </p>
        {RUNTIME_VERSIONS.map((version) => (
          <CostTable key={version.minutes} version={version} mode="credits" />
        ))}
        <GrokVersionsTable mode="credits" />
      </div>

      {/* The mandatory pricing-code cross-reference (full file paths + in-file locations). */}
      {/* Hide the pricing-code cross-reference for now — it is a dev-only info.
      <PricingCrossReference /> */}
    </div>
  );
}
