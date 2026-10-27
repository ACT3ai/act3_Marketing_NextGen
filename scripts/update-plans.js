// ─────────────────────────────────────────────────────────────────────────────
// Refresh site/data/plans.json, the plan catalog behind /pricing and the price
// line in llms.txt, from the live app's public plan list.
//
//   node scripts/update-plans.js            (or: pnpm update-plans)
//
// Source: GET https://api.act3ai.com/plans, the same unauthenticated endpoint the
// app's plans page (https://app.act3ai.com/settings/plans/) reads for a guest
// (appsrv PlanController.productPlans; appclient usePlanControllerProductPlans).
// The prices live in Stripe; appsrv syncs them into that list.
//
// NOT part of `pnpm build`: the build never depends on the network. Run this when
// a price changes, review the diff, commit. The page shows the `asOf` date.
// Shaping mirrors the app: "Starter" is hidden (retired), plans sort by `order`,
// storage is formatted from metadata.storage like formatPlanStorage().
// ─────────────────────────────────────────────────────────────────────────────
const fs = require("node:fs");
const path = require("node:path");

const SOURCE = "https://api.act3ai.com/plans";
const OUT = path.join(__dirname, "..", "site/data/plans.json");

/** The app's formatPlanStorage (act3ai-appclient src/@util/helpers.ts). */
function formatPlanStorage(bytes) {
  let value = Number(bytes);
  if (!Number.isFinite(value) || value <= 0) return null;
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  return `${Number(value.toFixed(1))} ${units[i]}`;
}

const num = (v) => (v === undefined || v === null || v === "" ? null : Number(v));

async function main() {
  const res = await fetch(SOURCE, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`${SOURCE} answered ${res.status}`);
  const body = await res.json();
  const plans = (body.items || [])
    .filter((p) => p.active && String(p.name || "").trim().toLowerCase() !== "starter")
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((p) => {
      const m = p.metadata || {};
      const contactUs = p.name === "Enterprise"; // the app shows "Contact Us" instead of a price
      return {
        name: p.name,
        order: p.order,
        priceUsd: contactUs ? null : Number(p.priceAmount),
        period: contactUs ? null : p.frequency === "/mo" ? "month" : p.frequency,
        creditsPerMonth: num(m.credits),
        rolloverBankCredits: contactUs ? null : num(m.rolloverCredits) ?? 0,
        storage: formatPlanStorage(m.storage),
        firstMonthsOnly: num(m.limitedForMonths),
        contactUs,
        description: p.description,
      };
    });
  const asOf = new Date().toLocaleDateString("en-CA"); // local YYYY-MM-DD
  fs.writeFileSync(OUT, JSON.stringify({ source: SOURCE, plansPage: "https://app.act3ai.com/settings/plans/", asOf, plans }, null, 2) + "\n");
  console.log(`[plans] wrote ${path.relative(process.cwd(), OUT)}: ${plans.length} plans, as of ${asOf}`);
}

main().catch((err) => {
  console.error(`[plans] ${err.message}`);
  process.exit(1);
});
