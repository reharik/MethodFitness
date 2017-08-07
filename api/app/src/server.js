/**
 * Created by reharik on 10/5/15.
 */


module.exports = function(koa, eventstore, config, papersConfig, koaConfig, routes, logger) {
  return function() {
    logger.info('approot ' + __dirname);
    logger.info('appTitle ' + config.app.title);

    let app = new koa();
    koaConfig(app, papersConfig);
    routes(app);

    //if (!module.parent) {
    app.listen(config.app.port);
    logger.info('Server started, listening on port: ' + config.app.port);
    //}
    logger.info('Environment: ' + config.app.env);
    eventstore = eventstore(config.configs.children);
    return app;
  };
};
