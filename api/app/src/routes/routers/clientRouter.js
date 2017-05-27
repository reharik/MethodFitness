module.exports = function clientRouter(koarouter, controllers) {
  return function(appRouter) {
    const router = koarouter();

    /**
     * @swagger
     * /fetchClients:
     *   get:
     *     x-name: fetchClients
     *     description: retrieve clients
     *     operationId: fetchClients
     *     responses:
     *       200:
     *         description: Success
     *         schema:
     *           $ref: "#/definitions/clientsResponse"
     */
    router.get('/fetchClients', controllers.clientListController.fetchClients);
    /**
     * @swagger
     * /fetchAllClients:
     *   get:
     *     x-name: fetchAllClients
     *     description: retrieve all clients
     *     operationId: fetchAllClients
     *     responses:
     *       200:
     *         description: Success
     *         schema:
     *           $ref: "#/definitions/clientsResponse"
     */
    router.get('/fetchAllClients', controllers.clientListController.fetchAllClients);
    /**
     * @swagger
     * /client/addClient:
     *   post:
     *     x-name: /client/addClient
     *     description: add client
     *     operationId: /client/addClient
     *     parameters:
     *       - name: body
     *         in: body
     *         required: true
     *         schema:
     *           $ref: "#/definitions/client"
     *     responses:
     *       200:
     *         description: Success
     *         schema:
     *             $ref: "#/definitions/standardSuccessResponse"
     *       422:
     *         description: Failure
     *         schema:
     *             $ref: "#/definitions/standardFailureResponse"
     *
     */
    router.post('/client/addClient', controllers.clientController.addClient);
    /**
     * @swagger
     * /client/updateClientInfo:
     *   post:
     *     x-name: /client/updateClientInfo
     *     description: update Client Info
     *     operationId: /client/updateClientInfo
     *     parameters:
     *       - name: body
     *         in: body
     *         required: true
     *         schema:
     *           $ref: "#/definitions/updateClientInfo"
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
    router.post('/client/updateClientInfo', controllers.clientController.updateClientInfo);
    /**
     * @swagger
     * /client/updateClientSource:
     *   post:
     *     x-name: /client/updateClientSource
     *     description: update Client Source
     *     operationId: /client/updateClientSource
     *     parameters:
     *       - name: body
     *         in: body
     *         required: true
     *         schema:
     *           $ref: "#/definitions/updateClientSource"
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
    router.post('/client/updateClientSource', controllers.clientController.updateClientSource);
    /**
     * @swagger
     * /client/updateClientContact:
     *   post:
     *     x-name: /client/updateClientContact
     *     description: update Client Contact
     *     operationId: /client/updateClientContact
     *     parameters:
     *       - name: body
     *         in: body
     *         required: true
     *         schema:
     *           $ref: "#/definitions/updateClientContact"
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
    router.post('/client/updateClientContact', controllers.clientController.updateClientContact);
    /**
     * @swagger
     * /client/updateClientAddress:
     *   post:
     *     x-name: /client/updateClientAddress
     *     description: update Client Address
     *     operationId: /client/updateClientAddress
     *     parameters:
     *       - name: body
     *         in: body
     *         required: true
     *         schema:
     *           $ref: "#/definitions/updateClientAddress"
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
    router.post('/client/updateClientAddress', controllers.clientController.updateClientAddress);
    /**
     * @swagger
     * /client/getClient/{id}:
     *   get:
     *     x-name: client
     *     description: retrieve single client by id
     *     operationId: client
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: The client id
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
     */
    router.get('/client/getClient/:id', controllers.clientController.getClient);
    /**
     * @swagger
     * /client/archiveClient:
     *   post:
     *     x-name: /client/archiveClient
     *     description: archive Client
     *     operationId: /client/archiveClient
     *     parameters:
     *       - name: body
     *         in: body
     *         required: true
     *         schema:
     *           $ref: "#/definitions/archiveClient"
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
    router.post('/client/archiveClient', controllers.clientController.archiveClient);

    appRouter.use(router.routes(), router.allowedMethods());
  };
};
