module.exports = function trainerRouter(koarouter, controllers) {
  return function(appRouter) {
    const router = koarouter();

    /**
     * @swagger
     * /fetchUnverifiedAppointments:
     *   get:
     *     x-name: fetchUnverifiedAppointments
     *     description: fetchUnverifiedAppointments
     *     operationId: fetchUnverifiedAppointments
     *     responses:
     *       200:
     *         description: Success
     *         schema:
     *           $ref: "#/definitions/trainersResponse"
     */
    router.get('/fetchUnverifiedAppointments',
      controllers.trainerVerificationListController.fetchUnverifiedAppointments);

    appRouter.use(router.routes(), router.allowedMethods());
  };
};
