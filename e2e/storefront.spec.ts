import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page, type TestInfo } from "@playwright/test";

const responsiveRoutes = [
  "/",
  "/shop",
  "/products/crystal-slab-acrylic-case",
  "/find-your-fit?item=etb&format=standard&goal=display",
  "/contact?topic=product-fit",
  "/faq",
  "/login",
  "/account"
];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.sessionStorage.setItem("luckys-neon-intro-v2", "seen");
  });
});

test("key routes are responsive and have no serious axe violations", async ({ page }) => {
  for (const route of responsiveRoutes) {
    await page.goto(route);
    await expect(page.locator("main#main-content")).toBeVisible();
    await expect(page.locator("h1")).toHaveCount(1);
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
      mains: document.querySelectorAll("main").length
    }));
    expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.viewport + 1);
    expect(dimensions.mains).toBe(1);

    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    const serious = results.violations.filter(
      (violation) => violation.impact === "serious" || violation.impact === "critical"
    );
    expect(serious, `${route}: ${formatViolations(serious)}`).toEqual([]);
  }
});

test("mobile shopper adds an ETB case and chooses local pickup", async ({ page }, testInfo) => {
  test.skip(!isProject(testInfo, "mobile"));
  await page.goto("/shop");
  const product = page.getByRole("article").filter({ hasText: "ETB Acrylic Case" });
  await product.getByRole("button", { name: "Add to Loot" }).click();
  const cart = page.getByRole("dialog", { name: "Your Loot" });
  await expect(cart).toBeVisible();
  await expect(cart).toContainText("ETB Acrylic Case");
  await expect(cart.getByRole("radio", { name: /Richmond \/ Houston area/ })).toBeChecked();
});

test("mixed Guard colors unlock the 10-unit tier", async ({ page }, testInfo) => {
  test.skip(!isProject(testInfo, "desktop"));
  await page.goto("/products/psa-guards#bundle-builder");
  await page.getByRole("spinbutton", { name: "Arctic quantity" }).fill("5");
  await page.getByRole("spinbutton", { name: "Emerald quantity" }).fill("5");
  await expect(page.locator(".guard-builder-summary")).toContainText("10");
  await expect(page.locator(".guard-builder-summary")).toContainText("$6.00");
  await page.getByRole("button", { name: /Add 10 to Your Loot/ }).click();
  await expect(page.getByRole("dialog", { name: "Your Loot" })).toContainText("$6.00 each");
});

test("mixed Guard colors unlock the 25-unit tier", async ({ page }, testInfo) => {
  test.skip(!isProject(testInfo, "desktop"));
  await page.goto("/products/psa-guards#bundle-builder");
  await page.getByRole("spinbutton", { name: "Arctic quantity" }).fill("13");
  await page.getByRole("spinbutton", { name: "Emerald quantity" }).fill("12");
  await expect(page.locator(".guard-builder-summary")).toContainText("25");
  await expect(page.locator(".guard-builder-summary")).toContainText("$4.00");
  await expect(page.getByText("Best bulk price unlocked: $4 each.")).toBeVisible();
});

test("Fit Finder reaches a verified product and preserves selections in the URL", async ({ page }, testInfo) => {
  test.skip(!isProject(testInfo, "tablet"));
  await page.goto("/find-your-fit");
  await page.getByRole("button", { name: "Elite Trainer Box" }).click();
  await page.getByRole("button", { name: "Standard Pokémon ETB" }).click();
  await page.getByRole("button", { name: "Display protection" }).click();
  await expect(page).toHaveURL(/item=etb.*format=standard.*goal=display/);
  await expect(page.getByText("Exact match")).toBeVisible();
  await expect(page.getByRole("heading", { name: "ETB Acrylic Case" })).toBeVisible();
  await expect(page.getByRole("link", { name: /View product/ })).toHaveAttribute(
    "href",
    "/products/etb-acrylic-case"
  );
});

test("eligible event pickup, cart changes, and removal persist correctly", async ({ page }, testInfo) => {
  test.skip(!isProject(testInfo, "tablet"));
  await page.goto("/shop");
  const product = page.getByRole("article").filter({ hasText: "ETB Acrylic Case" });
  await product.getByRole("button", { name: "Add to Loot" }).click();
  let cart = page.getByRole("dialog", { name: "Your Loot" });
  const eventPickup = cart.getByRole("radio", { name: /Event pickup/ });
  await expect(eventPickup).toBeEnabled();
  await eventPickup.check();
  await expect(eventPickup).toBeChecked();
  await cart.getByRole("button", { name: /Increase ETB Acrylic Case quantity/ }).click();
  await expect(cart.locator(".cart-line-quantity span")).toHaveText("2");
  await cart.getByRole("button", { name: "Close Your Loot" }).click();

  await page.reload();
  await page.getByRole("button", { name: /Open Your Loot/ }).click();
  cart = page.getByRole("dialog", { name: "Your Loot" });
  await expect(cart.getByRole("radio", { name: /Event pickup/ })).toBeChecked();
  await expect(cart.locator(".cart-line-quantity span")).toHaveText("2");
  await cart.getByRole("button", { name: /Remove ETB Acrylic Case/ }).click();
  await expect(cart.getByRole("heading", { name: "Your Loot is empty." })).toBeVisible();
});

