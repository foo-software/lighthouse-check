import { IncomingWebhook } from '@slack/webhook';
import lighthouseAuditTitles from './lighthouseAuditTitles';
import { NAME } from './constants';

export default async ({ results, slackWebhookUrl, verbose }) => {
  try {
    const webhook = new IncomingWebhook(slackWebhookUrl);

    for (const result of results) {
      // get the average of all socres
      const values = Object.values(result.scores);
      const sum = values.reduce(
        (accumulator, current) => parseInt(current, 10) + accumulator,
        0
      );
      const average = sum / values.length;

      // link the report if we have it
      const text = !result.report
        ? 'Lighthouse Audit'
        : `<${result.report}|Lighthouse Audit>`;

      await webhook.send({
        text,
        attachments: [
          {
            color: '#2091fa',
            fields: [
              {
                title: 'Average',
                value: average,
                short: true
              },
              ...Object.keys(result.scores).map(current => ({
                title: lighthouseAuditTitles[current],
                value: result.scores[current],
                short: true
              }))
            ],
            text: result.url,
            thumb_url:
              'https://s3.amazonaws.com/foo.software/images/logos/lighthouse.png'
          }
        ]
      });
    }
  } catch (error) {
    if (verbose) {
      console.log(`${NAME}:`, error);
    }
  }
};
