const core = require('@actions/core');
const get = require('lodash.get');
const github = require('@actions/github');
const { lighthouseCheck } = require('./dist/lighthouseCheck');

(async () => {
  try {
    const prApiUrl = get(github, 'context.payload.pull_request.url');

    const results = await lighthouseCheck({
      prCommentAccessToken: process.env.prCommentAccessToken,
      prCommentEnabled: true,
      prCommentUrl: !prApiUrl ? undefined : `${prApiUrl}/reviews`,
      urls: 'https://www.foo.software',
      verbose: true,
    });

    // yikesers - only strings :(
    // https://help.github.com/en/articles/contexts-and-expression-syntax-for-github-actions#steps-context
    core.setOutput('lighthouseCheckResults', JSON.stringify(results));
  } catch (error) {
    core.setFailed(error.message);
  }
})();
