import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 45_000,
  expect: { timeout: 8_000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:3100",
    colorScheme: "dark",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  webServer: {
    command:
      "E2E_MOCK_CHECKOUT=true NEXT_PUBLIC_E2E_FIXTURES=true NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3100 npm run dev -- --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: false,
    timeout: 120_000
  },
  projects: [
    {
      name: "mobile-320x568",
      use: { ...devices["Desktop Chrome"], viewport: { width: 320, height: 568 } }
    },
    {
      name: "mobile-360x800",
      use: { ...devices["Desktop Chrome"], viewport: { width: 360, height: 800 } }
    },
    {
      name: "mobile-375x812",
      use: { ...devices["Desktop Chrome"], viewport: { width: 375, height: 812 } }
    },
    {
      name: "mobile-390x844",
      use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 } }
    },
    {
      name: "mobile-414x896",
      use: { ...devices["Desktop Chrome"], viewport: { width: 414, height: 896 } }
    },
    {
      name: "mobile-430x932",
      use: { ...devices["Desktop Chrome"], viewport: { width: 430, height: 932 } }
    },
    {
      name: "tablet-768x1024",
      use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 } }
    },
    {
      name: "tablet-1024x768",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1024, height: 768 } }
    },
    {
      name: "desktop-1280x800",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } }
    },
    {
      name: "desktop-1440x900",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } }
    }
  ]
});
