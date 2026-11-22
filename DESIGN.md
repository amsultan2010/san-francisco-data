---
name: San Francisco Data
description: Luminous white and warm archival paper editorial authority bookended by Golden Gate Vermilion, set in Optima and EB Garamond with a dark carbon trace inspector.
colors:
  sf-red: "#cc3200"
  sf-red-hover: "#a82900"
  sf-red-deep: "#9e2500"
  sf-red-tint: "#fff4f0"
  sf-red-border: "rgba(204, 50, 0, 0.24)"
  sf-white: "#ffffff"
  sf-paper: "#faf8f6"
  sf-white-muted: "rgba(255, 245, 240, 0.9)"
  sf-white-hairline: "rgba(255, 255, 255, 0.24)"
  sf-white-hairline-strong: "rgba(255, 255, 255, 0.45)"
  sf-ink: "#11100e"
  sf-ink-muted: "#46423e"
  sf-hairline: "rgba(17, 16, 14, 0.11)"
  sf-hairline-strong: "rgba(17, 16, 14, 0.22)"
  sf-terminal: "#141311"
  sf-terminal-bar: "#1d1b18"
  sf-terminal-ink: "#f8f5f2"
  sf-terminal-muted: "#c8c0b8"
  sf-terminal-hairline: "rgba(255, 255, 255, 0.13)"
  sf-verified-dark: "#4ade80"
  sf-signal-coral: "#ff8566"
  sf-signal-peach: "#ffa68f"
typography:
  display:
    fontFamily: "Optima, Optima Nova, Candara, sans-serif"
    fontSize: "clamp(2.8rem, 5.9vw, 5rem)"
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Optima, Optima Nova, Candara, sans-serif"
    fontSize: "clamp(2rem, 3.8vw, 3.15rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  subhead:
    fontFamily: "Optima, Optima Nova, Candara, sans-serif"
    fontSize: "clamp(1.6rem, 2.4vw, 2.15rem)"
    fontWeight: 500
    lineHeight: 1.18
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Optima, Optima Nova, Candara, sans-serif"
    fontSize: "1.45rem"
    fontWeight: 500
    lineHeight: 1.24
    letterSpacing: "0em"
  title-sm:
    fontFamily: "Optima, Optima Nova, Candara, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 500
    lineHeight: 1.28
    letterSpacing: "0em"
  title-compact:
    fontFamily: "Optima, Optima Nova, Candara, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 500
    lineHeight: 1.34
    letterSpacing: "0em"
  quote:
    fontFamily: "EB Garamond, Georgia, serif"
    fontSize: "1.42rem"
    fontWeight: 400
    lineHeight: 1.52
    letterSpacing: "0em"
    fontFeature: "'kern' 1, 'liga' 1"
  lead:
    fontFamily: "EB Garamond, Georgia, serif"
    fontSize: "clamp(1.3rem, 2.1vw, 1.62rem)"
    fontWeight: 400
    lineHeight: 1.52
    letterSpacing: "0em"
    fontFeature: "'kern' 1, 'liga' 1"
  body:
    fontFamily: "EB Garamond, Georgia, serif"
    fontSize: "19.5px"
    fontWeight: 400
    lineHeight: 1.64
    letterSpacing: "0em"
    fontFeature: "'kern' 1, 'liga' 1"
  body-md:
    fontFamily: "EB Garamond, Georgia, serif"
    fontSize: "18.5px"
    fontWeight: 400
    lineHeight: 1.52
    letterSpacing: "0em"
    fontFeature: "'kern' 1, 'liga' 1"
  body-compact:
    fontFamily: "EB Garamond, Georgia, serif"
    fontSize: "17.5px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
    fontFeature: "'kern' 1, 'liga' 1"
  ui:
    fontFamily: "Optima, Optima Nova, Candara, sans-serif"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "0em"
  label:
    fontFamily: "Optima, Optima Nova, Candara, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "0.01em"
  mono:
    fontFamily: "Azeret Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "13.5px"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "0em"
  mono-label:
    fontFamily: "Azeret Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "12.5px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.05em"
  wordmark:
    fontFamily: "Optima, Optima Nova, Candara, sans-serif"
    fontSize: "24px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.005em"
  founder-name:
    fontFamily: "Optima, Optima Nova, Candara, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "0em"
  footer-heading:
    fontFamily: "Optima, Optima Nova, Candara, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "0em"
