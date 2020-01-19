const helpers = require('../helpers.json');
const { writeHelper } = require('../lib/helpers');

helpers.forEach((helper) => {
  writeHelper(helper);
});
