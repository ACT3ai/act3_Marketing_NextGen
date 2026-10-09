import React from "react";
import Layout from "@theme/Layout";
import useBaseUrl from "@docusaurus/useBaseUrl";
import V4Link from "../components/v4/V4Link";
import { V4Card, V4CardGrid, V4CtaBand, V4Hero, V4Prose, V4Section, V4Split } from "../components/v4/V4Blocks";
import { FOOTER_COLUMNS, LINKS, PRIMARY_NAV } from "../data/siteNav";

/**
 * Route: /features — the hub of what ACT 3 does, on the v4 template.
 *
 * Source of truth for every claim: the homepage rows (site/pages/_rows.generated.ts,
 * newer) and the old page (frozen at site/pages/backup/features.tsx). Keep the copy
 * short: one line under a title, one or two under a heading, one sentence per card.
 * No third-party model names here unless the homepage shows them.
 */

/** Routes siteNav.ts still marks `pending` (page not built yet): their links skip the broken-link check. */
const PENDING = new Set(
  [...PRIMARY_NAV, ...FOOTER_COLUMNS.flatMap((c) => c.links)].filter((l) => l.pending).map((l) => l.href),
);

/**
 * A V4Card that links to a site route. V4Card cannot pass `pending` to its link,
 * so a pending route renders V4Card's own markup around a pending V4Link.
 */
function HubCard({ title, text, href }: { title: string; text: string; href: string }): React.JSX.Element {
  if (!PENDING.has(href)) return <V4Card title={title} text={text} href={href} />;
  return (
    <V4Link className="v4t-card v4t-card--link" href={href} pending>
      <h3 className="v4t-card-title">
        {title}
        <span className="v4t-card-arrow" aria-hidden="true">→</span>
      </h3>
      <p className="v4t-card-text">{text}</p>
    </V4Link>
  );
}

