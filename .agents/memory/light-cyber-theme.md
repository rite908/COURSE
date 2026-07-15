---
name: Light Cyber Theme
description: TWH Academy design system — LIGHT theme, not dark. White/F5F8FF backgrounds, electric blue #2563EB accents.
---

## Rule
The app uses a **LIGHT CYBER theme** — white/light blue backgrounds (`#FFFFFF`, `#F5F8FF`, `#EEF3FF`), dark navy text (`#0A0F1E`), electric blue (`#2563EB`) and cyan (`#0EA5E9`) accents. All pages must use this palette. The old dark Orbitron/neon dark theme was replaced.

**Why:** User provided a reference image showing a light-themed design (sections 1–9) and explicitly requested light theme override.

## Color palette
- Background: `#FFFFFF` / `#F5F8FF` / `#EEF3FF`
- Text primary: `#0A0F1E`
- Text secondary: `#4A5568` / `#94A3B8`
- Accent blue: `#2563EB`
- Accent cyan: `#0EA5E9`
- Accent purple: `#7C3AED`
- Accent green: `#059669`
- Accent red: `#DC2626`
- Cards: white bg, `1px solid #E2E8F0` border, soft shadow

## Per-chapter accent colors (in lib/chapters.ts)
- Ch1: `#2563EB` (blue)
- Ch2: `#0EA5E9` (sky/cyan)
- Ch3: `#7C3AED` (violet/purple)
- Ch4: `#059669` (emerald/green)
- Ch5: `#DC2626` (red)

## How to apply
- Never use `bg-bg-primary` dark variants, `text-white/40`, `cyber-grid-bg`, `glass` with dark borders, or `bg-gradient-to-b from-*-950` gradients
- Use `card` CSS class for cards, `glass` for blur panels (now light variant in globals.css)
- Dot grid: `dot-grid` class — dark dots on white, opacity 50–60%
- `prose-magazine` class for reading content, `prose-twh` as fallback
