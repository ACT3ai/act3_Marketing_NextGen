/**
 * Shared pieces of the two Full Movie screens (Movie Costs and Movie Profits vs. Expenses) —
 * the pricing-code cross-reference helpers and footnotes section, ported from the internal
 * mock app's MovieCostsMockup.tsx.
 *
 * THE PRICING-CODE CROSS-REFERENCE RULE (MANDATORY): every cost cell and invoice row must index
 * the master ACT3 pricing code by FULL FILE PATH and the IN-FILE LOCATION where the value is
 * calculated. cost-model.js carries that on `pricingIndex`; these helpers SURFACE it in the UI as
 * inline annotations (a hover tooltip on each column header / invoice row) plus the consolidated
 * footnotes section (`PricingCrossReference`) at the bottom of each screen.
 */
import React from 'react';
import styles from './fullMovie.module.css';
import {
  buildInvoiceRows,
  GROK_QUALITY_SETTINGS,
  MASTER_CREDIT_MATH_DOC,
  MASTER_PRICING_FILE,
  RUNTIME_VERSIONS,
  SEEDANCE_PRICES_YAML,
  VIDEO_MODELS,
} from './cost-model';

/** Last path segment of a file path (the visible short name; the full path rides in the tooltip). */
export function fileBasename(path) {
  const p = path ?? SEEDANCE_PRICES_YAML;
  return p.split('/').pop() ?? p;
}

/** The hover-tooltip text for a pricing index: full file path on the first line, location next. */
export function pricingTitle(index) {
  return `${index.file ?? SEEDANCE_PRICES_YAML}\n${index.location}`;
}

/**
 * The Grok-versions table's columns do not carry a `pricingIndex` in cost-model.js, so synthesize
 * one from the fields they DO expose: the medium (720p) price is Grok's own `grok_prices`;
 * lowest/highest borrow the Seedance per-resolution dollar (`borrowedFromSeedance`).
 */
export function grokSettingPricingIndex(setting) {
  const res = setting.resolution.replace(/^~/, '');
  if (setting.borrowedFromSeedance) {
    return {
      file: SEEDANCE_PRICES_YAML,
      location: `Seedance_prices → ${res} price_with_profit (borrowed — no Grok-specific ${res} entry in the YAML yet)`,
    };
  }
  return {
    file: SEEDANCE_PRICES_YAML,
    location: 'grok_prices → 720p price_with_profit ($1.366; 15-second video, profit included)',
  };
}

/** Small superscript info marker whose hover tooltip carries the pricing-code cross-reference. */
export function RefMark({ index }) {
  return (
    <sup className={styles.refMark} title={pricingTitle(index)}>
      &#9432;
    </sup>
  );
}

/** "5 renders per shot" / "1 render per shot" — number, a space, then the words (never "/shot"). */
export function tierWording(rendersPerShot) {
  return `${rendersPerShot} ${rendersPerShot === 1 ? 'render' : 'renders'} per shot`;
}

/**
 * The consolidated Pricing-code cross-reference footnotes. Every cost-table column and every
 * invoice row is listed with the FULL master file path and the IN-FILE location where its value is
 * defined. `extra` appends an extra sentence to the intro paragraph — the Profit vs. Expenses
 * screen uses it to note that its expense halves read the SAME file's `price_without_profit`.
 */
export function PricingCrossReference({ extra }) {
  // The invoice sources are the same for both runtimes; read one to enumerate them.
  const invoiceRows = buildInvoiceRows(RUNTIME_VERSIONS[0].minutes);
  return (
    <section className={styles.crossRef}>
      <h3 className={styles.crossRefTitle}>Pricing-code cross-reference</h3>
      <p className={styles.crossRefIntro}>
        Mandatory rule: every cost cell and invoice row indexes the master ACT3 pricing code by{' '}
        <strong>full file path</strong> and <strong>in-file location</strong>. Nothing on this
        screen is hard-coded — per-video dollar prices come from <em>seedance_prices.yaml</em> (the
        definitive source); the dollar↔credit conversion, first-frame, and script-import values
        point at the master Pricing Details code. (Every header and invoice row above also carries
        this as a hover tooltip.)
        {extra ? <> {extra}</> : null}
      </p>

      <h4 className={styles.crossRefSub}>Master sources</h4>
      <ul className={styles.crossRefList}>
        <li>
          Per-video / image prices (definitive): <code>{SEEDANCE_PRICES_YAML}</code>
        </li>
        <li>
          Pricing Details component: <code>{MASTER_PRICING_FILE}</code>
        </li>
        <li>
          Backend credit-math (500 credits = $1): <code>{MASTER_CREDIT_MATH_DOC}</code>
        </li>
      </ul>

      <h4 className={styles.crossRefSub}>Cost-table columns (90/120-minute tables)</h4>
      <ul className={styles.crossRefList}>
        {VIDEO_MODELS.map((model) => (
          <li key={model.key}>
            <span className={styles.crossRefName}>{model.label}:</span>{' '}
            <code>{model.pricingIndex.file ?? SEEDANCE_PRICES_YAML}</code> —{' '}
            {model.pricingIndex.location}
          </li>
        ))}
      </ul>

      <h4 className={styles.crossRefSub}>Grok-versions table columns</h4>
      <ul className={styles.crossRefList}>
        {GROK_QUALITY_SETTINGS.map((setting) => {
          const index = grokSettingPricingIndex(setting);
          return (
            <li key={setting.key}>
              <span className={styles.crossRefName}>{setting.label}:</span>{' '}
              <code>{index.file}</code> — {index.location}
            </li>
          );
        })}
      </ul>

      <h4 className={styles.crossRefSub}>Non-Videos Invoice rows</h4>
      <ul className={styles.crossRefList}>
        {invoiceRows.map((row) => (
          <li key={row.key}>
            <span className={styles.crossRefName}>{row.description}:</span>{' '}
            <code>{row.pricingIndex.file ?? SEEDANCE_PRICES_YAML}</code> —{' '}
            {row.pricingIndex.location}
          </li>
        ))}
      </ul>
    </section>
  );
}
