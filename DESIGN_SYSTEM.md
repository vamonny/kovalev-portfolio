# DESIGN SYSTEM — KIRILL KOVALEV PORTFOLIO

## 1. Core Thesis: EVERYTHING IS CONNECTED
This portfolio is conceived as a living, tension-linked visual system. Rather than isolated pages and static boxes, typography, grid rules, color atmospheres, cursor physics, and subtle acoustic feedback operate as a single continuous organism.

## 2. Artistic Direction & Color Atmospheres
Color moods shift deliberately across major sections and case studies while preserving a strict 60-30-10 tonal hierarchy within each viewport:

- **Atmosphere I — Archival Paper (Primary Light Canvas)**:
  - Canvas (60%): `#F4F1EA` (warm museum paper)
  - Structural Surfaces & Rules (30%): `#E7E2D8`, `#141414/12` hairlines, `#141414` ink
  - Focal Accent (10%): `#E63B1F` (Cinnabar Vermilion)
- **Atmosphere II — Obsidian Studio (High-Contrast Dark Canvas)**:
  - Canvas (60%): `#0B0B0D` (deep charcoal obsidian)
  - Structural Surfaces & Rules (30%): `#151519`, `#F4F1EA/14` hairlines, `#F4F1EA` bone ink
  - Focal Accent (10%): `#D9FF3F` (Acid Chartreuse) or `#E63B1F`
- **Atmosphere III — Klein Cobalt (Experimental Identity Canvas)**:
  - Canvas (60%): `#1434CB` (deep architectural cobalt)
  - Structural Surfaces & Rules (30%): `#0F279C`, `#F4F1EA/18` hairlines, `#F4F1EA` bone ink
  - Focal Accent (10%): `#D9FF3F`
- **Atmosphere IV — Stone Limestone (About & Process Canvas)**:
  - Canvas (60%): `#E8E4DC`
  - Structural Surfaces & Rules (30%): `#DBD5CA`, `#141414` ink
  - Focal Accent (10%): `#E63B1F`

## 3. Typography (2+1 System, Full Cyrillic + Latin)
- **Display Face**: `Unbounded` (400, 600, 700, 900) — monumental architectural proportions with sculpted counters and strong Cyrillic presence. Fluid `clamp()` scales from `2.25rem` to `8.5rem`.
- **Body & Interface Face**: `Manrope` (400, 500, 600, 700) — high-legibility humanist-geometric sans (`15px–17px`, line-height `1.55–1.7`, measure `60–72ch`).
- **Tabular & Index Face**: `IBM Plex Mono` (400, 500) — strictly for archive slot numbers, coordinates, years, and tabular indices (`font-variant-numeric: tabular-nums`).

## 4. Motion & Interaction Choreography
1. **Elastic Tension & Spring Physics**: Interactive graphic vectors, SVG tension strings connecting the composition, and typographic glyphs stretch proportionally to pointer velocity/proximity and settle via damped spring physics (`cubic-bezier(0.16, 1, 0.3, 1)`).
2. **Fluid Page Transitions**: Route changes trigger a smooth directional curtain wipe with synchronized content reveal (`opacity` + `transform` only, compositor-safe).
3. **Morphing Composition**: The hero tension node and geometric markers morph smoothly between states on hover, scroll, and language switching.
4. **Kinetic Typography**: Display headlines respond to scroll velocity and pointer position with subtle axial shifts and staggered glyph reveals.
5. **Custom Magnetic Cursor (Desktop Pointer Devices Only)**: Adaptive reticle that expands, morphs into contextual directional cues on interactive frames, and magnetically attracts primary CTAs. Automatically disabled on coarse touch devices (`pointer: coarse`) and when `prefers-reduced-motion: reduce` is active.
6. **Scroll-Driven Atmosphere Shifts**: GSAP ScrollTrigger interpolates background/foreground color moods and multi-layer parallax plates smoothly as the visitor moves down the canvas.

## 5. Acoustic Interface System (Web Audio API)
Zero background music. Pure synthesized procedural micro-acoustics generated cleanly via Web Audio API (`AudioContext`):
- Soft tactile hover tick (filtered short sine/triangle impulse).
- Crisp mechanical shutter click on navigation/selection.
- Elastic resonant pluck when plucking tension strings or interactive vector nodes.
- Subtle page-transition air sweep (bandpass-filtered noise envelope).
- Strictly **muted by default** until explicitly toggled ON by user interaction.

## 6. Archive Slot Architecture (Honest Editable Case System)
No fabricated clients, fake awards, or invented metrics. All project data lives in `/src/data/projects.ts` (with optional browser-persisted custom slots via the built-in Studio Slot Editor). Empty/upcoming slots are presented transparently as editable creative archive specimens ready for Kirill Kovalev's real case uploads, each supporting a distinct layout archetype (`monograph`, `brutalist-grid`, `chromatic-essay`, `kinetic-specimen`).
