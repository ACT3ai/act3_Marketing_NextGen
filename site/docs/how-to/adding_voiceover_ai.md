---
title: "Adding TTS Voiceover and Lipsync Inside One AI Pipeline"
description: "There are three ways to add voiceover to AI video, and they differ in how much cleanup you inherit later:"
---

# How to Add Voiceover to AI Video

There are three ways to add voiceover to AI video, and they differ in how much cleanup you inherit later:

1. **Generate the voice separately and lay it under the video.** Make the clips, export them, write the narration, run it through a text-to-speech tool, and sync it in an editor. Works for narration over B-roll. Falls apart the moment a character's mouth is on screen.
2. **Generate the voice, then lipsync the footage to it.** Feed the audio into a lipsync tool that reshapes mouth movement to match. Better, but it is a separate round trip per shot.
3. **Generate the voice from the script inside the same pipeline that generates the video.** The dialogue in the script becomes speech, the speech length sets the shot length, and the mouth shapes are driven by the same audio — all before the shot is rendered.

Option three is the one that scales. If your project is a single 30-second clip, option one is fine. If it is a short film with 200 shots of people talking, the per-shot round trips in options one and two become the entire project.

This guide covers all three, with the practical details of each.

---

## What "voiceover" actually means in AI video

The word covers two different jobs, and they have different solutions:

- **Narration** — an unseen voice over images. No mouth on screen, so nothing needs to sync. Any decent TTS plus an editor solves it.
- **Character dialogue** — a person on screen saying words. Now the audio and the picture have to agree: the mouth shapes, the timing, and the length of the shot.

Most guides conflate them, which is why people follow the narration workflow and then discover their characters look dubbed.

## Method 1: TTS plus an editor (best for narration)

The straightforward route.

1. Write the narration script. Read it out loud and time it — TTS runs roughly at reading pace, so a 150-word paragraph is about a minute.
2. Generate the audio with a TTS engine. Choose voice, language and accent.
3. Import audio and video into an editor.
4. Cut the picture to the narration, not the other way round. Narration sets the spine; visuals fill it.
5. Duck any music under the voice and level the whole thing.

**Where it goes wrong:** you generate the video first, then discover the narration is nine seconds long and the clip is five. Write and time the voice *before* generating the visuals.

## Method 2: Post-hoc lipsync (best for a handful of talking shots)

If a character has to speak on camera and your video tool does not handle audio:

1. Generate or record the line as audio.
2. Generate the video shot of the character.
3. Run both through a lipsync tool that re-drives the mouth from the audio waveform.
4. Reassemble in the editor.

This works. It also means three tools and two exports per shot. Ten shots is an afternoon; two hundred shots is a month you will not spend.

## Method 3: Voice generated inside the production pipeline

The structural fix is to stop treating audio as a post step. If the dialogue already exists in your script, and the script is what drives shot generation, then the voice can be produced *from* the script and used to drive both the timing and the mouth movement of the shot.

That is the model [ACT 3 AI](https://act3ai.com/) uses, and it is why audio lives in the same tool rather than downstream of it.

### How it works in ACT 3 AI

- **Built-in text-to-speech generates spoken lines directly from the script** and embeds them into the rendered video timeline. You do not write the narration twice — the dialogue you already wrote *is* the audio source.
- **TTS runs per shot and drives lipsync duration.** The length of the spoken line informs how long the shot needs to be, so you stop discovering timing mismatches after the render.
- **Voice settings live on the character.** Language and accent are character metadata, alongside name, age, appearance and wardrobe — so a character sounds the same in episode six as in episode one without you remembering which voice you picked.
- **Facial auto-lipsync** takes the dialogue text or an audio clip and generates believable mouth shapes across a 52-blend-shape rig, using audio-driven facial animation technology.
- **The visuals calculation engine uses dialogue length** — along with action and emotional tone — to determine shot timing and pacing, so dialogue and picture are planned together rather than reconciled afterwards.
- **Everything lands on one timeline** in the editor, with hierarchical rows for beats, camera angles, motion and audio, so you can scrub, select a block of shots and play just that selection to check how the dialogue flows across a cut.

The one value proposition here is simple: **audio, performance and picture are the same job, done once, in the same place.** Not three tools, three exports, and a sync pass.

### The full-length review advantage

There is a second-order benefit that matters more than it sounds. Because ACT 3 AI exports a shot list to Adobe Premiere and produces a unified timeline for the whole runtime, you can review an entire one-hour TV show or two-hour movie in one pass — zooming around the full length and watching the clips flow together with their dialogue. Audio problems are almost never visible in a single clip; they show up in the transition between clip 44 and clip 45. Being able to watch the whole thing is how you catch them.

## Choosing a method

| Your project | Best method | Why |
| --- | --- | --- |
| Narration over B-roll, one video | TTS + editor | Nothing to sync; fastest path |
| A few talking shots | Post-hoc lipsync | Acceptable round-trip cost at small scale |
| Short film, dialogue-driven | In-pipeline TTS + lipsync | Per-shot round trips do not scale |
| Series or feature | In-pipeline TTS + lipsync | Voice consistency across episodes matters |
| Explainer or ad with a script | In-pipeline TTS | Script already exists; reuse it as the audio source |

## Practical tips that improve any AI voiceover

- **Write for the ear.** Short sentences. One idea per sentence. TTS engines read punctuation as pacing, so use commas and full stops deliberately.
- **Spell out anything ambiguous.** Numbers, acronyms and proper nouns are the usual failure points. "1985" may read as "one thousand nine hundred eighty-five".
- **Keep a voice per character and never change it mid-project.** Listeners notice voice drift faster than they notice visual drift.
- **Break long speeches with reaction shots.** A 90-word monologue in a single generated clip is a long time to hold on one face.
- **Check the cut, not the clip.** Play a selection of consecutive shots and listen for rhythm, not just correctness.

## FAQ

**Can I add voiceover to AI video without a separate audio tool?**
Yes, if your platform generates speech from the script. ACT 3 AI has built-in text-to-speech that converts scripted dialogue to spoken lines per shot and embeds them into the rendered timeline, so there is no separate export-and-sync step.

**How do I get the mouth movement to match the voice?**
Use audio-driven lipsync rather than hoping the video model gets it right. ACT 3 AI generates lip-sync from the dialogue text or an audio clip using audio-to-face technology across a 52-blend-shape rig, and full facial motion capture is available when you want a real performance driving the expressions.

**Can I use my own recorded voice instead of TTS?**
Yes — a recorded audio clip can drive the lipsync in place of generated speech. That is a common approach when a specific performance matters more than convenience.

**Does the voiceover affect how long each shot is?**
It should. In ACT 3 AI, per-shot TTS drives lipsync duration and the calculation engine factors dialogue length into shot timing and pacing, so shots are sized to the lines rather than trimmed afterwards.

**Can I do multiple languages or accents?**
Character metadata in ACT 3 AI includes voice settings for language and accent, set per character, so the same character keeps a consistent voice across scenes and episodes.

**What if I want to finish the mix in Premiere or DaVinci Resolve?**
That is well supported. ACT 3 AI exports through standard formats — FDX, PDF, EDL, MP4/MOV — and integrates with traditional post-production tools, so you can take a finished cut into your usual audio workflow.

---

## Put the voice where the script already is

If your dialogue is already written, generating it twice is wasted work. **Try ACT 3 AI free and let the script drive the voice, the lipsync and the shot timing in one pass** — then review the whole runtime on a single timeline. See our guides to writing scripts for AI video and auto-storyboarding for the stages either side of this one.
