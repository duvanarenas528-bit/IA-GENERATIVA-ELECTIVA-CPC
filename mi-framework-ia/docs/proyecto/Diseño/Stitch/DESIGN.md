---
name: Precision Diagnostic Minimal
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#42474f'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#727780'
  outline-variant: '#c2c7d1'
  surface-tint: '#2d6197'
  primary: '#00355f'
  on-primary: '#ffffff'
  primary-container: '#0f4c81'
  on-primary-container: '#8ebdf9'
  inverse-primary: '#a0c9ff'
  secondary: '#006398'
  on-secondary: '#ffffff'
  secondary-container: '#5bb8fe'
  on-secondary-container: '#00476e'
  tertiary: '#003c27'
  on-tertiary: '#ffffff'
  tertiary-container: '#005539'
  on-tertiary-container: '#3dd197'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2e4ff'
  primary-fixed-dim: '#a0c9ff'
  on-primary-fixed: '#001c37'
  on-primary-fixed-variant: '#07497d'
  secondary-fixed: '#cce5ff'
  secondary-fixed-dim: '#93ccff'
  on-secondary-fixed: '#001d31'
  on-secondary-fixed-variant: '#004b73'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: '0'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: '0'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  gutter-lg: 2rem
  margin: 2rem
  margin-sm: 1rem
  margin-lg: 4rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system establishes a high-precision, technical aesthetic tailored for vehicle pre-inspection, condition scoring, and automated mechanical diagnostics. It bridges industrial engineering rigor with modern diagnostic software.

### Aesthetic Foundation
- **Style:** Precision Minimalist with Technical Accents. Uncluttered surfaces, generous micro and macro whitespace, razor-sharp alignment, and focused contrast.
- **Atmosphere:** Analytical, authoritative, transparent, and calm. Eliminates diagnostic anxiety through organized data layouts, structural symmetry, and instant visual legibility.
- **Visual Mechanics:** Thin structural borders, crisp telemetry badges, high-contrast metric callouts, and restrained use of ambient elevation to prioritize scanability of complex inspection reports.

## Colors

The palette is engineered around industrial reliability, diagnostic feedback states, and strict content readability.

### Core Roles
- **Primary (`#0F4C81`):** Deep Cobalt Blue. Communicates structural integrity, engineering authority, and vehicle certification status. Used for global navigation anchors, primary action buttons, key metrics, and brand framing.
- **Secondary (`#0284C7`):** Tech Cyan / Electric Blue. Represents AI computing, computer vision layers, scan progress, telemetry highlights, and real-time inference indicators.
- **Tertiary / Semantic Pass (`#10B981`):** Emerald Green. Indicates passed tests, factory-spec tolerances, and healthy components.
- **Semantic Warning (`#F59E0B`):** Amber. Denotes minor wear, scheduled maintenance requirements, and attention flags.
- **Semantic Alert (`#EF4444`):** Crimson. Reserved strictly for structural defects, mechanical failures, diagnostic error codes (DTCs), and immediate hazard warnings.
- **Neutral Core (`#0F172A`):** Deep Slate Ink. The foundational color for high-contrast alphanumeric readouts, table headers, and body typography.

### Canvas & Surface Hierarchy
- **Base Canvas:** `#F8FAFC` (Cool Slate Canvas). Provides a neutral foundation that minimizes eye fatigue during extended inspection reviews.
- **Card & Modal Surface:** `#FFFFFF` (Pure Diagnostic White). Elevates critical diagnostic modules above the baseline canvas.
- **Structural Outlines:** `#E2E8F0` (Cool Zinc). Defines mechanical containment without creating visual noise.

## Typography

The typographic hierarchy pairs the structured, geometric precision of **Space Grotesk** with the balanced legibility of **Hanken Grotesk**.

- **Display & Headlines:** Space Grotesk provides a technical, engineered character for vehicle scores, diagnostic category headers, and high-impact summaries.
- **Body & Data Displays:** Hanken Grotesk ensures neutrality, effortless reading, and high legibility across dense spec sheets, inspection logs, and technical descriptions.
- **Data Readouts & Telemetry:** Space Grotesk should be applied with tabular figures (`font-variant-numeric: tabular-nums`) when displaying VIN codes, odometer mileage, diagnostic trouble codes (DTCs), and paint depth micrometer measurements.
- **Labels & Microcopy:** `label-sm` is rendered in uppercase with wide tracking for component status headers, diagnostic categories, and AI certainty scores.

## Layout & Spacing

The layout is built on a responsive 12-column grid utilizing dynamic fluid margins anchored to a maximum container width of 1440px.

### Breakpoints & Geometry
- **Desktop (1200px+):** 12 columns, 32px (`gutter-lg`) gutters, 64px (`margin-lg`) outer canvas margins. Multi-column diagnostic grids (e.g., Engine, Transmission, Chassis, Bodywork) sit side by side with the vehicle summary panel.
- **Tablet (768px – 1199px):** 8 columns, 24px (`gutter`) gutters, 32px (`margin`) outer canvas margins. Technical telemetry groups collapse into a dual-column layout.
- **Mobile (320px – 767px):** 4 columns, 16px (`gutter-sm`) gutters, 16px (`margin-sm`) margins. Data flows into a vertical telemetry stack, with critical condition scores pinned to sticky headers.

