// /about — on the v4 template (V4Blocks inside Docusaurus <Layout>).
// The old cream version is frozen at site/pages/backup/about.tsx (/backup/about).
// Facts come from the homepage rows (newer) and the old page; invent none.
import React from "react";
import Layout from "@theme/Layout";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { V4Hero, V4Section, V4CtaBand, V4CardGrid, V4Card, V4Prose, V4Split } from "../components/v4/V4Blocks";
import { LINKS } from "../data/siteNav";

// Shown lowercase, the way /contact spells it.
const EMAIL = LINKS.email.replace(/^mailto:/, "").toLowerCase();

export default function About(): React.ReactNode {
  // Homepage hero still (row 1, scene 6), as a 1280px web copy of
  // site/static/v4/row_1/videos/6/poster.jpg (3840x2160) made for this page.
  const stillJpg = useBaseUrl("/img/pages/about-mission-1280.jpg");
  const stillWebp = useBaseUrl("/img/pages/about-mission-1280.webp");
  return (
    // No manual site-name suffix: Docusaurus appends " | ACT 3 AI" itself.
    <Layout
      title="About Us"
      description="Meet the team behind ACT 3 AI: filmmakers, writers and technologists building one AI workspace from script to finished video."
    >
      <main>
        <V4Hero
          eyebrow="About us"
          title="The team behind"
          highlight="ACT 3 AI"
          sub="Filmmakers, writers and technologists with decades in entertainment and tech."
          secondary={{ label: "Contact us", href: "/contact" }}
        />

        <V4Section tone="raised" eyebrow="Our mission" heading="Script to screen," highlight="in one workspace.">
          <V4Split
            media={
              <picture>
                <source srcSet={stillWebp} type="image/webp" />
                <img
                  src={stillJpg}
                  width={1280}
                  height={720}
                  loading="lazy"
                  decoding="async"
                  alt="Scene 6 of the homepage hero: a shepherd boy and a mammoth herd on a hillside."
                />
              </picture>
            }
          >
            <V4Prose>
              <p>Scriptwriting, storyboards, characters and video.</p>
              <ul>
                <li>
                  <strong>One workflow</strong>: Final Draft in, Final Draft out.
                </li>
                <li>
                  <strong>AI takes the first pass</strong>: voice, images and video on leading models like Nano Banana
                  Pro and Seedance 2.5.
                </li>
                <li>
                  <strong>Built for teams</strong>: one shared project, version history and access controls.
                </li>
              </ul>
            </V4Prose>
          </V4Split>
        </V4Section>

        <V4Section eyebrow="Our values" heading="What we" highlight="stand for.">
          <V4CardGrid columns={3}>
            <V4Card eyebrow="01" title="Story first" text="You're a creative, not a prompt engineer." />
            <V4Card eyebrow="02" title="Every scale" text="Solo creator or studio." />
            <V4Card eyebrow="03" title="No surprises" text="Clear credit estimates and open pricing." href={LINKS.plans} />
          </V4CardGrid>
        </V4Section>

        <V4CtaBand />

        <V4Section tone="raised" eyebrow="Reach us" heading="Get in" highlight="touch.">
          <V4CardGrid columns={2}>
            <V4Card title="Email" text={EMAIL} href={LINKS.email} />
            <V4Card title="Contact form" text="Support, sales, enterprise, press." href="/contact" />
          </V4CardGrid>
        </V4Section>
      </main>
    </Layout>
  );
}
