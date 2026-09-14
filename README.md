# Volební anketa · Barrandov / Praha 5

Responzivní web pro odpovědi kandidujících uskupení v komunálních volbách 2026. Světlá čtecí plocha, tmavá navigace, místní fotografie a dvě možnosti čtení: podle uskupení nebo podle otázky.

**Aktuálně jde o ukázku.** Všech 12 uskupení má šest otázek a odpovědí lorem ipsum. Ukázkové texty nejsou jejich skutečná stanoviska. Pořadí vychází z vylosovaných čísel kandidátek. Původ jmen a grafiky najdete v [přehledu zdrojů](docs/sources.md) a na stránce „Fotografie a loga“.

## Spuštění

Potřebujete Node.js 22 nebo novější. Web nemá žádné produkční závislosti. Není potřeba databáze, backend, API klíč ani účet jiné služby.

```sh
npm run dev
```

Otevřete **http://127.0.0.1:4173**. Příkaz sestaví web a spustí místní server. Po změně dat, stylů nebo skriptů spusťte v druhém terminálu `npm run build` a obnovte stránku. Server neposkytuje automatický reload.

```sh
npm run build     # vytvoří statický web v dist/
npm run preview   # zobrazí již sestavený web
```

Složka `dist/` je výsledný web a nepatří do Gitu. Soubory neotevírejte přes `file://`; absolutní cesty k assetům vyžadují HTTP server a nasazení do kořene domény.

## Doplnění otázek a odpovědí

Veškerá data jsou v **`src/content.json`**. Obsah se při sestavení vloží přímo do HTML, takže odpovědi zůstávají dostupné i bez JavaScriptu. Pro porovnávání není potřeba udržovat druhou kopii dat.

- `parties`: kandidující uskupení. `id` je stálý identifikátor, `number` vylosované číslo, `name` plný název a `shortName` název do navigace. `logo` je název místního souboru ve `public/assets/logos/`, `logoAlt` jeho věcný popis. Pořadí se při sestavení určí podle `number`.
- `questions`: společné otázky. `id` je stálý identifikátor, `topic` krátký název tématu, `text` celé znění otázky. Pořadí v poli určuje pořadí otázek na stránce.
- `answers`: odpovědi přiřazené podle ID uskupení a otázky. Například `answers.pirati.doprava` obsahuje odpověď Pirátů na otázku `doprava`. Každé uskupení má vlastní samostatné hodnoty.
- `demo`: `true` zobrazí oznámení o ukázce, popisky lorem ipsum a značku `noindex` pro vyhledávače. Po nahrazení ukázkových otázek a odpovědí nastavte `false`.

Příklad jedné odpovědi:

```json
{
  "pirati": {
    "doprava": "První odstavec dodané odpovědi.\n\nDruhý odstavec dodané odpovědi.",
    "priroda": null
  }
}
```

`null`, prázdný text nebo chybějící odpověď zobrazí „Odpověď zatím není k dispozici“. Nikdy se automaticky nedoplní ukázkový text ani odpověď jiné strany. Prázdná data tedy mohou bezpečně čekat na dodání. Texty jsou obyčejný text, **ne HTML**; oddělujte odstavce `\n\n`. HTML značky se bezpečně zobrazí jako text.

Při přidání otázky doplňte její odpovědi u jednotlivých uskupení, případně použijte `null`. Při změně identifikátoru otázky či uskupení upravte i odpovídající klíče v `answers`. Identifikátory mohou obsahovat malá písmena bez diakritiky, číslice a pomlčky. Duplicitní ID, duplicitní čísla kandidátek, překlepy v odkazech na otázky a chybějící soubory log zastaví sestavení s vysvětlením.

Copywriting stránky upravíte v `scripts/render.mjs`, vzhled v `public/styles.css` a interakce v `public/app.js`.

## Nasazení na Cloudflare Pages

1. V Cloudflare otevřete **Workers & Pages → Create application → Pages → Import an existing Git repository**.
2. Vyberte repozitář `Kulichoid/volebni-dotaznik`.
3. Nastavte:

| Nastavení              | Hodnota                    |
| ---------------------- | -------------------------- |
| Production branch      | `main`                     |
| Framework preset       | `None`                     |
| Build command          | `npm run build`            |
| Build output directory | `dist`                     |
| Root directory         | kořen repozitáře / prázdné |
| Environment variable   | `NODE_VERSION=22`          |

4. Spusťte nasazení. Každý další push do `main` může Cloudflare automaticky nasadit.

Alternativně nahrajte **obsah složky `dist`** do Pages pomocí Direct Upload. Nestačí nahrát zdrojové `src` nebo `public`: výsledný `index.html` vytváří sestavení.

Soubor `public/_headers` přidává bezpečnostní hlavičky, omezuje skripty a obrázky na vlastní doménu a nastavuje denní cache assetů. Vlastní `404.html` zobrazuje skutečnou chybovou stránku místo přesměrování na neexistující sekce. Načítání webu nevolá weby politických stran ani Google Fonts. Nejsou použité analytické nástroje, cookies ani localStorage.

Web je připravený k nasazení; vytvoření projektu nebo domény v Cloudflare není součástí zdrojového kódu. Postup vychází z [dokumentace Cloudflare Pages pro statické HTML](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/).

## Před zveřejněním skutečných odpovědí

Nahraďte ukázkové otázky a všechny ukázkové odpovědi, případné dosud nedodané odpovědi nastavte na `null`. Potom vypněte `demo`, ověřte sestavení a texty v náhledu. Aktuální seznam uskupení i náhrady koaličních log jsou doložené ve zdrojích. Stránka používá obecné označení ankety; neuvádí smyšleného organizátora, kontakt ani termíny doručení odpovědí. Vlastní kontaktní údaje organizátora lze později doplnit do patičky.

## Testy

```sh
npm ci
npm test
npm run build
npm run test:browser
```

Testy prohlížeče používají nainstalovaný Google Chrome a Playwright. Zahrnují desktop, emulaci telefonu, šířky 320/390 px, navigaci, historii a obnovení výběru, porovnání, akordeony, klávesnici, mobilní dialog, načítání obrázků, čtení bez JavaScriptu a audit WCAG 2.1 A/AA pomocí axe. Emulace telefonu nenahrazuje test na fyzickém iPhonu.

Pro jiný dostupný kanál nastavte `PW_CHANNEL` (například `msedge`). Pro automatizované prostředí lze nainstalovat Chrome pomocí `npx playwright install --with-deps chrome`. Závislosti Playwright a axe jsou pouze vývojové; návštěvníkům webu se neposílají.

## Struktura

```text
src/content.json        otázky, uskupení, odpovědi a ukázkový režim
scripts/render.mjs      validace a generování přístupného HTML
scripts/build.mjs       sestavení do dist
scripts/dev.mjs         lokální HTTP server
public/app.js           přepínání, porovnávání, sdílení, historie a menu
public/styles.css       responzivní vzhled
public/assets/          místní loga, fotografie, písma a licence
public/_headers         hlavičky pro Cloudflare Pages
public/404.html         stránka nenalezena
public/zdroje.html      veřejné zdroje a licence
tests/                  testy dat a prohlížeče
docs/                   zdroje a schválený návrh
```

Vzhled vychází z dodané reference v `docs/reference/layout.jpeg`. Použitá fotografie je skutečné Prokopské údolí s uvedenou licencí. Loga politických uskupení a fotografie mají vlastní podmínky použití uvedené ve zdrojích; nejde o obecně přelicencované značky.
