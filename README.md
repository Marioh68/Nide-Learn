# Nide Learn

Kirjanpidon oppimisalusta oppilaitoksille ja tilitoimistojen perehdytykseen. Nide Solutions Oy:n tuote.

## Kehitysympäristön käynnistys

Vaatimukset: Node.js 20+, pnpm 11+

```bash
pnpm install
pnpm dev
```

Avaa selaimessa: http://localhost:3000

## Komennot

| Komento | Kuvaus |
|---------|--------|
| `pnpm dev` | Käynnistä kehityspalvelin |
| `pnpm build` | Tuotantobuild |
| `pnpm start` | Käynnistä tuotantopalvelin |
| `pnpm lint` | Aja ESLint |
| `pnpm test` | Aja Vitest-testit |
| `pnpm test:watch` | Testit tarkkailutilassa |

## Tekninen pino

- **Framework:** Next.js 16 + TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **i18n:** next-intl (suomi)
- **Testaus:** Vitest
- **Package manager:** pnpm

## Projektirakenne

```
src/
  app/          — Next.js App Router sivut
  components/   — React-komponentit
    ui/         — shadcn/ui-komponentit
  i18n/         — Lokalisaatiokonfiguraatio
  lib/          — Apufunktiot
  __tests__/    — Yksikkötestit
messages/
  fi.json       — Suomenkieliset käännökset
docs/
  nide-learn-suunnitelma-v1.4.md  — Pääsuunnitelma
  code-iteration-1.md             — Aktiivinen iteraatio
```

## Lisätietoja

Katso `docs/nide-learn-suunnitelma-v1.4.md` tuotteen kokonaissuunnitelmasta ja `CLAUDE.md` kehitysohjeiden käytännöistä.
