import Link from "next/link";
import { HeroMap } from "@/components/landing/HeroMap";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, AUTHOR } from "@/lib/site";
import { Moves } from "@/components/landing/Moves";
import { StatusLab } from "@/components/landing/StatusLab";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { COMPONENT_COUNT, NODE_CATEGORIES, NODE_TYPES } from "@/lib/visualizer/constants";

const DEV_LINKS = [
  { label: "Portfolio", href: "https://ashutoshswamy.in" },
  { label: "GitHub", href: "https://github.com/ashutoshswamy" },
  { label: "LinkedIn", href: "https://linkedin.com/in/ashutoshswamy" },
  { label: "X", href: "https://x.com/ashutoshswamy_" },
];

const TRACK = [NODE_TYPES.client.color, NODE_TYPES.loadbalancer.color, NODE_TYPES.database.color, NODE_TYPES.queue.color, NODE_TYPES.thirdparty.color];

const FAQ = [
  { q: "Is System Design Visualizer free?", a: "Yes. There are no accounts, paywalls or limits. Open the editor and start drawing." },
  { q: "Where are my diagrams saved?", a: "In your browser's local storage on this device. Nothing is uploaded, so clearing site data removes them. Export a PNG to keep a copy." },
  { q: "What can I export?", a: "A tight-cropped PNG at 2x resolution, named after your design, in whichever theme you are using." },
  { q: "What is it good for?", a: "Practising system design interviews, explaining an architecture to a team, and drawing diagrams for docs and RFCs." },
  { q: "Does it work on a phone?", a: "Yes, you can place, drag and connect components by touch, though a larger screen is more comfortable for big diagrams." },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "en",
      author: { "@id": `${SITE_URL}/#author` },
    },
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#app`,
      name: SITE_NAME,
      url: `${SITE_URL}/editor`,
      description: SITE_DESCRIPTION,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any (web browser)",
      browserRequirements: "Requires JavaScript",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: [
        `${COMPONENT_COUNT} system design component types`,
        "Drag-to-connect 45-degree connectors",
        "Per-component live status: idle, healthy, warning, down",
        "Group, pan and zoom",
        "Tight-cropped 2x PNG export",
        "Light and dark themes",
      ],
      author: { "@id": `${SITE_URL}/#author` },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    { "@type": "Person", "@id": `${SITE_URL}/#author`, name: AUTHOR.name, url: AUTHOR.url, sameAs: AUTHOR.sameAs },
  ],
};

