---
title: "What Is a Mega Prompt? Bundling Story, Camera, and Light"
description: "A mega prompt is a single, assembled instruction for one shot that bundles everything a video model needs to know: the narrative action, the visual style…"
---

# What Is a Mega Prompt in AI Video?

**A mega prompt is a single, assembled instruction for one shot that bundles everything a video model needs to know: the narrative action, the visual style, the camera, the lighting, the audio, and the motion data.** Instead of typing a sentence and hoping, you compose a structured payload from the shot's real production data and send it as one multi-modal request.

The distinction matters because a normal prompt is *authored* and a mega prompt is *assembled*. You do not write a mega prompt by hand. It is built for you out of information that already exists elsewhere in your project — the script line, the scene's style preset, the shot's lens and movement, the set's lighting, the character's wardrobe, the dialogue audio that sets duration. A mega prompt composer's job is to gather all of that and emit one coherent instruction per shot.

This page explains what goes inside a mega prompt, why bundling beats prompting, and where the approach helps and where it does not. It is about AI video shot generation specifically — not chat prompting, not image prompting for stills.

---

## What is inside a mega prompt

A well-formed mega prompt carries six categories of data. Miss one and the model fills the gap with its own guess, which is where inconsistency comes from.

| Component | What it carries | What breaks without it |
|---|---|---|
| **Narrative** | The action in the shot, the beat it serves, who is present | Footage that is pretty but means nothing |
| **Style** | The project's visual language, applied per shot | Every shot looks like a different production |
| **Camera** | Shot type, lens, height, angle, movement, framing | Uncontrolled, drifting, "stock" coverage |
| **Lighting** | Key direction, quality, colour, time of day | Cutaways that will not cut against each other |
| **Audio** | Dialogue and its duration, which sets shot length | Shots that do not fit the line they cover |
| **Motion** | Blocking, paths, character and camera movement over time | Actors standing still, or moving arbitrarily |

Some systems add **regional masks** — instructions that apply to a specific area of the frame rather than the whole image — which is how you direct one element of a shot without disturbing the rest.

## Why bundling beats prompting

Three reasons, in order of how much they matter.

**1. Consistency across many shots.** A 40-minute film runs to roughly 650 shots. Hand-written prompts drift: you phrase the lighting one way in scene 3 and another way in scene 9, and the footage stops matching. When style, set, and character data are pulled from a single source and injected into every shot's prompt automatically, drift stops being possible.

**2. Editability at the right level.** With a mega prompt, you change the *lens field* on the shot, not a clause buried in a paragraph. The prompt is regenerated from the change. That is a much better interface for directing than prose editing.

**3. Volume.** Nobody is hand-writing 650 detailed prompts. The only way to get shot-level specificity across a real production is to generate the prompts programmatically from structured shot data.

## Mega prompt vs. a normal prompt

- **Normal prompt:** *"A detective walks into a dark warehouse, cinematic."*
- **Mega prompt (conceptually):** the same action, plus the project's visual style preset, plus "medium wide, 35mm, slow dolly-in at eye height, camera left," plus "single hard key from a high window camera right, cold colour temperature, heavy falloff," plus the character's locked appearance and wardrobe variant, plus the dialogue audio that fixes the shot at 4.2 seconds, plus the blocking path the character walks.

The second one is not a better sentence. It is a different kind of object.

---

## Where ACT 3 AI fits

ACT 3 AI treats the mega prompt as a core piece of the pipeline rather than a prompting trick. The platform includes a **"Mega Prompt" composer** that bundles all of a shot's data — narrative, style, camera, lighting, audio, and motion — into a single multi-modal prompt for the generative engine, and a shot-level prompt assembly step that combines the scripted action with visual instructions and cinematography cues into a frame-accurate generation instruction.

The reason it works is that the underlying data already exists in structured form. Every renderable unit in ACT 3 is defined in machine-readable YAML, so the UI, the engine, and version control stay in sync. A visuals calculation engine determines shot timing and pacing from dialogue length, action, and emotional tone, then feeds the generative engine with action details, mood, style parameters, motion instructions, camera instructions, lighting setup, and regional masks. Style presets — Cinematic Realism, 3D Animated, Cartoon 2D, Anime — map to prompt templates underneath, with every parameter override-able.

This is the **automation** argument in a nutshell: the prompts for your videos and for your first frames are generated for you, from data you already entered as a filmmaker, rather than being another manual authoring job stacked on top of the creative work. You still get control — an AI prompt editing panel lets you view and directly edit the generated task prompt when you want expert-level tuning, and a "Copy Prompt" utility hands you the exact instruction for debugging or use elsewhere.

Because the prompt is engine-agnostic data rather than one model's dialect, ACT 3 routes shots across multiple back-ends — Veo 3, Runway, FLUX, SDXL, ComfyUI, Hunyuan, Wan 2.1 — selecting an engine per shot based on style and complexity, and choosing the cheapest engine that meets your quality constraint.

For how those shot specs are produced in the first place, see our guide to **previsualization**; for applying the same discipline to cutaways, see our guide to **AI B-roll**.

---

## How to think in mega prompts even without a composer

If you are working by hand, you can borrow the structure. Build a per-project block you paste into every shot:

1. **Project block (never changes):** style, palette, grain, render look.
2. **Scene block (changes per scene):** location, time of day, weather, lighting setup, characters present with locked descriptions.
3. **Shot block (changes per shot):** action, shot type, lens, camera movement, duration.

Assemble in that order every time. It is a worse version of what a composer does automatically, but it is dramatically better than freehand prompting, and it exposes why the automated version matters: you will get tired of maintaining three blocks across 650 shots long before the film is finished.

## Limits of the approach

Be honest about what a mega prompt does not fix:

- **It cannot exceed the model.** If the engine cannot render a specific physical interaction, more structure will not conjure it.
- **Longer is not automatically better.** Contradictory instructions inside one bundle produce mush. Structure beats volume.
- **It does not replace review.** You still have to watch shots in sequence and regenerate the ones that fail.
- **It does not replace taste.** The composer supplies the *what*; you still decide whether the scene is any good.

---

## FAQ

**Is a mega prompt just a very long prompt?**
No. Length is incidental. A mega prompt is *structured and assembled* from separate data sources — narrative, style, camera, lighting, audio, motion — rather than authored as one block of prose. A long, unstructured prompt full of competing adjectives usually performs worse than a short one.

**Do I write a mega prompt myself?**
Ideally not. The point is that the composer builds it from data you have already entered as script, style, shot, set, and character information. Hand-writing them defeats the purpose at any real shot count.

**Why does a mega prompt improve consistency?**
Because the style, set, and character data are injected from a single source into every shot, rather than being re-typed per shot with slightly different wording each time. Consistency is a data problem, not a phrasing problem.

**Can I still edit the prompt manually?**
Yes, in systems that expose it. A prompt editing panel that lets you view and adjust the generated instruction gives you an escape hatch for the one shot that needs something unusual, without giving up automation for the other 649.

**Does a mega prompt work across different video models?**
It works best when the prompt is stored as structured data and translated per engine through an adapter layer. That way the same shot definition can be routed to whichever model best suits its style, complexity, and cost.

**What are regional masks in a mega prompt?**
Instructions scoped to a specific region of the frame rather than the whole image — a way to direct one element of a shot without disturbing the rest of the composition.

---

## See a mega prompt built from your own shot

The fastest way to understand the idea is to watch one get assembled from a script line, a camera setting, and a lighting choice you made yourself.

**[Try ACT 3 AI free](https://app.act3ai.com/signup)** and inspect the generated prompt for your first shot.
