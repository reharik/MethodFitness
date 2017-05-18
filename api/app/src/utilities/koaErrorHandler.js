module.exports = function(logger) {
  return function() {
    return async (ctx, next) => {
      try {
        await next();
        if (ctx.response.status === 404 && !ctx.response.body) {ctx.throw(404);}
      } catch (err) {
        logger.error(err);
        ctx.status = err.statusCode || err.status || 500;

        // application
        // ctx.app.emit('error', err, this);

        ctx.body = {
          status: ctx.status,
          success: false,
          errors: [{ message: err.message }]
        };
      }
    };
  };
};