rounded:
  none: "0px"
  focus: "2px"
  scrollbar: "4px"
  squircle-xs: "6px"
  squircle-sm: "8px"
  squircle: "12px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "48px"
  2xl: "64px"
  section: "96px"
  section-lg: "128px"
components:
  button-primary:
    backgroundColor: "{colors.sf-red}"
    textColor: "{colors.sf-white}"
    typography: "{typography.ui}"
    rounded: "{rounded.none}"
    padding: "14px 24px"
  button-primary-hover:
    backgroundColor: "{colors.sf-red-hover}"
  button-secondary:
    backgroundColor: "{colors.sf-white}"
    textColor: "{colors.sf-ink}"
    typography: "{typography.ui}"
    rounded: "{rounded.none}"
    padding: "14px 24px"
  button-nav-inverted:
    backgroundColor: "{colors.sf-white}"
    textColor: "{colors.sf-red}"
    typography: "{typography.ui}"
    rounded: "{rounded.none}"
    padding: "10px 20px"
  button-nav-inverted-hover:
    backgroundColor: "{colors.sf-red-tint}"
  nav-bar:
    backgroundColor: "{colors.sf-red}"
    textColor: "{colors.sf-white}"
    height: "74px"
    padding: "0 64px"
  stage-tab:
    backgroundColor: "{colors.sf-paper}"
    textColor: "{colors.sf-ink}"
    rounded: "{rounded.none}"
    padding: "24px"
  stage-tab-past:
    backgroundColor: "{colors.sf-red-tint}"
    textColor: "{colors.sf-ink}"
  stage-tab-active:
    backgroundColor: "{colors.sf-red}"
    textColor: "{colors.sf-white}"
  trace-inspector:
    backgroundColor: "{colors.sf-terminal}"
    textColor: "{colors.sf-terminal-ink}"
    typography: "{typography.mono}"
    rounded: "{rounded.none}"
    padding: "32px"
  status-chip-verified:
    backgroundColor: "rgba(74, 222, 128, 0.12)"
    textColor: "{colors.sf-verified-dark}"
    typography: "{typography.mono}"
    rounded: "{rounded.none}"
    padding: "4px 12px"
  status-chip-signal:
    backgroundColor: "rgba(204, 50, 0, 0.22)"
    textColor: "{colors.sf-signal-peach}"
    typography: "{typography.mono}"
    rounded: "{rounded.none}"
    padding: "4px 12px"
  monograph-panel:
    backgroundColor: "{colors.sf-white}"
    textColor: "{colors.sf-ink}"
    rounded: "{rounded.none}"
    padding: "48px"
---

# Design System: San Francisco Data

## Overview

**Creative North Star: "The Golden Gate Monograph"**

San Francisco Data pairs the luminous clarity of a San Francisco research monograph with the structural precision of a suspension-bridge engineering schematic. Editorial bands alternate between pure white (`#ffffff`) and warm archival paper (`#faf8f6`), ruled by 1px architectural hairlines and framed top and bottom by full-bleed Golden Gate Vermilion (`#cc3200`) bookends for the sticky navigation bar and civic footer.

Display headlines, navigation, controls, and metric numerals are set in humanist sans-serif `Optima` (medium weight 500), paired with `EB Garamond` for long-form editorial prose and pull quotes, and `Azeret Mono` strictly inside the dark carbon (`#141311`) trace inspector. The system rejects dark-neon AI templates, decorative gradients, uppercase eyebrow kickers, and rounded SaaS cards in favor of sharp 0px rectilinearity, generous whitespace, and purposeful, reduced-motion-safe GSAP and HTML5 Canvas motion.