test("interactive product media supports drag, keyboard, and reset", async ({ page }, testInfo) => {
  test.skip(!isProject(testInfo, "desktop"));
  await page.goto("/products/crystal-slab-acrylic-case");
  await page.getByRole("button", { name: "Show interactive product view" }).click();
  const viewer = page.getByRole("slider", { name: "Inspect interactive product view" });
  await expect(viewer).toBeVisible();
  await expect(viewer).toHaveAttribute("aria-valuemax", "100");
  await viewer.press("End");
  await expect(viewer).toHaveAttribute("aria-valuenow", "100");
  await viewer.press("Home");
  await expect(viewer).toHaveAttribute("aria-valuenow", "0");

  const box = await viewer.boundingBox();
  if (!box) throw new Error("Interactive viewer has no bounding box.");
  await page.mouse.move(box.x + box.width * 0.35, box.y + box.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.5, { steps: 6 });
  await page.mouse.up();
  await page.getByRole("button", { name: "Reset interactive view" }).click();
  await expect(viewer).toHaveAttribute("aria-valuenow", "0");
});

test("verified mocked checkout clears the persisted cart", async ({ page }, testInfo) => {
  test.skip(!isProject(testInfo, "mobile"));
  await page.goto("/products/etb-acrylic-case");
  await page.locator(".purchase-add-button").click();
  await page.getByRole("button", { name: "Secure checkout" }).click();
  await expect(page).toHaveURL(/\/checkout\/success\?session_id=cs_test_verified_/);
  await expect(page.getByRole("heading", { name: "Your Loot is secured." })).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() => {
        const value = window.localStorage.getItem("luckys-loot-cart-v2");
        return value ? (JSON.parse(value) as { items?: unknown[] }).items?.length ?? -1 : -1;
      })
    )
    .toBe(0);
});

test("mega menu and cart open and close entirely by keyboard", async ({ page }, testInfo) => {
  test.skip(!isProject(testInfo, "desktop"));
  await page.goto("/");
  const shopTrigger = page.getByRole("button", { name: "Shop" });
  await shopTrigger.focus();
  await page.keyboard.press("Enter");
  await expect(shopTrigger).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(shopTrigger).toHaveAttribute("aria-expanded", "false");
  await expect(shopTrigger).toBeFocused();

  const cartTrigger = page.getByRole("button", { name: /Open Your Loot/ });
  await cartTrigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog", { name: "Your Loot" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Your Loot" })).toHaveCount(0);
  await expect(cartTrigger).toBeFocused();
});

test("captures final responsive screenshots", async ({ page }, testInfo) => {
  const suffix = testInfo.project.name;
  await page.goto("/");
  await waitForStablePage(page);
  await page.screenshot({
    path: `artifacts/screenshots/home-${suffix}.png`,
    fullPage: true,
    animations: "disabled"
  });

  if (isProject(testInfo, "desktop")) {
    await page.goto("/products/crystal-slab-acrylic-case");
    await waitForStablePage(page);
    await page.screenshot({
      path: "artifacts/screenshots/product-crystal-desktop-1440x900.png",
      fullPage: true,
      animations: "disabled"
    });
  }

  if (isProject(testInfo, "mobile")) {
    await page.goto("/find-your-fit?item=etb&format=standard&goal=display");
    await waitForStablePage(page);
    await page.screenshot({
      path: "artifacts/screenshots/fit-mobile-390x844.png",
      fullPage: true,
      animations: "disabled"
    });
  }
});

function isProject(testInfo: TestInfo, size: "mobile" | "tablet" | "desktop") {
  return testInfo.project.name.startsWith(size);
}

function formatViolations(violations: Array<{ id: string; nodes: unknown[] }>) {
  return violations.map((violation) => `${violation.id} (${violation.nodes.length})`).join(", ");
}

async function waitForStablePage(page: Page) {
  await page.locator("body").waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    const pause = (milliseconds: number) =>
      new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));
    const step = Math.max(window.innerHeight * 0.75, 400);
    for (let top = 0; top < document.documentElement.scrollHeight; top += step) {
      window.scrollTo({ top, behavior: "auto" });
      await pause(35);
    }
    await Promise.all(
      Array.from(document.images).map((image) =>
        image.complete ? image.decode().catch(() => undefined) : Promise.resolve()
      )
    );
    window.scrollTo({ top: 0, behavior: "auto" });
  });
  await page.waitForTimeout(250);
}
