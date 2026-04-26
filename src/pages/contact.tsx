import type { ReactNode } from "react";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

export default function Contact(): ReactNode {
  return (
    <Layout
      title="Contact — ACT3 AI"
      description="Get in touch with the ACT3 AI team."
    >
      <main style={{ padding: "4rem 0" }}>
        <div className="container" style={{ maxWidth: 600 }}>
          <Heading as="h1">Contact Us</Heading>
          <p style={{ fontSize: "1.1rem", opacity: 0.8, marginBottom: "2rem" }}>
            Have questions about ACT3 AI? We'd love to hear from you.
          </p>
          <div style={{
            background: "var(--ifm-background-surface-color)",
            border: "1px solid var(--ifm-color-emphasis-200)",
            borderRadius: 12,
            padding: "2rem",
          }}>
            <p><strong>General Inquiries:</strong> hello@act3ai.com</p>
            <p><strong>Sales & Partnerships:</strong> sales@act3ai.com</p>
            <p><strong>Support:</strong> support@act3ai.com</p>
            <p style={{ marginTop: "1.5rem", opacity: 0.7 }}>
              We typically respond within 1 business day.
            </p>
          </div>
        </div>
      </main>
    </Layout>
  );
}
