import { type Page, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { AxeResults } from 'axe-core';

// Tách tags ra ngoài để dễ quản lý hoặc mở rộng sau này
const DEFAULT_WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

export class AccessibilityPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Hàm quét tối ưu hóa
   * @param options { selector, exclude, tags }
   */
  async scan(
    options: { selector?: string; exclude?: string[]; tags?: string[] } = {},
  ): Promise<AxeResults> {
    const { selector, exclude, tags } = options;

    // 1. Chờ đợi thông minh: Chỉ đợi domcontentloaded nếu trang chưa load xong
    await this.page.waitForLoadState('domcontentloaded');

    const builder = new AxeBuilder({ page: this.page });

    // 2. Cấu hình Builder (Fluent API)
    builder.withTags(tags ?? DEFAULT_WCAG_TAGS);

    if (selector) {
      // Tối ưu: Chỉ tạo locator 1 lần và đợi nó hiển thị
      const target = this.page.locator(selector);
      await target.waitFor({ state: 'visible' });
      builder.include(selector);
    } else {
      // Tối ưu: Thay vì fix cứng 1s, ta có thể đợi mạng ổn định (tùy chọn)
      await this.page.waitForLoadState('networkidle').catch(() => {
        /* ignore timeout */
      });
    }

    if (exclude?.length) {
      builder.exclude(exclude);
    }

    // 3. Thực thi và xử lý kết quả
    try {
      const results = await builder.analyze();

      // Đính kèm vào report (Không cần await nếu không cần đồng bộ hóa nghiêm ngặt)
      await test.info().attach('accessibility-report', {
        body: JSON.stringify(results, null, 2),
        contentType: 'application/json',
      });

      return results;
    } catch (error) {
      throw new Error(
        `Axe analysis failed: ${error instanceof Error ? error.message : String(error)}`,
        { cause: error },
      );
    }
  }
  logSummary(results: AxeResults): void {
    const { violations } = results;

    if (violations.length === 0) {
      // Thay vì console.log, dùng console.warn (nếu ESLint cho phép)
      console.warn('✅ Không tìm thấy lỗi Accessibility nào.');
      return;
    }

    // Chuyển tất cả thành console.error để in ra terminal
    console.error(
      `\n================ ACCESSIBILITY SUMMARY: ${violations.length} LỖI ================`,
    );

    violations.forEach((v, index) => {
      console.error(`${index + 1}. [${v.impact?.toUpperCase()}] - ${v.id}`);
      console.error(`   👉 Mô tả: ${v.help}`);
      console.error(`   🛠  Cách sửa: ${v.helpUrl}`);
      console.error(`   📍 Số phần tử bị ảnh hưởng: ${v.nodes.length}`);
      console.error('------------------------------------------------------------------');
    });
  }
}
