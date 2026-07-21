---
title: "How AI Filmmaking Actually Works: Beats, Shots, and Renders"
description: "AI filmmaking works by turning a story into structured data, and then turning that data into video one shot at a time. It is not one model that watches…"
---

# How Does AI Filmmaking Work?

AI filmmaking works by turning a story into **structured data**, and then turning that data into video one shot at a time. It is not one model that watches your script and outputs a film. It is a pipeline with five stages:

1. **Story** — a script, or a premise expanded into a script with acts, beats, scenes and dialogue.
2. **Breakdown** — the script is parsed into a hierarchy: beats, scenes, and a shot list. Each shot gets metadata: who is in it, where it happens, camera, lens, movement, lighting.
3. **Prompt assembly** — that metadata is composed into a detailed prompt for each shot, plus a reference first frame.
4. **Generation** — a video model renders the shot from the prompt and the first frame. Dialogue is generated as speech and lipsynced.
5. **Assembly** — approved shots are stitched with transitions and audio into a scene, an episode, a film.

The part most people miss is stage two. Generating one good clip is a solved problem. Generating **650 clips for a 40-minute film** that share the same characters, the same rooms and the same visual logic is entirely a data problem, and that is what a filmmaking pipeline is actually for.

---

## Stage 1: Story becomes structure

You start from one of two places.

**You have a script.** It is imported — FDX, PDF, plain text — and parsed into scenes, action and dialogue.

**You have an idea.** A logline, a premise, an article, even a book chapter. AI story expansion grows it into a full screenplay: plot, theme, central conflict, acts, beats, characters with arcs, then scenes and dialogue.

Either way, the output is not just text. It is a **project hierarchy** — show → season → episode → scene → shot — where every element is addressable. That hierarchy is what makes the rest possible.

Story elements also become linked data rather than prose. Character definitions (age, appearance, personality, wardrobe variants), locations, and thematic threads exist as objects, and a dependency graph tracks how they relate. When you change one, downstream elements can be recomputed rather than manually reconciled.

## Stage 2: Breakdown into beats, scenes and shots

This is the heart of it.

**Beats** are story units — what changes in this stretch. **Scenes** are continuous action in one place and time. **Shots** are the atomic renderable units.

A shot planner computes the shot list from the scenes and attaches cinematography metadata to each shot:

| Metadata | What it controls |
| --- | --- |
| Shot type | Framing — from a canonical grammar of 22 standard shot types |
| Camera movement | Push, pan, orbit, static — extended with keyframed camera curves |
| Lens and height | Perspective and feel |
| Characters present | Who appears, and who is the primary focus |
| Wardrobe variant | Continuity of costume across the scene |
| Set | The location, linked so the room stays the same room |
| Lighting | Mood, key direction, matching to background plates |
| Duration | Computed from dialogue length, action and emotional tone |

Because every renderable unit is defined in machine-readable YAML, the UI, the render engine and version control all see the same data. That is what lets a change in the script cascade into the shots rather than orphaning them.

## Stage 3: Prompt assembly — the "mega prompt"

Video models take prompts. A production pipeline writes them for you.