**Key Characteristics:**
- Luminous pure white (`#ffffff`) primary surface alternating with warm archival paper (`#faf8f6`) secondary bands, bookended by Golden Gate Vermilion (`#cc3200`) header and footer bars.
- High-contrast typographic triad: `Optima` for display, headings, metrics, and UI chrome; `EB Garamond` for editorial prose and italic blockquotes; `Azeret Mono` confined to trace payloads, filenames, and verifier badges.
- Isolated dark carbon (`#141311`) trace inspector embedded inside the white Trace Refinery deep-dive panel for high-legibility code and telemetry inspection.
- Soft squircle geometry (`12px` panels, `8px` controls, `6px` chips, with `corner-shape: squircle`) divided by 1px hairline rules. Ambient shadows stay on the sticky vermilion navbar, the active stage tab, and the refinery panel.
- Reduced-motion-safe GSAP reveals and an interactive HTML5 Canvas Golden Gate suspension bridge visualizing traces transforming into verified RL environments.

## Colors

A luminous editorial palette—pure white and warm archival paper—bookended by Golden Gate Vermilion and anchored by a dark carbon inspector chamber with semantic emerald verification.

### Primary
- **Golden Gate Vermilion** (`sf-red`): Bookend sticky navbar and footer background, active pipeline stage tab fill, primary CTA fills, hero accent phrase, metric numerals, column/audience headings, blockquote left rule, suspension bridge towers/cables, progress rail, focus ring, and text selection.
- **Deep Vermilion** (`sf-red-hover`): Hover state for primary vermilion buttons and inline vermilion links.
- **Shadow Vermilion** (`sf-red-deep`): Tinted shadow base for the sticky vermilion navbar (`rgba(158, 37, 0, 0.14)`).
- **Vermilion Wash** (`sf-red-tint`): Completed ("past") pipeline stage tab fill and hover state for the inverted white navbar CTA button.
- **Vermilion Rule** (`sf-red-border`): Subtle vermilion border for completed pipeline stage tabs, hover states on inactive tabs, and default underline decoration on inline red links.

### Secondary
- **Verifier Emerald** (`sf-verified-dark`): Used exclusively inside the dark carbon trace inspector for passing RL verifier status chips and verified trace lines.
- **Signal Coral** (`sf-signal-coral`): High-contrast coral-red used on dark carbon (`#141311`) for the terminal icon, failure line prefixes, and the stage step counter (`1 / 4`).
- **Signal Peach** (`sf-signal-peach`): Lightened vermilion-peach used on dark carbon for failure status chips and error trace text to preserve WCAG 2.1 AA contrast.

### Neutral
- **Pure White** (`sf-white`): Primary page canvas (Hero, Trace Refinery, Three-Audience Architecture), monograph and pedigree panel fills, inverted navbar CTA background, and text/marks on vermilion bookends.
- **Warm Archival Paper** (`sf-paper`): Secondary alternating section canvas (Verified Traction Strip, Three Hard Research Problems, Essay & Pedigree band), inactive pipeline stage tab fill, progress rail track, and scrollbar track.
- **Warm White Muted** (`sf-white-muted`): Default navigation links and secondary footer copy on vermilion bookends; transitions to pure white on hover.
- **White Hairline** (`sf-white-hairline`): 1px structural divider on vermilion surfaces (navbar bottom border, mobile section strip top border).
- **White Hairline Strong** (`sf-white-hairline-strong`): Reserved high-emphasis rule on vermilion surfaces.
- **Carbon Ink** (`sf-ink`): Primary display headlines, hero lead, secondary button text, and primary body text on white and paper surfaces.
- **Warm Charcoal** (`sf-ink-muted`): Secondary editorial prose, metric notes, metadata, and subdued labels on white and paper surfaces.
- **Paper Hairline** (`sf-hairline`): Default 1px architectural divider across section thresholds, metric columns, research problem columns, audience rows, and monograph dividers.
- **Paper Hairline Strong** (`sf-hairline-strong`): Secondary button strokes, refinery deep-dive outer border, desktop chevron badge border, link underlines, and scrollbar thumb.
- **Dark Carbon** (`sf-terminal`): Primary background of the Trace Refinery illustrative artifact inspector.
- **Carbon Bar** (`sf-terminal-bar`): Top header bar inside the Dark Carbon trace inspector.
- **Terminal Ivory** (`sf-terminal-ink`): Primary monospace trace text inside the Dark Carbon inspector.
- **Terminal Warm Gray** (`sf-terminal-muted`): Muted trace lines, terminal filename, and stage outcome note inside the Dark Carbon inspector.
- **Terminal Hairline** (`sf-terminal-hairline`): 1px structural divider inside the Dark Carbon inspector.

