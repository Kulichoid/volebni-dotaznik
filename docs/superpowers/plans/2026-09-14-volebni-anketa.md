# Volební anketa Implementation Plan

> **For agentic workers:** Execute inline using superpowers:executing-plans. Steps use checkboxes for tracking.

**Goal:** Vytvořit kompletní responzivní statický web volební ankety a odeslat do GitHubu.

**Architecture:** JSON je jediný zdroj dat. Node.js vygeneruje přístupné HTML, JavaScript rozšíří čtení o filtry a porovnávání. CSS a lokální assety tvoří vzhled.

**Tech Stack:** Node.js 22+, HTML, CSS, vanilla JavaScript, Node test runner, Playwright pouze pro vývojové testy.

**Spec:** ../specs/2026-09-14-volebni-anketa-design.md

## Global Constraints

- Žádné runtime závislosti, databáze ani sledování návštěvníků.
- Otázky a odpovědi lorem ipsum, zřetelný ukázkový stav.
- 12 uskupení ve vylosovaném pořadí, shodná prezentace.
- Bez JavaScriptu jsou odpovědi přístupné.
- Sdílení používá URL a systémové sdílení nebo schránku, bez externích služeb.
- Cloudflare Pages: npm run build, dist.

## 1. Data a statické vykreslení

Files: src/content.json, scripts/render.mjs, scripts/build.mjs, tests/render.test.mjs.

Interface: renderSite(content) vrací úplný HTML dokument. validateContent(content) odmítne duplicitní identifikátory, neznámé odkazy a neúplná data. escapeHtml(text) zachová obsah bezpečně jako text.

- [ ] Napsat testy proti samostatné malé sadě dat: zlé HTML se escapuje, každá strana dostane vlastní odpověď, chybějící odpověď zůstává označená, duplicity a neznámé odkazy selžou.
- [ ] Spustit `node --test tests/render.test.mjs` a ověřit selhání před implementací.
- [ ] Implementovat renderer a generování do dist, kopírovat jen public assety.
- [ ] Spustit testy a sestavení.

## 2. Vzhled, assety a ovládání

Files: public/styles.css, public/app.js, public/assets/*, scripts/dev.mjs, tests/browser.spec.mjs.

Interface: HTML poskytne data-party, data-question, data-view a formulářové prvky. URL parametry view, party, question ukládají výběr. Výchozí režim party a první kandidátní listina.

- [ ] Napsat prohlížečové scénáře pro změnu strany, porovnání, historii a mobilní menu.
- [ ] Doplnit vzhled a lokální assety s evidencí původu v docs/sources.md.
- [ ] Implementovat progresivní ovládání a hash odkazy, ověřit bez JS.
- [ ] Spustit testy na desktopu a mobilu, vizuální kontrola screenshotů při šířkách 390 a 1440 px; ověřit i šířku 320 px a delší text.

## 3. Předání

Files: README.md, public/_headers, public/404.html, package.json, package-lock.json, .gitignore.

- [ ] Popsat přesnou strukturu JSON a chybějící odpovědi, zdroje a nasazení na Pages.
- [ ] Spustit `npm test`, `npm run build`, `npm run test:browser`, `git diff --check`.
- [ ] Zkontrolovat výsledný diff a soubory v dist; commit a push do origin/main, protože vzdálený repozitář nemá žádné větve ani historii.
- [ ] Ověřit vzdálený hash commitu, připravit ZIP a náhled.
