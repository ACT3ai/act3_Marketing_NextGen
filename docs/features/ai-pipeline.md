---
id: ai-pipeline
sidebar_position: 2
title: AI Pipeline
description: How ACT3 AI connects your story to the world's best AI video models.
---

# AI Pipeline

The ACT3 AI pipeline connects your production intent to the world's leading AI video generation models.

## Supported Models

### Google Veo 3
Google's most advanced video generation model. Veo 3 produces high-quality, photorealistic video
with excellent motion consistency and cinematic lighting. Best for dramatic, narrative content.

### Runway Gen-3 Alpha
Fast, reliable video generation with strong adherence to prompts. Excellent for stylized content,
product videos, and quick iteration cycles.

### ComfyUI + FLUX
Local rendering pipeline via ComfyUI with FLUX image and video models. Ideal when you need full
creative control, custom LoRAs, or want to keep content on-premises.

### Hunyuan Video
Tencent's open-source video model with strong performance on diverse content types.

### Wan 2.1
High-quality open-source model with excellent temporal consistency for long clips.

## How the Pipeline Works

```
Shot Definition
    ↓
Prompt Optimization (ACT3 AI Cinematography Layer)
    ↓
Model Selection
    ↓
Generation Request
    ↓
Quality Review
    ↓
Timeline Assembly
```

### Prompt Optimization

ACT3 AI doesn't just pass your shot description directly to the model. It runs your shot through
the **Cinematography Layer** — a translation system that:
- Converts your technical parameters into model-specific prompt syntax
- Applies per-model style modifiers for cinematic quality
- Injects character consistency tokens when actors are defined
- Adds temporal consistency hints for multi-shot sequences

### Multi-Take Generation

For important shots, generate multiple takes simultaneously and compare them side-by-side.
ACT3 AI's take manager keeps all generations organized and linked to their source shot.
