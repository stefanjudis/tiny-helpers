const { test, expect } = require('@playwright/test');

const pageUrl = process.env.ENVIRONMENT_URL || 'https://www.tiny-helpers.dev';

test('Mac Demo Home', async ({ page }) => {
  console.log(`Using pageUrl: ${pageUrl}`);
  const response = await page.goto(pageUrl);
  expect(response.status()).toBe(200);
  await expect(page).toHaveTitle(/Tiny Helperssss/);
  await page.screenshot({ path: 'home.jpg' });
});
