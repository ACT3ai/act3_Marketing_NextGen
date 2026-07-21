---
title: "What Is Previs? AI Previsualization for Indie Filmmakers"
description: "Previsualization — \"previs\" — is the practice of building a rough, moving version of a sequence before you shoot it. It sits between the storyboard and…"
---

# What Is Previsualization in Filmmaking?

**Previsualization — "previs" — is the practice of building a rough, moving version of a sequence before you shoot it.** It sits between the storyboard and the shoot: instead of static drawings, you get animated shots with real camera positions, lens choices, blocking, and timing. The purpose is to answer expensive questions cheaply. Does this scene work? How many setups does it need? Will the crane move fit the room? How long does the sequence actually run?

Previs began in visual-effects-heavy studio filmmaking, where a single misjudged sequence can cost hundreds of thousands of dollars. It has since become standard for action, VFX, and stunt work at every budget level — and, with AI video tools, it is now practical for a one-person indie production.

For an indie filmmaker, previs does three things: it turns your script into a concrete shot list, it lets you fix a scene before you burn a shoot day on it, and it gives you something to show a producer, a cinematographer, or an investor that is far more convincing than a page of text.

---

## Previs vs. storyboard vs. animatic vs. techvis

These terms get used loosely. They are not the same thing.

| Term | What it is | Moving? | Camera data? | Main use |
|---|---|---|---|---|
| **Storyboard** | Drawn panels, one per shot | No | Implied only | Communicating shot ideas |
| **Animatic** | Storyboard panels cut to timing with scratch audio | Yes (slideshow) | No | Testing pacing and length |
| **Previs** | Rough animated sequence with real cameras and blocking | Yes | Yes | Testing coverage, blocking, timing |
| **Techvis** | Previs annotated with physical measurements | Yes | Yes, precise | Planning the actual shoot day |
| **Postvis** | Rough VFX composited into shot plates | Yes | From the shoot | Editing before final VFX |

The dividing line is camera data. A storyboard says "low angle on the door." Previs says *how low*, on what lens, from how far, moving how fast, for how many seconds. That specificity is the entire value.

## What goes into a previs

A complete previs sequence carries:

- **Blocking** — where actors are, where they move, which way they face and look
- **Camera position and movement** — placement, height, path, speed
- **Lens** — focal length, which determines how much of the space is in frame
- **Coverage** — the full set of shots that will cut together to make the scene
- **Timing** — how long each shot runs, and therefore how long the scene runs
- **Basic lighting** — enough to establish mood and direction, not final quality
- **Set geometry** — the actual space, so sightlines and distances are honest

Deliberately *not* included: final image quality, final performance, final VFX, final color. Previs that chases polish stops being cheap, and cheap is the point.

## Why indie filmmakers should care

The traditional argument for previs is risk reduction on expensive days. The indie argument is different and stronger:

1. **You will find out your scene does not work.** Better on a laptop than on location with a crew waiting.
2. **You get a real shot list.** Not "we'll figure out coverage on the day" — an enumerated list with lenses and durations.
3. **It communicates.** A DP, a producer, or a financier understands a moving sequence instantly. Nobody funds a film off a shot list.
4. **It sets the schedule.** Shot count drives your day count. Previs gives you the count.
5. **It is now cheap.** This is the change. Previs used to require a 3D generalist. It no longer does.

## How AI changed previs

The old previs pipeline meant blocking scenes in 3D software by hand — build set, place characters, animate cameras, render a grey playblast. Excellent results, but it required a skilled artist and days per sequence. That is why previs stayed a studio privilege.

AI-assisted previs changes the economics in two places:

- **Breakdown.** Instead of manually deciding coverage, a system reads your script and computes a beat, scene, and shot structure with cinematography metadata attached to each shot.
- **Imagery.** Instead of grey-box renders, you can generate an actual look for the shot at draft quality.

