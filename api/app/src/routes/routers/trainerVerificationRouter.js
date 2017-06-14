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
      controllers.trainerVerificationController.fetchUnverifiedAppointments);
    /**
     * @swagger
     * /verifyAppointments:
     *   post:
     *     x-name: verifyAppointments
     *     description: verifyAppointments
     *     operationId: verifyAppointments
     *     parameters:
     *       - name: body
     *         in: body
     *         required: true
     *         schema:
     *           $ref: "#/definitions/verifyAppointments"
     *     responses:
     *       200:
     *         description: Success
     *         schema:
     *             $ref: "#/definitions/standardSuccessResponse"
     *       422:
     *         description: Failure
     *         schema:
     *             $ref: "#/definitions/standardFailureResponse"
     */
    router.get('/verifyAppointments',
      controllers.trainerVerificationController.verifyAppointments);


    appRouter.use(router.routes(), router.allowedMethods());
  };
};
