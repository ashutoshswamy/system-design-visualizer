"use client";

import { useEffect, useRef, useState } from "react";
import { useVisualizerStore, type ThemePref } from "@/lib/visualizer/store";

const OPTIONS: { value: ThemePref; label: string; swatch: string }[] = [
  { value: "light", label: "Light", swatch: "linear-gradient(90deg,#f4f5f7 50%,#f4f5f7 50%)" },
  { value: "dark", label: "Dark", swatch: "linear-gradient(90deg,#0e1117 50%,#0e1117 50%)" },
  { value: "system", label: "System", swatch: "linear-gradient(90deg,#f4f5f7 50%,#0e1117 50%)" },
];

/** Theme dropdown: Light, Dark, or follow the system. */
export function ThemeToggle() {
  const { themePref, setThemePref } = useVisualizerStore();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const current = OPTIONS.find((o) => o.value === themePref) ?? OPTIONS[2];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const swatch = (bg: string) => (
    <span aria-hidden className="size-4 shrink-0 rounded-full border border-muted/50" style={{ background: bg }} />
  );

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Theme: ${current.label}`}
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 items-center gap-2 rounded-ui border border-line bg-panel px-3 text-[14px] font-medium transition-colors hover:border-ink"
      >
        {swatch(current.swatch)}
        <span className="hidden lg:inline">{current.label}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul
          role="menu"
          aria-label="Theme"
          className="absolute right-0 top-[calc(100%+6px)] z-40 w-40 rounded-panel border border-line bg-panel p-1.5 shadow-[0_12px_32px_-12px_rgb(var(--shadow)/0.35)]"
        >
          {OPTIONS.map((o) => (
            <li key={o.value} role="none">
              <button
                type="button"
                role="menuitemradio"
                aria-checked={themePref === o.value}
                autoFocus={themePref === o.value}
                onClick={() => {
                  setThemePref(o.value);
                  setOpen(false);
                }}
                className="flex h-9 w-full items-center gap-2.5 rounded-ui px-2.5 text-left text-[14px] font-medium transition-colors hover:bg-panel-2"
              >
                {swatch(o.swatch)}
                <span className="flex-1">{o.label}</span>
                {themePref === o.value && (
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                    <path d="m3 7.5 2.8 2.8L11 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
