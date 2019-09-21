import fetchAndWaitForLighthouseAudits from './fetchAndWaitForLighthouseAudits';
import LighthouseCheckError from './LighthouseCheckError';
import triggerLighthouse from './triggerLighthouse';
import { NAME, SUCCESS_CODE_GENERIC } from './constants';
import { ERROR_NO_RESULTS } from './errorCodes';

export default ({
  apiToken,
  tag,
  timeout,
  urls,
  verbose = true,
  wait = true
}) =>
  new Promise(async (resolve, reject) => {
    try {
      const triggerResult = await triggerLighthouse({
        apiToken,
        tag,
        timeout,
        urls,
        verbose
      });

      if (triggerResult.error) {
        reject(triggerResult.error);
        return;
      }

      // if the user understandably doesn't want to wait for results, return right away
      if (!wait) {
        resolve(triggerResult);
        return;
      }

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
          return;
        }
      }

      const errorMessage = 'Failed to retrieve results.';
      if (verbose) {
        console.log(`${NAME}:`, errorMessage);
      }

      reject(
        new LighthouseCheckError(errorMessage, {
          code: ERROR_NO_RESULTS
        })
      );
    } catch (error) {
      if (verbose) {
        console.log(`${NAME}:\n`, error);
      }

      reject(error);
    }
  });
