import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { renderSite, validateContent } from "../scripts/render.mjs";

function fixture() {
  return {
    demo: false,
    year: 2026,
    parties: [
      {
        id: "alfa",
        number: 1,
        name: "Alfa & Beta",
        shortName: "Alfa",
        logo: "alfa.svg",
        logoAlt: "Alfa",
      },
      {
        id: "beta",
        number: 2,
        name: "Beta",
        shortName: "Beta",
        logo: "beta.svg",
        logoAlt: "Beta",
      },
    ],
    questions: [
      { id: "doprava", topic: "Doprava", text: "Jak <bezpečně> cestovat?" },
    ],
    answers: {
      alfa: { doprava: "Odpověď A <script>alert(1)</script>" },
      beta: { doprava: null },
    },
  };
}

test("answers remain assigned to their parties and missing answers are not invented", () => {
  const html = renderSite(fixture());
  assert.match(html, /Odpověď A &lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.doesNotMatch(html, /<script>alert/);
  assert.match(html, /zatím na zaslané dotazy neodpovědělo/);
  assert.match(html, /Alfa &amp; Beta/);
  assert.match(html, /Jak &lt;bezpečně&gt; cestovat\?/);
});

test("production build refuses demo mode", () => {
  const data = fixture();
  assert.doesNotMatch(renderSite(data), /Ukázková verze/);
  data.demo = true;
  assert.throws(() => renderSite(data), /ostrý obsah/);
});

test("published questionnaire contains seven questions and exactly four respondents", () => {
  const data = JSON.parse(readFileSync(new URL('../src/content.json', import.meta.url), 'utf8'));
  assert.equal(data.questions.length, 7);
  assert.deepEqual(Object.keys(data.answers).filter(id => Object.values(data.answers[id]).some(Boolean)).sort(), ['ods', 'pirati', 'praha-5-sobe', 'sen']);
  for (const id of ['ods', 'pirati', 'praha-5-sobe', 'sen']) {
    assert.equal(Object.values(data.answers[id]).filter(Boolean).length, 7);
  }
  assert.match(data.answers.pirati['zakladni-skoly'], /Děti nejsou tombola/);
  assert.match(data.answers.sen.priority, /Zřídíme mobilní policejní strážnici/);
  assert.match(data.answers.ods.priority, /Důstojné zázemí pro seniory/);
  assert.match(data.answers['praha-5-sobe'].priority, /Výstavba nové ZŠ a MŠ Barrandov/);
  const html = renderSite(data);
  assert.doesNotMatch(html, /lorem|ipsum|ukázkov|Dne so|@gmail|@prahasobe|Prosím o zaslání odpovědí/i);
  assert.match(html, /odpovědi od 4 uskupení/);
});

test("duplicate party IDs cannot silently overwrite answers", () => {
  const data = fixture();
  data.parties[1].id = "alfa";
  assert.throws(() => validateContent(data), /duplicit/i);
});

test("unknown question references fail the build instead of hiding supplied answers", () => {
  const data = fixture();
  data.answers.alfa.typo = "Ztracená odpověď";
  assert.throws(() => validateContent(data), /neznám/i);
});

test("unsafe identifiers and nonlocal logo paths are rejected", () => {
  const data = fixture();
  data.parties[0].id = 'a" onclick="alert(1)';
  assert.throws(() => validateContent(data));
  const other = fixture();
  other.parties[0].logo = "https://third-party.example/logo.svg";
  assert.throws(() => validateContent(other));
});
