module.exports = function () {
  return {
    async swagger(ctx) {
      // eslint-disable-line object-shorthand
      ctx.body = require('./../swagger/swagger_spec.json'); // eslint-disable-line global-require
      ctx.status = 200;
      return ctx;
    }
  };
};
