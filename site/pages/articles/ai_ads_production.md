---
title: "AI Ads Production Cost Per Variant in 2026"
description: "In 2026 a 30-second AI ad variant costs roughly $12 to $83 to generate and finish on ACT 3 AI credits, averaged across a batch of ten."
keywords: ["ai ads production cost per variant 2026", "AI filmmaking", "AI video generation"]
image: "https://act3ai.com/img/Act3_Preview.jpg"
wrapperClassName: article-page
last_update:
  date: 2026-09-18
# Provenance -- authored upstream, published by scripts/sync-articles.js.
article_slug: "ai_ads_production"
article_target_query: "ai ads production cost per variant 2026"
article_persona: "Agency Commercials"
article_funnel_stage: "Buy"
article_search_intent: "Commercial"
article_content_type: "Guide"
article_key_value: "Automation"
---

{/* GENERATED FILE -- do not edit here.
    Source: <seo corpus>/ai_ads_production/ai_ads_production.md
    Regenerate with: node scripts/sync-articles.js */}
# AI Ads Production Cost Per Variant in 2026

**Short answer:** in 2026 a 30-second AI ad variant costs roughly $12 to $83 to generate and finish on ACT 3 AI credits, averaged across a batch of ten. The low end is ten variants sharing a locked product, location and presenter on Seedance 2.0 Fast 720p. The high end is every variant rebuilt from scratch on Veo 3.1 1080p.

What matters is what the tenth variant costs next to the first. Produced independently, ten variants cost ten times one. Produced from one approved base with ten scripts, every variant after the first costs a fraction, because its shared shots and approvals are already paid for. For AI against a live-action shoot, see [AI commercial cost vs a traditional shoot](/articles/ai_commercial_breakdown).

## How do you calculate the cost per ad variant?

The general per-shot budget formula is explained in [how much an AI movie costs to make](/articles/ai_movie_cost). Ad variants need two changes: count only the shots a variant generates new, and add the finishing lines every variant pays in full.

```
variant credits = new shots × attempts × (credits per shot + credits per first frame)
                + voice + lipsync
                + generated seconds × 72        (final render)
dollars         = credits ÷ 500
batch average   = (hero + (N − 1) × locked variant) ÷ N
```

The hero is the first variant, built from scratch, where product shots, location, presenter and voice get approved. A locked variant reuses them and changes only the script.

<ArticleCTA />

## The inputs

| Input | Hero (from scratch) | Locked variant |
| --- | --- | --- |
| Spot, cut shot length, shots | 30 s ÷ 5 s = 6 shots | Same |
| New shots generated | 6 | 4 (close-up and end shot reused) |
| Generated length per shot | 8 s | 8 s |
| Attempts per new shot and first frame | 3 | 1.5 |
| First frame | Nano Banana 2, 25 credits | Same |
| Voice | 500 characters, 113 credits a take, 2 takes | 1 take |
| Lipsync | 2 clips at 38 credits, 2 attempts | 1 attempt |
| Final render | 6 × 8 = 48 generated s × 72 | Same |

Attempts are the assumption to replace with your own. Two models from the ACT 3 AI credit table bracket the range: Seedance 2.0 Fast 720p at 314 credits per 8-second shot ($0.628) and Veo 3.1 1080p at 2,080 ($4.16). Seedance figures are for 16:9.

## How much does one 30-second variant cost?

| Line | Seedance, hero | Seedance, locked | Veo 3.1, hero | Veo 3.1, locked |
| --- | --- | --- | --- | --- |
| Motion shots | 6 × 3 × 314 = 5,652 | 4 × 1.5 × 314 = 1,884 | 6 × 3 × 2,080 = 37,440 | 4 × 1.5 × 2,080 = 12,480 |
| First frames | 6 × 3 × 25 = 450 | 4 × 1.5 × 25 = 150 | 450 | 150 |
| Voice | 2 × 113 = 226 | 113 | 226 | 113 |
| Lipsync | 2 × 2 × 38 = 152 | 76 | 152 | 76 |
| Final render | 48 × 72 = 3,456 | 3,456 | 3,456 | 3,456 |
| **Credits** | **9,936** | **5,679** | **41,724** | **16,275** |
| **Dollars** | **$19.87** | **$11.36** | **$83.45** | **$32.55** |

Locking the base cuts a Seedance variant by 43 percent and a Veo variant by 61 percent, because the saving lands on the motion line, and on Veo 3.1 that line is the expensive one.

On a low-cost model the render becomes the biggest line: 3,456 of a locked Seedance variant's 5,679 credits, about 61 percent, because it is quoted at 72 credits per generated second against Seedance 2.0 Fast 720p's 39.25 (314 ÷ 8). The render is quoted on generated seconds, not the 30-second cut, so shorter generated clips trim both lines. Each job's exact credit cost is shown on its generate button before you confirm.

## How does batch size change the cost per variant?

| Variants | Seedance total credits | Seedance average | Veo 3.1 total credits | Veo 3.1 average |
| --- | --- | --- | --- | --- |
| 1 | 9,936 | $19.87 | 41,724 | $83.45 |
| 3 | 21,294 | $14.20 | 74,274 | $49.52 |
| 5 | 32,652 | $13.06 | 106,824 | $42.73 |
| 10 | 61,047 | $12.21 | 188,199 | $37.64 |
| 25 | 146,232 | $11.70 | 432,324 | $34.59 |