export default function Features(): React.JSX.Element {
  const editorImg = useBaseUrl("/v4/row_2/ext/act3/rows/row_4_editor_proof/demos/_img/editor_1376.jpg");
  return (
    <Layout
      title="Features"
      description="Everything ACT 3 does: chat to your AI filmmaker, script to shots, consistent characters, sets and outfits, AI storyboards, voices, teams, MCP and CLI."
    >
      <main>
        <V4Hero
          eyebrow="Features"
          title="Everything ACT 3"
          highlight="does."
          sub="AI filmmaking at the speed of storytelling."
          secondary={{ label: "See plans", href: LINKS.plans }}
        />

        <V4Section eyebrow="Your AI crew" heading="Chat to your" highlight="AI filmmaker.">
          <V4Split
            media={
              <img
                src={editorImg}
                width={1376}
                height={768}
                loading="lazy"
                decoding="async"
                alt="The ACT 3 editor: the shot, AI chat, first frame and script side by side."
              />
            }
          >
            <V4Prose>
              <p>Say what to change in one sentence. Your AI crew does the work. You direct.</p>
              <ul>
                <li>
                  <strong>AI Filmmaker</strong>: new background, same actor.
                </li>
                <li>
                  <strong>AI Storyboarder</strong>: a panel for every shot.
                </li>
                <li>
                  <strong>AI Cinematographer</strong>: the first pass of every shot.
                </li>
                <li>
                  <strong>AI Head Designer</strong>: sets and locations, created by AI.
                </li>
              </ul>
            </V4Prose>
          </V4Split>
        </V4Section>

        <V4Section tone="raised" eyebrow="Script" heading="Your script" highlight="runs the movie." intro="Bring the whole screenplay. ACT 3 builds from all of it.">
          <V4CardGrid columns={3}>
            <V4Card title="Two- or three-hour movies" text="Minute 12 and minute 133 belong to one story." />
            <V4Card title="Acts, beats, scenes, shots" text="One timeline. Move a beat; its scenes and shots go with it." />
            <V4Card title="Reads your lines" text="A scene heading picks the set. A shot header calls the shot." />
            <V4Card title="Screenplay editor" text="Final Draft format, built in, beside your shots. Never read-only." />
            <V4Card title="Final Draft in and out" text="Import your .fdx. Export it whenever you want." />
            <V4Card title="Every version kept" text="Your script is backed up as you write." />
          </V4CardGrid>
        </V4Section>

        <V4Section eyebrow="Consistency" heading="Describe it once." highlight="It holds in every shot.">
          <V4CardGrid columns={3}>
            <V4Card title="Character" text="Pick your digital actor once. Same face in every scene." />
            <V4Card title="Set & location" text="Move the camera. The room stays the room." />
            <V4Card title="Outfit" text="Same costume, stitch for stitch, until the story changes it." />
          </V4CardGrid>
        </V4Section>

        <V4CtaBand />

        <V4Section tone="raised" eyebrow="Characters" heading="The star treatment," highlight="for every character.">
          <V4CardGrid columns={4} min={220}>
            <V4Card title="Character sheet" text="Headshot, front, back, left, right. Made once." />
            <V4Card title="Voice" text="Their own voice on every line, lips in sync." />
            <V4Card title="Wardrobe" text="An outfit per scene, when the story asks." />
            <V4Card title="The whole cast" text="Supporting players get the same care as the leads." />
          </V4CardGrid>
        </V4Section>

        <V4Section eyebrow="Look" heading="Get the shot right" highlight="before you pay for video.">
          <V4CardGrid columns={4} min={220}>
            <V4Card title="AI storyboards" text="A panel for every shot of your movie or video." />
            <V4Card title="Sets & locations" text="A set is a place you keep. Come back whenever the story does." />
            <V4Card title="Cinematography" text="Framing, lens, camera move and light. A first pass you upgrade." />
            <V4Card title="First frame first" text="Approve a still, then render video from it. Fewer takes." />
          </V4CardGrid>
        </V4Section>

        <V4Section tone="raised" eyebrow="Voices" heading="With voice actors. Without." highlight="Or both.">
          <V4CardGrid columns={2}>
            <V4Card title="Voice directory" text="Cast a voice once. No session to book. Rewrite a line and it is spoken again." />
            <V4Card title="Voice actors" text="They record from home, in your project. Each take lands in its shot, lips matched." />
          </V4CardGrid>
        </V4Section>

        <V4Section eyebrow="Teams" heading="One project," highlight="your whole team.">
          <V4CardGrid columns={2}>
            <V4Card title="Full access controls" text="Owner, Admin, Member, Reviewer. You decide who edits, runs AI and spends credits." />
            <V4Card title="Built for remote teams" text="Every time zone works in one project. Nobody waits for a file." />
          </V4CardGrid>
        </V4Section>

        <V4CtaBand />

        <V4Section tone="raised" eyebrow="Finish" heading="Cut it." highlight="Ship it.">
          <V4CardGrid columns={3}>
            <V4Card title="Editor" text="Script, shots and video in one window." />
            <V4Card title="Export" text="For YouTube, Instagram, TikTok, X and cinema." />
            <V4Card title="Mocap & Blender" text="Drive characters with motion capture. Sync your project with Blender." />
          </V4CardGrid>
        </V4Section>

        <V4Section eyebrow="Automate" heading="Drive ACT 3" highlight="from your AI agent.">
          <V4CardGrid columns={2}>
            <HubCard title="MCP" href="/mcp" text="Claude Code, Codex or Claude Desktop import, storyboard and render for you." />
            <HubCard title="CLI" href="/cli" text="The same actions from your shell, for scripted, repeatable runs." />
          </V4CardGrid>
        </V4Section>

        <V4Section tone="raised" eyebrow="Go deeper" heading="Made for" highlight="what you make.">
          <V4CardGrid columns={3}>
            <HubCard title="Movies" href="/movies" text="Two- or three-hour features, one story." />
            <HubCard title="TV" href="/tv" text="An hour-long episode in three days." />
            <HubCard title="Minidramas" href="/minidramas" text="Short dramas, episode after episode." />
            <HubCard title="Videos" href="/videos" text="Ads, social and marketing videos." />
            <HubCard title="Assistant Director Team" href="/level2" text="Real filmmakers who produce inside ACT 3, by the week." />
            <HubCard title="Articles" href="/articles" text="Guides to AI filmmaking." />
          </V4CardGrid>
          <p className="v4t-intro">
            Want the details? Read the{" "}
            <V4Link href={LINKS.docs} newTab>
              documentation
            </V4Link>
            .
          </p>
        </V4Section>

        <V4CtaBand />
      </main>
    </Layout>
  );
}
