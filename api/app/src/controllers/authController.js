module.exports = function(commands, eventstore, logger) {
  let signIn = async function(ctx) {
    logger.debug('arrived at login');
    if (!ctx.state.user) {
      ctx.status = 401;
      ctx.body = { success: false, errors: ['Invalid credentials provided'] };
    } else {
      let user = ctx.state.user;
      console.log(`==========eventStore=========`);
      console.log(eventstore); // eslint-disable-line quotes
      console.log(`==========END eventStore=========`);
      let cmd = commands.loginTrainerCommand(user.trainerId, user.userName);
      await eventstore.commandPoster(cmd, 'loginTrainer');
      delete user.password;
      ctx.body = { success: true, user };
    }
  };

  const checkAuth = async function(ctx) {
    if (ctx.state.user) {
      ctx.status = 200;
      ctx.body = { success: true, user: ctx.state.user };
    } else {
      ctx.status = 401;
    }
  };

  let signOut = async function(ctx) {
    ctx.user = null;
    if (ctx.session && ctx.session.papers) {
      delete ctx.session.papers.user;
    }
    ctx.status = 204;
  };

  return {
    signIn,
    signOut,
    checkAuth,
  };
};
