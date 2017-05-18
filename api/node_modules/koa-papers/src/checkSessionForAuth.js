
module.exports = function *(papers, ctx) {
  /********* check session for auth *************/
  if (papers.options.useSession
    && ctx.session[papers.options.key]
    && ctx.session[papers.options.key].user) {
    const user = yield papers.functions.deserializeUser(ctx.session[papers.options.key].user, papers);
    if (!user) {
      delete ctx.session[papers.options.key].user;
      return {isLoggedIn: false};
    }
    ctx.state[papers.options.userProperty] = user;
    ctx.status = 200;
    return {isLoggedIn: true};
  }
  return {isLoggedIn: false};
};