import { defineConfig, devices } from '@playwright/test';
import { CONFIG } from './cfg';

export default defineConfig({
  timeout: 30000,
  globalTimeout: 600000,
  testDir: './tests',

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI error; set to 0 for local development */
  retries: process.env.CI ? 3 : 0,

  /* Opt out of parallel tests on CI to avoid timeouts */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['line'], ['allure-playwright', { outputFolder: 'allure-results' }]],
  use: {
    baseURL: CONFIG.ENV.PAGE_URL,
    trace: 'on-first-retry',
    headless: false,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'on-first-retry',
    screenshot: 'on-first-failure',
    acceptDownloads: false,
    actionTimeout: 0,
    navigationTimeout: 0,
    bypassCSP: true,

    // clientCertificates: [
    //   {
    //     origin: "https://example.com",
    //     certPath: "./cert.pem",
    //     keyPath: "./key.pem",
    //     passphrase: "mysecretpassword",
    //   },
    // ],
    // colorScheme: "dark",

    contextOptions: {
      reducedMotion: 'reduce',
    },
    deviceScaleFactor: 1,

    // extraHTTPHeaders: {
    //   "X-My-Header": "value",
    // },
    // geolocation: { longitude: 12.492507, latitude: 41.889938 },
    // timezoneId: "Europe/Rome",
    // hasTouch: true,
    // httpCredentials: {
    //   username: "user",
    //   password: "pass",
    // },

    isMobile: false,
    javaScriptEnabled: true,

    launchOptions: {
      slowMo: 500, // Slows down execution for visibility
      args: ['--start-maximized', '--disable-notifications', '--disable-infobars', '--no-sandbox'],
      channel: 'chrome',
    },

    // locale: "it-IT",
    offline: false,
    permissions: ['notifications', 'camera', 'microphone', 'clipboard-read', 'clipboard-write'],

    // proxy: {
    //   server: "http://myproxy.com:3128",
    //   bypass: "localhost",
    // },

    serviceWorkers: 'block',

    // storageState: CONFIG.COMMON.STORAGE_PATH,
    // userAgent: "some custom ua",
  },

  testIgnore: /.*\.ignore\.ts/,

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    //   dependencies: ['setup'],
    // },
    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    //   dependencies: ['setup'],
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: "npm run start",
  //   url: "http://localhost:3000",
  //   reuseExistingServer: !process.env.CI,
  // },
});
