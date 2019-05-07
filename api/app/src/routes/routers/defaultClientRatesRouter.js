module.exports = function locationRouter(koarouter, controllers) {
  return function(appRouter) {
    const router = koarouter();

    /**
     * @swagger
     * /defaultclientrates/updatedefaultclientrates:
     *   post:
     *     x-name: defaultclientrates/updatedefaultclientrates
     *     description: update Default Client Rates
     *     operationId: /defaultclientrates/updatedefaultclientrates
     *     parameters:
     *       - name: body
     *         in: body
     *         required: true
     *         schema:
     *           $ref: "#/definitions/updateClientRates"
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
    router.post(
      '/defaultclientrates/updatedefaultclientrates',
      controllers.defaultClientRatesController.updateDefaultClientRates,
    );
    /**
     * @swagger
     * /defaultclientrates/getdefaultclientrates:
     *   get:
     *     x-name: defaultClientRates
     *     description: retrieve default client rates
     *     operationId: defaultclientrates/getdefaultclientrates
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
    router.get(
      '/defaultclientrates/getdefaultclientrates',
      controllers.defaultClientRatesController.getDefaultClientRates,
    );

    appRouter.use(router.routes(), router.allowedMethods());
  };
};
