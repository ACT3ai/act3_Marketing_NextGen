---
title: "Cost of Locking References vs Regenerating Video"
description: "A rejected still first frame costs 25 to 98 credits, while a rejected 8-second video costs 314 to 2,080, so settle each decision on the still."
keywords: ["cost of locking references vs regenerating video", "AI filmmaking", "AI video generation"]
image: "https://act3ai.com/img/Act3_Preview.jpg"
wrapperClassName: article-page
last_update:
  date: 2026-09-18
# Provenance -- authored upstream, published by scripts/sync-articles.js.
article_slug: "cost_locking_references"
article_target_query: "cost of locking references vs regenerating video"
article_persona: "Studio Production"
article_funnel_stage: "Learn"
article_search_intent: "Informational"
article_content_type: "Guide"
article_key_value: "Automation"
---

{/* GENERATED FILE -- do not edit here.
    Source: <seo corpus>/cost_locking_references/cost_locking_references.md
    Regenerate with: node scripts/sync-articles.js */}
# Cost of Locking References vs Regenerating Video

**Short answer:** a rejected still first frame costs 25 to 98 credits, while a rejected 8-second video costs 314 to 2,080, so settle each decision on the still. Lock your references before paying for motion: if that halves motion attempts, 100 shots at Seedance 2.0 1080p drop from 583,800 credits ($1,167.60) to 299,400 ($598.80), a 49% saving.

Locking a reference means settling a decision once, on something cheap, and reusing it: the character sheet with the right outfit, the location, and the approved first frame for the shot. Regenerating means buying another motion take because one of those decisions was still open when the video ran. Below, both are priced in ACT 3 AI credits.

## What does one rejection cost at each stage?

All rates are ACT 3 AI credits at $1 = 500 credits. A still costs 25 credits ($0.05) on Nano Banana 2 or 98 ($0.196) on Nano Banana Pro, per 1K image. Video rates are per 8-second shot (Seedance at 16:9), and cost scales with duration.

| Rejected 8 s video | Credits | USD | × a Nano Banana 2 still | × a Nano Banana Pro still |
| --- | --- | --- | --- | --- |
| Seedance 2.0 Fast 720p | 314 | $0.628 | 12.6× | 3.2× |
| Seedance 2.0 1080p | 1,946 | $3.892 | 77.8× | 19.9× |
| Veo 3.1 1080p | 2,080 | $4.16 | 83.2× | 21.2× |

The gap is not a flat hundredfold. It runs from 3.2× when a premium image model sits in front of a fast video tier, to 83.2× when a standard image model sits in front of 1080p. 4K stills cost double (50 and 196 credits); even a 4K Nano Banana Pro still is about a tenth of a 1080p video.

<ArticleCTA />

## Which rejections can a still prevent?

Log why takes get thrown away and they sort into two piles.

**A still can catch it:** wrong framing or composition, wrong wardrobe, hair or props, wrong light, wrong location or set dressing, wrong face.

**Only motion can show it:** action that does not fit the time, a camera move that does not read, broken physics or morphing props, a flat performance, audio that sits wrong.

Everything in the first pile can be settled on a 25-credit image, yet a blind retry pays up to 2,080 credits to discover it. The second pile genuinely needs motion, and regenerating is the right call there.

One rule keeps the saving: once a first frame is approved, leave it alone. If the video is wrong, fix the motion prompt. Regenerating the frame reopens every decision it had settled.

## How do you compare locking with regenerating?

```
blind        = shots × motion attempts × video credits
frame-first  = shots × (still attempts × image credits + motion attempts × video credits)
saving       = blind − frame-first
dollars      = credits ÷ 500
```

## How much does locking save on 100 shots?

Inputs, stated so you can swap in your own:

* **Shots:** 100, a 10-minute piece cut at an average of 6 seconds a shot (600 ÷ 6), each generated as an 8-second clip.
* **Blind:** 3 motion attempts per shot.
* **Frame-first:** 3 still attempts per shot, then 1.5 motion attempts per shot.

These attempt counts are illustrative assumptions, not measured averages.

Worked once in full, for Seedance 2.0 1080p with Nano Banana 2 stills: blind is 100 × 3 × 1,946 = 583,800 credits. Frame-first is 100 × (3 × 25 + 1.5 × 1,946) = 100 × (75 + 2,919) = 299,400 credits.

| Video model | Still model | Blind | Frame-first | Saving |
| --- | --- | --- | --- | --- |
| Seedance 2.0 Fast 720p | Nano Banana 2 | 94,200 ($188.40) | 54,600 ($109.20) | 39,600 ($79.20), 42% |
| Seedance 2.0 Fast 720p | Nano Banana Pro | 94,200 ($188.40) | 76,500 ($153.00) | 17,700 ($35.40), 19% |
| Seedance 2.0 1080p | Nano Banana 2 | 583,800 ($1,167.60) | 299,400 ($598.80) | 284,400 ($568.80), 49% |
| Seedance 2.0 1080p | Nano Banana Pro | 583,800 ($1,167.60) | 321,300 ($642.60) | 262,500 ($525.00), 45% |
| Veo 3.1 1080p | Nano Banana 2 | 624,000 ($1,248.00) | 319,500 ($639.00) | 304,500 ($609.00), 49% |
| Veo 3.1 1080p | Nano Banana Pro | 624,000 ($1,248.00) | 341,400 ($682.80) | 282,600 ($565.20), 45% |

At 1080p the stills are almost free: 7,500 credits of Nano Banana 2 is 2.5% of the 299,400 frame-first total, so nearly all of the saving is the halved motion attempts. At Seedance 2.0 Fast 720p with Nano Banana Pro, the stills are 29,400 of 76,500 credits, 38%, and the saving falls to 19%.

