import React from "react";
import Layout from "@theme/Layout";
import useBaseUrl from "@docusaurus/useBaseUrl";
import V4Link from "../components/v4/V4Link";
import { V4Card, V4CardGrid, V4CtaBand, V4Hero, V4Prose, V4Section, V4Split } from "../components/v4/V4Blocks";
import { LINKS } from "../data/siteNav";

/**
 * Route: /features — the hub of what ACT 3 does, on the v4 template.
 *
 * Source of truth for every claim: the homepage rows (site/pages/_rows.generated.ts,
 * newer) and the old page (frozen at site/pages/backup/features.tsx). Keep the copy
 * short: one line under a title, one or two under a heading, one sentence per card.
 * Each topic appears ONCE on this page. No third-party model names here unless the
 * homepage shows them. Images are ones the homepage already ships (site/static/v4/).
 */

const IMG_STYLE: React.CSSProperties = {
  display: "block",
  width: "100%",
  height: "auto",
  borderRadius: 10,
  border: "1px solid rgba(255, 255, 255, 0.12)",
};

/** One stage of homepage row 13 (storyboard → first frame → video): a card with its picture on top. */
function StageCard({ src, alt, eyebrow, title, text }: { src: string; alt: string; eyebrow: string; title: string; text: string }): React.JSX.Element {
  return (
    <div className="v4t-card">
      <img src={src} alt={alt} width={1120} height={630} loading="lazy" decoding="async" style={{ ...IMG_STYLE, marginBottom: 8 }} />
      <span className="v4t-card-eyebrow">{eyebrow}</span>
      <h3 className="v4t-card-title">{title}</h3>
      <p className="v4t-card-text">{text}</p>
    </div>
  );
}

