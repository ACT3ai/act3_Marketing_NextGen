---
id: beats-scenes-shots
sidebar_position: 1
title: Beats, Scenes & Shots
description: The production structure at the heart of ACT 3 AI.
---

# Beats, Scenes & Shots

ACT 3 AI structures every production around the fundamental units of filmmaking: beats, scenes, and shots.

## Scenes

A scene is defined by a continuous action in a single location. In your script, scenes are marked
with sluglines like `INT. COFFEE SHOP - DAY`.

ACT 3 AI parses these automatically, or you can define scenes manually.

### Scene Properties
- **Location** — Interior or exterior, with a description
- **Time** — Day, night, dawn, dusk
- **Characters** — Who is present
- **Description** — What happens in this scene

## Beats

Within each scene, ACT 3 AI identifies **beats** — the emotional turning points. A beat is where:
- A character makes a decision
- New information is revealed
- The emotional tone shifts
- Conflict escalates or resolves

The AI Showrunner tracks beat progression across your entire film, ensuring emotional arcs
remain consistent.

## Shots

Each beat is visualized through one or more **shots** — specific camera setups.

### Shot Parameters

| Parameter | Options |
|---|---|
| Shot type | Extreme wide, wide, medium, close-up, extreme close-up, cutaway |
| Camera | Handheld, steadicam, dolly, crane, drone, locked-off |
| Lens | 18mm, 24mm, 35mm, 50mm, 85mm, 100mm, 135mm, 200mm |
| Angle | Eye-level, high, low, bird's eye, worm's eye, Dutch |
| Movement | Static, pan L/R, tilt up/down, push in, pull out, orbit, tracking |
| Duration | Shot length in seconds |

### Lighting Parameters

| Parameter | Options |
|---|---|
| Mood | Natural, dramatic, high-key, low-key, golden hour, blue hour |
| Key direction | Front, side, backlight, overhead, practical |
| Color temperature | Warm (tungsten), neutral, cool (daylight) |
| Contrast | Flat, medium, high |

## Shot Generation

Once your shots are defined, select any shot and click **Generate**. ACT 3 AI:
1. Translates your cinematography parameters into a model-optimized prompt
2. Sends the request to your chosen AI model
3. Returns generated video in your project
4. Tracks the shot in your production timeline
