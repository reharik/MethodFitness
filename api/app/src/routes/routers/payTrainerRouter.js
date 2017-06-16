module.exports = function payTrainerRouter(koarouter, controllers) {
  return function(appRouter) {
    const router = koarouter();
    /**
     * @swagger
     * /paytrainer/fetchverifiedappointments/{trainerId}:
     *   get:
     *     x-name: fetchVerifiedAppointments
     *     description: fetchVerifiedAppointments
     *     operationId: fetchVerifiedAppointments
     *     parameters:
     *       - name: trainerId
     *         in: path
     *         required: false
     *         description: the trainer id for whom to retrieve appointments
     *         type: string
     *     responses:
     *       200:
     *         description: Success
     *         schema:
     *           $ref: "#/definitions/sessionManagement"
     */
    router.get('/paytrainer/fetchverifiedappointments/:trainerId',
      controllers.payTrainerController.fetchVerifiedAppointments);
    /**
     * @swagger
     * /paytrainer/{trainerId}:
     *   post:
     *     x-name: payTrainer
     *     description: payTrainer
     *     operationId: payTrainer
     *     parameters:
     *       - name: trainerId
     *         in: path
     *         required: false
     *         description: the trainer id to pay
     *         type: string
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
    router.post('/paytrainer/:trainerId',
      controllers.payTrainerController.payTrainer);

    appRouter.use(router.routes(), router.allowedMethods());
  };
};
