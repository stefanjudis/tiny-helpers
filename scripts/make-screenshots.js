const puppeteer = require('puppeteer');
const slugify = require('slugify');
const helpers = require('../data/helpers.json');
const { mkdir, stat } = require('fs').promises;
const { join } = require('path');

(async () => {
  try {
    const screenshotDir = join(__dirname, '..', 'static', 'screenshots');

    try {
      await stat(screenshotDir);
    } catch (e) {
      if (e.code === 'ENOENT') {
        console.log('Creating screenshot directory...');
        await mkdir(screenshotDir);
      } else {
        throw e;
      }
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setViewport({
      width: 1000,
      height: 600
    });

    // TODO parallize that
    for await (const helper of helpers) {
      console.log(`Screenshoting ${helper.name}...`);

      await page.goto(helper.url);
      await page.screenshot({
        path: `static/screenshots/${slugify(helper.name.toLowerCase())}.jpg`
      });
    }

    await browser.close();

    console.log('Screenshots taken...');
  } catch (error) {
    console.error(error);
  }
})();
