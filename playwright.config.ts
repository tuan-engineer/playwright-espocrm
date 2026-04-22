import { defineConfig, devices } from '@playwright/test';
import { CONFIG } from '@cfg';

export default defineConfig({
  // =========================================================================
  // 1. CORE TEST EXECUTION CONFIG
  // =========================================================================
  testDir: './tests',
  testIgnore: /.*\.ignore\.ts/,
  timeout: 30000,
  globalTimeout: 600000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 3 : 0,
  workers: process.env.CI ? 1 : undefined,

  // =========================================================================
  // 2. REPORTERS (Allure, Orton, Line)
  // =========================================================================
  reporter: [
    ['line'],
    [
      'allure-playwright',
      {
        outputFolder: 'allure-results',
        detail: true,
        suiteTitle: true,
      }
    ],
    [
      'ortoni-report',
      {
        projectName: 'EspoCRM Staging Test',
        testType: 'Regression',
        authorName: 'Architect',
        base64Image: false,
        preferredTheme: 'dark',
      },
    ],
  ],

  // =========================================================================
  // 3. GLOBAL BROWSER & CONTEXT SETTINGS (Shared across projects)
  // =========================================================================
  use: {
    /* --- 3.1 Network & URLs --- */
    baseURL: CONFIG.ENV.PAGE_URL,
    ignoreHTTPSErrors: true,
    bypassCSP: true,
    actionTimeout: 0,
    navigationTimeout: 0,
    serviceWorkers: 'block',

    /* --- 3.2 Artifacts (Trace, Video, Screenshot) --- */
    trace: 'on-first-retry',
    video: 'on-first-retry',
    screenshot: 'on-first-failure',

    /* --- 3.3 UI & Environment --- */
    headless: true,
    viewport: { width: 1280, height: 720 },
    colorScheme: 'dark',
    javaScriptEnabled: true,
    acceptDownloads: false,
    offline: false,

    /* --- 3.4 Launch Options (Arguments & Optimization) --- */
    launchOptions: {
      slowMo: 0,
      args: [
        '--disable-gpu',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--start-maximized',
      ],
    },

    /* --- 3.5 Permissions & Device Emulation --- */
    isMobile: false,
    deviceScaleFactor: 1,
    permissions: ['notifications', 'camera', 'microphone', 'clipboard-read', 'clipboard-write'],
    contextOptions: {
      reducedMotion: 'reduce',
    },
  },

  // =========================================================================
  // 4. TEST PROJECTS (Browsers & Setup)
  // =========================================================================
  projects: [
    /* Step 1: Authentication or Global Setup */
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    /* Step 2: Main Test Execution */
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        contextOptions: { reducedMotion: 'reduce' }
      },
      dependencies: ['setup'],
    },

    /* Optional: Other Browsers */
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    //   dependencies: ['setup'],
    // },
  ],

  // =========================================================================
  // 5. LOCAL DEV SERVER (Optional)
  // =========================================================================
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
