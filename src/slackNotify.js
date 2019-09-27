import { IncomingWebhook } from '@slack/webhook';
import getLighthouseScoreColor from './helpers/getLighthouseScoreColor';
import lighthouseAuditTitles from './lighthouseAuditTitles';
import { NAME } from './constants';

export default async ({
  author,
  branch,
  pr: prParam,
  results,
  sha,
  slackWebhookUrl,
  verbose
}) => {
  try {
    const webhook = new IncomingWebhook(slackWebhookUrl);

    // sometimes we get weird input
    const pr =
      typeof prParam !== 'string' || prParam === 'true' ? undefined : prParam;

    for (const result of results) {
      // link the report if we have it
      let title = !result.report
        ? 'Lighthouse Audit.'
        : `<${result.report}|Lighthouse Audit>.`;

      // if we have a branch
      if (branch) {
        const branchText = !pr ? branch : `<${pr}|${branch}>`;
        title = `${title} Change made in \`${branchText}\`.`;
      }

      let authorName;
      if (author) {
        authorName = `by ${author}`;

        if (sha) {
          authorName = `${authorName} in ${sha.slice(0, 10)}`;
        }
      }

      await webhook.send({
        title,
        text: result.url,
        attachments: [
          {
            text: title
          },
          ...Object.keys(result.scores).map(current => ({
            color: getLighthouseScoreColor(result.scores[current]),
            text: `**${lighthouseAuditTitles[current]}**: ${result.scores[current]}`
          }))
        ],
        ...(!authorName
          ? {}
          : {
              author_name: authorName
            })
      });
    }
  } catch (error) {
    if (verbose) {
      console.log(`${NAME}:`, error);
    }

    // we still need to kill the process
    throw error;
  }
};
