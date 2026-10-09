// /contact — on the v4 template (V4Blocks inside Docusaurus <Layout>).
// The old cream version is frozen at site/pages/backup/contact.tsx (/backup/contact).
//
// The form sends nothing itself: on submit it opens the visitor's email app with a
// pre-filled draft to CONTACT_EMAIL (buildMailto below). Validation is the
// browser's own (required + type="email"); the page CSS only styles it.
import React, { useState } from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import { V4Hero, V4Section, V4CtaBand } from "../components/v4/V4Blocks";
import { LINKS } from "../data/siteNav";

const CONTACT_EMAIL = "contactus@act3ai.com";
const ENTERPRISE_MAILTO = "mailto:ContactUs@ACT3ai.com?subject=Enterprise%20Inquiry";

const SUBJECTS = [
  "General Question",
  "Technical Support",
  "Sales & Partnerships",
  "Enterprise Inquiry",
  "Press & Media",
  "Other",
];

// Page-scoped styling for the form and the side cards. Every rule sits under
// .ct-grid; the colours, fonts and the square yellow button come from the
// --v4t-* tokens and .v4t-cta of site/css/v4-template.css.
const PAGE_CSS = `
.v4t-section.ct-section { padding-top: clamp(48px, 6vw, 80px); }
.ct-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: clamp(28px, 4vw, 56px);
  align-items: start;
}
@media (max-width: 900px) { .ct-grid { grid-template-columns: minmax(0, 1fr); } }

.ct-grid .ct-panel {
  background: var(--v4t-panel);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: clamp(24px, 3.4vw, 44px);
}
.ct-grid .ct-title {
  margin: 0 0 24px;
  font-family: var(--v4t-sans);
  font-weight: 800;
  font-size: clamp(26px, 2.6vw, 34px);
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--v4t-ink);
}

/* form */
.ct-grid .ct-form { display: flex; flex-direction: column; gap: 20px; color-scheme: dark; }
.ct-grid .ct-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 560px) { .ct-grid .ct-row { grid-template-columns: 1fr; } }
.ct-grid .ct-field { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.ct-grid .ct-field label {
  font-family: var(--v4t-display);
  font-weight: 700;
  font-size: 15px;
  line-height: 1;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--v4t-muted);
}
.ct-grid .ct-req { color: var(--v4t-yellow); margin-left: 3px; }
.ct-grid .ct-field :is(input, select, textarea) {
  width: 100%;
  margin: 0;
  padding: 12px 14px;
  font: 400 16px/1.4 var(--v4t-sans);
  color: var(--v4t-ink);
  background: var(--v4t-ground);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 4px;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.ct-grid .ct-field :is(input, textarea)::placeholder { color: var(--v4t-quiet); opacity: 1; }
.ct-grid .ct-field :is(input, select, textarea):hover { border-color: rgba(255, 255, 255, 0.3); }
.ct-grid .ct-field :is(input, select, textarea):focus-visible {
  border-color: var(--v4t-yellow);
  box-shadow: 0 0 0 3px rgba(238, 188, 60, 0.28);
}
.ct-grid .ct-field textarea { min-height: 150px; resize: vertical; line-height: 1.6; }
.ct-grid .ct-field select {
  appearance: none;
  padding-right: 40px;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M6 9l6 6 6-6' stroke='%23eebc3c' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
}
.ct-grid .ct-field select:has(option[value=""]:checked) { color: var(--v4t-quiet); }
.ct-grid .ct-field option { color: var(--v4t-ink); background: var(--v4t-raised); }

/* errors: only after the visitor has touched a field (or tried to send) */
.ct-grid .ct-err { display: none; margin: 0; font-size: 14px; line-height: 1.3; color: #ff8f7a; }
.ct-grid .ct-field :is(input, select, textarea):user-invalid { border-color: #ff8f7a; }
.ct-grid .ct-field :is(input, select, textarea):user-invalid:focus-visible { box-shadow: 0 0 0 3px rgba(255, 143, 122, 0.25); }
.ct-grid .ct-field:has(:user-invalid) .ct-err { display: block; }

.ct-grid .ct-send { align-self: flex-start; margin-top: 4px; border: 0; cursor: pointer; }
.ct-grid .ct-send:focus-visible { outline: 3px solid var(--v4t-yellow-hi); outline-offset: 4px; }

/* after sending */
.ct-grid .ct-done { text-align: center; }
.ct-grid .ct-done-mark {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  margin: 0 auto 20px;
  background: var(--v4t-yellow);
  color: var(--v4t-yellow-ink);
}
.ct-grid .ct-done .ct-title { margin-bottom: 12px; }
.ct-grid .ct-done p { margin: 0 auto; max-width: 42ch; font-size: 17px; line-height: 1.55; color: var(--v4t-body); }

/* side cards */
.ct-grid .ct-side { display: flex; flex-direction: column; gap: 20px; }
.ct-grid .ct-side .ct-panel { padding: 26px 24px; }
.ct-grid .ct-list { margin: 0; padding: 0; list-style: none; }
.ct-grid .ct-list li { padding: 16px 0; border-top: 1px solid var(--v4t-line); }
.ct-grid .ct-list li:first-child { padding-top: 0; border-top: 0; }
.ct-grid .ct-list li:last-child { padding-bottom: 0; }
.ct-grid .ct-k {
  display: block;
  margin-bottom: 6px;
  font-family: var(--v4t-display);
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--v4t-quiet);
}
.ct-grid .ct-v { font-size: 17px; line-height: 1.45; color: var(--v4t-body); overflow-wrap: anywhere; }
.ct-grid a.ct-link {
  color: var(--v4t-yellow);
  text-decoration: underline;
  text-decoration-color: rgba(238, 188, 60, 0.45);
  text-underline-offset: 3px;
}
.ct-grid a.ct-link:hover { color: var(--v4t-yellow-hi); text-decoration-color: currentColor; }
.ct-grid a.ct-link:focus-visible { outline: 2px solid var(--v4t-yellow-hi); outline-offset: 3px; }

.ct-grid .ct-ent { border-color: rgba(238, 188, 60, 0.45); background: linear-gradient(160deg, #1d1a12, var(--v4t-panel) 60%); }
.ct-grid .ct-ent .v4t-eyebrow { margin-bottom: 12px; font-size: 14px; }
.ct-grid .ct-ent h3 { margin: 0 0 10px; font: 800 22px/1.2 var(--v4t-sans); letter-spacing: -0.01em; color: var(--v4t-ink); }
.ct-grid .ct-ent p { margin: 0 0 20px; font-size: 16px; line-height: 1.55; color: var(--v4t-muted); }
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

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // Unchanged from the cream page: same subject line, same body, same address.
  function buildMailto() {
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
    return (
      `mailto:${CONTACT_EMAIL}` +
      `?subject=${encodeURIComponent("Contact Form: " + subject)}` +
      `&body=${encodeURIComponent(body)}`
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    window.location.href = buildMailto();
    setSubmitted(true);
  }

  const req = <span className="ct-req" aria-hidden="true">*</span>;

  return (
    // No manual site-name suffix: Docusaurus appends " | ACT 3 AI" itself.
    <Layout
      title="Contact Us"
      description="Questions, support or enterprise plans? Email ACT 3 at contactus@act3ai.com. We reply within 24 hours on business days."
    >
      <Head>
        <style>{PAGE_CSS}</style>
      </Head>
      <main>
        <V4Hero
          eyebrow="Contact"
          title="Let's talk about"
          highlight="your next film."
          sub={<>Questions, support or enterprise plans.<br />We reply within 24 hours on business days.</>}
          cta={false}
        />

        <V4Section tone="raised" className="ct-section">
          <div className="ct-grid">
            <div>
              {submitted ? (
                <div className="ct-panel ct-done" role="status">
                  <div className="ct-done-mark" aria-hidden="true">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                      <path d="M4.5 12.5l4.5 4.5L19.5 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" />
                    </svg>
                  </div>
                  <h2 className="ct-title">Email draft opened</h2>
                  <p>
                    Review it and press <strong>Send</strong>. Nothing opened? Write to{" "}
                    <a className="ct-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                  </p>
                </div>
              ) : (
                <div className="ct-panel">
                  <h2 className="ct-title" id="ct-form-title">Send a message</h2>
                  <form className="ct-form" onSubmit={handleSubmit} aria-labelledby="ct-form-title">
                    <div className="ct-row">
                      <div className="ct-field">
                        <label htmlFor="firstName">First name{req}</label>
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          autoComplete="given-name"
                          required
                          placeholder="Jane"
                          aria-describedby="firstName-err"
                          value={form.firstName}
                          onChange={handleChange}
                        />
                        <p className="ct-err" id="firstName-err">Enter your first name.</p>
                      </div>
                      <div className="ct-field">
                        <label htmlFor="lastName">Last name{req}</label>
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          autoComplete="family-name"
                          required
                          placeholder="Smith"
                          aria-describedby="lastName-err"
                          value={form.lastName}
                          onChange={handleChange}
                        />
                        <p className="ct-err" id="lastName-err">Enter your last name.</p>
                      </div>
                    </div>

                    <div className="ct-row">
                      <div className="ct-field">
                        <label htmlFor="email">Email{req}</label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          placeholder="jane@studio.com"
                          aria-describedby="email-err"
                          value={form.email}
                          onChange={handleChange}
                        />
                        <p className="ct-err" id="email-err">Enter a valid email address.</p>
                      </div>
                      <div className="ct-field">
                        <label htmlFor="company">Company</label>
                        <input
                          id="company"
                          name="company"
                          type="text"
                          autoComplete="organization"
                          placeholder="Optional"
                          value={form.company}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="ct-field">
                      <label htmlFor="subject">Subject{req}</label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        aria-describedby="subject-err"
                        value={form.subject}
                        onChange={handleChange}
                      >
                        <option value="">Choose one…</option>
                        {SUBJECTS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <p className="ct-err" id="subject-err">Choose a subject.</p>
                    </div>

                    <div className="ct-field">
                      <label htmlFor="message">Message{req}</label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        placeholder="How can we help?"
                        aria-describedby="message-err"
                        value={form.message}
                        onChange={handleChange}
                      />
                      <p className="ct-err" id="message-err">Write a message.</p>
                    </div>

                    <button type="submit" className="v4t-cta ct-send">
                      Open email draft <span aria-hidden="true">›</span>
                    </button>
                  </form>
                </div>
              )}
            </div>

            <aside className="ct-side" aria-label="Other ways to reach us">
              <div className="ct-panel">
                <ul className="ct-list">
                  <li>
                    <span className="ct-k">Email</span>
                    <span className="ct-v">
                      <a className="ct-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                    </span>
                  </li>
                  <li>
                    <span className="ct-k">Video demos</span>
                    <span className="ct-v">
                      <a className="ct-link" href={LINKS.youtube} target="_blank" rel="noopener noreferrer">
                        Watch on YouTube
                      </a>
                    </span>
                  </li>
                </ul>
              </div>

              <div className="ct-panel ct-ent">
                <p className="v4t-eyebrow">Enterprise</p>
                <h3>Studio or agency?</h3>
                <p>Custom pricing, SSO, dedicated support and multi-org workspaces.</p>
                <a className="v4t-cta v4t-cta-sm" href={ENTERPRISE_MAILTO}>
                  Talk to sales <span aria-hidden="true">›</span>
                </a>
              </div>
            </aside>
          </div>
        </V4Section>

        <V4CtaBand />
      </main>
    </Layout>
  );
}
