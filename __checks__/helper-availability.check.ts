import * as path from 'path';
import {
  AlertEscalationBuilder,
  Frequency,
  MultiStepCheck,
  RetryStrategyBuilder,
  WebhookAlertChannel,
} from 'checkly/constructs';

// Number of consecutive failing runs before alerting. The removal workflow
// (.github/workflows/remove-dead-helpers.yml) uses the same number of runs.
export const FAILED_RUN_THRESHOLD = 3;

// Starts .github/workflows/remove-dead-helpers.yml.
// GITHUB_DISPATCH_TOKEN is a secret Checkly environment variable holding a
// fine-grained GitHub token with "Contents: read and write" on this repository.
const removeDeadHelpersWebhook = new WebhookAlertChannel(
  'remove-dead-helpers-webhook',
  {
    name: 'GitHub: remove dead helpers',
    method: 'POST',
    url: 'https://api.github.com/repos/stefanjudis/tiny-helpers/dispatches',
    headers: [
      { key: 'Accept', value: 'application/vnd.github+json' },
      { key: 'Authorization', value: 'Bearer {{GITHUB_DISPATCH_TOKEN}}' },
      { key: 'User-Agent', value: 'checkly-tiny-helpers' },
    ],
    template: JSON.stringify({
      event_type: 'checkly-alert',
      client_payload: {
        checkId: '{{CHECK_ID}}',
        checkResultId: '{{CHECK_RESULT_ID}}',
        alertType: '{{ALERT_TYPE}}',
      },
    }),
    sendFailure: true,
    sendRecovery: false,
    sendDegraded: false,
  },
);

new MultiStepCheck('helper-availability', {
  name: 'Helper availability',
  tags: ['tiny-helpers', 'helper-availability'],
  frequency: Frequency.EVERY_24H,
  locations: ['eu-central-1', 'us-west-1'],
  runParallel: true,
  retryStrategy: RetryStrategyBuilder.singleRetry({ sameRegion: false }),
  alertEscalationPolicy:
    AlertEscalationBuilder.runBasedEscalation(FAILED_RUN_THRESHOLD),
  alertChannels: [removeDeadHelpersWebhook],
  code: {
    entrypoint: path.join(__dirname, 'helper-availability.spec.ts'),
  },
});
