const http = require('_http_server');

module.exports = (failures, ctx, papers) => {
  if (failures.length <= 0) {
    failures.push({errorMessage: "No successful login strategy found", statusCode: 401})
  }
  var errorMessages = failures.filter(failure => failure
      && failure.errorMessage
      && typeof failure.errorMessage === 'string')
    .map(failure => failure.errorMessage);

  ctx.status = failures.map(f => f.statusCode)
    .reduce((prev, curr) => prev < curr ? curr : prev, 401);
  if (papers.functions.customHandler) {
    return {
      type: 'customHandler',
      result: 'fail',
      value: {
        type: 'fail',
        details: {errorMessage: errorMessages[0], statusCode: http.STATUS_CODES[ctx.status]}
      }
    };
  }

  if (ctx.status == 401 && errorMessages.length) {
    ctx.set('WWW-Authenticate', errorMessages);
  }
  
  if (papers.options.failWithError) {
    return {type: 'failWithError', value: new Error(http.STATUS_CODES[ctx.status])};
  }
  const redirectOnFailureUrl = papers.options.failureRedirect;
  if (redirectOnFailureUrl) {
    return {type  : 'redirect', details: {url: redirectOnFailureUrl}};
  }
  
  if(papers.options.failAndContinue){
    return {type  : 'failAndContinue'};
  }

  return {type: 'fallThrough'};
};