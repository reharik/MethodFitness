/**
 * Created by reharik on 7/26/15.
 */
'use strict';

module.exports = function(config) {
  return {
    index: async function(ctx) {
      ctx.body = await ctx.render('index', {
        webpack: config.configs.frontendUrl
      });
    }
  };
};
