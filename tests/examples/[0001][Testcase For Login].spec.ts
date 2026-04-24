import { test, expect } from "@playwright/test";
import { CONFIG } from "@cfg";
import { LoginPage } from '@test-examples/pages/LoginPage';
import { DataFaker } from '@src-utils/DataFaker';

test.use({
  launchOptions: {
    slowMo: 1000
  },
  headless: false,
  actionTimeout: 60000,
  navigationTimeout: 60000,
  viewport: { width: 1280, height: 720 }
});

test.describe('[0001][Testcase For Login]', () => {
  let loginPage: LoginPage;

  test.beforeEach(({ page }) => {
    loginPage = new LoginPage(page);
  });

  test("TC-LOGIN-001: Successful login", async ({
    page,
  }) => {
    await page.goto(CONFIG.ENV.PAGE_URL);
    await page.locator('#login-form').waitFor({ state: 'visible' });
    await loginPage.login(CONFIG.ENV.PAGE_ADMIN_USERNAME, CONFIG.ENV.PAGE_ADMIN_PASSWORD);
    await expect(page.locator('.dashlets')).toBeVisible();
  });

  test("TC-LOGIN-002: Failed login - wrong password", async ({
    page,
  }) => {
    await page.goto('/');
    await page.locator('#login-form').waitFor({ state: 'visible' });
    await loginPage.login(CONFIG.ENV.PAGE_ADMIN_USERNAME, DataFaker.getStrongPassword());
    await expect(page.locator('.alert-danger .message:has-text("Wrong username/password")')).toBeVisible();
  });
});
