const chrome = require('chrome-aws-lambda');
let _page;

async function getBrowser() {
  const executablePath = await chrome.executablePath;

  // local development
  if (!executablePath) {
    const puppeteer = await import('puppeteer').then((m) => {
      return m.default;
    });

    return puppeteer.launch({
      args: chrome.args,
      headless: true,
      ignoreHTTPSErrors: true,
    });
  }

  return chrome.puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: true,
  });
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
  await page.goto(url);
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
      'public, immutable, no-transform, s-maxage=86400, max-age=86400'
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
