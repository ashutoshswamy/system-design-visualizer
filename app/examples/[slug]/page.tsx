import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExampleDiagram } from "@/components/ExampleDiagram";
import { Logo } from "@/components/Logo";
import { EXAMPLES, getExample } from "@/lib/examples";
import { AUTHOR, OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";
import { NODE_TYPES } from "@/lib/visualizer/constants";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return EXAMPLES.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const e = getExample((await params).slug);
  if (!e) return {};
  return {
    title: e.metaTitle,
    description: e.description,
    alternates: { canonical: `/examples/${e.slug}` },
    openGraph: { type: "article", url: `/examples/${e.slug}`, title: `${e.metaTitle} | ${SITE_NAME}`, description: e.description, images: [OG_IMAGE] },
    twitter: { images: [OG_IMAGE] },
  };
}

export default async function ExamplePage({ params }: Props) {
  const e = getExample((await params).slug);
  if (!e) notFound();
  const url = `${SITE_URL}/examples/${e.slug}`;
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: e.title,
        description: e.description,
        url,
        inLanguage: "en",
        dateModified: "2026-11-12",
        author: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
        publisher: { "@type": "Person", name: AUTHOR.name },
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Examples", item: `${SITE_URL}/examples` },
          { "@type": "ListItem", position: 3, name: e.title, item: url },
        ],
      },
    ],
  };
  const others = EXAMPLES.filter((x) => x.slug !== e.slug);

  return (
    <div className="flex flex-1 flex-col bg-ground text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <header className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-5 sm:px-8">
        <Logo />
        <Link href={`/editor?example=${e.slug}`} className="inline-flex h-10 items-center rounded-ui bg-ink px-4 text-[14px] font-semibold text-on-ink">
          Open the editor
        </Link>
      </header>

      <main className="mx-auto w-full max-w-[1280px] px-5 pb-24 pt-10 sm:px-8">
        <nav aria-label="Breadcrumb" className="text-[14px] text-muted">
          <Link href="/" className="hover:text-ink">Home</Link> / <Link href="/examples" className="hover:text-ink">Examples</Link>
        </nav>
        <h1 className="mt-4 max-w-[20ch] text-5xl font-bold leading-[1] tracking-[-0.035em] sm:text-6xl">{e.title}</h1>
        <p className="mt-5 max-w-[62ch] text-[18px] leading-relaxed text-muted">{e.summary}</p>

        <div className="mt-10 rounded-panel border border-line bg-panel p-4 sm:p-6">
          <div className="thin-scroll overflow-x-auto">
            <ExampleDiagram example={e} />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
            <p className="text-[14px] text-muted">Drawn with System Design Visualizer.</p>
            <Link href={`/editor?example=${e.slug}`} className="inline-flex h-10 items-center rounded-ui bg-ink px-4 text-[14px] font-semibold text-on-ink">
              Open the editor
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-14 lg:grid-cols-12">
          <section className="lg:col-span-5">
            <h2 className="text-3xl font-bold tracking-[-0.03em]">Requirements</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[17px] leading-relaxed text-muted marker:text-ink">
              {e.requirements.map((r) => <li key={r}>{r}</li>)}
            </ul>
            <h2 className="mt-12 text-3xl font-bold tracking-[-0.03em]">Trade-offs</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[17px] leading-relaxed text-muted marker:text-ink">
              {e.tradeoffs.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </section>
          <section className="lg:col-span-7">
            <h2 className="text-3xl font-bold tracking-[-0.03em]">How a request flows</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-[17px] leading-relaxed marker:font-semibold">
              {e.flow.map((s) => <li key={s}>{s}</li>)}
            </ol>
            <h2 className="mt-12 text-3xl font-bold tracking-[-0.03em]">Why each component is there</h2>
            <dl className="mt-4 space-y-4">
              {e.components.map((c) => (
                <div key={c.type}>
                  <dt className="flex items-center gap-2.5 font-display text-lg font-semibold">
                    <span aria-hidden className="size-3.5 rounded-full" style={{ background: NODE_TYPES[c.type].color }} />
                    {NODE_TYPES[c.type].label}
                  </dt>
                  <dd className="mt-1 pl-6 text-[16px] leading-relaxed text-muted">{c.why}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <section className="mt-20 border-t border-line pt-10">
          <h2 className="text-2xl font-bold tracking-[-0.03em]">More examples</h2>
          <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-[17px]">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/examples/${o.slug}`} className="underline decoration-line underline-offset-4 hover:decoration-ink">{o.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
