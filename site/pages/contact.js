"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Contact;
var Link_1 = require("@docusaurus/Link");
var Layout_1 = require("@theme/Layout");
var Heading_1 = require("@theme/Heading");
function ContactCard(_a) {
    var label = _a.label, email = _a.email, description = _a.description;
    return (<div style={{
            background: "var(--ifm-background-surface-color)",
            border: "1px solid var(--ifm-color-emphasis-200)",
            borderRadius: 12,
            padding: "1.75rem 2rem",
            marginBottom: "1rem",
        }}>
      <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>{label}</div>
      <a href={"mailto:".concat(email)} style={{ color: "var(--ifm-color-primary)", fontWeight: 600, fontSize: "1.05rem" }}>
        {email}
      </a>
      <p style={{ margin: "0.5rem 0 0", opacity: 0.7, fontSize: "0.95rem" }}>{description}</p>
    </div>);
}
function Contact() {
    return (<Layout_1.default title="Contact Us — ACT3 AI" description="Get in touch with the ACT3 AI team. We'd love to hear from you.">
      <main>
        {/* Hero */}
        <section style={{
            background: "linear-gradient(135deg, rgba(124, 58, 237, 0.12), rgba(37, 99, 235, 0.06))",
            padding: "5rem 0 4rem",
            borderBottom: "1px solid var(--ifm-color-emphasis-200)",
        }}>
          <div className="container" style={{ maxWidth: 700 }}>
            <Heading_1.default as="h1" style={{ fontSize: "2.75rem", lineHeight: 1.2, marginBottom: "1rem" }}>
              Contact Us
            </Heading_1.default>
            <p style={{ fontSize: "1.25rem", lineHeight: 1.75, opacity: 0.85, marginBottom: 0 }}>
              Have a question, a partnership idea, or just want to say hello? We'd love to hear from you.
              Reach out and our team will get back to you within 24 hours.
            </p>
          </div>
        </section>

        {/* Contact Cards */}
        <section style={{ padding: "4rem 0", borderBottom: "1px solid var(--ifm-color-emphasis-200)" }}>
          <div className="container" style={{ maxWidth: 700 }}>
            <Heading_1.default as="h2" style={{ marginBottom: "2rem" }}>Get in Touch</Heading_1.default>
            <ContactCard label="General Inquiries" email="hello@act3ai.com" description="Questions about the platform, features, or anything else."/>
            <ContactCard label="Sales & Partnerships" email="sales@act3ai.com" description="Studio deals, agency partnerships, volume pricing, and custom plans."/>
            <ContactCard label="Support" email="support@act3ai.com" description="Technical help, billing questions, and account issues."/>
            <p style={{ marginTop: "1.5rem", opacity: 0.65, fontSize: "0.95rem" }}>
              We typically respond within 1 business day.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "4rem 0" }}>
          <div className="container" style={{ maxWidth: 700 }}>
            <Heading_1.default as="h2" style={{ marginBottom: "1rem" }}>Ready to Start Creating?</Heading_1.default>
            <p style={{ lineHeight: 1.8, opacity: 0.8, marginBottom: "2rem" }}>
              You don't need to wait to get started. Sign up for free and begin turning your story
              into cinematic video — no credit card required.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link_1.default className="button button--primary button--lg" to="https://act3ai.com">
                Get Started Free
              </Link_1.default>
              <Link_1.default className="button button--secondary button--lg" to="/about">
                Learn About Us
              </Link_1.default>
            </div>
          </div>
        </section>
      </main>
    </Layout_1.default>);
}
