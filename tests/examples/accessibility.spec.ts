import { test } from '@playwright/test';
import { logError } from '@core/Core';

test('Check accessibility login form', async ({ page }) => {
  logError("sdfsdfsdfsdf", "543534545", 'info');

  // Có await ở đây, lỗi "Async arrow function has no await" sẽ biến mất
  await page.goto('https://codezy.io.vn');
  // await page.pause();

});

test('tes', async () => {
  // 1. Cảnh báo: Biến không được sử dụng (no-unused-vars)
  const unusedVar = 'Tôi không được dùng';

  // 2. Cảnh báo: So sánh không chặt chẽ (eqeqeq)
  // if (1 == 1) {
  //   log('Cấu hình Warn đang hoạt động!');
  // }

  // // 3. Cảnh báo: Hàm async nhưng không có await (require-await)
  // const demoWarn = async () => {
  //   log('Hàm này không có await bên trong');
  // };

  // await demoWarn();
});
