import type { Page } from '@playwright/test';
import { LoginPage } from '@test-examples/pages/LoginPage';

export class AccountPage extends LoginPage {
  constructor(page: Page) {
    super(page);
  }
  override async login(username: string, password: string): Promise<void> {
    await super.login(username, password);
  }
}