Rebuilt from scratch, ten variants cost 99,360 credits ($198.72) on Seedance and 417,240 ($834.48) on Veo. Locked, the same ten cost $122.09 and $376.40. The average flattens fast: from 10 to 25 variants it falls only 51 cents on Seedance, and it never drops below the locked variant's $11.36.

Ten 30-second product spots with ten scripts is the common case. For structuring the test they feed, see [how to A/B test dozens of ad variants](/articles/test_dozens_ai).

## What has to be locked for variants to get cheaper?

The locked column is only real if later variants inherit what the hero approved:

| Element | Locked means |
| --- | --- |
| Product | The same approved first frames, so the label and colour never drift |
| Location | One set with the same light |
| Presenter | One character sheet and outfit, so face approvals never restart |
| Voice | The same TTS voice |
| Model and resolution | One per batch |
| Delivery spec | Same length, aspect ratio and end shot |
| Script | The only thing that varies |

A variant that changes a location or presenter is a hero again: fresh first frames, three-attempt shots. For language versions, see [localizing one ad into ten languages](/articles/localize_ten_ai).

## What do scrapped variants cost?

A variant scrapped after its final render has paid every line, render included, so the honest figure is credits for every variant rendered ÷ variants shipped. Drop a variant at the preview stage instead and you save its render line.

Render 12 variants from a locked base (the hero plus 11) and ship 10, and the Seedance batch becomes 9,936 + 11 × 5,679 = 72,405 credits ($144.81), or $14.48 per shipped variant. The Veo batch becomes 41,724 + 11 × 16,275 = 220,749 credits ($441.50), or $44.15 per shipped variant. Budget for your real kill rate, not zero.

## Which ACT 3 AI plan does an ad batch need?

**Licence first.** Ads are commercial use. Creator is for personal use only, so it does not cover brand or client ads whatever its credits. Pro allows commercial use for audiences up to 100,000; Enterprise is unlimited commercial use. A campaign aimed past 100,000 people is outside Pro's licence, so check the audience first and confirm terms on the [plans page](https://app.act3ai.com/settings/plans/).

**Models.** Free and Creator get Google Veo 3 only. Pro and up add all AI video models, including Seedance 2.0, plus 4K upscale and priority rendering.

**Credits.** $1 buys 500 credits, held in one pool owned by your organization that every project draws from. The 12-rendered, 10-shipped batch against three plans:

| Batch | Credits | Pro: 87,500, $175 | Advanced Edition: 197,500, $395 | Premiere Edition: 397,500, $795 |
| --- | --- | --- | --- | --- |
| Seedance 2.0 Fast 720p | 72,405 | Fits, 15,095 left | Fits | Fits |
| Veo 3.1 1080p | 220,749 | Short by 133,249 | Short by 23,249 | Fits, 176,751 left |

One Seedance batch a month fits inside Pro; a Veo 3.1 1080p batch fits neither Pro nor Advanced Edition on one month's credits. Unused credits roll into a bank worth 2.5 months of credits (218,750 on Pro), drawn on once the month's credits run out. Rollover credits expire on cancel or downgrade.

The locked-base workflow is built in: first frames, first-frame prompts, video prompts and character sheets with the right outfits are generated shot by shot, and completed shots can be locked against accidental regeneration. To hand over scripts and notes instead, the [Assistant Director Team](/level2) can produce the spots for you inside ACT 3 AI.

## FAQ

**How much does an AI ad variant cost in 2026?**

Roughly $12 to $83 per 30-second variant to generate and finish on ACT 3 AI credits, averaged across a batch of ten: about $12 with a locked product, location and presenter on Seedance 2.0 Fast 720p, about $83 rebuilt from scratch on Veo 3.1 1080p.

**Why does the tenth ad variant cost less than the first?**

The first pays to approve the product shots, location, presenter and voice. Later variants reuse shared shots and approved first frames, so they need fewer new shots and attempts: 5,679 credits against 9,936 on Seedance 2.0 Fast 720p.

**How many variants before batching pays off?**

Most of the fall comes early. On Seedance 2.0 Fast 720p the average drops from $19.87 for one variant to $14.20 for three and $12.21 for ten, then only to $11.70 for twenty-five.

**Should I switch to a cheaper model or lock the base?**

Lock the base first. It cuts a Veo 3.1 1080p variant from $83.45 to $32.55 without changing how the ad looks; a model switch does change it.

**How do I budget for ad variants that never ship?**

Divide the credits for every variant rendered by the number shipped. Rendering 12 Seedance 2.0 Fast 720p variants from a locked base to ship 10 raises the average from $12.21 to $14.48.

**Can I make client ads on the ACT 3 AI Creator plan?**

No. Creator is for personal use. Pro allows commercial use for audiences up to 100,000, and Enterprise is unlimited commercial use.

## The test to run on your next campaign

These figures rest on assumptions: 3 and 1.5 attempts, two of six shots reused, two of twelve rendered variants scrapped. Build the hero spot for your next brief and note the credits each line draws. Then build three variants that change only the script, divide their total by three, and compare it with the hero. If the locked figure is not well below the hero's, something is being regenerated that should be locked. Put the four presenters and product shots side by side too. If a face or label drifts, the base was never locked, and variant ten will cost what variant one did.

