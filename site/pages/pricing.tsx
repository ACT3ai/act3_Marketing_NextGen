// /pricing — the public price list, on the v4 template (V4Blocks inside Docusaurus <Layout>).
//
// Every number on this page comes from site/data/plans.json, a dated snapshot of the
// app's public plan list (GET https://api.act3ai.com/plans, the list the app's own plans
// page shows a guest). Refresh it with `node scripts/update-plans.js`; never type a
// price here. Subscribing happens in the app (LINKS.plans).
import React from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import { V4Hero, V4Section, V4CardGrid, V4Card, V4Prose, V4CtaBand } from "../components/v4/V4Blocks";
import { LINKS } from "../data/siteNav";
import catalog from "../data/plans.json";

type Plan = {
  name: string;
  order: number;
  priceUsd: number | null;
  period: string | null;
  creditsPerMonth: number | null;
  rolloverBankCredits: number | null;
  storage: string | null;
  firstMonthsOnly: number | null;
  contactUs: boolean;
  description: string;
};

const PLANS = catalog.plans as Plan[];
const AS_OF = catalog.asOf;
const URL = "https://act3ai.com/pricing";

const usd = (n: number): string =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 });
const count = (n: number): string => n.toLocaleString("en-US");

/** "As of October 26, 2026" from the snapshot's YYYY-MM-DD. */
const asOfLong = new Date(`${AS_OF}T00:00:00Z`).toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

const priced = PLANS.filter((p) => p.priceUsd !== null);
const paid = priced.filter((p) => (p.priceUsd ?? 0) > 0);
const lowestPaid = paid.reduce<Plan | null>((lo, p) => (!lo || (p.priceUsd ?? 0) < (lo.priceUsd ?? 0) ? p : lo), null);
const free = priced.find((p) => p.priceUsd === 0);

/** The feature lines of a plan's description beyond credits, bank and storage (e.g. Pro's). */
const extras = (p: Plan): string[] =>
  p.description
    .split("***")
    .map((s) => s.trim())
    .filter((s) => s && !/credits \/ month|rollover bank|cloud storage/i.test(s));

/** Product + one Offer per priced plan, from the same snapshot (Enterprise has no list price). */
const productLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "ACT 3 AI",
  description: "AI filmmaking platform: script to storyboards, first frames and video, with plans billed monthly in credits.",
  url: URL,
  brand: { "@type": "Brand", name: "ACT 3 AI" },
  offers: priced.map((p) => ({
    "@type": "Offer",
    name: `${p.name} plan`,
    price: (p.priceUsd ?? 0).toFixed(2),
    priceCurrency: "USD",
    url: LINKS.plans,
    availability: "https://schema.org/InStock",
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: (p.priceUsd ?? 0).toFixed(2),
      priceCurrency: "USD",
      unitCode: "MON",
      referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
    },
    description: `${count(p.creditsPerMonth ?? 0)} credits a month${p.storage ? `, ${p.storage} cloud storage` : ""}.`,
  })),
};

// Page-scoped table styling; tokens from the v4 template. Lives in <Head>.
const PAGE_CSS = `
.pr-table-wrap { overflow-x: auto; }
.pr-table { width: 100%; border-collapse: collapse; font-size: 16px; }
.pr-table th, .pr-table td { padding: 12px 14px; text-align: left; border-bottom: 1px solid var(--v4t-line); white-space: nowrap; }
.pr-table th { font-family: var(--v4t-display); letter-spacing: 0.04em; text-transform: uppercase; font-size: 14px; color: var(--v4t-muted); }
.pr-table td.num, .pr-table th.num { text-align: right; font-variant-numeric: tabular-nums; }
.pr-note { margin-top: 16px; font-size: 15px; color: var(--v4t-muted); }
.pr-feat { margin: 12px 0 0; padding-left: 18px; font-size: 15px; }
`;

