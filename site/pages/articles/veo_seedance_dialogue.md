---
title: "Veo 3.1 vs Seedance 2.5 Dialogue: Costs Compared"
description: "Veo 3.1 1080p costs 2,080 credits per 8-second shot and Seedance 2.5 1080p costs 2,128, but of the two only Seedance 2.5 holds one take past 8 seconds."
keywords: ["veo 3.1 vs seedance 2.5 dialogue", "AI filmmaking", "AI video generation"]
image: "https://act3ai.com/img/Act3_Preview.jpg"
wrapperClassName: article-page
last_update:
  date: 2026-09-18
# Provenance -- authored upstream, published by scripts/sync-articles.js.
article_slug: "veo_seedance_dialogue"
article_target_query: "veo 3.1 vs seedance 2.5 dialogue"
article_persona: "Indie Filmmaker"
article_funnel_stage: "Compare"
article_search_intent: "Commercial"
article_content_type: "Comparison"
article_key_value: "Serious_Production"
---

{/* GENERATED FILE -- do not edit here.
    Source: <seo corpus>/veo_seedance_dialogue/veo_seedance_dialogue.md
    Regenerate with: node scripts/sync-articles.js */}
# Veo 3.1 vs Seedance 2.5 Dialogue: Costs Compared

**Short answer:** Veo 3.1 1080p costs 2,080 credits per 8-second shot and Seedance 2.5 1080p costs 2,128, but of the two only Seedance 2.5 holds one take past 8 seconds. Price will not tell you which model delivers a line better, so test it: the same line on both models, plus once with text-to-speech and lip-sync, costs 4,357 credits ($8.71) before you commit a scene.

In dialogue the mouth has to match the words, the voice has to belong to the face, and the line has to fit the shot. Below, the two models are compared on what ACT 3 AI publishes about them: price, resolution, shot length and audio. Quality is left to a test you can run for a few dollars.

## What does each model offer for a dialogue scene?

All prices are ACT 3 AI credits per 8-second shot, at $1 = 500 credits. Cost scales with shot length; the published prices are for 8 seconds.

| Model | Resolution | Credits per 8 s | USD | Shot lengths | Native audio on the public docs |
| --- | --- | --- | --- | --- | --- |
| Veo 3.1 Fast | 720p or 1080p | 780 | $1.56 | 4, 6 or 8 s | Yes, "with native audio" |
| Veo 3.1 | 1080p | 2,080 | $4.16 | 4, 6 or 8 s | Not stated |
| Seedance 2.5 | 480p | 535 | $1.07 | 4 to 30 s | Not stated |
| Seedance 2.5 | 720p | 1,202 | $2.404 | 4 to 30 s | Not stated |
| Seedance 2.5 | 1080p | 2,128 | $4.256 | 4 to 30 s | Not stated |

Per second at 1080p, Veo 3.1 is 2,080 ÷ 8 = 260 credits and Seedance 2.5 is 2,128 ÷ 8 = 266, a gap of 48 credits ($0.096) a shot. That will not decide a dialogue scene. Two other things will: how long one take can run, and where the voice comes from.

<ArticleCTA />

## Which one generates the voice?

ACT 3 AI's public pricing docs say Veo 3.1 Fast comes "with native audio". They do not say so for Veo 3.1 or Seedance 2.5, so do not plan a scene assuming either will speak your lines.

What is published, for any model, is the voice layer:

* **Text-to-speech:** 225 credits per 1,000 characters (113 per 500, 23 per 100).
* **Lip-sync:** 38 credits per clip of about 5 seconds.
* **Auto-trim + speech replace:** 50 credits per shot (auto-trim alone is 25).

If the voice comes from text-to-speech, switching the picture from Veo to Seedance does not change who is talking. The full voice workflow is in [adding TTS voiceover and lipsync inside one AI pipeline](/articles/adding_voiceover_ai).

## How does the 8-second cap change a dialogue scene?

