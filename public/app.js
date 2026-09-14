const $ = (selector) => document.querySelector(selector);
const sections = [...document.querySelectorAll("[data-party-section]")];
const partySelect = $("#party-select");
const questionSelect = $("#question-select");
const viewButtons = [...document.querySelectorAll("[data-view]")];
const menu = $("#party-menu");
const openMenu = $("#open-menu");
const status = $("#status-message");
const partyIds = sections.map((section) => section.dataset.partySection);
const questionIds = [...questionSelect.options].map((option) => option.value);
let state;

function readState() {
  const url = new URL(location.href);
  const anchorParty = url.hash.startsWith("#strana-")
    ? url.hash.slice(8)
    : null;
  const party = anchorParty || url.searchParams.get("party");
  const question = url.searchParams.get("question");
  return {
    view: anchorParty
      ? "party"
      : url.searchParams.get("view") === "question"
        ? "question"
        : "party",
    party: partyIds.includes(party) ? party : partyIds[0],
    question: questionIds.includes(question) ? question : questionIds[0],
  };
}

function selectionUrl() {
  const url = new URL(location.href);
  url.searchParams.set("view", state.view);
  url.searchParams.set("party", state.party);
  if (state.view === "question")
    url.searchParams.set("question", state.question);
  else url.searchParams.delete("question");
  url.hash = "odpovedi";
  return url;
}

function renderComparison() {
  const selected = sections[0].querySelector(
    `[data-question="${state.question}"]`,
  );
  $("#comparison-topic").textContent =
    selected.querySelector(".topic-label").textContent;
  $("#comparison-title").textContent = selected.querySelector(
    ".question-title > span:last-child",
  ).textContent;
  const fragment = document.createDocumentFragment();
  for (const section of sections) {
    const card = document.createElement("article");
    card.className = "comparison-card";
    const header = document.createElement("header");
    header.append(section.querySelector(".party-logo").cloneNode(true));
    const heading = document.createElement("div");
    heading.append(
      section.querySelector(".party-heading .eyebrow").cloneNode(true),
    );
    const title = document.createElement("h4");
    title.textContent = section.querySelector("h3").textContent;
    heading.append(title);
    header.append(heading);
    const answer = section
      .querySelector(`[data-question="${state.question}"] .answer-body`)
      .cloneNode(true);
    card.append(header, answer);
    fragment.append(card);
  }
  $("#comparison-list").replaceChildren(fragment);
}

function updateExpandButton() {
  const details = [
    ...$(`[data-party-section="${state.party}"]`).querySelectorAll("details"),
  ];
  $("#expand-all span").textContent = details.every((detail) => detail.open)
    ? "Sbalit vše"
    : "Rozbalit vše";
}

function render() {
  const comparison = state.view === "question";
  partySelect.value = state.party;
  questionSelect.value = state.question;
  $("#party-reader").hidden = comparison;
  $("#comparison-reader").hidden = !comparison;
  $("#party-field").hidden = comparison;
  $("#question-field").hidden = !comparison;
  $("#expand-all").hidden = comparison;
  $("#comparison-hint").hidden = !comparison;
  $("#share-fallback").hidden = true;
  status.textContent = "";
  for (const section of sections)
    section.hidden = section.dataset.partySection !== state.party;
  for (const button of viewButtons)
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.view === state.view),
    );
  for (const link of document.querySelectorAll("[data-party-link]")) {
    if (!comparison && link.dataset.partyLink === state.party)
      link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  }
  if (comparison) renderComparison();
  updateExpandButton();
}

function choose(changes, moveToAnswers = false) {
  state = { ...state, ...changes };
  const nextUrl = selectionUrl();
  if (nextUrl.href !== location.href) history.pushState(null, "", nextUrl);
  render();
  if (moveToAnswers) {
    $("#odpovedi").focus({ preventScroll: true });
    $("#odpovedi").scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
}

partySelect.addEventListener("change", () =>
  choose({ party: partySelect.value }),
);
questionSelect.addEventListener("change", () =>
  choose({ question: questionSelect.value }),
);
viewButtons.forEach((button) =>
  button.addEventListener("click", () => choose({ view: button.dataset.view })),
);
document.querySelectorAll("[data-party-link]").forEach((link) =>
  link.addEventListener("click", (event) => {
    if (
      event.button ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    event.preventDefault();
    if (menu.open) menu.close();
    choose({ party: link.dataset.partyLink, view: "party" }, true);
  }),
);

$("#expand-all").addEventListener("click", () => {
  const details = [
    ...$(`[data-party-section="${state.party}"]`).querySelectorAll("details"),
  ];
  const shouldOpen = !details.every((detail) => detail.open);
  details.forEach((detail) => {
    detail.open = shouldOpen;
  });
  updateExpandButton();
});
sections.forEach((section) =>
  section.querySelectorAll("details").forEach((detail) =>
    detail.addEventListener("toggle", () => {
      if (section.dataset.partySection === state.party) updateExpandButton();
    }),
  ),
);

openMenu.addEventListener("click", () => menu.showModal());
$("#close-menu").addEventListener("click", () => menu.close());
menu.addEventListener("click", (event) => {
  if (event.target !== menu) return;
  const bounds = menu.getBoundingClientRect();
  if (
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom
  )
    menu.close();
});
$(".dialog-about").addEventListener("click", () => menu.close());
matchMedia("(min-width: 961px)").addEventListener("change", (event) => {
  if (event.matches && menu.open) menu.close();
});

function showCopyFallback(url) {
  $("#share-url").value = url;
  $("#share-fallback").hidden = false;
  $("#share-url").focus();
  $("#share-url").select();
  status.textContent = "Odkaz můžete zkopírovat z textového pole.";
}
$("#share-selection").addEventListener("click", async () => {
  const url = selectionUrl().href;
  if (navigator.share) {
    try {
      await navigator.share({ title: document.title, url });
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    status.textContent = "Odkaz na výběr je zkopírovaný.";
  } catch {
    showCopyFallback(url);
  }
});
$("#close-share").addEventListener("click", () => {
  $("#share-fallback").hidden = true;
  status.textContent = "";
  $("#share-selection").focus();
});
window.addEventListener("popstate", () => {
  state = readState();
  render();
});
window.addEventListener("hashchange", () => {
  state = readState();
  render();
});

state = readState();
render();
document.documentElement.classList.add("js");
if (location.hash === "#odpovedi" || location.hash.startsWith("#strana-")) {
  $("#odpovedi").scrollIntoView({ behavior: "instant" });
}
