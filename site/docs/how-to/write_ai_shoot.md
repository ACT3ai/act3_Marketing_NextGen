---
title: "How to Write a Script an AI Video Pipeline Can Actually Shoot"
description: "To write a script for AI video, write a normal screenplay — but make three things explicit that a human crew would have inferred: who is on screen, where…"
---

# How to Write a Script for AI Video That a Pipeline Can Actually Shoot

To write a script for AI video, write a normal screenplay — but make three things explicit that a human crew would have inferred: **who is on screen**, **where they are**, and **what the camera is doing**. AI video models do not read subtext. They render what a prompt describes. So the job of your script is not to be beautiful prose; it is to be *decomposable* into shots, each of which can become a specific image prompt and a specific motion prompt.

The practical recipe:

1. Write in standard screenplay format — scene heading, action, character cue, dialogue. Formats like Final Draft (FDX), PDF, and plain text are what production tools ingest.
2. Keep each action paragraph to **one visual idea**. One paragraph should map cleanly to one shot.
3. Name characters consistently — the same spelling, every time. Consistency of naming is what lets a pipeline keep a character's face and wardrobe stable across shots.
4. Write **sluglines that describe a place**, not a mood. `INT. POLICE STATION - BULLPEN - NIGHT` is shootable. `INT. DESPAIR` is not.
5. Say what changes. AI video clips are short. A shot where nothing moves is wasted runtime.

Everything below expands those rules, and covers what to *stop* doing when you write for a generative pipeline.

---

## Why AI video needs a different kind of script discipline

A traditional script is a set of instructions to people who fill in the gaps. A first AD infers coverage. A DP infers the lens. A costume designer infers that the detective is still wearing the same coat in the next scene because obviously she is.

A generative pipeline infers none of that by default. Each shot is generated more or less independently, from a prompt. Anything you did not state has to be re-stated for every single shot, or the model will invent something new — a different coat, a different room, a different face.

This is the whole reason AI filmmaking gets described as tedious. A 40-minute film runs to roughly **650 shots**. If you are hand-writing prompts for 650 shots and hand-checking continuity between them, you will abandon the project long before you finish it. Most people do.

So the goal of "writing for AI" is to write a script that a system can *break down automatically* — into beats, scenes and shots, each carrying enough structured metadata that the prompt for shot 417 already knows who is in it, what they are wearing, what room they are standing in, and what the camera did in shot 416.

## Step 1: Structure the script so it breaks down cleanly

### Use real scene headings

Every scene heading should carry three facts: interior/exterior, a specific named location, and time of day. Reuse the *exact same location name* every time you return there. `INT. MAYA'S APARTMENT - KITCHEN - DAY` used consistently is a set that can be built once and reused; three different spellings become three different sets.

### One visual idea per action paragraph

Compare:

> Maya storms in, throws her keys at the wall, pours a drink, sits down heavily and stares at the phone for a long time.

That is five shots welded into one paragraph. Split it:

> Maya storms in and throws her keys at the wall.
>
> She pours a drink.
>
> She sits, heavily.
>
> She stares at the phone. It does not ring.

Now each paragraph is a shot candidate. A shot planner can compute a shot list from this; from the welded version, it has to guess.

### Keep dialogue lines short enough to time

Shot length in a generative pipeline is often derived from how long the dialogue takes to speak once it is run through text-to-speech. A 90-word monologue becomes a very long single shot. Break long speeches with reaction beats and cutaways so the timing engine has natural places to cut.

## Step 2: Write the details the model cannot infer

Add a short, factual layer of description that a human crew would never need written down.

| What to specify | Why AI needs it | Example |
| --- | --- | --- |
| Character appearance | Faces drift between shots without a locked reference | "MAYA, 34, close-cropped black hair, scar through left eyebrow" |
| Wardrobe per scene | Outfits change silently between generated shots | "Maya — grey wool coat, navy scarf (all of Act 1)" |
| Location constants | Rooms re-generate differently each time | "Bullpen: green tile floor, six desks, glass captain's office upstage" |
| Time of day and light | Lighting is not inherited between shots | "Late afternoon, low sun through blinds" |
| Camera intent | Framing is otherwise arbitrary | "CLOSE ON — the phone screen" |

Two habits matter most:

- **Write a character bible once**, not per scene. Name, age, physical appearance, personality, and wardrobe variants ("Evening Party", "Working in Office") belong in one place that every shot can reference. Retyping the description into 650 prompts is exactly the labor you are trying to avoid.
- **Write camera intent sparingly but clearly.** You do not need to specify a lens on every line. You do need to mark the handful of shots where framing carries the meaning — the close-up on the phone, the wide that reveals the room is empty.

