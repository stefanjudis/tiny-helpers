const inquirer = require('inquirer');
const { getHelpers, writeHelper, getTags } = require('../lib/helpers');

(async () => {
  try {
    const tags = getTags(await getHelpers());

    console.log('Thank you for contributing to tiny-helpers.dev!\n');
    console.log(
      'Let me give you some guidance and tips on how to add a "good helper":\n'
    );
    console.log(
      '✅ `desc` – DO: "Create something great" or "Transform something into something else"'
    );
    console.log(
      '❌ `desc` – DON\'T: "ABC is a tool that can something great"\n'
    );
    console.log('✅ `maintainers` – DO: individualA,individualB');
    console.log("❌ `maintainers` – DON'T: companyA\n");

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
        message:
          'Enter GitHub handles of the tool maintainers (comma separated):'
      }
    ]);

    if (!newHelper.tags || !newHelper.tags.length) {
      throw new Error(
        'Please define at least one tag for your helper.\nIf no tag fits your helper please open issue to add a new tag.\n👉 https://github.com/stefanjudis/tiny-helpers/issues/new'
      );
    }

    newHelper.addedAt = new Date().toISOString().substring(0, 10);
    newHelper.maintainers = newHelper.maintainers.length
      ? newHelper.maintainers.split(',')
      : [];

    const filePath = await writeHelper(newHelper);

    console.log(`Thanks!!! ${filePath} was created!`);
  } catch (error) {
    console.error(error);
  }
})();
