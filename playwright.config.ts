import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    launchOptions: {
      args: ["--enable-precise-memory-info"],
    },
  },
  projects: [
    {
      name: "functional",
      testMatch: "**/select.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "a11y",
      testMatch: "**/select.a11y.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "perf",
      testMatch: "**/select.perf.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "stress",
      testMatch: "**/select.stress.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "visual",
      testMatch: "**/select.visual.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
