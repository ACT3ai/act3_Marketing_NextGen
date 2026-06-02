import { useState, type ReactNode } from "react";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import clsx from "clsx";

type PlanProps = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  ctaHref: string;
  highlighted?: boolean;
  additional?: boolean;
};

function PricingPlan({ name, price, period, description, features, cta, ctaHref, highlighted }: PlanProps) {
  return (
    <div style={{
      border: highlighted ? "2px solid var(--ifm-color-primary)" : "1px solid var(--ifm-color-emphasis-200)",
      borderRadius: 16,
      padding: "2rem 1.5rem",
      background: highlighted ? "linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(37, 99, 235, 0.05))" : "var(--ifm-background-surface-color)",
      position: "relative",
      display: "flex",
      flexDirection: "column",
    }}>
      {highlighted && (
        <div style={{
          position: "absolute",
          top: -14,
          left: "50%",
          transform: "translateX(-50%)",
          background: "var(--ifm-color-primary)",
          color: "white",
          padding: "0.25rem 1rem",
          borderRadius: 100,
          fontSize: "0.8rem",
          fontWeight: 700,
          whiteSpace: "nowrap",
        }}>
          Most Popular
        </div>
      )}
      <Heading as="h3" style={{ marginBottom: "0.75rem" }}>{name}</Heading>
      <div style={{ marginBottom: "0.5rem" }}>
        <span style={{ fontSize: "2.4rem", fontWeight: 900 }}>{price}</span>
        <span style={{ opacity: 0.6, marginLeft: 4 }}>{period}</span>
      </div>
      {description && (
        <p style={{ opacity: 0.75, marginBottom: "1.5rem", fontSize: "0.95rem" }}>{description}</p>
      )}
      <ul style={{ listStyle: "none", padding: 0, marginBottom: "1.5rem", flexGrow: 1 }}>
        {features.map((f) => (
          <li key={f} style={{ marginBottom: "0.6rem", display: "flex", gap: "0.5rem" }}>
            <span style={{ color: "var(--ifm-color-primary)", fontWeight: 700 }}>✓</span>
            <span style={{ fontSize: "0.95rem" }}>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        className={clsx("button button--lg", highlighted ? "button--primary" : "button--secondary")}
        to={ctaHref}
        style={{ width: "100%", textAlign: "center" }}
      >
        {cta}
      </Link>
    </div>
  );
}

const PLANS_HREF = "https://app.act3ai.com/settings/plans/";
const SIGNUP_HREF = "https://app.act3ai.com/signup/";
const ENTERPRISE_HREF = "mailto:ContactUs@ACT3ai.com";

// Carry the chosen plan to the app so the selection is remembered through the
// login redirect and the user lands straight on checkout (not the plan list).
function planHref(name: string): string {
  return `${PLANS_HREF}?plan=${encodeURIComponent(name)}`;
}

const plans: PlanProps[] = [
  {
    name: "Free",
    price: "$0",
    period: "/ mo",
    description: "Try ACT 3 with a generous monthly credit allowance.",
    features: [
      "800 credits / month",
      "0 credit rollover bank",
      "Cloud Storage 50 MB",
    ],
    cta: "Sign Up Free",
    ctaHref: SIGNUP_HREF,
  },
  // {
  //   name: "Starter",
  //   price: "$19",
  //   period: "/ mo",
  //   description: "Step up your output with rollover credits and more storage.",
  //   features: [
  //     "9,500 credits / month",
  //     "23,750 credit rollover bank",
  //     "Cloud Storage 2 GB",
  //   ],
  //   cta: "Get Started",
  //   ctaHref: PLANS_HREF,
  // },
  {
    name: "Creator",
    price: "$49",
    period: "/ mo",
    description: "For individual creators producing content regularly.",
    features: [
      "24,500 credits / month",
      "61,250 credit rollover bank",
      "Cloud Storage 50 GB",
    ],
    cta: "Get Started",
    ctaHref: PLANS_HREF,
    highlighted: true,
  },
  {
    name: "Pro",
    price: "$175",
    period: "/ mo",
    description: "For serious filmmakers and small studios producing at scale.",
    features: [
      "87,500 credits / month",
      "218,750 credit rollover bank",
      "Cloud Storage 740 GB",
      "All AI Video Models",
      "AI Generative with Blender",
      "3D Sets with Blender",
      "4K (Upscale)",
      "Priority Rendering",
      "Unlimited Digital Actors",
    ],
    cta: "Get Started",
    ctaHref: PLANS_HREF,
  },
  {
    name: "Advanced Edition",
    price: "$395",
    period: "/ mo",
    description: "",
    features: [
      "197,500 credits / month",
      "493,750 credit rollover bank",
      "Cloud Storage 1.6 TB",
    ],
    cta: "Select",
    ctaHref: PLANS_HREF,
    additional: true,
  },
  {
    name: "Premiere Edition",
    price: "$795",
    period: "/ mo",
    description: "",
    features: [
      "397,500 credits / month",
      "993,750 credit rollover bank",
      "Cloud Storage 1.6 TB",
    ],
    cta: "Select",
    ctaHref: PLANS_HREF,
    additional: true,
  },
  {
    name: "Blockbuster Edition",
    price: "$1,950",
    period: "/ mo",
    description: "",
    features: [
      "975,000 credits / month",
      "2,437,500 credit rollover bank",
      "Cloud Storage 3.3 TB",
    ],
    cta: "Select",
    ctaHref: PLANS_HREF,
    additional: true,
  },
  {
    name: "Visionary Edition",
    price: "$8,900",
    period: "/ mo",
    description: "",
    features: [
      "4,450,000 credits / month",
      "11,125,000 credit rollover bank",
      "Cloud Storage 8.2 TB",
    ],
    cta: "Select",
    ctaHref: PLANS_HREF,
    additional: true,
  },
  {
    name: "Iconic Edition",
    price: "$49,000",
    period: "/ mo",
    description: "",
    features: [
      "24,500,000 credits / month",
      "61,250,000 credit rollover bank",
      "Cloud Storage 208 TB",
    ],
    cta: "Select",
    ctaHref: PLANS_HREF,
    additional: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For agencies, studios, and teams producing professional content.",
    features: [
      "High Credits / month",
      "High rollover bank",
      "High Cloud Storage",
    ],
    cta: "Contact Us",
    ctaHref: ENTERPRISE_HREF,
  },
];

export default function Pricing(): ReactNode {
  const [showAdditional, setShowAdditional] = useState(false);
  const visiblePlans = showAdditional ? plans : plans.filter((p) => !p.additional);

  return (
    <Layout
      title="Pricing — ACT3 AI"
      description="Simple, transparent pricing for AI filmmaking. From indie creators to Hollywood studios."
    >
      <main style={{ padding: "4rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <Heading as="h1">Simple, Transparent Pricing</Heading>
            <p style={{ fontSize: "1.25rem", opacity: 0.75, maxWidth: 550, margin: "0 auto" }}>
              Start free. Scale as you create. No hidden fees, no surprise bills.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.25rem",
            alignItems: "stretch",
          }}>
            {visiblePlans.map((plan) => (
              <PricingPlan
                key={plan.name}
                {...plan}
                ctaHref={plan.ctaHref === PLANS_HREF ? planHref(plan.name) : plan.ctaHref}
              />
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button
              type="button"
              onClick={() => setShowAdditional((v) => !v)}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--ifm-color-primary)",
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: "pointer",
                padding: "0.5rem 1rem",
              }}
            >
              {showAdditional ? "▲ Show Less Plans" : "▼ Show Additional Plans"}
            </button>
          </div>

          <div style={{ textAlign: "center", marginTop: "2rem", opacity: 0.7 }}>
            <p>All paid plans include a 14-day free trial. No credit card required to start.</p>
            <p>Need a custom plan? <Link to="/contact">Talk to our team →</Link></p>
          </div>
        </div>
      </main>
    </Layout>
  );
}
