const { readFile, writeFile } = require('fs').promises;
const path = require('path');
const postcss = require('postcss');

module.exports = async () => {
  const rawFilePath = path.join(
    __dirname,
    '..',
    '_includes',
    'css',
    'index.css'
  );
  const rawCSS = await readFile(rawFilePath, 'utf8');
  const css = await postcss([
    require('postcss-import'),
    require('postcss-nested'),
    require('postcss-clean')
  ]).process(rawCSS, { from: rawFilePath });

  return css;
};
