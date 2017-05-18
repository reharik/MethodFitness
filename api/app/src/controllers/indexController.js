/**
 * Created by reharik on 7/26/15.
 */


module.exports = function(config) {
  return {
    async index(ctx) {
      ctx.body = await ctx.render('index', {
        webpack: config.configs.frontendUrl
      });
    }
  };
};
