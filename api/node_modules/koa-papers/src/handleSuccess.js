const co = require('co');

module.exports = function *(stratResult, ctx, papers) {
  ctx.status = 200;
  if (papers.functions.customHandler) {
    return {type: 'customHandler', result: 'success', value: stratResult};
  }

  // /********* successFlash *************/
  // if (clientOptions.successFlash) {
  //   var flash = {
  //     type: clientOptions.successFlash.type || info.type || 'success',
  //     message: clientOptions.successFlash.message || info.message || info || 'success'
  //   };
  //   req.flash(flash.type, flash.msg);
  // }
  //
  // /********* successMessage *************/
  // if (clientOptions.successMessage) {
  //   req.session.messages = req.session.messages || [];
  //   req.session.messages.push(typeof msg == 'boolean' ? info.message || info || 'success' : msg);
  // }
  //
  /********* assignProperty *************/
  // this seems spurious
  // if (papers.options.assignProperty) {
  //   req[papers.options.assignProperty] = user;
  //   return {type: 'success'};
  // }

  yield co(function *logInGen(){
    yield papers.functions.logIn(ctx, stratResult.details.user, papers);
  });

  // /********* authInfo *************/
  // if (clientOptions.authInfo !== false) {
  //   req.authInfo = papers.transformAuthInfo(info);
  // }

  /********* redirect *************/
  var redirectUrl = ctx.session && ctx.session.returnTo ? ctx.session.returnTo : papers.options.successRedirect;
  if (ctx.session) {
    delete ctx.session.returnTo;
  }
  if (redirectUrl) {
    return {type  : 'redirect', details: {url: redirectUrl, statusCode: 200}};
  }
  
  if(papers.options.successWithBody){
    ctx.body = papers.options.successWithBody;
  }
  return {type: 'success'};
};