### Named Rules
**The Vermilion Bookend Rule.** Golden Gate Vermilion (`#cc3200`) frames the document at the top (sticky navbar) and bottom (civic footer) and highlights active pipeline states, primary CTAs, and key numerals—leaving main reading sections on luminous white or warm archival paper.

**The Semantic Verification Rule.** Verifier Emerald (`#4ade80`) appears solely for passing RL verifier states and verified consent/rollout lines inside the dark carbon inspector—never for marketing decoration.

**The Dark-Chamber Contrast Rule.** On Dark Carbon (`#141311`), never place raw `#cc3200` small text; step up to Signal Coral (`#ff8566`) for icons/prefixes and Signal Peach (`#ffa68f`) for failure copy and status badges.

## Typography

**Display & UI Font:** Optima (fallback: Optima Nova, Candara, sans-serif; bundled locally in 400, 500, 700, 400 italic)
**Body Font:** EB Garamond (fallback: Georgia, serif; variable 400–800 normal & italic)
**Mono Font:** Azeret Mono (fallback: ui-monospace, SFMono-Regular, monospace; 400, 500)

**Character:** Classical civic monument meets research journal. `Optima` brings flared, stone-carved clarity to headlines, navigation, buttons, and tabular metrics without heavy bolding, while `EB Garamond` gives body prose and italic blockquotes warm literary authority, and `Azeret Mono` isolates real trace telemetry inside the dark carbon inspector.

### Hierarchy
- **Display** (`Optima` 500, `clamp(2.8rem, 5.9vw, 5rem)`, 1.04 line-height, -0.025em tracking): Hero thesis H1 only.
- **Headline** (`Optima` 500, `clamp(2rem, 3.8vw, 3.15rem)` refinery / `clamp(2rem, 3.5vw, 3rem)` sections / `clamp(2.2rem, 3.6vw, 3.15rem)` metric values, 1.05–1.1 line-height, -0.02em tracking): Major section H2s and large tabular traction numerals.
- **Subhead** (`Optima` 500, `clamp(1.85rem, 3vw, 2.55rem)` essay / `clamp(1.65rem, 2.4vw, 2.15rem)` pedigree / `clamp(1.6rem, 2.4vw, 2.05rem)` refinery stage title, 1.12–1.18 line-height, -0.015em to -0.02em tracking): Panel headings and active stage titles.
- **Title** (`Optima` 500, `1.35rem–1.45rem`, 1.24–1.25 line-height): Research problem titles, audience labels, and hiring subheadings.
- **Title Compact** (`Optima` 500, `1.25rem` / `18px–18.5px`, 1.2–1.34 line-height): Audience row headings, pipeline stage tab titles (`18px`), and desktop navbar wordmark (`18.5px`).
- **Quote** (`EB Garamond` italic 400, `1.42rem`, 1.52 line-height, max `48ch`): Pull quote in the October 1 essay monograph.
- **Lead** (`EB Garamond` 400, `clamp(1.3rem, 2.1vw, 1.62rem)` primary / `clamp(1.15rem, 1.5vw, 1.32rem)` secondary, 1.52–1.58 line-height, max `54ch–56ch`): Hero thesis paragraphs.
- **Body** (`EB Garamond` 400, `19px–20px`, 1.58–1.64 line-height, max `56ch`): Section introductions, research problem descriptions, audience narratives, essay summary, and refinery stage details.
- **Body Compact** (`EB Garamond` 400–500, `17px–18.5px`, 1.35–1.58 line-height): Metric notes, essay date, footer colophon, pipeline tab tags, input/output rows, and inspector outcome notes.
- **UI** (`Optima` 500, `15.5px–16.5px`, 1.35 line-height): Desktop navigation links (`16px`), primary/secondary buttons (`16px`), navbar/footer CTAs (`15.5px`), metric labels (`16px`), and institution names (`16.5px`).
- **Label** (`Optima` 500–700, `14px–14.5px`, 1.35 line-height): Mobile nav strip (`14.5px`), pedigree sub-label (`14.5px`), refinery `Goes in`/`Comes out` labels (`14px`), and bold `01`–`04` step indices (`14px`, 700, `0.08em` tracking).
- **Mono** (`Azeret Mono` 400, `12.5px–14.5px`, 1.7 line-height, tabular-nums): Trace payload lines (`13.5px` mobile / `14.5px` desktop), filenames (`13.5px`), stage counters (`13px`), status chips (`12.5px`), and 3-letter line prefixes (`12.5px` uppercase).

