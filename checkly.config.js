const { defineConfig } = require('checkly');

module.exports = defineConfig({
  projectName: 'My First Checkly Project',
  logicalId: 'checkly-project-1',
  checks: {
    locations: ['eu-central-1', 'us-west-1'],
    tags: ['tiny-helpers'],
    checkMatch: '__checks__/**/*.check.js',
    browserChecks: {
      testMatch: 'tests/**/*.spec.js',
    },
  },
  cli: {
    runLocation: 'eu-central-1',
  },
});
