const chromium = require('@sparticuz/chromium-min');
const puppeteer = require('puppeteer-core');
let _page;

async function getBrowser() {
  console.log('-----------');
  const executablePath = await chromium.executablePath();
  console.log({ executablePath });

  return puppeteer.launch({
    args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(
      `https://tiny-helpers.dev/chromium/chromium.br`
    ),
    headless: true,
    ignoreHTTPSErrors: true,
  });

  // return chromium.puppeteer.launch({
  //   args: chromium.args,
  //   executablePath,
  //   headless: true,
  // });
}

async function getPage() {
  if (_page) return _page;

  const browser = await getBrowser();
  _page = await browser.newPage();
  return _page;
}

function checkUrl(string) {
  var url = '';
  try {
    url = new URL(string);
  } catch (error) {
    return false;
  }
  return true;
}

export async function getScreenshot(url, ratio = 1) {
  const page = await getPage();
  await page.goto(url, {
    waitUntil: 'domcontentloaded',
  });
  await page.setViewport({
    width: 1000,
    height: 600,
    devicePixelRatio: ratio,
  });
  const file = await page.screenshot();
  return file;
}

module.exports = async (req, res) => {
  if (!req.query.url) return res.status(400).send('No url query specified.');
  if (!checkUrl(req.query.url))
    return res.status(400).send('Invalid url query specified.');
  try {
    const file = await getScreenshot(req.query.url, req.query.ratio);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader(
      'Cache-Control',
      'public, immutable, no-transform, s-maxage=604800, max-age=604800'
    );
    res.status(200).end(file);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(
        'The server encountered an error. You may have inputted an invalid query.'
      );
  }
};
