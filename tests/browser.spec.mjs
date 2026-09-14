import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("real replies and nonrespondents remain distinct on narrow screens", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 760 });
  await page.goto('/?party=praha-5-sobe#odpovedi');
  await expect(page.locator('body')).not.toContainText(/lorem|ipsum|ukázkov/i);
  await page.locator('#praha-5-sobe-bezpecnost summary').click();
  await expect(page.locator('#praha-5-sobe-bezpecnost .answer-body')).toContainText('Na Barrandov, stejně');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', {name: 'Podle otázky', exact: true}).click();
  await page.getByLabel('Vyberte otázku').selectOption('priority');
  await expect(page.locator('#comparison-list .missing-answer')).toHaveCount(8);
  await expect(page.locator('#comparison-list')).toContainText('Zřídíme mobilní policejní strážnici');
  await expect(page.locator('#comparison-list')).toContainText('Důstojné zázemí pro seniory');
});

test("sharing remains usable when the browser denies clipboard access", async ({
  page,
}) => {
  // Sharing and clipboard access are browser/OS boundaries; the fallback UI is real.
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", { value: undefined });
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: async () => {
          throw new DOMException("Denied", "NotAllowedError");
        },
      },
    });
  });
  await page.goto("/?view=question&party=pirati&question=zakladni-skoly#odpovedi");
  await page.getByRole("button", { name: "Sdílet výběr" }).click();
  await expect(
    page.getByRole("textbox", { name: "Zkopírujte odkaz na tento výběr" }),
  ).toHaveValue(
    "http://127.0.0.1:4175/?view=question&party=pirati&question=zakladni-skoly#odpovedi",
  );
  await expect(page.getByRole("status")).toContainText(
    "Odkaz můžete zkopírovat",
  );
  await page.locator("#close-share").click();
  await expect(
    page.getByRole("button", { name: "Sdílet výběr" }),
  ).toBeFocused();
});

test("shared links open the selected answer area and invalid selections fall back", async ({
  page,
}) => {
  await page.goto("/?view=question&party=pirati&question=zakladni-skoly#odpovedi");
  await expect(
    page.getByRole("combobox", { name: "Vyberte otázku" }),
  ).toHaveValue("zakladni-skoly");
  expect(
    await page.evaluate(
      () => document.querySelector("#odpovedi").getBoundingClientRect().top,
    ),
  ).toBeLessThan(120);
  await page.goto(
    "/?party=nonexistent&question=nonexistent&view=unknown#odpovedi",
  );
  await expect(page.locator('[data-party-section="spd"]')).toBeVisible();
  await expect(
    page.getByRole("combobox", { name: "Vyberte uskupení", exact: true }),
  ).toHaveValue("spd");
});

test("switching parties preserves the selection in links and browser history", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: "Prohlédnout odpovědi", exact: true })
    .click();
  await page
    .getByRole("combobox", { name: "Vyberte uskupení", exact: true })
    .selectOption("pirati");
  await expect(page.locator("[data-party-section]:visible")).toHaveCount(1);
  await expect(page.locator('[data-party-section="pirati"]')).toBeVisible();
  await expect(page).toHaveURL(/party=pirati/);
  await page
    .getByRole("combobox", { name: "Vyberte uskupení", exact: true })
    .selectOption("sen");
  await page.goBack();
  await expect(
    page.getByRole("combobox", { name: "Vyberte uskupení", exact: true }),
  ).toHaveValue("pirati");
  await page.reload();
  await expect(page.locator('[data-party-section="pirati"]')).toBeVisible();
});

test("comparison shows each party for exactly the selected question", async ({
  page,
}) => {
  await page.goto("/?party=ano#odpovedi");
  await page.getByRole("button", { name: "Podle otázky", exact: true }).click();
  await page.getByLabel("Vyberte otázku").selectOption("vybavenost");
  await expect(page.locator("#comparison-list article")).toHaveCount(12);
  await expect(page.locator("#comparison-title")).toContainText("Na Barrandově pokračuje rozsáhlá bytová výstavba");
  await expect(page).toHaveURL(/question=vybavenost/);
  await page
    .getByRole("button", { name: "Podle uskupení", exact: true })
    .click();
  await expect(page.locator('[data-party-section="ano"]')).toBeVisible();
});

test("question controls expand and collapse only the active party", async ({
  page,
}) => {
  await page.goto("/?party=ods#odpovedi");
  await page.getByRole("button", { name: "Rozbalit vše" }).click();
  await expect(
    page.locator('[data-party-section="ods"] details[open]'),
  ).toHaveCount(7);
  await page.getByRole("button", { name: "Sbalit vše" }).click();
  await expect(
    page.locator('[data-party-section="ods"] details[open]'),
  ).toHaveCount(0);
  await page.locator('[data-party-section="ods"] summary').first().focus();
  await page.keyboard.press("Enter");
  await expect(
    page.locator('[data-party-section="ods"] details[open]'),
  ).toHaveCount(1);
});

test("mobile navigation closes on selection and Escape and restores focus", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "Mobile menu only");
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Vybrat uskupení" });
  await menu.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByRole("dialog")
    .getByRole("link", { name: /Piráti/ })
    .click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("combobox", { name: "Vyberte uskupení", exact: true }),
  ).toHaveValue("pirati");
  await menu.click();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
});

test("all answers remain readable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4175/");
  await expect(page.locator("[data-party-section]:visible")).toHaveCount(12);
  await expect(
    page.getByRole("button", { name: "Podle otázky", exact: true }),
  ).not.toBeVisible();
  await page.locator('[data-party-section="sen"] summary').last().click();
  await expect(
    page.locator('[data-party-section="sen"] details').last(),
  ).toHaveAttribute("open", "");
  await context.close();
});

test("page has loaded images, no horizontal overflow and no serious accessibility violations", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page
    .getByRole("link", { name: "Prohlédnout odpovědi", exact: true })
    .click();
  await page.evaluate(async () => {
    // Hidden party panels deliberately lazy-load their logos; request them for the asset audit.
    document.querySelectorAll("img").forEach((img) => {
      img.loading = "eager";
    });
    await Promise.all(
      [...document.images].map((img) => img.decode().catch(() => {})),
    );
  });
  expect(
    await page.evaluate(() =>
      [...document.images]
        .filter((img) => !img.naturalWidth)
        .map((img) => img.src),
    ),
  ).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
  expect(errors).toEqual([]);
});

test("320px screen and long party name fit without horizontal scrolling", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 760 });
  await page.goto("/?party=sen#odpovedi");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await expect(page.locator('[data-party-section="sen"] h3')).toBeVisible();
  const heading = await page
    .locator('[data-party-section="sen"] h3')
    .boundingBox();
  expect(heading.width).toBeGreaterThan(140);
  await page.setViewportSize({ width: 390, height: 844 });
  const widerHeading = await page
    .locator('[data-party-section="sen"] h3')
    .boundingBox();
  expect(widerHeading.width).toBeGreaterThan(170);
});
