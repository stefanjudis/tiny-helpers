import { defineConfig } from 'checkly';

export default defineConfig({
  projectName: 'My First Checkly Project',
  logicalId: 'checkly-project-1',
  checks: {
    locations: ['eu-central-1', 'us-west-1'],
    tags: ['tiny-helpers'],
    checkMatch: '__checks__/**/*.check.ts',
    browserChecks: {
      testMatch: 'tests/**/*.spec.js',
    },
  },
  cli: {
    runLocation: 'eu-central-1',
  },
});
