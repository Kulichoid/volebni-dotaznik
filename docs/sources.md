# Zdroje obsahu a assetů

Ověřeno 14. 9. 2026. Podklady se načítají pouze při přípravě projektu; prohlížeč návštěvníka používá místní soubory.

## Kandidátní listiny a termín

- [Novinky.cz, kandidáti Praha 5, komunální volby 2026](https://www.novinky.cz/p/vysledky-voleb/2026/komunalni-volby/obvod/500143-praha-5/kandidati), stránka uvádí jako zdroj ČSÚ. Převzatá jsou jména 12 kandidátních listin a jejich vylosované pořadí, nikoli osobní údaje kandidátů nebo jejich politický program.
- [Praha 5, Volby 2026](https://www.praha5.cz/volby-2026/), termín 9. a 10. října 2026.

Otázky a 28 odpovědí pocházejí z e-mailových podkladů dodaných organizátorkou ankety Terezou Vránovou. Odpověděli Piráti (Lenka Sobotková), Praha 5 Sobě (Radka Šimková, Lucie Boudová a tým), ODS a SEN pro Prahu 5. Ostatních osm uskupení zatím neodpovědělo. Znění odpovědí je zachováno, upraveno pouze zalomení; vynechány jsou e-mailové hlavičky, pozdravy, kontaktní adresy a citovaná výzva. Původní neveřejný soubor se nepublikuje.

## Loga

| Soubor          | Zdroj                                                                                                                               | Poznámka                                                                                                                                               |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `spd.svg`       | [Wikimedia Commons](<https://commons.wikimedia.org/wiki/File:Svoboda_a_p%C5%99%C3%ADm%C3%A1_demokracie_-_simple_(Czech,_2015).svg>) | Česká SPD, jednoduchá verze loga; metadata public domain.                                                                                              |
| `top.svg`       | [TOP 09](https://www.top09.cz/styles/assets/svg/logo.svg)                                                                           | Logo člena koalice TOP Lidovci a Nezávislí, nikoli tvrzení o společném logu koalice.                                                                   |
| `ano.svg`       | [ANO](https://fe.anobudelip.cz/img/logo-ano.svg)                                                                                    | Oficiální web.                                                                                                                                         |
| `sobe.svg`      | [Praha 5 Sobě](https://www.p5sobe.cz/images/logo-2026.svg)                                                                          | Místní logo 2026.                                                                                                                                      |
| `ods.jpg`       | [ODS](https://www.ods.cz/img/logo/ods-logo-plna-barva.jpg)                                                                          | Barevná varianta pro světlé pozadí.                                                                                                                    |
| `motoriste.png` | [Motoristé sobě](https://motoristesobe.cz/wp-content/uploads/Motoriste_logo_dark.png)                                               | Logo člena koalice Motoristé sobě a Svobodní.                                                                                                          |
| `nase.png`      | [Hnutí Naše Praha](https://hnutinasepraha.cz/wp-content/uploads/2026/06/HNP5-Logo-Leve.png)                                         | Místní značka Naše Praha 5.                                                                                                                            |
| `pirati.svg`    | [Piráti](https://www.pirati.cz/static/styleguide2/images/logo-full-black.svg)                                                       | Oficiální černá varianta.                                                                                                                              |
| `csa.png`       | [Česká strana asociálů](https://www.asocialove.cz/favicon.png)                                                                      | Grafická značka webu strany.                                                                                                                           |
| `rezidenti.svg` | [REZIDENTI 5P](https://rezidenti5p.cz/)                                                                                             | Vlastní SVG přepis textové značky „5P pro Rezidenty Prahy 5“ ze záhlaví webu, použitá jeho zelená #145c3a. Není předstíraný oficiální grafický soubor. |
| `stan.svg`      | [STAN](https://www.starostove.cz/files/logo-stan-pink.svg)                                                                          | Oficiální růžová varianta.                                                                                                                             |
| `sen.svg`       | [SEN pro Prahu 5](https://praha5.senprocesko.cz/)                                                                                   | Převzaté vložené SVG ze záhlaví, značka SEN se srdcem.                                                                                                 |

Loga jsou použita pro identifikaci politických subjektů, bez tvrzení o podpoře nebo spoluautorství. Práva ke značkám zůstávají jejich vlastníkům. Dostupnost souboru na oficiálním webu sama o sobě není prohlášením otevřené licence. Oficiální společné logo koalic lze vyměnit v JSON bez změny rozhraní; alternativní popisy výslovně říkají, kdy je použito logo člena koalice.

## Fotografie

`public/assets/prokopske-udoli.jpg`: [Praha, Jinonice, pohled do Prokopského údolí III.JPG](https://commons.wikimedia.org/wiki/File:Praha,_Jinonice,_pohled_do_Prokopsk%C3%A9ho_%C3%BAdol%C3%AD_III.JPG), autor Aktron / Wikimedia Commons. Zvolena licence [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). Použita existující zmenšená verze Commons. CSS provádí ořez podle viewportu, tlumí sytost a překrývá ji přechodem; úprava fotografie zachovává CC BY-SA 3.0. Veřejné uvedení autora a licence je na `zdroje.html`, dostupném z patičky.

`docs/reference/layout.jpeg`: uživatelem dodaný WhatsApp obrázek, použitý pouze jako návrhová reference; není publikován do dist a neprohlašuje se za vlastní dílo.

## Písma a vlastní grafika

- Manrope, Mikhail Sharanda, [Google Fonts](https://fonts.google.com/specimen/Manrope), SIL Open Font License 1.1. Lokální soubory pravidelné a tučné varianty včetně latinky s českou diakritikou; licence v `public/assets/OFL-Manrope.txt`.
- Georgia je systémové písmo, jeho binární soubory nejsou distribuovány.
- `brand.svg`, `favicon.svg` a jednoduché ikony rozhraní jsou vlastní kresby pro tento web. Značka v záhlaví není oficiálním znakem či logem městské části.
