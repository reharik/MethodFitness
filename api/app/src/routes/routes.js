module.exports = function(koarouter, routers_array, controllers, logger) {
  var secured = async function (next) {
    if (this.isAuthenticated()) {
      await next;
    } else {
      this.status = 401;
    }
  };

  return function (app) {
    try {
      var router = koarouter();
      router.get("/", controllers.indexController.index);

      app.use(router.routes());
      app.use(router.allowedMethods());

      routers_array.forEach(x => x(router));



    } catch (ex) {
      logger.error(ex);
    }
  };
};