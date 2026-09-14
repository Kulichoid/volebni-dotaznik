export function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
}

export function validateContent(data) {
  const fail = (message) => {
    throw new Error(`Chyba obsahu: ${message}`);
  };
  if (typeof data.demo !== "boolean" || !Number.isInteger(data.year))
    fail("demo musí být boolean a year celé číslo.");
  for (const key of ["parties", "questions"]) {
    if (!Array.isArray(data[key]) || !data[key].length)
      fail(`${key} nesmí být prázdné.`);
    const ids = new Set();
    for (const item of data[key]) {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id))
        fail(`Neplatný identifikátor v ${key}.`);
      if (ids.has(item.id)) fail(`Duplicitní identifikátor ${item.id}.`);
      ids.add(item.id);
      for (const field of key === "parties"
        ? ["name", "shortName", "logo", "logoAlt"]
        : ["topic", "text"]) {
        if (typeof item[field] !== "string" || !item[field].trim())
          fail(`Chybí ${field} u ${item.id}.`);
      }
    }
  }
  const numbers = new Set();
  for (const party of data.parties) {
    if (
      !Number.isInteger(party.number) ||
      party.number < 1 ||
      numbers.has(party.number)
    )
      fail("Neplatné nebo duplicitní číslo kandidátky.");
    numbers.add(party.number);
    if (!/^[a-z0-9-]+\.(svg|png|webp|jpg)$/.test(party.logo))
      fail(`Logo ${party.id} musí být místní soubor.`);
  }
  if (
    !data.answers ||
    typeof data.answers !== "object" ||
    Array.isArray(data.answers)
  )
    fail("Chybí objekt answers.");
  const partyIds = new Set(data.parties.map((p) => p.id));
  const questionIds = new Set(data.questions.map((q) => q.id));
  for (const [partyId, answers] of Object.entries(data.answers)) {
    if (!partyIds.has(partyId)) fail(`Neznámé uskupení ${partyId}.`);
    if (!answers || typeof answers !== "object" || Array.isArray(answers))
      fail(`Neplatné odpovědi ${partyId}.`);
    for (const [questionId, answer] of Object.entries(answers)) {
      if (!questionIds.has(questionId)) fail(`Neznámá otázka ${questionId}.`);
      if (answer !== null && typeof answer !== "string")
        fail(`Odpověď ${partyId}/${questionId} musí být text nebo null.`);
    }
  }
}

const paths = {
  arrow: "M4 12h16m-6-6 6 6-6 6",
  chevron: "m9 5 7 7-7 7",
  plus: "M12 5v14M5 12h14",
  share: "M12 16V3m-5 5 5-5 5 5M5 13v7h14v-7",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "m6 6 12 12M6 18 18 6",
  pin: "M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0ZM12 7v5M9.5 9.5h5",
  leaf: "M20 4C7 2 2 9 6 16c7 4 14-1 14-12ZM4 20 16 8",
  building: "M4 21V8l8-5 8 5v13M9 21v-5h6v5M8 9h1m6 0h1M8 12h1m6 0h1M2 21h20",
  chat: "M4 4h16v12H9l-5 5V4ZM8 8h8M8 12h5",
  check: "m5 12 4 4L19 6",
  info: "M12 11v6m0-10v1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
};
export function icon(name) {
  return `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="${paths[name]}"/></svg>`;
}

function logo(party) {
  return `<span class="party-logo"><img src="/assets/logos/${party.logo}" alt="${escapeHtml(party.logoAlt)}" width="100" height="64" loading="lazy"></span>`;
}
function navLink(party) {
  return `<a class="party-link" href="#strana-${party.id}" data-party-link="${party.id}"><span class="nav-number">${String(party.number).padStart(2, "0")}</span>${logo(party)}<span>${escapeHtml(party.shortName)}</span>${icon("chevron")}</a>`;
}
function answerHtml(answer, demo) {
  if (!answer?.trim())
    return `<p class="missing-answer">Odpověď zatím není k dispozici.</p><p>Jakmile ji doplníme, najdete ji na tomto místě.</p>`;
  return `${demo ? '<span class="sample-label">Ukázková odpověď · lorem ipsum</span>' : ""}${answer
    .split(/\n\s*\n/)
    .map((p) => `<p>${escapeHtml(p).replaceAll("\n", "<br>")}</p>`)
    .join("")}`;
}

