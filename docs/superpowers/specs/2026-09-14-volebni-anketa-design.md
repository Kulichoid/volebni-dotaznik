# Volební anketa Barrandov · Praha 5

Návrh schválen uživatelem 14. 9. 2026. Cílem je rychlý, čitelný a neutrální přehled odpovědí kandidujících uskupení pro komunální volby v Praze 5 v roce 2026.

## Vzhled a chování

Tmavý pevný boční panel, krémová hlavní plocha, tlumená zlatá, výrazná patková typografie a fotografie Prokopského údolí. Vychází z dodaného obrázku, který slouží jako reference, nikoli jako samotná webová stránka. Na mobilu kompaktní záhlaví, dostupné menu a jednosloupcový obsah. Stejná plocha pro loga a řazení podle vylosovaného čísla poskytují všem uskupením stejné podmínky.

Úvod vede k odpovědím. Čtenář může číst jednu stranu nebo srovnat všechny strany u stejné otázky. Otázky a odpovědi jsou lorem ipsum, výslovně označené jako ukázka. Názvy témat a ostatní copy jsou česky. Rozbalovací odpovědi, sdílitelný výběr v URL, funkční historie prohlížeče, ovládání klávesnicí, viditelný fokus a redukované animace. Bez JavaScriptu zůstávají dostupné všechny odpovědi.

## Technologie a data

HTML, CSS a malý JavaScript bez runtime knihoven. JSON s uskupeními, otázkami, odpověďmi a stavem obsahu. Malý sestavovací skript používá pouze vestavěné Node.js API a vygeneruje statické HTML do dist. Lokální obrázky a písma, bez externích požadavků návštěvníka. Cloudflare Pages: npm run build, výstup dist. Vývojový server lokálně na 127.0.0.1. Node.js 22 nebo novější.

## Obsah a zdroje

12 kandidátních listin podle přehledu Novinky.cz / ČSÚ, ověřeno 14. 9. 2026. Zdroje jmen, log a fotografie budou uvedené v docs/sources.md. Neověřené grafické značky nelze vydávat za oficiální logo; případná textová náhrada bude popsaná. Neuvádět fiktivní termíny doručení, autory, organizátory, odpovědi ani volební doporučení. Reálné odpovědi se vkládají samostatně pro každou stranu; chybějící odpověď se zobrazí jako nedodaná, nikdy se nenahradí ukázkou.

## Ověření a předání

Testovat sestavení, validaci dat, zachování obsahu bez JS, přepnutí strany i otázky, historii, sdílení a menu. Vizuálně zkontrolovat telefon i desktop, bez vodorovného přetékání, včetně dlouhých názvů. Dokumentovat doplnění obsahu a Cloudflare Pages. Commitnout a pushnout do zadaného repozitáře bez přepisování existující historie.

## Umístění

Vývoj a ověření proběhly v oddělené pracovní kopii. Finální projekt je určen do uživatelem zadaného D:/Dev/volebni-dotaznik a do repozitáře Kulichoid/volebni-dotaznik. Původní referenční obrázek zůstává nedotčený; jeho kopie je v docs/reference/layout.jpeg.
