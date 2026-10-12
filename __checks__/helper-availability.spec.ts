import { test, type APIRequestContext } from '@playwright/test';

type Helper = { name: string; url: string };

const pageUrl = process.env.ENVIRONMENT_URL || 'https://www.tiny-helpers.dev';

const CONCURRENCY = 50;
const TIMEOUT = 10_000;
const RETRY_DELAY = 30_000;
const USER_AGENT =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36 tiny-helpers-availability-check';

// Sites often block bots or require a login. These say nothing about the tool being gone.
const ALIVE_STATUS_CODES = [401, 403, 429];

const PARKED_DOMAIN_PATTERN =
  /this domain (is|may be) for sale|buy this domain|domain is parked|parked free|hugedomains\.com|sedo\.com\/search|dan\.com\/buy-domain|afternic\.com/i;

async function checkHelper(
  request: APIRequestContext,
  helper: Helper,
): Promise<{ reason: string } | null> {
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
    return { reason: (error as Error).message.split('\n')[0] };
  }
}

async function checkAll(
  request: APIRequestContext,
  helpers: Helper[],
): Promise<Array<Helper & { reason: string }>> {
  const dead: Array<Helper & { reason: string }> = [];
  let index = 0;
  async function worker() {
    while (index < helpers.length) {
      const helper = helpers[index++];
      const result = await checkHelper(request, helper);
      if (result) dead.push({ ...helper, reason: result.reason });
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return dead;
}

test('Listed helpers are available', async ({ request }) => {
  test.setTimeout(240_000);

  const helpers: Helper[] = await (
    await request.get(`${pageUrl}/helpers.json`)
  ).json();
  console.log(`Checking ${helpers.length} helpers...`);

  const failed = await checkAll(request, helpers);

  // Give failing helpers a second chance to rule out short hiccups.
  if (failed.length) {
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
  }
  const dead = await checkAll(request, failed);

  // The removal workflow (.github/workflows/remove-dead-helpers.yml) reads
  // these lines from the `checkly test` output.
  for (const { name, url, reason } of dead) {
    console.log(`DEAD_HELPER ${JSON.stringify({ name, url, reason })}`);
  }

  if (dead.length) {
    throw new Error(`${dead.length} helper(s) unavailable`);
  }
});