const cta =
  "inline-flex h-12 items-center rounded-ui bg-ink px-6 text-[15px] font-semibold text-on-ink transition-transform hover:-translate-y-px active:translate-y-0 active:scale-[0.98]";

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col bg-ground text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }} />
      <header className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-5 sm:px-8">
        <Logo />
        <div className="flex items-center gap-3">
          <Link href="/examples" className="hidden px-2 text-[14px] font-medium text-muted transition-colors hover:text-ink sm:inline">
            Examples
          </Link>
          <ThemeToggle />
          <Link href="/editor" className="hidden h-10 items-center rounded-ui border border-line bg-panel px-4 text-[14px] font-semibold transition-colors hover:border-ink sm:inline-flex">
            Open the editor
          </Link>
        </div>
      </header>

      <main>
        {/* Hero: headline and action above, the live map as the thesis below */}
        <section className="mx-auto w-full max-w-[1280px] px-5 pb-16 pt-8 sm:px-8 sm:pt-12 lg:pb-24">
          <div className="grid items-end gap-6 lg:grid-cols-12 lg:gap-12">
            <h1 className="rise font-bold leading-[0.98] tracking-[-0.035em] text-[clamp(2.5rem,5.2vw,4.5rem)] lg:col-span-9">
              Sketch the architecture.
              <br />
              <span className="text-muted">Not the slide deck.</span>
            </h1>
            <div className="rise lg:col-span-3" style={{ animationDelay: "120ms" }}>
              <p className="max-w-[40ch] text-[17px] leading-relaxed text-muted">
                A canvas for system-design diagrams: components, arrows, live status, one PNG export. No accounts, no setup.
              </p>
              <div className="mt-6">
                <Link href="/editor" className={cta}>
                  Open the editor
                </Link>
              </div>
            </div>
          </div>

          <div
            className="rise mt-10 rounded-panel border border-line bg-panel p-4 sm:p-6 lg:mt-14"
            style={{ animationDelay: "240ms" }}
          >
            <HeroMap />
            <p className="mt-4 text-[13px] text-muted">Tap or click any status lamp to change it. This is the real component set.</p>
          </div>
        </section>

        {/* Line key: the taxonomy as five transit lines */}
        <section className="mx-auto w-full max-w-[1280px] px-5 py-16 sm:px-8 lg:py-24">
          <h2 className="max-w-[18ch] text-4xl font-bold leading-[1.02] tracking-[-0.03em] sm:text-5xl">
            {COMPONENT_COUNT} components on five lines.
          </h2>
          <p className="mt-4 max-w-[52ch] text-[17px] leading-relaxed text-muted">
            Every component keeps the color of its line, so a diagram reads at a glance before you read a single label.
          </p>

          <div className="mt-12 flex flex-col gap-10 lg:gap-12">
            {NODE_CATEGORIES.map((cat) => (
              <div key={cat.label} className="grid gap-4 md:grid-cols-[11rem_1fr] md:gap-8">
                <h3 className="font-display text-xl font-semibold capitalize tracking-tight">{cat.label}</h3>
                <ol className="flex flex-col md:grid md:grid-cols-6">
                  {cat.types.map((type, i) => {
                    const color = NODE_TYPES[type].color;
                    const last = i === cat.types.length - 1;
                    return (
                      <li key={type} className="relative pb-5 pl-9 md:pb-6 md:pl-0 md:pt-9 md:[&:nth-child(6n)_.seg]:hidden">
                        {!last && (
                          <span
                            aria-hidden
                            className="seg absolute left-[11px] top-5 h-full w-1 md:left-5 md:top-[11px] md:h-1 md:w-full"
                            style={{ background: color }}
                          />
                        )}
                        <span
                          aria-hidden
                          className="absolute left-0 top-0 size-6 rounded-full border-[5px] bg-ground md:top-0"
                          style={{ borderColor: color }}
                        />
                        <span className="block text-[15px] font-medium leading-snug">{NODE_TYPES[type].label}</span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            ))}
          </div>
        </section>

        {/* Four moves: one diagram that builds as you scroll */}
        <section className="mx-auto w-full max-w-[1280px] px-5 py-16 sm:px-8 lg:py-24">
          <h2 className="max-w-[20ch] text-4xl font-bold leading-[1.02] tracking-[-0.03em] sm:text-5xl">
            From blank canvas to PNG in four moves.
          </h2>
          <Moves />
        </section>

        {/* Status lab: pick a state, watch the traffic react */}
        <section className="mx-auto w-full max-w-[1280px] px-5 py-16 sm:px-8 lg:py-24">
          <h2 className="max-w-[22ch] text-4xl font-bold leading-[1.02] tracking-[-0.03em] sm:text-5xl">
            Red, yellow and green only ever mean status.
          </h2>
          <p className="mt-4 max-w-[52ch] text-[17px] leading-relaxed text-muted">
            Pick a state for the API server and watch what its neighbors see. The editor draws traffic by the same rules.
          </p>
          <StatusLab />
        </section>

        {/* FAQ */}
        <section className="mx-auto w-full max-w-[1280px] px-5 py-16 sm:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <h2 className="max-w-[12ch] text-4xl font-bold leading-[1.02] tracking-[-0.03em] sm:text-5xl lg:sticky lg:top-8 lg:col-span-4 lg:self-start">
              Questions, answered.
            </h2>
            {/* Each answer is a station on one line; opening it fills the stop in its line color */}
            <ol className="lg:col-span-8">
              {FAQ.map((f, i) => {
                const color = TRACK[i % TRACK.length];
                const last = i === FAQ.length - 1;
                return (
                  <li key={f.q} className="relative">
                    {!last && <span aria-hidden className="absolute left-[10px] top-8 h-full w-1" style={{ background: color }} />}
                    <details className="faq group relative pl-12" style={{ "--c": color } as React.CSSProperties}>
                      <summary className="flex min-h-[44px] cursor-pointer list-none items-start justify-between gap-6 py-[10px] font-display text-xl font-semibold tracking-tight transition-colors hover:text-muted [&::-webkit-details-marker]:hidden">
                        <span
                          aria-hidden
                          className="absolute left-0 top-[14px] size-6 rounded-full border-[5px] bg-ground transition-colors duration-300 group-open:bg-[var(--c)]"
                          style={{ borderColor: color }}
                        />
                        <span className="pt-px">{f.q}</span>
                        <span aria-hidden className="relative mt-[14px] size-4 shrink-0 text-muted">
                          <span className="absolute left-0 top-[7px] h-0.5 w-4 bg-current" />
                          <span className="absolute left-[7px] top-0 h-4 w-0.5 bg-current transition-transform duration-300 group-open:rotate-90" />
                        </span>
                      </summary>
                      <p className="max-w-[60ch] pb-8 pt-1 text-[17px] leading-relaxed text-muted">{f.a}</p>
                    </details>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* Close: the five lines run on one track into the action */}
        <section className="mx-auto w-full max-w-[1280px] px-5 pb-20 pt-10 sm:px-8 lg:pb-28">
          <h2 className="max-w-[16ch] text-5xl font-bold leading-[0.98] tracking-[-0.035em] sm:text-7xl">
            Your next diagram starts empty.
          </h2>
          <div className="mt-12 flex items-center gap-4 sm:gap-6">
            <div aria-hidden className="flex flex-1 flex-col gap-[3px]">
              {TRACK.map((c) => (
                <span key={c} className="block h-1 w-full rounded-full" style={{ background: c }} />
              ))}
            </div>
            <Link href="/editor" className={cta}>
              Open the editor
            </Link>
          </div>
          <p className="mt-5 text-[17px] text-muted">Saves to your browser. Nothing leaves it.</p>
        </section>
      </main>

      <footer className="mx-auto mt-auto flex w-full max-w-[1280px] flex-col gap-3 border-t border-line px-5 py-6 text-[14px] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <Link href="/examples" className="underline decoration-line underline-offset-4 hover:text-ink">Examples</Link>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="text-ink">Ashutosh Swamy</span>
          {DEV_LINKS.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-ink">
              {l.label}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
