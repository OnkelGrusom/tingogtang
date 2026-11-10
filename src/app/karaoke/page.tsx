import type { Metadata } from "next";
import { KaraokePlayer } from "@/components/karaoke/karaoke-player";

export const metadata: Metadata = {
  title: "Karaoke",
  description:
    "Spill sangtekst og akkorder i tempo med live grep-diagram og regulerbar BPM.",
};

export default function KaraokePage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Karaoke-øving
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Tekst og akkorder ruller i tempo. Se grepet for akkorden som spilles
          nå — og den neste — mens du følger sangen. Juster BPM, slag per
          akkord og toneart etter behov.
        </p>
      </header>
      <KaraokePlayer />
    </div>
  );
}
