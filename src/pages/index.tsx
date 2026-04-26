import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import clsx from "clsx";

import styles from "./index.module.css";

type FeatureItem = {
  title: string;
  icon: string;
  description: ReactNode;
};

const features: FeatureItem[] = [
  {
    title: "Script to Screen",
    icon: "🎬",
    description: (
      <>
        Transform your screenplay into fully produced video. ACT3 AI breaks your
        script into beats, scenes, and shots — then generates cinematic footage
        automatically.
      </>
    ),
  },
  {
    title: "AI Cinematography",
    icon: "🎥",
    description: (
      <>
        Professional camera angles, lighting setups, and shot compositions
        powered by AI. Every shot is crafted with cinematic intent — not random
        generation.
      </>
    ),
  },
  {
    title: "Veo 3 & Runway Integration",
    icon: "⚡",
    description: (
      <>
        Harness the best AI video models — Google Veo 3, Runway, FLUX, ComfyUI,
        Hunyuan, and Wan 2.1 — all from a single unified platform.
      </>
    ),
  },
  {
    title: "Custom Actors & Characters",
    icon: "🎭",
    description: (
      <>
        Create consistent characters, manage actors across scenes, add lip-sync,
        motion capture, and TTS — full character pipeline in one place.
      </>
    ),
  },
  {
    title: "Built-in Video Editor",
    icon: "✂️",
    description: (
      <>
        Edit your generated footage in our timeline editor. Cut, arrange, add
        audio, and export to YouTube, Instagram, TikTok, and more — all without
        leaving ACT3 AI.
      </>
    ),
  },
  {
    title: "AI Showrunner",
    icon: "🤖",
    description: (
      <>
        Your AI co-creator that maintains story continuity, tracks character
        arcs, and keeps your production consistent from first act to final frame.
      </>
    ),
  },
];

function Feature({ title, icon, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4", styles.featureCol)}>
      <div className={styles.featureCard}>
        <div className={styles.featureIcon}>{icon}</div>
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

function HeroSection() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>Now with Google Veo 3</div>
          <Heading as="h1" className={styles.heroTitle}>
            Make Movies with AI.
            <br />
            <span className={styles.heroTitleGradient}>At Cinematic Scale.</span>
          </Heading>
          <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
          <p className={styles.heroDescription}>
            ACT3 AI turns your script into production-ready video. Beats, scenes,
            shots, actors, lighting, sets — all AI-generated. The world's first
            AI Showrunner platform.
          </p>
          <div className={styles.heroButtons}>
            <Link
              className="button button--primary button--lg"
              to="https://act3ai.com"
            >
              Start Creating Free
            </Link>
            <Link
              className={clsx("button button--lg", styles.heroButtonSecondary)}
              to="/docs/intro"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function FeaturesSection() {
  return (
    <section className={styles.featuresSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2">Everything You Need to Produce AI Films</Heading>
          <p>
            One platform. Complete pipeline. From screenplay to finished video.
          </p>
        </div>
        <div className="row">
          {features.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkflowSection() {
  return (
    <section className={styles.workflowSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2">How It Works</Heading>
          <p>From script to cinematic video in four steps.</p>
        </div>
        <div className={styles.workflowSteps}>
          {[
            {
              step: "01",
              title: "Write Your Script",
              desc: "Upload or write your screenplay. ACT3 AI parses your story into acts, scenes, and beats automatically.",
            },
            {
              step: "02",
              title: "Design Your Shots",
              desc: "Our AI cinematographer breaks each scene into individual shots with camera angles, lighting, and movement.",
            },
            {
              step: "03",
              title: "Generate Video",
              desc: "Send shots to Veo 3, Runway, or your preferred AI model. Generate multiple takes, pick the best.",
            },
            {
              step: "04",
              title: "Edit & Export",
              desc: "Assemble your shots in the timeline editor, add audio, and export for any platform.",
            },
          ].map(({ step, title, desc }) => (
            <div key={step} className={styles.workflowStep}>
              <div className={styles.workflowStepNumber}>{step}</div>
              <Heading as="h3">{title}</Heading>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className={styles.ctaSection}>
      <div className="container">
        <Heading as="h2">Ready to Make Your Film?</Heading>
        <p>
          Join thousands of creators, filmmakers, and studios using ACT3 AI to
          produce cinematic content at scale.
        </p>
        <div className={styles.ctaButtons}>
          <Link
            className="button button--primary button--lg"
            to="https://act3ai.com"
          >
            Get Started Free
          </Link>
          <Link className="button button--secondary button--lg" to="/pricing">
            View Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} — AI Filmmaking Platform`}
      description="ACT3 AI turns your script into cinematic video using Google Veo 3, Runway, and more. The world's first AI Showrunner platform for creators and studios."
    >
      <HeroSection />
      <main>
        <FeaturesSection />
        <WorkflowSection />
        <CTASection />
      </main>
    </Layout>
  );
}
