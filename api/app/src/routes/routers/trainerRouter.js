module.exports = function trainerRouter(koarouter, controllers) {
  return function(appRouter) {
    const router = koarouter();

    /**
     * @swagger
     * /fetchTrainers:
     *   get:
     *     x-name: fetchTrainers
     *     description: retrieve trainers
     *     operationId: fetchTrainers
     *     responses:
     *       200:
     *         description: Success
     *         schema:
     *           $ref: "#/definitions/trainersResponse"
     */
    router.get('/fetchTrainers', controllers.trainerListController.fetchTrainers);
    /**
     * @swagger
     * /fetchAllTrainers:
     *   get:
     *     x-name: fetchAllTrainers
     *     description: retrieve all trainers
     *     operationId: fetchAllTrainers
     *     responses:
     *       200:
     *         description: Success
     *         schema:
     *           $ref: "#/definitions/trainersResponse"
     */
    router.get('/fetchAllTrainers', controllers.trainerListController.fetchAllTrainers);
    /**
     * @swagger
     * /trainer/hireTrainer:
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
     */
    router.post('/trainer/hireTrainer', controllers.trainerController.hireTrainer);
    /**
     * @swagger
     * /trainer/updateTrainerInfo:
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
     *
     */
    router.post('/trainer/updateTrainerInfo', controllers.trainerController.updateTrainerInfo);
    /**
     * @swagger
     * /trainer/updateTrainerContact:
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
     */
    router.post('/trainer/updateTrainerContact', controllers.trainerController.updateTrainerContact);
    /**
     * @swagger
     * /trainer/updateTrainerAddress:
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
     */
    router.post('/trainer/updateTrainerAddress', controllers.trainerController.updateTrainerAddress);
    /**
     * @swagger
     * /trainer/updateTrainerPassword:
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
     */
    router.post('/trainer/updateTrainerPassword', controllers.trainerController.updateTrainerPassword);
    /**
     * @swagger
     * /trainer/updateTrainersClients:
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
     */
    router.post('/trainer/updateTrainersClients', controllers.trainerController.updateTrainersClients);
    /**
     * @swagger
     * /trainer/updateTrainersClientRates:
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
     */
    router.post('/trainer/updateTrainersClientRates', controllers.trainerController.updateTrainersClientRates);
    /**
     * @swagger
     * /trainer/getTrainer/{id}:
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
     */
    router.get('/trainer/getTrainer/:id', controllers.trainerController.getTrainer);
    /**
     * @swagger
     * /trainer/archiveTrainer:
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
     */
    router.post('/trainer/archiveTrainer', controllers.trainerController.archiveTrainer);

    appRouter.use(router.routes(), router.allowedMethods());
  };
};
