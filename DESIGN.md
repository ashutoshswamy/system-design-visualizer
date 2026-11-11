# Design: Transit Map

**World.** A metro diagram. Components are stations, connections are octilinear colored lines (straight, one 45° diagonal, rounded corners), category = line color. Chrome is monochrome ink; color comes only from the diagram.

**Themes.** Day map (ground `#f4f5f7`, ink `#12151c`) and night map (ground `#0e1117`, ink `#eef0f4`). Tokens live in `app/globals.css`; the canvas uses literal hex from `lib/visualizer/theme.ts` so PNG export is self-contained.

**Type.** Bricolage Grotesque for headings, DM Sans for everything else (only these two). Exports embed DM Sans via `embeddedFontCss` in `lib/visualizer/export.ts`.

**Shape.** Interactive 8px, panels 14px, stations 12px. One scale.

**Color rules.** Category colors: `NODE_TYPES`. Status colors (healthy/warning/down/idle) mean status only. Primary action is solid ink; selection is an ink ring (interchange symbol).

**Motion.** One moment: landing map assembles (stations rise, lines draw, request pulses travel). Honors `prefers-reduced-motion`.

**Toasts.** `sileo`, via `lib/visualizer/actions.ts` (export, delete, group, ungroup, clear-confirm, autosave failure) and the edit modal.

**Logo.** A line forks at 45° into two stations (`lib/logo.ts`). `LogoMark` in `components/Logo.tsx` uses `currentColor`, so it is ink in light and light in dark. The favicon is the tile version (`public/icon-light.svg`, `icon-dark.svg`): it starts from the OS theme and `ThemeSync` switches it whenever the site theme changes; the social card reuses the same shapes.
