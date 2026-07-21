---
title: "Directing AI: Controlling Camera, Lens, and Lighting Per Shot"
description: "Short answer: there are three levels of camera control in AI video, and knowing which one you are using explains most of your frustration. Level 1 is…"
---

# How to Control Camera Angles in AI Video

**Short answer:** there are three levels of camera control in AI video, and knowing which one you are using explains most of your frustration. **Level 1 is prompt language** — writing "low angle, 35mm, slow dolly in" and hoping the model complies. It works maybe half the time and drifts between generations. **Level 2 is image conditioning** — supplying a first frame that already has the angle and framing you want, so the model inherits the composition rather than inventing it. This is dramatically more reliable. **Level 3 is structured, spatial control** — placing the camera in an actual 3D space relative to your characters and set, defining its path, and generating from that.

If you only ever prompt, you are directing by suggestion. The reliable technique for a specific angle is almost always: **compose the first frame to establish the angle, then describe only the motion in the prompt.** Angle lives in the frame; movement lives in the prompt.

This guide covers the vocabulary that actually influences models, how to specify lens and lighting, why control matters economically, and what structured camera control looks like.

---

## Why prompting alone fails

Generative video models are trained on footage, not on a camera rig. They have learned strong statistical associations between phrases like "close-up" and the images that usually accompany them, but they have no camera to place. Three consequences follow:

1. **Angle terms are approximations.** "Low angle" reliably tilts up. "Low angle, 18 inches off the floor, subject two metres away" does not add precision — the extra numbers are mostly ignored.
2. **Results drift between generations.** The same prompt on the same model returns a different framing each time. Across 650 shots that variance becomes continuity chaos.
3. **Compound instructions degrade.** Asking for angle, movement, lens, and lighting in one sentence usually gets you two of the four.

The fix is to move as much as possible out of the prompt and into something deterministic — a composed first frame, or a real camera position in a 3D scene.

## The camera vocabulary that actually influences models

Use standard, widely-documented film terminology. Models learned from footage captioned in industry language, so canonical terms outperform invented descriptions.

| Category | Terms that work | Notes |
|---|---|---|
| Shot size | extreme wide, wide, full, medium, medium close-up, close-up, extreme close-up | The most reliable dimension of all |
| Angle | eye level, low angle, high angle, overhead / bird's eye, dutch angle, over-the-shoulder | Reliable in direction, not in degrees |
| Movement | static, pan, tilt, dolly in/out, truck, crane, handheld, steadicam, orbit | Best specified in the prompt; put one move per shot |
| Lens | 14mm, 24mm, 35mm, 50mm, 85mm, 135mm; anamorphic; macro | Influences compression and distortion, not exactly |
| Depth of field | shallow, deep, rack focus | "Shallow depth of field" is more reliable than an f-number |
| Lighting | key light direction, high key, low key, practical, rim light, golden hour, overcast | Directional description beats naming fixtures |

Three rules make these land:

- **One camera move per shot.** A dolly *and* a pan *and* a rack focus in one generation produces mush. If you need three moves, that is three shots.
- **State the subject's relationship to camera, not just the label.** "Camera behind the character's shoulder, framing the doorway ahead" beats "over-the-shoulder shot."
- **Put lighting in the first frame.** Lighting is a property of the image far more than of the motion; establish it in the frame and the video inherits it.

## Directing the frame instead of the prompt

The practical workflow that produces reliable angles:

1. **Decide the shot in words** — size, angle, lens, lighting, and one movement.
2. **Generate or compose the first frame** to that specification, and iterate on the *image* until the angle is exactly right. Images are cheaper and faster to iterate than video.
3. **Generate the video from that frame**, describing only the motion and the action.
4. **Lock the good frame** so the shot can be regenerated later without losing the composition.

This inverts most people's process, and it is the single highest-leverage change you can make.

## Why control is an economic issue, not just a creative one

Every uncontrolled generation is a retry, and retries are the hidden multiplier on the cost of AI video. If your usable rate on first pass is one in five, your real cost per finished second is five times the sticker. Control features are cost features. They are also continuity features — a film where the coverage of a scene was generated by chance will not cut together, no matter how good the individual shots look.

---

## What structured camera control looks like in ACT 3 AI