export default function Pricing(): React.ReactNode {
  return (
    // No manual site-name suffix: Docusaurus appends " | ACT 3 AI" itself.
    <Layout
      title="Pricing: AI Filmmaking Plans and Credits"
      description={`ACT 3 AI plans as of ${asOfLong}: a free plan${lowestPaid ? `, paid plans from ${usd(lowestPaid.priceUsd ?? 0)} a month` : ""}, monthly credits, a rollover bank and cloud storage.`}
    >
      <Head>
        <style>{PAGE_CSS}</style>
        <script type="application/ld+json">{JSON.stringify(productLd)}</script>
      </Head>
      <main>
        <V4Hero
          eyebrow="Pricing"
          title="Plans and"
          highlight="credits."
          sub={`Prices as of ${asOfLong}, in US dollars a month. The app's plans page is always current.`}
          cta={{ label: "See plans in the app", href: LINKS.plans }}
        />

        <V4Section tone="raised" eyebrow="How much does ACT 3 cost" heading="The short" highlight="answer.">
          <V4Prose>
            <p>
              {free ? (
                <>
                  ACT 3 AI has a <strong>free plan</strong> with {count(free.creditsPerMonth ?? 0)} credits a month
                  {free.firstMonthsOnly ? `, available for your first ${free.firstMonthsOnly} months after sign-up` : ""}.{" "}
                </>
              ) : null}
              {lowestPaid ? (
                <>
                  Paid plans start at <strong>{usd(lowestPaid.priceUsd ?? 0)} a month</strong> ({lowestPaid.name},{" "}
                  {count(lowestPaid.creditsPerMonth ?? 0)} credits a month). Larger teams and studios can contact us for an
                  Enterprise plan.
                </>
              ) : null}
            </p>
            <p>
              Credits pay for the AI work: script generation, storyboards and first frames, video shots, 3D set
              rendering and voices. The cost of an action is shown before you run it. Credits you do not use in a month move to your rollover
              bank, up to your plan&apos;s limit, and are spent after the month&apos;s own credits.
            </p>
          </V4Prose>
        </V4Section>

        <V4Section eyebrow="Plans" heading="Pick a" highlight="plan.">
          <V4CardGrid min={240}>
            {PLANS.map((p) => (
              <V4Card
                key={p.name}
                eyebrow={p.contactUs ? "Contact us" : `${usd(p.priceUsd ?? 0)} / month`}
                title={p.name}
                text={
                  p.contactUs
                    ? "High monthly credits, a high rollover bank and high cloud storage, set up with our team."
                    : `${count(p.creditsPerMonth ?? 0)} credits a month · ${count(p.rolloverBankCredits ?? 0)} credit rollover bank${p.storage ? ` · ${p.storage} cloud storage` : ""}${p.firstMonthsOnly ? ` · for your first ${p.firstMonthsOnly} months after sign-up` : ""}`
                }
                href={p.contactUs ? "/contact" : LINKS.plans}
              >
                {extras(p).length > 0 && !p.contactUs ? (
                  <ul className="pr-feat">
                    {extras(p).map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                ) : null}
              </V4Card>
            ))}
          </V4CardGrid>
        </V4Section>

        <V4Section tone="raised" eyebrow="Compare" heading="Every plan," highlight="side by side.">
          <div className="pr-table-wrap">
            <table className="pr-table">
              <caption className="pr-note" style={{ captionSide: "bottom", textAlign: "left" }}>
                As of {asOfLong}. Prices in US dollars, billed monthly. Current prices, checkout and plan changes:{" "}
                <a href={LINKS.plans}>the plans page in the app</a>.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Plan</th>
                  <th scope="col" className="num">Price / month</th>
                  <th scope="col" className="num">Credits / month</th>
                  <th scope="col" className="num">Rollover bank</th>
                  <th scope="col" className="num">Cloud storage</th>
                </tr>
              </thead>
              <tbody>
                {PLANS.map((p) => (
                  <tr key={p.name}>
                    <th scope="row">{p.name}</th>
                    <td className="num">{p.contactUs ? <a href="/contact">Contact us</a> : usd(p.priceUsd ?? 0)}</td>
                    <td className="num">{p.creditsPerMonth !== null ? count(p.creditsPerMonth) : "High"}</td>
                    <td className="num">{p.rolloverBankCredits !== null ? count(p.rolloverBankCredits) : "High"}</td>
                    <td className="num">{p.storage ?? "High"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </V4Section>

        <V4CtaBand />
      </main>
    </Layout>
  );
}
