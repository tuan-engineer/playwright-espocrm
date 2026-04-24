import { test as setup } from '@playwright/test';
import { CONFIG } from "@cfg";
import { LoginPage } from "@tests/examples/pages/LoginPage";
import { isSessionValid } from "@src-core/Core";

setup('Login to the system and save session', async ({ page }) => {
    const loginPage = new LoginPage(page);
    if (!isSessionValid()) {
      await page.goto(CONFIG.ENV.PAGE_URL);
      await page.locator('#login-form').waitFor({ state: 'visible' });
      await loginPage.login(CONFIG.ENV.PAGE_ADMIN_USERNAME, CONFIG.ENV.PAGE_ADMIN_PASSWORD);
      await page.locator('.dashlets').waitFor({ state: 'visible' });
      await page.context().storageState({ path: CONFIG.ROOT.STORAGE_PATH });
    }
});
