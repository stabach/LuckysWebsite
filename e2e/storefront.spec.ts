import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page, type TestInfo } from "@playwright/test";

const responsiveRoutes = [
  "/",
  "/shop",
  "/acrylic-cases",
  "/psa-guards",
  "/binders",
  "/sealed-product",
  "/products/crystal-slab-acrylic-case",
  "/find-your-fit?mode=sealed&q=Surging+Sparks+Elite+Trainer+Box&product=tcg-3-565630",
  "/events",
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

test("320px menu traps focus, keeps close available, and reaches All Products", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-320x568");
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open menu" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const menu = page.getByRole("dialog", { name: "Lucky’s Loot" });
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("link", { name: "All Products" })).toBeVisible();
  await expect(menu.getByRole("link", { name: "Upcoming Events" })).toBeVisible();

  await expect(menu.getByRole("link", { name: "Lucky’s Loot home" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  expect(await menu.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  await menu.evaluate((element) => element.scrollTo({ top: element.scrollHeight }));
  await expect(menu.getByRole("button", { name: "Close menu" })).toBeInViewport();

  await page.keyboard.press("Escape");
  await expect(menu).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.getByRole("dialog", { name: "Lucky’s Loot" }).getByRole("link", { name: "All Products" }).click();
  await expect(page).toHaveURL(/\/shop$/);
});

test("every phone menu destination works with browser Back navigation", async ({ page }, testInfo) => {
  test.skip(!isProject(testInfo, "mobile"));
  const destinations = [
    ["Home", "/"],
    ["All Products", "/shop"],
    ["Acrylic Cases", "/collections/acrylic-cases"],
    ["PSA Guards", "/collections/slab-protection"],
    ["Binders", "/collections/toploader-binders"],
    ["Sealed Product", "/collections/protect-sealed-product"],
    ["Upcoming Events", "/events"],
    ["Pickup & Returns", "/pickup-and-returns"],
    ["Contact", "/contact"]
  ] as const;

  await page.goto("/faq");
  for (const [label, pathname] of destinations) {
    await page.getByRole("button", { name: "Open menu" }).click();
    await page
      .getByRole("dialog", { name: "Lucky’s Loot" })
      .getByRole("link", { name: label, exact: true })
      .click();
    await expect.poll(() => new URL(page.url()).pathname).toBe(pathname);
    await page.goBack();
    await expect.poll(() => new URL(page.url()).pathname).toBe("/faq");
  }

  await page.getByRole("button", { name: "Open menu" }).click();
  let menu = page.getByRole("dialog", { name: "Lucky’s Loot" });
  await menu.getByRole("link", { name: "Find Your Fit" }).click();
  await expect.poll(() => new URL(page.url()).pathname).toBe("/find-your-fit");
  await page.goBack();
  await expect.poll(() => new URL(page.url()).pathname).toBe("/faq");

  await page.getByRole("button", { name: "Open menu" }).click();
  menu = page.getByRole("dialog", { name: "Lucky’s Loot" });
  const accountLink = menu.locator('.mobile-phone-nav a[href="/login"], .mobile-phone-nav a[href="/account"]');
  const accountPath = new URL(await accountLink.getAttribute("href") ?? "/login", "http://localhost").pathname;
  await accountLink.click();
  await expect.poll(() => new URL(page.url()).pathname).toBe(accountPath);
  await page.goBack();
  await expect.poll(() => new URL(page.url()).pathname).toBe("/faq");
});

test("mobile category switcher and binder options stay compact and actionable", async ({ page }, testInfo) => {
  test.skip(!isProject(testInfo, "mobile"));
  await page.goto("/shop");
  const categories = page.getByRole("navigation", { name: "Shop categories" });
  await categories.getByRole("link", { name: "Acrylic" }).click();
  await expect(page).toHaveURL(/\/acrylic-cases$/);

  await page.goto("/products/9-pocket-toploader-binder");
  await expect(page.getByRole("radio", { name: "Red" })).toBeChecked();
  await page.getByRole("radio", { name: "Purple" }).check();
  await expect(page.getByRole("img", { name: "Purple 9-Pocket Toploader Binder" })).toBeVisible();
  await page.locator(".mobile-sticky-add").getByRole("button", { name: "Add to Loot" }).click();
  const cart = page.getByRole("dialog", { name: "Your Loot" });
  await expect(cart).toContainText("9-Pocket Toploader Binder");
  await expect(cart).toContainText("Purple");
});

test("mobile cart handles mixed product types and persists the subtotal", async ({ page }, testInfo) => {
  test.skip(!isProject(testInfo, "mobile"));
  await page.goto("/products/etb-acrylic-case");
  await page.locator(".mobile-sticky-add").getByRole("button", { name: "Add to Loot" }).click();
  let cart = page.getByRole("dialog", { name: "Your Loot" });
  await cart.getByRole("button", { name: "Close Your Loot" }).click();

  await page.goto("/products/9-pocket-toploader-binder");
  await page.getByRole("radio", { name: "Purple" }).check();
  await page.locator(".mobile-sticky-add").getByRole("button", { name: "Add to Loot" }).click();
  cart = page.getByRole("dialog", { name: "Your Loot" });
  await expect(cart.locator(".cart-line")).toHaveCount(2);
  await expect(cart).toContainText("ETB Acrylic Case");
  await expect(cart).toContainText("9-Pocket Toploader Binder");
  await expect(cart).toContainText("Purple");
  await expect(cart.locator(".cart-subtotal-row")).toContainText("$30.00");
  await expect(page.getByRole("button", { name: /Open Your Loot/ })).toContainText("2");

  await cart.getByRole("button", { name: "Close Your Loot" }).click();
  await page.reload();
  await page.getByRole("button", { name: /Open Your Loot/ }).click();
  cart = page.getByRole("dialog", { name: "Your Loot" });
  await expect(cart.locator(".cart-line")).toHaveCount(2);
  await expect(cart.locator(".cart-subtotal-row")).toContainText("$30.00");
});

test("Guard bundle blocks incomplete orders and exposes a reachable mobile action", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-320x568");
  await page.goto("/products/psa-guards");
  const addBundle = page.getByRole("button", { name: "Add bundle to Your Loot" });
  await expect(addBundle).toBeDisabled();
  await page.getByRole("button", { name: "Increase Arctic" }).click();
  const addOne = page.getByRole("button", { name: "Add 1 to Your Loot" });
  await expect(addOne).toBeEnabled();
  expect(await addOne.evaluate((element) => getComputedStyle(element).position)).toBe("fixed");
  await expect(addOne).toBeInViewport();
  await addOne.click();
  await expect(page.getByRole("dialog", { name: "Your Loot" })).toContainText("Arctic");
});

test("Guard builder exposes every color and enforces its order maximum", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-320x568");
  await page.goto("/products/psa-guards");
  await expect(page.getByRole("button", { name: /^Preview / })).toHaveCount(15);
  const arctic = page.getByRole("spinbutton", { name: "Arctic quantity" });
  await arctic.fill("99");
  await expect(arctic).toHaveValue("99");
  await expect(page.getByRole("button", { name: "Increase Emerald" })).toBeDisabled();
  await expect(page.locator(".guard-builder-summary")).toContainText("99");
  await arctic.fill("0");
  await expect(page.getByRole("button", { name: "Add bundle to Your Loot" })).toBeDisabled();
});

test("mobile checkout shows pending and failure states while unavailable filters stay disabled", async ({ page }, testInfo) => {
  test.skip(!isProject(testInfo, "mobile"));
  let releaseCheckout: (() => void) | undefined;
  const checkoutHeld = new Promise<void>((resolve) => {
    releaseCheckout = resolve;
  });
  await page.route("**/api/checkout", async (route) => {
    await checkoutHeld;
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ error: "Secure checkout is temporarily unavailable." })
    });
  });

  await page.goto("/products/etb-acrylic-case");
  await page.locator(".mobile-sticky-add").getByRole("button", { name: "Add to Loot" }).click();
  const cart = page.getByRole("dialog", { name: "Your Loot" });
  const checkout = cart.getByRole("button", { name: "Secure checkout" });
  await checkout.click();
  await expect(checkout).toBeDisabled();
  releaseCheckout?.();
  await expect(cart.getByRole("alert")).toContainText("temporarily unavailable");
  await expect(checkout).toBeEnabled();
  await expect(checkout).toBeInViewport();
  await cart.getByRole("button", { name: "Close Your Loot" }).click();

  await page.goto("/psa-guards");
  const filterTrigger = page.getByRole("button", { name: /^Filters/ });
  await filterTrigger.click();
  const filters = page.getByRole("dialog", { name: "Filters" });
  await expect(filters.getByRole("checkbox", { name: /Binders 0/ })).toBeDisabled();
  await expect(filters.getByRole("checkbox", { name: /Acrylic cases 0/ })).toBeDisabled();
  await page.keyboard.press("Escape");
  await expect(filters).toHaveCount(0);
  await expect(filterTrigger).toBeFocused();
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
  await page.goto("/find-your-fit?mode=sealed");
  const search = page.getByRole("combobox", { name: "Pokémon sealed product" });
  await search.fill("Surging Sparks Elite Trainer Box");
  const suggestion = page
    .getByRole("option")
    .filter({ hasText: "Surging Sparks Elite Trainer Box" })
    .first();
  await expect(suggestion).toBeVisible();
  await suggestion.getByRole("button").click();
  await expect(page).toHaveURL(
    /mode=sealed.*q=Surging\+Sparks\+Elite\+Trainer\+Box.*product=tcg-3-565630/
  );
  await expect(page.getByText("Exact format match")).toBeVisible();
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