Veo 3.1 and Veo 3.1 Fast allow 4, 6 or 8 seconds per shot. Seedance 2.5 allows anything from 4 to 30. A model snaps a shot to its nearest allowed length.

For quick shot-reverse coverage the cap rarely matters. It matters when one character talks for longer, or when you want both people held in one take.

Take a 20-second speech. On Veo 3.1 it has to be split across at least three shots. Priced at the published 8-second rate, that is 3 × 2,080 = 6,240 credits ($12.48) for 24 generated seconds. On Seedance 2.5 it can be one shot; a straight-line estimate at 266 credits a second is 20 × 266 = 5,320 credits ($10.64). (Estimate, because only the 8-second price is published.) The bigger difference is not the 920 credits but the two extra cuts inside one speech, each another place where face, light or voice can drift.

If the scene is written as coverage, both models fit. If a line must play unbroken past 8 seconds, only Seedance 2.5 can hold it.

## What does a 60-second two-person scene cost on each?

Inputs, stated so you can swap in your own:

* **Scene:** 60 seconds, two people, 10 shots of 6 seconds on average in the cut (60 ÷ 6 = 10), each generated as an 8-second clip. That is 10 × 8 = 80 generated seconds.
* **Lines:** 1,000 characters of dialogue, about 170 words at roughly six characters a word including spaces.
* **Lip-sync:** 60 seconds of speaking footage ÷ 5 = 12 clips.
* **Speech replace:** one auto-trim + speech replace per shot.
* **One accepted take per shot.** Retakes come on top.

The voice layer is the same on every model: 225 (TTS) + 12 × 38 (456, lip-sync) + 10 × 50 (500, speech replace) = 1,181 credits ($2.362).

| Picture model | Picture: 10 × 8 s | Voice layer | Scene total | USD |
| --- | --- | --- | --- | --- |
| Veo 3.1 1080p | 20,800 | 1,181 | 21,981 | $43.96 |
| Seedance 2.5 1080p | 21,280 | 1,181 | 22,461 | $44.92 |
| Seedance 2.5 720p | 12,020 | 1,181 | 13,201 | $26.40 |
| Veo 3.1 Fast | 7,800 | 1,181 | 8,981 | $17.96 |

At 1080p the two land 480 credits ($0.96) apart for the whole scene. If Veo 3.1 Fast's native audio passes your test, you could drop the voice layer on that row and pay 7,800 credits ($15.60), once you have heard it on your own lines.

Seedance 2.5 opens a second way to stage the same scene: four takes of 15 seconds each, 60 generated seconds in all. As a straight-line estimate that is 4 × (15 × 266) = 4 × 3,990 = 15,960 credits for picture, plus 225 + 456 + 4 × 50 = 881 for the voice layer, 16,841 credits ($33.68) in total. Whether four long takes play better than ten cut shots is a directing decision, not a pricing one.

Merging shots into one video costs 72 credits per second of generated footage, not of the trimmed cut: 80 × 72 = 5,760 credits ($11.52) for the ten-shot version, or 60 × 72 = 4,320 ($8.64) for the four-take version.

For how these per-scene numbers add up across a whole film, see [how much an AI movie costs to make](/articles/ai_movie_cost).

## How do you test lip-sync and delivery before committing?

Nobody can rank lip-sync or acting from a price list, and models change with each release. Buy a fair comparison instead, on your own line:

1. Pick one line of 100 characters or fewer that carries emotion, from a scene you actually need.
2. Generate it as one 8-second shot on Veo 3.1 1080p: 2,080 credits.
3. Generate the same shot, same first frame, on Seedance 2.5 1080p: 2,128 credits.
4. Take one of those clips and run text-to-speech on the line (23 credits for up to 100 characters), lip-sync (2 clips of about 5 seconds to cover 8, so 2 × 38 = 76) and speech replace (50): 149 credits.

Total: 2,080 + 2,128 + 149 = 4,357 credits ($8.71). Add a Veo 3.1 Fast take to hear its native audio for another 780, making 5,137 ($10.27).