export function renderSite(data) {
  validateContent(data);
  const { demo, year, questions, answers } = data;
  const parties = [...data.parties].sort((a, b) => a.number - b.number);
  const e = escapeHtml;
  const sections = parties
    .map(
      (
        p,
      ) => `<section class="party-section" id="strana-${p.id}" data-party-section="${p.id}" aria-labelledby="title-${p.id}">
    <header class="party-heading">${logo(p)}<div><span class="eyebrow">Kandidátní listina č. ${p.number}</span><h3 id="title-${p.id}">${e(p.name)}</h3></div><span class="content-badge">${demo ? "Ukázka odpovědí" : `${questions.filter((q) => answers[p.id]?.[q.id]?.trim()).length} / ${questions.length} odpovědí`}</span></header>
    <div class="question-list">${questions
      .map(
        (
          q,
          index,
        ) => `<details class="question" id="${p.id}-${q.id}" data-question="${q.id}" ${index === 0 ? "open" : ""}>
      <summary><span class="question-number">${String(index + 1).padStart(2, "0")}</span><span class="question-title"><span class="topic-label">${e(q.topic)}</span><span>${e(q.text)}</span></span><span class="expand-icon">${icon("plus")}</span></summary>
      <div class="answer-body">${answerHtml(answers[p.id]?.[q.id], demo)}</div>
    </details>`,
      )
      .join("")}</div>
  </section>`,
    )
    .join("");
  return `<!doctype html>
<html lang="cs">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Praha 5. Naše otázky. Jejich odpovědi. | Volební anketa ${year}</title>
  <meta name="description" content="Volební anketa Barrandov · Praha 5. Otázky pro kandidující uskupení o místě, kde žijeme. Čtěte odpovědi podle strany nebo porovnávejte stejnou otázku.${demo ? " Ukázková verze s ilustračním obsahem." : ""}">
  ${demo ? '<meta name="robots" content="noindex, follow">' : ""}
  <meta name="theme-color" content="#172b2c"><meta property="og:type" content="website"><meta property="og:locale" content="cs_CZ">
  <meta property="og:title" content="Praha 5. Naše otázky. Jejich odpovědi."><meta property="og:description" content="Volební anketa Barrandov · Praha 5.${demo ? " Ukázková verze." : " Prostor pro otázky, které se nás týkají."}">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="preload" href="/assets/manrope-regular.ttf" as="font" type="font/ttf" crossorigin>
  <link rel="stylesheet" href="/styles.css"><script type="module" src="/app.js"></script>
</head>
<body>
  <a class="skip-link" href="#odpovedi">Přejít k odpovědím</a>
  <aside class="sidebar" aria-label="Hlavní navigace">
    <a class="brand" href="#uvod" aria-label="Barrandov Praha 5 – úvod"><img src="/assets/brand.svg" width="76" height="60" alt=""><span>BARRANDOV<span>PRAHA 5</span></span></a>
    <div class="sidebar-intro"><span class="eyebrow">Komunální volby ${year}</span><p>Prostor pro vaše otázky.</p></div>
    <nav class="party-nav" aria-label="Kandidující uskupení"><div class="nav-caption">VYBERTE USKUPENÍ <span>${parties.length}</span></div>${parties.map(navLink).join("")}</nav>
    <div class="sidebar-bottom"><a href="#o-ankete">O anketě ${icon("arrow")}</a><p>Náš domov si zaslouží odpovědi.</p><span>BARRANDOV · PRAHA 5</span></div>
  </aside>
  <header class="mobile-header"><a href="#uvod" class="mobile-brand"><img src="/assets/brand.svg" width="44" height="36" alt=""><span>BARRANDOV <small>PRAHA 5 · VOLEBNÍ ANKETA</small></span></a><button class="menu-button enhanced-only" id="open-menu" aria-label="Vybrat uskupení" aria-haspopup="dialog">${icon("menu")}</button><a class="no-js-menu" href="#odpovedi">Odpovědi ↓</a></header>
  <dialog id="party-menu" aria-labelledby="menu-title"><div class="dialog-heading"><h2 id="menu-title">Vyberte uskupení</h2><button id="close-menu" class="icon-button" aria-label="Zavřít nabídku">${icon("close")}</button></div><p class="dialog-note">Řazeno podle čísla kandidátní listiny.</p><nav aria-label="Uskupení v mobilní nabídce">${parties.map(navLink).join("")}</nav><a class="dialog-about" href="#o-ankete">O anketě ${icon("arrow")}</a></dialog>
  <main id="uvod">
    <div class="topbar"><span>VOLEBNÍ ANKETA <span class="topbar-separator">/</span> ${year}</span><a href="https://www.praha5.cz/volby-2026/" class="election-date"><span class="status-dot"></span>Komunální volby · 9.–10. října ${year} ${icon("arrow")}</a></div>
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-photo"><img src="/assets/prokopske-udoli.jpg" alt="Pohled přes zelené svahy Prokopského údolí v Praze 5" width="1920" height="1280" fetchpriority="high"><span class="photo-location">${icon("pin")} Prokopské údolí, Praha 5</span><div class="photo-motto">Místo, kterému<br>říkáme doma.</div></div>
      <div class="hero-content"><span class="eyebrow hero-eyebrow"><span></span> BARRANDOV · PRAHA 5</span><h1 id="hero-title">Praha 5.<br>Naše otázky.<br><em>Jejich odpovědi.</em></h1><p class="hero-description">Jak se bude žít v naší čtvrti?<br>Prostor pro odpovědi kandidujících uskupení na otázky, které se týkají nás všech.</p><a class="button button-gold" href="#odpovedi">Prohlédnout odpovědi ${icon("arrow")}</a><p class="hero-footnote">Stejné otázky. Prostor pro každé uskupení.</p></div>
    </section>
    <div class="context-strip"><div>${icon("leaf")}<span>Příroda.<small>Kterou máme za rohem.</small></span></div><div>${icon("building")}<span>Lidé.<small>Se kterými tvoříme čtvrť.</small></span></div><div>${icon("chat")}<span>Budoucnost.<small>O které má smysl mluvit.</small></span></div></div>
    <section class="answers-section content-width" id="odpovedi" aria-labelledby="answers-title" tabindex="-1">
      <div class="section-heading"><div><span class="eyebrow">POZNEJTE JEJICH POHLED</span><h2 id="answers-title">Odpovědi bez zkratek.</h2></div><div class="section-count"><strong>${parties.length}</strong> uskupení <span>·</span> <strong>${questions.length}</strong> otázek</div></div>
      <p class="section-description">Vyberte si uskupení a projděte jeho odpovědi. Nebo se podívejte, jak na jednu otázku odpovídají ostatní.</p>
      ${demo ? `<div class="demo-notice" role="note">${icon("info")}<p><strong>Ukázková verze</strong><span>Otázky a odpovědi zatím obsahují lorem ipsum. Nejde o skutečná stanoviska uskupení. Obsah ankety doplníme později.</span></p><span class="demo-tag">PŘIPRAVUJEME</span></div>` : ""}
      <div class="reader-controls enhanced-only"><div class="view-switch" role="group" aria-label="Způsob čtení"><button type="button" data-view="party" aria-pressed="true">${icon("building")}Podle uskupení</button><button type="button" data-view="question" aria-pressed="false">${icon("chat")}Podle otázky</button></div><button class="text-button" id="share-selection">${icon("share")}<span>Sdílet výběr</span></button></div>
      <div class="share-fallback" id="share-fallback" hidden><label for="share-url">Zkopírujte odkaz na tento výběr</label><input id="share-url" type="text" readonly><button class="text-button" id="close-share">Zavřít</button></div><p id="status-message" class="status-message" role="status" aria-live="polite"></p>
      <div class="selection-bar enhanced-only"><div class="field" id="party-field"><label for="party-select">Vyberte uskupení</label><select id="party-select">${parties.map((p) => `<option value="${p.id}">${p.number}. ${e(p.shortName)}</option>`).join("")}</select></div><div class="field" id="question-field" hidden><label for="question-select">Vyberte otázku</label><select id="question-select">${questions.map((q, i) => `<option value="${q.id}">${String(i + 1).padStart(2, "0")} · ${e(q.topic)}</option>`).join("")}</select></div><button class="text-button expand-all" id="expand-all">${icon("plus")}<span>Rozbalit vše</span></button><span id="comparison-hint" hidden>Stejná otázka. Všechna uskupení.</span></div>
      <div id="party-reader">${sections}</div>
      <section id="comparison-reader" aria-labelledby="comparison-title" hidden><div class="comparison-question"><span class="eyebrow" id="comparison-topic"></span><h3 id="comparison-title"></h3></div><div id="comparison-list"></div></section>
      <p class="order-note">${icon("info")}Uskupení jsou řazena podle vylosovaného čísla kandidátní listiny. Pořadí není hodnocením.</p>
    </section>
    <section class="about-section content-width" id="o-ankete" aria-labelledby="about-title"><div class="about-intro"><span class="eyebrow">NÁŠ DOMOV. SPOLEČNÁ BUDOUCNOST.</span><h2 id="about-title">Než se rozhodnete,<br>ptejte se.</h2><p>Barrandov, Hlubočepy, Smíchov, Košíře, Radlice i Jinonice. Různá místa, jeden společný zájem: dobře žít v Praze 5.</p><a class="text-link" href="#odpovedi">Zpátky k odpovědím ${icon("arrow")}</a></div><div class="about-points"><article><span>01</span><div><h3>Stejný prostor pro všechny</h3><p>Jednotné otázky a stejné podmínky pro prezentaci každého kandidujícího uskupení.</p></div></article><article><span>02</span><div><h3>Vlastní názor je na vás</h3><p>Anketa nesestavuje žebříček ani nedoporučuje, koho volit. Pomáhá číst a porovnávat odpovědi.</p></div></article><article><span>03</span><div><h3>Jasně označený obsah</h3><p>${demo ? "Nyní si prohlížíte ukázku. Skutečné otázky a dodané odpovědi zde zveřejníme později." : "Chybějící odpovědi jsou označené. Najdete tu pouze texty, které byly do ankety doplněné."}</p></div></article></div></section>
    <footer class="footer content-width"><div><a href="#uvod" class="footer-brand">BARRANDOV <span>·</span> PRAHA 5</a><p>Naše místo. Naše budoucnost.</p></div><div class="footer-links"><a href="#o-ankete">O anketě</a><a href="https://www.novinky.cz/p/vysledky-voleb/2026/komunalni-volby/obvod/500143-praha-5/kandidati">Zdroj kandidátních listin ${icon("arrow")}</a><a href="/zdroje.html">Fotografie a loga</a></div><p class="footer-note">Občanská volební anketa · ${year}. Nejde o oficiální web městské části.<br>Bez reklam a sledovacích cookies.</p></footer>
  </main>
</body></html>`;
}
