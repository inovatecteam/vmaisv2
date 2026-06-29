import { defineConfig, devices } from '@playwright/test'
import fs from 'fs'

const CI = !!process.env.CI

// By default Playwright uses the browser it downloads via `npx playwright install`.
// You can point it at a specific binary with PLAYWRIGHT_CHROMIUM_EXECUTABLE
// (useful when the exact build for this Playwright version fails to download and
// you want to reuse an already-cached headless-shell that's a few builds off).
const EXECUTABLE_PATH =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE &&
  fs.existsSync(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE)
    ? process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
    : undefined

// BASE_URL lets us point the same specs at the live production site
// (https://voluntariamais.com.br) instead of a local server.
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const IS_EXTERNAL = !!process.env.BASE_URL

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: CI,
  retries: 0,
  workers: 1,
  reporter: 'list',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: 15_000,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        ...(EXECUTABLE_PATH ? { launchOptions: { executablePath: EXECUTABLE_PATH } } : {}),
      },
    },
  ],
  // Only spin up a local server when testing locally.
  webServer: IS_EXTERNAL
    ? undefined
    : {
        command: 'npm run dev',
        url: 'http://localhost:3000/entrar',
        reuseExistingServer: true,
        timeout: 120_000,
        stdout: 'pipe',
        stderr: 'pipe',
      },
})