## How many rejections must a still prevent to pay for itself?

Frame-first pays for itself when the motion attempts it saves per shot exceed still credits per shot ÷ video credits.

| Video model | 3 Nano Banana 2 stills (75) | 3 Nano Banana Pro stills (294) |
| --- | --- | --- |
| Seedance 2.0 Fast 720p | 0.24 | 0.94 |
| Seedance 2.0 1080p | 0.039 | 0.15 |
| Veo 3.1 1080p | 0.036 | 0.14 |

At either 1080p model, three Nano Banana 2 stills per shot pay for themselves if they prevent one rejected video in every 25 shots. Nano Banana Pro in front of Seedance 2.0 Fast 720p must prevent almost one rejection per shot, which is why the cheaper image model suits the cheaper video tier.

## What does an accidental regeneration cost?

The other expensive regeneration is one nobody meant to run. Twenty approved shots of a scene regenerated at Seedance 2.0 1080p cost 20 × 1,946 = 38,920 credits ($77.84), or 20 × 2,080 = 41,600 credits ($83.20) at Veo 3.1 1080p, for footage you had already accepted. Locking completed shots prevents it.

References work the same way: a character sheet with the right outfit is made once and serves every shot that character appears in, while a regeneration is consumed once. See [how to keep a character consistent across every AI scene](/articles/keep_character_ai) and [generating character sheets with the right outfits](/articles/sheets_right_outfits).

## How does ACT 3 AI build the cheap loop in?

Frame-first only saves money if it happens on shot 90 as reliably as on shot 1. ACT 3 AI makes it the default:

* **First frames and prompts per shot.** ACT 3 AI generates first frames, first-frame prompts, video prompts and character sheets with the right outfits, shot by shot, so every shot has a still to approve before motion. See [auto-generating first frames for every AI shot](/articles/first_ai_automatically).
* **Cost before you run.** The exact credit cost is shown on the generate button, and you confirm before credits are deducted.
* **Locked shots.** Completed shots can be locked so they are not regenerated by accident.
* **One pool, with rollover.** Credits sit in one pool owned by the organization, and projects draw from it. Unused credits roll into a bank of up to 2.5 months of the plan's credits, drawn on after the month's credits run out; rollover credits expire on cancel or downgrade.

The 100-shot example against the [published plans](https://app.act3ai.com/settings/plans/):

* **Pro, $175 a month, 87,500 credits.** At Seedance 2.0 Fast 720p with Nano Banana 2, frame-first uses 54,600, leaving 32,900 to roll into the bank. Blind needs 94,200, 6,700 more than the month holds.
* **Premiere Edition, $795 a month, 397,500 credits.** At Seedance 2.0 1080p with Nano Banana 2, frame-first uses 299,400, leaving 98,100. Blind needs 583,800, 186,300 more, which means banked credits or Blockbuster Edition ($1,950, 975,000 credits).
* **Per month on a series.** One extra motion attempt per shot, × 100 shots × 4 episodes a month at Seedance 2.0 1080p, is 1 × 100 × 4 × 1,946 = 778,400 extra credits ($1,556.80) every month.

Free and Creator include Google Veo 3 only; the other video models start at Pro, which allows commercial use for audiences up to 100,000. For the whole-film version of this budget, see [how much an AI movie costs to make](/articles/ai_movie_cost). Or the [Assistant Director Team](/level2) can produce the film for you inside ACT 3 AI from your script and notes.

## FAQ

**Is it cheaper to lock references or to regenerate video?**

Locking. A rejected still costs 25 to 98 credits; a rejected 8-second video costs 314 to 2,080. If approving stills first halves motion attempts from 3 to 1.5, 100 shots at Seedance 2.0 1080p drop from 583,800 credits ($1,167.60) to 299,400 ($598.80), a 49% saving.

**How much does a rejected AI video attempt cost?**

The full shot price. For 8 seconds: 314 credits ($0.628) at Seedance 2.0 Fast 720p, 1,946 ($3.892) at Seedance 2.0 1080p and 2,080 ($4.16) at Veo 3.1 1080p.

**How many rejections does a first frame need to prevent to pay for itself?**

Divide the still credits per shot by the video credits. Three Nano Banana 2 stills (75 credits) break even at 0.039 saved attempts per shot on Seedance 2.0 1080p, roughly one prevented rejection in every 25 shots.

**Should I regenerate the first frame if the video is wrong?**

No. Fix the motion prompt. The approved frame settled composition, wardrobe, light and identity; regenerating it reopens all of them.

**What should I lock before generating video?**

The character sheet with the right outfit, the location, and the shot's first frame. Once a shot is finished, lock it so it is not regenerated by accident.

**Does a more expensive image model still save money?**

Usually, but less. In the same 100-shot example at Seedance 2.0 Fast 720p, Nano Banana Pro stills saved 19% against 42% with Nano Banana 2.

**When is regenerating the video the right call?**

When the problem is timing, camera movement, physics, performance or audio. A still cannot settle those.

## The test on your own shots

Log every motion take you reject over your next ten shots, with the reason. Count the rejections a still could have caught: framing, wardrobe, light, location or face. Multiply that count by the credit cost on your generate button, and compare it with ten shots × three stills at your image model's rate. If six of the ten shots lost one take each at Seedance 2.0 1080p, that is 6 × 1,946 = 11,676 credits ($23.35) against 10 × 75 = 750 credits ($1.50) of Nano Banana 2 stills. That difference is what unlocked references cost you, scene after scene.

