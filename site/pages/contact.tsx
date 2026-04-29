import React, { useState } from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import PageHero from "../components/PageHero";

const PAGE_CSS = `
/* ===== Design Tokens ===== */
.contact-page {
  --bg: #faf8f3;
  --bg-2: #f3efe5;
  --bg-3: #ebe5d6;
  --ink: #1a1714;
  --ink-2: #4a4540;
  --ink-3: #837c72;
  --line: #e2dccb;
  --line-2: #d4ccb6;
  --accent: #c4612b;
  --accent-ink: #ffffff;
  --accent-soft: #f3e2d2;
  --paper: #ffffff;
  --maxw: 1100px;
  --pad-x: clamp(20px, 4vw, 56px);
  --radius: 8px;
  --radius-lg: 14px;
  --font-display: "Fraunces", "Times New Roman", serif;
  --font-body: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;
  font-family: var(--font-body);
  color: var(--ink);
  background: var(--bg);
}

.contact-page *, .contact-page *::before, .contact-page *::after { box-sizing: border-box; }
.contact-page h1, .contact-page h2, .contact-page h3 { margin: 0; }
.contact-page p { margin: 0; }

/* ===== Body layout ===== */
.contact-body {
  padding: clamp(56px, 7vw, 96px) var(--pad-x);
  background: var(--bg);
}
.contact-body__inner {
  max-width: var(--maxw);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: clamp(40px, 5vw, 72px);
  align-items: start;
}
@media (max-width: 900px) {
  .contact-body__inner {
    grid-template-columns: 1fr;
  }
}

/* ===== Form section ===== */
.contact-form-wrap {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: clamp(28px, 4vw, 48px);
}
.contact-form-wrap h2 {
  font-family: var(--font-display);
  font-size: clamp(24px, 3vw, 34px);
  font-weight: 400;
  letter-spacing: -0.02em;
  margin-bottom: 28px;
  color: var(--ink);
}
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.contact-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 560px) {
  .contact-row { grid-template-columns: 1fr; }
}
.contact-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.contact-field label {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ink);
  letter-spacing: 0.01em;
  font-family: var(--font-mono);
  text-transform: uppercase;
}
.contact-field input,
.contact-field textarea,
.contact-field select {
  width: 100%;
  padding: 11px 14px;
  border: 1.5px solid var(--line-2);
  border-radius: var(--radius);
  font-size: 15px;
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--ink);
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.contact-field input:focus,
.contact-field textarea:focus,
.contact-field select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px color-mix(in oklab, #c4612b 15%, transparent);
  background: var(--paper);
}
.contact-field textarea {
  resize: vertical;
  min-height: 140px;
  line-height: 1.6;
}
.contact-field select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M6 9l6 6 6-6' stroke='%23837c72' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 38px;
  cursor: pointer;
}

.contact-submit {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--ink);
  color: var(--bg);
  font-weight: 500;
  font-size: 15px;
  padding: 14px 28px;
  border: 1px solid transparent;
  border-radius: 999px;
  cursor: pointer;
  font-family: var(--font-body);
  letter-spacing: -0.005em;
  transition: background 0.15s, transform 0.15s, box-shadow 0.2s;
  align-self: flex-start;
  box-shadow: 0 1px 0 rgba(0,0,0,.04), 0 8px 24px -12px rgba(0,0,0,.4);
}
.contact-submit:hover:not(:disabled) {
  background: var(--accent);
  transform: translateY(-1px);
}
.contact-submit:disabled {
  background: var(--ink-3);
  cursor: not-allowed;
  transform: none;
}
.contact-submit .arrow {
  display: inline-block;
  transition: transform 0.2s;
}
.contact-submit:hover:not(:disabled) .arrow {
  transform: translateX(3px);
}

/* ===== Success state ===== */
.contact-success {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 48px 36px;
  text-align: center;
}
.contact-success__icon {
  width: 56px;
  height: 56px;
  border-radius: 999px;
  background: var(--accent);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}
.contact-success h3 {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 400;
  color: var(--ink);
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}
.contact-success p {
  color: var(--ink-2);
  font-size: 15.5px;
  line-height: 1.6;
  max-width: 44ch;
  margin: 0 auto;
}
.contact-success a {
  color: var(--accent);
  text-decoration: underline;
}

/* ===== Sidebar info ===== */
.contact-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.contact-info-card {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 28px 24px;
}
.contact-info-card h3 {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 400;
  letter-spacing: -0.02em;
  color: var(--ink);
  margin-bottom: 20px;
}
.contact-info-row {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 0;
  border-top: 1px solid var(--line);
}
.contact-info-row:first-of-type {
  border-top: none;
  padding-top: 0;
}
.contact-info-icon {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 16px;
}
.contact-info-label {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-3);
  margin-bottom: 4px;
}
.contact-info-value {
  font-size: 14.5px;
  color: var(--ink-2);
  line-height: 1.5;
}
.contact-info-value a {
  color: var(--accent);
  text-decoration: underline;
}
.contact-info-value a:hover {
  color: var(--ink);
}

/* ===== Enterprise card ===== */
.contact-enterprise-card {
  background: var(--ink);
  color: var(--bg);
  border-radius: var(--radius-lg);
  padding: 28px 24px;
  position: relative;
  overflow: hidden;
}
.contact-enterprise-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(600px 300px at 100% 100%, color-mix(in oklab, #c4612b 25%, transparent), transparent 60%);
  pointer-events: none;
}
.contact-enterprise-card__inner { position: relative; z-index: 1; }
.contact-enterprise-card__label {
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: color-mix(in oklab, var(--bg) 60%, transparent);
  margin-bottom: 12px;
}
.contact-enterprise-card h3 {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 400;
  letter-spacing: -0.02em;
  color: var(--bg);
  margin-bottom: 10px;
}
.contact-enterprise-card p {
  font-size: 14px;
  color: color-mix(in oklab, var(--bg) 75%, transparent);
  line-height: 1.55;
  margin-bottom: 20px;
}
.contact-enterprise-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--accent);
  color: white;
  font-weight: 500;
  font-size: 13.5px;
  padding: 10px 20px;
  border-radius: 999px;
  text-decoration: none;
  transition: filter 0.15s, transform 0.15s;
}
.contact-enterprise-btn:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
  color: white;
  text-decoration: none;
}
.contact-enterprise-btn .arrow {
  display: inline-block;
  transition: transform 0.2s;
}
.contact-enterprise-btn:hover .arrow {
  transform: translateX(3px);
}
`;

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  subject: string;
  message: string;
};

