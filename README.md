# Gripton — lær gitar

Moderne, responsiv gitarlæring bygget med Next.js (App Router), TypeScript, Tailwind CSS og shadcn/ui. Alt kjører klient-side.

## Funksjoner

- **Akkordbibliotek** — open, barre og power chords med SVG-diagram, fingring og Web Audio-avspilling
- **Transponer sang** — lim inn `[Am]tekst`-format, flytt i halvtoner, lagre i `localStorage`
- **Tabs** — ASCII-øvelser og genererte tabs fra progresjoner
- **Øvelser** — leksjoner, I–V–vi–IV m.m., metronom

## Kom i gang

```bash
npm install
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000).

## Struktur

```
src/
  app/                 # App Router-sider
  components/
    chords/            # Diagram, kort, bibliotek
    transpose/         # Sangeditor
    tabs/              # Tab-visning
    practice/          # Leksjoner + metronom
    layout/            # Skall / navigasjon
  lib/
    chords/            # Data, transpose, audio, fingring
    tabs/              # Tab-øvelser
    practice/          # Leksjoner og progresjoner
    storage.ts         # localStorage-hjelpere
```

## Scripts

- `npm run dev` — utviklingsserver
- `npm run build` — produksjonsbygg
- `npm run start` — start produksjonsserver
- `npm run lint` — ESLint
