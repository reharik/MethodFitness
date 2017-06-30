module.exports = function payTrainerRouter(koarouter, controllers) {
  return function(appRouter) {
    const router = koarouter();
    /**
     * @swagger
     * /scheduledjobs/appointmentstatusupdate:
     *   get:
     *     x-name: appointmentStatusUpdate
     *     description: appointmentStatusUpdate
     *     operationId: appointmentStatusUpdate
     *     parameters:
     *       - name: body
     *         in: body
     *         required: true
     *         schema:
     *           $ref: "#/definitions/appointmentStatusUpdate"
     *     responses:
     *       200:
     *         description: Success
     *         schema:
     *           $ref: "#/definitions/standardSuccessResponse"
     *       422:
     *         description: Failure
     *         schema:
     *             $ref: "#/definitions/standardFailureResponse"
     *       500:
     *         description: Failure
     *         schema:
     *             $ref: "#/definitions/standardFailureResponse"
     */
    router.get('/scheduledjobs/appointmentstatusupdate',
      controllers.scheduledjobsController.appointmentstatusupdate);
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
     *           $ref: "#/definitions/payTrainer"
     *     responses:
     *       200:
     *         description: Success
     *         schema:
     *             $ref: "#/definitions/standardSuccessResponse"
     *       422:
     *         description: Failure
     *         schema:
     *             $ref: "#/definitions/standardFailureResponse"
     *       500:
     *         description: Failure
     *         schema:
     *             $ref: "#/definitions/standardFailureResponse"
     */
    router.post('/paytrainer/:trainerId',
      controllers.payTrainerController.payTrainer);

    appRouter.use(router.routes(), router.allowedMethods());
  };
};
