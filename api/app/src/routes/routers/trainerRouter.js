module.exports = function trainerRouter(koarouter, controllers) {
  return function(appRouter) {
    const router = koarouter();

    /**
     * @swagger
     * /fetchtrainers:
     *   get:
     *     x-name: fetchTrainers
     *     description: retrieve trainers
     *     operationId: fetchTrainers
     *     responses:
     *       200:
     *         description: Success
     *         schema:
     *           $ref: "#/definitions/trainersResponse"
     *       422:
     *         description: Failure
     *         schema:
     *             $ref: "#/definitions/standardFailureResponse"
     *       500:
     *         description: Failure
     *         schema:
     *             $ref: "#/definitions/standardFailureResponse"
     */
    router.get('/fetchtrainers', controllers.trainerListController.fetchTrainers);
    /**
     * @swagger
     * /fetchalltrainers:
     *   get:
     *     x-name: fetchAllTrainers
     *     description: retrieve all trainers
     *     operationId: fetchAllTrainers
     *     responses:
     *       200:
     *         description: Success
     *         schema:
     *           $ref: "#/definitions/trainersResponse"
     *       422:
     *         description: Failure
     *         schema:
     *             $ref: "#/definitions/standardFailureResponse"
     *       500:
     *         description: Failure
     *         schema:
     *             $ref: "#/definitions/standardFailureResponse"
     */
    router.get('/fetchalltrainers', controllers.trainerListController.fetchAllTrainers);
    /**
     * @swagger
     * /trainer/hiretrainer:
     *   post:
     *     x-name: /trainer/hireTrainer
     *     description: hire trainer
     *     operationId: /trainer/hireTrainer
     *     parameters:
     *       - name: body
     *         in: body
     *         required: true
     *         schema:
     *           $ref: "#/definitions/trainer"
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
    router.post('/trainer/hiretrainer', controllers.trainerController.hireTrainer);
    /**
     * @swagger
     * /trainer/updatetrainerinfo:
     *   post:
     *     x-name: /trainer/updateTrainerInfo
     *     description: update Trainer Info
     *     operationId: /trainer/updateTrainerInfo
     *     parameters:
     *       - name: body
     *         in: body
     *         required: true
     *         schema:
     *           $ref: "#/definitions/updateTrainerInfo"
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
    router.post('/trainer/updatetrainerinfo', controllers.trainerController.updateTrainerInfo);
    /**
     * @swagger
     * /trainer/updatetrainercontact:
     *   post:
     *     x-name: /trainer/updateTrainerContact
     *     description: update Trainer Contact
     *     operationId: /trainer/updateTrainerContact
     *     parameters:
     *       - name: body
     *         in: body
     *         required: true
     *         schema:
     *           $ref: "#/definitions/updateTrainerContact"
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
    router.post('/trainer/updatetrainercontact', controllers.trainerController.updateTrainerContact);
    /**
     * @swagger
     * /trainer/updatetraineraddress:
     *   post:
     *     x-name: /trainer/updateTrainerAddress
     *     description: update Trainer Address
     *     operationId: /trainer/updateTrainerAddress
     *     parameters:
     *       - name: body
     *         in: body
     *         required: true
     *         schema:
     *           $ref: "#/definitions/updateTrainerAddress"
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
    router.post('/trainer/updatetraineraddress', controllers.trainerController.updateTrainerAddress);
    /**
     * @swagger
     * /trainer/updatetrainerpassword:
     *   post:
     *     x-name: /trainer/updateTrainerPassword
     *     description: update Trainer Password
     *     operationId: /trainer/updateTrainerPassword
     *     parameters:
     *       - name: body
     *         in: body
     *         required: true
     *         schema:
     *           $ref: "#/definitions/updateTrainerPassword"
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
    router.post('/trainer/updatetrainerpassword', controllers.trainerController.updateTrainerPassword);
    /**
     * @swagger
     * /trainer/updatetrainersclients:
     *   post:
     *     x-name: /trainer/updateTrainersClients
     *     description: update Trainers Clients
     *     operationId: /trainer/updateTrainersClients
     *     parameters:
     *       - name: body
     *         in: body
     *         required: true
     *         schema:
     *           $ref: "#/definitions/updateTrainersClients"
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
    router.post('/trainer/updatetrainersclients', controllers.trainerController.updateTrainersClients);
    /**
     * @swagger
     * /trainer/updatetrainersclientrates:
     *   post:
     *     x-name: /trainer/updateTrainersClientRates
     *     description: update Trainers Client Rates
     *     operationId: /trainer/updateTrainersClientRates
     *     parameters:
     *       - name: body
     *         in: body
     *         required: true
     *         schema:
     *           $ref: "#/definitions/updateTrainersClientRates"
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
    router.post('/trainer/updatetrainersclientrates', controllers.trainerController.updateTrainersClientRates);
    /**
     * @swagger
     * /trainer/gettrainer/{id}:
     *   get:
     *     x-name: trainer
     *     description: retrieve single trainer by id
     *     operationId: trainer
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: The trainers id
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
    router.get('/trainer/gettrainer/:id', controllers.trainerController.getTrainer);
    /**
     * @swagger
     * /trainer/archivetrainer:
     *   post:
     *     x-name: /trainer/archiveTrainer
     *     description: archive Trainer
     *     operationId: /trainer/archiveTrainer
     *     parameters:
     *       - name: body
     *         in: body
     *         required: true
     *         schema:
     *           $ref: "#/definitions/archiveTrainer"
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
    router.post('/trainer/archivetrainer', controllers.trainerController.archiveTrainer);

    appRouter.use(router.routes(), router.allowedMethods());
  };
};
