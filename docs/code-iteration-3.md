# Iteraatio 3: Marraskuun loput tositteet + raporttinäkymä

**Aloituspäivä:** 2026-05-13
**Status:** Suunnittelu — odottaa Markon prioriteettien vahvistusta
**Vastuuhenkilö:** Marko + Claude Code
**Edellytykset:** Iteraatio 2 valmis ja mergattu masteriin

---

## Tavoite

_(Täydennetään kun Marko vahvistaa prioriteetit. Alustavat vaihtoehdot alla.)_

---

## Alustavat prioriteettivaihtoehdot

Iteraatio 2:n "Seuraavaksi"-osion ja suunnitelman v1.4 perusteella seuraavat ovat luontevia jatkovaiheita. **Marko valitsee fokuksen.**

### Vaihtoehto A — Raporttinäkymä (tuloslaskelma + tase)
Marraskuun 8 tositteen pohjalta rakennetaan:
- Tuloslaskelma-näkymä (tuotot − kulut = tulos)
- Tase-näkymä (vastaavaa = vastattavaa)
- Opiskelija näkee miten yksittäiset kirjaukset muodostavat lopullisen tilinpäätöksen

Pedagoginen arvo: konkreettinen yhteys kirjausten ja raporttien välillä.

### Vaihtoehto B — Marraskuun loput tositteet (toistuvat tyypit)
Lisätään marraskuun 9–17 tositteet:
- Toistuvat myyntilaskut (vko 2, vko 3, ...)
- Myyntisaamisten kertyminen ja sulkeutuminen
- Joulukuun osakirjaukset

Pedagoginen arvo: oppii tunnistamaan saman tositetyypin eri instanssit.

### Vaihtoehto C — Joulukuun tositteet täysmittaisena
26 tositteen joulukuu, sisältäen:
- Muuttuvat kulut (edelleenveloitettava palvelu)
- Saamisten ja velkojen sulkeutuminen vuodenvaihteessa
- ALV-hakeutumisen kysymyspari (kk 3:n alku)

### Vaihtoehto D — Myyntikatelaskenta
Lisätään Tasoon 1 muuttuvien ja kiinteiden kulujen erottelu:
- 4000-tilin käyttö (muuttuvat kulut, suoraan asiakkaalle)
- Myyntikate = liikevaihto − muuttuvat kulut
- Opiskelija laskee Katin tmi:n myyntikateprosentit

---

## Tekninen esivalmistelu (yhteinen kaikille vaihtoehdoille)

Ennen Iteraatio 3:n varsinaista sisältöä:
1. **PR mergataan masteriin** — Iteraatio 2:n branch `claude/optimistic-curran-7f8e43`
2. **CI vihreäksi** — lint, tyypit, yksikkötestit, E2E
3. **Vercel deploy** — staging-ympäristö käytettäväksi

---

## Avoimet kysymykset Markolle

1. Mikä vaihtoehto (A/B/C/D) on tärkein seuraava askel opetuksen kannalta?
2. Haluatko raporttinäkymän (tuloslaskelma/tase) ennen kuin lisäät lisää tositteita?
3. Onko ALV-hakeutumiselle jo pedagoginen suunnitelma, vai tuleeko se Iteraatio 4:ään?
