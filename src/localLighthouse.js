import fs from 'fs';
import get from 'lodash.get';
import lighthousePersist from '@foo-software/lighthouse-persist';
import lighthouseDefaultConfig, { throttling } from './lighthouseConfig';
import options from './lighthouseOptions';
import writeResults from './helpers/writeResults';
import { NAME } from './constants';

const getScoresFromFloat = scores =>
  Object.keys(scores).reduce(
    (accumulator, current) => ({
      ...accumulator,
      [current]:
        typeof scores[current] !== 'number'
          ? 0
          : Math.floor(scores[current] * 100)
    }),
    {}
  );

export const localLighthouse = async ({
  awsAccessKeyId,
  awsBucket,
  awsRegion,
  awsSecretAccessKey,
  emulatedFormFactor,
  extraHeaders,
  locale,
  maxWaitForLoad,
  outputDirectory,
  overrides,
  throttling: throttlingOverride,
  throttlingMethod,
  url
}) => {
  // the default config combined with overriding query params
  const fullConfig = {
    ...lighthouseDefaultConfig,
    settings: {
      ...lighthouseDefaultConfig.settings,
      ...(!maxWaitForLoad
        ? {}
        : {
            maxWaitForLoad
          }),
      ...(!throttlingMethod
        ? {}
        : {
            throttlingMethod
          }),
      ...(!throttlingOverride || !throttling[throttlingOverride]
        ? {}
        : {
            throttling: throttling[throttlingOverride]
          }),
      ...(!emulatedFormFactor
        ? {}
        : {
            emulatedFormFactor
          }),
      ...(!extraHeaders
        ? {}
        : {
            extraHeaders
          }),
      // if we wanted translations (holy!)
      // locale: 'ja',
      ...(!locale
        ? {}
        : {
            locale
          })
    },
    ...(!overrides || !overrides.config
      ? {}
      : {
          ...overrides.config
        })
  };

  const { localReport, report, result } = await lighthousePersist({
    awsAccessKeyId,
    awsBucket,
    awsRegion,
    awsSecretAccessKey,
    config: fullConfig,
    options: {
      ...options,
      ...(!overrides || !overrides.options
        ? {}
        : {
            ...overrides.options
          })
    },
    outputDirectory,
    url
  });

  const scores = getScoresFromFloat({
    accessibility: get(result, 'categories.accessibility.score'),
    bestPractices: get(result, 'categories["best-practices"].score'),
    performance: get(result, 'categories.performance.score'),
    progressiveWebApp: get(result, 'categories.pwa.score'),
    seo: get(result, 'categories.seo.score')
  });

  return {
    url,
    localReport,
    report,
    emulatedFormFactor,
    scores
  };
};

export default async ({
  awsAccessKeyId,
  awsBucket,
  awsRegion,
  awsSecretAccessKey,
  emulatedFormFactor,
  extraHeaders,
  locale,
  overridesJsonFile,
  maxWaitForLoad,
  outputDirectory,
  throttling,
  throttlingMethod,
  urls,
  verbose
}) => {
  // check for overrides config or options
  let overrides;
  if (overridesJsonFile) {
    const overridesJsonString = fs.readFileSync(overridesJsonFile).toString();
    const overridesJson = JSON.parse(overridesJsonString);

    if (overridesJson.config || overridesJson.options) {
      overrides = overridesJson;
    }
  }

  const auditResults = [];
  let index = 1;

  for (const url of urls) {
    const options = {
      awsAccessKeyId,
      awsBucket,
      awsRegion,
      awsSecretAccessKey,
      emulatedFormFactor,
      extraHeaders,
      locale,
      maxWaitForLoad,
      outputDirectory,
      overrides,
      throttling,
      throttlingMethod,
      url,
      verbose
    };

    if (options.emulatedFormFactor !== 'both') {
      if (verbose) {
        console.log(
          `${NAME}: Auditing (${index}/${urls.length}) ${options.url} in Mode:${options.emulatedFormFactor}`
        );
      }
      const lighthouseAuditResult = await localLighthouse(options);
      auditResults.push(lighthouseAuditResult);
      index++;
    } else {
      options.emulatedFormFactor = 'desktop';
      if (verbose) {
        console.log(
          `${NAME}: Auditing (${index}/${urls.length}) ${options.url} in Mode:${options.emulatedFormFactor}`
        );
      }
      const lighthouseAuditResultDesktop = await localLighthouse(options);
      options.emulatedFormFactor = 'mobile';
      if (verbose) {
        console.log(
          `${NAME}: Auditing (${index}/${urls.length}) ${options.url} in Mode:${options.emulatedFormFactor}`
        );
      }
      const lighthouseAuditResultMobile = await localLighthouse(options);
      auditResults.push(lighthouseAuditResultDesktop);
      auditResults.push(lighthouseAuditResultMobile);
      index++;
    }
  }

  // if outputDirectory is specified write the results to disk
  if (outputDirectory) {
    writeResults({
      outputDirectory,
      results: auditResults
    });
  }

  return auditResults;
};
