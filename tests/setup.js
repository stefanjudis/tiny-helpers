const { test, expect } = require('@playwright/test');

exports.expect = expect;
exports.test = test.extend({
  tinyHelpers: async ({ page }, use) => {
    await page.goto('https://www.tiny-helpers.dev/');
    await use(page);
  },
});
