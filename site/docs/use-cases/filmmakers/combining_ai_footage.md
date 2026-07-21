---
title: "Combining AI Footage With Real Actors and Locations"
description: "You can combine AI footage with real actors in four practical ways, and choosing the right one per shot is the whole craft of a hybrid indie film:"
---

# How to Combine AI Footage With Real Actors and Real Locations

You can combine AI footage with real actors in four practical ways, and choosing the right one per shot is the whole craft of a hybrid indie film:

1. **Cut between them.** Shoot your actors live, generate the coverage you cannot afford — establishing shots, crowds, weather, vehicles, period exteriors — and intercut in your NLE. Cheapest, lowest risk, and works today.
2. **Drive a digital actor with a real performance.** Record your actor on a phone or webcam, extract markerless full-body motion, and let that performance drive a digital character. The acting is real; the render is not.
3. **Composite a character into a real place.** Use a photograph or plate of your actual location as a 2D set, align its ground plane, and place 3D characters onto the correct horizon line.
4. **Use your real location as the visual reference.** Feed plates and style images in so generated shots match the place you actually shot in.

The hard part is never generating a clip. It is **continuity** — the same face, the same wardrobe, the same lighting, shot after shot — and **editorial**, getting AI shots to sit next to live-action rushes on one timeline without looking bolted on. This page covers how to plan a hybrid shoot around those two problems, and where a production platform helps versus where a clip generator is fine.

## Decide, shot by shot, what should be real

Before any tool question, do the triage. The decision is usually about faces, physics, and money.

| Shot type | Best kept live-action | Best generated | Why |
|---|---|---|---|
| Emotional close-ups and long dialogue | ✔ | | Sustained facial performance is still the hardest thing to fake |
| Establishing and aerial shots | | ✔ | Location, permit, and drone costs collapse |
| Crowds, period streets, weather | | ✔ | Otherwise unaffordable at indie scale |
| Physical stunts and specific props | ✔ | | Real physics and continuity you can control on the day |
| Inserts, b-roll, transitions | | ✔ | Fast to iterate, low continuity load |
| Anything requiring a recognizable real person's likeness | ✔ | | Rights and consent are cleaner when you shoot it |

A useful rule: **generate what the audience looks at for under four seconds; shoot what they look at for longer.** Hybrid films fail when a generated shot has to carry a performance beat.

## Plan for the three continuity risks

**Faces.** A generated character who reappears must be the same character. Without per-character consistency, every scene recasts your film.

**Wardrobe.** Costume drift between an AI shot and the live plate on either side of it is the single most obvious tell in hybrid cutting. Lock outfits by scene, not by prompt.

**Light.** If your live coverage is a cool overcast exterior and the AI insert is warm golden hour, the cut fights itself. Match the plate, and shoot reference stills of your actual location lighting on the day — they are the most valuable thing you take home from set for the AI half of the film.

## Where ACT 3 AI fits in a hybrid workflow

ACT 3 AI is a production platform for AI filmmaking — script through beats, scenes, shots, cinematography, lighting, sets, actors, and render. For a hybrid film, four of its capabilities do the specific work of joining the real half to the generated half.

### Real performances driving digital actors

The actor system is built for performance capture without a stage:

- **Hardware-free motion capture** — full-body motion is extracted from ordinary video, from a phone or a webcam. No MoCap suit, no markers, no volume rental. Your actor performs; the motion drives the digital character.
- **Facial motion capture** for expressions and dialogue delivery, which is what emotional scenes hinge on.
- **Dialogue-driven lip-sync** using Audio2Face, generating mouth shapes on a 52-blend-shape rig from dialogue text or an audio clip.
- **Built-in text-to-speech** (Azure Neural TTS) per shot, with voice settings including language and accent — useful for temp tracks, and for ADR-style replacement before your actor's real recording exists.
- **Independent body and head orientation**, so a character can face one way and look another. It is a small control that makes blocking read as real acting.

The practical consequence: your actor's real timing and body language survive into the generated shot, instead of being replaced by a model's guess at motion. If you want the phone-based version of this specifically, see our guide to iPhone motion capture.

### Your real locations as sets

You do not have to invent the world if you already shot it:

- Sets can be **2D images**, 3D Blender models, or procedural environments — so a photograph of your real location becomes a set.
- **3D ground alignment for 2D sets** aligns the ground plane so 3D characters can be placed correctly in a 2D environment with matched perspective.
- **Blender-aligned ground upload** lets you supply a pre-aligned ground plane so characters drop onto the correct horizon line without manual matching.
- **Style images** can be uploaded per set as a visual mood board that guides generation and keeps the team aligned to how the real place actually looks.
- **Lighting is automatically matched to background plates** for visual consistency — the single biggest cause of a bad hybrid cut.

### Per-shot render modes

This is the control that makes hybrid work practical rather than theoretical. A master dropdown per shot defines the technical pipeline:

- 3D characters on a 2D background
- Full 3D environment
- Generative AI only
- Hybrid approaches

So the same project can carry a fully generated establishing shot, a composited character-in-real-location shot, and a live-action plate you cut in later — planned in one shot list rather than three disconnected pipelines.

### Getting it all onto one timeline

Hybrid films are won or lost in the edit, and the platform is deliberately built to hand off:

- **Export bridge**: FDX, PDF, EDL, MP4/MOV, and project archives — designed for integration with traditional post-production tools.
- **4K ProRes masters** per shot, scene, episode, or season.
- **Post-tool compatibility** with Premiere Pro and DaVinci Resolve, plus shot-list export to Premiere.
- **Blender sync** with a full round trip: send a shot or set to local Blender, do custom 3D work, sync back.
- On the platform side, you can review a whole feature-length cut on a unified timeline, zoom from a full-feature overview down to single-frame detail, and play back a selected block of scenes to check how transitions land — which is exactly the review you need when half your shots are generated.

## Honest scope: what a platform does not replace

Be clear about the boundaries before you plan a shoot around this:

- **It does not shoot your live-action.** Camera, sound, and direction on the day are still yours.
- **It is not your finishing NLE.** Conform, color grade, and final mix of live-action rushes belong in Premiere or Resolve; the platform exports into them.
- **It does not resolve likeness rights.** If you are generating a recognizable person, that is a legal and consent question, not a software one. Note that prompts, scripts, and finished outputs are scanned by a three-stage content moderation system, which helps with brand safety but is not a rights clearance.
- **A clip generator may be enough** if you need three b-roll shots and nothing recurs. The case for a platform starts when characters, sets, and wardrobe have to repeat across a whole film.

## FAQ

**Can I use my real actors' performances in AI shots?**
Yes — through markerless motion capture. Full-body motion can be extracted from ordinary phone or webcam video with no MoCap suit or specialized hardware, and facial capture handles expressions and dialogue delivery. That performance drives a digital actor, so the acting is your actor's even when the pixels are generated.

**How do I stop the AI character from changing between shots?**
Character consistency is handled with per-character LoRA training behind the scenes, so a character renders identically across dozens of shots. Casting assigns a specific digital actor per character across scenes and episodes, and wardrobe variants are defined per scene so outfits stay continuous.

**Can I use a photo of my real location as the set?**
Yes. Sets can be 2D images, and there are tools to align the ground plane of a 2D set so 3D characters can be placed with correct perspective. You can also upload a pre-aligned ground plane so characters land on the right horizon line, and upload style images so generation matches the real place.

**How do I get AI shots and live-action footage onto the same timeline?**
Export. The platform supports FDX, PDF, EDL, MP4/MOV, and project archives, produces 4K ProRes masters, and is built for compatibility with Premiere Pro and DaVinci Resolve, including shot-list export to Premiere. Conform your live rushes and the exported AI shots together in your NLE.

**Will the lighting match my location plates?**
The lighting system automatically matches to background plates to maintain visual consistency, and per-shot cinematography metadata covers camera, lens, movement, and lighting so you can direct the match rather than hope for it. Shooting reference stills of your real location lighting is still the best input you can give it.

**Is a full platform overkill if I only need a few generated shots?**
Possibly. For a handful of one-off b-roll shots with no recurring characters, a prompt-to-video tool is the faster answer. The platform earns its place when the same characters, sets, and wardrobe have to hold across a whole film, and when you need those shots planned, tracked, and exported alongside your live-action coverage.

## See how it compares on your own shot list

Bring a scene breakdown from your hybrid film — the shots you plan to shoot and the ones you plan to generate — and **book a walkthrough** to see how ACT 3 AI would plan, cast, render, and export them next to your live-action coverage. If you would rather read first, start with our comparison of AI production against traditional shooting speed, and our guide to integrating AI shots with DaVinci Resolve.