### Named Rules
**The Humanist-Literary Split Rule.** Use `Optima` (weight 500) for structural typography—headings, navigation, buttons, metrics, and UI labels—and `EB Garamond` (weight 400) for all narrative prose and quotes. Never swap their roles.

**The Telemetry-Only Mono Rule.** `Azeret Mono` is restricted to the dark carbon trace inspector (filenames, trace payloads, prefixes, status chips, and step counters)—never for page headings or marketing copy.

## Layout

All sections align to a single architectural container (`max-w-[1680px]`, centered with `mx-auto`) and responsive horizontal gutters (`px-4 sm:px-6 lg:px-8` on the page; the navbar uses the same gutters, plus `env(safe-area-inset-*)` on the header sides and footer bottom).

- **Hero Frame:** Asymmetric split. Left: “Backed by” a16z speedrun and Khosla Ventures, then the Optima thesis and an EB Garamond lead (`max-w-[56ch]`). The accent phrase “proprietary AI data” stays inside the vermilion family (`#9e2500` to `#e04a16`) with a slow shimmer; it never fades toward paper white. Right: “Built by people from” counter-scrolling pedigree columns that pause on hover, keyboard focus, or the Pause control, and stop entirely under `prefers-reduced-motion`.
- **Vertical Section Rhythm:** Generous `96px` mobile / `128px` desktop vertical padding (`py-24 lg:py-32`) on Refinery, Research, Partners, and Essay/Pedigree bands, alternating `#ffffff` and `#faf8f6` surfaces separated by 1px horizontal hairlines.
- **Architectural Grids:**
  - Traction Strip: 2 columns mobile → 4 columns `lg` (`1024px+`) with 1px vertical dividers.
  - Pipeline Stage Selector: 1 column → 2 columns `sm` (`640px+`) → 4 columns `lg` with `16px` gap and overlaid desktop flow chevrons.
  - Refinery Deep-Dive: 12-column grid (`5/7` split on `lg`) separating plain-English transformation from the dark carbon inspector.
  - Three Hard Problems: 1 column → 3 columns `lg` with 1px vertical dividers (`lg:divide-x`).
  - Audience Paths: Full-width horizontal rows divided by 1px hairlines, using a `3/6/3` 12-column split on `lg`.
  - Essay & Pedigree: `7/5` 12-column split on `lg` (`lg:items-stretch`) with equal-height white panels resting on `#faf8f6`.
- **Responsive Breakpoints:** `sm` (`640px`), `md` (`768px`, desktop nav threshold), `lg` (`1024px`, multi-column architectural grid threshold).

## Elevation & Depth

Surfaces are primarily flat and separated by 1px architectural hairlines (`rgba(17, 16, 14, 0.11)` / `0.22`) and `#ffffff` / `#faf8f6` tonal alternation. Three restrained ambient shadows provide targeted spatial separation without hard offsets or card-grid clutter:

