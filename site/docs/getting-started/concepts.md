---
id: concepts
sidebar_position: 2
title: Core Concepts
description: Understand the key concepts behind ACT 3 AI's production pipeline.
---

# Core Concepts

Understanding how ACT 3 AI structures your production makes everything else click.

## The Filmmaking Hierarchy

ACT 3 AI mirrors the structure of professional film production:

```
Project
└── Act 1, Act 2, Act 3
    └── Scenes
        └── Beats
            └── Shots
```

### Acts

An **Act** is a major division of your story. Most films follow a three-act structure:
- **Act 1** — Setup and introduction
- **Act 2** — Confrontation and rising action
- **Act 3** — Resolution and climax

### Scenes

A **Scene** is a continuous action happening in one location at one time. When the location
or time changes, a new scene begins. Each scene has:
- A location (interior or exterior)
- A time of day
- Characters present
- The action that unfolds

### Beats

A **Beat** is an emotional or dramatic moment within a scene. It's the unit of storytelling —
the thing that shifts the scene's direction or reveals character. A scene might have 2-5 beats.

### Shots

A **Shot** is a single, uninterrupted camera setup. Shots are what you actually generate with AI.
Each shot is defined by:
- **Camera type** (handheld, steadicam, dolly, crane, drone)
- **Lens** (wide, standard, telephoto)
- **Angle** (eye-level, high, low, Dutch)
- **Movement** (static, pan, tilt, push, pull, orbit)
- **Subject** (what's in frame)
- **Lighting** (key direction, mood, color temperature)

## AI Models

ACT 3 AI supports multiple AI video generation models. Each has different strengths:

| Model | Best For | Speed |
|---|---|---|
| Google Veo 3 | Photorealistic, cinematic | Moderate |
| Runway Gen-3 | Stylized, fast iteration | Fast |
| FLUX (ComfyUI) | Local rendering, custom styles | Variable |
| Hunyuan | Asian content, specific styles | Moderate |
| Wan 2.1 | Open-source, customizable | Variable |

## The Cinematography Layer

What sets ACT 3 AI apart is its **cinematography layer** — the system that translates your
story intent into specific technical instructions for AI models.

Rather than writing raw prompts, you describe your production intent. ACT 3 AI translates that
into optimized prompts for each model, ensuring consistent cinematic quality across all your shots.
