import fetch from 'node-fetch';
import get from 'lodash.get';
import LighthouseCheckError from './LighthouseCheckError';
import { LIGHTHOUSE_API_URL } from './constants';
import {
  ERROR_GENERIC,
  ERROR_NO_RESULTS,
  ERROR_NO_URLS,
  ERROR_TIMEOUT,
  ERROR_UNAUTHORIZED,
  ERROR_QUEUE_MAX_USED_DAY
} from './errorCodes';

const API_URL = process.env.API_URL || LIGHTHOUSE_API_URL;
const API_PAGES_PATH = '/pages';
const API_QUEUE_ITEMS_PATH = '/queue/items';
const API_LIGHTHOUSE_AUDIT_PATH = '/lighthouseAudits/queueIds';
const NAME = 'lighthouse-check';
const DEFAULT_TAG = NAME;
const SUCCESS_CODE_GENERIC = 'SUCCESS';
const TRIGGER_TYPE = 'lighthouseAudit';

// this should only be defined when working locally.
if (process.env.API_URL) {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
}

export const fetchLighthouseAudits = async ({ apiToken, queueIds }) => {
  try {
    const lighthouseAuditsResponse = await fetch(
      `${API_URL}${API_LIGHTHOUSE_AUDIT_PATH}/${queueIds.join()}`,
      {
        method: 'get',
        headers: {
          Authorization: apiToken,
          'Content-Type': 'application/json'
        }
      }
    );
    const lighthouseAuditsJson = await lighthouseAuditsResponse.json();

    if (lighthouseAuditsJson.status >= 400) {
      throw new LighthouseCheckError('No results found.', {
        code: ERROR_NO_RESULTS
      });
    }

    const lighthouseResults = get(
      lighthouseAuditsJson,
      'data.lighthouseaudit',
      []
    );

    // success
    return {
      code: SUCCESS_CODE_GENERIC,
      data: lighthouseResults,
      message: 'Lighthouse results successfully fetched.'
    };
  } catch (error) {
    return {
      code: error.code || ERROR_GENERIC,
      error
    };
  }
};

// 10 minutes
const DEFAULT_FETCH_AND_WAIT_TIMEOUT_MINUTES = 10;

// 10 seconds
const FETCH_POLL_INTERVAL_SECONDS = 10;
const FETCH_POLL_INTERVAL = FETCH_POLL_INTERVAL_SECONDS * 1000;

export const fetchAndWaitForLighthouseAudits = ({
  apiToken,
  timeout = DEFAULT_FETCH_AND_WAIT_TIMEOUT_MINUTES,
  queueIds,
  verbose
}) =>
  new Promise((resolve, reject) => {
    const timeoutMilliseconds = 60000 * timeout;
    let fetchIndex = 0;
    let millisecondsPassed = 0;

    const fetchData = interval =>
      setTimeout(async () => {
        fetchIndex++;
        millisecondsPassed = millisecondsPassed + interval;

        if (verbose) {
          console.log(
            `${NAME}:`,
            `Starting Lighthouse fetch attempt ${fetchIndex}.`
          );
        }

        const result = await fetchLighthouseAudits({
          apiToken,
          queueIds
        });

        // do we have the expected number of results
        const areResultsExpected =
          result.data && result.data.length === queueIds.length;

        // have we reached the timeout
        const isTimeoutReached = millisecondsPassed > timeoutMilliseconds;

        // has unexpected error
        const isErrorUnexpected =
          result.error &&
          (!result.error.code || result.error.code !== ERROR_NO_RESULTS);

        const resultLength = !Array.isArray(result.data)
          ? 0
          : result.data.length;

        if (isErrorUnexpected) {
          if (verbose) {
            console.log(
              `${NAME}:`,
              'An unexpected error occurred:\n',
              result.error
            );
          }
          reject(result.error);
        } else if (areResultsExpected) {
          const audits = result.data.map(current => ({
            name: current.name,
            report: current.report,
            url: current.url,
            tag: current.tag,
            scores: {
              accessibility: current.scoreAccessibility,
              bestPractices: current.scoreBestPractices,
              performance: current.scorePerformance,
              progressiveWebApp: current.scoreProgressiveWebApp,
              seo: current.scoreSeo
            }
          }));

          if (verbose) {
            console.log(`${NAME}:`, '\n------- results -------\n', audits);
          }

          resolve(audits);
        } else if (isTimeoutReached) {
          const errorMessage = `Received ${resultLength} out of ${queueIds.length} results. ${timeout} minute timeout reached.`;
          if (verbose) {
            console.log(`${NAME}:`, errorMessage);
          }

          reject(
            new LighthouseCheckError(errorMessage, {
              code: ERROR_TIMEOUT
            })
          );
        } else {
          if (verbose) {
            console.log(
              `${NAME}:`,
              `Received ${resultLength} out of ${queueIds.length} results. Trying again in ${FETCH_POLL_INTERVAL_SECONDS} seconds.`
            );
          }

          fetchData(FETCH_POLL_INTERVAL);
        }
      }, interval);

    // we pass in 0 as the interval because we don't need to
    // wait the first time.
    fetchData(0);
  });

