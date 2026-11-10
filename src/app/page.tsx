import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Library,
  Mic2,
  Music2,
  Repeat2,
} from "lucide-react";

const FEATURES = [
  {
    href: "/akkorder",
    title: "Akkordbibliotek",
    text: "Interaktive diagrammer, fingring og lyd for open, barre og power.",
    icon: Library,
  },
  {
    href: "/karaoke",
    title: "Karaoke-øving",
    text: "Tekst og akkorder i tempo, med live grep-diagram og regulerbar BPM.",
    icon: Mic2,
  },
  {
    href: "/transponer",
    title: "Transponer sang",
    text: "Lim inn tekst med [Am]-akkorder og flytt hele sangen i halvtoner.",
    icon: Repeat2,
  },
  {
    href: "/tabs",
    title: "Tabs",
    text: "Øvelser, riff og genererte tabs fra akkordprogresjoner.",
    icon: Music2,
  },
  {
    href: "/ovelser",
    title: "Øvelser",
    text: "Korte leksjoner, progresjoner og metronom for jevn øving.",
    icon: BookOpen,
  },
] as const;

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black px-6 py-14 sm:px-10 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.18),transparent_50%)]"
        />
        <div className="relative max-w-2xl">
          <p className="mb-4 font-heading text-sm font-semibold tracking-[0.2em] text-amber-400 uppercase">
            Gripton
          </p>
          <h1 className="font-heading text-4xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">
            Øv gitar.
            <span className="block text-zinc-400">Rett i nettleseren.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-zinc-400 text-pretty">
            Akkorder med fingring og lyd, karaoke i tempo, sangtransponering,
            tabs og korte leksjoner — laget for praktisk øving på mobil og
            desktop.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/karaoke"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 text-sm font-medium text-zinc-950 transition-colors hover:bg-amber-400"
            >
              Prøv karaoke
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/akkorder"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-zinc-700 bg-transparent px-4 text-sm font-medium text-zinc-100 transition-colors hover:bg-zinc-900"
            >
              Akkordbibliotek
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        {FEATURES.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.href}
              href={feature.href}
              className="group rounded-2xl border border-border/50 bg-card/40 p-6 transition-colors hover:border-amber-500/40 hover:bg-card/70"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 transition-transform group-hover:scale-105">
                <Icon className="size-5" />
              </div>
              <h2 className="font-heading text-xl font-semibold tracking-tight">
                {feature.title}
              </h2>
              <p className="mt-2 text-muted-foreground">{feature.text}</p>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
