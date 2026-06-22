import Link from "next/link";
import { ArrowRight, Boxes, Check, Layers, Minus, Palette, QrCode } from "lucide-react";
import { CardRenderer } from "@/components/card/CardRenderer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getThemes } from "@/lib/card/themes";
import { collectFontHrefs } from "@/lib/card/theme-engine";
import { sampleCard } from "@/lib/card/sample";
import { site, socialProfiles } from "@/lib/site";
import { getUser } from "@/lib/auth";
import { ThemeCycler } from "@/components/ThemeCycler";
import { InteractiveGrid } from "@/components/InteractiveGrid";

/* ---------------------------------------------------------------- content */

const STEPS = [
  {
    title: "Compose your card",
    body: "Add blocks — header, bio, links, social, contact, and more — then drag to reorder or toggle any of them off.",
  },
  {
    title: "Pick a theme and customize",
    body: "Choose a theme, then fine-tune the accent, font, radius, avatar shape, alignment, and spacing. A contrast checker keeps it readable.",
  },
  {
    title: "Share by QR, link, or vCard",
    body: "Download a QR code, copy a direct link, or export a vCard so anyone can save you to their contacts in one tap.",
  },
];

const FAQS = [
  {
    q: "What is digitalcard?",
    a: "digitalcard is a free, open-source builder for digital business cards. You assemble a card from blocks — like header, links, and contact — choose a theme, then share it as a QR code, a link, or a saved contact. You can self-host it or use the hosted version.",
  },
  {
    q: "Is digitalcard free?",
    a: "Yes. The full builder, every block type, theme customization, QR codes, and vCard export are free and open-source under the MIT license. The hosted version adds a larger theme catalog; the self-hosted build is free forever.",
  },
  {
    q: "Do I need an account or any coding?",
    a: "No. Open the editor and start building in your browser — no sign-up and no code. Self-hosting only asks you to run a standard Next.js app with npm install and npm run dev.",
  },
  {
    q: "How do I share my digital card?",
    a: "Three ways: download a QR code as a PNG or SVG, copy a direct link to your card, or export a vCard (.vcf) file that opens straight into someone's contacts app.",
  },
  {
    q: "Can I self-host digitalcard?",
    a: "Yes. The project is MIT-licensed and ships as a standard Next.js app. Clone it, run npm install and npm run dev, and you have the full builder. Self-hosted and hosted share one rendering engine.",
  },
  {
    q: "What is the difference between the open-source and hosted versions?",
    a: "They run the identical engine and editor. The only difference is the theme catalog: the open-source build includes six base themes, while the hosted version adds more than thirty premium themes.",
  },
];

const FEATURES = [
  {
    icon: Layers,
    title: "Block-based editor",
    body: "Ten block types — header, bio, links, social, contact, CTA, gallery, map, divider, spacer. Drag to reorder; toggle any block on or off.",
  },
  {
    icon: Palette,
    title: "Themes and live style",
    body: "Six built-in themes plus live controls for accent, font, radius, avatar shape, alignment, and spacing — with a built-in contrast checker.",
  },
  {
    icon: QrCode,
    title: "Share anywhere",
    body: "Download a QR code (PNG or SVG), copy a link, or export a vCard your contacts can save in one tap.",
  },
  {
    icon: Boxes,
    title: "Open-core",
    body: "Self-host the MIT build, or use the hosted version for 30+ premium themes. The same engine powers both.",
  },
];

const COMPARISON = [
  { feature: "Price", oss: "Free (MIT)", hosted: "Paid plan" },
  { feature: "Builder and all 10 blocks", oss: true, hosted: true },
  { feature: "QR, copy link, vCard export", oss: true, hosted: true },
  { feature: "Themes", oss: "6 base", hosted: "30+ premium" },
  { feature: "Updates", oss: "You deploy", hosted: "Managed" },
];

/* ------------------------------------------------------------------ schema */

function jsonLd() {
  const software = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: site.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: site.description,
    url: site.url,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    license: "https://opensource.org/licenses/MIT",
  };
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: `${site.url}/opengraph-image`,
    sameAs: socialProfiles,
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to make a digital business card",
    step: STEPS.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.body,
    })),
  };
  return [software, organization, faq, howTo];
}

