# System Design Visualizer

A canvas tool for sketching system-design diagrams — drag components onto an infinite canvas, connect them with bendy arrows, mark each one's live status, group/organize, and export a PNG. No backend, no accounts — everything saves to your browser.

Live at `/` (landing page) and `/editor` (the tool).

## Features

- **21 component types** across client/edge, compute, data, messaging, and integration/ops — drag from the palette or click to place.
- **Connect** by dragging an arrow out of any node onto another. Arrows curve only when the layout needs it (straight when axis-aligned).
- **Status per node**: idle / healthy / warning / down, cycled from a click or set in the edit modal (double-click a node).
- **Select & organize**: click, shift-click, or marquee-drag to multi-select; group nodes to move them as one; delete removes cleanly (including connected edges).
- **Infinite canvas**: pan with the wheel or middle-mouse drag, zoom with `⌘+`/`⌘-`/pinch/`ctrl+scroll`.
- **Export**: tight-cropped PNG at 2x, named after your design.
- **Light / dark theme**, persisted.
- Autosaves to `localStorage` — no login, nothing leaves your browser.

## Stack

Next.js (App Router) + TypeScript, Tailwind for chrome, plain SVG for the canvas (no canvas library), Zustand for state.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
  page.tsx            # landing page
  editor/page.tsx      # the tool
components/visualizer/ # Canvas, Node, Edge, Palette, Toolbar, edit modal
lib/visualizer/         # types, constants, geometry (pure), store, export, persistence, theme
```

See `CLAUDE.md` for the full design spec and conventions.

## Author

Ashutosh Swamy — [GitHub](https://github.com/ashutoshswamy) · [LinkedIn](https://linkedin.com/in/ashutoshswamy) · [X](https://x.com/ashutoshswamy_)