Shot-level prompt assembly bundles everything the shot knows — narrative action, visual style, camera instructions, lighting setup, audio, motion data, regional masks — into a single multi-modal prompt. Two prompts, really: one for the **first frame** (the still that anchors the shot's look) and one for the **video** (the motion).

This is the step that decides whether AI filmmaking is a craft or a data-entry job. Hand-written, 650 prompts is weeks of typing and a continuity nightmare. Composed from structured metadata, it is a machine job.

## Stage 4: Generation — how a shot becomes video

Each shot is dispatched to a generative engine. There is no single best model, so a pipeline routes intelligently: multi-model generative routing picks the engine per shot based on style and complexity, across engines including **Google Veo 3, Runway, Flux, SDXL, ComfyUI, Hunyuan and Wan 2.1**, with local ComfyUI node graphs available for work that needs regional masking or ControlNets.

Alongside the video:

- **Text-to-speech** generates the spoken dialogue per shot and drives lipsync duration.
- **Audio-driven lipsync** produces mouth shapes from the dialogue.
- **Motion capture**, where you want a real performance, comes from markerless full-body extraction out of ordinary video — no suit — plus facial capture.
- **Character consistency** is maintained by per-character model training, so the same character renders identically across dozens of shots.

Rendering is queued and asynchronous, with cost estimated before the job runs and progress reported live, because a full film is hours of compute, not seconds.

## Stage 5: Assembly and review

Approved shots are stitched automatically with transitions and audio into scenes and episodes, with server-side concatenation producing masters per shot, scene, episode or season.

Then comes the step that separates a demo from a film: **watching the whole thing**. Individual clips almost always look fine. The problems live in the transitions — a costume that changed, a room that moved, a rhythm that drags across four consecutive shots. You cannot see any of that one clip at a time.

## Where ACT 3 AI fits

Every stage above describes what a complete pipeline has to do. [ACT 3 AI](https://act3ai.com/) is built as that pipeline end to end — script import or AI story expansion, beat/scene/shot planning with real cinematography metadata, automatic first frames and prompts, multi-model rendering, TTS and lipsync, Blender sync for true 3D control, and assembly — inside one project rather than a chain of tools.

The differentiator worth naming here is **directorial control**. Prompt-to-video services generate short clips beautifully but give you little say over camera placement, actor blocking or lighting. Previs tools produce boards but no final render. 3D tools give total control at the cost of a steep learning curve. ACT 3 AI aims at the gap: real cinematography control — beats, scenes, shots, camera, lens, lighting — applied across a full-length production.

Concretely, that means:

- A **Figma-style top-down canvas** for blocking: place characters and cameras from above, draw movement paths with splines, set body and head orientation independently, and see camera cones of vision.
- **Per-shot render mode**: 3D characters on a 2D background, full 3D environment, generative AI only, or hybrid.
- **Style presets** — Cinematic Realism, 3D Animated, Cartoon 2D, Anime — with every parameter overridable.
- **Human-in-the-loop everywhere**: AI proposes, you accept or override, with side-by-side "Primary" versus "AI Recommended" views and full version history.
- **Full-runtime review**: shot lists export to Adobe Premiere, where a unified timeline lets you zoom around an entire one-hour show or two-hour movie and watch the clips flow together — which is the only way to judge whether it is actually a film.

## What AI filmmaking still cannot do

Honesty is worth more than hype here:

- **It does not write a good story for you.** Structure, yes. Taste, no.
- **Fine physical detail is still hard** — hands, complex prop interaction, precise physics.
- **Long continuous takes are hard.** Generation is shot-based; the grammar of AI film currently favours cutting.
- **It does not remove the work of directing.** It removes the work of *executing*. Someone still has to decide where the camera goes and why.

## FAQ

**Is AI filmmaking just typing prompts?**
No. Prompting is one stage, and in a real pipeline it is automated. The work that remains is story, breakdown decisions, blocking, cinematography choices and review — the directing, not the typing.

**How long does an AI film take to make?**
The pre-production stage is where the collapse happens: work that traditionally runs 80–200 hours is targeted at roughly two hours. ACT 3 AI is built for real production runtimes — full-length movies and TV shows, worked on in sustained sprints, with the whole film rebuildable from the previous day's feedback.

**Which AI video model does it use?**
A good pipeline uses several. ACT 3 AI integrates Google Veo 3, Runway, Flux, SDXL, ComfyUI, Hunyuan and Wan 2.1, and routes per shot based on style and complexity rather than locking you to one engine.

**How do characters stay consistent across hundreds of shots?**
Characters are defined once — appearance, age, wardrobe variants — and a per-character LoRA is trained behind the scenes so the same character renders identically shot after shot. Digital actor casting keeps the same actor assigned across scenes and episodes.

**Can I use my own 3D work?**
Yes. ACT 3 AI has a full Blender round trip — send a shot or set to local Blender, work on it, sync back — plus open-standard character imports (MetaHuman, Reallusion, Daz, FBX/USD).

**Who owns what I make?**
In ACT 3 AI, the Organization — your workspace — legally owns the projects, content and generated assets created in it, as stated in the Terms of Service, with ownership transfer available between members.

---

## See the pipeline on your own script

Reading how it works is one thing; watching your own script turn into beats, shots and frames is another. **Start free with ACT 3 AI and run one scene through the whole pipeline.** Then read our guides to auto-storyboarding from a script and writing scripts an AI pipeline can shoot.
