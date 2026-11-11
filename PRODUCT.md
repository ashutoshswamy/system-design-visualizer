# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Learners (interview prep) and working engineers, equally. They sketch system architectures quickly to practice, explain, or document, without signing up for anything.

## Product Purpose
A client-side canvas for system-design diagrams: place components, connect them with arrows, mark live status (idle / healthy / warning / down), group, pan/zoom, export a tight-cropped 2x PNG. Success: a credible diagram in minutes, nothing leaves the browser.

## Positioning
Plain-SVG diagramming with per-component live status and zero setup: no accounts, no sync, no learning curve.

## Capabilities and Constraints
- 33 component types across client/edge, compute, data, messaging, integration/ops; each has a fixed categorical color.
- Status colors (healthy/warning/down/idle) reserved exclusively for node state.
- Drag-to-connect arrows, marquee multi-select, group/ungroup, pan + zoom, rename + status modal.
- Autosave to localStorage; light/dark theme persisted. Canvas is raw SVG so PNG export stays dependency-free (colors baked as attributes, no CSS vars inside the SVG).
- Routes: `/` landing, `/editor` tool. Stack: Next.js App Router, Tailwind v4, Zustand.
- Brand-pinned by user: fonts Bricolage Grotesque + DM Sans only; toasts via `sileo`.

## Brand Commitments
Author: Ashutosh Swamy (GitHub, LinkedIn, X links kept in landing footer).

## Evidence on Hand
No testimonials, customers or metrics exist; none may be invented.

## Product Principles
1. The diagram is the hero; chrome recedes.
2. Status color always means status, nothing else.
3. Zero-friction: no accounts, instant start.
4. Exports must look as good as the canvas.

## Accessibility & Inclusion
Keyboard shortcuts exist; keep focus states, WCAG AA contrast in both themes, honor reduced motion.