What has *not* changed is the need for directorial judgement. A tool can propose coverage. Deciding that this scene needs to hold on a single wide, or that the reveal must arrive on a cut and not a push-in, is still yours.

---

## Where ACT 3 AI fits

The reason previs did not spread to indie filmmaking was labour, not concept. A single video can take six weeks of manual effort, and most would-be creators abandon projects the moment they see the hours involved. Any previs tool that adds another manual stage is solving the wrong problem.

ACT 3 AI attacks previs through **automation of the whole chain rather than one step of it**. You import a script — or expand a premise into one — and the platform builds the hierarchy for you: beats, then scenes, then an auto-computed shot list with camera settings, lens choice, movement type, and framing already attached to each shot, drawn from a canonical grammar of 22 standard shot types extended with keyframed camera curves. From there the AI cinematography engine turns those shot specs into actual camera moves with automated pacing, with no manual keyframing.

Blocking happens on a Figma-style top-down canvas: drag character icons into the set, draw movement paths as splines, place virtual cameras and see their cones of vision, and control body facing and head direction independently. Sets can be 2D images, 3D Blender models, or procedurally generated environments, and Blender users can round-trip a set to their local install and sync it back.

The stated target is collapsing a traditional pre-production pipeline of **80–200 hours into roughly two hours** while keeping the director in control at every decision point — the machine proposes, you approve or override. That is the difference between previs being a nice idea and previs being something you actually do on an indie schedule.

For the shot-level detail of how all that data becomes one generation instruction, see our explanation of the **mega prompt**.

---

## A practical previs workflow for a small production

1. **Lock a scene.** Previs one sequence at a time, starting with your hardest.
2. **Break it into shots.** Generate the shot list, then edit it. Cut shots you do not need; add the insert you know you want.
3. **Build or pick the set.** Rough geometry is enough; you need honest distances and sightlines.
4. **Block from the top down.** Place characters and cameras, draw the movement paths.
5. **Set lenses and moves.** This is where the scene's language is decided.
6. **Generate at draft quality.** Do not spend on final renders during previs.
7. **Cut it and watch it.** Timing problems only appear in sequence.
8. **Iterate on the failure.** Change the shot that is wrong; keep the rest.
9. **Export the shot list.** It becomes your call sheet, your schedule, and your VFX brief.

---

## FAQ

**What is previsualization in filmmaking, in one sentence?**
It is a rough animated version of a sequence, built before production, that establishes camera positions, blocking, coverage, and timing so the scene can be tested and costed before anyone spends money shooting it.

**Is previs the same as storyboarding?**
No. Storyboards are static panels showing shot ideas. Previs is a moving sequence with actual camera positions, lenses, and durations. Storyboards communicate intent; previs tests whether the intent works.

**Do indie filmmakers really need previs?**
You need it most when your margin for error is smallest. For a dialogue two-hander in a single room, a shot list may be enough. For anything with action, VFX, a complex location, or a limited number of shoot days, previs pays for itself on the first day it saves.

**How long should previs take?**
Traditionally, days per sequence with a dedicated artist. With an automated breakdown and draft-quality generation, a scene is realistically an afternoon. Keep it rough on purpose — the moment previs starts looking finished, it has become expensive.

**Can AI previs become the finished film?**
Increasingly the same pipeline produces both, since the shot data that drives previs also drives the final render at higher quality. Practically, treat them as separate passes: rough and fast to make decisions, then high quality once the decisions are locked.

**What should I deliver out of previs?**
A cut sequence, a shot list with lenses and durations, and a set/blocking reference. Those three artifacts drive your schedule, your budget, and your crew conversations.

---

## Previs your hardest scene first

Pick the scene you are most worried about, and build a rough moving version of it this week. It is the cheapest insurance in filmmaking.

**[Try ACT 3 AI free](https://app.act3ai.com/signup)** — import a script and see the beat, scene, and shot breakdown it produces.
