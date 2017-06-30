module.exports = function payTrainerRouter(koarouter, controllers) {
  return function(appRouter) {
    const router = koarouter();
    /**
     * @swagger
     * /scheduledjobs/appointmentstatusupdate:
     *   post:
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
    router.post('/scheduledjobs/appointmentstatusupdate',
      controllers.scheduledjobsController.appointmentstatusupdate);
    appRouter.use(router.routes(), router.allowedMethods());
  };
};
