import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { EXAMPLES } from "@/lib/examples";
import { OG_IMAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "System Design Examples",
  description: "Worked system design diagrams: URL shortener, chat app and news feed. Each one explains the flow and opens in the editor.",
  alternates: { canonical: "/examples" },
  openGraph: { url: "/examples", title: "System Design Examples | System Design Visualizer", images: [OG_IMAGE] },
  twitter: { images: [OG_IMAGE] },
};

export default function ExamplesPage() {
  return (
    <div className="flex flex-1 flex-col bg-ground text-ink">
      <header className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-5 sm:px-8">
        <Logo />
        <Link href="/editor" className="inline-flex h-10 items-center rounded-ui border border-line bg-panel px-4 text-[14px] font-semibold transition-colors hover:border-ink">
          Open the editor
        </Link>
      </header>
      <main className="mx-auto w-full max-w-[1280px] px-5 pb-24 pt-12 sm:px-8">
        <h1 className="max-w-[18ch] text-5xl font-bold leading-[1] tracking-[-0.035em] sm:text-6xl">System design examples</h1>
        <p className="mt-5 max-w-[56ch] text-[17px] leading-relaxed text-muted">
          Three classic interview designs, each drawn as a diagram with the flow and trade-offs written out. Open any of them in the editor and change it.
        </p>
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {EXAMPLES.map((e) => (
            <li key={e.slug}>
              <Link href={`/examples/${e.slug}`} className="flex h-full flex-col rounded-panel border border-line bg-panel p-6 transition-colors hover:border-ink">
                <h2 className="font-display text-2xl font-bold tracking-tight">{e.title.replace(" system design", "")}</h2>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted">{e.summary}</p>
                <span className="mt-6 text-[14px] font-semibold">Read the design</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
