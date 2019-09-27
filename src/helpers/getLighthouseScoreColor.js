// https://developers.google.com/web/tools/lighthouse/v3/scoring
export default score => {
  if (typeof score !== 'number') {
    return 'grey';
  }

  let scoreColor = 'green';

  // medium range
  if (score < 75) {
    scoreColor = 'orange';
  }

  // bad
  if (score < 45) {
    scoreColor = 'red';
  }

  return scoreColor;
};
