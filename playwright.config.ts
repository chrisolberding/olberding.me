import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  snapshotDir: './tests/screenshots',
  timeout: 30_000,
  expect: {
    toHaveScreenshot: {
      // Allow small anti-aliasing differences
      maxDiffPixelRatio: 0.01,
    },
  },
  webServer: {
    command: 'npm run dev',
    port: 4321,
    reuseExistingServer: true,
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Desktop Safari',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Galaxy S24',
      use: { ...devices['Galaxy S24'] },
    },
    {
      name: 'iPhone 13 Mini',
      use: { ...devices['iPhone 13 Mini'] },
    },
    {
      name: 'iPhone 15',
      use: { ...devices['iPhone 15'] },
    },
    {
      name: 'Pixel 7',
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'iPhone 15 Pro Max',
      use: { ...devices['iPhone 15 Pro Max'] },
    },
    {
      name: 'iPad Mini',
      use: { ...devices['iPad Mini'] },
    },
  ],
});