ACT 3 AI is built around the premise that directorial control is the missing piece in AI video — the ability to place actors precisely, put the camera where you want it, and time actions correctly. Rather than leaving camera work to prompt wording, it treats cinematography as structured data attached to each shot.

- **Cinematography as metadata per shot.** A beat-to-scene-to-shot planner embeds camera settings, lens choice, movement type, and framing on every shot, so a shot's camera specification is a record you can edit and reuse rather than a sentence you retype.
- **A canonical shot grammar.** 22 standard shot types, extended with keyframed camera curves so motion is designed rather than hoped for.
- **A Figma-style top-down canvas.** Place characters and cameras in a bird's-eye view of the set, draw movement paths as splines, and see each camera's cone of vision — with exact camera height from the ground and compass direction available as set-level shot parameters. This is spatial camera control, not prompt language.
- **Independent head and body rotation.** Body facing and head looking direction are controlled separately, which is what makes eyelines and over-the-shoulder coverage read correctly.
- **Keyframe management on the timeline.** Add, edit, and delete keyframes to control camera movement and character position over time, with undo-friendly behaviour.
- **Focus direction.** The cinematography panel sets "Camera Focus To" — a specific character, a group, or the character in dialogue — with one character designated primary focus to guide the AI's compositional choices.
- **Lighting as part of the shot.** Lighting setups are specified alongside camera in the shot's data and composed into the generation prompt, with automatic matching to background plates for consistency.
- **Automatic first frames.** Because first-frame composition is the most reliable route to a specific angle, ACT 3 AI generates the first frame for each shot automatically — along with the prompts for both the first frame and the video — so the technique above is the default path, not a manual chore.
- **Prompt visibility when you want it.** An AI prompt editing panel exposes the composed prompt for direct editing, and "Copy Prompt" and "Copy Video" utilities let you inspect or reuse exactly what was sent.
- **Blender sync for absolute control.** For shots where nothing but a real 3D camera will do, send the shot or set to local Blender, do the work, and sync back.

The design principle throughout is a human-in-the-loop handshake: the system proposes camera moves, actors, and set geometry; you approve or override. One-click regeneration lets you change lighting, pacing, or mood on a shot and re-render without leaving the editor.

## Honest limits

No current system gives you exact focal-length physics or frame-accurate camera positioning in a purely generative render — that is what a 3D pipeline is for. Long, complex moves through space remain difficult. Rack focus is unreliable in generation and often better achieved by cutting. Direct the shots you can control, and design your coverage around the ones you cannot.

---

## FAQ

**How do I get a specific camera angle in AI video?**
Establish the angle in the first frame rather than the prompt. Compose or generate a still with the exact framing, then generate the video from it while describing only the motion. Prompt-only angle control drifts between generations.

**Do lens specifications like "35mm" actually do anything?**
They influence the look — compression, distortion, apparent depth of field — because the models learned from footage captioned that way. They do not produce optically exact results. Treat lens terms as strong stylistic hints, not physics.

**Why do my camera moves come out wrong?**
Usually because more than one move is requested at once. Specify a single move per shot — one dolly, or one pan, or one tilt. If your idea needs three moves, it needs three shots.

**How do I keep camera style consistent across a whole film?**
Store cinematography as reusable data rather than retyping prompts. ACT 3 AI embeds camera settings, lens, movement, and framing as metadata on each shot within a canonical grammar of 22 shot types, so a look can be applied and repeated across a production.

**Can I position the camera spatially instead of describing it?**
Yes, in tools that model the scene. ACT 3 AI provides a Figma-style top-down canvas where you place cameras with visible cones of vision, set exact height and compass direction, and draw movement paths as splines — with Blender round-trip sync when you need full 3D control.

**Does better camera control save money?**
Materially. Retries are the largest hidden cost in AI video, and uncontrolled generation means more of them. Precise control also produces coverage that actually cuts together, which saves the far more expensive problem of a scene that cannot be edited.

---

## Learn the pipeline around the camera

Camera control is one part of a larger chain. If you want to see where it sits, read our step-by-step guide to turning a script into a finished video with AI — then try directing a scene yourself on the ACT 3 AI free plan and compare a frame-led shot against a prompt-only one.
