"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Contact;
var react_1 = require("react");
var Layout_1 = require("@theme/Layout");
var Head_1 = require("@docusaurus/Head");
var PAGE_CSS = "\n/* ===== Design Tokens ===== */\n.contact-page {\n  --bg: #faf8f3;\n  --bg-2: #f3efe5;\n  --bg-3: #ebe5d6;\n  --ink: #1a1714;\n  --ink-2: #4a4540;\n  --ink-3: #837c72;\n  --line: #e2dccb;\n  --line-2: #d4ccb6;\n  --accent: #c4612b;\n  --accent-ink: #ffffff;\n  --accent-soft: #f3e2d2;\n  --paper: #ffffff;\n  --maxw: 1100px;\n  --pad-x: clamp(20px, 4vw, 56px);\n  --radius: 8px;\n  --radius-lg: 14px;\n  --font-display: \"Fraunces\", \"Times New Roman\", serif;\n  --font-body: \"Inter\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif;\n  --font-mono: \"JetBrains Mono\", ui-monospace, \"SF Mono\", Menlo, monospace;\n  font-family: var(--font-body);\n  color: var(--ink);\n  background: var(--bg);\n}\n\n.contact-page *, .contact-page *::before, .contact-page *::after { box-sizing: border-box; }\n.contact-page h1, .contact-page h2, .contact-page h3 { margin: 0; }\n.contact-page p { margin: 0; }\n\n/* ===== Hero ===== */\n.contact-hero {\n  background: var(--bg);\n  padding: clamp(64px, 8vw, 100px) var(--pad-x) clamp(56px, 7vw, 88px);\n  text-align: center;\n  border-bottom: 1px solid var(--line);\n  position: relative;\n  overflow: hidden;\n}\n.contact-hero::before {\n  content: \"\";\n  position: absolute;\n  inset: 0;\n  background:\n    radial-gradient(900px 400px at 80% -10%, color-mix(in oklab, #c4612b 10%, transparent), transparent 60%),\n    radial-gradient(700px 350px at 0% 100%, color-mix(in oklab, #c4612b 6%, transparent), transparent 60%);\n  pointer-events: none;\n}\n.contact-hero__inner { position: relative; z-index: 1; }\n.contact-hero__label {\n  font-family: var(--font-mono);\n  font-size: 11px;\n  font-weight: 500;\n  letter-spacing: 0.14em;\n  text-transform: uppercase;\n  color: var(--accent);\n  margin-bottom: 20px;\n}\n.contact-hero h1 {\n  font-family: var(--font-display);\n  font-size: clamp(44px, 6vw, 80px);\n  font-weight: 400;\n  letter-spacing: -0.02em;\n  line-height: 1.05;\n  color: var(--ink);\n  margin-bottom: 20px;\n}\n.contact-hero h1 em { font-style: italic; color: var(--accent); }\n.contact-hero p {\n  font-size: clamp(16px, 1.8vw, 19px);\n  color: var(--ink-2);\n  line-height: 1.6;\n  max-width: 56ch;\n  margin: 0 auto;\n}\n\n/* ===== Body layout ===== */\n.contact-body {\n  padding: clamp(56px, 7vw, 96px) var(--pad-x);\n  background: var(--bg);\n}\n.contact-body__inner {\n  max-width: var(--maxw);\n  margin: 0 auto;\n  display: grid;\n  grid-template-columns: 1fr 380px;\n  gap: clamp(40px, 5vw, 72px);\n  align-items: start;\n}\n@media (max-width: 900px) {\n  .contact-body__inner {\n    grid-template-columns: 1fr;\n  }\n}\n\n/* ===== Form section ===== */\n.contact-form-wrap {\n  background: var(--paper);\n  border: 1px solid var(--line);\n  border-radius: var(--radius-lg);\n  padding: clamp(28px, 4vw, 48px);\n}\n.contact-form-wrap h2 {\n  font-family: var(--font-display);\n  font-size: clamp(24px, 3vw, 34px);\n  font-weight: 400;\n  letter-spacing: -0.02em;\n  margin-bottom: 28px;\n  color: var(--ink);\n}\n.contact-form {\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n}\n.contact-row {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 16px;\n}\n@media (max-width: 560px) {\n  .contact-row { grid-template-columns: 1fr; }\n}\n.contact-field {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.contact-field label {\n  font-size: 12.5px;\n  font-weight: 600;\n  color: var(--ink);\n  letter-spacing: 0.01em;\n  font-family: var(--font-mono);\n  text-transform: uppercase;\n}\n.contact-field input,\n.contact-field textarea,\n.contact-field select {\n  width: 100%;\n  padding: 11px 14px;\n  border: 1.5px solid var(--line-2);\n  border-radius: var(--radius);\n  font-size: 15px;\n  font-family: var(--font-body);\n  background: var(--bg);\n  color: var(--ink);\n  outline: none;\n  transition: border-color 0.15s, box-shadow 0.15s;\n}\n.contact-field input:focus,\n.contact-field textarea:focus,\n.contact-field select:focus {\n  border-color: var(--accent);\n  box-shadow: 0 0 0 3px color-mix(in oklab, #c4612b 15%, transparent);\n  background: var(--paper);\n}\n.contact-field textarea {\n  resize: vertical;\n  min-height: 140px;\n  line-height: 1.6;\n}\n.contact-field select {\n  appearance: none;\n  background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M6 9l6 6 6-6' stroke='%23837c72' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\");\n  background-repeat: no-repeat;\n  background-position: right 12px center;\n  padding-right: 38px;\n  cursor: pointer;\n}\n\n.contact-submit {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  background: var(--ink);\n  color: var(--bg);\n  font-weight: 500;\n  font-size: 15px;\n  padding: 14px 28px;\n  border: 1px solid transparent;\n  border-radius: 999px;\n  cursor: pointer;\n  font-family: var(--font-body);\n  letter-spacing: -0.005em;\n  transition: background 0.15s, transform 0.15s, box-shadow 0.2s;\n  align-self: flex-start;\n  box-shadow: 0 1px 0 rgba(0,0,0,.04), 0 8px 24px -12px rgba(0,0,0,.4);\n}\n.contact-submit:hover:not(:disabled) {\n  background: var(--accent);\n  transform: translateY(-1px);\n}\n.contact-submit:disabled {\n  background: var(--ink-3);\n  cursor: not-allowed;\n  transform: none;\n}\n.contact-submit .arrow {\n  display: inline-block;\n  transition: transform 0.2s;\n}\n.contact-submit:hover:not(:disabled) .arrow {\n  transform: translateX(3px);\n}\n\n/* ===== Success state ===== */\n.contact-success {\n  background: var(--paper);\n  border: 1px solid var(--line);\n  border-radius: var(--radius-lg);\n  padding: 48px 36px;\n  text-align: center;\n}\n.contact-success__icon {\n  width: 56px;\n  height: 56px;\n  border-radius: 999px;\n  background: var(--accent);\n  color: white;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin: 0 auto 20px;\n}\n.contact-success h3 {\n  font-family: var(--font-display);\n  font-size: 28px;\n  font-weight: 400;\n  color: var(--ink);\n  margin-bottom: 12px;\n  letter-spacing: -0.02em;\n}\n.contact-success p {\n  color: var(--ink-2);\n  font-size: 15.5px;\n  line-height: 1.6;\n  max-width: 44ch;\n  margin: 0 auto;\n}\n.contact-success a {\n  color: var(--accent);\n  text-decoration: underline;\n}\n\n/* ===== Sidebar info ===== */\n.contact-sidebar {\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n}\n.contact-info-card {\n  background: var(--paper);\n  border: 1px solid var(--line);\n  border-radius: var(--radius-lg);\n  padding: 28px 24px;\n}\n.contact-info-card h3 {\n  font-family: var(--font-display);\n  font-size: 20px;\n  font-weight: 400;\n  letter-spacing: -0.02em;\n  color: var(--ink);\n  margin-bottom: 20px;\n}\n.contact-info-row {\n  display: flex;\n  align-items: flex-start;\n  gap: 14px;\n  padding: 14px 0;\n  border-top: 1px solid var(--line);\n}\n.contact-info-row:first-of-type {\n  border-top: none;\n  padding-top: 0;\n}\n.contact-info-icon {\n  width: 40px;\n  height: 40px;\n  border-radius: 999px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n  font-size: 16px;\n}\n.contact-info-label {\n  font-family: var(--font-mono);\n  font-size: 11px;\n  font-weight: 500;\n  letter-spacing: 0.1em;\n  text-transform: uppercase;\n  color: var(--ink-3);\n  margin-bottom: 4px;\n}\n.contact-info-value {\n  font-size: 14.5px;\n  color: var(--ink-2);\n  line-height: 1.5;\n}\n.contact-info-value a {\n  color: var(--accent);\n  text-decoration: underline;\n}\n.contact-info-value a:hover {\n  color: var(--ink);\n}\n\n/* ===== Enterprise card ===== */\n.contact-enterprise-card {\n  background: var(--ink);\n  color: var(--bg);\n  border-radius: var(--radius-lg);\n  padding: 28px 24px;\n  position: relative;\n  overflow: hidden;\n}\n.contact-enterprise-card::before {\n  content: \"\";\n  position: absolute;\n  inset: 0;\n  background: radial-gradient(600px 300px at 100% 100%, color-mix(in oklab, #c4612b 25%, transparent), transparent 60%);\n  pointer-events: none;\n}\n.contact-enterprise-card__inner { position: relative; z-index: 1; }\n.contact-enterprise-card__label {\n  font-family: var(--font-mono);\n  font-size: 10.5px;\n  font-weight: 500;\n  letter-spacing: 0.14em;\n  text-transform: uppercase;\n  color: color-mix(in oklab, var(--bg) 60%, transparent);\n  margin-bottom: 12px;\n}\n.contact-enterprise-card h3 {\n  font-family: var(--font-display);\n  font-size: 20px;\n  font-weight: 400;\n  letter-spacing: -0.02em;\n  color: var(--bg);\n  margin-bottom: 10px;\n}\n.contact-enterprise-card p {\n  font-size: 14px;\n  color: color-mix(in oklab, var(--bg) 75%, transparent);\n  line-height: 1.55;\n  margin-bottom: 20px;\n}\n.contact-enterprise-btn {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  background: var(--accent);\n  color: white;\n  font-weight: 500;\n  font-size: 13.5px;\n  padding: 10px 20px;\n  border-radius: 999px;\n  text-decoration: none;\n  transition: filter 0.15s, transform 0.15s;\n}\n.contact-enterprise-btn:hover {\n  filter: brightness(1.1);\n  transform: translateY(-1px);\n  color: white;\n  text-decoration: none;\n}\n.contact-enterprise-btn .arrow {\n  display: inline-block;\n  transition: transform 0.2s;\n}\n.contact-enterprise-btn:hover .arrow {\n  transform: translateX(3px);\n}\n";
function Contact() {
    var _a = (0, react_1.useState)({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        subject: "",
        message: "",
    }), form = _a[0], setForm = _a[1];
    var _b = (0, react_1.useState)(false), submitted = _b[0], setSubmitted = _b[1];
    var _c = (0, react_1.useState)(false), submitting = _c[0], setSubmitting = _c[1];
    function handleChange(e) {
        setForm(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[e.target.name] = e.target.value, _a)));
        });
    }
    function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        var firstName = form.firstName, lastName = form.lastName, email = form.email, company = form.company, subject = form.subject, message = form.message;
        var body = [
            "Name: ".concat(firstName, " ").concat(lastName),
            "Email: ".concat(email),
            "Company: ".concat(company || "Not provided"),
            "Subject: ".concat(subject),
            "",
            "Message:",
            message,
        ].join("\n");
        var mailtoUrl = "mailto:contactus@act3ai.com" +
            "?subject=".concat(encodeURIComponent("Contact Form: " + subject)) +
            "&body=".concat(encodeURIComponent(body));
        window.location.href = mailtoUrl;
        setTimeout(function () {
            setSubmitted(true);
            setSubmitting(false);
        }, 800);
    }
    return (<Layout_1.default title="Contact Us — ACT3 AI" description="Have questions about ACT 3? Need technical support? Want to explore enterprise solutions? We're here to help.">
      <Head_1.default>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,ital,wght@9..144,0,300;9..144,0,400;9..144,0,500;9..144,1,300;9..144,1,400;9..144,1,500&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet"/>
        <style>{PAGE_CSS}</style>
      </Head_1.default>

      <div className="contact-page">

        {/* Hero */}
        <section className="contact-hero">
          <div className="contact-hero__inner">
            <div className="contact-hero__label">— Get in Touch</div>
            <h1>
              Let's Talk About<br />
              <em>Your Next Film.</em>
            </h1>
            <p>
              Have questions about ACT 3? Need technical support? Want to explore
              enterprise solutions? We're here to help you bring your creative vision to life.
            </p>
          </div>
        </section>

        {/* Body */}
        <section className="contact-body">
          <div className="contact-body__inner">

            {/* Form column */}
            <div>
              {submitted ? (<div className="contact-success">
                  <div className="contact-success__icon" aria-hidden="true">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M4.5 12.5l4.5 4.5L19.5 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3>Message Sent!</h3>
                  <p>
                    Your email client should have opened with your message pre-filled.
                    If it didn't, email us directly at{" "}
                    <a href="mailto:contactus@act3ai.com">contactus@act3ai.com</a>.
                    We'll get back to you within 24 hours.
                  </p>
                </div>) : (<div className="contact-form-wrap">
                  <h2>Send Us a Message</h2>
                  <form className="contact-form" onSubmit={handleSubmit}>

                    <div className="contact-row">
                      <div className="contact-field">
                        <label htmlFor="firstName">First Name *</label>
                        <input id="firstName" name="firstName" type="text" required placeholder="Jane" value={form.firstName} onChange={handleChange}/>
                      </div>
                      <div className="contact-field">
                        <label htmlFor="lastName">Last Name *</label>
                        <input id="lastName" name="lastName" type="text" required placeholder="Smith" value={form.lastName} onChange={handleChange}/>
                      </div>
                    </div>

                    <div className="contact-row">
                      <div className="contact-field">
                        <label htmlFor="email">Email Address *</label>
                        <input id="email" name="email" type="email" required placeholder="jane@studio.com" value={form.email} onChange={handleChange}/>
                      </div>
                      <div className="contact-field">
                        <label htmlFor="company">Company</label>
                        <input id="company" name="company" type="text" placeholder="Studio Name (optional)" value={form.company} onChange={handleChange}/>
                      </div>
                    </div>

                    <div className="contact-field">
                      <label htmlFor="subject">Subject *</label>
                      <select id="subject" name="subject" required value={form.subject} onChange={handleChange}>
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
                      <textarea id="message" name="message" required placeholder="Tell us how we can help…" value={form.message} onChange={handleChange}/>
                    </div>

                    <button type="submit" className="contact-submit" disabled={submitting}>
                      {submitting ? "Opening email client…" : "Send Message"}
                      <span className="arrow">→</span>
                    </button>

                  </form>
                </div>)}
            </div>

            {/* Sidebar column */}
            <div className="contact-sidebar">

              <div className="contact-info-card">
                <h3>Contact Information</h3>

                <div className="contact-info-row">
                  <div className="contact-info-icon" style={{ background: "var(--accent-soft)", color: "var(--accent)" }} aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M3 8l9 6 9-6M3 8v10a1 1 0 001 1h16a1 1 0 001-1V8M3 8a1 1 0 011-1h16a1 1 0 011 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
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
                  <div className="contact-info-icon" style={{ background: "var(--bg-2)", color: "var(--ink-2)" }} aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/>
                      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="contact-info-label">Response Time</div>
                    <div className="contact-info-value">Within 24 hours on business days</div>
                  </div>
                </div>

                <div className="contact-info-row">
                  <div className="contact-info-icon" style={{ background: "var(--bg-2)", color: "var(--ink-2)" }} aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M15 10l4.553-2.069A1 1 0 0121 8.82V17a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1h11v4z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
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
                  <a href="mailto:ContactUs@ACT3ai.com?subject=Enterprise%20Inquiry" className="contact-enterprise-btn">
                    Talk to Sales <span className="arrow">→</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>

      </div>
    </Layout_1.default>);
}
