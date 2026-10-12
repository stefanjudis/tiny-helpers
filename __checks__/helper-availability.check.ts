import * as path from 'path';
import { MultiStepCheck } from 'checkly/constructs';

// Not deployed as a monitor. .github/workflows/remove-dead-helpers.yml runs it
// daily with `checkly test` and removes the helpers it reports as dead.
new MultiStepCheck('helper-availability', {
  name: 'Helper availability',
  testOnly: true,
  code: {
    entrypoint: path.join(__dirname, 'helper-availability.spec.ts'),
  },
});
