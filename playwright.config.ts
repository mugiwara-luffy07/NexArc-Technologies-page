import { defineConfig, devices } from "@playwright/test";

const PORT = 3400;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: { baseURL: `http://localhost:${PORT}`, trace: "retain-on-failure" },
  projects: [
    { name: "desktop-chrome", use: { ...devices["Desktop Chrome"] } },
    { name: "iphone-14", use: { ...devices["iPhone 14"] } },
    { name: "pixel-7", use: { ...devices["Pixel 7"] } },
    { name: "ipad", use: { ...devices["iPad (gen 7)"] } },
  ],
  webServer: {
    // production build; leads are logged instead of stored while testing
    command: `npm run build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    env: { ALLOW_UNCONFIGURED_LEADS: "1", DISABLE_RATE_LIMIT: "1" },
  },
});
