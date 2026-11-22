---
name: San Francisco Data
description: Archival warm alabaster editorial authority paired with an obsidian interactive trace refinery and Golden Gate International Orange accent.
colors:
  sf-red: "#c0362c"
  sf-red-hover: "#a22a21"
  sf-red-tint: "rgba(192, 54, 44, 0.08)"
  verified: "#2f855a"
  verified-dark: "#4ade80"
  signal-dark: "#f28b82"
  paper: "#faf9f6"
  paper-subtle: "#f3f1ec"
  ink: "#111110"
  ink-muted: "#565550"
  hairline: "rgba(17, 17, 16, 0.11)"
  hairline-strong: "rgba(17, 17, 16, 0.2)"
  obsidian: "#09090b"
  obsidian-surface: "#111114"
  obsidian-elevated: "#17171b"
  obsidian-ink: "#f5f4f0"
  obsidian-muted: "#a19f97"
  obsidian-hairline: "rgba(245, 244, 240, 0.12)"
typography:
  display:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(2.55rem, 5.4vw, 4.7rem)"
    fontWeight: 400
    lineHeight: 1.03
    letterSpacing: "-0.03em"
    fontFeature: "'kern' 1, 'liga' 1"
  headline:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(1.75rem, 3.4vw, 3.35rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.025em"
    fontFeature: "'kern' 1, 'liga' 1"
  title:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.02em"
    fontFeature: "'kern' 1, 'liga' 1"
  body:
    fontFamily: "Schibsted Grotesk, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.96875rem"
    fontWeight: 400
    lineHeight: 1.68
    letterSpacing: "0em"
  label:
    fontFamily: "Schibsted Grotesk, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "-0.01em"
  mono:
    fontFamily: "Azeret Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "0em"
rounded:
  none: "0px"
  focus: "2px"
  brand: "3px"
  scrollbar: "4px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  2xl: "64px"
  section: "96px"
components:
  button-primary:
    backgroundColor: "{colors.sf-red}"
    textColor: "#ffffff"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "12px 20px"
  button-primary-hover:
    backgroundColor: "{colors.sf-red-hover}"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "10px 16px"
  button-ink-hover:
    backgroundColor: "{colors.sf-red}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "12px 20px"
  stage-row-dark:
    backgroundColor: "{colors.obsidian}"
    textColor: "{colors.obsidian-muted}"
    rounded: "{rounded.none}"
    padding: "20px 16px"
  stage-row-dark-active:
    backgroundColor: "{colors.obsidian-surface}"
    textColor: "{colors.obsidian-ink}"
  specimen-terminal:
    backgroundColor: "{colors.obsidian-surface}"
    textColor: "{colors.obsidian-ink}"
    typography: "{typography.mono}"
    rounded: "{rounded.none}"
    padding: "24px"
  status-chip-verified:
    backgroundColor: "rgba(74, 222, 128, 0.08)"
    textColor: "{colors.verified-dark}"
    typography: "{typography.mono}"
    rounded: "{rounded.none}"
    padding: "2px 10px"
  nav-bar:
    backgroundColor: "rgba(250, 249, 246, 0.94)"
    textColor: "{colors.ink}"
    height: "64px"
    padding: "0 40px"
---

# Design System: San Francisco Data

## Overview

**Creative North Star: "The Civic Refinery"**

San Francisco Data pairs the quiet authority of a San Francisco research monograph with the precision of an industrial trace-refining instrument. Editorial surfaces rest on warm archival alabaster paper (`#faf9f6`) ruled by 1px architectural hairlines and set in unhurried serif display typography. When the narrative turns to mechanism—filtering raw coding-agent failures, reconstructing deterministic sandboxes, and grading user intent—the light-to-dark expression drops through a scroll-scrubbed curtain into a deep obsidian chamber (`#09090b`) where live trace telemetry and Golden Gate suspension geometry take center stage.

The system refuses generic dark-neon AI templates, decorative gradients, and equal-height icon-card grids. Restraint is structural: crisp 0px corners, single-hue International Orange red (`#c0362c`) reserved strictly for primary actions, active telemetry, and the Golden Gate Bridge mark, and verified emerald reserved strictly for passing RL verifier states.

**Key Characteristics:**
- Archival warm alabaster (`#faf9f6`) paired with deep obsidian (`#09090b`) for the technical refinery chamber.
- Sharp 0px architectural geometry separated by 1px hairline rules rather than drop shadows.
- High-contrast pairing of Source Serif 4 for editorial display, Schibsted Grotesk for UI and prose, and Azeret Mono strictly for real trace telemetry and verifier code.
- Surgical San Francisco Data red (`#c0362c`) inspired by the Golden Gate Bridge, deployed sparingly so every red signal carries weight.
- Purposeful, reduced-motion-safe GSAP and HTML5 Canvas choreography anchored to the suspension-bridge span.

## Colors

A disciplined two-surface architectural palette—warm alabaster paper and deep obsidian—punctuated by one brand accent (Golden Gate red) and semantic verification green.

### Primary
- **Golden Gate Red** (`sf-red`): Used for primary CTA fills, inline editorial action links, active stage indicator dots, active suspension cable segments, blockquote left rules, focus outlines, text selection, and the brand mark background.
- **Golden Gate Red Hover** (`sf-red-hover`): Darker pressed/hover state for primary red buttons and underlined red links.
- **Red Signal Wash** (`sf-red-tint`): Subtle translucent tint for active red telemetry zones and signal highlights.

### Secondary
- **Verifier Emerald (Light)** (`verified`): Used exclusively for passing verifier output and verified trace pulses on warm alabaster surfaces.
- **Verifier Emerald (Dark)** (`verified-dark`): High-contrast emerald used for passing verifier lines, verified status chips, and verified canvas pulses on obsidian surfaces.
- **Signal Coral (Dark)** (`signal-dark`): Lightened red-coral text used for failure/signal trace lines on obsidian surfaces where `sf-red` would fall below WCAG AA contrast.

### Neutral
- **Archival Paper** (`paper`): Default page canvas, sticky header fill (at 94% opacity), and text on carbon-ink buttons.
- **Recessed Paper** (`paper-subtle`): Subtle tonal step for the sculptural canvas container and expandable trace drawer on light surfaces.
- **Carbon Ink** (`ink`): Primary editorial text, display headlines, and secondary solid button fills.
- **Warm Charcoal** (`ink-muted`): Secondary body prose, navigation links, metadata, and captions on light surfaces.
- **Paper Hairline** (`hairline`): Default 1px structural divider across rows, ledgers, and section thresholds.
- **Paper Hairline Strong** (`hairline-strong`): Secondary button strokes, default link underlines, and scrollbar thumb.
- **Obsidian Chamber** (`obsidian`): Primary dark background for the interactive Trace Refinery and Three Hard Problems ledger.
- **Obsidian Surface** (`obsidian-surface`): One-step lifted surface for active stage rows, the specimen terminal body, and the dark suspension canvas frame.
- **Obsidian Elevated** (`obsidian-elevated`): Top header bar inside the specimen terminal.
- **Obsidian Ink** (`obsidian-ink`): Primary warm off-white text on dark surfaces.
- **Obsidian Muted** (`obsidian-muted`): Secondary prose, inactive stage labels, and muted telemetry lines on dark surfaces.
- **Obsidian Hairline** (`obsidian-hairline`): Default 1px structural divider on obsidian surfaces.

### Named Rules
**The One-Signal Red Rule.** Golden Gate Red (`#c0362c`) is reserved for primary actions, active pipeline states, focus rings, and the bridge mark; never flood full sections or decorative backgrounds with red.

**The Semantic Verification Rule.** Emerald (`#2f855a` on paper, `#4ade80` on obsidian) appears only to denote a verified environment or passing RL verifier grade—never for marketing decoration.

## Typography

**Display Font:** Source Serif 4 (fallback: Georgia, serif)
**Body Font:** Schibsted Grotesk (fallback: -apple-system, BlinkMacSystemFont, sans-serif)
**Label/Mono Font:** Azeret Mono (fallback: ui-monospace, SFMono-Regular, monospace)

**Character:** Editorial authority meets technical instrument. Source Serif 4 carries thesis statements, section headings, pull quotes, and headline figures at regular weight (400) with tight negative tracking, while Schibsted Grotesk handles prose and navigation cleanly and Azeret Mono stays confined to real trace logs, step indices, status chips, and canvas axes.

### Hierarchy
- **Display** (400, `clamp(2.55rem, 5.4vw, 4.7rem)` wide / `clamp(2.45rem, 4.9vw, 4.15rem)` editorial, 1.03–1.06 line-height, -0.03em tracking): Page hero thesis statement only.
- **Headline** (400, `clamp(1.6rem, 3.4vw, 3.35rem)`, 1.08–1.18 line-height, -0.025em tracking): Major section titles across both alabaster and obsidian surfaces.
- **Title** (400 serif `1.5rem` / 500 sans `15.5px–17px`, 1.2 line-height, -0.02em tracking): Audience row headings, aside headings, verified metric values (`1.35rem–1.5rem` tabular-nums), and ledger item titles.
- **Body** (400, `14.5px–15.5px` prose and `clamp(1.06rem, 1.5vw, 1.25rem)` hero lead, 1.6–1.75 line-height): Narrative paragraphs constrained to `52ch–65ch` max measure for effortless scanning.
- **Label** (500, `13px–14.5px`, 1.4 line-height, -0.01em tracking): Navigation links, button labels, and inline CTAs.
- **Mono** (400–500, `11.5px–13px`, 1.65 line-height, tabular-nums): Trace specimen code, `01`–`04` stage indices, status chips, and suspension-bridge axis labels.

### Named Rules
**The Real-Telemetry Mono Rule.** Azeret Mono is reserved for genuine technical artifacts—trace payloads, verifier code, step indices, and canvas telemetry—never for marketing slogans or decorative eyebrow labels.

**The Regular-Weight Serif Rule.** Source Serif 4 stays at weight 400 for display and section headings; hierarchy comes from scale, tight tracking (`-0.02em` to `-0.03em`), and generous surrounding space rather than heavy bolding.

## Layout

Two complementary architectural containers share one vertical rhythm:
- **Wide Architectural Grid (Path C):** `1200px` max container (`px-5 sm:px-10` / `px-6 sm:px-10`), using a 12-column CSS Grid (`lg:grid-cols-12`) for asymmetric splits: 7/5 for the refinery header and essay/pedigree split, 5/7 for the interactive stage list and specimen terminal, and 4/5/3 for three-audience editorial rows.
- **Single-Column Editorial Frame (Path D):** `760px` max reading column for hero prose, thesis narrative, metrics, careers, essays, and footer, expanding to `1040px` only for the top header and the sculptural suspension canvas.
- **Vertical Rhythm:** Generous section padding (`96px` mobile, `112px–128px` desktop) separated by 1px horizontal hairlines or the scroll-scrubbed alabaster-to-obsidian curtain (`64px–96px` height). Lists use full-width hairline-divided rows (`py-5` to `py-10`) instead of multi-column card grids.
- **Responsive Behavior:** Multi-column grids collapse cleanly to single-column stacks below `1024px` (`lg`). Metric grids use 2 columns on mobile and 2 or 4 columns on desktop. The Path C navigation links collapse below `768px` (`md`), keeping the brand mark and primary partner button visible without wrapping.

## Elevation & Depth

Surfaces are flat by default. Depth is communicated through 1px architectural hairline borders and disciplined tonal stepping (`#faf9f6` → `#f3f1ec` on paper; `#09090b` → `#111114` → `#17171b` on obsidian), never through drop shadows on content cards, buttons, or terminals. Sticky navigation relies on translucent frosted paper (`rgba(250, 249, 246, 0.94)` with `12px` backdrop blur) and a 1px bottom hairline.

### Shadow Vocabulary
- **Floating Utility Overlay** (`box-shadow: 0 8px 28px rgba(17, 17, 16, 0.14)`): Used solely on the fixed-position preview switcher utility (`PreviewSwitcher`) so it remains legible over both alabaster and obsidian scroll regions.

### Named Rules
**The Flat-By-Default Rule.** Content surfaces, terminals, and buttons carry zero drop shadow at rest or on hover; hierarchy is established with 1px hairlines and tonal contrast.

## Shapes

Sharp architectural rectilinearity defines the form language. Every primary container—buttons, stage rows, specimen terminals, status chips, sculpture frames, and the preview switcher—uses crisp right angles (`0px` radius). Small exceptions exist strictly for functional clarity:
- **Brand Mark:** Slightly softened `3px` corners on the 28px square Golden Gate Bridge icon.
- **Focus Indicator:** `2px` radius on the `2px solid #c0362c` keyboard focus ring (`3px` offset).
- **Status Indicator Dot:** Full circle (`9999px`) on the 6px active-stage dot.
- **Scrollbar Thumb:** `4px` radius on the 8px custom scrollbar.

## Components

Every component feels like a precision printed or machined instrument—sharp corners, 1px rules, crisp typographic contrast, and immediate color transitions (`150ms–200ms`) with no bouncy scale effects.

### Buttons
- **Shape:** Crisp rectangular (`0px` radius).
- **Primary (`button-primary`):** Golden Gate Red fill (`#c0362c`), pure white text (`#ffffff`), `12px 20px` padding, `14px` Schibsted Grotesk 500, paired with a 16px directional Lucide arrow (`strokeWidth={1.75}`). Hover transitions to `#a22a21`.
- **Ink (`button-ink`):** Carbon Ink fill (`#111110`), Archival Paper text (`#faf9f6`), `8px 16px` (header) or `10px 16px` (aside CTA). Hover transitions to Golden Gate Red (`#c0362c`).
- **Secondary (`button-secondary`):** Transparent background, `1px solid rgba(17, 17, 16, 0.2)` border, Carbon Ink text (`#111110`), `12px 20px` padding. Hover sharpens border to `#111110`.
- **Editorial Link:** Underlined inline action (`text-underline-offset: 0.22em`, `1px` thickness) in `#c0362c` (hover `#a22a21`) or `#111110` / `#565550` with trailing `ArrowUpRight`.

### Chips
- **Style:** Sharp rectangular (`0px` radius), `11.5px` Azeret Mono, `2px 10px` padding, `1px` semantic border with low-opacity tinted fill and leading 12px Lucide status icon.
- **State:** `signal` variant uses coral-red text on `rgba(192, 54, 44, 0.12)` with `rgba(192, 54, 44, 0.45)` border; `verified` variant uses `#4ade80` on `rgba(74, 222, 128, 0.08)` with `rgba(74, 222, 128, 0.35)` border; `neutral` uses muted obsidian ink on `rgba(245, 244, 240, 0.04)`.

### Cards / Containers
- **Corner Style:** Sharp rectangular (`0px` radius).
- **Background:** Obsidian Surface (`#111114`) with Obsidian Elevated (`#17171b`) header bar for the Specimen Terminal; translucent Recessed Paper (`#f3f1ec` at 50% opacity) for Path D's sculptural stage container.
- **Shadow Strategy:** None (Flat-By-Default Rule).
- **Border:** `1px solid` hairline (`--sf-obsidian-hairline` on dark, `--sf-hairline` on light).
- **Internal Padding:** `20px–24px` (`p-5 sm:p-6`) for terminal code body; `14px 20px` for terminal header bar.

### Navigation
- **Path C Sticky Header:** `64px` height, translucent alabaster (`rgba(250, 249, 246, 0.94)`) with `12px` backdrop blur and 1px bottom hairline. Left: 28px red-square Golden Gate Bridge mark (`3px` radius) + `15px` medium wordmark. Center (`md+`): 4 muted `14px` links (`gap-8`) transitioning to Carbon Ink on hover. Right: Carbon Ink CTA button.
- **Path D Static Editorial Header:** `1040px` max width, unsticky, zero bottom border, pairing the same bridge mark + wordmark with three quiet inline links (`Essay`, `Careers`, underlined `Partner`).

### Trace Refinery Engine & Suspension Canvas
- **Interactive Stage Selector:** Vertical stack of 4 full-width hairline-divided buttons (`01`–`04`) in the obsidian chamber (or 4-column horizontal scrubber strip in Path D). Active stage switches background to `#111114` (dark) or `#faf9f6` (light), illuminates the 6px Golden Gate Red dot, expands technical detail copy, and animates terminal trace lines (`y: 8 → 0`, `0.42s`, `0.05s` stagger, `expo.out`). On desktop (`≥1024px`) with motion enabled, GSAP ScrollTrigger advances stages on scroll until the visitor manually selects one.
- **Suspension Canvas:** Custom 2D HTML5 Canvas rendering a 12×5 architectural coordinate grid, twin cross-braced Golden Gate suspension towers, vertical suspender cables, primary and parallax catenary curves, an active-stage red highlight band, and 14 travelling trace pulses that shift from `#c0362c` to verified emerald (`#2f855a` / `#4ade80`) past the second tower. Responds subtly to vertical pointer elevation and freezes cleanly under `prefers-reduced-motion: reduce`.

## Do's and Don'ts

### Do:
- **Do** separate content bands, editorial rows, and technical ledgers with 1px hairline rules (`rgba(17, 17, 16, 0.11)` on alabaster, `rgba(245, 244, 240, 0.12)` on obsidian) instead of floating shadowed cards.
- **Do** reserve Source Serif 4 (weight 400, tight negative tracking) for thesis headlines, section headings, pull quotes, and key metric values, and Schibsted Grotesk for body prose and UI controls.
- **Do** restrict Azeret Mono to real technical artifacts (trace logs, verifier code, `01`–`04` stage indices, status chips, and canvas axis annotations).
- **Do** gate all GSAP entrance reveals, scroll-scrubbed curtains, and stage ScrollTriggers inside `gsap.matchMedia()` for `(prefers-reduced-motion: no-preference)`.
- **Do** use `signal-dark` (`#f28b82`) or `verified-dark` (`#4ade80`) for small semantic text on obsidian surfaces to maintain WCAG 2.1 AA contrast.

### Don't:
- **Don't** round primary buttons, terminals, or stage containers beyond `0px`; keep rounded corners limited to the `3px` brand mark, `2px` focus ring, and `9999px` status dot.
- **Don't** add drop shadows to marketing cards, buttons, or terminals; reserve elevation shadow strictly for fixed utility overlays.
- **Don't** place uppercase eyebrow/kicker labels above section headings or build equal-height icon-card grids.
- **Don't** use Golden Gate Red (`#c0362c`) as a full-section background or pair it with unverified decorative gradients.
- **Don't** use emerald green for non-verification states or decorative badges.
