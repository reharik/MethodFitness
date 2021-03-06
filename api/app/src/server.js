/**
 * Created by reharik on 10/5/15.
 */

module.exports = function(
  koa,
  config,
  papersConfig,
  koaConfig,
  routes,
  logger,
) {
  return function() {
    logger.info('approot ' + __dirname);
    logger.info('appTitle ' + config.app.title);

    let app = new koa(); // eslint-disable-line new-cap
    koaConfig(app, papersConfig);
    routes(app);

    app.listen(config.app.port);
    logger.info('Server started, listening on port: ' + config.app.port);
    logger.info('Environment: ' + config.app.env);
    return app;
  };
};
