# Ověření skutečných odpovědí

Provedeno 14. 9. 2026 na Windows, Node.js 24.12.0 a Google Chrome.

- Importováno 28 úplných odpovědí ke 7 otázkám od Pirátů, Prahy 5 Sobě, ODS a SEN pro Prahu 5. Osm dalších uskupení má nedodané odpovědi označené.
- Samostatná kontrola proti e-mailovým podkladům potvrdila přiřazení, úplnost a podpisy. Odstraněny jsou pouze hlavičky, pozdravy, kontaktní údaje a citovaná organizační výzva. Sjednoceno je zalomení.
- `npm test`: 6 úspěšných testů včetně přiřazení, ostrého obsahu, nepřítomnosti výplňových textů a bezpečného zobrazení textu.
- `npm run build`: úspěšné sestavení 12 uskupení a 7 otázek v ostrém režimu.
- Prohlížeč: původních 17 scénářů prošlo, desktopový scénář mobilní nabídky byl úmyslně přeskočen. Dva přidané scénáře skutečných odpovědí také prošly. Celkem 19 úspěšných scénářů.
- Ověřeny přímé odkazy, historie, sdílení, porovnání, akordeony, mobilní nabídka, ovládání klávesnicí, obrázky a čtení bez JavaScriptu.
- Axe WCAG 2.1 A/AA: bez hlášených porušení na kontrolovaném desktopovém a mobilním zobrazení. Automatický audit není úplnou certifikací.
- Vizuálně zkontrolovány skutečné odpovědi při 1440 a 390 px. Testy ověřily nepřetékání i při šířce 320 px.

Testovací server má samostatný port 4175 a vždy čerstvé sestavení. Mobilní testy používají emulaci Chromu, nikoli fyzické zařízení se Safari. Nasazení do Cloudflare nebylo provedeno.
