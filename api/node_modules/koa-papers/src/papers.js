const co = require('co');
var createAuthenticationMiddleware = require('./authenticationMiddleware');

module.exports = function() {
  const logIn = function *(ctx, user, papers) {
    ctx.state[papers.options.userProperty] = user;

    if(!papers.options.useSession || !ctx.session){
      return;
    }

    ctx.session[papers.options.key] = {};
    ctx.session[papers.options.key].user = yield papers.functions.serializeUser(user, papers);
  };

  const logOut = function (ctx, userProperty, key) {
    return function () {
      ctx.request[userProperty] = null;
      if (ctx.session && ctx.session[key]) {
        delete ctx.session[key];
      }
    }
  };

  const isAuthenticated = function (ctx) {
    return function () {
      if(ctx.request.user || ctx.session && ctx.session[ctx._papers.key] && ctx.session[ctx._papers.key].user){
        return true;
      }
      return false;
    };
  };

  const serializeUser = function (user, papers) {
    // private implementation that traverses the chain of serializers, attempting
    // to serialize a user
    return co(function *iterateStrategies() {
      for (strategy of papers.functions.serializers) {
        var result = strategy(user);
        if (result) {
          const user = yield result;
          if (user !== 'pass') {
            return user;
          }
        }
      }
    }).catch(ex => {
      throw ex;
    });
  };

  const deserializeUser = function (user, papers) {
    return co(function *iterateStrategies() {
      for (strategy of papers.functions.deserializers) {
        if (!strategy) {
          throw new Error('Failed to serialize user into session');
        }
        var result = strategy(user);
        if (result) {
          const user = yield result;
          if (user !== 'pass') {
            return user;
          }
        }
      }
    }).catch(e => {
      throw(e);
    })
  };

  const transformAuthInfo = function (info, papers) {
    for (let i = 0; papers.functions.infoTransformers; i++) {

      var layer = papers.functions.infoTransformers[i];
      if (!layer) {

        // if no transformers are registered (or they all pass), the default
        // behavior is to use the un-transformed info as-is
        return info;
      }

      try {
        const result = layer(info);
        if (result !== 'pass') {
          return result;
        }
      } catch (e) {
        throw(e);
      }
    }
  };

  return {
    registerMiddleware: function (config) {
      if (!config || !config.strategies || config.strategies.length <= 0) {
        throw new Error('You must provide at lease one strategy.');
      }
      if(config.useSession && (
          !config.serializers|| config.serializers.length <= 0
        || !config.deserializers || config.deserializers.length <= 0
        )){
        throw new Error('You must provide at least one user serializer and one user deserializer if you want to use session.');
      }

      //TODO put some validation in for more of this.
      const papers = {
        functions: {
          strategies: config.strategies,
          serializers: config.serializers,
          deserializers: config.deserializers,
          infoTransformers: config.infoTransformers,
          customHandler: config.customHandler,
          logIn,
          logOut,
          isAuthenticated,
          serializeUser,
          deserializeUser,
          transformAuthInfo
        },
        options: {
          useSession: config.useSession,
          userProperty: 'user',
          key: 'papers',
          koa: true,
          failureRedirect: config.failureRedirect,
          successRedirect: config.successRedirect,
          failAndContinue: config.failAndContinue,
          failWithError: config.failWithError,
          assignProperty: config.assignProperty,
          whiteList: config.whiteList || []
        }
      };
      return createAuthenticationMiddleware(papers);
    }
  }
};