/* -------------------------------------------------------------------- page */

export default async function Home() {
  const themes = getThemes("oss");
  const fontHrefs = collectFontHrefs(themes);
  const user = await getUser();

  return (
    <>
      {fontHrefs.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      {jsonLd().map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <div className="min-h-dvh bg-background text-foreground">
        {/* ---- nav ---- */}
        <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
          <nav className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-brand text-sm font-bold text-brand-foreground">
                d
              </span>
              digitalcard
            </Link>
            <div className="ml-6 hidden items-center gap-6 text-sm text-muted-foreground md:flex">
              <a href="#features" className="hover:text-foreground">Features</a>
              <a href="#themes" className="hover:text-foreground">Themes</a>
              <a href="#pricing" className="hover:text-foreground">Open-core</a>
              <a href="#faq" className="hover:text-foreground">FAQ</a>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <a
                href={site.github}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="GitHub repository"
              >
                <GithubMark className="h-4 w-4" />
              </a>
              <ThemeToggle />
              <Link
                href={user ? "/dashboard" : "/login"}
                className="hidden h-9 items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:inline-flex"
              >
                {user ? "Dashboard" : "Sign in"}
              </Link>
              <Link
                href="/edit"
                className="inline-flex h-9 items-center gap-1.5 rounded-md bg-brand px-3 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-hover"
              >
                Open editor
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </nav>
        </header>

        <main>
          {/* ---- hero ---- */}
          <section className="relative isolate overflow-hidden border-b border-border">
            <InteractiveGrid />
            <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.05fr_1fr] lg:py-28">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />
                  Open source · self-host or hosted
                </span>
                <h1 className="mt-6 text-5xl font-semibold leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
                  One card.
                  <br />
                  <span className="text-brand">Every</span> look.
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                  <strong className="font-medium text-foreground">digitalcard</strong> is a free,
                  open-source builder for digital business cards. Compose from blocks, pick a theme,
                  and share by QR or link — the same card, rendered any way you like.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href="/edit"
                    className="inline-flex h-11 items-center gap-2 rounded-md bg-brand px-5 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-hover"
                  >
                    Build your card
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href={site.github}
                    className="inline-flex h-11 items-center gap-2 rounded-md border border-border px-5 text-sm font-medium transition-colors hover:bg-secondary"
                  >
                    <GithubMark className="h-4 w-4" />
                    View source
                  </a>
                </div>
                <p className="mt-4 text-sm text-fg-subtle">
                  MIT licensed · works in your browser · no account needed
                </p>

                <dl className="mt-10 grid max-w-md grid-cols-3 divide-x divide-border overflow-hidden rounded-xl border border-border">
                  {[
                    { n: "10", l: "block types" },
                    { n: "6", l: "themes" },
                    { n: "3", l: "ways to share" },
                  ].map((s) => (
                    <div key={s.l} className="px-4 py-3.5">
                      <dt className="sr-only">{s.l}</dt>
                      <dd>
                        <span className="block text-2xl font-semibold tabular-nums tracking-tight">
                          {s.n}
                        </span>
                        <span className="text-xs text-muted-foreground">{s.l}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div
                className="rounded-2xl border border-border bg-secondary/40 px-8 py-6"
                style={{
                  backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)",
                  backgroundSize: "18px 18px",
                }}
              >
                <ThemeCycler />
              </div>
            </div>
          </section>

          {/* ---- themes showcase ---- */}
          <section id="themes" className="border-t border-border bg-secondary/30 py-20">
            <div className="mx-auto max-w-6xl px-6">
              <h2 className="text-3xl font-semibold tracking-tight">Themes are just data</h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                One rendering engine reads a small theme object — so the same card looks right in
                every style, and new themes drop in without new code. Here is one card in all six
                open-source themes.
              </p>
              <div className="mt-12 grid justify-items-center gap-10 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
                {themes.map((theme) => (
                  <figure key={theme.id} className="flex w-full flex-col items-center gap-3">
                    <CardRenderer doc={sampleCard} theme={theme} />
                    <figcaption className="flex items-center gap-2">
                      <span className="text-sm font-medium">{theme.name}</span>
                      <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                        {theme.category}
                      </span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>

          {/* ---- features ---- */}
          <section id="features" className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="text-3xl font-semibold tracking-tight">Everything your card needs</h2>
            <div className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2">
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="flex gap-4">
                    <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-lg bg-brand-subtle text-brand">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <h3 className="text-base font-semibold">{f.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ---- how it works ---- */}
          <section className="border-t border-border bg-secondary/30 py-20">
            <div className="mx-auto max-w-6xl px-6">
              <h2 className="text-3xl font-semibold tracking-tight">How it works</h2>
              <ol className="mt-10 grid gap-8 md:grid-cols-3">
                {STEPS.map((s, i) => (
                  <li key={s.title} className="flex flex-col gap-3">
                    <span className="grid size-9 place-items-center rounded-full bg-brand text-sm font-semibold text-brand-foreground tabular-nums">
                      {i + 1}
                    </span>
                    <h3 className="text-lg font-semibold">{s.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* ---- open-core comparison ---- */}
          <section id="pricing" className="mx-auto max-w-4xl px-6 py-20">
            <h2 className="text-3xl font-semibold tracking-tight">Self-host or hosted</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Both run the identical engine and editor. The hosted version simply ships a larger
              theme catalog.
            </p>
            <div className="mt-8 overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/50 text-left">
                    <th className="px-5 py-3 font-medium">Feature</th>
                    <th className="px-5 py-3 font-medium">Self-host (OSS)</th>
                    <th className="px-5 py-3 font-medium">Hosted</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row, i) => (
                    <tr key={row.feature} className={i % 2 ? "bg-secondary/20" : undefined}>
                      <th scope="row" className="px-5 py-3 text-left font-medium">{row.feature}</th>
                      <Cell value={row.oss} />
                      <Cell value={row.hosted} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ---- FAQ ---- */}
          <section id="faq" className="border-t border-border bg-secondary/30 py-20">
            <div className="mx-auto max-w-3xl px-6">
              <h2 className="text-3xl font-semibold tracking-tight">Frequently asked questions</h2>
              <dl className="mt-10 divide-y divide-border">
                {FAQS.map((f) => (
                  <div key={f.q} className="py-6 first:pt-0">
                    <dt className="text-base font-semibold">{f.q}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          {/* ---- CTA band ---- */}
          <section className="mx-auto max-w-6xl px-6 py-24 text-center">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Ready to build your card?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              Open the editor and have a shareable card in minutes. Free and open source.
            </p>
            <Link
              href="/edit"
              className="mt-8 inline-flex h-11 items-center gap-2 rounded-md bg-brand px-6 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-hover"
            >
              Build your card
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </main>

        {/* ---- footer ---- */}
        <footer className="border-t border-border">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 font-semibold tracking-tight text-foreground">
              <span className="grid h-5 w-5 place-items-center rounded bg-brand text-xs font-bold text-brand-foreground">
                d
              </span>
              digitalcard
            </div>
            <div className="flex items-center gap-6">
              <Link href="/edit" className="hover:text-foreground">Editor</Link>
              <a href={site.github} className="hover:text-foreground">GitHub</a>
              <a href="/llms.txt" className="hover:text-foreground">llms.txt</a>
            </div>
            <p>MIT licensed · open source</p>
          </div>
        </footer>
      </div>
    </>
  );
}

/* ----------------------------------------------------------- small pieces */

function Cell({ value }: { value: string | boolean }) {
  if (value === true) {
    return (
      <td className="px-5 py-3">
        <Check className="size-4 text-success" aria-label="Included" />
      </td>
    );
  }
  if (value === false) {
    return (
      <td className="px-5 py-3">
        <Minus className="size-4 text-fg-subtle" aria-label="Not included" />
      </td>
    );
  }
  return <td className="px-5 py-3 text-muted-foreground">{value}</td>;
}

function GithubMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.42.36.79 1.07.79 2.16v3.2c0 .31.21.68.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
    </svg>
  );
}
