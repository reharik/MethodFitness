const http = require('_http_server');
const co = require('co');
const handleFailurePostIteration = require('./handleFailurePostIteration');
const handleSuccess = require('./handleSuccess');
const handleError = require('./handleError');
const standardizeErrors = require('./standardizeErrors');
const checkSessionForAuth = require('./checkSessionForAuth');


module.exports = (papers) => {

  return function *(next) {
    /********* check session for auth *************/
    const checkSession = (ctx, papers) =>  {
      return co(checkSessionForAuth(papers, ctx))
        .catch(ex => {
        console.log('==========ex=========');
        console.log(ex);
        console.log('==========END ex=========');
        ctx.response.status = 500;
        ctx.response.body = `${http.STATUS_CODES[500]} \n ${ex.message} \n ${ex}`;
      })
    };

    /********* iterate strategies *************/
    const iterateStrategies = (ctx, papers) => {
      return co(function *iterateStrategies() {
        let failures = [];
        for (let strategy of papers.functions.strategies) {

          if (!strategy) {
            continue;
          }

          const authenticate = strategy.authenticate(ctx, papers);
          const stratResult = authenticate && typeof authenticate.then === 'function' ? yield authenticate : authenticate;

          if (!stratResult || !stratResult.type) {
            continue
          }

          switch (stratResult.type) {
            case 'fail':
            {
              failures.push(standardizeErrors(stratResult));
              break;
            }
            case 'redirect':
            {
              return {type: 'redirect', details: {url: stratResult.details.url, statusCode:stratResult.details.statusCode}};
            }
            case 'error':
            {
              return handleError(stratResult, papers);
            }
            case 'success':
            {
              return yield handleSuccess(stratResult, ctx, papers);
            }
          }
        }
        return handleFailurePostIteration(failures, ctx, papers);
      }).catch(ex => {
        console.log('==========ex=========');
        console.log(ex);
        console.log('==========END ex=========');
        ctx.status = 500;
        ctx.body = `${http.STATUS_CODES[500]} \n ${ex.message} \n ${ex}`;
      });
    };

    let ctx = this;
    
    /********* add convenience methods to req *************/
    ctx.logOut = papers.functions.logOut(ctx, papers.options.userProperty, papers.options.key);
    ctx.isAuthenticated = papers.functions.isAuthenticated(ctx);
    
    /****** whiteList ********/
    if(papers.options.whiteList.some(x=> x.url === ctx.request.url && (!!x.method ? x.method === ctx.request.method : true))){
      return yield next;
    }
    
    const hasSession = yield checkSession(ctx, papers);
    // this is strange logic but necessary to handle hasSession throwing
    let result = hasSession && !hasSession.isLoggedIn
      ? yield iterateStrategies(ctx, papers)
      : {type: 'session'};

    switch (result.type) {
      case 'customHandler':
      {
        if(papers.functions.customHandler.constructor.name === 'GeneratorFunction') {
          yield co(papers.functions.customHandler(ctx, next, result.value));
          return;
        }
        papers.functions.customHandler(ctx, next, result.value);
        return;
      }
      case 'error':
      {
        ctx.throw('error', result.value.exception, 500);
        break;
      }
      case 'failWithError':
      {
        ctx.throw('error', result.value, 500);
        break;
      }
      case 'failAndContinue':
      case 'session':
      case 'success':
      {
        yield next;
        break;
      }
      case 'redirect': {
        ctx.status = result.details.statusCode || ctx.status || 303;
        ctx.redirect(result.details.url);
        return;
      }
      // what is this returing on, what do I expect to fall through.
      // I know that session might be falling through and that should
      // not end but continue down the middle ware chain
        // this is why I put session up with success.  it seems to work
      default:
      {
        ctx.body = ctx.body || http.STATUS_CODES[ctx.status];
        return;
      }
    }
  };
};