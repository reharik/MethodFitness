module.exports = function trainerRouter(koarouter, controllers) {
  return function(appRouter) {
    const router = koarouter();

    /**
     * @swagger
     * /trainerpayments:
     *   get:
     *     x-name: trainerPayments
     *     description: retrieve trainer payments by trainer ID
     *     operationId: trainerPayments
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
    router.get(
      '/trainerpayments',
      controllers.trainerPaymentListController.fetchTrainerPayments,
    );
    /**
     * @swagger
     * /trainerpaymentdetails/{paymentId}:
     *   get:
     *     x-name: trainerPaymentDetails
     *     description: retrieve trainer payment details by payment Id
     *     operationId: trainerPaymentDetails
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
    router.get(
      '/trainerpaymentdetails/:paymentId',
      controllers.trainerPaymentListController.fetchTrainerPaymentDetails,
    );

    appRouter.use(router.routes(), router.allowedMethods());
  };
};
