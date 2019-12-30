require = require('esm')(module);
const { renderApp } = require('./src/server.js');

const { readFile: fsReadFile } = require('fs');
const { promisify } = require('util');
const { join } = require('path');
const readFile = promisify(fsReadFile);

module.exports = async (req, res) => {
  let { tag } = {
    ...req.query
  };

  // todo that's dirty
  if (!tag || !tag.length) {
    tag = 'all';
  }

  const css = await readFile(join(__dirname, 'static', 'main.css'));
  // TODO work on inlining this
  // const js = await readFile(join(__dirname, 'static', 'bundle.js'));
  res.status(200).send(renderApp({ css, tag }));
};
