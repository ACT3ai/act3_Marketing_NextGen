// /about — on the v4 template (V4Blocks inside Docusaurus <Layout>).
// The old cream version is frozen at site/pages/backup/about.tsx (/backup/about).
import React from "react";
import Layout from "@theme/Layout";
import { V4Hero, V4Section, V4CtaBand, V4CardGrid, V4Card } from "../components/v4/V4Blocks";
import { LINKS } from "../data/siteNav";

const EMAIL = LINKS.email.replace(/^mailto:/, "");

export default function About(): React.ReactNode {
  return (
    // No manual site-name suffix: Docusaurus appends " | ACT 3 AI" itself.
    <Layout
      title="About Us"
      description="Meet the team behind ACT 3 AI: filmmakers, writers and technologists building one AI workspace from script to finished video."
    >
      <main>
        <V4Hero
          eyebrow="About ACT 3"
          title="The team behind"
          highlight="ACT 3 AI"
          sub="Filmmakers, writers and technologists, building for every creator."
          secondary={{ label: "Contact us", href: "/contact" }}
        />

        <V4Section
          tone="raised"
          eyebrow="Our mission"
          heading="Script to screen,"
          highlight="in one workspace."
          intro="Scriptwriting, storyboards, characters and video in one AI platform, from solo creators to major studios."
        >
          <V4CardGrid columns={3}>
            <V4Card title="One workflow" text="Import your screenplay, export a finished video. No tool switching." />
            <V4Card title="AI does the first pass" text="Voice, motion, visuals and effects from plain-language direction." />
            <V4Card title="Built for teams" text="One shared project, version history and access controls." />
          </V4CardGrid>
        </V4Section>

        <V4Section eyebrow="Our values" heading="What we" highlight="stand for.">
          <V4CardGrid columns={3}>
            <V4Card eyebrow="01" title="Story first" text="AI should unlock imagination, not replace it." />
            <V4Card eyebrow="02" title="Every scale" text="Solo creator or studio, the platform grows with you." />
            <V4Card eyebrow="03" title="No surprises" text="Clear credit estimates and open pricing." href={LINKS.plans} />
          </V4CardGrid>
        </V4Section>

        <V4CtaBand />

        <V4Section
          tone="raised"
          eyebrow="Our team"
          heading="The people behind"
          highlight="the platform."
          intro="Decades of experience in entertainment, technology and the creative arts."
        >
          <V4CardGrid columns={3}>
            <V4Card title="Filmmakers" text="We know the work from first draft to final cut." />
            <V4Card title="Technologists" text="AI and software experts pushing generative media." />
            <V4Card title="Creators" text="Artists and writers who keep us honest about the story." />
          </V4CardGrid>
        </V4Section>

        <V4Section eyebrow="Reach us" heading="Let's create" highlight="together." center>
          <V4CardGrid columns={2}>
            <V4Card title="Email" text={EMAIL} href={LINKS.email} />
            <V4Card title="Contact form" text="Questions, support, partnerships, press." href="/contact" />
          </V4CardGrid>
        </V4Section>

        <V4CtaBand />
      </main>
    </Layout>
  );
}