test("looping product media autoplays without redundant controls", async ({ page }, testInfo) => {
  test.skip(!isProject(testInfo, "desktop"));
  await page.goto("/products/crystal-slab-acrylic-case");
  await page
    .getByRole("button", { name: "Show Looping rotating view of the PSA Graded Guard Fit Acrylic Case" })
    .click();
  const video = page.locator(
    'video[aria-label="Looping rotating view of the PSA Graded Guard Fit Acrylic Case"]'
  );
  await expect(video).toBeVisible();
  await expect(video).toHaveAttribute("autoplay", "");
  await expect(video).toHaveAttribute("loop", "");
  await expect(video).not.toHaveAttribute("controls", "");
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
    await page.goto(
      "/find-your-fit?mode=sealed&q=Surging+Sparks+Elite+Trainer+Box&product=tcg-3-565630"
    );
    await waitForStablePage(page);
    await page.screenshot({
      path: "artifacts/screenshots/fit-mobile-390x844.png",
      fullPage: true,
      animations: "disabled"
    });
  }
});

function isProject(testInfo: TestInfo, size: "mobile" | "tablet" | "desktop") {
  const primaryProjects = {
    mobile: "mobile-390x844",
    tablet: "tablet-768x1024",
    desktop: "desktop-1440x900"
  } as const;
  return testInfo.project.name === primaryProjects[size];
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
