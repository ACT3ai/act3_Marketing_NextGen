import { useState, type ReactNode } from "react";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import MovieCosts from "../components/FullMovie/MovieCosts";
import ProfitVsExpenses from "../components/FullMovie/ProfitVsExpenses";

const TABS = ["Movie Costs", "Movie Profits Vs Expenses"] as const;
type Tab = (typeof TABS)[number];

export default function MoviePricing(): ReactNode {
  const [activeTab, setActiveTab] = useState<Tab>("Movie Costs");

  return (
    <Layout
      title="Movie Pricing — ACT3 AI"
      description="Movie pricing for ACT3 AI."
    >
      <main style={{ padding: "4rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <Heading as="h1">Movie Pricing</Heading>
          </div>

          <div
            role="tablist"
            aria-label="Movie pricing sections"
            style={{
              display: "flex",
              justifyContent: "flex-start",
              gap: "0.5rem",
              marginBottom: "2.5rem",
              borderBottom: "1px solid var(--ifm-color-emphasis-200)",
            }}
          >
            {TABS.map((tab) => {
              const active = tab === activeTab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    background: "transparent",
                    border: "none",
                    borderBottom: active
                      ? "3px solid var(--ifm-color-primary)"
                      : "3px solid transparent",
                    color: active
                      ? "var(--ifm-color-primary)"
                      : "var(--ifm-font-color-base)",
                    fontWeight: active ? 700 : 500,
                    fontSize: "1.05rem",
                    padding: "0.75rem 1.5rem",
                    cursor: "pointer",
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {activeTab === "Movie Costs" && (
            <div role="tabpanel">
              <MovieCosts />
            </div>
          )}

          {activeTab === "Movie Profits Vs Expenses" && (
            <div role="tabpanel">
              <ProfitVsExpenses />
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}
