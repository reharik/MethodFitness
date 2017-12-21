module.exports = function(compiler, validateMethods) {
  return function(document, customValidators) {
    // construct a validation object, pre-compiling all schema and regex required
    let compiled = compiler(document, customValidators);
    return async (ctx, next) => {
      if (document.basePath !== undefined && !ctx.path.startsWith(document.basePath)) {
        // not a path that we care about
        await next();
        return;
      }

      let compiledPath = compiled(ctx.path);
      if (!compiledPath) {
        // if there is no single matching path, return 404 (not found)
        ctx.status = 404;
        return;
      }

      // check the request matches the swagger schema
      let validationErrors = validateMethods.request(compiledPath, ctx.method, ctx.query, ctx.request.body);

      if (!validationErrors) {
        // operation not defined, return 405 (method not allowed)
        ctx.status = 405;
        return;
      }
      if (!validationErrors.success) {
        validationErrors.code = 'SWAGGER_REQUEST_VALIDATION_FAILED';
        ctx.status = 422;
        ctx.body = validationErrors;
        return;
      }

      // wait for the operation to execute
      await next();

      // check the response matches the swagger schema
      let responseResult = validateMethods.response(compiledPath, ctx.method, ctx.status, ctx.body);
      if (!responseResult.success) {
        responseResult.code = 'SWAGGER_RESPONSE_VALIDATION_FAILED';
        ctx.status = 500;
        ctx.body = responseResult;
      }
    };
  };
};
