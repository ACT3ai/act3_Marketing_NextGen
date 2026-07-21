---
title: "Auto-Writing Veo and Claude Prompts Straight From Your Script"
description: "Automatically writing Veo prompts from a script means turning screenplay text into one fully specified generation prompt per shot, without typing any of…"
---

# How to Automatically Write Veo Prompts From a Script

Automatically writing Veo prompts from a script means turning screenplay text into one fully specified generation prompt per shot, without typing any of them. It works in four stages: **parse** the script into scenes and shots; **enrich** each shot with cinematography metadata (shot type, camera, lens, movement, lighting) and with references to your defined characters, wardrobe and sets; **compose** those fields into a single prompt using a template; and **route** the prompt to the right model. The script supplies the *what*; the metadata supplies the *how*; the composer merges them.

The reason to automate rather than hand-write is arithmetic, not laziness. A 40-minute film is roughly 650 shots, and a good Veo prompt is a paragraph of camera, subject, action, lighting and style. Written by hand, those paragraphs drift — the same character described 650 times is 650 slightly different characters. ACT 3 AI automates the whole chain: it writes the Claude-style prompts for the videos and the prompts for the first frames, straight from the imported script, and assembles them per shot through its "mega prompt" composer.

This guide is about generating shot prompts at production scale. It is not a list of adjectives to make one clip look cinematic.

## What a complete shot prompt actually contains

Before you can generate prompts, you have to know what fields a good one carries. A generation-ready shot prompt bundles:

| Field group | Contents | Where it comes from |
|---|---|---|
| Narrative | The action beat, who is present, what happens | The script |
| Subject | Character appearance, age, wardrobe for this situation | Character and wardrobe definitions |
| Environment | Set, location, time of day | The set linked to the scene |
| Camera | Shot type, angle, lens, height, direction | Cinematography metadata on the shot |
| Motion | Camera movement, character paths, blocking | Shot planner and top-down blocking |
| Lighting | Setup, mood, match to the background plate | Lighting design on the shot |
| Style | Cinematic Realism, 3D Animated, Cartoon 2D, Anime, plus reference images | The project's style preset |
| Audio | Dialogue, timing that drives shot duration | Script dialogue and TTS |

If you write prompts by hand, you are re-typing seven of these eight groups for every shot. If you generate them, seven of the eight are looked up.

## The four stages, in detail

### Stage 1 — Parse the script into structure

Script-agnostic ingestion accepts anything from a one-sentence premise to a locked shooting draft, and automatically parses scenes, dialogue and action. Import formats include Final Draft (FDX), PDF and plain text, auto-formatted to industry standard with linked metadata. The result is a hierarchy — show ▸ season ▸ episode ▸ scene ▸ shot — where every unit is addressable.

Without this stage, nothing downstream can be automated, because there is no "each shot" to iterate over.

### Stage 2 — Enrich each shot with cinematography

This is the stage most DIY prompt scripts skip, and it is the one that makes the prompts good. A beat → scene → shot planner auto-computes the shot list and embeds camera settings, lens choices, movement types and framing decisions. A canonical shot grammar of 22 standard shot types, extended with key-framed camera curves, gives the composer precise vocabulary instead of vague direction. A visuals calculation engine determines shot timing and pacing from dialogue length, action and emotional tone — so the prompt knows how long the clip should be and why.

Blocking adds the rest: character positions, movement paths drawn as splines, camera placement with visible cones of vision, and independent body-facing versus head-looking direction. All of that becomes motion language in the prompt.

### Stage 3 — Compose the prompt

The composer merges narrative, style, camera, lighting, audio and motion data into a single multi-modal prompt per shot. Two properties make this better than hand-writing:

- **Inheritance.** Character and set descriptions come from the definitions, so they are byte-identical across every shot the character appears in. This is the mechanism behind consistency far more than any clever phrasing.
- **Templating.** Style presets map to prompt templates, and every parameter is override-able via YAML. You change the template once and 650 prompts change with it.

Both the video prompt and the first-frame prompt are generated this way, which is why the still and the clip agree with each other. See our guide to auto-generating first frames for that side of the pipeline.

### Stage 4 — Route to the right model

Prompts are not universal. Multi-model generative routing selects the best video engine per shot based on style and complexity, across Google Veo 3, Runway, FLUX, Stable Diffusion SDXL, ComfyUI, Hunyuan and Wan 2.1, with an adapter layer that can choose the cheapest engine meeting the quality constraint. Automating prompt writing without automating routing leaves you hand-porting prompts between services — which is most of the work you were trying to avoid.

## Keeping your hands on the wheel

Automation should set the default, not remove the control. What stays manual by choice:

- **The AI prompt editing panel** shows the generative task prompt for any shot and lets you edit the text directly for fine-tuned output.
- **"Copy Prompt" and "Copy Video"** utilities pull the exact LLM prompt and the resulting clip out for debugging or external use.
- **One-click regeneration** — review a shot, ask for a tweak to lighting, pacing or mood, regenerate in minutes.
- **YAML overrides** on any style parameter.
- **Human-in-the-loop everywhere.** The machine proposes, you approve or override, with an explicit handshake at each decision point.

The right division of labour: let the system write all 650 prompts, then personally direct the twenty shots that carry the film.

## A checklist before you generate prompts at volume

1. Script imported and parsed into scenes and shots.
2. Cast defined with appearance, and wardrobe variants named per situation.
3. Sets created and explicitly linked to scenes.
4. One style preset chosen; reference style images uploaded.
5. Shot list reviewed — shot types and coverage are your call, not the planner's final word.
6. Blocking done for scenes where geography matters.
7. A draft-quality test on one scene before committing to the whole film.

Skipping steps 2–3 is the classic failure. Prompts generated before the world is defined inherit nothing, and you end up with a beautifully automated inconsistency.

## FAQ

**Can Veo prompts be generated automatically from a screenplay?**
Yes. With the script parsed into structured shots and each shot carrying cinematography metadata, a composer can assemble a complete prompt per shot. ACT 3 AI does this automatically for both video prompts and first-frame prompts.

**Do auto-written prompts produce worse results than hand-written ones?**
For a single hero shot, a skilled human writing carefully can win. Across hundreds of shots, assembled prompts win decisively, because they carry identical character and set descriptions every time and never get tired. The practical answer is both: generate everything, hand-tune the shots that matter.

**Can I see and edit the generated prompt?**
Yes. The AI prompt editing panel exposes it for direct editing, and a "Copy Prompt" utility extracts the exact text.

**Does this work for models other than Veo?**
Yes. Routing covers Veo 3, Runway, FLUX, SDXL, ComfyUI, Hunyuan and Wan 2.1, with an adapter layer per engine and automatic selection based on style, complexity and cost.

**How does prompt automation help with continuity?**
It is the main mechanism. Because every prompt references the same character, wardrobe and set definitions, the description never drifts. Combined with per-character LoRA training, identity holds across dozens of renders. Our continuity guide covers the full set of practices.

**What if I only have a story idea, not a script?**
AI story expansion turns a paragraph or logline into a full screenplay with beats, scenes and dialogue, which then feeds the same prompt pipeline. Articles, books, Wikipedia pages and pasted text also work as source material.

## Stop typing prompts

If you are writing prompts one shot at a time, you are doing the part of filmmaking a machine does better — and doing the part it does worse, less. Import a script into ACT 3 AI and watch the shot list, the first frames and the Veo prompts write themselves, then spend your time directing.