Watch every take with the sound off, judging mouth shapes and performance, then with it on, judging the voice. Build the scene on the route that wins what matters more.

## What should you settle regardless of model?

Settle these before generating:

* **Screen direction.** If A looks frame-left, B looks frame-right in the reverse.
* **Light.** Two shots of the same room at different colour temperatures will not cut together.
* **Line length.** Time the line read aloud, then pick the shot length. A rushed line reads as fake on any model.
* **One language per line.** Name the language and accent in the prompt, and do not mix languages within a shot.
* **The character's look.** Lock the face and outfit on a still before paying for motion. See [how to keep a character consistent across every AI scene](/articles/keep_character_ai) and [the cost of locking references vs regenerating video](/articles/cost_locking_references).

## How does ACT 3 AI handle a dialogue scene?

ACT 3 AI keeps the voice layer and both models in one pipeline:

* **Cost before you run.** The exact credit cost is shown on the generate button, and you confirm before credits are deducted.
* **Shots from the script.** Importing a script structures it into beats, scenes and shots, and ACT 3 AI generates first frames, video prompts and character sheets with the right outfits, shot by shot.
* **Locked shots.** Completed shots can be locked so they are not regenerated by accident.
* **One pool, with rollover.** Credits sit in one pool owned by the organization. Unused credits roll into a bank of up to 2.5 months of the plan's credits; rollover credits expire on cancel or downgrade.

On the [published plans](https://app.act3ai.com/settings/plans/), Free and Creator include Google Veo 3 only. Seedance 2.5 and the other video models need Pro or higher. Pro is $175 a month for 87,500 credits: three of the 1080p ten-shot scenes above use 3 × 21,981 = 65,943 on Veo 3.1 or 3 × 22,461 = 67,383 on Seedance 2.5, leaving 21,557 or 20,117 for retakes or the bank.

Or the [Assistant Director Team](/level2) can produce the film for you inside ACT 3 AI from your script and notes.

## FAQ

**Is Veo 3.1 or Seedance 2.5 better for dialogue?**

Neither is proven better on lip-sync or delivery; test both on your own line. On price and length, Veo 3.1 1080p costs 2,080 credits per 8-second shot and caps shots at 8 seconds, while Seedance 2.5 1080p costs 2,128 and allows up to 30 seconds.

**Does Veo 3.1 have native audio?**

ACT 3 AI's public pricing docs say Veo 3.1 Fast comes with native audio. They do not state it for Veo 3.1 at full price or for Seedance 2.5, so hear it on your own line before relying on it.

**How do I add dialogue to a Veo or Seedance shot?**

With text-to-speech, lip-sync and speech replace, which work with any model. Text-to-speech is 225 credits per 1,000 characters, lip-sync is 38 per clip of about 5 seconds, and auto-trim + speech replace is 50 per shot.

**How much does a one-minute dialogue scene cost?**

Assuming 10 shots each generated at 8 seconds, 1,000 characters of lines, 12 lip-sync clips and one speech replace per shot: 21,981 credits ($43.96) on Veo 3.1 1080p or 22,461 ($44.92) on Seedance 2.5 1080p, before retakes and final render.

**Can a long line fit in one Veo 3.1 shot?**

Only if it plays in 8 seconds or less. A 20-second speech needs at least three Veo 3.1 shots; Seedance 2.5 can hold it in one shot of up to 30 seconds.

**Which plan do I need for Seedance 2.5?**

Pro or higher. Free and Creator include Google Veo 3 only. Pro is $175 a month for 87,500 credits.

## The test on your own scene

Take the line in your next scene where the performance carries the moment. Generate it once on Veo 3.1 1080p and once on Seedance 2.5 1080p from the same first frame, then run text-to-speech and lip-sync on one of the takes. That is 4,357 credits ($8.71), against 21,981 to 22,461 for the whole ten-shot scene at 1080p. If the line runs past 8 seconds, the staging has already chosen Seedance 2.5 and the test only settles the voice. Either way, you pick the model on a take you have watched, not a spec sheet.

