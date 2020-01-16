const path = require('path');

const helpersDir = path.resolve(__dirname, '..', 'helpers');

async function getHelpers() {
  return require('../helpers.json');
}

async function writeHelper(helper) {
  throw new Error('Implemented soon!');
}

function getTags(helpers) {
  return [
    ...helpers.reduce((acc, cur) => {
      cur.tags.forEach(tag => acc.add(tag));
      return acc;
    }, new Set())
  ].sort((a, b) => (a < b ? -1 : 1));
}

module.exports.getTags = getTags;
module.exports.getHelpers = getHelpers;
module.exports.helpersDir = helpersDir;
module.exports.writeHelper = writeHelper;
