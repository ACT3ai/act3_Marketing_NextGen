import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

export default function Features(): ReactNode {
  return (
    <Layout
      title="Features | ACT 3 AI"
      description="Explore all features of the ACT 3 AI filmmaking platform."
    >
      <main style={{ padding: "4rem 0" }}>
        <div className="container">
          <Heading as="h1" style={{ textAlign: "center", marginBottom: "1rem" }}>
            Features
          </Heading>
          <p style={{ textAlign: "center", fontSize: "1.25rem", opacity: 0.75, marginBottom: "3rem" }}>
            The complete AI filmmaking pipeline.
          </p>

          {[
            {
              category: "Story & Script",
              items: [
                { title: "Beat Parser", desc: "Import any screenplay and watch ACT 3 AI break it into acts, scenes, and beats automatically." },
                { title: "Scene Manager", desc: "Organize and reorder scenes. Each scene tracks its shots, characters, and location." },
                { title: "Shot Breakdown", desc: "Auto-generate shot lists from scene descriptions. Customize camera angle, lens, and movement." },
              ],
            },
            {
              category: "AI Video Generation",
              items: [
                { title: "Google Veo 3", desc: "Generate high-quality cinematic video with Google's latest model. Best-in-class realism." },
                { title: "Runway ML", desc: "Fast iteration and stylized video via Runway Gen-3. Great for stylized and artistic shots." },
                { title: "ComfyUI / FLUX", desc: "Local rendering pipeline via ComfyUI with FLUX models for full creative control." },
                { title: "Hunyuan & Wan 2.1", desc: "Alternative open-source models for specialized styles and local GPU rendering." },
              ],
            },
            {
              category: "Characters & Actors",
              items: [
                { title: "Actor Management", desc: "Create consistent character profiles. Maintain visual identity across all scenes." },
                { title: "Lip Sync", desc: "Automated lip sync for dialogue scenes using your generated video footage." },
                { title: "Motion Capture", desc: "Import mocap data to drive character animations. Blender integration included." },
                { title: "TTS / Voice", desc: "Text-to-speech for character voices. Multiple voice models and languages supported." },
              ],
            },
            {
              category: "Cinematography",
              items: [
                { title: "Camera System", desc: "Define camera type, lens focal length, angle, movement, and speed for every shot." },
                { title: "Lighting Design", desc: "Set lighting mood, key light direction, fill ratio, and color temperature per scene." },
                { title: "Set Design", desc: "Describe your sets and environments. AI maintains visual consistency across takes." },
              ],
            },
            {
              category: "Post Production",
              items: [
                { title: "Video Editor", desc: "Timeline-based editor. Trim, arrange, and layer clips. Add transitions and effects." },
                { title: "Multi-Platform Export", desc: "Export optimized for YouTube, Instagram, TikTok, X, and cinema formats." },
                { title: "Blender Sync", desc: "Sync your ACT 3 projects with Blender for 3D scene compositing and VFX." },
              ],
            },
          ].map(({ category, items }) => (
            <div key={category} style={{ marginBottom: "3.5rem" }}>
              <Heading as="h2">{category}</Heading>
              <div className="row">
                {items.map(({ title, desc }) => (
                  <div key={title} className="col col--4" style={{ marginBottom: "1.5rem" }}>
                    <div style={{
                      border: "1px solid var(--ifm-color-emphasis-200)",
                      borderRadius: 10,
                      padding: "1.5rem",
                      height: "100%",
                      background: "var(--ifm-background-surface-color)",
                    }}>
                      <Heading as="h3" style={{ fontSize: "1.1rem" }}>{title}</Heading>
                      <p style={{ opacity: 0.8, margin: 0 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <Link className="button button--primary button--lg" to="https://act3ai.com">
              Start Creating Free
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}
