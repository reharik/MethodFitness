module.exports = function purchasesRouter(koarouter, controllers) {
  return function(appRouter) {
    const router = koarouter();

    /**
     * @swagger
     * /purchase/purchase:
     *   post:
     *     x-name: /purchase/purchase
     *     description: purchase sessions for a client
     *     operationId: /purchase/purchase
     *     parameters:
     *       - name: body
     *         in: body
     *         required: true
     *         schema:
     *           $ref: "#/definitions/purchase"
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
     *
     */
    router.post('/purchase/purchase', controllers.purchaseController.purchase);
    /**
     * @swagger
     * /purchase/updatepurchase:
     *   post:
     *     x-name: /purchase/updatePurchase
     *     description: update session purchase for client
     *     operationId: /purchase/updatePurchase
     *     parameters:
     *       - name: body
     *         in: body
     *         required: true
     *         schema:
     *           $ref: "#/definitions/updatePurchase"
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
    router.post('/purchase/updatepurchase', controllers.purchaseController.updatePurchase);
    /**
     * @swagger
     * /purchase/fetchpurchase/{id}:
     *   get:
     *     x-name: trainer
     *     description: retrieve single trainer by id
     *     operationId: purchase/fetchPurchase/{id}
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: The id of the session purchase
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
    router.get('/purchase/fetchpurchase/:id', controllers.purchaseController.fetchPurchase);
    /**
     * @swagger
     * /purchaselist/fetchpurchases/{clientId}:
     *   get:
     *     x-name: /purchaseList/fetchPurchases
     *     description: retrieve clients purchases
     *     operationId: fetchClientsPurchases
     *     parameters:
     *       - name: clientId
     *         in: path
     *         required: true
     *         description: The id of the client whose purchase we are getting
     *         type: string
     *     responses:
     *       200:
     *         description: Success
     *         schema:
     *           $ref: "#/definitions/purchasesResponse"
     *       422:
     *         description: Failure
     *         schema:
     *             $ref: "#/definitions/standardFailureResponse"
     *       500:
     *         description: Failure
     *         schema:
     *             $ref: "#/definitions/standardFailureResponse"
     */
    router.get('/purchaselist/fetchpurchases/:clientId', controllers.purchaseListController.fetchPurchases);

    /**
     * @swagger
     * /purchase/refundsessions:
     *   post:
     *     x-name: /purchase/refundsessions
     *     description: refund sessions
     *     operationId: refundsessions
     *     parameters:
     *       - name: body
     *         in: body
     *         required: true
     *         schema:
     *           $ref: "#/definitions/refundSessions"
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
    router.post('/purchase/refundsessions', controllers.purchaseController.refundSessions);

    appRouter.use(router.routes(), router.allowedMethods());
  };
};
