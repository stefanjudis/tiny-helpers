/**
 * Removes the helpers reported as dead in the `checkly test` output of the
 * "Helper availability" check and writes a summary for the pull request.
 *
 * Usage: node scripts/remove-dead-helpers.js <checkly-output-file>
 *
 * Used by .github/workflows/remove-dead-helpers.yml.
 */
const { readdir, readFile, unlink, appendFile, writeFile } =
  require('fs').promises;
const path = require('path');

// Not using lib/helpers.js so the workflow can skip `npm ci`.
const helpersDir = path.resolve(__dirname, '..', 'helpers');

const DEAD_HELPER_PATTERN = /DEAD_HELPER (\{.*\})/;
const ANSI_PATTERN = /\x1b\[[0-9;]*m/g;

const { SUMMARY_FILE = 'dead-helpers-summary.md', GITHUB_OUTPUT } = process.env;

function getDeadHelpers(output) {
  const deadHelpers = new Map();
  for (const line of output.replace(ANSI_PATTERN, '').split('\n')) {
    const match = line.match(DEAD_HELPER_PATTERN);
    // Logs can show up twice (streamed and in the final result).
    if (match) {
      const helper = JSON.parse(match[1]);
      deadHelpers.set(helper.url, helper);
    }
  }
  return deadHelpers;
}

async function getHelperFilesByUrl() {
  const files = (await readdir(helpersDir)).filter((f) => f.endsWith('.json'));
  const entries = await Promise.all(
    files.map(async (file) => {
      const helper = JSON.parse(await readFile(path.join(helpersDir, file)));
      return [helper.url, file];
    }),
  );
  return new Map(entries);
}

async function setOutput(name, value) {
  console.log(`${name}=${value}`);
  if (GITHUB_OUTPUT) await appendFile(GITHUB_OUTPUT, `${name}=${value}\n`);
}

(async () => {
  const deadHelpers = getDeadHelpers(await readFile(process.argv[2], 'utf8'));
  const helperFiles = await getHelperFilesByUrl();

  const toRemove = [...deadHelpers.values()]
    .filter(({ url }) => helperFiles.has(url))
    .map((helper) => ({ ...helper, file: helperFiles.get(helper.url) }))
    .sort((a, b) => a.name.localeCompare(b.name));

  await Promise.all(
    toRemove.map(({ file }) => unlink(path.join(helpersDir, file))),
  );

  const list = toRemove
    .map(
      ({ name, url, reason, file }) =>
        `- [${name}](${url}): ${reason} (\`helpers/${file}\`)`,
    )
    .join('\n');
  await writeFile(
    SUMMARY_FILE,
    `These helpers failed the daily Checkly "Helper availability" check, including a retry:\n\n${list}\n`,
  );
  await setOutput('dead', deadHelpers.size);
  await setOutput('removed', toRemove.length);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
