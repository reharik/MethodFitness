module.exports = function appointmentRouter(koarouter, controllers) {
  return function(appRouter) {
    const router = koarouter();
    // having two stacked like this is intentional and allows for optional params
    // secondly this is a get that is actually a post cuz you can't have a body with a get
    /**
     * @swagger
     * /healthcheck/heartbeat:
     *   get:
     *     x-name: heartbeat
     *     description: heart beat
     *     operationId: heartbeat
     *     responses:
     *       200:
     *         description: Success
     *         schema:
     *                type: string
     *       422:
     *         description: Failure
     *       500:
     *         description: Failure
     */
    router.get(
      '/healthcheck/heartbeat',
      controllers.healthCheckController.heartBeat,
    );
    /**
     * @swagger
     * /healthcheck/systemsup:
     *   get:
     *     x-name: systemsup
     *     description: systems up
     *     operationId: systemsup
     *     responses:
     *       200:
     *         description: Success
     *         schema:
     *                type: string
     *       422:
     *         description: Failure
     *       500:
     *         description: Failure
     *         schema:
     *           type: string
     */
    router.get(
      '/healthcheck/systemsup',
      controllers.healthCheckController.systemsUp,
    );

    appRouter.use(router.routes(), router.allowedMethods());
  };
};
