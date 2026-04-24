import { test as setup } from '@playwright/test';
import { CONFIG } from "@cfg";
import { LoginPage } from "@tests/examples/pages/LoginPage";
import { isSessionValid } from "@src-core/Core";

setup('Login to the system and save session', async ({ page }) => {
    const loginPage = new LoginPage(page);
    if (!isSessionValid()) {
      await page.goto('/');
      await page.waitForSelector('#login-form', { state: 'visible' });
      await loginPage.login(CONFIG.ENV.PAGE_ADMIN_USERNAME, CONFIG.ENV.PAGE_ADMIN_PASSWORD);
      await page.waitForSelector('.dashlets', { state: 'visible' });
      await page.context().storageState({ path: CONFIG.ROOT.STORAGE_PATH });
    }
});
