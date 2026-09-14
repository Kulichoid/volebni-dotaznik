# Ověření verze 1.0

Provedeno 14. 9. 2026 na Windows, Node.js 24.12.0 a Google Chrome.

- `npm test`: 5 úspěšných testů. Ověřeno přiřazení odpovědí, chybějící obsah, escapování HTML, ukázkový stav a odmítnutí chybných dat.
- `npm run build`: úspěšné sestavení, 12 uskupení a 6 otázek, ukázkový režim.
- `npm run test:browser -- --workers 2`: 17 úspěšných testů; 1 úmyslně vynechaný scénář mobilní nabídky na desktopu. Tentýž scénář na mobilu prošel.
- Testy prohlížeče zahrnují přepínání stran, porovnání podle otázky, historii a reload, přímé odkazy, bezpečný výchozí stav neznámého URL, rozbalení/sbalení, Enter, mobilní dialog a Escape, fallback sdílení při zamítnutí schránky, obsah bez JavaScriptu a načtení všech log.
- Axe WCAG 2.1 A/AA: bez hlášených porušení na kontrolovaném desktopovém i mobilním zobrazení. Automatický audit není úplnou certifikací přístupnosti.
- Vizuálně zkontrolován desktop 1440 px, telefon 390 px a dlouhá koaliční jména. Testem ověřeno nepřetékání při 320 a 390 px; samostatná regrese chrání šířku hlavičky strany.
- Provedena samostatná read-only kontrola kódu. Bez blokujících nálezů; poznámka k opětovnému sestavení po změně souborů je zohledněna v README.

Omezení: mobilní testy běží v emulovaném viewportu a dotykovém profilu Chromu, nikoli na fyzickém zařízení se Safari. Cloudflare projekt ani doména v rámci této verze nebyly vytvářeny. Odesílaný web stále obsahuje výslovně označené ukázkové otázky a odpovědi.
