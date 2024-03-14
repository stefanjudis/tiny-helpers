const chromium = require('@sparticuz/chromium-min');
const puppeteer = require('puppeteer-core');
let _page;

// get platform specific chrome executable for local environment
const exePath = process.platform === "win32"
        ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
        : process.platform === "linux"
        ? "/usr/bin/google-chrome"
        : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

async function getOptions(isDev) {
    let options;
    console.log('exePath:', exePath);
    if (isDev) {
        options = {
        args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
        executablePath: exePath,
        headless: 'new',
        };
    } else {
        options = {
            args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(
                `https://github.com/Sparticuz/chromium/releases/download/v116.0.0/chromium-v116.0.0-pack.tar`
            ),
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        };
    }
    return options;
}

async function getBrowser() {
  const isDevEnv = process.env.NODE_ENV == 'development';
  const options = await getOptions(isDevEnv);
  return puppeteer.launch(options);
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