export default function Contact(): React.ReactNode {
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const { firstName, lastName, email, company, subject, message } = form;
    const body = [
      `Name: ${firstName} ${lastName}`,
      `Email: ${email}`,
      `Company: ${company || "Not provided"}`,
      `Subject: ${subject}`,
      ``,
      `Message:`,
      message,
    ].join("\n");

    const mailtoUrl =
      `mailto:contactus@act3ai.com` +
      `?subject=${encodeURIComponent("Contact Form: " + subject)}` +
      `&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;

    setTimeout(() => {
      setSubmitted(true);
      setSubmitting(false);
    }, 800);
  }

  return (
    <Layout
      title="Contact Us — ACT3 AI"
      description="Have questions about ACT 3? Need technical support? Want to explore enterprise solutions? We're here to help."
    >
      <Head>
        <style>{PAGE_CSS}</style>
      </Head>
      <PageHero
        label="— Get in Touch"
        title={<>Let's Talk About<br /><em>Your Next Film.</em></>}
        description="Have questions about ACT 3? Need technical support? Want to explore enterprise solutions? We're here to help you bring your creative vision to life."
      />

      <div className="contact-page">

        {/* Body */}
        <section className="contact-body">
          <div className="contact-body__inner">

            {/* Form column */}
            <div>
              {submitted ? (
                <div className="contact-success">
                  <div className="contact-success__icon" aria-hidden="true">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M4.5 12.5l4.5 4.5L19.5 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3>Message Sent!</h3>
                  <p>
                    Your email client should have opened with your message pre-filled.
                    If it didn't, email us directly at{" "}
                    <a href="mailto:contactus@act3ai.com">contactus@act3ai.com</a>.
                    We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <div className="contact-form-wrap">
                  <h2>Send Us a Message</h2>
                  <form className="contact-form" onSubmit={handleSubmit}>

                    <div className="contact-row">
                      <div className="contact-field">
                        <label htmlFor="firstName">First Name *</label>
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          placeholder="Jane"
                          value={form.firstName}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="contact-field">
                        <label htmlFor="lastName">Last Name *</label>
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          required
                          placeholder="Smith"
                          value={form.lastName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="contact-row">
                      <div className="contact-field">
                        <label htmlFor="email">Email Address *</label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="jane@studio.com"
                          value={form.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="contact-field">
                        <label htmlFor="company">Company</label>
                        <input
                          id="company"
                          name="company"
                          type="text"
                          placeholder="Studio Name (optional)"
                          value={form.company}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="contact-field">
                      <label htmlFor="subject">Subject *</label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={form.subject}
                        onChange={handleChange}
                      >
                        <option value="">Select a subject…</option>
                        <option value="General Question">General Question</option>
                        <option value="Technical Support">Technical Support</option>
                        <option value="Sales & Partnerships">Sales &amp; Partnerships</option>
                        <option value="Enterprise Inquiry">Enterprise Inquiry</option>
                        <option value="Press & Media">Press &amp; Media</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="contact-field">
                      <label htmlFor="message">Message *</label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        placeholder="Tell us how we can help…"
                        value={form.message}
                        onChange={handleChange}
                      />
                    </div>

                    <button
                      type="submit"
                      className="contact-submit"
                      disabled={submitting}
                    >
                      {submitting ? "Opening email client…" : "Send Message"}
                      <span className="arrow">→</span>
                    </button>

                  </form>
                </div>
              )}
            </div>

            {/* Sidebar column */}
            <div className="contact-sidebar">

              <div className="contact-info-card">
                <h3>Contact Information</h3>

                <div className="contact-info-row">
                  <div
                    className="contact-info-icon"
                    style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
                    aria-hidden="true"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M3 8l9 6 9-6M3 8v10a1 1 0 001 1h16a1 1 0 001-1V8M3 8a1 1 0 011-1h16a1 1 0 011 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <div className="contact-info-label">Email</div>
                    <div className="contact-info-value">
                      <a href="mailto:contactus@act3ai.com">contactus@act3ai.com</a>
                    </div>
                  </div>
                </div>

                <div className="contact-info-row">
                  <div
                    className="contact-info-icon"
                    style={{ background: "var(--bg-2)", color: "var(--ink-2)" }}
                    aria-hidden="true"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <div className="contact-info-label">Response Time</div>
                    <div className="contact-info-value">Within 24 hours on business days</div>
                  </div>
                </div>

                <div className="contact-info-row">
                  <div
                    className="contact-info-icon"
                    style={{ background: "var(--bg-2)", color: "var(--ink-2)" }}
                    aria-hidden="true"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M15 10l4.553-2.069A1 1 0 0121 8.82V17a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1h11v4z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <div className="contact-info-label">Video Demos</div>
                    <div className="contact-info-value">
                      <a href="https://www.youtube.com/@ACT3AI" target="_blank" rel="noopener noreferrer">
                        Watch on YouTube →
                      </a>
                    </div>
                  </div>
                </div>

              </div>

              <div className="contact-enterprise-card">
                <div className="contact-enterprise-card__inner">
                  <div className="contact-enterprise-card__label">— Enterprise</div>
                  <h3>Working at a Studio or Agency?</h3>
                  <p>
                    Custom pricing, SSO, dedicated support, and multi-org workspaces
                    for teams that need to produce at scale.
                  </p>
                  <a
                    href="mailto:ContactUs@ACT3ai.com?subject=Enterprise%20Inquiry"
                    className="contact-enterprise-btn"
                  >
                    Talk to Sales <span className="arrow">→</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}