### Spacing Principles
- Density is calibrated to balance technical data density with scanning clarity.
- Component internal padding strictly utilizes `space-md` (16px) for compact telemetry rows and `space-lg` (24px) for elevated analytical cards.
- Layout sections maintain generous separation via `space-xl` (40px) to prevent cognitive overload during report analysis.

## Elevation & Depth

Depth is established through subtle tonal layering and soft ambient blur shadows rather than sharp, dark drop shadows. Surfaces must feel suspended and clean, mirroring modern clinical software.

### Elevation Architecture
- **Level 0 (Flat / Canvas):** `#F8FAFC`. Base background. Does not cast a shadow.
- **Level 1 (Card & Module Layer):** `#FFFFFF` surface enclosed by a 1px border of `#E2E8F0` with an ambient shadow: `0 1px 3px rgba(15, 23, 42, 0.04), 0 6px 16px rgba(15, 23, 42, 0.03)`.
- **Level 2 (Hover & Active Inspections):** `#FFFFFF` surface with a subtle focus border (`#0284C7` at 30%) and enhanced ambient spread: `0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 12px 24px -2px rgba(15, 23, 42, 0.06)`.
- **Level 3 (Diagnostic Drawers & Flyouts):** Used for deep-dive photo inspections and damage heatmaps: `0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.03)`.
- **Level 4 (Critical Modals & Dialogs):** Centered overlays with heavy background diffusion: `backdrop-filter: blur(8px)`, background `rgba(15, 23, 42, 0.6)`.

Borders work in lockstep with elevation: structural containers always feature an explicit 1px boundary (`#E2E8F0`) to ensure contrast against white printouts and PDF exports.

## Shapes

A soft, controlled radius (`roundedness: 1`) provides an engineered, instrument-panel feel that avoids both harsh sharp corners and overly playful pill contours.

- **Base Radius (0.25rem / 4px):** Applied to telemetry badges, input controls, table selection states, and micro status chips.
- **Container Radius (`rounded-lg`, 0.5rem / 8px):** Applied to primary analysis cards, visual vehicle diagrams, scan summaries, and modals.
- **Feature Radius (`rounded-xl`, 0.75rem / 12px):** Applied exclusively to major hero summary cards, damage detection heatmaps, and high-level vehicle health indexes.
- **Pill Radius (`rounded-full`):** Reserved exclusively for semantic status pills (e.g., "PASSED", "ATTENTION", "CRITICAL") and notification counters.

## Components

### Buttons
- **Primary:** Solid `#0F4C81` background, `#FFFFFF` text, 0.25rem radius, 1px `#0F4C81` border. Active/Hover states transition to `#1E3A8A`. Provides visual finality for actions like "Generate Full Report" or "Start AI Scan".
- **Secondary (AI Actions):** `#0284C7` background or subtle `#0284C7` 10% tint surface with `#0284C7` text and 1px border. Used for interactive analysis tools like "Re-scan Panel" or "Detect Paint Irregularities".
- **Outline / Ghost:** Transparent background, 1px `#E2E8F0` border, `#0F172A` text. Hover shifts to `#F1F5F9`.

### Diagnostic Badges & Chips
- Designed as compact data flags containing an icon, label, and numerical indicator.
- **Pass Badge:** `#ECFDF5` background, `#10B981` text, 1px `#A7F3D0` border.
- **Warning Badge:** `#FFFBEB` background, `#D97706` text, 1px `#FDE68A` border.
- **Damage/Alert Badge:** `#FEF2F2` background, `#EF4444` text, 1px `#FECACA` border.
- **AI Telemetry Badge:** `#F0F9FF` background, `#0284C7` text, 1px `#BAE6FD` border, often prefixed with a micro pulse animation indicator.

### Input Fields & Controls
- **Inputs:** `#FFFFFF` background, 1px `#CBD5E1` border, 0.25rem radius, text in `#0F172A`. Focus state uses a crisp `#0284C7` outline ring with 0 offset and 2px spread.
- **Checkboxes & Radios:** Precision-sized (16x16px). Unchecked: `#FFFFFF` with `#CBD5E1` border. Checked: `#0F4C81` solid with a sharp white checkmark or center pip.

### Diagnostic Cards
- White `#FFFFFF` foundation with Level 1 elevation and 1px `#E2E8F0` border.
- Structured with a distinct header zone (title, category badge, and AI confidence score) separated by an ultra-thin 1px border, followed by modular data rows.

### Lists & Telemetry Tables
- Alternating subtle rows (`#FFFFFF` to `#F8FAFC`) with minimal 1px border separators.
- Numerical values aligned right with tabular figures; component names aligned left with semantic status indicators positioned alongside.

### Legal Disclaimers & Caveats
- Prominently framed container with a subtle neutral-cool background (`#F1F5F9`), a 3px solid left accent border in `#0F4C81`, and compact `body-sm` typography in `#64748B`. Standardized for Pre-purchase inspection legal terms and AI non-destructive diagnostic disclaimers.

### AI Damage Heatmap Overlay
- Interactive vehicle blueprint or photographic panel utilizing SVG coordinate overlays. Hotspots render concentric pulse circles in `#EF4444` (damage) or `#F59E0B` (imperfection) paired with high-contrast micro tooltips.