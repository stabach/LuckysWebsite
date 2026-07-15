import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const baseUrl = process.env.SCREENSHOT_BASE_URL || "http://127.0.0.1:3000";
const outputDirectory = "artifacts/screenshots";
const browser = await chromium.launch();

await mkdir(outputDirectory, { recursive: true });

try {
  const captures = [
    { path: "/", file: "home-mobile-390x844.png", width: 390, height: 844 },
    { path: "/", file: "home-tablet-768x1024.png", width: 768, height: 1024 },
    { path: "/", file: "home-desktop-1440x900.png", width: 1440, height: 900 },
    {
      path: "/products/crystal-slab-acrylic-case",
      file: "product-crystal-desktop-1440x900.png",
      width: 1440,
      height: 900
    },
    {
      path: "/find-your-fit?item=etb&format=standard&goal=display",
      file: "fit-mobile-390x844.png",
      width: 390,
      height: 844
    }
  ];

  for (const capture of captures) {
    const context = await browser.newContext({
      viewport: { width: capture.width, height: capture.height },
      colorScheme: "dark",
      reducedMotion: "reduce"
    });
    const page = await context.newPage();
    await page.addInitScript(() => {
      window.sessionStorage.setItem("luckys-neon-intro-v2", "seen");
    });
    await page.goto(new URL(capture.path, baseUrl).toString(), { waitUntil: "networkidle" });
    await prepareFullPage(page);
    await page.screenshot({
      path: `${outputDirectory}/${capture.file}`,
      fullPage: true,
      animations: "disabled"
    });
    await context.close();
  }
} finally {
  await browser.close();
}

async function prepareFullPage(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    const pause = (milliseconds) =>
      new Promise((resolve) => window.setTimeout(resolve, milliseconds));
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
