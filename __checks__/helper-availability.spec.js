const { test } = require('@playwright/test');

const pageUrl = process.env.ENVIRONMENT_URL || 'https://www.tiny-helpers.dev';

const CONCURRENCY = 50;
const TIMEOUT = 10_000;
const USER_AGENT =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36 tiny-helpers-availability-check';

// Sites often block bots or require a login. These say nothing about the tool being gone.
const ALIVE_STATUS_CODES = [401, 403, 429];

const PARKED_DOMAIN_PATTERN =
  /this domain (is|may be) for sale|buy this domain|domain is parked|parked free|hugedomains\.com|sedo\.com\/search|dan\.com\/buy-domain|afternic\.com/i;

async function checkHelper(request, helper) {
  try {
    const response = await request.get(helper.url, {
      timeout: TIMEOUT,
      maxRedirects: 10,
      failOnStatusCode: false,
      headers: { 'user-agent': USER_AGENT },
    });
    const status = response.status();

    if (status < 400) {
      const body = await response.text().catch(() => '');
      if (PARKED_DOMAIN_PATTERN.test(body)) {
        return { reason: 'parked domain' };
      }
      return null;
    }

    if (ALIVE_STATUS_CODES.includes(status)) return null;

    return { reason: `HTTP ${status}` };
  } catch (error) {
    return { reason: error.message.split('\n')[0] };
  }
}

test('Listed helpers are available', async ({ request }) => {
  test.setTimeout(240_000);

  const helpers = await (await request.get(`${pageUrl}/helpers.json`)).json();
  console.log(`Checking ${helpers.length} helpers...`);

  const dead = [];
  let index = 0;
  async function worker() {
    while (index < helpers.length) {
      const helper = helpers[index++];
      const result = await checkHelper(request, helper);
      if (result) {
        console.log(`❌ ${helper.name} (${helper.url}): ${result.reason}`);
        dead.push({
          name: helper.name,
          url: helper.url,
          reason: result.reason,
        });
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  if (dead.length) {
    // The marker lets the removal workflow parse the dead helpers from the check result.
    throw new Error(
      `${dead.length} helper(s) unavailable. DEAD_HELPERS:${JSON.stringify(
        dead.map(({ url }) => url),
      )}:END`,
    );
  }
});
