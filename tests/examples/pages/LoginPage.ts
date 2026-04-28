import type { Locator, Page } from '@playwright/test';

export class LoginPage {
  protected readonly page: Page;
  protected readonly userNameInput: Locator;
  protected readonly passwordInput: Locator;
  protected readonly loginButton: Locator;
  constructor(page: Page) {
    this.page = page;
    this.userNameInput = page.locator("input[id='field-userName']");
    this.passwordInput = page.locator("input[id='field-password']");
    this.loginButton = page.locator("button[id='btn-login']");
  }
  async login(username: string, password: string): Promise<void> {
    await this.userNameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