export const triggerLighthouse = async ({
  apiToken,
  tag,
  urls = [],
  verbose
}) => {
  try {
    let apiTokens = urls;

    if (!Array.isArray(urls) || !urls.length) {
      if (verbose) {
        console.log(`${NAME}:`, 'Fetching URLs from account.');
      }

      const pagesResponse = await fetch(`${API_URL}${API_PAGES_PATH}`, {
        method: 'get',
        headers: {
          Authorization: apiToken,
          'Content-Type': 'application/json'
        }
      });
      const pagesJson = await pagesResponse.json();

      if (pagesJson.status >= 400) {
        const errorMessage = `Account wasn't found for the provided API token.`;
        if (verbose) {
          console.log(`${NAME}:`, errorMessage);
        }

        throw new LighthouseCheckError(errorMessage, {
          code: ERROR_UNAUTHORIZED
        });
      }

      const pages = get(pagesJson, 'data.page', []);
      if (!pages.length) {
        const errorMessage = 'No URLs were found for this account.';

        if (verbose) {
          console.log(`${NAME}:`, errorMessage);
        }

        throw new LighthouseCheckError(errorMessage, {
          code: ERROR_NO_URLS
        });
      }

      apiTokens = pages.map(current => current.apiToken);
    }

    if (verbose) {
      console.log(`${NAME}:`, 'Enqueueing Lighthouse audits.');
    }

    // enqueue urls for Lighthouse audits
    const queueItemsResponse = await fetch(
      `${API_URL}${API_QUEUE_ITEMS_PATH}`,
      {
        method: 'post',
        headers: {
          Authorization: apiToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tag: tag || DEFAULT_TAG,
          pages: apiTokens.join(),
          type: TRIGGER_TYPE
        })
      }
    );
    const queueItemsJson = await queueItemsResponse.json();
    const queue = get(queueItemsJson, 'data.queue');

    // if no results
    if (!queue.results.length) {
      const errorMessage = 'No results.';
      if (verbose) {
        console.log(`${NAME}:`, errorMessage);
      }

      throw new LighthouseCheckError(errorMessage, {
        code: ERROR_NO_RESULTS
      });
    }

    // if all urls failed to be enqueued...
    if (queue.errors === queue.results.length) {
      const errorCode = queue.results[0].code;
      const errorMessage =
        errorCode === ERROR_QUEUE_MAX_USED_DAY
          ? queue.results[0].message
          : 'All URLs failed to be enqueued. Examine the "data" property of this error for details.';

      if (verbose) {
        console.log(`${NAME}:`, errorMessage);
      }

      throw new LighthouseCheckError(errorMessage, {
        code: errorCode,
        data: queue.results
      });
    }

    // if only some urls succeeded to be enqueued...
    const successResultLength = queue.results.length - queue.errors;

    const message =
      successResultLength < queue.results.length
        ? `Only ${
            successResultLength > 1 ? 'some' : 'one'
          } of your account URLs were enqueued. Typically this occurs when daily limit has been met for a given URL. Check your account limits online.`
        : `${queue.results.length} ${
            queue.results.length > 1 ? 'URLs' : 'URL'
          } successfully enqueued for Lighthouse. Visit dashboard for results.`;

    if (verbose) {
      console.log(`${NAME}:`, message);
    }

    // success
    return {
      code: SUCCESS_CODE_GENERIC,
      data: queue.results,
      message
    };
  } catch (error) {
    const result = {
      code: error.code || ERROR_GENERIC,
      error
    };

    // if an error occurred but we still have data (typically if only some URLs failed)
    if (error.data) {
      result.data = error.data;
    }

    return result;
  }
};

export const lighthouseCheck = ({
  apiToken,
  tag,
  urls,
  verbose = true,
  wait = true
}) =>
  new Promise(async (resolve, reject) => {
    try {
      const triggerResult = await triggerLighthouse({
        apiToken,
        tag,
        urls,
        verbose
      });

      if (triggerResult.error) {
        reject(triggerResult.error);
      }

      // if the user understandably doesn't want to wait for results, return right away
      if (!wait) {
        resolve(triggerResult);
      }

      const failUnexpectedly = () => {
        const errorMessage = 'Failed to retrieve results.';
        if (verbose) {
          console.log(`${NAME}:`, errorMessage);
        }

        reject(
          new LighthouseCheckError(errorMessage, {
            code: ERROR_NO_RESULTS
          })
        );
      };

      // if this condition doesn't pass - we got a problem
      if (triggerResult.data) {
        // assemble an array of queueIds
        const queueIds = triggerResult.data.reduce(
          (accumulator, current) => [
            ...accumulator,
            ...(!current.id ? [] : [current.id])
          ],
          []
        );

        // if this condition doesn't pass - we got a problem
        if (queueIds.length) {
          const auditResults = await fetchAndWaitForLighthouseAudits({
            apiToken,
            queueIds,
            verbose
          });

          // success
          resolve({
            code: SUCCESS_CODE_GENERIC,
            data: auditResults
          });
        } else {
          failUnexpectedly();
        }
      } else {
        failUnexpectedly();
      }
    } catch (error) {
      if (verbose) {
        console.log(`${NAME}:\n`, error);
      }

      reject(error);
    }
  });
