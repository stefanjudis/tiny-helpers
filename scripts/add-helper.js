const inquirer = require('inquirer');

(async () => {
  const answers = await inquirer.prompt([
    { name: 'name', type: 'input', message: 'Enter the name:' },
    { name: 'desc', type: 'input', message: 'Enter a description:' },
    { name: 'url', type: 'input', message: 'Enter a URL:' },
    {
      name: 'tags',
      type: 'checkbox',
      message: 'Pick some tags:',
      choices: ['html', 'css', 'javascript', 'a11y', 'performance', 'design']
    }
  ]);
})();