### Shadow Vocabulary
- **Sticky Vermilion Navbar** (`box-shadow: 0 4px 20px rgba(158, 37, 0, 0.14)`): Grounds the sticky `#cc3200` header as luminous white and paper sections scroll beneath it.
- **Active Stage Tab** (`box-shadow: 0 12px 30px rgba(204, 50, 0, 0.2)`): Lifts the selected `#cc3200` pipeline stage tab above inactive paper tabs.
- **Refinery Deep-Dive Panel** (`box-shadow: 0 20px 50px rgba(17, 16, 14, 0.06)`): Soft ambient elevation for the interactive stage panel + dark carbon inspector container.

### Named Rules
**The Hairline-First Depth Rule.** Establish hierarchy with 1px hairline rules and `#ffffff` / `#faf8f6` surface alternation first; reserve soft ambient shadows strictly for sticky navigation, the active pipeline stage, and the primary interactive refinery container.

## Shapes

Panels, stage tabs, the refinery container, founder portraits, and buttons use a small squircle: `12px` for panels (`.sf-squircle`), `8px` for buttons and portraits (`.sf-squircle-sm`), `6px` for chips and icon buttons (`.sf-squircle-xs`), with `corner-shape: squircle` where the browser supports it. Functional extras:
- **Focus Indicator (`2px`):** Keyboard `:focus-visible` outline (`2px solid #cc3200`, `3px` offset, `2px` radius; switches to `#ffffff` inside `.sf-red-focus` vermilion bands).
- **Scrollbar Thumb (`4px`):** Custom 8px scrollbar thumb.
- **Pipeline Flow Chevron (`9999px`):** Circular directional arrow badge centered between desktop pipeline stage zones.

## Components

Components feel like precision-printed civic instruments—sharp 0px corners, 1px hairline rules, `Optima` 500 control labels, and immediate `150ms–200ms` color/border transitions.

### Buttons
- **Shape:** Sharp rectangular (`0px` radius).
- **Primary (`button-primary`):** Golden Gate Vermilion fill (`#cc3200`), pure white text (`#ffffff`), `14px 24px` padding (`px-6 py-3.5`), `16px` Optima 500, paired with a 16px Lucide directional arrow (`strokeWidth={2}`). Hover darkens to `#a82900`.
- **Secondary (`button-secondary`):** Pure white fill (`#ffffff`), `1px solid rgba(17, 16, 14, 0.22)` border, Carbon Ink text (`#11100e`), `14px 24px` padding, `16px` Optima 500. Hover shifts border and text to `#cc3200`.
- **Inverted Navbar CTA (`button-nav-inverted`):** Pure white fill (`#ffffff`), `#cc3200` text, `8px 12px` mobile / `10px 20px` desktop (`px-3 py-2 sm:px-5 sm:py-2.5`), `14px` / `15.5px` Optima 500. Hover warms to `#fff4f0`.
- **Inline Editorial Link:** Underlined (`text-underline-offset: 0.22em`, `1px` thickness) in `#cc3200` (decoration `rgba(204, 50, 0, 0.24)`) or `#11100e` (hover `#cc3200`) with trailing `ArrowUpRight`.

### Chips
- **Style:** Sharp rectangular (`0px` radius), `12.5px` Azeret Mono, `4px 12px` padding (`px-3 py-1`), `1px` semantic border with low-opacity fill and leading `14px` `CheckCircle2` icon.
- **State:** `signal` uses `#ffa68f` on `rgba(204, 50, 0, 0.22)` with `rgba(255, 133, 102, 0.5)` border; `verified` uses `#4ade80` on `rgba(74, 222, 128, 0.12)` with `rgba(74, 222, 128, 0.42)` border; `neutral` uses `#f8f5f2` on `rgba(255, 255, 255, 0.06)` with `rgba(255, 255, 255, 0.13)` border.

### Cards / Containers
- **Corner Style:** Sharp rectangular (`0px` radius).
- **Background:** Pure white (`#ffffff`) for the Essay Monograph, Team Pedigree aside, and Refinery left column; Dark Carbon (`#141311`) with `#1d1b18` header bar for the trace inspector.
- **Shadow Strategy:** Hairline-only (`1px solid rgba(17, 16, 14, 0.11)`) for monograph/pedigree panels; `0 20px 50px rgba(17, 16, 14, 0.06)` ambient shadow on the interactive refinery container.
- **Internal Padding:** `32px–48px` (`p-8 sm:p-11 lg:p-12`) for monograph/pedigree panels; `24px–36px` (`p-6 sm:p-8 lg:p-9`) for the trace inspector body.

