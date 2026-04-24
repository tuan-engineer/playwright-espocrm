import { test, expect } from '@playwright/test';
import { Accessibility } from '@utils/Accessibility';
import { generateId } from '@core/Core';

test.use({
  headless: false,
  launchOptions: {
    slowMo: 1000,
  },
  video: 'on',
  trace: 'on',
});

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test('full page - no violations', async ({ page }) => {
  await page.goto('/');
  const axe = new Accessibility(page);
  await axe.expectNoViolations();
});

test('sdf', async ({ page }) => {
  console.log(generateId());
});
