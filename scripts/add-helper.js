const inquirer = require('inquirer');
const { writeFile } = require('fs').promises;
const { join } = require('path');

(async () => {
  try {
    let helpers = require('../helpers.json');
    let tags = [
      ...helpers.reduce((acc, cur) => {
        cur.tags.forEach(tag => acc.add(tag));
        return acc;
      }, new Set())
    ].sort((a, b) => (a < b ? -1 : 1));

    const newHelper = await inquirer.prompt([
      {
        name: 'name',
        type: 'input',
        message: 'Enter the name of the helper tool:'
      },
      { name: 'desc', type: 'input', message: 'Enter a description:' },
      { name: 'url', type: 'input', message: 'Enter a URL:' },
      {
        name: 'tags',
        type: 'checkbox',
        message: 'Pick some tags:',
        choices: tags
      },
      {
        name: 'maintainers',
        type: 'input',
        message: 'Enter GitHub handles of maintainers (comma separated):'
      }
    ]);

    newHelper.addedAt = new Date().toISOString().substring(0, 10);
    newHelper.maintainers = newHelper.maintainers.length
      ? newHelper.maintainers.split(',')
      : [];
    helpers.push(newHelper);
    helpers = helpers.sort((a, b) =>
      a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
    );

    await writeFile('helpers.json', JSON.stringify(helpers, null, 2));

    console.log('Thanks!!! `./helpers.json` was updated');
  } catch (error) {
    console.error(error);
  }
})();
