---
title: "Auto Shot Lists and Storyboards From Your Script"
description: "Short answer: an AI storyboard and shot list generator reads your script, breaks it into beats and scenes, decides how each scene should be covered, and…"
---

# AI Storyboard and Shot List Generator: From Script to Shot List Automatically

**Short answer:** an AI storyboard and shot list generator reads your script, breaks it into beats and scenes, decides how each scene should be covered, and outputs a numbered shot list with cinematography details plus a visual board frame for each shot. The good ones do not stop at a list of prose descriptions — they attach real data to each shot (shot type, lens, camera movement, framing, characters present, duration) and generate the board images automatically, so the breakdown is production-ready rather than a document you still have to interpret.

ACT 3 AI does this as the front end of a full production pipeline: a beat → scene → shot planner auto-computes shot lists with embedded cinematography metadata, an AI cinematography engine converts those shot specs into camera moves without manual keyframing, and first frames and their prompts are generated automatically. This page covers what to expect from automated previs, how to judge output quality, and where the automation ends and your directing begins.

## What a shot list actually has to contain

A shot list that only says "SHOT 4: Maya enters the bar" is a to-do item, not a breakdown. A usable one carries:

- **Shot number and scene reference** — traceable to a script location
- **Shot type** — wide, medium, close, over-the-shoulder, insert, and so on
- **Camera** — position, height, angle, lens choice
- **Movement** — static, pan, dolly, handheld, crane, and the curve it follows
- **Framing** — who is in frame, primary focus, headroom intent
- **Characters present** and their blocking
- **Duration estimate** — driven by dialogue length and action
- **Set/location** — and whether it is 2D, 3D, or procedural
- **Notes** — lighting mood, tone, continuity flags

If a generator gives you the first two columns and nothing else, you have saved yourself typing and nothing more.

## Why manual previs is where indie projects die

The arithmetic is unforgiving. A 40-minute film needs roughly **650 shots**. Even at five minutes of thought per shot — deciding coverage, drawing or sourcing a board frame, noting the lens — that is over 50 hours before a single frame is generated, and it has to be redone every time the script changes. The product research behind ACT 3 AI describes this bluntly: without automation, directorial control collapses under deadline pressure, and there is a whole "market of people who give up with high amounts of labor". A single video can take six weeks of manual effort.

That is the case for automating previs. Not because a machine has better taste than you, but because you should be spending your judgment on the twenty shots that matter, not on typing out the other 630.

## How ACT 3 AI generates shot lists and boards

**Script in, structure out.** Import a finished script (Final Draft, PDF, plain text) and it is auto-formatted with linked metadata. If you only have an idea, AI story expansion takes a single paragraph to a full screenplay with beats, scenes, and dialogue. Articles, books, Wikipedia pages, or pasted raw text are all valid starting points.

**Beat → Scene → Shot planner.** The planner auto-computes the shot list and embeds cinematography metadata on each shot: camera settings, lens choices, movement types, and framing decisions. Shots follow a canonical grammar of 22 standard shot types, extended with key-framed camera curves so motion is designed rather than accidental.

**AI cinematography engine.** Shot specs convert into detailed camera moves with automated pacing and timing — no manual key-framing required. A visuals calculation engine determines shot timing and pacing from dialogue length, action, and emotional tone, so durations are grounded rather than guessed.

**The automation goes past the list.** This is the part most previs tools stop short of. ACT 3 AI automates the first frames and the prompts — both the prompts for the videos and the prompts for the first frames — and auto-generates character sheets with the correct outfits. So your storyboard frames are produced for you, in the right wardrobe for the scene, and each one is already attached to a prompt that can render the shot.

**AI-driven scene and shot creation on approval.** Once you finalize high-level beats, you approve an AI process that automatically builds the initial scene list and shot list. The "Run AI Summary View" shows the available tasks with clear credit cost estimates before you start.

**Boards you can direct from.** A Figma-style top-down canvas lets you place characters, extras, and cameras, draw movement splines, and see camera cones of vision. Body facing and head direction are separate arrows. An outline view gives you Acts > Scenes > Shots, and structural script highlighting color-codes scene boundaries in purple and shot boundaries in yellow.

**Change the script, the breakdown follows.** A story-factor dependency graph plus an automated calc engine cascades edits through the script and renders, so a rewrite updates the dependent structure instead of stranding your shot list. Human-approved and AI-recommended versions sit side by side with a draft version navigator, so you can compare and accept rather than overwrite.

## Where automation ends and you start

Be clear-eyed about what to expect:

- **The first pass is a first pass.** Auto-generated coverage is competent and complete, not visionary. The value is that it exists in minutes and covers all 650 shots consistently.
- **You still make the taste calls.** Which beat gets the long take, which reveal needs a push-in, when to break coverage — that is directing, and the platform is built around a human/AI handshake at every decision point rather than a one-shot generation.
- **Reordering and rewriting is expected.** AI-suggested Acts and Beats are meant to be reviewed, re-ordered, or edited.
- **Dedicated boarding tools still have a place.** If you want hand-drawn boards with a specific illustrative style, a traditional storyboard tool or an artist is a legitimate choice. What you give up is the link between the board and the render.

## Checklist: evaluating an AI shot list generator

1. Does it take my actual script format, or only a text box?
2. Does each shot carry **structured** cinematography data — shot type, lens, movement, framing — or just a sentence?
3. Are durations computed from dialogue and action, or arbitrary?
4. Are board frames generated automatically, with the character in the right outfit?
5. Do the boards connect to anything downstream, or is the board the end of the road?
6. When the script changes, does the breakdown update?
7. Can I see the whole project as an outline and as a timeline?
8. What does it cost per run, and is that shown before I commit?

## FAQ

**Can it work from an idea instead of a finished script?**
Yes. AI idea expansion turns a single paragraph into a full screenplay with beats, scenes, and dialogue, and the wizard lets you pick a framework — Movie (3 Acts), Short Story, or Explainer — plus a target duration that the AI shapes the story, scenes, and shots to fit.

**What script formats can I import?**
Final Draft (FDX), PDF, and plain text are ingested and auto-formatted to industry-standard screenplay format with linked metadata throughout. Articles, books, Wikipedia pages, and pasted text are also accepted as source material.

**Does it generate the storyboard images, or just the list?**
Both. Automating the first frames — and the prompts for both the first frames and the videos — is core to the product, along with auto-generated character sheets carrying the correct outfits for each scene.

**Will characters look the same on every board frame?**
Per-character LoRA models are trained behind the scenes so a character's appearance stays consistent across shots and scenes, and digital actor casting assigns a specific actor to each character for continuity.

**How much does a generation run cost?**
The platform runs on metered credits, and cost is shown before you act: buttons display the exact credit cost, wizard Continue buttons carry a credit badge, and the "Run AI" summary view shows cost estimates per task. The first three "AI Script & Shots & Scenes" generations are offered at cost.

**Can I export the shot list to my existing workflow?**
Yes. The import/export bridge covers FDX, PDF, EDL, and MP4/MOV, and shot-list export to Adobe Premiere is part of the platform's integration story.

## Skip the manual previs pass

You do not need to hand-build 650 shots to find out whether the story works. Import a script, let the planner produce the beats, scenes, shots, boards, and prompts, and spend your time on the shots that carry the film.

**See the beat-to-shot planner run on a real script — book a walkthrough, or start free and import your own.**
