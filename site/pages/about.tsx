import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

type ValueCardProps = { title: string; body: string };

function ValueCard({ title, body }: ValueCardProps) {
  return (
    <div style={{
      background: "var(--ifm-background-surface-color)",
      border: "1px solid var(--ifm-color-emphasis-200)",
      borderRadius: 12,
      padding: "2rem",
      flex: "1 1 260px",
    }}>
      <Heading as="h3" style={{ marginBottom: "0.75rem" }}>{title}</Heading>
      <p style={{ opacity: 0.8, lineHeight: 1.7, margin: 0 }}>{body}</p>
    </div>
  );
}

type FeatureRowProps = { title: string; body: string };

function FeatureRow({ title, body }: FeatureRowProps) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <Heading as="h3" style={{ marginBottom: "0.5rem" }}>{title}</Heading>
      <p style={{ opacity: 0.8, lineHeight: 1.8, margin: 0 }}>{body}</p>
    </div>
  );
}

export default function About(): ReactNode {
  return (
    <Layout
      title="About Us — ACT3 AI"
      description="We're a passionate team of filmmakers, writers, and technologists dedicated to empowering creators to bring their visions to life."
    >
      <main>
        {/* Hero */}
        <section style={{
          background: "linear-gradient(135deg, rgba(124, 58, 237, 0.12), rgba(37, 99, 235, 0.06))",
          padding: "5rem 0 4rem",
          borderBottom: "1px solid var(--ifm-color-emphasis-200)",
        }}>
          <div className="container" style={{ maxWidth: 820 }}>
            <Heading as="h1" style={{ fontSize: "2.75rem", lineHeight: 1.2, marginBottom: "1.5rem" }}>
              Welcome to ACT 3 AI
            </Heading>
            <p style={{ fontSize: "1.3rem", lineHeight: 1.75, opacity: 0.9, marginBottom: 0 }}>
              Where storytelling meets cutting-edge artificial intelligence. We're a passionate team
              of filmmakers, writers, and technologists dedicated to empowering creators of all
              backgrounds to bring their visions to life faster and more collaboratively than ever before.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section style={{ padding: "4rem 0", borderBottom: "1px solid var(--ifm-color-emphasis-200)" }}>
          <div className="container" style={{ maxWidth: 820 }}>
            <Heading as="h2" style={{ marginBottom: "1rem" }}>Our Mission</Heading>
            <p style={{ fontSize: "1.2rem", lineHeight: 1.8, opacity: 0.85 }}>
              To simplify and enrich the video-making process by providing an integrated AI-driven
              platform that combines scriptwriting, storyboarding, character creation, and video
              generation in a single, intuitive workspace.
            </p>
            <p style={{ lineHeight: 1.8, opacity: 0.8 }}>
              We believe that great storytelling shouldn't require a Hollywood budget. With the rise
              of AI video generation models like Google Veo 3, Runway, and others, the tools to create
              cinematic content are now within reach of any creator. ACT3 AI connects all those tools
              into a single production pipeline — with a professional cinematography layer on top.
            </p>
          </div>
        </section>

        {/* What We Do */}
        <section style={{ padding: "4rem 0", borderBottom: "1px solid var(--ifm-color-emphasis-200)" }}>
          <div className="container" style={{ maxWidth: 820 }}>
            <Heading as="h2" style={{ marginBottom: "2.5rem" }}>What We Do</Heading>
            <FeatureRow
              title="Streamlined Workflow"
              body="From importing your screenplay to exporting a polished video, ACT3 AI keeps every step of production under one roof — no tool switching, no lost context, no juggling a dozen apps."
            />
            <FeatureRow
              title="AI-Enhanced Creativity"
              body="Leverage powerful AI engines — Google Veo 3, WAN AI, Runway — to generate voice, motion, visuals, and effects. Our platform handles the technical complexity so you stay focused on the story."
            />
            <FeatureRow
              title="Collaboration & Control"
              body="Real-time co-editing, version history, and granular lock-down controls let teams work together without stepping on each other. Your creative vision stays intact at every stage."
            />
          </div>
        </section>

        {/* Values */}
        <section style={{ padding: "4rem 0", borderBottom: "1px solid var(--ifm-color-emphasis-200)" }}>
          <div className="container" style={{ maxWidth: 900 }}>
            <Heading as="h2" style={{ marginBottom: "2.5rem" }}>Our Values</Heading>
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
              <ValueCard
                title="Creativity First"
                body="Technology should unlock, not replace, human imagination. Every feature we build is designed to give creators more expressive power, not less."
              />
              <ValueCard
                title="Accessibility"
                body="Whether you're a solo creator or a large studio, our platform scales to your needs. World-class filmmaking tools should be available to everyone."
              />
              <ValueCard
                title="Transparency"
                body="Clear credit estimates, in-app guidance, and open pricing. No hidden fees, no surprise bills — just honest tools that respect your time and money."
              />
            </div>
          </div>
        </section>

        {/* Team */}
        <section style={{ padding: "4rem 0" }}>
          <div className="container" style={{ maxWidth: 820 }}>
            <Heading as="h2" style={{ marginBottom: "1rem" }}>Our Team</Heading>
            <p style={{ lineHeight: 1.8, opacity: 0.85, marginBottom: "3rem" }}>
              We're a diverse group of filmmakers, writers, and technologists who share a passion for
              storytelling. Our team includes industry veterans from Entertainment, Technology, and
              the Creative Arts — united by the belief that AI can open cinematic storytelling to
              everyone, not just those with Hollywood budgets.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link className="button button--primary button--lg" to="https://act3ai.com">
                Start Creating
              </Link>
              <Link className="button button--secondary button--lg" to="/contact">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