export default function Features(): React.JSX.Element {
  const editorImg = useBaseUrl("/v4/row_2/ext/act3/rows/row_4_editor_proof/demos/_img/editor_1376.jpg");
  const sheetImg = useBaseUrl("/v4/row_9/v/jack_sheet.jpg");
  const boardImg = useBaseUrl("/v4/row_13/v/board.jpg");
  const frameImg = useBaseUrl("/v4/row_13/v/frame.jpg");
  const takeImg = useBaseUrl("/v4/row_13/v/take1_poster.jpg");
  return (
    <Layout
      title="Features"
      description="Everything ACT 3 does, from script to finished film: chat to your AI filmmaker, consistent characters, outfits and sets, AI storyboards, voices, MCP and CLI."
    >
      <main>
        <V4Hero
          eyebrow="Features"
          title="Everything ACT 3"
          highlight="does."
          sub="From script to finished film."
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
              <p>Say what to change in one sentence. Your AI Filmmaker does the work.</p>
              <p>Your script briefs the AI crew: Storyboarder, Cinematographer and Head Designer each bring a first pass. You direct.</p>
              <p>
                <strong>Cinematography</strong>: framing, lens, camera move and light. Upgrade the shots that matter.
              </p>
            </V4Prose>
          </V4Split>
        </V4Section>

        <V4Section tone="raised" eyebrow="Script" heading="Your script" highlight="runs the movie." intro="Bring the whole screenplay. Two- or three-hour movies, one story.">
          <V4CardGrid columns={3}>
            <V4Card title="Acts, beats, scenes, shots" text="One timeline. Move a beat; its scenes and shots go with it." />
            <V4Card title="Reads your lines" text="A scene heading picks the set. A shot header calls the shot." />
            <V4Card title="Screenplay editor" text="Final Draft format, built in. .fdx in and out, every version kept." />
          </V4CardGrid>
        </V4Section>

        <V4Section
          eyebrow="Consistency"
          heading={
            <>
              Describe it once.
              <br />
            </>
          }
          highlight="It holds in every shot."
        >
          <img
            src={sheetImg}
            width={1600}
            height={446}
            loading="lazy"
            decoding="async"
            alt="Jack's character sheet: a headshot and four full-body views, front, back, left and right."
            style={{ ...IMG_STYLE, borderRadius: 14, marginBottom: 20 }}
          />
          <V4CardGrid columns={2}>
            <V4Card title="Character sheet" text="Headshot, front, back, left, right. Same face in every scene." />
            <V4Card title="Outfits" text="Same costume, stitch for stitch, until the story changes it." />
            <V4Card title="Sets & locations" text="Built once. Move the camera; the room stays the room." />
            <V4Card title="The whole cast" text="Supporting players get the same care as the leads." />
          </V4CardGrid>
        </V4Section>

        <V4CtaBand />

        <V4Section
          tone="raised"
          eyebrow="Our secret to saving money"
          heading={
            <>
              Get the shot right
              <br />
            </>
          }
          highlight="before you pay for video."
        >
          <V4CardGrid columns={3}>
            <StageCard src={boardImg} alt="A pencil storyboard panel of the shot." eyebrow="01" title="AI storyboard" text="Decided in pencil. Change anything." />
            <StageCard src={frameImg} alt="The approved first frame of the same shot." eyebrow="02" title="First frame" text="Approved by you, for the cost of a still." />
            <StageCard src={takeImg} alt="Video take 1 of the same shot." eyebrow="03" title="Video" text="The expensive step, started from your frame. Fewer takes." />
          </V4CardGrid>
        </V4Section>

        <V4Section eyebrow="Voices" heading="With voice actors. Without." highlight="Or both." intro="Every character keeps one voice, first scene to last.">
          <V4CardGrid columns={2}>
            <V4Card title="Voice directory" text="Cast once, no session to book. Rewrite a line; it is spoken again." />
            <V4Card title="Voice actors" text="They record from home. Each take lands in its shot, lips matched." />
          </V4CardGrid>
        </V4Section>

        <V4Section tone="raised" eyebrow="Teams" heading="One project," highlight="your whole team.">
          <V4CardGrid columns={2}>
            <V4Card title="Full access controls" text="Owner, Admin, Member, Reviewer. You decide who edits, runs AI and spends credits." />
            <V4Card title="Built for remote teams" text="Every time zone, one project. Nobody waits for a file." />
          </V4CardGrid>
        </V4Section>

        <V4CtaBand />

        <V4Section eyebrow="Finish" heading="Cut it." highlight="Ship it.">
          <V4CardGrid columns={3}>
            <V4Card title="Editor" text="Trim, arrange and layer clips on a timeline." />
            <V4Card title="Export" text="For YouTube, Instagram, TikTok, X and cinema." />
            <V4Card title="Mocap & Blender" text="Drive characters with motion capture. Sync your project with Blender." />
          </V4CardGrid>
        </V4Section>

        <V4Section tone="raised" eyebrow="Automate" heading="Drive ACT 3" highlight="from your AI agent.">
          <V4CardGrid columns={2}>
            <V4Card title="MCP" href="/mcp" text="Claude Code, Codex or any MCP client imports, storyboards and renders for you." />
            <V4Card title="CLI" href="/cli" text="The same actions from your shell, scripted and repeatable." />
          </V4CardGrid>
        </V4Section>

        <V4Section
          eyebrow="Go deeper"
          heading="Made for"
          highlight="what you make."
          intro={
            <V4Link href={LINKS.docs} newTab>
              Documentation →
            </V4Link>
          }
        >
          <V4CardGrid columns={3}>
            <V4Card title="Movies" href="/movies" text="Feature films from your full screenplay." />
            <V4Card title="TV" href="/tv" text="An hour-long episode in three days." />
            <V4Card title="Minidramas" href="/minidramas" text="Short dramas, episode after episode." />
            <V4Card title="Videos" href="/videos" text="Ads, social and marketing videos." />
            <V4Card title="Assistant Director Team" href="/level2" text="Real filmmakers who produce inside ACT 3, by the week." />
            <V4Card title="Articles" href="/articles" text="Guides to AI filmmaking." />
          </V4CardGrid>
        </V4Section>
      </main>
    </Layout>
  );
}
