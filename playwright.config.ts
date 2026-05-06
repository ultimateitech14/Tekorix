import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 90_000,
  expect: {
    timeout: 15_000,
  },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: [
    {
      command: "npm run dev",
      cwd: "../backend",
      url: "https://tekorix-backend.onrender.com/health",
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: "npm run dev",
      cwd: ".",
      url: "http://127.0.0.1:3000",
      reuseExistingServer: true,
      timeout: 120_000,
    },
  ],
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 960 },
      },
    },
    {
      name: "tablet",
      use: {
        ...devices["iPad (gen 7) landscape"],
        browserName: "chromium",
        viewport: { width: 1024, height: 768 },
      },
    },
    {
      name: "mobile",
      use: {
        ...devices["Pixel 7"],
        browserName: "chromium",
      },
    },
  ],
});