### Navigation
- **Sticky Vermilion Bookend Header:** Full-bleed `#cc3200` with a soft vermilion shadow. Inner row is `64px` mobile / `82px` from `sm`. Left: inline SVG `BridgeMark` + `Optima` 500 wordmark. From `1280px`, five section links sit in the bar; the current section is white with a `2px` white underline (`aria-current`). Below that, the same links are a horizontally scrolling strip, each target at least `44px` tall. The “Partner with us” label shortens to “Partner” only under `360px`. A `2px` reading-progress track (white at 25%, fill at 90%) runs along the bottom of the header and is separate from the current-section underline. Anchor jumps clear the real header height.
- **Vermilion Bookend Footer:** Full-bleed `#cc3200`, `48px` vertical padding (`py-12`), pairing `BridgeMark`, `StreetcarIcon`, Financial District address, and copyright in `EB Garamond` (`17.5px`) with 4 external links in `Optima` (`15.5px`).

### Trace Refinery Engine & Suspension Canvas
- **Interactive 4-Stage Pipeline (`TraceRefineryEngine`):** Four `role="tab"` stage buttons (`01`–`04`) in a 4-column desktop grid connected by `24px` circular flow chevrons. States step cleanly from `#faf8f6` (upcoming) → `#fff4f0` with vermilion border (past) → `#cc3200` with white text and ambient vermilion shadow (active). Below sits a `3px` vermilion progress rail and a `5/7` deep-dive panel pairing plain-English `Goes in` / `Comes out` transformation rows with the `#141311` dark carbon trace inspector. Stage changes animate `.refinery-animate-item` (`y: 10 → 0`, `0.42s`, `0.04s` stagger, `expo.out`) when motion is enabled.
- **Suspension Canvas (`SuspensionCanvas`):** Custom 2D HTML5 Canvas (`240px` height) on white displaying a 12×4 architectural coordinate grid, twin cross-braced `#cc3200` Golden Gate towers, vertical suspender cables, primary and ghost catenary curves, and 14 travelling trace pulses shifting from `#cc3200` to `#11100e` past the second tower, with `Optima` stage legend annotations below the deck. Responds subtly to vertical pointer elevation and freezes cleanly under `prefers-reduced-motion: reduce`.

## Do's and Don'ts

### Do:
- **Do** alternate main reading bands between `#ffffff` and `#faf8f6` separated by 1px hairlines (`rgba(17, 16, 14, 0.11)`), framed by `#cc3200` vermilion bookends for header and footer.
- **Do** pair `Optima` (500) for headings, navigation, buttons, metrics, and UI labels with `EB Garamond` (400) for prose and quotes, keeping `Azeret Mono` confined to the dark carbon trace inspector.
- **Do** align all sections to the `1680px` architectural container with `px-4 sm:px-6 lg:px-8` horizontal gutters.
- **Do** apply `.sf-red-focus` on vermilion surfaces so keyboard `:focus-visible` outlines switch to `#ffffff` for accessible contrast.
- **Do** gate all GSAP entrance reveals, scroll parallax, and stage animations inside `gsap.matchMedia()` for `(prefers-reduced-motion: no-preference)`.

### Don't:
- **Don't** round past the squircle scale (`12px` / `8px` / `6px`); keep focus rings at `2px`, scrollbar thumbs at `4px`, and circular controls at `9999px`.
- **Don't** place raw `#cc3200` small text on the `#141311` dark carbon inspector; use `#ff8566` or `#ffa68f` for AA contrast.
- **Don't** add uppercase eyebrow/kicker labels above section headings or decorative gradients behind editorial bands.
- **Don't** use Verifier Emerald (`#4ade80`) outside genuine passing RL verifier or consent-verified telemetry states.
- **Don't** replace `Optima` or `EB Garamond` with system sans-serif stacks or mix `Azeret Mono` into marketing headlines.
