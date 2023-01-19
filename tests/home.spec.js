const { test, expect } = require('./setup.js');

test('Home has the correct title', async ({ tinyHelpers }) => {
  await expect(tinyHelpers).toHaveTitle(/Tiny Helpers/);
  await page.screenshot({ path: 'home.jpg' });
});
