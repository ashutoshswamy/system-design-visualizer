import Link from "next/link";

const DEV_LINKS = [
  { label: "GitHub", href: "https://github.com/ashutoshswamy" },
  { label: "LinkedIn", href: "https://linkedin.com/in/ashutoshswamy" },
  { label: "X", href: "https://x.com/ashutoshswamy_" },
];

const FEATURES: { label: string; items: string[] }[] = [
  { label: "sketch", items: ["21 component types", "drag or click to place", "double-click to rename + set status"] },
  { label: "connect", items: ["drag an arrow out of any node", "bends only when the layout needs it", "click-to-select, delete removes cleanly"] },
  { label: "organize", items: ["marquee-select a region", "group components, drag as one", "pan + zoom an infinite canvas"] },
  { label: "ship", items: ["export a tight-cropped PNG", "name the design, it names the file", "light / dark, your call"] },
];

export default function LandingPage() {
  return (
    <main className="flex flex-1 flex-col items-center bg-[#0a0a0b] font-mono text-[#e7e7ea]">
      <div className="w-full max-w-5xl px-4 pt-14 pb-16 sm:px-6 sm:pt-20">
        <div className="mb-3 flex items-center gap-2 text-[11px] text-[#5a5a5f]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#f0b429]" />
          system design visualizer
        </div>

        <h1 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-[#e7e7ea] sm:text-4xl md:text-5xl">
          Sketch the architecture.
          <br />
          <span className="text-[#86868c]">Not the slide deck.</span>
        </h1>

        <p className="mt-5 max-w-lg text-[14px] leading-relaxed text-[#86868c] sm:text-[15px]">
          A canvas for system-design diagrams — components, arrows, live status, one PNG export.
          No accounts, no sync setup, no learning curve.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
          <Link
            href="/editor"
            className="rounded-sm border border-[#f0b429] bg-[#f0b429] px-5 py-2.5 text-[13px] font-semibold text-[#0a0a0b] transition-opacity hover:opacity-90"
          >
            Open the editor →
          </Link>
          <span className="text-[11px] text-[#5a5a5f]">saves to your browser, nothing leaves it</span>
        </div>

        {/* illustrative diagram — a static example of what the tool draws */}
        <div className="thin-scroll mt-12 overflow-x-auto rounded-sm border border-[#262629] bg-[#0d0d0e] p-4 sm:mt-16 sm:p-6">
          <svg viewBox="0 0 760 220" className="w-full min-w-[640px]" role="img" aria-label="Example diagram: client through load balancer to two servers, a cache, and a database">
            <defs>
              <marker id="hero-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0 0 L8 4 L0 8 Z" fill="#86868c" />
              </marker>
            </defs>

            <path d="M110 110 C 160 110, 160 110, 210 110" stroke="#86868c" strokeWidth="1.5" fill="none" markerEnd="url(#hero-arrow)" />
            <path d="M340 100 C 380 70, 400 55, 440 45" stroke="#86868c" strokeWidth="1.5" fill="none" markerEnd="url(#hero-arrow)" />
            <path d="M340 120 C 380 150, 400 165, 440 175" stroke="#86868c" strokeWidth="1.5" fill="none" markerEnd="url(#hero-arrow)" />
            <path d="M570 45 C 610 55, 610 55, 650 65" stroke="#86868c" strokeWidth="1.5" fill="none" markerEnd="url(#hero-arrow)" />
            <path d="M570 175 C 610 165, 610 165, 650 155" stroke="#86868c" strokeWidth="1.5" fill="none" markerEnd="url(#hero-arrow)" />

            {[
              { x: 10, y: 85, w: 100, h: 50, bar: "#60a5fa", label: "client", dot: "#22c55e" },
              { x: 210, y: 85, w: 130, h: 50, bar: "#818cf8", label: "load balancer", dot: "#22c55e" },
              { x: 440, y: 20, w: 130, h: 50, bar: "#a78bfa", label: "server", dot: "#22c55e" },
              { x: 440, y: 150, w: 130, h: 50, bar: "#a78bfa", label: "server", dot: "#eab308" },
              { x: 650, y: 40, w: 100, h: 50, bar: "#f472b6", label: "cache", dot: "#22c55e" },
              { x: 650, y: 130, w: 100, h: 50, bar: "#f97316", label: "database", dot: "#22c55e" },
            ].map((n) => (
              <g key={n.label + n.x}>
                <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="3" fill="#1a1a1d" stroke="#262629" />
                <rect x={n.x} y={n.y} width="3" height={n.h} fill={n.bar} />
                <text x={n.x + 12} y={n.y + n.h / 2} dominantBaseline="middle" fill="#c9c9cd" fontSize="11">
                  {n.label}
                </text>
                <circle cx={n.x + n.w - 12} cy={n.y + 12} r="4" fill={n.dot} />
              </g>
            ))}
          </svg>
        </div>
      </div>

      <div className="w-full max-w-5xl px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.label}>
              <div className="mb-3 text-[11px] text-[#5a5a5f]">
                <span className="text-[#f0b429]/70">// </span>
                {f.label}
              </div>
              <ul className="space-y-2">
                {f.items.map((item) => (
                  <li key={item} className="text-[13px] leading-relaxed text-[#86868c]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-full max-w-5xl flex-col gap-3 border-t border-[#262629] px-4 py-6 text-[11px] text-[#5a5a5f] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <span>
          built with plain SVG, no canvas library —{" "}
          <Link href="/editor" className="text-[#86868c] underline underline-offset-2 hover:text-[#e7e7ea]">
            open the editor
          </Link>
        </span>
        <div className="flex items-center gap-4">
          <span className="text-[#5a5a5f]">Ashutosh Swamy</span>
          {DEV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#86868c] underline underline-offset-2 hover:text-[#e7e7ea]"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
