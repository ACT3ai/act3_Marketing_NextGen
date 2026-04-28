import React, { useState } from "react";
import Layout from "@theme/Layout";

const SECTION_CSS = `
.contact-page { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #131625; }
.contact-hero { background: #fff8f8; padding: 80px 24px; text-align: center; border-bottom: 1px solid #e8e8e8; }
.contact-hero h1 { font-size: clamp(2.2rem, 4vw, 3.2rem); font-weight: 700; margin: 0 0 24px; line-height: 1.2; }
.contact-hero p { font-size: 1.05rem; color: #384155; line-height: 1.7; max-width: 680px; margin: 0 auto; }
.contact-body { padding: 72px 24px; background: #fff; }
.contact-inner { max-width: 680px; margin: 0 auto; }
.contact-info-card { background: #f4f6fa; border-radius: 14px; padding: 36px; margin-bottom: 48px; }
.contact-info-card h3 { font-size: 1.2rem; font-weight: 700; text-align: center; margin: 0 0 28px; }
.contact-info-row { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 24px; }
.contact-info-row:last-child { margin-bottom: 0; }
.contact-info-icon { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; flex-shrink: 0; }
.contact-info-label { font-weight: 600; font-size: 0.9rem; margin: 0 0 4px; }
.contact-info-value { margin: 0; color: #384155; font-size: 0.95rem; }
.contact-info-value a { color: #0a84ff; text-decoration: underline; }
.contact-info-value a:hover { color: #c4612b; }
.contact-form-section h2 { font-size: 1.5rem; font-weight: 700; margin: 0 0 28px; }
.contact-form { display: flex; flex-direction: column; gap: 18px; }
.contact-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 600px) { .contact-row { grid-template-columns: 1fr; } }
.contact-field { display: flex; flex-direction: column; gap: 6px; }
.contact-field label { font-size: 0.88rem; font-weight: 600; color: #131625; }
.contact-field input,
.contact-field textarea,
.contact-field select { width: 100%; padding: 11px 14px; border: 1.5px solid #d1d5db; border-radius: 8px; font-size: 0.95rem; font-family: inherit; background: white; color: #131625; outline: none; transition: border-color 0.15s; box-sizing: border-box; }
.contact-field input:focus,
.contact-field textarea:focus,
.contact-field select:focus { border-color: #c4612b; box-shadow: 0 0 0 3px rgba(196,97,43,0.12); }
.contact-field textarea { resize: vertical; min-height: 130px; }
.contact-submit { background: #c4612b; color: white; font-weight: 700; font-size: 1rem; padding: 14px 32px; border: none; border-radius: 8px; cursor: pointer; transition: background 0.15s; align-self: flex-start; }
.contact-submit:hover { background: #a85024; }
.contact-submit:disabled { background: #ccc; cursor: not-allowed; }
.contact-success { background: #f0fdf4; border: 1.5px solid #22c55e; border-radius: 12px; padding: 32px; text-align: center; margin-top: 24px; }
.contact-success h3 { color: #15803d; font-size: 1.3rem; margin: 0 0 12px; }
.contact-success p { color: #166534; margin: 0; line-height: 1.6; }
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

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
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
      <style>{SECTION_CSS}</style>
      <div className="contact-page">

        {/* Hero */}
        <section className="contact-hero">
          <h1>Contact Us</h1>
          <p>
            Have questions about ACT 3? Need technical support? Want to explore enterprise solutions?
            We're here to help you bring your creative vision to life.
          </p>
        </section>

        {/* Body */}
        <section className="contact-body">
          <div className="contact-inner">

            {/* Contact Info Card */}
            <div className="contact-info-card">
              <h3>Contact Information</h3>
              <div className="contact-info-row">
                <div className="contact-info-icon" style={{ background: "#c4612b" }}>✉️</div>
                <div>
                  <p className="contact-info-label">Email</p>
                  <p className="contact-info-value">
                    <a href="mailto:contactus@act3ai.com">contactus@act3ai.com</a>
                  </p>
                </div>
              </div>
              <div className="contact-info-row">
                <div className="contact-info-icon" style={{ background: "#00c2b2" }}>💬</div>
                <div>
                  <p className="contact-info-label">Response Time</p>
                  <p className="contact-info-value">We typically respond within 24 hours</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="contact-form-section">
              <h2>Send Us a Message</h2>

              {submitted ? (
                <div className="contact-success">
                  <h3>Message Sent!</h3>
                  <p>
                    Your email client should have opened with your message pre-filled.
                    If it didn't, email us directly at{" "}
                    <a href="mailto:contactus@act3ai.com">contactus@act3ai.com</a>.
                    We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
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
                    {submitting ? "Opening email…" : "Send Message →"}
                  </button>
                </form>
              )}
            </div>

          </div>
        </section>

      </div>
    </Layout>
  );
}
