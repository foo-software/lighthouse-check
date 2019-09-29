// import get from 'lodash.get';
// import path from 'path';
import { NAME } from './constants';

const getScoreFailMessage = ({ name, url, minScore, score }) => {
  // if inputs are not specified - assume we shouldn't fail
  if (!minScore || !score) {
    return [];
  }

  if (Number(score) < Number(minScore)) {
    return [
      `${url}: ${name}: minimum score: ${minScore}, actual score: ${score}`
    ];
  }

  return [];
};

const getFailureMessages = ({
  minAccessibilityScore,
  minBestPracticesScore,
  minPerformanceScore,
  minProgressiveWebAppScore,
  minSeoScore,
  results
}) =>
  results.data.reduce(
    (accumulator, current) => [
      ...accumulator,
      ...getScoreFailMessage({
        name: 'Accessibility',
        minScore: minAccessibilityScore,
        score: current.scores.accessibility,
        ...current
      }),
      ...getScoreFailMessage({
        name: 'Best Practices',
        minScore: minBestPracticesScore,
        score: current.scores.bestPractices,
        ...current
      }),
      ...getScoreFailMessage({
        name: 'Performance',
        minScore: minPerformanceScore,
        score: current.scores.performance,
        ...current
      }),
      ...getScoreFailMessage({
        name: 'Progressive Web App',
        minScore: minProgressiveWebAppScore,
        score: current.scores.progressiveWebApp,
        ...current
      }),
      ...getScoreFailMessage({
        name: 'SEO',
        minScore: minSeoScore,
        score: current.scores.seo,
        ...current
      })
    ],
    []
  );

export default ({
  minAccessibilityScore,
  minBestPracticesScore,
  minPerformanceScore,
  minProgressiveWebAppScore,
  minSeoScore,
  results,
  verbose
}) => {
  const failures = getFailureMessages({
    minAccessibilityScore,
    minBestPracticesScore,
    minPerformanceScore,
    minProgressiveWebAppScore,
    minSeoScore,
    results
  });

  // if we have scores that were below the minimum requirement
  if (failures.length) {
    // comma-separate error messages and remove the last comma
    const failureMessage = failures.join('\n');
    throw new Error(`Minimum score requirements failed:\n${failureMessage}`);
  }

  if (verbose) {
    console.log(`${NAME}:`, 'Scores passed minimum requirement ✅');
  }
};
