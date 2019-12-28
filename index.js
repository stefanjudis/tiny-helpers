require = require('esm')(module);
const { renderApp } = require('./src/server.js');

const { readFile: fsReadFile } = require('fs');
const { promisify } = require('util');
const { join } = require('path');
const readFile = promisify(fsReadFile);

module.exports = async (req, res) => {
  const { category } = {
    ...req.query
  };

  const css = await readFile(join(__dirname, 'static', 'main.css'));
  res.status(200).send(renderApp({}));
};
