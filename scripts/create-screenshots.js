const puppeteer = require('puppeteer');
const slugify = require('slugify');
const { mkdir, stat } = require('fs').promises;
const { join } = require('path');
const Jimp = require('jimp');

const helpers = require('../helpers.json');

// TODO parallize all this stuff to speed it up
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

    const imagePaths = [];
    for await (const helper of helpers) {
      console.log(`Screenshoting ${helper.name}...`);
      await page.goto(helper.url);
      const path = `static/screenshots/${slugify(
        helper.name.toLowerCase()
      )}@2.jpg`;
      await page.screenshot({
        path
      });

      imagePaths.push(path);
    }
    await browser.close();
    console.log('Screenshots taken...');

    console.log('Resizing images...');
    for await (const path of imagePaths) {
      console.log(`Resizing ${path}...`);
      const image = await Jimp.read(path);
      await image
        .quality(75)
        .resize(500, Jimp.AUTO)
        .write(`${path.split('@')[0]}@1.jpg`);
    }
  } catch (error) {
    console.error(error);
  }
})();
