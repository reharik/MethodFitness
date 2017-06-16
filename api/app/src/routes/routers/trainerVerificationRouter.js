module.exports = function trainerRouter(koarouter, controllers) {
  return function(appRouter) {
    const router = koarouter();
    /**
     * @swagger
     * /trainerverification/fetchunverifiedappointments:
     *   get:
     *     x-name: fetchUnverifiedAppointments
     *     description: fetchUnverifiedAppointments
     *     operationId: fetchUnverifiedAppointments
     *     responses:
     *       200:
     *         description: Success
     *         schema:
     *           $ref: "#/definitions/sessionManagement"
     */
    router.get('/trainerverification/fetchunverifiedappointments',
      controllers.trainerVerificationController.fetchUnverifiedAppointments);
    /**
     * @swagger
     * /trainerverification/verifyappointments:
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
    router.post('/trainerverification/verifyappointments',
      controllers.trainerVerificationController.verifyAppointments);


    appRouter.use(router.routes(), router.allowedMethods());
  };
};
