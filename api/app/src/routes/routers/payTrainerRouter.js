module.exports = function payTrainerRouter(koarouter, controllers) {
  return function(appRouter) {
    const router = koarouter();
    /**
     * @swagger
     * /fetchVerifiedAppointments/{trainerId}:
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
     *           $ref: "#/definitions/trainersResponse"
     */
    router.get('/fetchVerifiedAppointments/:trainerId',
      controllers.payTrainerController.fetchVerifiedAppointments);

    appRouter.use(router.routes(), router.allowedMethods());
  };
};
