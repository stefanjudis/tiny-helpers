/**
 * Removes helpers that failed the Checkly "Helper availability" check on the
 * last FAILED_RUN_THRESHOLD runs in every location.
 *
 * Used by .github/workflows/remove-dead-helpers.yml.
 */
const { readdir, readFile, unlink, appendFile, writeFile } =
  require('fs').promises;
const path = require('path');

// Not using lib/helpers.js so the workflow can skip `npm ci`.
const helpersDir = path.resolve(__dirname, '..', 'helpers');

const API_URL = 'https://api.checklyhq.com';
const CHECK_NAME = 'Helper availability';
const MARKER_PATTERN = /DEAD_HELPERS:([A-Za-z0-9+/=]+):END/;

const {
  CHECKLY_API_KEY,
  CHECKLY_ACCOUNT_ID,
  CHECK_ID,
  FAILED_RUN_THRESHOLD = '3',
  LOCATION_COUNT = '2',
  MAX_REMOVALS = '10',
  SUMMARY_FILE = 'dead-helpers-summary.md',
  GITHUB_OUTPUT,
} = process.env;

async function checklyApi(pathname) {
  const response = await fetch(`${API_URL}${pathname}`, {
    headers: {
      Authorization: `Bearer ${CHECKLY_API_KEY}`,
      'X-Checkly-Account': CHECKLY_ACCOUNT_ID,
    },
  });
  if (!response.ok) {
    throw new Error(`Checkly API ${pathname} failed: ${response.status}`);
  }
  return response.json();
}

async function findCheckId() {
  if (CHECK_ID) return CHECK_ID;
  for (let page = 1; ; page++) {
    const checks = await checklyApi(`/v1/checks?limit=100&page=${page}`);
    const check = checks.find(({ name }) => name === CHECK_NAME);
    if (check) return check.id;
    if (checks.length < 100) throw new Error(`No check named "${CHECK_NAME}"`);
  }
}

function getDeadUrls(result) {
  const match = JSON.stringify(result).match(MARKER_PATTERN);
  if (!match) return [];
  return JSON.parse(Buffer.from(match[1], 'base64').toString('utf8'));
}

async function getHelperFilesByUrl() {
  const files = (await readdir(helpersDir)).filter((f) => f.endsWith('.json'));
  const entries = await Promise.all(
    files.map(async (file) => {
      const helper = JSON.parse(await readFile(path.join(helpersDir, file)));
      return [helper.url, { file, helper }];
    }),
  );
  return new Map(entries);
}

async function setOutput(name, value) {
  console.log(`${name}=${value}`);
  if (GITHUB_OUTPUT) await appendFile(GITHUB_OUTPUT, `${name}=${value}\n`);
}

(async () => {
  const checkId = await findCheckId();
  // A run in every location produces one final result per location.
  const resultCount = Number(FAILED_RUN_THRESHOLD) * Number(LOCATION_COUNT);

  const results = await checklyApi(
    `/v1/check-results/${checkId}?limit=${resultCount}&resultType=FINAL`,
  );
  results.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
  const latest = results.slice(0, resultCount);

  if (latest.length < resultCount) {
    console.log(`Only ${latest.length}/${resultCount} results, nothing to do.`);
    await setOutput('removed', 0);
    return;
  }

  // List results can omit the error details, so read every result in full.
  const deadUrlsPerResult = await Promise.all(
    latest.map(async ({ id }) =>
      getDeadUrls(await checklyApi(`/v1/check-results/${checkId}/${id}`)),
    ),
  );
  const [first, ...rest] = deadUrlsPerResult;
  const deadUrls = first.filter((url) =>
    rest.every((urls) => urls.includes(url)),
  );

  const helperFiles = await getHelperFilesByUrl();
  const toRemove = deadUrls
    .map((url) => helperFiles.get(url))
    .filter(Boolean)
    .sort((a, b) => a.helper.name.localeCompare(b.helper.name));

  const list = toRemove
    .map(
      ({ file, helper }) =>
        `- [${helper.name}](${helper.url}) (\`helpers/${file}\`)`,
    )
    .join('\n');

  if (toRemove.length > Number(MAX_REMOVALS)) {
    await writeFile(
      SUMMARY_FILE,
      `The last ${FAILED_RUN_THRESHOLD} runs of the Checkly "${CHECK_NAME}" check found ${toRemove.length} unavailable helpers. That's more than the limit of ${MAX_REMOVALS}, so nothing was removed automatically. Please check whether the check itself is broken.\n\n${list}\n`,
    );
    await setOutput('too_many', true);
    await setOutput('removed', 0);
    return;
  }

  await Promise.all(
    toRemove.map(({ file }) => unlink(path.join(helpersDir, file))),
  );
  await writeFile(
    SUMMARY_FILE,
    `These helpers failed the Checkly "${CHECK_NAME}" check on the last ${FAILED_RUN_THRESHOLD} runs in every location and were removed:\n\n${list}\n`,
  );
  await setOutput('removed', toRemove.length);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
