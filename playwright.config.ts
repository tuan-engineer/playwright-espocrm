import { defineConfig, devices } from '@playwright/test';
import { CONFIG } from '@cfg';

export default defineConfig({
  // Specifies the root directory where Playwright looks for test files to execute
  testDir: './tests',
  // Defines a whitelist of patterns to identify valid test files for execution
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  // Excludes any files ending with '.ignore.ts' from being executed, useful for drafts or helper files
  testIgnore: ['**/*.config.ts', '**/*.ignore.ts'],
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
  // Define the output format for test results
  reporter: [
    // Single-line progress reporter for concise terminal logs
    ['line'],
    // Save HTML reports to a specific folder without auto-opening after execution
    [
      'html',
      {
        outputFolder: 'reports/html',
        open: 'on-failure',
      },
    ],
    // Export raw test results to a JSON file for automated data processing
    [
      'json',
      {
        outputFile: 'reports/json/results.json',
      },
    ],
    // Generate JUnit XML reports for integration with CI/CD pipelines (e.g., Jenkins, Azure)
    [
      'junit',
      {
        outputFile: 'reports/junit/results.xml',
      },
    ],
    // Generate binary results for sharded tests, to be merged later into a single report
    [
      'blob',
      {
        outputDir: 'reports/blob',
      },
    ],
    // Generate comprehensive Allure reports with detailed test steps and suite metadata
    [
      'allure-playwright',
      {
        resultsDir: 'reports/allure/allure-results',
        outputFolder: 'reports/allure/allure-results',
        detail: true,
        suiteTitle: true,
      },
    ],
    // Generate a customized, themed HTML report with project metadata and embedded screenshots
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
  // Shared configuration for every test, including context and device settings
  use: {
    // Set base URL so relative paths in page.goto() are resolved automatically
    baseURL: CONFIG.ENV.PAGE_URL,
    // Ignore HTTPS errors (e.g., self-signed or invalid SSL certificates)
    ignoreHTTPSErrors: true,
    // Bypass Content Security Policy to allow injecting scripts/styles during tests
    bypassCSP: true,
    // Disable timeout for actions (wait indefinitely for each action)
    actionTimeout: 0,
    // Disable timeout for page navigation (wait indefinitely for page loads)
    navigationTimeout: 0,
    // Prevent service workers from running so tests always get fresh network responses (no cached/offline behavior)
    serviceWorkers: 'block',
    // Enable tracing only when a test fails and is retried (helps debug flaky tests)
    trace: 'on-first-retry',
    // Record video only when a test fails on the first retry (useful for debugging flaky tests)
    video: 'on-first-retry',
    // Take a screenshot only when a test fails (helps debug failures without storing unnecessary images)
    screenshot: 'on-first-failure',
    // Run browser in headless mode (no UI window is shown)
    headless: true,
    // Set browser viewport size to 1280x720 for consistent test rendering
    viewport: { width: 1280, height: 720 },
    // Force the browser to use dark mode (prefers-color-scheme: dark)
    colorScheme: 'dark',
    // Enable JavaScript execution in the browser (required for most modern web apps)
    javaScriptEnabled: true,
    // Block any file downloads in tests so nothing is saved to disk (e.g. PDF, images, ZIP)
    acceptDownloads: false,
    // Ensure the browser runs with network enabled (not offline mode)
    offline: false,
    launchOptions: {
      // No delay between actions (run tests at full speed)
      slowMo: 0,
      // Pass Chromium launch flags to disable sandboxing, reduce resource usage, and improve stability in CI environments
      args: [
        '--disable-gpu',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--start-maximized',
      ],
    },
    // Run tests using a desktop browser profile (not emulating a mobile device)
    isMobile: false,
    // Set pixel density to 1 (standard display scaling, no zoom or retina scaling)
    deviceScaleFactor: 1,
    // Grant browser permissions (notifications, camera, microphone, clipboard read/write) during tests
    permissions: ['notifications', 'camera', 'microphone', 'clipboard-read', 'clipboard-write'],
    // Simulate user preference for reduced motion (disables animations/transitions for accessibility testing)
    contextOptions: {
      reducedMotion: 'reduce',
    },
  },
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

    // Define a setup project that runs only files ending with .setup.ts (used for global test initialization)
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    // Chromium project using Desktop Chrome device settings, reduced motion for accessibility, and depends on setup project
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        contextOptions: { reducedMotion: 'reduce' },
      },
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
    // {
    //   name: "Mobile Chrome",
    //   use: { ...devices["Pixel 5"] },
    //   dependencies: ['setup'],
    // },
    // {
    //   name: "Mobile Safari",
    //   use: { ...devices["iPhone 12"] },
    //   dependencies: ['setup'],
    // },
    // {
    //   name: "Microsoft Edge",
    //   use: { ...devices["Desktop Edge"], channel: "msedge" },
    //   dependencies: ['setup'],
    // },
    // {
    //   name: "Google Chrome",
    //   use: { ...devices["Desktop Chrome"], channel: "chrome" },
    //   dependencies: ['setup'],
    // },
  ],
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env['CI'],
  // },
});
