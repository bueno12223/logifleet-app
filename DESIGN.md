---
name: Industrial Precision
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#44474e'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#495e89'
  primary: '#031f47'
  on-primary: '#ffffff'
  primary-container: '#1e355d'
  on-primary-container: '#899ecd'
  inverse-primary: '#b1c7f7'
  secondary: '#745b00'
  on-secondary: '#ffffff'
  secondary-container: '#fdd355'
  on-secondary-container: '#735a00'
  tertiary: '#301c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#4d2f00'
  on-tertiary-container: '#c3965e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d7e2ff'
  primary-fixed-dim: '#b1c7f7'
  on-primary-fixed: '#001a40'
  on-primary-fixed-variant: '#30466f'
  secondary-fixed: '#ffe08b'
  secondary-fixed-dim: '#ebc246'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#584400'
  tertiary-fixed: '#ffddb6'
  tertiary-fixed-dim: '#efbe82'
  on-tertiary-fixed: '#2a1800'
  on-tertiary-fixed-variant: '#61400f'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
  navy-deep: '#122038'
  navy-muted: '#3A4D6F'
  mustard-light: '#F6D984'
  status-error: '#D32F2F'
  status-success: '#2E7D32'
typography:
  display:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

The design system is engineered for the high-stakes world of logistics and fleet management. It evokes a sense of **industrial reliability, movement, and precision**. The brand personality is authoritative yet technologically forward-leaning, speaking to fleet managers and operators who value efficiency and uptime above all else.

The visual style is **Corporate Modern with a Minimalist edge**. It leverages heavy whitespace and high-contrast color blocking to ensure readability in high-pressure environments. By combining rigid, blocky forms with geometric curves, the UI reflects the intersection of heavy machinery and intelligent software. The aesthetic is clean and utilitarian, stripping away decorative elements in favor of functional clarity.

## Colors

The palette is anchored by **Brand Navy (#1E355D)**, used for primary surfaces, headers, and core brand identifiers to establish trust and stability. **Mustard Yellow (#F2C94C)** serves as the high-visibility accent color, reserved for critical calls to action, alerts, and active states—mirroring the caution and action colors found in industrial environments.

Backgrounds primarily use a clean White or the near-white **Neutral (#F8F9FA)** to maintain high contrast with typography. Navy-on-white is the standard for information density, while Mustard-on-Navy is the "Hero" lockup for maximum impact.

## Typography

This design system utilizes **Hanken Grotesk** as its primary typeface. Its sharp, geometric terminals and generous x-height offer the technical precision required for a logistics platform. Headlines are set in Bold or ExtraBold weights with tight tracking to mimic the "LOGI" wordmark.

For data-heavy displays, telemetry, and serial numbers, **JetBrains Mono** is used as a secondary label font. This monospaced choice ensures that numerical data (lat/long, timestamps, VINs) aligns perfectly, reinforcing the theme of mechanical accuracy.

## Layout & Spacing

The system uses a **Fixed Grid** model for desktop dashboards to ensure that data visualizations remain in predictable locations, while transitioning to a fluid single-column layout for mobile. 

The rhythm is based on an **8px grid**. 
- **Desktop:** 12-column grid, 24px gutters, 32px side margins.
- **Tablet:** 8-column grid, 16px gutters, 24px side margins.
- **Mobile:** 4-column grid, 16px gutters, 16px side margins.

Content is organized into logical "zones." Primary navigation is always docked to the left in a white sidebar rail with navy-tinted iconography; the active item is marked by a 2px Navy left border and a faint Navy tint. The main utility area occupies a light-neutral workspace.

## Elevation & Depth

To maintain an industrial feel, the design system avoids soft, "fuzzy" aesthetics. It primarily uses **Tonal Layers** and **Low-contrast Outlines** to define depth.

- **Level 0 (Surface):** The default background (#F8F9FA).
- **Level 1 (Card):** White surfaces with a 1px solid border in a lightened navy tint (e.g., #E1E5ED). No shadow.
- **Level 2 (Overlay):** Used for modals or tooltips. These use a slightly more pronounced, crisp shadow (4px blur, 0% spread) with a Navy tint to create a "lifted" effect without losing the flat industrial aesthetic.

## Shapes

The shape language reflects the brand's dual nature: the efficiency of a machine and the approachability of a service. We use **Soft (0.25rem)** rounding for most components to prevent the UI from feeling overly aggressive.

- **Interactive Elements:** Buttons and inputs use a 4px corner radius.
- **Structural Elements:** Main containers and cards use an 8px radius.
- **Special Cases:** Search bars and status badges may use Pill-shapes to differentiate them from functional data blocks.

## Components

### Buttons
- **Primary:** Solid Mustard Yellow (#F2C94C) with Navy text (#1E355D). Bold, all-caps labels for high urgency.
- **Secondary:** Solid Navy (#1E355D) with White text.
- **Tertiary:** Transparent background with a 2px Navy border.

### Input Fields
Inputs are rectangular with a 1px border. On focus, the border thickens to 2px and changes to Navy. Error states use a vibrant red with a subtle pink background tint.

### Chips & Badges
Used for vehicle status (e.g., "In Transit", "Idle"). Status indicators must use the Mono font (JetBrains Mono) for a technical feel.

### Cards
Cards are the primary container for vehicle data. They feature a 1px border and a Mustard Yellow "accent bar" (2px thick) on the left edge for active/selected items.

### Lists
Data tables and lists use high-density layouts with subtle horizontal dividers. Hover states use a very light Navy tint to highlight the active row without cluttering the view.