import { defineConfig, devices } from "@playwright/test";

// Inject test credentials so authenticated test blocks are not skipped
process.env.TEST_ADMIN_EMAIL = "e2e-admin@yarik-audit.local";
process.env.TEST_ADMIN_PASSWORD = "E2eAuditPass!2026";
process.env.TEST_USER_EMAIL = "e2e-user@yarik-audit.local";
process.env.TEST_USER_PASSWORD = "E2eUserPass!2026";
// SUPABASE_SERVICE_ROLE_KEY must be set in .env.local — never hardcode secrets here

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: false,
  retries: 0,
  workers: 1,
  reporter: [
    ["list"],
    ["json", { outputFile: "../audit-screenshots/results.json" }],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  use: {
    baseURL: "http://localhost:3002",
    trace: "off",
    screenshot: "on",
    video: "off",
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev -- --port 3002",
    url: "http://localhost:3002",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
