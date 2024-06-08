const { readFile, readdir, writeFile } = require('fs').promises;
const { toSlug } = require('./slug');
const path = require('path');

const helpersDir = path.resolve(__dirname, '..', 'helpers');

async function getHelpers() {
  const helpers = Object.values({
    ...(await getHelpersFromFiles()),
  });
  helpers.sort((a, b) =>
    a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
  );
  return helpers;
}

async function getHelpersFromFiles() {
  const files = (await readdir(helpersDir)).filter((name) =>
    name.endsWith('.json')
  );
  const texts = await Promise.all(
    files.map((name) => readFile(path.join(helpersDir, name)))
  );
  const helpers = texts.map((text) => JSON.parse(text));
  return Object.fromEntries(helpers.map((h) => [h.name, h]));
}

async function writeHelper(helper) {
  const filePath = path.join(helpersDir, `${toSlug(helper.name)}.json`);
  const data = JSON.stringify(helper, null, 2) + '\n';
  await writeFile(filePath, data);
  return filePath;
}

function getTags(helpers) {
  return [
    ...helpers.reduce((acc, cur) => {
      cur.tags.forEach((tag) => acc.add(tag.toLowerCase()));
      return acc;
    }, new Set()),
  ].sort((a, b) => (a < b ? -1 : 1));
}

module.exports.getTags = getTags;
module.exports.getHelpers = getHelpers;
module.exports.helpersDir = helpersDir;
module.exports.writeHelper = writeHelper;
