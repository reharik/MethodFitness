module.exports = function(koarouter, routers_array, controllers, logger) { // eslint-disable-line camelcase
  // let secured = async function(next) {
  //   if (this.isAuthenticated()) {
  //     await next;
  //   } else {
  //     this.status = 401;
  //   }
  // };

  return function(app) {
    try {
      let router = koarouter();
      router.get('/', controllers.indexController.index);

      app.use(router.routes());
      app.use(router.allowedMethods());

      routers_array.forEach(x => x(router)); // eslint-disable-line camelcase
    } catch (ex) {
      logger.error(ex);
    }
  };
};