## Step 3: Stop writing things AI cannot shoot

Some perfectly good screenwriting is dead weight in a generative pipeline:

- **Interior state with no exterior sign.** "He realises she has been lying to him for years." Rewrite it as something visible.
- **Montage shorthand.** "A montage of their summer." That is 20 shots you have not written. Write them, or cut them.
- **Continuous multi-beat action inside one paragraph.** See above — split it.
- **Unnamed extras that matter.** "A crowd reacts." Which crowd, how big, doing what?
- **Off-screen sound doing the storytelling.** Generated clips handle synchronized dialogue well; ambient narrative sound design is a separate post step, so do not let a plot point live only in an off-screen noise.

## Where ACT 3 AI fits

Everything above is manual work — and it is exactly the manual work that scales badly. This is where a production platform earns its place rather than another prompt box.

[ACT 3 AI](https://act3ai.com/) is built around the idea that you should write the script, and the **prompts should write themselves**. You import a finished script — FDX, PDF, or plain text — or hand the system a high-level premise and let AI story expansion grow it into a full screenplay with beats, scenes and dialogue. From there the automation does the part that breaks human patience:

- **Beat → Scene → Shot planning** auto-computes the shot list and embeds cinematography metadata — camera settings, lens, movement type, framing — instead of leaving you to invent it per shot.
- **Automatic first frames** are generated for shots, so you are not hand-producing a reference image before every clip.
- **Shot-level prompt assembly** combines the scripted action, your visual instructions and the cinematography cues into a detailed "mega prompt" for the generative engine — the prompt for the video *and* the prompt for the first frame, written for you.
- **Character sheets with the correct outfits** are generated automatically, and per-character LoRA training keeps a face consistent across dozens of renders, so the wardrobe and appearance you wrote once actually survive to shot 417.

That is the single value that matters here: **you write the script; the pipeline writes the prompts.** The formatting discipline in this article still helps — a cleanly structured script produces a cleaner automatic breakdown — but you are no longer the person typing 650 prompts by hand.

If you want the next step after the script, see our companion guides on turning a script into an AI storyboard and shot list, and on how AI filmmaking works end to end.

## A checklist before you hand a script to any AI pipeline

- [ ] Scene headings use consistent, specific location names
- [ ] Every action paragraph is one visual idea
- [ ] Character names are spelled identically everywhere
- [ ] A one-page character bible exists: appearance, age, wardrobe per act
- [ ] Long speeches are broken by reaction beats
- [ ] Every important story moment is visible on screen, not internal
- [ ] Montages are written out as real shots or cut
- [ ] The script is exported as FDX, PDF, or clean plain text

## FAQ

**Do I need to write in screenplay format for AI video?**
It helps a great deal. Standard format gives a parser unambiguous signals about where scenes start, who is speaking, and what is action versus dialogue. Platforms that ingest FDX, PDF, or plain text rely on those conventions to build the project hierarchy of scenes and shots. If you are working from a rough idea instead, you can start from a premise and have AI expand it into a properly formatted script.

**How long should each shot's action line be?**
One sentence to a short paragraph, covering a single visual idea. Generated clips are short, so a shot that contains three separate actions will either be truncated or rendered as an incoherent blur. Split it.

**Should I write camera directions into the script?**
Write them where the framing is the point — a reveal, a close-up on an object, a push-in on a decision. For the rest, let the shot planner assign camera, lens and movement, and adjust in the cinematography controls afterwards. Hand-writing camera direction into all 650 shots is not a workflow that survives contact with a deadline.

**How do I stop characters from changing appearance between shots?**
Define the character once — appearance, age, wardrobe variants — and use a system that carries that definition into every shot's prompt automatically. ACT 3 AI generates character sheets with the correct outfits and trains a per-character LoRA so the same character renders consistently across scenes and episodes, rather than relying on you re-describing them in each prompt.

**Can I adapt a book, article, or existing text instead of writing a script?**
Yes. ACT 3 AI accepts formal scripts, articles, books, Wikipedia pages, or raw pasted text as the foundation, and expands them into a structured story with acts, beats, scenes and shots.

**How long does the script-to-shots step take?**
The point of the automation is that the pre-production pass — beats, scenes, shot list, cinematography metadata, first frames and prompts — happens as a machine job rather than weeks of manual breakdown. ACT 3 AI is designed for whole-film runs at that scale, with progress and credit costs shown before each job starts.

---

## Start with the script you already have

Write the script cleanly, then let the pipeline do the breakdown. **Import your script into ACT 3 AI free and watch it turn into beats, scenes, a shot list, first frames and finished prompts** — no prompt engineering required. Read on with our guide to auto-storyboarding from a script to see what the next stage looks like.
