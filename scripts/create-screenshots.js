const pLimit = require('p-limit');
const chrome = require('chrome-aws-lambda');
const { statSync, mkdirSync } = require('fs');
const { join } = require('path');
const copyDir = require('copy-dir');
const Jimp = require('jimp');
const { getHelpers } = require('../lib/helpers');
const { toSlug } = require('../lib/slug');

function exists(path) {
  try {
    statSync(path);
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') return false;
    throw err;
  }
}

function sleep(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

async function screenshotHelper(browser, helper, screenshotDir) {
  try {
    const doubleSize = join(screenshotDir, `${toSlug(helper.name)}@2.jpg`);
    const singleSize = join(screenshotDir, `${toSlug(helper.name)}@1.jpg`);
    let sigil = '✅';
    if (!(await exists(doubleSize))) {
      const page = await browser.newPage();
      page.setViewport({
        width: 1000,
        height: 600,
      });
      await page.goto(helper.url, { waitUntil: 'networkidle0' });

      await page.screenshot({ path: doubleSize });
      await page.close();
      sigil = '📸';
    }
    if (!exists(singleSize)) {
      await (await Jimp.read(doubleSize))
        .quality(75)
        .resize(500, Jimp.AUTO)
        .write(singleSize);
    }
    console.log(`${sigil} ${helper.name} at ${helper.url}`);
  } catch (error) {
    console.error(`Failed to screenshot ${helper.name}`);
    throw error;
  }
}

async function makeScreenshots(helpers, { screenshotCacheDir }) {
  console.log('Taking screenshots...');
  const browser = await chrome.puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: true,
  });
  const limit = pLimit(8);
  const screenshotPromises = helpers.map((helper) =>
    limit(() => screenshotHelper(browser, helper, screenshotCacheDir))
  );
  await Promise.all(screenshotPromises);
  await browser.close();
}

(async () => {
  try {
    const screenshotCacheDir = join(__dirname, '..', '.cache', 'screenshots');

    if (!exists(screenshotCacheDir)) {
      mkdirSync(screenshotCacheDir, { recursive: true });
    }

    const helpers = await getHelpers();

    await makeScreenshots(helpers, { screenshotCacheDir });

    const publicScreenshotDir = join(__dirname, '..', 'static', 'screenshots');
    copyDir.sync(screenshotCacheDir, publicScreenshotDir);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
