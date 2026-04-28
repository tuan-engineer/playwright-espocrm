import { test, expect } from '@playwright/test';
import { CONFIG } from '@cfg';
import { LoginPage } from '@test-examples/pages/LoginPage';
import { DataFaker } from '@src-utils/DataFaker';
import { Database } from '@src-utils/Database';

test.use({
  launchOptions: {
    slowMo: 1000,
  },
  headless: false,
  actionTimeout: 60000,
  navigationTimeout: 60000,
  viewport: { width: 1280, height: 720 },
});

test.describe('[0001][Testcase For Login]', () => {
  let loginPage: LoginPage;
  let db: Database;

  test.beforeEach(({ page }) => {
    loginPage = new LoginPage(page);
    db = new Database();
  });

  test.afterAll(async () => {
    await db.close();
  });

  test('TC-LOGIN-001: Successful login', async ({ page }) => {
    await page.goto(CONFIG.ENV.BASE_URL);
    await page.locator('#login-form').waitFor({ state: 'visible' });
    await loginPage.login(CONFIG.ENV.ADMIN_USERNAME, CONFIG.ENV.ADMIN_PASSWORD);
    await expect(page.locator('.dashlets')).toBeVisible();
  });

  test('TC-LOGIN-002: Failed login - wrong password', async ({ page }) => {
    await page.goto(CONFIG.ENV.BASE_URL);
    await page.locator('#login-form').waitFor({ state: 'visible' });
    await loginPage.login(CONFIG.ENV.ADMIN_USERNAME, DataFaker.getStrongPassword());
    await expect(
      page.locator('.alert-danger .message:has-text("Wrong username/password")'),
    ).toBeVisible();
  });
});
