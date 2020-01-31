const pLimit = require('p-limit');
const puppeteer = require('puppeteer');
const { stat } = require('fs').promises;
const { join } = require('path');
const Jimp = require('jimp');
const { getHelpers } = require('../lib/helpers');
const { toSlug } = require('../lib/slug');

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') return false;
    throw err;
  }
}

async function makeScreenshots(browser, helper, screenshotDir) {
  const doubleSize = join(screenshotDir, `${toSlug(helper.name)}@2.jpg`);
  const singleSize = join(screenshotDir, `${toSlug(helper.name)}@1.jpg`);
  let sigil = '✅';
  if (!(await exists(doubleSize))) {
    const page = await browser.newPage();
    page.setViewport({
      width: 1000,
      height: 600
    });
    await page.goto(helper.url);
    await page.screenshot({ path: doubleSize });
    await page.close();
    sigil = '📸';
  }
  if (!(await exists(singleSize))) {
    await (await Jimp.read(doubleSize))
      .quality(75)
      .resize(500, Jimp.AUTO)
      .write(singleSize);
  }
  console.log(`${sigil} ${helper.name} at ${helper.url}`);
}

(async () => {
  const screenshotDir = join(__dirname, '..', 'static', 'screenshots');
  const helpers = await getHelpers();
  console.log('Taking screenshots...');
  const browser = await puppeteer.launch();
  const limit = pLimit(8);
  const screenshotPromises = helpers.map((helper) =>
    limit(() => makeScreenshots(browser, helper, screenshotDir))
  );
  await Promise.all(screenshotPromises);
  await browser.close();
})();
