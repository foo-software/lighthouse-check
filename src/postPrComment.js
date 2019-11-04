import fetch from './fetch';
import { NAME } from './constants';

export default async ({
  prCommentOauthToken,
  prCommentUrl,
  results,
  verbose
}) => {
  try {
    await fetch(prCommentUrl, {
      method: 'post',
      body: JSON.stringify({
        body: 'hello world'
      }),
      headers: {
        'content-type': 'application/json',
        authorization: `token OAUTH-TOKEN ${prCommentOauthToken}`
      }
    });
  } catch (error) {
    if (verbose) {
      console.log(`${NAME}:`, error);
    }

    // we still need to kill the process
    throw error;
  }
};
