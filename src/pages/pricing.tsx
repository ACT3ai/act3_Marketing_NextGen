import type { ReactNode } from "react";
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
  highlighted?: boolean;
};

function PricingPlan({ name, price, period, description, features, cta, highlighted }: PlanProps) {
  return (
    <div className={clsx("col col--4")} style={{ marginBottom: "2rem" }}>
      <div style={{
        border: highlighted ? "2px solid var(--ifm-color-primary)" : "1px solid var(--ifm-color-emphasis-200)",
        borderRadius: 16,
        padding: "2.5rem 2rem",
        height: "100%",
        background: highlighted ? "linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(37, 99, 235, 0.05))" : "var(--ifm-background-surface-color)",
        position: "relative",
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
          }}>
            Most Popular
          </div>
        )}
        <Heading as="h3">{name}</Heading>
        <div style={{ marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "3rem", fontWeight: 900 }}>{price}</span>
          <span style={{ opacity: 0.6, marginLeft: 4 }}>{period}</span>
        </div>
        <p style={{ opacity: 0.75, marginBottom: "2rem" }}>{description}</p>
        <ul style={{ listStyle: "none", padding: 0, marginBottom: "2rem" }}>
          {features.map((f) => (
            <li key={f} style={{ marginBottom: "0.6rem", display: "flex", gap: "0.5rem" }}>
              <span style={{ color: "var(--ifm-color-primary)", fontWeight: 700 }}>✓</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <Link
          className={clsx("button button--lg", highlighted ? "button--primary" : "button--secondary")}
          to="https://act3ai.com"
          style={{ width: "100%", textAlign: "center" }}
        >
          {cta}
        </Link>
      </div>
    </div>
  );
}

const plans: PlanProps[] = [
  {
    name: "Creator",
    price: "$29",
    period: "/ month",
    description: "For individual creators and hobbyists getting started with AI filmmaking.",
    features: [
      "500 video credits / month",
      "Veo 3 & Runway access",
      "Beat & scene parser",
      "5 actor profiles",
      "HD export (1080p)",
      "Email support",
    ],
    cta: "Get Started",
  },
  {
    name: "Pro",
    price: "$99",
    period: "/ month",
    description: "For serious filmmakers and small studios producing content at scale.",
    features: [
      "2,500 video credits / month",
      "All AI models included",
      "Unlimited actor profiles",
      "4K export",
      "Blender sync",
      "Lip sync & mocap",
      "Priority generation queue",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    highlighted: true,
  },
  {
    name: "Studio",
    price: "$349",
    period: "/ month",
    description: "For agencies, studios, and teams producing professional film and video.",
    features: [
      "10,000 video credits / month",
      "All Pro features",
      "Team collaboration (10 seats)",
      "Custom actor training",
      "API access",
      "Commercial license",
      "Dedicated account manager",
      "SLA support",
    ],
    cta: "Contact Sales",
  },
];

export default function Pricing(): ReactNode {
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

          <div className="row" style={{ justifyContent: "center" }}>
            {plans.map((plan) => (
              <PricingPlan key={plan.name} {...plan} />
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "3rem", opacity: 0.7 }}>
            <p>All plans include a 14-day free trial. No credit card required to start.</p>
            <p>Need a custom plan? <Link to="/contact">Talk to our team →</Link></p>
          </div>
        </div>
      </main>
    </Layout>
  );
}
