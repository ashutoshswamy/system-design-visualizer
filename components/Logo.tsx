import Link from "next/link";
import { LOGO } from "@/lib/logo";

/** The mark alone. Colored by `currentColor`, so it is ink in light theme and light in dark. */
export function LogoMark({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <circle {...LOGO.start} fill="currentColor" stroke="none" />
      <path d={LOGO.lines} strokeWidth={LOGO.lineWidth} />
      {LOGO.stations.map((s) => (
        <circle key={s.cy} {...s} strokeWidth={LOGO.ringWidth} />
      ))}
    </svg>
  );
}

export function Logo({ href = "/", labelClass = "" }: { href?: string; labelClass?: string }) {
  return (
    <Link href={href} aria-label="System Design Visualizer home" className="flex items-center gap-2.5 font-display text-[17px] font-bold tracking-tight text-ink">
      <LogoMark />
      <span className={labelClass}>Design Visualizer</span>
    </Link>
  );
}
