import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export default defineConfig({
  testDir: "./src/e2e",
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "html" : [["html", { open: "never" }]],
  use: {
    // Only use Chromium as specified in the guidelines
    browserName: "chromium",

    // Collect trace on failure
    trace: "on-first-retry",

    // Record video on failure
    video: "on-first-retry",

    // Screenshot on failure
    screenshot: "only-on-failure",

    // Browser context options
    contextOptions: {
      ignoreHTTPSErrors: true,
    },

    // Base URL so we can use relative URLs in tests
    baseURL: process.env.BASE_URL || "http://localhost:3000",

    // Additional recommended options
    actionTimeout: 10000,
    navigationTimeout: 15000,
  },
  projects: [
    {
      name: "setup",
      testMatch: "**/*.setup.ts",
      teardown: "cleanup",
    },
    {
      name: "cleanup",
      testMatch: /global\.teardown\.ts/,
    },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 720 },
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["setup"],
    },
  ],
  // Output directory for test reports
  outputDir: "test-results",
});
