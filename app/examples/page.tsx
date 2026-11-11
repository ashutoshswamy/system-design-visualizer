import type { Metadata } from "next";
import Link from "next/link";
import { ExampleDiagram } from "@/components/ExampleDiagram";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { EXAMPLES, type Example } from "@/lib/examples";
import { OG_IMAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "System Design Examples",
  description: "Worked system design diagrams: URL shortener, chat app and news feed. Each one explains the flow and opens in the editor.",
  alternates: { canonical: "/examples" },
  openGraph: { url: "/examples", title: "System Design Examples | System Design Visualizer", images: [OG_IMAGE] },
  twitter: { images: [OG_IMAGE] },
};

const name = (e: Example) => e.title.replace(" system design", "");

const link =
  "group block rounded-panel border border-line bg-panel p-4 transition-colors hover:border-ink focus-visible:border-ink sm:p-6";

export default function ExamplesPage() {
  const [lead, ...rest] = EXAMPLES;
  return (
    <div className="flex flex-1 flex-col bg-ground text-ink">
      <header className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-5 sm:px-8">
        <Logo />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/editor" className="inline-flex h-10 items-center rounded-ui border border-line bg-panel px-4 text-[14px] font-semibold transition-colors hover:border-ink">
            Open the editor
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1280px] px-5 pb-24 pt-10 sm:px-8 sm:pt-14">
        <h1 className="max-w-[16ch] text-[clamp(2.5rem,5.2vw,4.5rem)] font-bold leading-[0.98] tracking-[-0.035em]">
          Three classic designs, drawn out.
        </h1>
        <p className="mt-5 max-w-[56ch] text-[17px] leading-relaxed text-muted">
          Each one has the diagram, the request flow and the trade-offs written down. Open any of them in the editor and change it.
        </p>

        {/* Lead example: text beside its full diagram */}
        <Link href={`/examples/${lead.slug}`} className={`${link} mt-12 grid items-center gap-6 lg:grid-cols-12 lg:gap-10`}>
          <div className="lg:col-span-5">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{name(lead)}</h2>
            <p className="mt-3 max-w-[46ch] text-[16px] leading-relaxed text-muted">{lead.summary}</p>
            <span className="mt-6 inline-block border-b border-ink pb-0.5 text-[15px] font-semibold">Read the design</span>
          </div>
          <div className="rounded-ui border border-line bg-ground p-3 lg:col-span-7">
            <ExampleDiagram example={lead} compact />
          </div>
        </Link>

        <ul className="mt-6 grid gap-6 md:grid-cols-2">
          {rest.map((e) => (
            <li key={e.slug}>
              <Link href={`/examples/${e.slug}`} className={`${link} flex h-full flex-col`}>
                <div className="rounded-ui border border-line bg-ground p-3">
                  <ExampleDiagram example={e} compact />
                </div>
                <h2 className="mt-5 font-display text-2xl font-bold tracking-tight">{name(e)}</h2>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted">{e.summary}</p>
                <span className="mt-5 self-start border-b border-ink pb-0.5 text-[15px] font-semibold">Read the design</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
