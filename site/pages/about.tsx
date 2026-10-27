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
      title="About the AI Filmmaking Team"
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

        {/* Why, who for, what is different, who leads: facts from ~/BGit/all/film/Small_ACT3.md
            (mission, "market of abandonment", founding team) and seo/key_values.txt (the five
            differentiators and the three audiences). Invent none. */}
        <V4Section eyebrow="Why we built it" heading="Too many stories" highlight="never get made.">
          <V4Prose>
            <p>
              Our mission: write less, keep more creative control, and spend far less labor. Many would-be filmmakers
              give up when they see the work involved; a single video can take six weeks of manual effort. ACT 3 AI
              takes a rough idea or a finished script and turns it into a production-ready, AI-generated movie or
              video, with scenes, cinematography, lighting and 3D set control, so the budget goes to creativity
              instead of logistics.
            </p>
            <p>
              It is a director&apos;s toolkit, not another prompt box: you stay in the loop at every decision, and the
              platform keeps hundreds of shots consistent across a whole film or series.
            </p>
          </V4Prose>
        </V4Section>

        <V4Section tone="raised" eyebrow="Who it is for" heading="Three kinds of" highlight="storytellers.">
          <V4CardGrid columns={3}>
            <V4Card title="Content creators and YouTubers" text="Videos for your channel, made at the pace you publish." />
            <V4Card title="Brands and marketing agencies" text="Ads and marketing videos with the same characters in every shot." />
            <V4Card title="Storytellers and filmmakers" text="Movies, TV series and minidramas from your own screenplay." />
          </V4CardGrid>
        </V4Section>

        <V4Section eyebrow="What is different" heading="Five things that" highlight="set ACT 3 apart.">
          <V4CardGrid columns={3}>
            <V4Card
              eyebrow="01"
              title="Automation that saves time"
              text="First frames, video prompts and character sheets with the right outfits are created for you."
            />
            <V4Card
              eyebrow="02"
              title="Serious production"
              text="TV and movies in two- to three-hour sprints, with your intellectual property stored and your team working in one place."
            />
            <V4Card
              eyebrow="03"
              title="A whole movie, rebuilt daily"
              text="Import a script and build the entire movie, then rebuild it every day from the prior day's feedback."
            />
            <V4Card
              eyebrow="04"
              title="Assistant Director Team"
              text="An optional package: our team takes your feedback into your movie and makes it happen."
              href="/level2"
            />
            <V4Card
              eyebrow="05"
              title="Watch the whole film"
              text="One unified timeline: zoom around a two-hour movie and watch every clip flow together, as in Premiere."
            />
          </V4CardGrid>
        </V4Section>

        <V4Section tone="raised" eyebrow="Who leads it" heading="Built by a" highlight="repeat entrepreneur.">
          <V4Prose>
            <p>
              ACT 3 AI is led by CEO Bryan Starbuck: nine years at Microsoft, nine years of ML and AI experience,
              founding-stage CTO at Assurance, and exits including TalentSpring (acquired by JobVite), ZenLedger and
              WealthFlex (acquired by YieldStreet).
            </p>
          </V4Prose>
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
