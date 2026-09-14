import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderSite, validateContent } from "./render.mjs";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const content = JSON.parse(
  await fs.readFile(path.join(root, "src/content.json"), "utf8"),
);
validateContent(content);
for (const party of content.parties)
  await fs.access(path.join(root, "public/assets/logos", party.logo));
const html = renderSite(content);
const output = path.join(root, "dist");
await fs.mkdir(output, { recursive: true });
await fs.cp(path.join(root, "public"), output, { recursive: true });
await fs.writeFile(path.join(output, "index.html"), html);
console.log(
  `Vytvořeno dist/index.html: ${content.parties.length} uskupení, ${content.questions.length} otázek. Režim: ${content.demo ? "UKÁZKA" : "OSTRÝ OBSAH"}.`,
);
