const path = require('path');
const {
  AlertEscalationBuilder,
  Frequency,
  MultiStepCheck,
  RetryStrategyBuilder,
} = require('checkly/constructs');

new MultiStepCheck('helper-availability', {
  name: 'Helper availability',
  frequency: Frequency.EVERY_24H,
  locations: ['eu-central-1', 'us-west-1'],
  runParallel: true,
  retryStrategy: RetryStrategyBuilder.singleRetry({ sameRegion: false }),
  // Only alert when helpers fail on three consecutive (daily) runs.
  alertEscalationPolicy: AlertEscalationBuilder.runBasedEscalation(3),
  code: {
    entrypoint: path.join(__dirname, 'helper-availability.spec.js'),
  },
});
