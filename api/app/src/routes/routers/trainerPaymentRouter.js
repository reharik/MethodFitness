module.exports = function trainerRouter(koarouter, controllers) {
  return function(appRouter) {
    const router = koarouter();
    /**
     * @swagger
     * /trainerpayments/{trainerId}:
     *   get:
     *     x-name: trainerPayments
     *     description: retrieve trainer payments by trainer ID
     *     operationId: trainerPayments
     *     parameters:
     *       - name: trainerId
     *         in: path
     *         description: The trainer Id
     *         required: true
     *         type: string
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
      '/trainerpayments/:trainerId?',
      controllers.trainerPaymentListController.fetchTrainerPayments,
    );
    /**
     * @swagger
     * /trainerpaymentdetails/{paymentId}:
     *   get:
     *     x-name: trainerPaymentDetails
     *     description: retrieve trainer payment details by payment Id
     *     operationId: trainerPaymentDetails
     *     parameters:
     *       - name: paymentId
     *         in: path
     *         description: The payment Id
     *         required: true
     *         type: string
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
    /**
     * @swagger
     * /trainerpaymentdetails/{paymentId}/{trainerId}:
     *   get:
     *     x-name: trainerPaymentDetails
     *     description: retrieve trainer payment details by payment Id
     *     operationId: trainerPaymentDetails
     *     parameters:
     *       - name: paymentId
     *         in: path
     *         description: The payment Id
     *         required: true
     *         type: string
     *       - name: trainerId
     *         in: path
     *         description: The trainer Id
     *         required: true
     *         type: string
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
      '/trainerpaymentdetails/:paymentId/:trainerId?',
      controllers.trainerPaymentListController.fetchTrainerPaymentDetails,
    );

    appRouter.use(router.routes(), router.allowedMethods());
  };
};
