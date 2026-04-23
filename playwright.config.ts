import { defineConfig, devices } from '@playwright/test';
import { CONFIG } from '@cfg';

export default defineConfig({
  // Specifies the root directory where Playwright looks for test files to execute
  testDir: './tests',
  // Defines a whitelist of patterns to identify valid test files for execution
  testMatch: [
    '**/*.spec.ts',
    '**/*.test.ts'
  ],
  // Excludes any files ending with '.ignore.ts' from being executed, useful for drafts or helper files
  testIgnore: [
    '**/*.config.ts',
    '**/*.ignore.ts'
  ],
  // Sets a 30-second limit for each individual test. If exceeded, the test is automatically failed to prevent hanging
  timeout: 30000,
  // Maximum execution time for the entire test suite (10 minutes). Prevents excessive CI costs and hangs
  globalTimeout: 600000,
  // Enables parallel execution of all tests within the same file to maximize speed and resource utilization
  fullyParallel: true,
  // Prevents accidental 'test.only' commits from passing in CI environments, ensuring the full test suite is executed
  forbidOnly: !!process.env['CI'],
  // Automatically retries failed tests up to 3 times in CI to mitigate flakiness, but fails immediately on local for faster debugging
  retries: process.env['CI'] ? 3 : 0,
  // Opts for a single worker on CI to prevent resource contention and instability, while utilizing full CPU power on local
  workers: process.env['CI'] ? 1 : undefined,

  reporter: [
    ['line'],
    ['html', {
      outputFolder: 'reports/html',
      open: 'never'
    }],
    ['json', {
      outputFile: 'reports/json/results.json'
    }],
    ['junit', {
      outputFile: 'reports/junit/results.xml'
    }],
    [
      'blob',
      {
        outputDir: 'reports/blob'
      }
    ],
    [
      'allure-playwright',
      {
        resultsDir: 'reports/allure/allure-results',
        outputFolder: 'reports/allure/allure-results',
        detail: true,
        suiteTitle: true,
      }
    ],
    [
      'ortoni-report',
      {
        folderPath: 'reports/ortoni',
        filename: 'index.html',
        projectName: 'EspoCRM Test',
        testType: 'Regression',
        authorName: 'Architect',
        base64Image: true,
        preferredTheme: 'dark',
      },
    ],
  ],
  use: {
    baseURL: CONFIG.ENV.PAGE_URL,
    ignoreHTTPSErrors: true,
    bypassCSP: true,
    actionTimeout: 0,
    navigationTimeout: 0,
    serviceWorkers: 'block',

    trace: 'on-first-retry',
    video: 'on-first-retry',
    screenshot: 'on-first-failure',

    headless: true,
    viewport: { width: 1280, height: 720 },
    colorScheme: 'dark',
    javaScriptEnabled: true,
    acceptDownloads: false,
    offline: false,

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
    // {
    //   name: 'Chromium-E2E',
    //   testDir: './tests/e2e',
    //   testMatch: /.*\.spec\.ts/,
    //   testIgnore: /.*\.ignore\.ts/,
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     headless: true,
    //     viewport: { width: 1280, height: 720 },
    //     ignoreHTTPSErrors: true,
    //     actionTimeout: 10000,
    //     navigationTimeout: 30000,
    //     screenshot: 'only-on-failure',
    //     video: 'retain-on-failure',
    //     trace: 'on-first-retry',
    //     baseURL: 'https://staging.example.com',
    //   },
    //   retries: 2,
    //   timeout: 60000,
    //   grep: /@smoke/,
    //   metadata: {
    //     branch: 'main',
    //     environment: 'Staging'
    //   },
    // },
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
        contextOptions: { reducedMotion: 'reduce' },
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
  //   reuseExistingServer: !process.env['CI'],
  // },
});
