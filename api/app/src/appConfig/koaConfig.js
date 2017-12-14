/**
 * Created by reharik on 7/26/15.
 */

module.exports = function(
  koagenericsession,
  koa2responsetime,
  koalogger,
  coviews,
  koacompress,
  koaErrorHandler,
  koabodyparser,
  config,
  koaconvert,
  koa2cors,
  swaggerSpec,
  customValidators,
  swaggerValidationMiddleware
) {
  return function(app, papersMiddleware) {
    if (!config.app.keys) {
      throw new Error('Please add session secret key in the config file!');
    }

    app.keys = config.app.keys;
    if (config.app.env !== 'test') {
      app.use(koalogger());
    }
    app.use(koaErrorHandler());
    app.use(koa2cors({
      origin: ctx => {
        const origin1 = `http://${config.app.frontEndHost}:${config.app.frontEndPort}`;
        const origin2 = `http://${config.app.frontEndHostAlt}:${config.app.frontEndPort}`;
        const origin3 = `http://${config.app.frontEndHost}`;
        const origin4 = `http://${config.app.frontEndHostAlt}`;
        if (ctx.header.origin === origin1
          || ctx.header.origin === origin2
          || ctx.header.origin === origin3
          || ctx.header.origin === origin4) {
          return ctx.header.origin;
        }
        return false;
      },
      credentials: true }));

    app.use(koabodyparser());
    app.use(koagenericsession({key: 'MethodFitness.sid'}));

    app.use(koaconvert(papersMiddleware));
    app.use(koacompress());

    let JSONSwaggerDoc = JSON.parse(swaggerSpec());
    app.use(swaggerValidationMiddleware(JSONSwaggerDoc, customValidators));

    app.use(async function(ctx, next) {
      ctx.render = coviews(config.app.root + '/app/src/views', {
        map: { html: 'swig' } //,
        // cache: config.app.env === "development" ? "memory" : false
      });
      await next();
    });

    app.use(koa2responsetime.responseTime());
  };
};
