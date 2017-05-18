const standardizeErrors = require('./standardizeErrors');

module.exports =  (stratResult, papers) => {
  const standardizedError = standardizeErrors(stratResult);
  if (papers.functions.customHandler) {
    return {type: 'customHandler', result: 'error', value: standardizedError};
  }
  return {type: 'error', value: standardizedError};
};