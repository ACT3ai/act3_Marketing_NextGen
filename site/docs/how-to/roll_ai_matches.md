---
title: "How to Generate Cinematic B-Roll With AI That Matches Your Story"
description: "To make B-roll with AI, you write a shot spec — not a vibe. A usable AI B-roll shot needs five things stated explicitly: subject and action, shot type…"
---

# How to Make B-Roll With AI That Matches Your Story

To make B-roll with AI, you write a shot spec — not a vibe. A usable AI B-roll shot needs five things stated explicitly: **subject and action, shot type, camera movement, lens, and lighting**. Feed those five into a video model and you get footage that cuts against your A-roll. Type "cinematic city street" and you get a stock-looking clip that fights your edit.

B-roll is the cutaway footage that covers your main footage: the hands on the keyboard over a narrated line about work, the empty hallway before a reveal, the establishing wide before a scene. Its whole job is to *match* — match the location, the time of day, the color, the energy, and the camera language of the shot before and after it. Generic AI clips fail exactly there. They look fine alone and wrong in context.

This guide covers how to spec, generate, and cut AI B-roll so it belongs to your story. It does not cover stock-footage licensing, and it does not cover editing technique beyond what B-roll needs.

---

## What makes B-roll "match"

Before generating anything, write down what the B-roll has to match. There are five axes, and you should be explicit about all of them:

| Axis | Question to answer | Failure if you skip it |
|---|---|---|
| **Continuity** | Same location, time of day, weather, season? | Your night interview cuts to a sunny exterior |
| **Look** | Same color palette, contrast, grain, style? | The insert looks like a different production |
| **Camera language** | Handheld or locked? Long lens or wide? | Static drone-style B-roll under a handheld scene |
| **Energy** | Does the motion match the pacing of the cut? | A slow push under a fast montage |
| **Story function** | What does this shot *tell* the viewer? | Pretty footage that means nothing |

The last row is the one creators most often miss. B-roll is not decoration. Every cutaway should either advance information, cover an edit, or set mood deliberately.

## Step 1: Write the shot spec

Turn each B-roll need into a single line with all five fields. Compare:

**Weak:** *"coffee shop b-roll"*

**Strong:** *"Close-up, 85mm, shallow depth of field, slow push-in on steam rising from a paper cup on a wooden counter; warm morning window light from camera left; shallow handheld drift."*

The second version specifies subject, shot type, lens, movement, and lighting. That is the whole trick. Everything else in this guide is about producing specs like that reliably instead of writing them by hand a hundred times.

Useful vocabulary to work from:

- **Shot types:** extreme wide, wide, medium, medium close-up, close-up, extreme close-up, over-the-shoulder, insert, POV, two-shot. There is a canonical grammar of roughly 22 standard shot types — learn it and use the names.
- **Movement:** static, pan, tilt, dolly in/out, truck, crane, handheld drift, orbit.
- **Lens:** wide (16–35mm) for space and energy, normal (50mm) for neutrality, long (85mm+) for compression and isolation.
- **Lighting:** key direction, hard vs. soft, practical sources, time of day, color temperature.

## Step 2: Match the plate, not just the description

The single biggest tell of mismatched AI B-roll is lighting. If your A-roll is lit from a window on the left at 4pm and your cutaway is lit from overhead at noon, no amount of color grading will fix the cut.

Two practical fixes:

1. **Describe the light in the same terms across every shot in the scene.** Write the lighting once per scene and reuse it verbatim.
2. **Use a system that matches lighting to the background plate automatically** rather than re-deriving it per prompt. Automated matching to the background plate is how you keep visual consistency across a batch of shots without hand-tuning each one.

## Step 3: Generate in batches, review in sequence

Generate B-roll a scene at a time, not a shot at a time. Then review it *in the timeline*, cut against the A-roll it is meant to cover. A shot that reads beautifully in a grid of thumbnails frequently dies in context.

When a shot fails, change one variable — lighting, pacing, or mood — and regenerate that shot only. Rebuilding the batch is wasted spend.

---

## Where ACT 3 AI fits

Most AI video tools give you a prompt box. That is fine for one hero clip and hopeless for thirty cutaways that all have to belong to the same scene.

ACT 3 AI approaches B-roll as a cinematography problem rather than a prompting one. Shots carry structured cinematography metadata — camera settings, lens choice, movement type, framing — attached to the shot itself, not buried in a paragraph of text. An AI cinematography engine converts those shot specs into detailed camera moves with automated pacing and timing, with no manual keyframing, and lighting is matched automatically to the background plate so a batch of shots holds together.

That structure is what makes matching B-roll practical at volume. Because shots inherit a project-level style preset and a linked set, every cutaway generated for a scene starts from the same look, the same location, and the same light. You can tag a group of shots — "shots for review," "beach scenes" — and render the whole tagged batch at once, which is exactly the shape of a B-roll pass. B-roll generation is a first-class metered action on the platform, alongside script generation, video shots, and text-to-speech.

If you want to go deeper on how a shot's story, camera, and lighting data get bundled into one generation instruction, see our explanation of the **mega prompt**. If you are planning coverage before you shoot anything, see our guide to **previsualization**.

---

## Step 4: Cut it properly

Generation is half the job. The edit is the other half.

- **Cut on motion.** Enter a cutaway on movement and leave on movement; it hides the seam.
- **Keep cutaways short.** Two to four seconds is usually enough. AI clips degrade the longer they run, so short cuts play to the technology's strengths.
- **Vary shot size.** Three consecutive close-ups feel claustrophobic. Alternate wide, medium, close.
- **Grade the whole sequence together,** not shot by shot, so the AI footage and your source footage land in the same color space.
- **Add sound.** Room tone and a matched effect do more to sell a cutaway than another regeneration pass.

## Step 5: Export for where it lives

A vertical Reel and a 16:9 YouTube upload need different framing decisions, not just different crops. Decide the aspect ratio before you spec the shot — a close-up composed for 9:16 places the subject differently than the same shot for 16:9. Then export per platform: 16:9 for YouTube, 9:16 for TikTok and Reels, 1:1 for feed posts.

---

## FAQ

**What is B-roll, exactly?**
B-roll is supplementary footage cut over or between your primary footage. It covers edits, illustrates narration, establishes location, and controls pacing. A-roll is your main subject; B-roll is everything else you cut to.

**Can AI B-roll match footage I shot on a real camera?**
It can get close if you match the five axes — continuity, look, camera language, energy, and story function — and grade the whole sequence together. Long lenses, shallow depth of field, and short cuts hide the most. Expect to do a grading pass rather than dropping raw generations into a finished edit.

**How long should an AI B-roll clip be?**
Generate a little longer than you need and cut down. Two to four seconds on screen is typical. Short cuts also avoid the drift that shows up in longer AI generations.

**Why does my AI B-roll look like stock footage?**
Because the prompt described a subject and not a shot. Add shot type, lens, movement, and lighting direction. Stock-looking output is almost always under-specified camera work.

**How do I keep thirty cutaways looking like one scene?**
Lock a project-level visual style and a set, describe the lighting once per scene and reuse it, and generate the batch together rather than over several sessions with different wording.

**Do I need a separate tool for B-roll and for main scenes?**
No, and splitting them tends to cause the mismatch problem. Generating cutaways in the same project as your scenes means they inherit the same style, set, and lighting by default.

---

## Try it on your next scene

Write one proper shot spec — subject, shot type, movement, lens, lighting — and generate against it. The difference from a one-line prompt is immediate.

**[Explore ACT 3 AI free](https://app.act3ai.com/signup)** and generate a matched B-roll pass for a scene you are already cutting.
