import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

export default function About(): ReactNode {
  return (
    <Layout
      title="About — ACT3 AI"
      description="We're building the future of AI filmmaking."
    >
      <main style={{ padding: "4rem 0" }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <Heading as="h1">About ACT3 AI</Heading>
          <p style={{ fontSize: "1.25rem", lineHeight: 1.7, marginBottom: "2rem", opacity: 0.85 }}>
            ACT3 AI is building the world's first AI Showrunner platform — a complete
            end-to-end system for producing cinematic video from screenplay to final cut.
          </p>
          <p style={{ lineHeight: 1.8 }}>
            We believe that great storytelling shouldn't require a Hollywood budget. With the
            rise of AI video generation models like Google Veo 3, Runway, and others, the tools
            to create cinematic content are now within reach of any creator. ACT3 AI connects
            all those tools into a single production pipeline — with a professional cinematography
            layer on top.
          </p>
          <p style={{ lineHeight: 1.8 }}>
            Our platform covers the full production pipeline: script breakdown into beats and shots,
            AI cinematography with professional camera and lighting setups, character creation and
            consistency, video generation, editing, and multi-platform export.
          </p>
          <Heading as="h2" style={{ marginTop: "3rem" }}>Our Mission</Heading>
          <p style={{ lineHeight: 1.8 }}>
            Democratize cinematic storytelling. Give every filmmaker, creator, and studio the
            tools to tell their story at the quality level their audience deserves — powered by AI.
          </p>
          <div style={{ marginTop: "3rem" }}>
            <Link className="button button--primary button--lg" to="https://act3ai.com">
              Start Creating
            </Link>
            <Link className="button button--secondary button--lg" to="/contact" style={{ marginLeft: "1rem" }}>
              Contact Us
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}
